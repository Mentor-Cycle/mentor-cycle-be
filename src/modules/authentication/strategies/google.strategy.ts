import { AuthProvider } from '../types';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '@modules/authentication/authentication.service';
import { Profile } from 'passport';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthProvider.GOOGLE,
) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '_',
      clientSecret: process.env.GOOGLE_SECRET || '_',
      callbackURL: `${process.env.APP_BASE_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _: string,
    __: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    try {
      const result = await this.authenticationService.authenticateUserFromOAuth(
        AuthProvider.GOOGLE,
        profile,
      );
      done(null, result);
    } catch (error) {
      done(error.toString());
    }
  }
}
