import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './controllers';
import { AuthenticationService } from './services';
import { GoogleStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.SECRET || 'secret123',
          signOptions: {
            expiresIn: '7d',
            noTimestamp: false,
          },
        };
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, GoogleStrategy],
})
export class AuthenticationModule {}
