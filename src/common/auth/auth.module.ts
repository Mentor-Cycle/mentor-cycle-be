import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [],
  providers: [AuthGuard, JwtService],
})
export class AuthModule {}
