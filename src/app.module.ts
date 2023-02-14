import { Module } from '@nestjs/common';
import { GraphQLModule } from '@modules/graphql';
import { PrismaModule } from '@modules/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationController } from '@modules/authentication/controllers';
import { AuthenticationModule } from '@modules/authentication/authentication.module';
import { ServicesModule } from '@modules/services/services.module';
import { RepositoriesModule } from '@modules/repositories/repositories.module';

@Module({
  imports: [
    GraphQLModule,
    PrismaModule,
    AuthenticationModule,
    ServicesModule,
    RepositoriesModule,
  ],
  controllers: [AppController, AuthenticationController],
  providers: [AppService],
})
export class AppModule {}
