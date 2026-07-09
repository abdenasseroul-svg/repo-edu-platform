// متحكم المصادقة
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../database/prisma';
import { config } from '../config';
import { AppError } from '../middleware/error';
import { AuthPayload } from '../middleware/auth';

export class AuthController {
  // تسجيل مستخدم جديد
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName, phone, role, level, stream, studyHoursPerWeek } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError('❌ البريد الإلكتروني مستخدم مسبقاً', 409);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
          role,
          student: role === 'STUDENT' ? {
            create: {
              level: level || 'ONE_AS',
              stream: stream || null,
              studyHoursPerWeek: studyHoursPerWeek || 10,
            },
          } : undefined,
          teacher: role === 'TEACHER' ? { create: {} } : undefined,
        },
        include: { student: true, teacher: true },
      });

      const tokens = this.generateTokens(user.id, user.email, user.role);

      res.status(201).json({
        message: '✅ تم إنشاء الحساب بنجاح',
        user: this.sanitizeUser(user),
        ...tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  // تسجيل الدخول
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: { student: true, teacher: true, admin: true },
      });

      if (!user || !user.password) {
        throw new AppError('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
      }

      if (!user.isActive) {
        throw new AppError('❌ هذا الحساب معطل، يرجى التواصل مع الإدارة', 403);
      }

      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new AppError('❌ هذا الحساب مقفل مؤقتاً، حاول لاحقاً', 423);
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: { increment: 1 } },
        });
        throw new AppError('❌ البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lastLogin: new Date(),
          lockedUntil: null,
        },
      });

      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          isSuccessful: true,
        },
      });

      const tokens = this.generateTokens(user.id, user.email, user.role);

      res.json({
        message: '✅ تم تسجيل الدخول بنجاح',
        user: this.sanitizeUser(user),
        ...tokens,
      });
    } catch (error) {
      next(error);
    }
  };

  // تجديد رمز الدخول
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('❌ رمز التحديث مطلوب', 400);
      }

      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as AuthPayload;
      const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });

      if (!storedToken || storedToken.revoked) {
        throw new AppError('❌ رمز التحديث غير صالح', 401);
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user || !user.isActive) {
        throw new AppError('❌ المستخدم غير موجود أو معطل', 401);
      }

      const tokens = this.generateTokens(user.id, user.email, user.role);

      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });

      res.json(tokens);
    } catch (error) {
      next(error);
    }
  };

  // تسجيل الخروج
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await prisma.refreshToken.updateMany({
          where: { token: refreshToken },
          data: { revoked: true },
        });
      }

      await prisma.loginHistory.updateMany({
        where: { userId: req.user!.userId, logoutTime: null },
        data: { logoutTime: new Date() },
      });

      res.json({ message: '✅ تم تسجيل الخروج بنجاح' });
    } catch (error) {
      next(error);
    }
  };

  // نسيان كلمة المرور
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.json({ message: '✅ إذا كان البريد الإلكتروني مسجلاً، ستتلقى رابط إعادة تعيين كلمة المرور' });
        return;
      }

      const resetToken = uuidv4();
      const resetExpires = new Date(Date.now() + 3600000); // ساعة واحدة

      await prisma.user.update({
        where: { id: user.id },
        data: {
          preferences: {
            ...((user.preferences as object) || {}),
            resetToken,
            resetExpires,
          },
        },
      });

      // TODO: إرسال بريد إلكتروني يحتوي على رابط إعادة التعيين

      res.json({ message: '✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' });
    } catch (error) {
      next(error);
    }
  };

  // إعادة تعيين كلمة المرور
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;

      const users = await prisma.user.findMany({
        where: {
          preferences: {
            path: ['resetToken'],
            equals: token,
          },
        },
      });

      const user = users[0];
      if (!user) {
        throw new AppError('❌ رابط إعادة التعيين غير صالح', 400);
      }

      const prefs = user.preferences as any;
      if (new Date() > new Date(prefs.resetExpires)) {
        throw new AppError('❌ رابط إعادة التعيين منتهي الصلاحية', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          preferences: {
            ...prefs,
            resetToken: null,
            resetExpires: null,
          },
        },
      });

      res.json({ message: '✅ تم إعادة تعيين كلمة المرور بنجاح' });
    } catch (error) {
      next(error);
    }
  };

  // تأكيد البريد الإلكتروني
  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      // TODO: التحقق من رمز التأكيد
      res.json({ message: '✅ تم تأكيد البريد الإلكتروني بنجاح' });
    } catch (error) {
      next(error);
    }
  };

  // تسجيل الدخول عبر Google
  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { googleToken } = req.body;
      // TODO: التحقق من رمز Google وتسجيل الدخول
      res.json({ message: '✅ تم تسجيل الدخول عبر Google بنجاح' });
    } catch (error) {
      next(error);
    }
  };

  // جلب بيانات المستخدم الحالي
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        include: {
          student: {
            include: { weakSubjects: { include: { subject: true } } },
          },
          teacher: true,
          admin: true,
        },
      });

      if (!user) {
        throw new AppError('❌ المستخدم غير موجود', 404);
      }

      res.json({ user: this.sanitizeUser(user) });
    } catch (error) {
      next(error);
    }
  };

  // تحديث الملف الشخصي
  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, phone, avatar } = req.body;

      const user = await prisma.user.update({
        where: { id: req.user!.userId },
        data: { firstName, lastName, phone, avatar },
      });

      res.json({ message: '✅ تم تحديث الملف الشخصي', user: this.sanitizeUser(user) });
    } catch (error) {
      next(error);
    }
  };

  // تغيير كلمة المرور
  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });

      if (!user?.password) {
        throw new AppError('❌ لا يمكن تغيير كلمة المرور لحساب OAuth', 400);
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new AppError('❌ كلمة المرور الحالية غير صحيحة', 401);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      res.json({ message: '✅ تم تغيير كلمة المرور بنجاح' });
    } catch (error) {
      next(error);
    }
  };

  // ===== دوال مساعدة =====
  private generateTokens(userId: string, email: string, role: string) {
    const accessToken = jwt.sign({ userId, email, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign({ userId, email, role }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, twoFactorSecret, ...safeUser } = user;
    return safeUser;
  }
}
