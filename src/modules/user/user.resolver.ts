import { Inject } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Args,
  Context,
  GraphQLExecutionContext,
} from '@nestjs/graphql';
import { isEmail } from 'class-validator';
import { Response } from 'express';
import { CreateUserInput, ResetPasswordUserDto, SignInUserDto } from './dto';
import { SignUp, SignIn } from './entities/sign-in.entity';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Mutation(() => SignUp)
  async signUp(@Args('userInput') input: CreateUserInput) {
    return this.userService.signUpUser(input);
  }
  @Mutation(() => Boolean, { name: 'signInUser' })
  async signIn(
    @Args('userInput') userInput: SignInUserDto,
    @Context('res') res: Response,
  ): Promise<boolean> {
    const user = await this.userService.signIn(userInput);
    if (!user) {
      return false;
    }
    const ONE_DAY_IN_MILLISECONDS = 86400000;
    const expires = new Date(Date.now() + ONE_DAY_IN_MILLISECONDS);

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
