import { Global, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CryptService } from '@common/services/crypt';
import { UserService } from './user.service';
import { AuthenticationService } from '@modules/authentication/services';

const Services: Provider[] = [UserService, AuthenticationService];

const jwtModule = JwtModule.registerAsync({
  useFactory: async () => {
    return {
      secret: process.env.SECRET || '12345',
      signOptions: {
        expiresIn: '7d',
        noTimestamp: false,
      },
    };
  },
});

@Global()
@Module({
  imports: [jwtModule],
  providers: [CryptService, ...Services],
  exports: [CryptService, jwtModule, ...Services],
})
export class ServicesModule {}
