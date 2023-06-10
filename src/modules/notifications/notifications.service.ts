import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { PrismaService } from '@modules/prisma';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNotificationInput: CreateNotificationInput) {
    const { title, description, imageUrl, notifierId, usersIds } =
      createNotificationInput;

    return this.prisma.notificationData.create({
      data: {
        title,
        description,
        imageUrl,
        notifierId,
        notifications: {
          createMany: {
            data: usersIds.map((userId) => ({
              userId,
            })),
          },
        },
      },
    });
  }

  findAll({ userId }: { userId?: string }) {
    return this.prisma.notification.findMany({
      where: {
        ...(userId && { userId }),
      },
      include: {
        data: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.notification.findUnique({
      where: {
        id,
      },
      include: {
        data: true,
      },
    });
  }

  async update(id: string, updateNotificationInput: UpdateNotificationInput) {
    const { description, imageUrl, title, notifierId } =
      updateNotificationInput;

    const notification = await this.prisma.notificationData.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification does not exist');
    }

    return this.prisma.notificationData.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        imageUrl,
        notifierId,
      },
    });
  }

  async markRead(id: string) {
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
        read: true,
      },
    });
  }

  async remove(id: string) {
    const notification = await this.prisma.notificationData.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification does not exist');
    }

    await this.prisma.notificationData.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
