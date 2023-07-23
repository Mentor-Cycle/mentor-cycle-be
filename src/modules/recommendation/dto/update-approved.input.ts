import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateApprovedInput {
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String)
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean)
  approved: boolean;
}
