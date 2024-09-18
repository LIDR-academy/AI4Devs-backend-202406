import { PrismaClient } from '@prisma/client';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { Candidate } from '../../domain/models/Candidate';

export class CandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Candidate | null> {
    const data = await this.prisma.candidate.findUnique({
      where: { id },
      include: {
        educations: true,
        workExperiences: true,
        resumes: true,
        applications: true,
      },
    });
    return data ? new Candidate(data) : null;
  }

  async update(candidate: Candidate): Promise<Candidate> {
    const updatedData = await this.prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        currentInterviewStep: candidate.currentInterviewStep,
      },
      include: {
        educations: true,
        workExperiences: true,
        resumes: true,
        applications: true,
      },
    });
    return new Candidate(updatedData);
  }
}
