import { Router } from 'express';
import { QuestionController } from '../controllers/question.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new QuestionController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), controller.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.delete2);
router.get('/generate/ai', authenticate, authorize('TEACHER', 'ADMIN', 'SUPER_ADMIN'), controller.generateAI);

export default router;
