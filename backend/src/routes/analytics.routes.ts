import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new AnalyticsController();

router.get('/student/:id', authenticate, controller.getStudentAnalytics);
router.get('/teacher/:id', authenticate, controller.getTeacherAnalytics);
router.get('/platform', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getPlatformAnalytics);
router.get('/realtime', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), controller.getRealtimeAnalytics);

export default router;
