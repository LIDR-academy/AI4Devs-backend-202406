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
