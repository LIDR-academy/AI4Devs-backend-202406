import { Position } from '../../domain/models/Position';
import { Application } from '../../domain/models/Application';
import { Candidate } from '../../domain/models/Candidate';
import { Interview } from '../../domain/models/Interview';

export const getCandidatesForPosition = async (positionId: number) => {
  console.log('Searching for position with ID:', positionId);
  const position = await Position.findOne(positionId);
  console.log('Position found:', position);
  if (!position) {
    throw new Error('Position not found');
  }

  const applications = await Application.findByPositionId(positionId);

  const candidatesData = await Promise.all(
    applications.map(async (app) => {
      const candidate = await Candidate.findOne(app.candidateId);
      const interviews = await Interview.findByApplicationId(app.id!);

      const averageScore =
        interviews.length > 0
          ? interviews.reduce(
              (sum, interview) => sum + (interview.score || 0),
              0,
            ) / interviews.length
          : null;

      return {
        candidateId: candidate!.id,
        fullName: `${candidate!.firstName} ${candidate!.lastName}`,
        currentInterviewStep: app.currentInterviewStep,
        averageScore: averageScore,
      };
    }),
  );

  return candidatesData;
};
