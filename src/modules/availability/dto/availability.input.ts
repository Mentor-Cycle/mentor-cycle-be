import { PeriodEnum } from '@modules/user/dto/find-mentor.dto';
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
  @Field(() => String, { nullable: true })
  period?: PeriodEnum;
}
