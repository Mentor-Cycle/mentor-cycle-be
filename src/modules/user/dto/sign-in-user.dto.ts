import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsEmpty, IsString } from 'class-validator';

@InputType('SignInUserInput')
export class SignInUserDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsBoolean()
  @IsEmpty()
  rememberMe?: boolean;
}
