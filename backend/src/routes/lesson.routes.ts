import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createLessonSchema } from '../utils/validators';

const router = Router();
const controller = new LessonController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), validateBody(createLessonSchema), controller.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.delete);
router.post('/:id/progress', authenticate, controller.trackProgress);

export default router;
