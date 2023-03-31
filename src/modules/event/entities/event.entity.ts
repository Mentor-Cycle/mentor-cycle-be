import { FieldId } from '@common/decorators';
import { User } from '@modules/user/entities/user.entity';
import { ObjectType, Field, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Event {
  @FieldId()
  id: string;
  @Field(() => String)
  mentorId: string;
  @Field(() => [User])
  learners: User[];
  @Field(() => String)
  startDate: string;
  @Field(() => String)
  endDate: string;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => String)
  meetLink: string;
}
