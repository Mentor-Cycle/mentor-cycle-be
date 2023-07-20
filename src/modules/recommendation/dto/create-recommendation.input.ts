import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsString, IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateRecommendationInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String)
  mentorId: string;

  @IsUUID()
  @IsNotEmpty()
  @Field(() => String)
  learnerId: string;

  @IsString()
  @Field(() => String)
  text: string;

  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean)
  approved: boolean;
}
