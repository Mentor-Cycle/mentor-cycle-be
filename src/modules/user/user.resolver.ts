import { Inject } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateUserInput, SignInUserDto } from './dto';
import { SignUp, SignIn } from './entities/sign-in.entity';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Mutation(() => SignUp)
  async signUp(@Args('userInput') input: CreateUserInput) {
    return this.userService.signUpUser(input);
  }

  @Mutation(() => SignIn, { name: 'signInUser' })
  async signIn(@Args('userInput') userInput: SignInUserDto) {
    return await this.userService.signIn(userInput);
  }
}
