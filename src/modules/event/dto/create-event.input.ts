import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field(() => String)
  mentorId: string;
  @Field(() => String)
  learnerId: string;
  @Field(() => String)
  startDate: string;
  @Field(() => String)
  endDate: string;
  @Field(() => Boolean)
  active: boolean;
}
