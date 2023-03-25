import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [EventResolver, EventService, JwtService],
})
export class EventModule {}

// Send the Meet link to attendees' Google Calendar events
// const conferenceData = event.data.conferenceData;
// const conferenceId = conferenceData.conferenceId;
// const password = conferenceData.password;

// const attendees = [
//   { email: 'oliveirabalsa2@gmail.com' },
//   { email: 'thiagopuntar@gmail.com' },
// ];

// const eventPatch = {
//   conferenceData: {
//     conferenceId: conferenceId,
//     password: password,
//     entryPoints: [
//       {
//         entryPointType: 'video',
//         uri: `https://meet.google.com/${conferenceId}`,
//         label: 'Join the meeting',
//         pin: password,
//       },
//       {
//         entryPointType: 'more',
//         uri: `https://meet.google.com/${conferenceId}?authuser=0&hs=179&pwd=${password}`,
//         pin: password,
//       },
//     ],
//   },
// };

// for (const attendee of attendees) {
//   const eventId = await this.calendar.events.insert({
//     calendarId: attendee.email,
//     resource: eventPatch,
//     sendUpdates: 'all',
//   });
//   console.log(`Event created: ${eventId.data.id}`);
// }

// // Return the created event
// // createEventInput.learners = [{ id: learnerId }];
// return this.eventService.create(createEventInput);
