import { AuthModule } from '@common/auth/auth.module';
import { RootResolver } from './app.resolver';
import { CryptService } from '@common/services/crypt';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from '@modules/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from '@modules/authentication/authentication.module';
import { UserModule } from './modules/user/user.module';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { AuthenticationController } from '@modules/authentication/authentication.controller';
import { AvailabilityModule } from './modules/availability/availability.module';
import { EventModule } from './modules/event/event.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      cors: {
        origin: true,
        credentials: true,
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.SECRET || '12345',
          signOptions: {
            expiresIn: '7d',
            noTimestamp: false,
          },
        };
      },
    }),
    PrismaModule,
    AuthenticationModule,
    UserModule,
    AuthenticationModule,
    AvailabilityModule,
    EventModule,
    AuthModule,
  ],
  controllers: [AppController, AuthenticationController],
  providers: [AppService, CryptService, RootResolver, JwtService],
})
export class AppModule {}
