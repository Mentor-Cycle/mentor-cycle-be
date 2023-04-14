import dayjs from 'dayjs';
import { REGEX_TO_REMOVE_AM_AND_PM } from '@common/utils';
import { AvailabilityInput } from './../dto/availability.input';
import { PeriodEnum } from '@modules/user/dto/find-mentor.dto';

function convertAvailabilityToThirtyMinuteSlots(
  timeSlots: AvailabilityInput[],
): AvailabilityInput[] {
  return timeSlots.flatMap(splitTimeSlot);
}
export function splitTimeSlot(
  timeSlot: AvailabilityInput,
): AvailabilityInput[] {
  const startDateTime = getDateTimeFromTimeString(timeSlot.startHour);
  const endDateTime = getDateTimeFromTimeString(timeSlot.endHour);
  const durationInMinutes =
    (endDateTime.valueOf() - startDateTime.valueOf()) / 60000;
  if (durationInMinutes <= 30) {
    return [timeSlot];
  }
  const numNewTimeSlots = Math.floor(durationInMinutes / 30);
  const minutesToAdd = durationInMinutes / numNewTimeSlots;
  let currentStartDateTime = startDateTime;
  let currentEndDateTime = currentStartDateTime.add(minutesToAdd, 'minute');
  const period = getAvailabilityPeriodBasedOnStartHour(timeSlot.startHour);
  const newTimeSlots = Array.from({ length: numNewTimeSlots }, () => {
    const newStartHour = currentStartDateTime.format('HH:mm');
    const newEndHour = currentEndDateTime.format('HH:mm');
    currentStartDateTime = currentEndDateTime;
    currentEndDateTime = currentStartDateTime.add(minutesToAdd, 'minute');
    return {
      weekDay: timeSlot.weekDay,
      active: timeSlot.active,
      startHour: newStartHour,
      endHour: newEndHour,
      period,
    };
  });
  if (currentEndDateTime.isBefore(endDateTime)) {
    const newStartHour = currentEndDateTime.format('HH:mm');
    const newEndHour = timeSlot.endHour.padStart(5, '0');
    newTimeSlots.push({
      weekDay: timeSlot.weekDay,
      active: timeSlot.active,
      startHour: newStartHour,
      endHour: newEndHour,
      period,
    });
  }
  return newTimeSlots;
}

function getDateTimeFromTimeString(timeString: string): dayjs.Dayjs {
  const timeStringWithoutAMPM = timeString.replace(
    REGEX_TO_REMOVE_AM_AND_PM,
    '',
  );
  const [hours, minutes] = timeStringWithoutAMPM.split(':');
  const dateTimeString = generateDate(hours, minutes);
  return dayjs(dateTimeString, 'YYYY-MM-DDTHH:mm:ss');
}

function generateDate(hours: string, minutes: string) {
  const now = dayjs();
  const year = now.year();
  const month = (now.month() + 1).toString().padStart(2, '0');
  const day = now.date().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function getAvailabilityPeriodBasedOnStartHour(startHour: string) {
  const startHourNumber = parseInt(startHour.split(':')[0]);
  if (startHourNumber < 11) {
    return PeriodEnum.MORNING;
  }
  if (startHourNumber < 18) {
    return PeriodEnum.AFTERNOON;
  }
  return PeriodEnum.EVENING;
}

export { convertAvailabilityToThirtyMinuteSlots };
