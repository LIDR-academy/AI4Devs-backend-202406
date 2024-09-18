import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCandidatesByPosition = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);

        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'ID de posición inválido' });
        }

        const candidates = await prisma.application.findMany({
            where: {
                positionId: positionId
            },
            select: {
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                currentInterviewStep: true,
                interviews: {
                    select: {
                        score: true
                    }
                }
            }
        });

        const formattedCandidates = candidates.map(app => ({
            fullName: `${app.candidate.firstName} ${app.candidate.lastName}`,
            current_interview_step: app.currentInterviewStep,
            average_score: app.interviews.length > 0
                ? app.interviews.reduce((sum, interview) => sum + (interview.score || 0), 0) / app.interviews.length
                : null
        }));

        res.json(formattedCandidates);
    } catch (error) {
        console.error('Error al obtener candidatos por posición:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};