import { Request, Response } from 'express';
import { getCandidatesForPosition } from '../../application/services/positionService';

export const getCandidatesForPositionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const positionId = parseInt(req.params.id);
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'Invalid position ID' });
    }
    const candidates = await getCandidatesForPosition(positionId);
    res.json(candidates);
  } catch (error) {
    if (error instanceof Error && error.message === 'Position not found') {
      res.status(404).json({ error: 'Position not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
