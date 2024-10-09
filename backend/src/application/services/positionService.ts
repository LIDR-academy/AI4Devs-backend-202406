import { PrismaClient } from '@prisma/client';
import { Position } from '../../domain/models/Position';

const prisma = new PrismaClient();

export const getCandidatesForPosition = async (positionId: number) => {
  const position = await Position.findOne(positionId);
  if (!position) {
    throw new Error('Position not found');
  }

  const applications = await prisma.application.findMany({
    where: { positionId },
    include: {
      candidate: true,
      interviewStep: true,
      interviews: {
        select: {
          score: true,
        },
      },
    },
  });

  return applications.map((application) => {
    const averageScore =
      application.interviews.reduce((sum, interview) => sum + (interview.score || 0), 0) /
      application.interviews.length || 0;

    return {
      fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
      currentInterviewStep: application.interviewStep.name,
      averageScore: Number(averageScore.toFixed(2)),
    };
  });
};