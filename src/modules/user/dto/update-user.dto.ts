import { IsString } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType('UpdateUserDto')
export class UpdateUserDto extends PartialType(CreateUserInput, InputType) {
  @Field()
  @IsString()
  id: string;
}
