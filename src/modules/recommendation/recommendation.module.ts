import { Module } from '@nestjs/common';
import { RecommendationResolver } from './recommendation.resolver';
import { JwtService } from '@nestjs/jwt';
import { RecommendationService } from './recommendation.service';

@Module({
  providers: [RecommendationResolver, RecommendationService, JwtService],
})
export class RecommendationModule {}
