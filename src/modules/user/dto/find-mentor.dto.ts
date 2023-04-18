import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum PeriodEnum {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

@InputType('FindMentorInput')
export class FindMentorInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field(() => [String], { nullable: true })
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @Field(() => String, { nullable: true })
  @IsEnum(PeriodEnum)
  @IsOptional()
  period?: PeriodEnum;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  orderBy?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  order?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  skip?: number;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  take?: number;
}
