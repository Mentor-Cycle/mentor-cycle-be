import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

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

  @IsString()
  @Field(() => [String])
  usersIds: string[];
}
