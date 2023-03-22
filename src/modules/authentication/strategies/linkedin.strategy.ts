import { AuthProvider } from '../types';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-linkedin-oauth2';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '@modules/authentication/authentication.service';

config();

@Injectable()
export class LinkedinStrategy extends PassportStrategy(
  Strategy,
  AuthProvider.LINKEDIN,
) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID || '_',
      clientSecret: process.env.LINKEDIN_SECRET || '_',
      callbackURL: `${process.env.APP_BASE_URL}/auth/linkedin/callback`,
      scope: ['r_emailaddress', 'r_liteprofile'],
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
        AuthProvider.LINKEDIN,
        profile,
      );
      done(null, result);
    } catch (error) {
      done(error.toString());
    }
  }
}
