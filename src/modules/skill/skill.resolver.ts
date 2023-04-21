import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { Skill } from './entities/skill.entity';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@common/auth/auth.guard';

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Skill)
  createSkill(@Args('createSkillInput') createSkillInput: CreateSkillInput) {
    return this.skillService.create(createSkillInput);
  }

  @Query(() => [Skill], { name: 'findAllSkills' })
  async findAllSkills() {
    const skills = await this.skillService.findAll();
    if (!skills.length) {
      throw new HttpException('No skills found', HttpStatus.NOT_FOUND);
    }
    return skills;
  }

  @UseGuards(AuthGuard)
  @Query(() => Skill, { name: 'skill' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.skillService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Skill)
  updateSkill(@Args('updateSkillInput') updateSkillInput: UpdateSkillInput) {
    return this.skillService.update(updateSkillInput.id, updateSkillInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Skill)
  removeSkill(@Args('id', { type: () => Int }) id: number) {
    return this.skillService.remove(id);
  }
}
