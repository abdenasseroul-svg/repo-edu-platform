import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';
import { AppError } from '../middleware/error';

export class QuestionController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subjectId, chapterId, type, difficulty, search, page = '1', limit = '20' } = req.query;
      const where: any = { isActive: true };
      if (subjectId) where.subjectId = subjectId;
      if (chapterId) where.chapterId = chapterId;
      if (type) where.type = type;
      if (difficulty) where.difficulty = difficulty;
      if (search) where.content = { contains: search };

      const [questions, total] = await Promise.all([
        prisma.question.findMany({
          where,
          include: { options: { orderBy: { order: 'asc' } }, tags: true },
          skip: (parseInt(page as string) - 1) * parseInt(limit as string),
          take: parseInt(limit as string),
          orderBy: { createdAt: 'desc' },
        }),
        prisma.question.count({ where }),
      ]);

      res.json({
        questions,
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

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const question = await prisma.question.findUnique({
        where: { id: req.params.id },
        include: { options: { orderBy: { order: 'asc' } }, tags: true },
      });
      if (!question) throw new AppError('❌ السؤال غير موجود', 404);
      res.json({ question });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options, ...data } = req.body;
      const question = await prisma.question.create({
        data: {
          ...data,
          createdBy: req.user!.userId,
          options: options ? { create: options } : undefined,
        },
        include: { options: true },
      });
      res.status(201).json({ message: '✅ تم إنشاء السؤال', question });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { options, ...data } = req.body;
      const question = await prisma.question.update({
        where: { id: req.params.id },
        data: {
          ...data,
          options: options ? {
            deleteMany: {},
            create: options,
          } : undefined,
        },
        include: { options: true },
      });
      res.json({ message: '✅ تم تحديث السؤال', question });
    } catch (error) {
      next(error);
    }
  };

  delete2 = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.question.update({ where: { id: req.params.id }, data: { isActive: false } });
      res.json({ message: '✅ تم حذف السؤال' });
    } catch (error) {
      next(error);
    }
  };

  generateAI = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic, count = 5, difficulty, type } = req.body;
      // TODO: استخدام GPT-4 API لتوليد الأسئلة
      res.json({ message: '✅ تم توليد الأسئلة', questions: [] });
    } catch (error) {
      next(error);
    }
  };
}
