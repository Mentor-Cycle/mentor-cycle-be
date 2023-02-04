import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthInvalidError } from '../../common/errors';
import { CreateUserDto, SignInUserDto } from '../../common/dtos';
import { UserRepository } from '../repositories';
import { CryptService } from 'src/common/services/crypt';

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
        role: 'ANALYTICS',
      },
      { subject: findUser.id },
    );

    return { token: generateToken, user: findUser };
  }

  async createUser(args: CreateUserDto) {
    return this.userRepository.create(args);
  }
}
