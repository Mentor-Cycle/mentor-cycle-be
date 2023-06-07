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
  @Matches(
    createStringRequirements({
      minLength: 6,
      includeNumber: true,
      includeLowercase: true,
      includeUppercase: false,
      includeSpecial: false,
    }),
    {
      message: 'Password should have numbers and letters',
    },
  )
  newPassword: string;
}
