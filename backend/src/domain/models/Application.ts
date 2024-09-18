import { Candidate, PrismaClient } from '@prisma/client';
import { Interview } from './Interview';
import { InterviewStep } from './InterviewStep';

const prisma = new PrismaClient();

export class Application {
  id?: number;
  positionId: number;
  candidateId: number;
  applicationDate: Date;
  currentInterviewStep: number;
  notes?: string;
  interviews: Interview[];
  candidate: Candidate;
  interviewStep: InterviewStep;

  constructor(data: any) {
    this.id = data.id;
    this.positionId = data.positionId;
    this.candidateId = data.candidateId;
    this.applicationDate = new Date(data.applicationDate);
    this.currentInterviewStep = data.currentInterviewStep;
    this.notes = data.notes;
    this.interviews = data.interviews || [];
    this.candidate = data.candidate;
    this.interviewStep = data.interviewStep;
  }

  async save() {
    const applicationData: any = {
      positionId: this.positionId,
      candidateId: this.candidateId,
      applicationDate: this.applicationDate,
      currentInterviewStep: this.currentInterviewStep,
      notes: this.notes,
    };

    if (this.id) {
      return await prisma.application.update({
        where: { id: this.id },
        data: applicationData,
      });
    } else {
      return await prisma.application.create({
        data: applicationData,
      });
    }
  }

  static async findOne(id: number): Promise<Application | null> {
    const data = await prisma.application.findUnique({
      where: { id: id },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        interviewStep: {
          select: {
            name: true,
          },
        },
        interviews: true,
      },
    });
    if (!data) return null;
    return new Application(data);
  }
}
