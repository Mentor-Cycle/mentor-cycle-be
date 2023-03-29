import { Inject } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { isEmail } from 'class-validator';
import { Response } from 'express';
import { CreateUserInput, ResetPasswordUserDto, SignInUserDto } from './dto';
import { FindMentorInput } from './dto/find-mentor.dto';
import { SignUp } from './entities/sign-in.entity';
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
  @Mutation(() => Boolean, { name: 'signInUser' })
  async signIn(
    @Args('userInput') userInput: SignInUserDto,
    @Context('res') res: Response,
  ): Promise<boolean> {
    const expireRanges = {
      ONE_HOUR_IN_MILLISECONDS: 86400000 / 24,
      ONE_DAY_IN_MILLISECONDS: 86400000,
    };

    const expireSession = userInput.rememberMe
      ? expireRanges.ONE_DAY_IN_MILLISECONDS
      : expireRanges.ONE_HOUR_IN_MILLISECONDS;

    const expires = new Date(Date.now() + expireSession);

    const user = await this.userService.signIn(userInput, expireSession);
    if (!user) {
      return false;
    }

    res.cookie('token', user.token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      expires,
    });

    return true;
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
