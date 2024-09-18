import { Request, Response } from 'express';
import { UpdateApplicationStageUseCase } from '../../application/services/applicationService';
import { ApplicationRepository } from '../../infrastructure/repositories/ApplicationRepository';
import { ApplicationNotFoundError } from '../../domain/errors/ApplicationNotFoundError';

export const updateApplicationStageController = async (
  req: Request,
  res: Response,
) => {
  try {
    const applicationId = parseInt(req.params.id);
    const newStage = parseInt(req.body.stage);

    if (isNaN(applicationId) || isNaN(newStage)) {
      return res.status(400).json({ error: 'Invalid application ID or stage' });
    }

    const applicationRepository = new ApplicationRepository(req.prisma);
    const useCase = new UpdateApplicationStageUseCase(applicationRepository);
    await useCase.execute(applicationId, newStage);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ApplicationNotFoundError) {
      res.status(404).json({ error: 'Candidate not found' });
    } else {
      console.error('Error updating application stage:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};
