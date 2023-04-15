import { CreateEventInput } from './create-event.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
