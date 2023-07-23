import { FieldId } from '@common/decorators';
import { ObjectType, Field, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Recommendation {
  @FieldId()
  id: string;
  @Field(() => String)
  mentorId: string;
  @Field(() => String)
  learnerId: string;
  @Field(() => String)
  text: string;
  @Field(() => Boolean)
  approved: boolean;
}
