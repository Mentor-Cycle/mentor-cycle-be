import { AuthProvider } from '../types';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '@modules/authentication/authentication.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  AuthProvider.GOOGLE,
) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
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
      const { id, emails, photos, name } = profile;
      const firstName = name?.givenName || '';
      const lastName = name?.familyName || '';
      const email = emails?.[0].value || '';
      const photoUrl = photos?.[0].value;

      const result = await this.authenticationService.authenticateUserFromOAuth(
        AuthProvider.GOOGLE,
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
