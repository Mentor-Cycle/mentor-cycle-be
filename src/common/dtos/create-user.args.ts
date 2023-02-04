import { Field, InputType } from '@nestjs/graphql';
import {
  Equals,
  Length,
  Matches,
  IsEmail,
  IsString,
  IsOptional,
} from 'class-validator';
import { createStringRequirements } from '../utils';

@InputType('CreateUserInput')
export class CreateUserDto {
  @Field()
  @IsString()
  @Length(2, 100)
  firstName: string;

  @Field()
  @IsString()
  @Length(2, 100)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Matches(createStringRequirements(), {
    message: 'Password should have symbols, numbers and uppercase characters',
  })
  password: string;

  //   @Field({ nullable: true })
  //   @IsOptional()
  //   photoUrl?: string;

  facebookId?: string;
  googleId?: string;
}
