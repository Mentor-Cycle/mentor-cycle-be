import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

export enum PeriodEnum {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

@InputType('FindMentorInput')
export class FindMentorInput {
  @Field({ nullable: true })
  firstName?: string;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => String, { nullable: true })
  @IsEnum(PeriodEnum)
  @IsOptional()
  period?: PeriodEnum;

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
