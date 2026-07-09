import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';
import { AppError } from '../middleware/error';

export class LessonController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { chapterId, subjectId, level, isPublished } = req.query;
      const where: any = {};

      if (chapterId) where.chapterId = chapterId;
      if (isPublished !== undefined) where.isPublished = isPublished === 'true';
      else if (!req.user || req.user.role === 'STUDENT') where.isPublished = true;

      if (subjectId || level) {
        where.chapter = { levelSubject: {} };
        if (subjectId) where.chapter.levelSubject.subjectId = subjectId;
        if (level) where.chapter.levelSubject.level = level;
      }

      const lessons = await prisma.lesson.findMany({
        where,
        include: {
          chapter: { include: { levelSubject: { include: { subject: true } } } },
          _count: { select: { lessonProgress: true, resources: true } },
        },
        orderBy: { order: 'asc' },
      });

      res.json({ lessons });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: req.params.id },
        include: {
          chapter: { include: { levelSubject: { include: { subject: true } } } },
          resources: true,
          assignments: { where: { isPublished: true } },
          quizzes: { where: { isPublished: true } },
        },
      });

      if (!lesson) throw new AppError('❌ الدرس غير موجود', 404);

      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { views: { increment: 1 } },
      });

      res.json({ lesson });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lesson = await prisma.lesson.create({ data: req.body });
      res.status(201).json({ message: '✅ تم إنشاء الدرس', lesson });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const lesson = await prisma.lesson.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ message: '✅ تم تحديث الدرس', lesson });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.lesson.update({
        where: { id: req.params.id },
        data: { isPublished: false },
      });
      res.json({ message: '✅ تم حذف الدرس' });
    } catch (error) {
      next(error);
    }
  };

  trackProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
      if (!student) throw new AppError('❌ يجب أن تكون طالباً لتتبع التقدم', 403);

      const { progress, timeSpent, completed } = req.body;

      const lessonProgress = await prisma.lessonProgress.upsert({
        where: {
          studentId_lessonId: { studentId: student.id, lessonId: req.params.id },
        },
        update: {
          progress: progress ?? undefined,
          timeSpent: timeSpent ? { increment: timeSpent } : undefined,
          completed: completed ?? undefined,
          completedAt: completed ? new Date() : undefined,
          lastAccessed: new Date(),
        },
        create: {
          studentId: student.id,
          lessonId: req.params.id,
          progress: progress || 0,
          timeSpent: timeSpent || 0,
          completed: completed || false,
          completedAt: completed ? new Date() : undefined,
        },
      });

      if (completed) {
        await prisma.student.update({
          where: { id: student.id },
          data: { completedAssignments: { increment: 1 } },
        });
      }

      res.json({ lessonProgress });
    } catch (error) {
      next(error);
    }
  };
}
