import { Router } from 'express';
import { AssignmentController } from '../controllers/assignment.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new AssignmentController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), controller.create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'TEACHER'), controller.update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.delete);
router.post('/:id/submit', authenticate, controller.submit);
router.get('/:id/submissions', authenticate, controller.getSubmissions);

export default router;
