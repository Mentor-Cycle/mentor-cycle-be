import { REGEX_TO_REMOVE_AM_AND_PM } from '@common/utils';
import { AvailabilityInput } from './../dto/availability.input';

export function convertAvailabilityToThirtyMinuteSlots(
  timeSlots: AvailabilityInput[],
): AvailabilityInput[] {
  return timeSlots.flatMap(splitTimeSlot);
}

function splitTimeSlot(timeSlot: AvailabilityInput): AvailabilityInput[] {
  const startDateTime = getDateTimeFromTimeString(timeSlot.startHour);
  const endDateTime = getDateTimeFromTimeString(timeSlot.endHour);
  const durationInMinutes =
    (endDateTime.getTime() - startDateTime.getTime()) / 60000;

  if (durationInMinutes <= 30) {
    return [timeSlot];
  }

  const numNewTimeSlots = Math.floor(durationInMinutes / 30);
  const minutesToAdd = durationInMinutes / numNewTimeSlots;

  let currentStartDateTime = startDateTime;
  let currentEndDateTime = new Date(
    currentStartDateTime.getTime() + minutesToAdd * 60000,
  );

  const newTimeSlots = Array.from({ length: numNewTimeSlots }, () => {
    const newStartHour = getHourStringFromDateTime(currentStartDateTime);
    const newEndHour = getHourStringFromDateTime(currentEndDateTime);

    currentStartDateTime = currentEndDateTime;
    currentEndDateTime = new Date(
      currentStartDateTime.getTime() + minutesToAdd * 60000,
    );
    return {
      weekDay: timeSlot.weekDay,
      active: timeSlot.active,
      startHour: newStartHour,
      endHour: newEndHour,
    };
  });

  // Add a final time slot to cover any remaining time
  if (currentEndDateTime < endDateTime) {
    const newStartHour = getHourStringFromDateTime(currentEndDateTime);
    const newEndHour = timeSlot.endHour;

    newTimeSlots.push({
      weekDay: timeSlot.weekDay,
      active: timeSlot.active,
      startHour: newStartHour,
      endHour: newEndHour,
    });
  }

  return newTimeSlots;
}

function getDateTimeFromTimeString(timeString: string): Date {
  const timeStringWithoutAMPM = timeString.replace(
    REGEX_TO_REMOVE_AM_AND_PM,
    '',
  );
  const [hours, minutes] = timeStringWithoutAMPM.split(':');
  const dateTimeString = `2022-01-01T${hours}:${minutes}:00`;
  return new Date(dateTimeString);
}

function getHourStringFromDateTime(dateTime: Date): string {
  const [hours, minutes] = dateTime.toISOString().substr(11, 5).split(':');
  return `${+hours - 3}:${minutes}`;
}
