// مسارات إدارة المستخدمين
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new UserController();

router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getUsers);
router.get('/:id', authenticate, controller.getUserById);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.updateUser);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), controller.deleteUser);
router.get('/students/me', authenticate, controller.getStudentProfile);
router.get('/teachers/me', authenticate, controller.getTeacherProfile);

export default router;
