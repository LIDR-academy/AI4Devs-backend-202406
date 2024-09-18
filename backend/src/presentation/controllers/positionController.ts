import { Request, Response } from 'express';
import { GetCandidatesForPositionUseCase } from '../../application/services/positionService';
import { ApplicationRepository } from '../../infrastructure/repositories/ApplicationRepository';
import { PositionNotFoundError } from '../../domain/errors/PositionNotFoundError';

export const getCandidatesForPositionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const positionId = parseInt(req.params.id);
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'Invalid position ID' });
    }

    const applicationRepository = new ApplicationRepository(req.prisma);
    const useCase = new GetCandidatesForPositionUseCase(applicationRepository);
    const candidates = await useCase.execute(positionId);
    res.json(candidates);
  } catch (error) {
    if (error instanceof PositionNotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
    console.log("error", error)
      res.status(500).json({ error: 'An unexpected error occurred' + error });
    }
  }
};
