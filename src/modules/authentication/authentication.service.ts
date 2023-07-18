import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@modules/prisma';
import { UserRepository } from '@modules/user/user.repository';
import { AuthProvider } from './types';
import { Profile } from 'passport';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async authenticateUserFromOAuth(
    provider: AuthProvider,
    profile: Profile,
  ): Promise<{
    user: User;
    token: string;
    new?: boolean;
  }> {
    const { id, emails, photos, name, displayName } = profile;
    const arrayDisplayName = displayName.split(' ');
    const firstDisplayName = arrayDisplayName[0];
    const lastDisplayName = arrayDisplayName[arrayDisplayName.length - 1];
    const firstName = name?.givenName || firstDisplayName || '';
    const lastName = name?.familyName || lastDisplayName || '';
    const email = emails?.[0].value || '';
    const photoUrl = photos?.[photos.length - 1].value;
    const accountId = id;

    const existingUser = await this.userRepository.getByEmail(email);

    if (existingUser) {
      return this.signIn(provider, accountId, existingUser);
    }

    return this.signUp(provider, accountId, {
      email,
      firstName,
      lastName,
      photoUrl,
    });
  }

  private async signUp(
    provider: AuthProvider,
    accountId: string,
    user: {
      email: string;
      firstName: string;
      lastName: string;
      photoUrl?: string;
    },
  ) {
    const { email, firstName, lastName, photoUrl } = user;

    const input: Prisma.UserCreateInput = {
      email,
      firstName,
      lastName,
      photoUrl,
    };

    if (provider === 'google') {
      input.googleId = accountId;
    }
    if (provider === 'linkedin') {
      input.linkedinId = accountId;
    } else {
      input.githubId = accountId;
    }

    const newUser = await this.userRepository.create(input);

    const token = await this.generateToken(newUser.id, email);

    return { token, user: newUser, new: true };
  }

  private async signIn(provider: AuthProvider, accountId: string, user: User) {
    await this.linkOAuthAccountToUser(provider, accountId, user);

    const token = await this.generateToken(user.id, user.email);

    return { user, token };
  }

  private async linkOAuthAccountToUser(
    provider: AuthProvider,
    accountId: string,
    user: User,
  ) {
    if (user.googleId) {
      return;
    }

    const updateInput: Prisma.UserUpdateInput = {};

    if (provider === 'google') {
      updateInput.googleId = accountId;
    } else {
      //updateInput.linkedinId = accountId;
    }

    await this.userRepository.update(updateInput, { email: user.email });
  }

  private async generateToken(userId: string, email: string) {
    const existingUser = await this.userRepository.getByEmail(email);

    return this.jwtService.sign(
      {
        id: userId,
        email,
        role: existingUser.isMentor ? 'MENTOR' : 'USER',
      },
      { subject: userId, secret: process.env.SECRET },
    );
  }
}
