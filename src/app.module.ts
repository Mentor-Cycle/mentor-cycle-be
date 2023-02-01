import { Module } from '@nestjs/common';
import { GraphQLModule } from '@modules/graphql'; //fix path
import { PrismaModule } from '@modules/prisma'; //fix path
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [GraphQLModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
