import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { PrismaService } from '@modules/prisma';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNotificationInput: CreateNotificationInput) {
    const { title, description, imageUrl, usersIds } = createNotificationInput;

    return this.prisma.notification.create({
      data: {
        title,
        description,
        imageUrl,
        users: {
          connect: usersIds.map((userId) => ({
            id: userId,
          })),
        },
      },
    });
  }

  findAll({ userId }: { userId?: string }) {
    const where = {
      ...(userId && {
        users: {
          some: {
            id: userId,
          },
        },
      }),
    };

    return this.prisma.notification.findMany({
      where,
    });
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateNotificationInput: UpdateNotificationInput) {
    const { description, imageUrl, title, read } = updateNotificationInput;

    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification does not exist');
    }

    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        imageUrl,
        read,
      },
    });
  }

  async remove(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification does not exist');
    }

    return this.prisma.notification.delete({
      where: {
        id,
      },
    });
  }
}
