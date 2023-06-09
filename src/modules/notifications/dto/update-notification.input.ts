import { IsBoolean } from 'class-validator';
import { CreateNotificationInput } from './create-notification.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationInput extends PartialType(
  CreateNotificationInput,
) {
  @IsBoolean()
  @Field(() => String)
  read: boolean;
}
