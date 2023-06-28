import { getListOfAvailabilityDays } from '@modules/availability/helpers/get-date-for-weekday.helper';
import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import {
  MEETING_PROVIDER_URL,
  MENTOR_CYCLE_LOGO_URL,
} from '@common/config/constants';
import dayjs from 'dayjs';
import { render } from '@react-email/components';
import EventScheduled from '../../../emails/event-scheduled';
import { MailService } from '@common/services/mail/mail.service';
import { eventScheduledEmailProps } from '@providers/mails';
import { formatDate, formatHour } from '@common/utils/date';
import { NotificationsService } from '@modules/notifications/notifications.service';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly notificationsService: NotificationsService,
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

    const startDateFormatted = new Date(startDate);
    const endDateFormatted = new Date(endDate);

    const startDateAdjusted = new Date(startDateFormatted.getTime());
    const endDateAdjusted = new Date(endDateFormatted.getTime());

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

    const mentorFullName = `${mentorProfile.firstName} ${mentorProfile.lastName}`;
    const formattedDate = dayjs(startDate).format('DD/MM/YYYY HH:mm');
    const usersIds = users.map((user) => user.id);

    await this.notificationsService.create({
      description: `Mentoria marcada com o mentor(a) ${mentorFullName} na data ${formattedDate}`,
      imageUrl: mentorProfile.photoUrl || MENTOR_CYCLE_LOGO_URL,
      title: mentorFullName,
      notifierId: mentorProfile.id,
      usersIds,
    });

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

  async findEventsPerWeek({
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
    const currentDate = dayjs();
    const oneWeekAgo = currentDate.subtract(1, 'week');

    const eventsPerWeek = await this.prisma.event.findMany({
      where: {
        ...options,
        ...oneWeekAgo.toDate(),
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return eventsPerWeek;
  }

  async findCurrentEvents({
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

    const currentEvent = dayjs();

    const pendingEvents = await this.prisma.event.findMany({
      where: {
        ...options,
        ...currentEvent.toDate(),
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return pendingEvents;
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
      include: {
        participants: true,
      },
    });

    if (!eventExists) {
      throw new Error('Event does not exist');
    }

    const mentor = await this.prisma.user.findUnique({
      where: {
        id: eventExists.mentorId,
      },
    });

    const mentorFullName = `${mentor.firstName} ${mentor.lastName}`;
    const formattedDate = dayjs(eventExists.startDate).format(
      'DD/MM/YYYY HH:mm',
    );
    const usersIds = eventExists.participants.map(
      (participant) => participant.userId,
    );

    const updatedEvent = await this.prisma.event.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    await this.notificationsService.create({
      description: `Mentoria com o mentor(a) ${mentorFullName} na data ${formattedDate} teve o status atualizado para "${status}"`,
      imageUrl: mentor.photoUrl || MENTOR_CYCLE_LOGO_URL,
      title: mentorFullName,
      notifierId: mentor.id,
      usersIds,
    });

    return updatedEvent;
  }

  async remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
