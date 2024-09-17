import { Router } from 'express';
import { addCandidate, getCandidateById, getCandidatesByPositionId } from '../presentation/controllers/candidateController';

const router = Router();

router.post('/', async (req, res) => {
  try {
    // console.log(req.body); //Just in case you want to inspect the request body
    const result = await addCandidate(req.body);
    res.status(201).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(500).send({ message: "An unexpected error occurred" });
    }
  }
});

// Nueva ruta para obtener candidatos por Position ID
router.get('/positions/:id/candidates', getCandidatesByPositionId);

// Ruta para obtener un candidato por ID
router.get('/:id', getCandidateById);

export default router;
