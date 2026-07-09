import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const controller = new PaymentController();

router.get('/plans', controller.getPlans);
router.post('/subscribe', authenticate, controller.subscribe);
router.get('/subscriptions', authenticate, controller.getSubscriptions);
router.post('/cancel', authenticate, controller.cancelSubscription);
router.post('/coupon/validate', controller.validateCoupon);
router.get('/history', authenticate, controller.getPaymentHistory);

export default router;
