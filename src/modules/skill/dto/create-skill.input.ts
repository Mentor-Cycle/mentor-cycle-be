import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSkillInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
