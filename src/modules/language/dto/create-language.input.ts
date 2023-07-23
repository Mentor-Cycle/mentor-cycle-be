import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateLanguageInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  proficiency: string;
}
