import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';
import { FindMentorInput } from './find-mentor.dto';

@InputType('getUsers')
export class InputUsers extends FindMentorInput {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isMentor?: boolean;
}
