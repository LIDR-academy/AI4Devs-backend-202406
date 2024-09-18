import { Application } from '../models/Application';
import { CandidateDTO } from '../dto/CandidateDTO';

export class ApplicationMapper {
  static toCandidateDTO(application: Application): CandidateDTO {
    const averageScore = ApplicationMapper.calculateAverageScore(
      application.interviews,
    );
    return {
      fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
      currentInterviewStep: application.interviewStep.name,
      averageScore: averageScore,
    };
  }

  private static calculateAverageScore(interviews: any[]): number | null {
    const scores = interviews
      .map((interview) => interview.score)
      .filter((score): score is number => score !== null);
    if (scores.length === 0) return null;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }
}
