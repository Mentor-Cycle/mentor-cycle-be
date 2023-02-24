import { CreateAvailabilityInput } from './create-availability.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAvailabilityInput extends PartialType(
  CreateAvailabilityInput,
) {
  @Field(() => Int)
  id: number;
}
