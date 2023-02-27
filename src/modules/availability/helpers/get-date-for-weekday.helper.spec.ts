import dayjs from 'dayjs';
import { Availability } from '../entities/availability.entity';
import {
  getDateForWeekday,
  getListOfAvailabilityDays,
} from './get-date-for-weekday.helper';

describe('getListOfAvailabilityDays', () => {
  it('should return an empty array if no availabilities are provided', () => {
    const availabilities: Availability[] = [];

    const result = getListOfAvailabilityDays(availabilities);

    expect(result).toEqual([]);
  });

  it('should return an array of objects with startDate and endDate properties', () => {
    const availabilities: Availability[] = [
      {
        weekDay: 0,
        active: true,
        startHour: '09:00',
        endHour: '12:00',
        id: '1',
        mentorId: '1',
      },
      {
        weekDay: 2,
        active: true,
        startHour: '15:00',
        endHour: '18:00',
        id: '1',
        mentorId: '1',
      },
    ];

    const result = getListOfAvailabilityDays(availabilities);

    expect(result).toEqual([
      {
        weekDay: 0,
        active: true,
        startHour: '09:00',
        endHour: '12:00',
        startDate: expect.any(String),
        endDate: expect.any(String),
        mentorId: '1',
        id: '1',
      },
      {
        weekDay: 2,
        active: true,
        startHour: '15:00',
        endHour: '18:00',
        startDate: expect.any(String),
        endDate: expect.any(String),
        mentorId: '1',
        id: '1',
      },
    ]);
  });

  it('should set the startDate and endDate properties to the correct dates', () => {
    const availabilities: Availability[] = [
      {
        weekDay: 0,
        active: true,
        startHour: '09:00',
        endHour: '12:00',
        id: '1',
        mentorId: '1',
      },
    ];

    const result = getListOfAvailabilityDays(availabilities);

    const startDate = dayjs(result[0].startDate);
    const endDate = dayjs(result[0].endDate);

    expect(startDate.day()).toEqual(0);
    expect(startDate.hour()).toEqual(9);
    expect(startDate.minute()).toEqual(0);
    expect(endDate.day()).toEqual(0);
    expect(endDate.hour()).toEqual(12);
    expect(endDate.minute()).toEqual(0);
  });
});

describe('getDateForWeekday', () => {
  it('should return a string in the correct format', () => {
    const result = getDateForWeekday(0, '09:00');

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00$/);
  });
});
