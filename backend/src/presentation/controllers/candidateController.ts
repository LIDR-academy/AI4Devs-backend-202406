import { Request, Response } from 'express';
import {
  addCandidate,
  findCandidateById,
  updateCandidateStageService,
} from '../../application/services/candidateService';

// Exportamos la función addCandidateController
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

// Asegúrate de que updateCandidateStage esté exportado si lo estás usando
export const updateCandidateStage = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id, 10);
        const { currentInterviewStep } = req.body;

        if (isNaN(candidateId)) {
            return res.status(400).json({ error: 'Formato de ID de candidato inválido' });
        }

        if (currentInterviewStep === undefined) {
            return res.status(400).json({ error: 'El campo currentInterviewStep es requerido' });
        }

        const updatedApplication = await updateCandidateStageService(
            candidateId,
            currentInterviewStep,
        );

        res.json({
            message: 'Etapa del candidato actualizada exitosamente',
            data: updatedApplication,
        });
    } catch (error) {
        console.error('Error al actualizar la etapa del candidato:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};