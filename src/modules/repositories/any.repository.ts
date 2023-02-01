import { Injectable } from "@nestjs/common";
//import { Test, Prisma, PrismaService } from '@modules/prisma' //fix path
import { Test, Prisma, PrismaService } from '../../modules/prisma'

@Injectable()
export class AnyRepository {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async create(input: Prisma.TestCreateArgs['data']){
        return this.prismaService.test.create({ data: input })
    }

    async findOne(id: number){
        return this.prismaService.test.findUnique({ where: { id }})
    }
}
