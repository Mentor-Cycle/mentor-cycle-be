import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '@common/services/mail/mail.service';
import { NotificationsService } from '@modules/notifications/notifications.service';

@Module({
  providers: [
    EventResolver,
    EventService,
    JwtService,
    MailService,
    NotificationsService,
  ],
})
export class EventModule {}
