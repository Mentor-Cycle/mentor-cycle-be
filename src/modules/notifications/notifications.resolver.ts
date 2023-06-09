import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { AuthGuard } from '@common/auth/auth.guard';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Notification)
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
  @Mutation(() => Notification)
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
  removeNotification(@Args('id', { type: () => Int }) id: string) {
    return this.notificationsService.remove(id);
  }
}
