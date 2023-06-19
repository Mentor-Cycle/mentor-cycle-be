import { CreateTestimonyInput } from './create-testimony.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateTestimonyInput extends PartialType(CreateTestimonyInput) {
  @IsUUID()
  @Field(() => String)
  id: string;
}
