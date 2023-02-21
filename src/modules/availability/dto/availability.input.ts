import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AvailabilityInput {
  @Field(() => Int)
  weekDay: number;
  @Field(() => String)
  startHour: string;
  @Field(() => String)
  endHour: string;
  @Field(() => Boolean)
  active: boolean;
}
