import { Request, Response } from 'express';
import { getCandidatesByPositionId } from '../../application/services/positionService';

export const getCandidatesByPositionIdController = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }
        const candidates = await getCandidatesByPositionId(positionId);
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};