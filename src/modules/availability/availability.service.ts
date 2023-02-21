import { PrismaService } from '@modules/prisma';
import { NotFoundError } from '@common/errors';
import { UserRepository } from '@modules/user/user.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateAvailabilityInput } from './dto/create-availability.input';
import { UpdateAvailabilityInput } from './dto/update-availability.input';
import { Availability } from './entities/availability.entity';
import { convertAvailabilityToThirtyMinuteSlots } from './helpers/convert-slots.helper';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(createAvailabilityInput: CreateAvailabilityInput) {
    const mentor = await this.userRepository.getById(
      createAvailabilityInput.mentorId,
    );
    if (!mentor) {
      throw new NotFoundError({
        field: 'user',
      });
    }

    if (!mentor.isMentor) {
      throw new Error('user is not a mentor');
    }

    const availabilities = createAvailabilityInput.availabilities;
    if (!Array.isArray(availabilities)) {
      throw new Error('availabilities must be an array');
    }

    mentor.availability = convertAvailabilityToThirtyMinuteSlots(
      availabilities as unknown as Availability[],
    ) as unknown as Prisma.JsonValue;
    return this.userRepository.update(mentor, { id: mentor.id });
  }

  findOne(mentorId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: mentorId,
      },
    });
  }

  update(id: number, updateAvailabilityInput: UpdateAvailabilityInput) {
    return `This action updates a #${id} availability`;
  }

  remove(id: number) {
    return `This action removes a #${id} availability`;
  }
}
