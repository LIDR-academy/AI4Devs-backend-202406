import { CandidateDto } from '../dtos/CandidateDto';

export interface CandidateRepository {
    getCandidatesByPositionId(positionId: number): Promise<CandidateDto[]>;
}