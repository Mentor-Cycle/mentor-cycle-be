import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { CreateEventOutput } from './dto/create-event.output';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@common/auth/auth.guard';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Mutation(() => Event)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventService.create(createEventInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => [CreateEventOutput], { name: 'findEvents' })
  findAll(
    @Args('learnerId', { nullable: true }) learnerId?: string,
    @Args('mentorId', { nullable: true }) mentorId?: string,
  ) {
    return this.eventService.findAll({ learnerId, mentorId });
  }

  @Query(() => CreateEventOutput, { name: 'findOneEvent' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.eventService.findOne(id);
  }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventService.update(updateEventInput.id, updateEventInput);
  }

  @Mutation(() => Event)
  removeEvent(@Args('id', { type: () => Int }) id: number) {
    return this.eventService.remove(id);
  }
}
