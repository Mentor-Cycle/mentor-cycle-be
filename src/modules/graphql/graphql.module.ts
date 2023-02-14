import { Resolvers } from './resolvers';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as GQLModule } from '@nestjs/graphql';
import { UserService } from '@modules/services';
import { UserRepository } from '@modules/repositories';
import { JwtService } from '@nestjs/jwt';
import { CryptService } from '@common/services/crypt';

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
