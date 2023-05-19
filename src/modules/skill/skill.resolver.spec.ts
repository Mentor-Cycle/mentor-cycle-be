import { HttpException } from '@nestjs/common';
import { PrismaService } from '@modules/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { SkillRepository } from './skill.repository';
import { SkillResolver } from './skill.resolver';
import { SkillService } from './skill.service';
import { JwtService } from '@nestjs/jwt';

describe('SkillResolver', () => {
  let resolver: SkillResolver;
  let service: SkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillResolver,
        SkillService,
        SkillRepository,
        PrismaService,
        JwtService,
      ],
    }).compile();

    resolver = module.get<SkillResolver>(SkillResolver);
    service = module.get<SkillService>(SkillService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAllSkills', () => {
    it('should return an array of skills', async () => {
      const skills = [{ name: 'Front-End', id: '1' }];
      jest.spyOn(service, 'findAll').mockImplementation(async () => skills);

      expect(await resolver.findAllSkills()).toBe(skills);
    });
    it('should throw an HttpException if no skills are found', async () => {
      jest.spyOn(service, 'findAll').mockImplementation(async () => []);
      await expect(resolver.findAllSkills()).rejects.toThrow(HttpException);
    });
  });
});
