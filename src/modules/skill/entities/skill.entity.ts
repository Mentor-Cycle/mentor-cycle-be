import { FieldId } from '@common/decorators';
import { ObjectType, Field, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Skill {
  @FieldId()
  id: string;

  @Field()
  name: string;
}
