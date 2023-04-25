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
    const { token, expires } = req.user;
    const expireDate = new Date(expires).toUTCString();
    req.res.setHeader('Set-Cookie', [
      `token=${token}; HttpOnly; Path=/; SameSite=None; Secure; Expires=${expireDate}}`,
    ]);

    res.redirect(`${process.env.CLIENT_URL}`);
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
    const { token, expires } = req.user;
    setCookies(res, token, expires);

    res.redirect(`${process.env.CLIENT_URL}`);
  }
}
