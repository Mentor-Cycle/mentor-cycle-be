import { FieldId } from '@common/decorators';
import { User } from '@modules/user/entities/user.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Notification {
  @FieldId()
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  imageUrl: string;

  @Field(() => Boolean)
  read: boolean;
}
