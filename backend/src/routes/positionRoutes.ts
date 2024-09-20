import { Router } from 'express';
import { getCandidatesByPositionId, updateInterviewStep } from '../presentation/controllers/positionController';

const router = Router();

router.get('/:id/candidates', getCandidatesByPositionId);
router.put('/:positionId/candidate/:candidateId/step/:step', updateInterviewStep);

export default router;
