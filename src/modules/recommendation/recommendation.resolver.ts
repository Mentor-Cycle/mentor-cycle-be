import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Recommendation } from './entities/recommendation.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@common/auth/auth.guard';
import { CreateRecommendationInput } from './dto/create-recommendation.input';
import { RecommendationService } from './recommendation.service';

@Resolver(() => Recommendation)
export class RecommendationResolver {
  constructor(private readonly recommendationService: RecommendationService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Recommendation)
  createRecommendation(
    @Args('createRecommendationInput')
    createRecommendationInput: CreateRecommendationInput,
  ) {
    return this.recommendationService.create(createRecommendationInput);
  }
}
