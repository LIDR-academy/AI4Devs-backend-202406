import { Request, Response } from 'express';
import { getCandidatesForPosition } from '../../application/services/positionService';

export const getCandidatesForPositionController = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id);
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'Invalid position ID' });
    }

    const candidates = await getCandidatesForPosition(positionId);
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates for position:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
