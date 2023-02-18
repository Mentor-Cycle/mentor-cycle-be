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
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
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
      const { id, emails, photos, name } = profile;
      const firstName = name?.givenName || '';
      const lastName = name?.familyName || '';
      const email = emails?.[0].value || '';
      const photoUrl = photos?.[0].value;

      const result = await this.authenticationService.authenticateUserFromOAuth(
        AuthProvider.LINKEDIN,
        {
          email,
          firstName,
          lastName,
          photoUrl,
          accountId: id,
        },
      );
      done(null, result);
    } catch (error) {
      done(error.toString());
    }
  }
}
