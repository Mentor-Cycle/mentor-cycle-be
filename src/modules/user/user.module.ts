import { CryptService } from './../../common/services/crypt/crypt.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    JwtService,
    CryptService,
  ],
})
export class UserModule {}
