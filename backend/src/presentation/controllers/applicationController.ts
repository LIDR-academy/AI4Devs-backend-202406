import { Request, Response } from 'express';
import { Application } from '../../domain/models/Application';

export const updateCandidateStage = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        const { applicationId, currentInterviewStep } = req.body;

        if (isNaN(candidateId) || isNaN(applicationId) || isNaN(currentInterviewStep)) {
            return res.status(400).json({ error: 'ID de candidato, ID de aplicación o etapa de entrevista inválidos' });
        }

        const updatedApplication = await Application.updateStage(applicationId, currentInterviewStep);

        if (!updatedApplication) {
            return res.status(404).json({ error: 'Aplicación no encontrada' });
        }

        res.json(updatedApplication);
    } catch (error) {
        console.error('Error al actualizar la etapa del candidato:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
```