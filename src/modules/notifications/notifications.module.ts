import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';

@Module({
  providers: [NotificationsResolver, NotificationsService, JwtService],
})
export class NotificationsModule {}
