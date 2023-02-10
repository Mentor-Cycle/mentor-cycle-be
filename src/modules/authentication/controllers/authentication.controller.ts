import qs from 'querystring';
import { Controller, Request, Response, Next, Get } from '@nestjs/common';
import express from 'express';
import { authenticate } from 'passport';

type AuthProvider = 'google' | 'linkedin'; //TODO: implement linkedin auth

@Controller('auth')
export class AuthenticationController {
  @Get('google')
  handleGoogleAuth(
    @Request() req: express.Request,
    @Response() res: express.Response,
    @Next() next: express.NextFunction,
  ) {
    this.handleAuthentication(
      { provider: 'google', scope: ['profile', 'email'] },
      req,
      res,
      next,
    );
  }

  @Get('google/callback')
  handleGoogleAuthCallback(
    @Request() req: express.Request,
    @Response() res: express.Response,
    @Next() next: express.NextFunction,
  ) {
    this.handleAuthenticationCallback('google', req, res, next);
  }

  private handleAuthentication(
    params: { provider: AuthProvider; scope: string[] },
    @Request() req: express.Request,
    @Response() res: express.Response,
    @Next() next: express.NextFunction,
  ) {
    const { provider, scope } = params;
    const clientUrl = req.query.clientUrl as string;

    authenticate(provider, {
      scope,
      state: qs.stringify({
        clientUrl,
      }),
    })(req, res, next);
  }

  private handleAuthenticationCallback(
    provider: AuthProvider,
    @Request() req: express.Request,
    @Response() res: express.Response,
    @Next() next: express.NextFunction,
  ) {
    const clientUrl = qs.decode(req.query.state as string).clientUrl as string;

    authenticate(
      provider,
      {
        failureRedirect: `${clientUrl}/auth/login`,
      },
      (err, result) => {
        if (err) {
          return;
        }

        res.redirect(
          `${clientUrl}/auth/verify-token/${result.token}${
            result.new ? '?new=true' : ''
          }`,
        );
      },
    )(req, res, next);
  }
}
