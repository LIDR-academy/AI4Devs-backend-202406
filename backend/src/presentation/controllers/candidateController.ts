import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage } from '../../application/services/candidateService';

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

export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Formato de ID inválido' });
        }

        const { applicationId, interviewStepId, employeeId, interviewDate } = req.body;

        if (!applicationId || !interviewStepId || !employeeId || !interviewDate) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const updatedCandidate = await updateCandidateStage(candidateId, applicationId, {
            interviewStepId,
            employeeId,
            interviewDate: new Date(interviewDate),
        });

        res.status(200).json({ message: 'Etapa actualizada exitosamente', data: updatedCandidate });
    } catch (error: any) {
        res.status(400).json({ message: 'Error al actualizar la etapa', error: error.message });
    }
};

export { addCandidate };