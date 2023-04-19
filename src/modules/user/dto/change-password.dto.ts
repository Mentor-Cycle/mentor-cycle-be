import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';
import { createStringRequirements } from '@common/utils';

@InputType()
export class ChangePasswordInputDto {
  @Field()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsNotEmpty()
  oldPassword: string;

  @Field()
  @IsNotEmpty()
  @Matches(createStringRequirements(), {
    message: 'Password should have symbols, numbers and uppercase characters',
  })
  newPassword: string;
}
