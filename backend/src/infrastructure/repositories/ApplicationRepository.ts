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

  async findById(applicationId: number): Promise<Application | null> {
    const data = await this.prisma.application.findUnique({
      where: { id: applicationId },
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
    if (!data) return null;
    return new Application(data);
  }

  async update(application: Application): Promise<Application> {
    const updatedData = await this.prisma.application.update({
      where: { id: application.id },
      data: {
        currentInterviewStep: application.currentInterviewStep,
      },
    });
    return new Application(updatedData);
  }
}
