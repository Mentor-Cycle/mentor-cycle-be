import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './../user/user.repository';
import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilityResolver } from './availability.resolver';

@Module({
  providers: [
    AvailabilityResolver,
    AvailabilityService,
    UserRepository,
    JwtService,
  ],
})
export class AvailabilityModule {}
