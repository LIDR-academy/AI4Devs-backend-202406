import { Application } from '../../domain/models/Application';

export const getCandidatesForPosition = async (positionId: number) => {
  try {
    const applications = await Application.getApplicationsByPositionId(positionId);

    const result = applications.map(app => {
      const averageScore = app.interviews.length > 0
        ? app.interviews.reduce((sum, interview) => sum + (interview.score || 0), 0) / app.interviews.length
        : null;

      return {
        fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
        currentInterviewStep: app.interviewStep.name,
        averageScore: averageScore,
      };
    });

    return result;
  } catch (error) {
    console.error('Error al recuperar candidatos para la posición:', error);
    throw new Error('Error al recuperar candidatos para la posición');
  }
};
