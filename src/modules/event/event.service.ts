import { Availability } from '@modules/availability/entities/availability.entity';
import { getListOfAvailabilityDays } from '@modules/availability/helpers/get-date-for-weekday.helper';
import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { MEETING_PROVIDER_URL } from '@common/config/constants';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEventInput: CreateEventInput) {
    const { mentorId, startDate, endDate, learnerId, active } =
      createEventInput;
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: [learnerId, mentorId],
        },
      },
    });
    if (users.length !== 2) {
      throw new Error('One of the users does not exist');
    }
    const eventAtThisTimeAlreadyExists = await this.prisma.event.findMany({
      where: {
        mentorId,
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        },
      },
    });
    if (eventAtThisTimeAlreadyExists.length) {
      throw new Error('Event already exists at this time');
    }
    const mentorProfile = users.find((user) => user.isMentor);
    const mentorAvailabilityDates = getListOfAvailabilityDays(
      mentorProfile.availability as unknown as Availability[],
    );
    const isPossibleToSchedule = mentorAvailabilityDates.find(
      (avl) => avl.startDate === createEventInput.startDate,
    );
    if (!isPossibleToSchedule) {
      throw new Error('Mentor is not available at this time');
    }
    const meetingLink = `${MEETING_PROVIDER_URL}/mentor-cycle-${mentorId}-${learnerId}`;
    return this.prisma.event.create({
      data: {
        mentorId,
        startDate,
        endDate,
        active,
        meetingLink,
        learners: {
          create: [
            {
              assignedBy: 'mentor',
              assignedAt: new Date(),
              user: {
                connect: {
                  id: learnerId,
                },
              },
            },
          ],
        },
      },
    });
  }

  async findAll({
    learnerId,
    mentorId,
  }: {
    learnerId?: string;
    mentorId?: string;
  }) {
    const options = {
      ...(mentorId && {
        mentorId,
      }),
      ...(learnerId && {
        learners: {
          some: {
            user: {
              id: learnerId,
            },
          },
        },
      }),
    };
    return this.prisma.event.findMany({
      where: options,
      include: {
        learners: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        learners: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async update(id: string, updateEventInput: UpdateEventInput) {
    const { status } = updateEventInput;

    const eventExists = await this.prisma.event.findUnique({
      where: {
        id,
      },
    });

    if (!eventExists) {
      throw new Error('Event does not exist');
    }

    return this.prisma.event.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
