import { Field, ObjectType } from '@nestjs/graphql';
import { FieldId } from '@common/decorators';
import { User } from './user.model';

@ObjectType()
export class SignIn {
  @FieldId()
  token: string;

  @Field()
  user: User;
}

@ObjectType()
export class SignUp extends SignIn {}
