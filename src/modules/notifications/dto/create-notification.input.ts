import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @IsString()
  @Field(() => String)
  title: string;

  @IsString()
  @Field(() => String)
  description: string;

  @IsString()
  @Field(() => String)
  imageUrl: string;

  @IsArray()
  @Field(() => [String])
  usersIds: string[];
}
