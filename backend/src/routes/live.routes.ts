import { Router } from 'express';
import { LiveController } from '../controllers/live.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createLiveClassSchema } from '../utils/validators';

const router = Router();
const controller = new LiveController();

router.get('/classes', controller.getClasses);
router.get('/classes/:id', controller.getClassById);
router.post('/classes', authenticate, authorize('TEACHER', 'ADMIN', 'SUPER_ADMIN'), validateBody(createLiveClassSchema), controller.createClass);
router.put('/classes/:id', authenticate, authorize('TEACHER', 'ADMIN', 'SUPER_ADMIN'), controller.updateClass);
router.delete('/classes/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.deleteClass);
router.post('/classes/:id/join', authenticate, controller.joinClass);
router.post('/classes/:id/leave', authenticate, controller.leaveClass);
router.post('/classes/:id/raise-hand', authenticate, controller.raiseHand);
router.post('/classes/:id/resolve-hand', authenticate, authorize('TEACHER'), controller.resolveHand);
router.get('/recordings', controller.getRecordings);

export default router;
