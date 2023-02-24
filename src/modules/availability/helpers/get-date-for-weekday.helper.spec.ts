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

    const startDate = new Date(result[0].startDate);
    const endDate = new Date(result[0].endDate);

    expect(startDate.getDay()).toEqual(0);
    expect(startDate.getHours()).toEqual(9);
    expect(startDate.getMinutes()).toEqual(0);
    expect(endDate.getDay()).toEqual(0);
    expect(endDate.getHours()).toEqual(12);
    expect(endDate.getMinutes()).toEqual(0);
  });
});

describe('getDateForWeekday', () => {
  it('should return a string in the correct format', () => {
    const result = getDateForWeekday(0, '09:00');

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00$/);
  });

  it('should return the correct date for the next week if the weekday index is earlier in the week than the current weekday index', () => {
    const result = getDateForWeekday(2, '11:45');

    const expectedDate = new Date();
    expectedDate.setDate(
      expectedDate.getDate() + (2 - expectedDate.getDay() + 7),
    );
    expectedDate.setHours(11);
    expectedDate.setMinutes(45);
    expectedDate.setSeconds(0);
    const [received, expected] = [new Date(result), expectedDate].map(
      (item) => String(item).split('.')[0],
    );

    expect(received).toEqual(expected);
  });
});
