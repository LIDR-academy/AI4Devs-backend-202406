import { GetCandidatesByPositionIdQuery } from '../queries/GetCandidatesByPositionIdQuery';
import { CandidateRepository } from '../../domain/repositories/CandidateRepository';
import { CandidateDto } from '../../domain/dtos/CandidateDto';

export class GetCandidatesByPositionIdHandler {
    constructor(private readonly candidateRepository: CandidateRepository) {}

    async handle(query: GetCandidatesByPositionIdQuery): Promise<CandidateDto[]> {
        const { positionId } = query;
        return await this.candidateRepository.getCandidatesByPositionId(positionId);
    }
}