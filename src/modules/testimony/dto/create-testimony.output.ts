import { FieldId } from '@common/decorators';
//import { User } from '@modules/user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateTestimonyOutput {
  @FieldId()
  id: string;
  @Field(() => String)
  mentorId: string;
  @Field(() => String)
  learnerId: string;
  @Field(() => String)
  text: string;
}
