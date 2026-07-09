import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createQuizSchema, submitAnswerSchema } from '../utils/validators';

const router = Router();
const controller = new QuizController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validateBody(createQuizSchema), controller.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.delete);
router.post('/:id/start', authenticate, controller.startQuiz);
router.post('/:id/submit', authenticate, validateBody(submitAnswerSchema), controller.submitQuiz);
router.get('/:id/results', authenticate, controller.getResults);

export default router;
