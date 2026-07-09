import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';

export class ForumController {
  getTopics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subjectId, search, page = '1' } = req.query;
      const where: any = {};
      if (subjectId) where.subjectId = subjectId;
      if (search) where.OR = [{ title: { contains: search } }, { content: { contains: search } }];

      const topics = await prisma.forumTopic.findMany({
        where,
        include: {
          author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          _count: { select: { replies: true, likes: true } },
        },
        skip: (parseInt(page as string) - 1) * 20,
        take: 20,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      });
      res.json({ topics });
    } catch (error) {
      next(error);
    }
  };

  getTopicById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topic = await prisma.forumTopic.update({
        where: { id: req.params.id },
        data: { views: { increment: 1 } },
        include: {
          author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          replies: {
            include: { author: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
            orderBy: { createdAt: 'asc' },
          },
          likes: true,
        },
      });
      res.json({ topic });
    } catch (error) {
      next(error);
    }
  };

  createTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topic = await prisma.forumTopic.create({
        data: { ...req.body, authorId: req.user!.userId },
        include: { author: { select: { id: true, firstName: true, lastName: true } } },
      });
      res.status(201).json({ message: '✅ تم إنشاء الموضوع', topic });
    } catch (error) {
      next(error);
    }
  };

  updateTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topic = await prisma.forumTopic.update({ where: { id: req.params.id }, data: req.body });
      res.json({ message: '✅ تم تحديث الموضوع', topic });
    } catch (error) {
      next(error);
    }
  };

  deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.forumTopic.delete({ where: { id: req.params.id } });
      res.json({ message: '✅ تم حذف الموضوع' });
    } catch (error) {
      next(error);
    }
  };

  createReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reply = await prisma.forumReply.create({
        data: { content: req.body.content, authorId: req.user!.userId, topicId: req.params.id },
        include: { author: { select: { id: true, firstName: true, lastName: true } } },
      });

      await prisma.forumTopic.update({
        where: { id: req.params.id },
        data: { repliesCount: { increment: 1 } },
      });

      res.status(201).json({ message: '✅ تم إضافة الرد', reply });
    } catch (error) {
      next(error);
    }
  };

  updateReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reply = await prisma.forumReply.update({ where: { id: req.params.id }, data: req.body });
      res.json({ message: '✅ تم تحديث الرد', reply });
    } catch (error) {
      next(error);
    }
  };

  deleteReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.forumReply.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
      res.json({ message: '✅ تم حذف الرد' });
    } catch (error) {
      next(error);
    }
  };

  likeTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existing = await prisma.forumLike.findUnique({
        where: { userId_topicId: { userId: req.user!.userId, topicId: req.params.id } },
      });
      if (existing) {
        await prisma.forumLike.delete({ where: { id: existing.id } });
        res.json({ message: '✅ تم إلغاء الإعجاب' });
      } else {
        await prisma.forumLike.create({ data: { userId: req.user!.userId, topicId: req.params.id } });
        res.json({ message: '✅ تم الإعجاب' });
      }
    } catch (error) {
      next(error);
    }
  };
}
