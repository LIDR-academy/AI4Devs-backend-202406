import { Request, Response } from 'express';
import { findCandidatesByPositionId, updateInterviewStepService } from '../../application/services/positionService';

export const getCandidatesByPositionId = async (req: Request, res: Response) => {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		const candidates = await findCandidatesByPositionId(id);
		if (!candidates) {
			return res.status(404).json({ error: 'Position not found' });
		}
		res.json(candidates);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const updateInterviewStep = async (req: Request, res: Response) => {
  try {
      const positionId = parseInt(req.params.positionId);
      const candidateId = parseInt(req.params.candidateId);
      const stepId = parseInt(req.params.step);

      if (isNaN(positionId) || isNaN(candidateId) || isNaN(stepId)) {
          return res.status(400).json({ error: 'Invalid ID format' });
      }

      const updatedApplication = await updateInterviewStepService(positionId, candidateId, stepId);

      if (!updatedApplication) {
          return res.status(404).json({ error: 'Application not found' });
      }

      res.json({ message: 'Interview step updated successfully', data: updatedApplication });
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
