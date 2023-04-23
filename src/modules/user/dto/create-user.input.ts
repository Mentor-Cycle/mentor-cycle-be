import { Field, InputType } from '@nestjs/graphql';
import {
  Length,
  Matches,
  IsEmail,
  IsString,
  IsOptional,
  IsArray,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { createStringRequirements } from '@common/utils';

@InputType('CreateUserInput')
export class CreateUserInput {
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

  @Field({ nullable: true })
  @IsOptional()
  photoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  yearsOfExperience?: number;

  @Field(() => [String], { nullable: false })
  @IsArray()
  skills?: string[];

  @Field({ nullable: true })
  @IsDate()
  birthDate?: Date;

  @Field()
  @IsString()
  country?: string;

  @Field()
  @IsString()
  state?: string;

  @Field()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  linkedin?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  github?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  website?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  jobCompany?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  biography?: string;

  @Field()
  @IsString()
  @Length(2, 400)
  description?: string;

  @Field({ nullable: true })
  @IsBoolean()
  isMentor?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  facebookId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  googleId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string;
}
