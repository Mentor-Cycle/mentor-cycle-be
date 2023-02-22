import { CreateEventInput } from './create-event.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => String)
  id: string;
}
