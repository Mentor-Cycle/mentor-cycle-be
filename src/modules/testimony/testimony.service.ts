import { PrismaService } from '@modules/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestimonyInput } from './dto/create-testimony.input';
import { UpdateTestimonyInput } from './dto/update-tesimony.input';

@Injectable()
export class TestimonyService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTestimonyInput: CreateTestimonyInput) {
    const { mentorId, learnerId, text } = createTestimonyInput;
    const testimony = await this.prisma.testimony.create({
      data: {
        mentorId,
        learnerId,
        text,
      },
    });
    return testimony;
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
        learnerId,
      }),
    };
    const testimonies = await this.prisma.testimony.findMany({
      where: options,
    });
    return testimonies.map((testimony) => {
      return testimony;
    });
  }

  async findOne(id: string) {
    return this.prisma.testimony.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateTestimonyInput: UpdateTestimonyInput) {
    const { learnerId, mentorId, text } = updateTestimonyInput;
    const testimony = await this.prisma.testimony.findUnique({
      where: {
        id,
      },
    });

    if (!testimony) throw new NotFoundException('Testimony does not exist');

    const updatedTestimony = await this.prisma.testimony.update({
      where: {
        id,
      },
      data: {
        learnerId,
        mentorId,
        text,
      },
    });
    return updatedTestimony;
  }

  async delete(id: string) {
    const testimony = await this.prisma.testimony.findUnique({
      where: {
        id,
      },
    });
    if (!testimony) throw new NotFoundException('testimony does not exist');

    await this.prisma.testimony.delete({
      where: {
        id,
      },
    });

    return true;
  }
}
