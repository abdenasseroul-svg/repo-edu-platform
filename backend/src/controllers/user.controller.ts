// متحكم المستخدمين
import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';
import { AppError } from '../middleware/error';

export class UserController {
  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role, isActive, search, page = '1', limit = '20' } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};
      if (role) where.role = role;
      if (isActive !== undefined) where.isActive = isActive === 'true';
      if (search) {
        where.OR = [
          { email: { contains: search as string } },
          { firstName: { contains: search as string } },
          { lastName: { contains: search as string } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: parseInt(limit as string),
          include: { student: true, teacher: true, admin: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        users: users.map((u) => {
          const { password, twoFactorSecret, ...safe } = u;
          return safe;
        }),
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

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { student: true, teacher: true, admin: true },
      });

      if (!user) throw new AppError('❌ المستخدم غير موجود', 404);

      const { password, twoFactorSecret, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isActive, isVerified, role, firstName, lastName } = req.body;
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { isActive, isVerified, role, firstName, lastName },
      });

      const { password, twoFactorSecret, ...safeUser } = user;
      res.json({ message: '✅ تم تحديث المستخدم', user: safeUser });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.user.update({
        where: { id: req.params.id },
        data: { deletedAt: new Date(), isActive: false },
      });
      res.json({ message: '✅ تم حذف المستخدم' });
    } catch (error) {
      next(error);
    }
  };

  getStudentProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findUnique({
        where: { userId: req.user!.userId },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, avatar: true } },
          weakSubjects: { include: { subject: true } },
          achievements: { include: { achievement: true } },
          lessonProgress: { include: { lesson: { select: { id: true, title: true, titleAr: true } } } },
        },
      });

      if (!student) throw new AppError('❌ ملف الطالب غير موجود', 404);
      res.json({ student });
    } catch (error) {
      next(error);
    }
  };

  getTeacherProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: req.user!.userId },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, avatar: true } },
          specialties: { include: { subject: true } },
          classGroups: true,
        },
      });

      if (!teacher) throw new AppError('❌ ملف الأستاذ غير موجود', 404);
      res.json({ teacher });
    } catch (error) {
      next(error);
    }
  };
}
