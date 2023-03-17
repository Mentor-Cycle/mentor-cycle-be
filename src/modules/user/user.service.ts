import { User } from '@modules/prisma';
import { Injectable } from '@nestjs/common';
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
  PasswordChangedDto,
  CheckPinUserDto,
  ResetPasswordSentDto,
} from './dto';
import { UserRepository } from './user.repository';
import {
  passwordResetEmailProps,
  updatePasswordConfirmationProps,
} from '@providers/mails';
import { reverseString } from '@common/utils/string';
import { TemporaryCodeRepository } from './temporary-code.repository';
import { MailService } from '@common/services/mail';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly cryptService: CryptService,
    private readonly mailService: MailService,
    private readonly temporaryCodeRepository: TemporaryCodeRepository,
  ) {}

  async signIn(input: SignInUserDto, expiresSession: number) {
    const { email, password } = input;

    const findUser = await this.userRepository.getByEmail(email);

    if (!findUser) {
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

    this.sendPasswordChanged({
      email: findUser.email,
      firstName: findUser.firstName,
    });

    if (temporaryCodeInfo) {
      await this.temporaryCodeRepository.delete({ id: temporaryCodeInfo.id });
    }

    return true;
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

  private async sendPasswordChanged(input: PasswordChangedDto) {
    const { firstName, email } = input;
    this.mailService.sendMail({
      to: {
        name: firstName,
        email,
      },
      ...updatePasswordConfirmationProps({
        fname: firstName,
      }),
    });
  }

  // private async sendMagicLink(input: MagicLinkSentDto) {
  //   return this.eventBus.publish(new MagicLinkSentEvent(input));
  // }

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

  private generateToken(user: User, expiresSession?: number) {
    console.log(Date.now() + expiresSession);
    return this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        role: 'USER',
      },
      {
        subject: user.id,
        secret: process.env.SECRET,
        expiresIn: Date.now() + expiresSession,
      },
    );
  }

  private async resetPasswordSent(input: ResetPasswordSentDto) {
    const { email, firstName, pin } = input;
    this.mailService.sendMail({
      to: {
        name: firstName,
        email,
      },
      ...passwordResetEmailProps({
        fname: firstName,
        pin,
      }),
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
}
