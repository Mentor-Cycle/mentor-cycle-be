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
export function getDateForWeekday(weekdayIndex, fullHours) {
  const [hour, minute] = fullHours.split(':').map(Number);
  const now = new Date();
  const currentWeekdayIndex = now.getDay();
  let daysToAdd = weekdayIndex - currentWeekdayIndex;
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }
  const desiredDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysToAdd,
  );
  desiredDate.setHours(hour);
  desiredDate.setMinutes(minute);
  desiredDate.setSeconds(0);
  const year = desiredDate.getFullYear();
  const month = (desiredDate.getMonth() + 1).toString().padStart(2, '0');
  const day = desiredDate.getDate().toString().padStart(2, '0');
  const hours = desiredDate.getHours().toString().padStart(2, '0');
  const minutes = desiredDate.getMinutes().toString().padStart(2, '0');
  const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:00`;
  return dateTimeString;
}
