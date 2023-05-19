import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AvailabilityService } from './availability.service';
import { Availability } from './entities/availability.entity';
import { CreateAvailabilityInput } from './dto/create-availability.input';
import { UpdateAvailabilityInput } from './dto/update-availability.input';
import { User } from '@modules/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@common/auth/auth.guard';

@Resolver(() => Availability)
export class AvailabilityResolver {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  createAvailability(
    @Args('createAvailabilityInput')
    createAvailabilityInput: CreateAvailabilityInput,
  ) {
    return this.availabilityService.create(createAvailabilityInput);
  }
  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'findMentorAvailability' })
  findOne(@Args('mentorId', { type: () => String }) mentorId: string) {
    return this.availabilityService.findOne(mentorId);
  }
  @UseGuards(AuthGuard)
  @Mutation(() => Availability)
  updateAvailability(
    @Args('updateAvailabilityInput')
    updateAvailabilityInput: UpdateAvailabilityInput,
  ) {
    return this.availabilityService.update(
      updateAvailabilityInput.id,
      updateAvailabilityInput,
    );
  }
  @UseGuards(AuthGuard)
  @Mutation(() => Availability)
  removeAvailability(@Args('id', { type: () => Int }) id: number) {
    return this.availabilityService.remove(id);
  }
}
