import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Skill } from '../types';

@ObjectType('Users')
export class Users {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isMentor?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsEnum(Skill, { each: true })
  @IsOptional()
  skills?: string[];
}
