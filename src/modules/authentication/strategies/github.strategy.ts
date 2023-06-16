import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { AuthProvider } from '../types';
import { AuthenticationService } from '../authentication.service';
import { config } from 'dotenv';

config();

@Injectable()
export class GithubStrategy extends PassportStrategy(
  Strategy,
  AuthProvider.GITHUB,
) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || '_',
      clientSecret: process.env.GITHUB_SECRET || '_',
      callbackURL: `${process.env.APP_BASE_URL}/auth/github/callback`,
      scope: ['read:user', 'user:email'],
    });
  }

  async validate(
    _: string,
    __: string,
    profile: Profile,
    done: (error: string, user?: Express.User) => void,
  ) {
    try {
      const result = await this.authenticationService.authenticateUserFromOAuth(
        AuthProvider.GITHUB,
        profile,
      );
      done(null, result);
    } catch (error) {
      done(error.toString());
    }
  }
}
