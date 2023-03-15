import { CryptService } from '@common/services/crypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MailService } from '@common/services/mail';
import { TemporaryCodeRepository } from './temporary-code.repository';

@Module({
  imports: [],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    TemporaryCodeRepository,
    JwtService,
    CryptService,
    MailService,
  ],
})
export class UserModule {}
