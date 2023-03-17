import { createStringRequirements } from '@common/utils';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Matches } from 'class-validator';

@InputType('ResetPasswordInput')
export class ResetPasswordUserDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  pin: string;

  @Field()
  @Matches(createStringRequirements(), {
    message: 'Password should have symbols, numbers and uppercase characters',
  })
  newPassword: string;
}
