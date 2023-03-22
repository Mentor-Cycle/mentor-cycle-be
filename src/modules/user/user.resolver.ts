import { Inject } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { isEmail } from 'class-validator';
import { CreateUserInput, ResetPasswordUserDto, SignInUserDto } from './dto';
import { FindMentorInput } from './dto/find-mentor.dto';
import { SignUp, SignIn } from './entities/sign-in.entity';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Query(() => [User], { name: 'findMentors' })
  async findMentors(
    @Args('findMentorsInput') findMentorInput: FindMentorInput,
  ) {
    return this.userService.findMentors(findMentorInput);
  }
  @Mutation(() => SignUp)
  async signUp(@Args('userInput') input: CreateUserInput) {
    return this.userService.signUpUser(input);
  }

  @Mutation(() => SignIn, { name: 'signInUser' })
  async signIn(@Args('userInput') userInput: SignInUserDto) {
    return await this.userService.signIn(userInput);
  }

  @Mutation(() => Boolean)
  async resetUserPassword(
    @Args('userInput') resetUserInput: ResetPasswordUserDto,
  ) {
    return this.userService.resetPasswordUser(resetUserInput);
  }

  @Mutation(() => Boolean)
  async sendResetPassword(@Args('email') email: string) {
    const validateEmail = isEmail(email);

    if (!validateEmail) {
      return validateEmail;
    }

    return this.userService.sendResetPassword(email);
  }
}
