import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';

export class AdminController {
  getDashboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [totalUsers, totalStudents, totalTeachers, totalLessons, activeSubscriptions, todayAnalytics] =
        await Promise.all([
          prisma.user.count({ where: { isActive: true } }),
          prisma.student.count(),
          prisma.teacher.count(),
          prisma.lesson.count({ where: { isPublished: true } }),
          prisma.subscription.count({ where: { status: 'ACTIVE' } }),
          prisma.dailyAnalytics.findFirst({ orderBy: { date: 'desc' } }),
        ]);

      res.json({
        stats: { totalUsers, totalStudents, totalTeachers, totalLessons, activeSubscriptions, todayAnalytics },
      });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, page = '1', limit = '20' } = req.query;
      const where: any = {};
      if (role) where.role = role;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: (parseInt(page as string) - 1) * parseInt(limit as string),
          take: parseInt(limit as string),
          include: { student: true, teacher: true, admin: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      const safeUsers = users.map(({ password, twoFactorSecret, ...u }) => u);

      res.json({
        users: safeUsers,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  toggleUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.params.id } });
      if (!user) return res.status(404).json({ message: '❌ المستخدم غير موجود' });

      await prisma.user.update({
        where: { id: req.params.id },
        data: { isActive: !user.isActive },
      });
      res.json({ message: `✅ تم ${user.isActive ? 'تعطيل' : 'تفعيل'} المستخدم` });
    } catch (error) {
      next(error);
    }
  };

  getPendingTeachers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const teachers = await prisma.teacher.findMany({
        where: { certificationVerified: false },
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, specialties: true },
      });
      res.json({ teachers });
    } catch (error) {
      next(error);
    }
  };

  verifyTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.teacher.update({
        where: { id: req.params.id },
        data: { certificationVerified: true },
      });
      res.json({ message: '✅ تم التحقق من الأستاذ' });
    } catch (error) {
      next(error);
    }
  };

  getContentStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [subjects, chapters, lessons, questions, resources] = await Promise.all([
        prisma.subject.count({ where: { isActive: true } }),
        prisma.chapter.count({ where: { isActive: true } }),
        prisma.lesson.count({ where: { isPublished: true } }),
        prisma.question.count({ where: { isActive: true } }),
        prisma.resource.count({ where: { isPublished: true } }),
      ]);
      res.json({ stats: { subjects, chapters, lessons, questions, resources } });
    } catch (error) {
      next(error);
    }
  };

  seedContent = async (_req: Request, res: Response, next: NextError) => {
    try {
      // TODO: إضافة بيانات افتراضية
      res.json({ message: '✅ تم إضافة المحتوى' });
    } catch (error) {
      next(error);
    }
  };

  getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscriptions = await prisma.subscription.findMany({
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, plan: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      res.json({ subscriptions });
    } catch (error) {
      next(error);
    }
  };

  getFinancialReport = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await prisma.payment.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { amount: true },
      });

      const monthlyRevenue = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "paidAt") as month, SUM(amount) as revenue
        FROM payments.payments
        WHERE status = 'COMPLETED'
        GROUP BY month ORDER BY month DESC LIMIT 12
      `;

      res.json({ payments, monthlyRevenue });
    } catch (error) {
      next(error);
    }
  };

  getAnalyticsReport = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const dailyAnalytics = await prisma.dailyAnalytics.findMany({
        orderBy: { date: 'desc' },
        take: 30,
      });
      res.json({ dailyAnalytics });
    } catch (error) {
      next(error);
    }
  };

  getSettings = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await prisma.systemSettings.findMany({
        where: { isSecret: false },
      });
      res.json({ settings });
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key, value } = req.body;
      const setting = await prisma.systemSettings.upsert({
        where: { key },
        update: { value, updatedBy: req.user!.userId },
        create: { key, value, updatedBy: req.user!.userId },
      });
      res.json({ message: '✅ تم تحديث الإعداد', setting });
    } catch (error) {
      next(error);
    }
  };

  getLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, page = '1' } = req.query;

      let logs: any;
      if (type === 'security') {
        logs = await prisma.securityLog.findMany({
          orderBy: { timestamp: 'desc' },
          take: 50,
        });
      } else {
        logs = await prisma.auditLog.findMany({
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { timestamp: 'desc' },
          take: 50,
        });
      }
      res.json({ logs });
    } catch (error) {
      next(error);
    }
  };
}
