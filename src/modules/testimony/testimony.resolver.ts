import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TestimonyService } from './testimony.service';
import { Testimony } from './entities/testimony.entity';
import { CreateTestimonyInput } from './dto/create-testimony.input';
import { UpdateTestimonyInput } from './dto/update-tesimony.input';
import { CreateTestimonyOutput } from './dto/create-testimony.output';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@common/auth/auth.guard';

@Resolver(() => Testimony)
export class TestimonyResolver {
  constructor(private readonly testimonyService: TestimonyService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Testimony)
  createTestimony(
    @Args('createTestimonyInput') createTestimonyInput: CreateTestimonyInput,
  ) {
    return this.testimonyService.create(createTestimonyInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => [CreateTestimonyOutput], { name: 'findTestimonies' })
  findAll(
    @Args('learnerId', { nullable: true }) learnerId?: string,
    @Args('mentorId', { nullable: true }) mentorId?: string,
  ) {
    return this.testimonyService.findAll({ learnerId, mentorId });
  }

  @UseGuards(AuthGuard)
  @Query(() => [CreateTestimonyOutput], { name: 'findOneTestimony' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.testimonyService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Testimony)
  updateTestimony(
    @Args('UpdateTestimonyInput') updateTestimonyInput: UpdateTestimonyInput,
  ) {
    return this.testimonyService.update(
      updateTestimonyInput.id,
      updateTestimonyInput,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Testimony)
  deleteTestimony(@Args('id', { type: () => Int }) id: string) {
    return this.testimonyService.delete(id);
  }
}
