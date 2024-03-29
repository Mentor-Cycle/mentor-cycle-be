import { FieldId } from '@common/decorators';
import { User } from '@modules/user/entities/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ParticipantInfo {
  @Field(() => User)
  user: User;

  @Field(() => String)
  assignedBy: string;

  @Field(() => Date)
  assignedAt: Date;
}

@ObjectType()
export class CreateEventOutput {
  @FieldId()
  id: string;
  @Field(() => String)
  mentorId: string;
  @Field(() => [ParticipantInfo])
  participants: ParticipantInfo[];
  @Field(() => String)
  startDate: string;
  @Field(() => String)
  meetingLink: string;
  @Field(() => String)
  endDate: string;
  @Field(() => String)
  status: string;
  @Field(() => Boolean)
  active: boolean;
}
