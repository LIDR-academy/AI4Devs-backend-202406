import { Router } from 'express';
import {
  addCandidateController,
  getCandidateById,
  updateCandidateStage,
} from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', addCandidateController);

router.get('/:id', getCandidateById);

// Nueva ruta para actualizar la etapa del candidato
router.put('/:id/stage', updateCandidateStage);

export default router;
