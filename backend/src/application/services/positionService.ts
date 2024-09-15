import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCandidatesForPosition = async (positionId: number) => {
  const candidates = await prisma.application.findMany({
    where: {
      positionId: positionId,
    },
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
      interviews: {
        select: {
          score: true,
        },
      },
    },
  });

  return candidates.map((application) => {
    const averageScore = application.interviews.length > 0
      ? application.interviews.reduce((sum, interview) => sum + (interview.score || 0), 0) / application.interviews.length
      : null;

    return {
      fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
      currentInterviewStep: application.interviewStep.name,
      averageScore: averageScore,
    };
  });
};
