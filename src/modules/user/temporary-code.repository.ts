import { Prisma, PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TemporaryCodeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getMany(args?: Prisma.TemporaryCodeFindManyArgs) {
    return this.prismaService.temporaryCode.findMany(args);
  }

  async getOne(args: Prisma.TemporaryCodeFindFirstArgs) {
    return this.prismaService.temporaryCode.findFirst(args);
  }

  async getById(id: string) {
    return this.prismaService.temporaryCode.findUnique({
      where: {
        id,
      },
    });
  }

  async create(input: Prisma.TemporaryCodeCreateInput) {
    return this.prismaService.temporaryCode.create({ data: input });
  }

  async update(
    input: Prisma.TemporaryCodeUpdateInput,
    where: Prisma.TemporaryCodeWhereUniqueInput,
  ) {
    return this.prismaService.temporaryCode.update({ data: input, where });
  }

  async count(where: Prisma.TemporaryCodeWhereInput) {
    return this.prismaService.temporaryCode.count({ where });
  }

  async delete(where: Prisma.TemporaryCodeWhereUniqueInput) {
    return this.prismaService.temporaryCode.delete({ where });
  }

  async deleteMany(where: Prisma.TemporaryCodeWhereInput) {
    return this.prismaService.temporaryCode.deleteMany({ where });
  }
}
