import { User } from '@modules/prisma';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { slug } from 'cuid';
import { JwtService } from '@nestjs/jwt';
import {
  AuthInvalidError,
  NotFoundError,
  ObjectAlreadyExistsError,
  TemporaryCodeInvalidError,
} from '@common/errors';
import { CryptService } from '@common/services/crypt';
import {
  SignInUserDto,
  CreateUserInput,
  ResetPasswordUserDto,
  CheckPinUserDto,
  ResetPasswordSentDto,
  UpdateUserDto,
} from './dto';
import { UserRepository } from './user.repository';
import { passwordResetEmailProps } from '@providers/mails';
import { reverseString } from '@common/utils/string';
import { TemporaryCodeRepository } from './temporary-code.repository';
import { MailService } from '@common/services/mail';
import { FindMentorInput } from './dto/find-mentor.dto';
import { JWTProps } from './types';
import { render } from '@react-email/components';
import ResetPassword from '../../../emails/reset-password';
import { ChangePasswordInputDto } from './dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly cryptService: CryptService,
    private readonly mailService: MailService,
    private readonly temporaryCodeRepository: TemporaryCodeRepository,
  ) {}

  async me(token: string) {
    const decoded = this.jwtService.decode(token) as JWTProps;
    if (!decoded || !decoded.email) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return this.userRepository.getByEmail(decoded.email);
  }

  async findMentors(input: FindMentorInput) {
    let args = Object.values(input).length && input;
    if (input.pageNumber && input.pageSize) {
      args = {
        ...args,
        skip: (input.pageNumber - 1) * input.pageSize,
        take: input.pageSize,
      };
    }
    return this.userRepository.findManyMentors(args);
  }

  async signIn(input: SignInUserDto, expiresSession: number) {
    const { email, password } = input;

    const findUser = await this.userRepository.getByEmail(email);

    if (!findUser || !findUser.active) {
      throw new AuthInvalidError({ field: 'email' });
    }

    const isPasswordCorrect = await this.cryptService.compare(
      password,
      findUser.password as string,
    );

    if (!isPasswordCorrect) {
      throw new AuthInvalidError({ field: 'password' });
    }

    const generateToken = this.generateToken(findUser, expiresSession);

    return { token: generateToken, user: findUser };
  }

  async signUpUser(args: CreateUserInput) {
    const countedUsers = await this.userRepository.count({ email: args.email });

    if (countedUsers) {
      throw new ObjectAlreadyExistsError({
        objectType: 'User',
        field: 'email',
      });
    }

    args.password = await this.cryptService.encrypt(args.password);
    const user = await this.createUser(args);

    const token = this.generateToken(user);

    delete user.password;

    return { user, token };
  }

  async resetPasswordUser(userInput: ResetPasswordUserDto) {
    const { email, pin, newPassword } = userInput;
    await this.checkPinUser({ email, pin });

    const findUser = await this.userRepository.getByEmail(email);

    if (!findUser) {
      throw new NotFoundError({
        field: 'user',
      });
    }
    const password = await this.cryptService.encrypt(newPassword);

    const temporaryCodeInfo = await this.temporaryCodeRepository.getOne({
      where: {
        temporarycode: pin,
        isPin: true,
        email,
        userId: findUser.id,
      },
      select: {
        id: true,
      },
    });

    await this.userRepository.update({ password }, { id: findUser.id });

    if (temporaryCodeInfo) {
      await this.temporaryCodeRepository.delete({ id: temporaryCodeInfo.id });
    }

    return true;
  }

  async changePassword(
    changePasswordInput: ChangePasswordInputDto,
    expiresSession: number,
  ) {
    const { userId, newPassword } = changePasswordInput;
    const findUser = await this.userRepository.getById(userId);
    if (!findUser) {
      throw new NotFoundError({
        field: 'user',
      });
    }
    const password = await this.cryptService.encrypt(newPassword);
    await this.userRepository.update({ password }, { id: userId });
    const generateToken = this.generateToken(findUser, expiresSession);
    return { token: generateToken, user: findUser };
  }

  async updateUserData(userData: UpdateUserDto) {
    const user = await this.updateUser(userData);
    delete user.password;
    return user;
  }
  private async checkPinUser(input: CheckPinUserDto) {
    const { email, pin } = input;

    const foundUser = await this.userRepository.getByEmail(email);

    if (!foundUser) {
      throw new NotFoundError({
        field: 'user',
      });
    }

    const foundTemporaryCodeInfo = await this.temporaryCodeRepository.getOne({
      where: {
        temporarycode: pin,
        isPin: true,
        email,
        userId: foundUser.id,
      },
    });

    if (!foundTemporaryCodeInfo) {
      throw new TemporaryCodeInvalidError({
        type: 'pin',
      });
    }

    return true;
  }

  async sendResetPassword(email: string) {
    const findUser = await this.userRepository.getByEmail(email);
    const { firstName } = findUser;

    const pin = Math.floor(Math.random() * 1e10)
      .toString()
      .slice(0, 4);

    await this.temporaryCodeRepository.deleteMany({
      email,
      userId: findUser.id,
      isPin: true,
    });

    await this.temporaryCodeRepository.create({
      email,
      user: {
        connect: {
          id: findUser.id,
        },
      },
      temporarycode: pin,
      isPin: true,
    });

    await this.resetPasswordSent({ email, firstName, pin });

    return true;
  }

  async deactivateAccount(id: string) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundError({
        field: 'user',
      });
    }
    await this.userRepository.update({ active: false }, { id });
    return true;
  }

  private generateToken(user: User, expiresSession = 0) {
    return this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        role: user.isMentor ? 'MENTOR' : 'USER',
      },
      {
        subject: user.id,
        secret: process.env.SECRET,
        expiresIn: Date.now() + expiresSession,
      },
    );
  }

  async findOneMentor(id: string) {
    return this.userRepository.findOneMentor(id);
  }

  private async resetPasswordSent(input: ResetPasswordSentDto) {
    const { email, firstName: name, pin } = input;
    const redirectUrl = `${process.env.FRONTEND_URL}/change-password?email=${email}&pin=${pin}`;
    const html = render(ResetPassword({ name, redirectUrl }));
    this.mailService.sendMail({
      to: {
        name,
        email,
      },
      ...passwordResetEmailProps(html),
    });
  }

  private generateLoginCode() {
    return `${slug()}-${reverseString(slug())}-${reverseString(
      slug(),
    )}`.replace(/[0-9]/g, '');
  }

  private createUser(args: CreateUserInput) {
    return this.userRepository.create(args);
  }

  private updateUser(updateUserObj: UpdateUserDto) {
    const { password, isMentor, id, ...dataFromUserToBeUpdated } =
      updateUserObj;

    return this.userRepository.update(dataFromUserToBeUpdated, { id });
  }
}
