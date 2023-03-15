import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@ArgsType()
export class CheckPinUserDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  pin: string;
}
