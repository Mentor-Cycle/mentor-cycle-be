import { Inject } from '@nestjs/common';
import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { UserService } from '@modules/services';
import { CreateUserDto, SignInUserDto } from '@common/dtos';
import { SignIn, SignUp } from '@common/models';

@Resolver()
export class AuthenticationResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Mutation(() => SignUp)
  async signUp(@Args('userInput') input: CreateUserDto) {
    return this.userService.signUpUser(input);
  }

  @Mutation(() => SignIn, { name: 'signInUser' })
  async signIn(@Args('userInput') userInput: SignInUserDto) {
    return await this.userService.signIn(userInput);
  }
}
