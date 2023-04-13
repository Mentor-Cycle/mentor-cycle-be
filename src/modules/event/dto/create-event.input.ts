import { InputType, Field } from '@nestjs/graphql';
export enum EventStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
  CONFIRMED = 'CONFIRMED',
}
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
  @Field(() => String)
  status: EventStatus;
  @Field(() => Boolean)
  active: boolean;
}
