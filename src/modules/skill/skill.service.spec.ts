import { Skill } from './entities/skill.entity';
import { SkillRepository } from './skill.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { SkillService } from './skill.service';
import { PrismaService } from '@modules/prisma';

describe('SkillService', () => {
  let service: SkillService;
  let respository: SkillRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillService, SkillRepository, PrismaService],
    }).compile();

    service = module.get<SkillService>(SkillService);
    respository = module.get<SkillRepository>(SkillRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(respository).toBeDefined();
  });

  describe('findAllSkills', () => {
    it('should return an array of skills', async () => {
      const skills = [{ name: 'Front-End', id: '1' }] as Skill[];
      jest.spyOn(respository, 'findAll').mockImplementation(async () => skills);

      expect(await service.findAll()).toBe(skills);
    });
  });
});
