import { Resolvers } from './resolvers';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as GQLModule } from '@nestjs/graphql';
import { UserService } from '../services';
import { UserRepository } from '../repositories';
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
    UserService,
    JwtService,
    CryptService,
    UserRepository,
    ...Resolvers,
  ],
})
export class GraphQLModule {}
