import { CreateUserInput } from './create-user.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType('UpdateUserInput')
export class UpdateUserDto extends PartialType(CreateUserInput, InputType) {
  @Field()
  id: string;
}
