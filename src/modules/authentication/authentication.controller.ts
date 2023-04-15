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
    setCookies(res, req.user.token, req.user.expires);
    res.redirect(
      `${process.env.CLIENT_URL}/${
        '?firstName=' +
        req.user.user.firstName +
        '&lastName=' +
        req.user.user.lastName +
        '&email=' +
        req.user.user.email +
        '&photoUrl=' +
        req.user.user.photoUrl
      }`,
    );
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
    setCookies(res, req.user.token, req.user.expires);
    res.redirect(
      `${process.env.CLIENT_URL}/${
        '?firstName=' +
        req.user.user.firstName +
        '&lastName=' +
        req.user.user.lastName +
        '&email=' +
        req.user.user.email +
        '&photoUrl=' +
        req.user.user.photoUrl
      }`,
    );
  }
}
