/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthProvider } from './types';

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
    res.redirect(`${process.env.CLIENT_URL}/${req.user.token}`);
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
    res.redirect(`${process.env.CLIENT_URL}/${req.user.token}`);
  }
}
