import { InputType, Field, ID } from '@nestjs/graphql';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { AvailabilityInput } from './availability.input';

@InputType()
export class CreateAvailabilityInput {
  @Field(() => ID)
  @IsUUID()
  mentorId: string;

  @Field(() => [AvailabilityInput], { nullable: true })
  @IsArray()
  @IsOptional()
  availabilities?: AvailabilityInput[];
}
