import { Field, InputType } from '@nestjs/graphql';
import {
  Length,
  Matches,
  IsEmail,
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { createStringRequirements } from '@common/utils';
import { Skill } from '../types';

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
  @Matches(
    createStringRequirements({
      minLength: 6,
      includeNumber: true,
      includeLowercase: true,
      includeUppercase: false,
      includeSpecial: false,
    }),
    {
      message: 'Password should have symbols, numbers and uppercase characters',
    },
  )
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @Field()
  @IsOptional()
  @IsString()
  @Length(3, 5)
  @Matches(/^[0-9]{1,2}-(10|11|[0-9]{1})$/, {
    message: 'experience should be on format "99-99" (years-months)',
  })
  experience?: string;

  @Field(() => [String], { nullable: false })
  @IsEnum(Skill, { each: true })
  @IsOptional()
  skills?: Skill[];

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @Field()
  @IsOptional()
  @IsString()
  @Length(9, 9)
  @Matches(/^[0-9]{5}-[0-9]{3}/, {
    message: 'zipCode should be on format "99999-999"',
  })
  zipCode?: string;

  @Field()
  @IsOptional()
  @IsString()
  country?: string;

  @Field()
  @IsOptional()
  @IsString()
  state?: string;

  @Field()
  @IsString()
  @IsOptional()
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
  @IsOptional()
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
