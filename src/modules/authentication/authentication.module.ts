import { UserRepository } from '@modules/user/user.repository';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy, LinkedinStrategy } from './strategies';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.SECRET || '12345',
          signOptions: {
            noTimestamp: false,
          },
        };
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    GoogleStrategy,
    LinkedinStrategy,
    UserRepository,
  ],
})
export class AuthenticationModule {}
