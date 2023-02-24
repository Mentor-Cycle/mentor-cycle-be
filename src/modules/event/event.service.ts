import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEventInput: CreateEventInput) {
    const { mentorId, startDate, endDate, learnerId, active } =
      createEventInput;
    const users = await this.prisma.user.count({
      where: {
        id: {
          in: [learnerId, mentorId],
        },
      },
    });
    if (users !== 2) {
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
    return this.prisma.event.create({
      data: {
        mentorId,
        startDate,
        endDate,
        active,
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

  update(id: string, updateEventInput: UpdateEventInput) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
