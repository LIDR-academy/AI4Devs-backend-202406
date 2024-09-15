import { Request, Response } from 'express';
import { getCandidatesForPosition } from '../../application/services/positionService';

export const getCandidatesByPositionId = async (req: Request, res: Response) => {
  try {
    const positionId = parseInt(req.params.id);
    if (isNaN(positionId)) {
      return res.status(400).json({ error: 'Formato de ID de posición inválido' });
    }
    const candidates = await getCandidatesForPosition(positionId);
    res.json(candidates);
  } catch (error) {
    console.error('Error al obtener los candidatos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
