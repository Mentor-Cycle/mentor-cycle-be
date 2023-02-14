import { Prisma, PrismaService } from '../../modules/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getMany(args: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(args);
  }

  async getById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUser(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({ where });
  }

  async create(input: Prisma.UserCreateInput) {
    return this.prismaService.user.create({ data: input });
  }

  async update(
    input: Prisma.UserUpdateInput,
    where: Prisma.UserWhereUniqueInput,
  ) {
    return this.prismaService.user.update({ data: input, where });
  }

  async count(where: Prisma.UserWhereInput) {
    return this.prismaService.user.count({ where });
  }
}
