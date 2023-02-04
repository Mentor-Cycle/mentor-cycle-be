import { Field, ObjectType } from '@nestjs/graphql';
import { FieldId } from '../decorators';
import { User } from './user.model';

@ObjectType()
export class SignIn {
  @FieldId()
  token: string;

  @Field()
  user: User;
}
