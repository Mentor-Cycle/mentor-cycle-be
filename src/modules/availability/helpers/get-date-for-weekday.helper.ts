import dayjs from 'dayjs';
import { Availability } from './../entities/availability.entity';

export function getListOfAvailabilityDays(availabilities: Availability[]) {
  return availabilities.map((availability) => {
    const startDate = getDateForWeekday(
      availability.weekDay,
      availability.startHour,
    );
    const endDate = getDateForWeekday(
      availability.weekDay,
      availability.endHour,
    );

    return {
      ...availability,
      startDate,
      endDate,
    };
  });
}
export function getDateForWeekday(weekdayIndex: number, fullHours: string) {
  const [hour, minute] = fullHours.split(':').map(Number);

  const today = dayjs();
  const currentWeekdayIndex = today.day();
  let daysToAdd = weekdayIndex - currentWeekdayIndex;
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }
  const desiredDate = today
    .add(daysToAdd, 'day')
    .startOf('day')
    .hour(hour)
    .minute(minute);

  const dateTimeString = desiredDate.format('YYYY-MM-DDTHH:mm:ss');
  return dateTimeString;
}
