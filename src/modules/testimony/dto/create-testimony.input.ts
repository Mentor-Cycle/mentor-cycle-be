import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateTestimonyInput {
  @IsUUID()
  @Field(() => String)
  mentorId: string;

  @IsUUID()
  @Field(() => String)
  learnerId: string;

  @IsString()
  @Field(() => String)
  text: string;
}
