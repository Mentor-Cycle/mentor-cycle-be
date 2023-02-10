import { Module } from '@nestjs/common';
//import { GraphQLModule } from '@modules/graphql'; //fix path
import { GraphQLModule } from './modules/graphql';
//import { PrismaModule } from '@modules/prisma'; //fix path
import { PrismaModule } from './modules/prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [GraphQLModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
