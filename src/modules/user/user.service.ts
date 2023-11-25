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
  InputUsers,
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
import { NotificationsService } from '@modules/notifications/notifications.service';
import { MENTOR_CYCLE_LOGO_URL } from '@common/config/constants';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly cryptService: CryptService,
    private readonly mailService: MailService,
    private readonly temporaryCodeRepository: TemporaryCodeRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async me(token: string) {
    const decoded = this.jwtService.decode(token) as JWTProps;
    if (!decoded || !decoded.email) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return this.userRepository.getByEmail(decoded.email);
  }

  async findMentors(input: FindMentorInput) {
    return this.userRepository.findManyMentors(
      this.returnTypesFromQuery(input),
    );
  }

  async getAllUsers(input: InputUsers) {
    return this.userRepository.findManyUsers(this.returnTypesFromQuery(input));
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

  async updateUserPhotoUrl(userId: string, photoUrl: string): Promise<void> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NotFoundError({
        field: 'user',
      });
    }
    await this.userRepository.update({ photoUrl }, { id: userId });
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

    const isUserProfileComplete = this.checkIfUserProfileIsComplete(user);

    if (isUserProfileComplete) {
      await this.notificationsService.create({
        description: 'Parabéns, seu perfil está completo!',
        imageUrl: user.photoUrl || MENTOR_CYCLE_LOGO_URL,
        title: 'Perfil completo',
        notifierId: null,
        usersIds: [user.id],
      });
    }

    delete user.password;
    return user;
  }

  checkIfUserProfileIsComplete(user: User) {
    const requiredFields = [
      user.lastName,
      user.isVerified,
      user.isTermsAccepted,
      user.onBoardingCompleted,
      user.birthDate,
      user.country,
      user.state,
      user.city,
      user.linkedin,
      user.github,
      user.experience,
      user.description,
      user.jobTitle,
      user.jobCompany,
      user.biography,
      user.active,
      user.skills,
    ];

    return requiredFields.every((field) => {
      if (Array.isArray(field)) {
        return field.length > 0;
      }

      switch (typeof field) {
        case 'boolean':
          return field;

        default:
          return field !== null && field !== '';
      }
    });
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

  private returnTypesFromQuery(input: InputUsers | FindMentorInput) {
    let args = Object.values(input).length && input;
    if (input.pageNumber && input.pageSize) {
      args = {
        ...args,
        skip: (input.pageNumber - 1) * input.pageSize,
        take: input.pageSize,
      };
    }
    return args;
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

  async isValidToken(token: string): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verify(token, {
        secret: process.env.SECRET,
      });
      return !!decoded.email;
    } catch (error) {
      return false;
    }
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

  private async createUser(args: CreateUserInput) {
    const user = await this.userRepository.create(args);

    await this.notificationsService.create({
      description:
        'Obrigado por realizar o seu cadastro em nossa plataforma, aproveite e complete o seu perfil!',
      imageUrl: user.photoUrl || MENTOR_CYCLE_LOGO_URL,
      title: 'Complete o seu perfil',
      notifierId: null,
      usersIds: [user.id],
    });

    return user;
  }

  private updateUser(updateUserObj: UpdateUserDto) {
    const { password, id, ...dataFromUserToBeUpdated } = updateUserObj;

    return this.userRepository.update(dataFromUserToBeUpdated, { id });
  }
}
