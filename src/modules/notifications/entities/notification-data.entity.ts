import { FieldId } from '@common/decorators';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class NotificationData {
  @FieldId()
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  imageUrl: string;

  @Field(() => ID, { nullable: true })
  notifierId?: string;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date)
  createdAt: Date;
}
