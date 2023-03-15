import { PrismaService } from './../prisma/prisma.service';
import { CryptService } from '@common/services/crypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { MailService } from '@common/services/mail';
import { TemporaryCodeRepository } from './temporary-code.repository';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserService,
        UserRepository,
        TemporaryCodeRepository,
        JwtService,
        CryptService,
        MailService,
        PrismaService,
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
