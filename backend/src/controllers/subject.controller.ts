import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';
import { AppError } from '../middleware/error';

export class SubjectController {
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const subjects = await prisma.subject.findMany({
        where: { isActive: true },
        include: {
          levels: true,
          children: { where: { isActive: true } },
        },
        orderBy: { order: 'asc' },
      });
      res.json({ subjects });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subject = await prisma.subject.findUnique({
        where: { id: req.params.id },
        include: {
          levels: { include: { chapters: { include: { lessons: { where: { isPublished: true } } } } } },
          children: true,
          parent: true,
        },
      });
      if (!subject) throw new AppError('❌ المادة غير موجودة', 404);
      res.json({ subject });
    } catch (error) {
      next(error);
    }
  };

  getChapters = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { level, stream } = req.query;
      const where: any = { subjectId: req.params.id };
      if (level) where.level = level as string;
      if (stream) where.stream = stream as string;

      const chapters = await prisma.chapter.findMany({
        where: { levelSubject: where, isActive: true },
        include: { lessons: { where: { isPublished: true }, orderBy: { order: 'asc' } } },
        orderBy: { order: 'asc' },
      });
      res.json({ chapters });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subject = await prisma.subject.create({ data: req.body });
      res.status(201).json({ message: '✅ تم إنشاء المادة', subject });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subject = await prisma.subject.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ message: '✅ تم تحديث المادة', subject });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.subject.update({
        where: { id: req.params.id },
        data: { isActive: false },
      });
      res.json({ message: '✅ تم حذف المادة' });
    } catch (error) {
      next(error);
    }
  };
}
