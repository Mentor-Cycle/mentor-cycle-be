import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext();
    if (!req.cookies.token) {
      return false;
    }
    const roles = this.reflector.get<string[]>('role', context.getHandler());
    if (!roles) {
      return true;
    }
    const { token } = req.cookies;
    const isVerified = this.jwtService.verify(token, {
      secret: process.env.SECRET,
    });
    if (!isVerified) {
      res.clearCookie('token', {
        httponly: true,
        samesite: 'none',
        secure: true,
        path: '/',
      });
      return false;
    }
    const hasHole = roles.some(() => roles.includes(isVerified.role));

    return !!isVerified && hasHole;
  }
}
