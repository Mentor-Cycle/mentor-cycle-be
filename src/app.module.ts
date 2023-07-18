import { AuthModule } from '@common/auth/auth.module';
import { RootResolver } from './app.resolver';
import { CryptService } from '@common/services/crypt';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
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
import { NotificationsModule } from '@modules/notifications/notifications.module';
import GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
import { TestimonyModule } from './modules/testimony/testimony.module';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from '@common/throttler/throttler.guard';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      cors: {
        allowedHeaders: ['content-type'],
        origin: ['https://studio.apollographql.com/', 'http://127.0.0.1:3000/'],
        credentials: true,
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      context: ({ req, res }) => ({ req, res }),
      resolvers: { Upload: GraphQLUpload },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    PrismaModule,
    AuthenticationModule,
    UserModule,
    AuthenticationModule,
    AvailabilityModule,
    EventModule,
    AuthModule,
    SkillModule,
    NotificationsModule,
    TestimonyModule,
  ],
  controllers: [AppController, AuthenticationController, StaticFilesController],
  providers: [
    AppService,
    CryptService,
    RootResolver,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
