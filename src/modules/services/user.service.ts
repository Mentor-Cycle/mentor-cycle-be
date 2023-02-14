import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthInvalidError, ObjectAlreadyExistsError } from '@common/errors';
import { CreateUserDto, SignInUserDto } from '@common/dtos';
import { UserRepository } from '@modules/repositories';
import { CryptService } from '@common/services/crypt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly cryptService: CryptService,
  ) {}

  async signIn(input: SignInUserDto) {
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

    const generateToken = this.jwtService.sign(
      {
        id: findUser.id,
        email,
        role: 'USER',
      },
      { subject: findUser.id, secret: process.env.SECRET },
    );

    return { token: generateToken, user: findUser };
  }

  async signUpUser(args: CreateUserDto) {
    const countedUsers = await this.userRepository.count({ email: args.email });

    if (countedUsers) {
      throw new ObjectAlreadyExistsError({
        objectType: 'User',
        field: 'email',
      });
    }

    args.password = await this.cryptService.encrypt(args.password);
    const user = await this.createUser(args);

    const token = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        role: 'USER',
      },
      { subject: user.id, secret: process.env.SECRET },
    );

    return { user, token };
  }

  private createUser(args: CreateUserDto) {
    return this.userRepository.create(args);
  }
}
