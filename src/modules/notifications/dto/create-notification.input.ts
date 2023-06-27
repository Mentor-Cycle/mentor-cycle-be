import { InputType, Field, ID } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @IsString()
  @Field(() => String)
  title: string;

  @IsString()
  @Field(() => String)
  description: string;

  @IsString()
  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @IsUUID()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  notifierId?: string;

  @IsArray()
  @Field(() => [String])
  usersIds: string[];
}
