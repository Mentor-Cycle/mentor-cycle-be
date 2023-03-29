import { Injectable } from '@nestjs/common';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { SkillRepository } from './skill.repository';

@Injectable()
export class SkillService {
  constructor(private readonly skillRepository: SkillRepository) {}
  create(createSkillInput: CreateSkillInput) {
    return 'This action adds a new skill';
  }

  findAll() {
    return this.skillRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number, updateSkillInput: UpdateSkillInput) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
