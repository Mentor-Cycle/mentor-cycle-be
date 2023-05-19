import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsString, IsUUID } from 'class-validator';
export enum EventStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
  CONFIRMED = 'CONFIRMED',
}
@InputType()
export class CreateEventInput {
  @IsUUID()
  @Field(() => String)
  mentorId: string;

  @IsUUID()
  @Field(() => String)
  learnerId: string;

  @IsString()
  @Field(() => String)
  startDate: string;

  @IsString()
  @Field(() => String)
  endDate: string;

  @Field(() => String)
  @IsEnum(EventStatus)
  status: EventStatus;

  @Field(() => Boolean)
  @IsBoolean()
  active: boolean;
}
