import { Prisma, PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';
import { FindMentorInput } from './dto/find-mentor.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findManyMentors(args?: FindMentorInput) {
    const searchInput: any = {
      ...(args?.skills && { skills: { hasSome: args.skills } }),
      ...(args?.period && {
        availability: {
          array_contains: [
            {
              period: args?.period,
            },
          ],
        },
      }),
      availability: {
        array_contains: [{ active: true }],
      },
    };

    if (args?.firstName) {
      searchInput.firstName = {
        contains: args.firstName,
        mode: 'insensitive',
      };
    }

    return this.prismaService.user.findMany({
      where: {
        ...searchInput,
        isMentor: true,
        active: true,
      },
      skip: args?.skip || 0,
      take: args?.take || 10,
    });
  }

  async getById(id: string) {
    return this.prismaService.user.findFirstOrThrow({
      where: {
        id,
        active: true,
      },
    });
  }

  async getByEmail(email: string) {
    return this.prismaService.user.findFirstOrThrow({
      where: {
        email,
        active: true,
      },
    });
  }

  async getUser(where: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findFirstOrThrow({ where });
  }
  async findOneMentor(id: string) {
    return this.prismaService.user.findFirst({
      where: {
        id,
        isMentor: true,
        active: true,
      },
    });
  }

  async create(input: Prisma.UserCreateInput) {
    return this.prismaService.user.create({ data: input });
  }

  async update(
    input: Omit<Prisma.UserUpdateInput, 'id' | 'isMentor' | 'email'>,
    where: Prisma.UserWhereUniqueInput,
  ) {
    return this.prismaService.user.update({ data: input, where });
  }

  async count(where: Prisma.UserWhereInput) {
    return this.prismaService.user.count({ where });
  }
}
