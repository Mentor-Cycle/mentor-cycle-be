import { HttpException, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { isEmail } from 'class-validator';
import { Request, Response } from 'express';
import {
  CreateUserInput,
  UpdateUserDto,
  ResetPasswordUserDto,
  SignInUserDto,
} from './dto';
import { FindMentorInput } from './dto/find-mentor.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { generateExpiresAt, setCookies } from '@common/utils';
import { AuthGuard } from '@common/auth/auth.guard';
import { ChangePasswordInputDto } from './dto/change-password.dto';

@Resolver('User')
export class UserResolver {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Query(() => [User], { name: 'findMentors' })
  async findMentors(
    @Args('findMentorsInput') findMentorInput: FindMentorInput,
  ) {
    return this.userService.findMentors(findMentorInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'findOneMentor' })
  async findOneMentor(@Args('id', { type: () => String }) id: string) {
    const mentor = await this.userService.findOneMentor(id);
    if (!mentor) {
      throw new HttpException('Mentor not found', 404);
    }
    return mentor;
  }

  @Mutation(() => Boolean, { name: 'signUpUser' })
  async signUp(
    @Args('userInput') input: CreateUserInput,
    @Context('res') res: Response,
  ) {
    const user = await this.userService.signUpUser(input);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const { expires } = generateExpiresAt(false);

    return setCookies(res, user.token, expires);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @UseGuards(AuthGuard)
  async update(@Args('userInput') input: UpdateUserDto) {
    const user = await this.userService.updateUserData(input);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Mutation(() => Boolean, { name: 'changePassword' })
  @UseGuards(AuthGuard)
  async changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInputDto,
    @Context('res') res: Response,
  ): Promise<boolean> {
    const { expires, expireSession } = generateExpiresAt(false);

    const user = await this.userService.changePassword(
      changePasswordInput,
      expireSession,
    );
    if (!user) {
      throw new HttpException('Invalid reset token', HttpStatus.UNAUTHORIZED);
    }

    return setCookies(res, user.token, expires);
  }

  @Mutation(() => Boolean, { name: 'signInUser' })
  async signIn(
    @Args('userInput') userInput: SignInUserDto,
    @Context('res') res: Response,
  ): Promise<boolean> {
    const { expires, expireSession } = generateExpiresAt(userInput.rememberMe);

    const user = await this.userService.signIn(userInput, expireSession);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return setCookies(res, user.token, expires);
  }

  @Mutation(() => Boolean, { name: 'deactivateAccount' })
  @UseGuards(AuthGuard)
  async deactivateAccount(@Args('id') id: string) {
    return this.userService.deactivateAccount(id);
  }

  @Mutation(() => Boolean, { name: 'signOutUser' })
  @UseGuards(AuthGuard)
  async signOut(@Context('res') res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });

    return true;
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'me' })
  async me(@Context('req') req: Request) {
    const token = req.cookies['token'];
    return this.userService.me(token);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async resetUserPassword(
    @Args('userInput') resetUserInput: ResetPasswordUserDto,
  ) {
    return this.userService.resetPasswordUser(resetUserInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async sendResetPassword(@Args('email') email: string) {
    const validateEmail = isEmail(email);
    if (!validateEmail) {
      return validateEmail;
    }
    return this.userService.sendResetPassword(email);
  }
}
