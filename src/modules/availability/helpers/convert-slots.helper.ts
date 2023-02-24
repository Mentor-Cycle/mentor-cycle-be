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
  if (currentEndDateTime < endDateTime) {
    const newStartHour = getHourStringFromDateTime(currentEndDateTime);
    const newEndHour = timeSlot.endHour.padStart(5, '0');

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
  const dateTimeString = generateDate(hours, minutes);
  return new Date(dateTimeString);
}
function getHourStringFromDateTime(dateTime: Date): string {
  const isoString = dateTime.toISOString();
  const hours = isoString.substring(11, 13);
  const minutes = isoString.substring(14, 16);
  const hourSum = String(+hours - 3);

  return `${hourSum.padStart(2, '0')}:${minutes}`;
}
function generateDate(hours: string, minutes: string) {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}
