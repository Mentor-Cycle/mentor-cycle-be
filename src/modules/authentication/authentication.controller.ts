import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthProvider } from './types';

@Controller('auth')
export class AuthenticationController {
  @Get('google')
  @UseGuards(AuthGuard(AuthProvider.GOOGLE))
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  handleGoogleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard(AuthProvider.GOOGLE))
  handleGoogleAuthCallback(@Req() req, @Res() res) {
    if (!req.user) {
      return 'No user found';
    }
    res.redirect(`${process.env.CLIENT_URL}/${req.user.token}`);
  }
}
