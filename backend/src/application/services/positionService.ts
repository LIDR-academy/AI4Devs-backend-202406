import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { ApplicationMapper } from '../../domain/mappers/ApplicationMapper';
import { PositionNotFoundError } from '../../domain/errors/PositionNotFoundError';
import { CandidateDTO } from '../../domain/dto/CandidateDTO';
import { Position } from '../../domain/models/Position';

export class GetCandidatesForPositionUseCase {
  constructor(private applicationRepository: IApplicationRepository) {}

  async execute(positionId: number): Promise<CandidateDTO[]> {
    const position = await Position.findOne(positionId);
    if (!position) {
      throw new PositionNotFoundError(positionId);
    }

    const applications =
      await this.applicationRepository.findByPositionId(positionId);
    return applications.map(ApplicationMapper.toCandidateDTO);
  }
}
