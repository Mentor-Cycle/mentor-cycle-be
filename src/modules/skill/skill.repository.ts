import { PrismaService } from '@modules/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SkillRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll() {
    return await this.prismaService.skill.findMany();
  }
}
('');
