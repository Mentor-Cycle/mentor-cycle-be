import { getListOfAvailabilityDays } from '@modules/availability/helpers/get-date-for-weekday.helper';
import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { MEETING_PROVIDER_URL } from '@common/config/constants';
import dayjs from 'dayjs';
import { render } from '@react-email/components';
import EventScheduled from '../../../emails/event-scheduled';
import { MailService } from '@common/services/mail/mail.service';
import { eventScheduledEmailProps } from '@providers/mails';
import { formatDate, formatHour } from '@common/utils/date';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}
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
        status: {
          not: 'CANCELLED',
        },
      },
    });
    if (eventAtThisTimeAlreadyExists.length) {
      throw new Error('Event already exists at this time');
    }
    const mentorProfile = users.find((user) => user.isMentor);
    const userProfile = users.find((user) => !user.isMentor);
    const mentorAvailabilityDates = getListOfAvailabilityDays(
      mentorProfile.availability as unknown as any,
    );

    const isPossibleToSchedule = mentorAvailabilityDates.find((avl) => {
      return avl.startDate === createEventInput.startDate;
    });

    if (!isPossibleToSchedule) {
      throw new Error('Mentor is not available at this time');
    }
    const meetingLink = `${MEETING_PROVIDER_URL}/mentor-cycle-${mentorId}-${learnerId}`;
    const res = await this.prisma.event.create({
      data: {
        mentorId,
        startDate,
        endDate,
        active,
        meetingLink,
        participants: {
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
            {
              assignedBy: 'mentor',
              assignedAt: new Date(),
              user: {
                connect: {
                  id: mentorId,
                },
              },
            },
          ],
        },
      },
    });

    const startDateFormated = new Date(startDate);
    const endDateFormated = new Date(endDate);

    const startDateAdjusted = new Date(
      startDateFormated.getTime() - 3 * 60 * 60 * 1000,
    );
    const endDateAdjusted = new Date(
      endDateFormated.getTime() - 3 * 60 * 60 * 1000,
    );

    const googleStartDate = startDateAdjusted
      .toISOString()
      .replace(/[-:]/g, '')
      .slice(0, -5);
    const googleEndDate = endDateAdjusted
      .toISOString()
      .replace(/[-:]/g, '')
      .slice(0, -5);
    const googleLink = `https://www.google.com/calendar/render?action=TEMPLATE&dates=${encodeURIComponent(
      googleStartDate,
    )}/${encodeURIComponent(googleEndDate)}&text=${encodeURIComponent(
      `Mentoria com o ${mentorProfile.firstName}`,
    )}&details=${encodeURIComponent(`Link de acesso ${meetingLink}`)}`;

    const html = render(
      EventScheduled({
        mentor: mentorProfile.firstName,
        learner: userProfile.firstName,
        hour: formatHour(new Date(startDate)),
        date: formatDate(new Date(startDate)),
        googleLink,
        meetingLink,
      }),
    );

    for (const { email, firstName: name } of users) {
      this.mailService.sendMail({
        to: {
          name,
          email,
        },
        ...eventScheduledEmailProps(html),
      });
    }

    return res;
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
        participants: {
          some: {
            user: {
              id: learnerId,
            },
          },
        },
      }),
    };
    const events = await this.prisma.event.findMany({
      where: options,
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    const currentTime = dayjs();

    return events.map((event) => {
      if (dayjs(event.startDate).isBefore(currentTime)) {
        event.status = 'DONE';
      }
      return event;
    });
  }

  async findOne(id: string) {
    return this.prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        participants: {
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
