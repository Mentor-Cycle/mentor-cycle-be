import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { AuthGuard } from '@common/auth/auth.guard';
import { NotificationData } from './entities/notification-data.entity';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => NotificationData)
  createNotification(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationsService.create(createNotificationInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Notification], { name: 'findNotifications' })
  findAll(@Args('userId', { nullable: true }) userId?: string) {
    return this.notificationsService.findAll({
      userId,
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => Notification, { name: 'findOneNotification', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.notificationsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => NotificationData)
  updateNotification(
    @Args('updateNotificationInput')
    updateNotificationInput: UpdateNotificationInput,
  ) {
    return this.notificationsService.update(
      updateNotificationInput.id,
      updateNotificationInput,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Notification)
  markRead(
    @Args('id', { type: () => String })
    id: string,
  ) {
    return this.notificationsService.markRead(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  removeNotification(@Args('id', { type: () => ID }) id: string) {
    return this.notificationsService.remove(id);
  }
}
