import { SkillRepository } from './skill.repository';
import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillResolver } from './skill.resolver';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [SkillResolver, SkillService, SkillRepository, JwtService],
})
export class SkillModule {}
