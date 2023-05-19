import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [EventResolver, EventService, JwtService],
})
export class EventModule {}
