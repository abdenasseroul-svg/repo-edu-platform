import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';
import { AppError } from '../middleware/error';

export class PaymentController {
  getPlans = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      });
      res.json({ plans });
    } catch (error) {
      next(error);
    }
  };

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { planId, paymentMethod } = req.body;
      const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
      if (!plan) throw new AppError('❌ الباقة غير موجودة', 404);

      const existing = await prisma.subscription.findFirst({
        where: { userId: req.user!.userId, status: 'ACTIVE' },
      });
      if (existing) throw new AppError('❌ لديك اشتراك نشط بالفعل', 400);

      const subscription = await prisma.subscription.create({
        data: {
          userId: req.user!.userId,
          planId,
          endDate: new Date(Date.now() + plan.duration * 86400000),
          status: 'PENDING',
        },
      });

      await prisma.payment.create({
        data: {
          userId: req.user!.userId,
          subscriptionId: subscription.id,
          amount: plan.price,
          currency: plan.currency,
          paymentMethod: paymentMethod || 'CARD',
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'ACTIVE' },
      });

      res.json({ message: '✅ تم الاشتراك بنجاح', subscription });
    } catch (error) {
      next(error);
    }
  };

  getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: { userId: req.user!.userId },
        include: { plan: true, payments: { orderBy: { createdAt: 'desc' } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ subscriptions });
    } catch (error) {
      next(error);
    }
  };

  cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscription = await prisma.subscription.findFirst({
        where: { userId: req.user!.userId, status: 'ACTIVE' },
      });
      if (!subscription) throw new AppError('❌ لا يوجد اشتراك نشط', 404);

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'CANCELLED', cancelledAt: new Date() },
      });
      res.json({ message: '✅ تم إلغاء الاشتراك' });
    } catch (error) {
      next(error);
    }
  };

  validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;
      const coupon = await prisma.coupon.findUnique({ where: { code } });
      if (!coupon || !coupon.isActive || (coupon.maxUses && coupon.usedCount >= coupon.maxUses)) {
        throw new AppError('❌ كود الخصم غير صالح', 400);
      }
      if (coupon.validUntil && new Date() > coupon.validUntil) {
        throw new AppError('❌ كود الخصم منتهي الصلاحية', 400);
      }
      res.json({ valid: true, discountPercent: coupon.discountPercent });
    } catch (error) {
      next(error);
    }
  };

  getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId: req.user!.userId },
        include: { subscription: { include: { plan: true } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ payments });
    } catch (error) {
      next(error);
    }
  };
}
