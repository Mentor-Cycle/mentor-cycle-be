import { AuthModule } from '@common/auth/auth.module';
import { RootResolver } from './app.resolver';
import { CryptService } from '@common/services/crypt';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from '@modules/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from '@modules/authentication/authentication.module';
import { UserModule } from '@modules/user/user.module';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { AuthenticationController } from '@modules/authentication/authentication.controller';
import { AvailabilityModule } from '@modules/availability/availability.module';
import { EventModule } from '@modules/event/event.module';
import { JwtService } from '@nestjs/jwt';
import { SkillModule } from '@modules/skill/skill.module';
import { StaticFilesController } from '@modules/static-files-controller/static-files-controller.controller';

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
    PrismaModule,
    AuthenticationModule,
    UserModule,
    AuthenticationModule,
    AvailabilityModule,
    EventModule,
    AuthModule,
    SkillModule,
  ],
  controllers: [AppController, AuthenticationController, StaticFilesController],
  providers: [AppService, CryptService, RootResolver, JwtService],
})
export class AppModule {}
