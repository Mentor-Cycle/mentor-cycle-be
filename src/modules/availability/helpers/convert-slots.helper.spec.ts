import { convertAvailabilityToThirtyMinuteSlots } from './convert-slots.helper';

describe('convertAvailabilityToThirtyMinuteSlots', () => {
  const [monday, tuesday, wednesday, thursday, friday] = [0, 1, 2, 3, 4];

  it('should return an array with a single time slot if the duration is less than or equal to 30 minutes', () => {
    const timeSlots = [
      {
        weekDay: monday,
        active: true,
        startHour: '09:00',
        endHour: '09:30',
      },
    ];

    const result = convertAvailabilityToThirtyMinuteSlots(timeSlots);

    expect(result).toEqual(timeSlots);
  });

  it('should split a time slot that is longer than 30 minutes into multiple 30-minute time slots', () => {
    const timeSlots = [
      {
        weekDay: tuesday,
        active: true,
        startHour: '02:00',
        endHour: '04:30',
      },
    ];

    const result = convertAvailabilityToThirtyMinuteSlots(timeSlots);

    expect(result).toEqual([
      {
        weekDay: tuesday,
        active: true,
        startHour: '02:00',
        endHour: '02:30',
      },
      {
        weekDay: tuesday,
        active: true,
        startHour: '02:30',
        endHour: '03:00',
      },
      {
        weekDay: tuesday,
        active: true,
        startHour: '03:00',
        endHour: '03:30',
      },
      {
        weekDay: tuesday,
        active: true,
        startHour: '03:30',
        endHour: '04:00',
      },
      {
        weekDay: tuesday,
        active: true,
        startHour: '04:00',
        endHour: '04:30',
      },
    ]);
  });

  it('should split a time slot that is exactly 60 minutes into two 30-minute time slots', () => {
    const timeSlots = [
      {
        weekDay: wednesday,
        active: true,
        startHour: '09:00',
        endHour: '10:00',
      },
    ];

    const result = convertAvailabilityToThirtyMinuteSlots(timeSlots);

    expect(result).toEqual([
      {
        weekDay: wednesday,
        active: true,
        startHour: '09:00',
        endHour: '09:30',
      },
      {
        weekDay: wednesday,
        active: true,
        startHour: '09:30',
        endHour: '10:00',
      },
    ]);
  });
  it('should return an empty array if there are no time slots', () => {
    const timeSlots = [];

    const result = convertAvailabilityToThirtyMinuteSlots(timeSlots);

    expect(result).toEqual([]);
  });

  it('should not split a time slot that is exactly 30 minutes', () => {
    const timeSlots = [
      {
        weekDay: thursday,
        active: true,
        startHour: '10:00',
        endHour: '10:30',
      },
    ];

    const result = convertAvailabilityToThirtyMinuteSlots(timeSlots);

    expect(result).toEqual(timeSlots);
  });
  it('should split a time slot that is longer than 60 minutes into multiple 30-minute time slots', () => {
    const timeSlots = [
      {
        weekDay: friday,
        active: true,
        startHour: '13:00',
        endHour: '16:30',
      },
    ];

    const result = convertAvailabilityToThirtyMinuteSlots(timeSlots);

    expect(result).toEqual([
      {
        weekDay: friday,
        active: true,
        startHour: '13:00',
        endHour: '13:30',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '13:30',
        endHour: '14:00',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '14:00',
        endHour: '14:30',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '14:30',
        endHour: '15:00',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '15:00',
        endHour: '15:30',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '15:30',
        endHour: '16:00',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '16:00',
        endHour: '16:30',
      },
    ]);
  });
  it('should split multiple time slots into multiple 30-minute time slots', () => {
    const timeSlots = [
      {
        weekDay: friday,
        active: true,
        startHour: '10:00',
        endHour: '12:00',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '14:00',
        endHour: '16:30',
      },
    ];

    const result = convertAvailabilityToThirtyMinuteSlots(timeSlots);

    expect(result).toEqual([
      {
        weekDay: friday,
        active: true,
        startHour: '10:00',
        endHour: '10:30',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '10:30',
        endHour: '11:00',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '11:00',
        endHour: '11:30',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '11:30',
        endHour: '12:00',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '14:00',
        endHour: '14:30',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '14:30',
        endHour: '15:00',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '15:00',
        endHour: '15:30',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '15:30',
        endHour: '16:00',
      },
      {
        weekDay: friday,
        active: true,
        startHour: '16:00',
        endHour: '16:30',
      },
    ]);
  });
});
