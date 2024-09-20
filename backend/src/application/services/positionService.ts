import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findCandidatesByPositionId = async (positionId: number) => {
	const applications = await prisma.application.findMany({
		where: { positionId },
		include: {
			candidate: true,
			interviews: true,
			interviewStep: true,
		},
	});

	if (!applications.length) {
		return null;
	}

	return applications.map(app => ({
		fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
		currentInterviewStep: app.interviewStep.name,
		averageScore: app.interviews.reduce((acc, interview) => acc + (interview.score || 0), 0) / app.interviews.length,
	}));
};

export const updateInterviewStepService = async (positionId: number, candidateId: number, stepId: number) => {
  const application = await prisma.application.findFirst({
      where: { positionId, candidateId },
  });

  if (!application) {
      return null;
  }

  const interviewStep = await prisma.interviewStep.findUnique({
      where: { id: stepId },
  });

  if (!interviewStep) {
    return null;
  }

  return await prisma.application.update({
      where: { id: application.id },
      data: { currentInterviewStep: stepId },
  });
};
