import { Injectable } from '@nestjs/common';
import { CreateRecommendationInput } from './dto/create-recommendation.input';
import { PrismaService } from '../prisma';

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(newRecommendation: CreateRecommendationInput) {
    return await this.prisma.recommendation.create({ data: newRecommendation });
  }
}
