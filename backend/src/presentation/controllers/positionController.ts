import { Request, Response } from 'express';
import { findCandidatesByPositionId } from '../../application/services/positionService';

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
