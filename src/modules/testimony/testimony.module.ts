import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TestimonyService } from './testimony.service';
import { TestimonyResolver } from './testimony.resolver';

@Module({
  providers: [TestimonyResolver, TestimonyService, JwtService],
})
export class TestimonyModule {}
