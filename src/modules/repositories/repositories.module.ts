import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';

const Repositories = [UserRepository];

@Global()
@Module({
  providers: Repositories,
  exports: Repositories,
})
export class RepositoriesModule {}
