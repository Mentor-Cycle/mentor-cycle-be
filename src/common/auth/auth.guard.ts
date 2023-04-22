import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext();
    if (!req.cookies.token) {
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
      });
      return false;
    }
    const { token } = req.cookies;
    const isVerified = this.jwtService.verify(token, {
      secret: process.env.SECRET,
    });
    return !!isVerified;
  }
}
