import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { FieldId } from '../../common/decorators';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @FieldId()
  id: string;
  @Field({ nullable: false })
  email: string;
  password?: string | null;
  @Field()
  firstName: string;
  @Field(() => String, { nullable: true })
  lastName?: string | null;
  @Field(() => String, { nullable: true })
  photoUrl?: string | null;
  @Field()
  isEmailVerified: boolean;
  @Field()
  isTermsAccepted: boolean;
  @Field()
  onBoardingCompleted: boolean;
  @Field()
  createdAt!: Date;
  @Field()
  updatedAt!: Date;
  googleId?: string | null;
  facebookId?: string | null;
}
