/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthProvider } from './types';
import { setCookies } from '@common/utils';

@Controller('auth')
export class AuthenticationController {
  @Get('google')
  @UseGuards(AuthGuard(AuthProvider.GOOGLE))
  handleGoogleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard(AuthProvider.GOOGLE))
  handleGoogleAuthCallback(@Req() req, @Res() res) {
    if (!req.user) {
      return 'No user found';
    }
    const {
      token,
      expires,
      user: { firstName, lastName, email, photoUrl },
    } = req.user;
    setCookies(res, token, expires);
    const params = new URLSearchParams({
      firstName,
      lastName,
      email,
      photoUrl,
    });

    res.redirect(`${process.env.CLIENT_URL}/?${params.toString()}`);
  }

  @Get('linkedin')
  @UseGuards(AuthGuard(AuthProvider.LINKEDIN))
  handleLinkedinAuth(@Req() req) {}

  @Get('linkedin/callback')
  @UseGuards(AuthGuard(AuthProvider.LINKEDIN))
  handleLinkedinAuthCallback(@Req() req, @Res() res) {
    if (!req.user) {
      return 'No user found';
    }
    const {
      token,
      expires,
      user: { firstName, lastName, email, photoUrl },
    } = req.user;
    setCookies(res, token, expires);
    const params = new URLSearchParams({
      firstName,
      lastName,
      email,
      photoUrl,
    });

    res.redirect(`${process.env.CLIENT_URL}/?${params.toString()}`);
  }
}
