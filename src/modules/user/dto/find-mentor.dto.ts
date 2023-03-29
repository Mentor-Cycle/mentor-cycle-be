import { AvailabilityInput } from '@modules/availability/dto/availability.input';
import { Field, InputType } from '@nestjs/graphql';

@InputType('FindMentorInput')
export class FindMentorInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => AvailabilityInput, { nullable: true })
  availability?: AvailabilityInput;

  @Field({ nullable: true })
  limit?: number;

  @Field({ nullable: true })
  orderBy?: string;

  @Field({ nullable: true })
  order?: string;

  @Field({ nullable: true })
  pageNumber?: number;

  @Field({ nullable: true })
  pageSize?: number;

  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;
}
