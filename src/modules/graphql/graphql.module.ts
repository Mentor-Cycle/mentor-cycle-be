import { Resolvers } from './resolvers';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as GQLModule } from '@nestjs/graphql';
import { AnyService, UserService } from '../services';
import { AnyRepository, UserRepository } from '../repositories';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from 'src/common/services/crypt';

@Module({
  imports: [
    GQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
  ],
  providers: [
    AnyService,
    UserService,
    JwtService,
    CryptService,
    UserRepository,
    AnyRepository,
    ...Resolvers,
  ],
})
export class GraphQLModule {}
