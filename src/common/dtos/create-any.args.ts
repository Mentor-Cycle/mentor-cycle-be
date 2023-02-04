import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CreateAnyArgs {
  @Field()
  anyUniqueText: string;

  @Field()
  anyNonUniqueText: string;
}
