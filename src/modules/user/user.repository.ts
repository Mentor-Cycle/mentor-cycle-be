import { Prisma, PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';
import { FindMentorInput } from './dto/find-mentor.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findManyMentors(args?: FindMentorInput) {
    const searchInput = {
      ...(args?.firstName && { firstName: { contains: args.firstName } }),
      ...(args?.skills && { skills: { hasSome: args?.skills } }),
      ...(args?.period && {
        availability: {
          array_contains: [
            {
              active: true,
              period: args?.period,
            },
          ],
        },
      }),
    };
    return this.prismaService.user.findMany({
      where: {
        ...searchInput,
        isMentor: true,
      },
      skip: args?.skip || 0,
      take: args?.take || 10,
    });
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
  async findOneMentor(id: string) {
    return this.prismaService.user.findFirst({
      where: {
        id,
        isMentor: true,
      },
    });
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
