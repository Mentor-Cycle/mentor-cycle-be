import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Language {
  @Field(() => String)
  name: string;
  @Field(() => String)
  proficiency: string;
}
