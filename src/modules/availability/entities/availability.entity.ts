import { FieldId } from '@common/decorators';
import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Availability {
  @FieldId()
  id: string;
  @Field(() => String)
  mentorId: string;
  @Field(() => Int)
  weekDay: number;
  @Field(() => String)
  startHour: string;
  @Field(() => String)
  period?: string;
  @Field(() => String)
  endHour: string;
  @Field(() => Boolean)
  active: boolean;
  @Field(() => String, { nullable: true })
  startDate?: string;
  @Field(() => String, { nullable: true })
  endDate?: string;
}
