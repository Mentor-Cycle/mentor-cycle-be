import { Inject } from "@nestjs/common";
import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
//import { AnyService } from "@modules/services"; //fix path
import { AnyService } from "../../../modules/services";
import { TestModel } from "../models/test.model";

@Resolver(() => TestModel)
export class AnyResolver {
    constructor(
        @Inject(AnyService) private anyService: AnyService
    ) {}

    @Query(returns => TestModel)
    async any(@Args('id') id: number): Promise<TestModel> {
        return await this.anyService.findOne(id)
    }

    @Mutation(returns => TestModel)
    async createAny(
        @Args('anyUniqueText') anyUniqueText: string,
        @Args('anyNonUniqueText') anyNonUniqueText: string
    ): Promise<TestModel> {
        return await this.anyService.create({ anyUniqueText, anyNonUniqueText})
    }
}