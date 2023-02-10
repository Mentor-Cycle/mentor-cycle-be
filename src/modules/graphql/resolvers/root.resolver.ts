import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class RootResolver {
  constructor() {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
