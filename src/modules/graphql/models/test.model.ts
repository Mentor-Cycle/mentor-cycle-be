import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TestModel {
    @Field()
    id: number
    @Field()
    anyUniqueText: string
    @Field()
    anyNonUniqueText: string
}