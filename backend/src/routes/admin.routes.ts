import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new AdminController();

router.use(authenticate, authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/dashboard', controller.getDashboard);
router.get('/users', controller.getUsers);
router.put('/users/:id/toggle', controller.toggleUser);
router.get('/teachers/pending', controller.getPendingTeachers);
router.put('/teachers/:id/verify', controller.verifyTeacher);
router.get('/content/stats', controller.getContentStats);
router.post('/content/seed', controller.seedContent);
router.get('/subscriptions', controller.getSubscriptions);
router.get('/reports/financial', controller.getFinancialReport);
router.get('/reports/analytics', controller.getAnalyticsReport);
router.get('/settings', controller.getSettings);
router.put('/settings', controller.updateSettings);
router.get('/logs', controller.getLogs);

export default router;
