import { Request, Response } from 'express';
import { addCandidate, findCandidateById } from '../../application/services/candidateService';
import { QueryService } from '../../application/services/QueryService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const queryService = new QueryService(prisma);

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCandidatesByPositionId = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid Position ID format' });
        }

        const candidates = await queryService.executeGetCandidatesByPositionId(positionId);
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { addCandidate };