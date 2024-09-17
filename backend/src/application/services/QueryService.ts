import { GetCandidatesByPositionIdQuery } from '../queries/GetCandidatesByPositionIdQuery';
import { GetCandidatesByPositionIdHandler } from '../handlers/GetCandidatesByPositionIdHandler';
import { CandidateRepositoryImpl } from '../../infrastructure/repositories/CandidateRepositoryImpl';
import { PrismaClient } from '@prisma/client';

export class QueryService {
    private prisma: PrismaClient;
    private candidateRepository: CandidateRepositoryImpl;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
        this.candidateRepository = new CandidateRepositoryImpl(this.prisma);
    }

    async executeGetCandidatesByPositionId(positionId: number) {
        const query = new GetCandidatesByPositionIdQuery(positionId);
        const handler = new GetCandidatesByPositionIdHandler(this.candidateRepository);
        return await handler.handle(query);
    }
}