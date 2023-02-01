import { Resolvers } from './resolvers'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as GQLModule } from '@nestjs/graphql';
import { AnyService } from '../services';
import { AnyRepository } from '../repositories';

@Module({
  imports: [
    GQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
  ],
  providers: [ AnyService, AnyRepository, ...Resolvers]
})
export class GraphQLModule {}
