import { FieldId } from '@common/decorators';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { NotificationData } from './notification-data.entity';

@ObjectType()
export class Notification {
  @FieldId()
  id: string;

  @Field(() => ID)
  notificationDataId: string;

  @Field(() => ID)
  userId: string;

  @Field(() => Boolean)
  read: boolean;

  @Field(() => NotificationData)
  data: NotificationData;
}
