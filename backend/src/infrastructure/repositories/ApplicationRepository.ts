import { PrismaClient } from '@prisma/client';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { Application } from '../../domain/models/Application';

export class ApplicationRepository implements IApplicationRepository {
  constructor(private prisma: PrismaClient) {}

  async findByPositionId(positionId: number): Promise<Application[]> {
    const applications = await this.prisma.application.findMany({
      where: { positionId },
      include: {
        candidate: true,
        interviewStep: true,
        interviews: {
          include: {
            interviewStep: true,
          },
        },
      },
    });
    return applications.map((app) => new Application(app));
  }
}
