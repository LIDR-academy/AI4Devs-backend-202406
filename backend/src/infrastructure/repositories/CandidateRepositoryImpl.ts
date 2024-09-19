import { PrismaClient } from '@prisma/client';
import { CandidateRepository } from '../../domain/repositories/CandidateRepository';
import { CandidateDto } from '../../domain/dtos/CandidateDto';

export class CandidateRepositoryImpl implements CandidateRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    async getCandidatesByPositionId(positionId: number): Promise<CandidateDto[]> {
        const applications = await this.prisma.application.findMany({
            where: { positionId },
            include: {
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                interviews: {
                    select: {
                        score: true,
                    },
                },
                interviewStep: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return applications.map(app => {
            const fullName = `${app.candidate.firstName} ${app.candidate.lastName}`;
            const currentPhase = app.interviewStep.name;
            const averageScore = app.interviews.length > 0
                ? app.interviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / app.interviews.length
                : 0;
            
            return {
                fullName,
                currentPhase,
                averageScore: parseFloat(averageScore.toFixed(2)),
            };
        });
    }
}