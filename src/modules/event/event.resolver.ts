import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { CreateEventOutput } from './dto/create-event.output';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@common/auth/auth.guard';
import { google } from 'googleapis';

@Resolver(() => Event)
export class EventResolver {
  private readonly calendar: any;
  constructor(private readonly eventService: EventService) {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    // Set up the Google Calendar API client with credentials from the environment variables
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/calendar'],
      process.env.GOOGLE_AUTHORIZED_EMAIL,
      process.env.GOOGLE_SECRET_ACCOUNT_CLIENT_ID,
    );
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  @Mutation(() => Event)
  async createGoogleEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ) {
    const { startDate, endDate, learnerId, mentorId } = createEventInput;
    const event: any = await this.calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: {
        summary: 'dummy',
        location: 'dummy',
        description: 'dummy',
        start: {
          dateTime: '2023-08-10T10:00:00-03:00',
        },
        end: {
          dateTime: '2023-08-10T11:00:00-03:00',
        },
        attendees: [
          { email: 'leonardo@mentorcycle.com' },
          { email: 'oliveirabalsa2@gmail.com' },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
        conferenceData: {
          createRequest: {
            requestId: '1234',
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
          entryPoints: [
            {
              entryPointType: 'video',
              accessCode: 'RRRR',
              meetingCode: 'RRRR',
            },
          ],
        },
      },
      conferenceDataVersion: 1,
    });

    return console.log(event.data);
  }

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
