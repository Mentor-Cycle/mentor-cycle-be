import { Availability } from './../../availability/entities/availability.entity';
import { Directive, Field, Float, ObjectType } from '@nestjs/graphql';
import { FieldId } from '@common/decorators';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @FieldId()
  id: string;
  @Field({ nullable: false })
  email: string;
  @Field({ nullable: true })
  password?: string | null;
  @Field({ nullable: true })
  active?: boolean;
  @Field()
  firstName: string;
  @Field(() => String, { nullable: true })
  lastName?: string | null;
  @Field(() => String, { nullable: true })
  photoUrl?: string | null;
  @Field(() => Float, { nullable: true })
  yearsOfExperience?: number | null;
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
  @Field({ nullable: true })
  googleId?: string | null;
  @Field({ nullable: true })
  facebookId?: string | null;
  @Field({ nullable: true })
  birthDate?: Date;
  @Field({ nullable: true })
  country?: string;
  @Field({ nullable: true })
  state?: string;
  @Field({ nullable: true })
  city?: string;
  @Field(() => [String], { nullable: true })
  skills?: string[];
  @Field({ nullable: true })
  linkedin?: string;
  @Field({ nullable: true })
  github?: string;
  @Field({ nullable: true })
  website?: string;
  @Field({ nullable: true })
  jobTitle?: string;
  @Field({ nullable: true })
  jobCompany?: string;
  @Field({ nullable: true })
  biography?: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  isMentor?: boolean;
  @Field({ nullable: true })
  status?: string;
  @Field(() => [Availability], { nullable: true })
  availability?: Availability[];
}
