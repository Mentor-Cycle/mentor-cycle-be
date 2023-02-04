import { Injectable } from '@nestjs/common';
import { CreateAnyArgs } from '../../common/dtos';
import { AnyRepository } from '../repositories';

@Injectable()
export class AnyService {
  constructor(private readonly anyRepository: AnyRepository) {}

  async findOne(id: number) {
    return this.anyRepository.findOne(id);
  }

  async create(args: CreateAnyArgs) {
    return this.anyRepository.create(args);
  }
}
