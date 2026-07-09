import { Router } from 'express';
import { SubjectController } from '../controllers/subject.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createSubjectSchema } from '../utils/validators';

const router = Router();
const controller = new SubjectController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/chapters', controller.getChapters);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateBody(createSubjectSchema), controller.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.update);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), controller.delete);

export default router;
