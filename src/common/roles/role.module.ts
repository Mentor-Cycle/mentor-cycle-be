import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from './role.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [],
  providers: [RoleGuard, Reflector, JwtModule],
})
export class RoleModule {}
