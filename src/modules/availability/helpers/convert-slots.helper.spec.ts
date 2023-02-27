import { AvailabilityInput } from '../dto/availability.input';
import {
  convertAvailabilityToThirtyMinuteSlots,
  generateDate,
  getDateTimeFromTimeString,
  getHourStringFromDateTime,
  splitTimeSlot,
} from './convert-slots.helper';

describe('convertAvailabilityToThirtyMinuteSlots', () => {
  test('returns an array of availability slots split into 30-minute slots', () => {
    const timeSlots = [
      {
        weekDay: 1,
        active: true,
        startHour: '09:00',
        endHour: '10:30',
      },
      {
        weekDay: 2,
        active: true,
        startHour: '13:30',
        endHour: '16:00',
      },
    ];

    const expectedOutput = [
      {
        weekDay: 1,
        active: true,
        startHour: '09:00',
        endHour: '09:30',
      },
      {
        weekDay: 1,
        active: true,
        startHour: '09:30',
        endHour: '10:00',
      },
      {
        weekDay: 1,
        active: true,
        startHour: '10:00',
        endHour: '10:30',
      },
      {
        weekDay: 2,
        active: true,
        startHour: '13:30',
        endHour: '14:00',
      },
      {
        weekDay: 2,
        active: true,
        startHour: '14:00',
        endHour: '14:30',
      },
      {
        weekDay: 2,
        active: true,
        startHour: '14:30',
        endHour: '15:00',
      },
      {
        weekDay: 2,
        active: true,
        startHour: '15:00',
        endHour: '15:30',
      },
      {
        weekDay: 2,
        active: true,
        startHour: '15:30',
        endHour: '16:00',
      },
    ];

    expect(convertAvailabilityToThirtyMinuteSlots(timeSlots)).toEqual(
      expectedOutput,
    );
  });
});

describe('splitTimeSlot', () => {
  const inputTimeSlot: AvailabilityInput = {
    weekDay: 1,
    active: true,
    startHour: '09:00',
    endHour: '11:30',
  };

  test('returns an array of AvailabilityInput objects with correct weekDay and active properties', () => {
    const newTimeSlots = splitTimeSlot(inputTimeSlot);

    newTimeSlots.forEach((timeSlot) => {
      expect(timeSlot.weekDay).toBeGreaterThanOrEqual(0);
      expect(timeSlot.weekDay).toBeLessThanOrEqual(6);
      expect(timeSlot.active).toBe(true);
    });
  });

  test('returns an array of AvailabilityInput objects with hours in 24-hour format', () => {
    const newTimeSlots = splitTimeSlot(inputTimeSlot);

    newTimeSlots.forEach((timeSlot) => {
      const startHourRegex = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
      const endHourRegex = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
      expect(timeSlot.startHour).toMatch(startHourRegex);
      expect(timeSlot.endHour).toMatch(endHourRegex);
    });
  });

  test('returns an array of AvailabilityInput objects with correct time intervals', () => {
    const newTimeSlots = splitTimeSlot(inputTimeSlot);

    const expectedTimeSlots = [
      {
        weekDay: 1,
        active: true,
        startHour: '09:00',
        endHour: '09:30',
      },
      {
        weekDay: 1,
        active: true,
        startHour: '09:30',
        endHour: '10:00',
      },
      {
        weekDay: 1,
        active: true,
        startHour: '10:00',
        endHour: '10:30',
      },
      {
        weekDay: 1,
        active: true,
        startHour: '10:30',
        endHour: '11:00',
      },
      {
        weekDay: 1,
        active: true,
        startHour: '11:00',
        endHour: '11:30',
      },
    ];

    expect(newTimeSlots).toEqual(expectedTimeSlots);
  });
});

describe('getDateTimeFromTimeString', () => {
  test('should parse a valid time string to a Date object', () => {
    const hours = '09';
    const minutes = '30';
    const expectedDateTime = new Date(generateDate(hours, minutes));
    expect(getDateTimeFromTimeString(`${hours}:${minutes}`)).toEqual(
      expectedDateTime,
    );
  });
});

describe('getHourStringFromDateTime', () => {
  test('should generate a valid hour string from a Date object', () => {
    const dateTime = new Date('2022-03-01T09:30:00.000Z');
    const expectedHourString = '06:30';
    expect(getHourStringFromDateTime(dateTime)).toEqual(expectedHourString);
  });
});
