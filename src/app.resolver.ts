import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class RootResolver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
