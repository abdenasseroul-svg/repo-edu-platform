import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';
import { AppError } from '../middleware/error';
import { v4 as uuidv4 } from 'uuid';

export class LiveController {
  getClasses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { teacherId, subjectId, status } = req.query;
      const where: any = {};

      if (teacherId) where.teacherId = teacherId;
      if (status === 'upcoming') where.scheduledFor = { gte: new Date() };
      if (status === 'live') where.isActive = true;

      const classes = await prisma.liveClass.findMany({
        where,
        include: {
          teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
          _count: { select: { attendees: true } },
        },
        orderBy: { scheduledFor: 'asc' },
      });
      res.json({ classes });
    } catch (error) {
      next(error);
    }
  };

  getClassById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const liveClass = await prisma.liveClass.findUnique({
        where: { id: req.params.id },
        include: {
          teacher: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } },
          attendees: { include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } } },
          chatMessages: { orderBy: { sentAt: 'asc' } },
          whiteboard: true,
        },
      });
      if (!liveClass) throw new AppError('❌ الدرس المباشر غير موجود', 404);
      res.json({ liveClass });
    } catch (error) {
      next(error);
    }
  };

  createClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacher = await prisma.teacher.findUnique({ where: { userId: req.user!.userId } });
      if (!teacher) throw new AppError('❌ يجب أن تكون أستاذاً', 403);

      const liveClass = await prisma.liveClass.create({
        data: { ...req.body, roomId: uuidv4(), teacherId: teacher.id },
      });
      res.status(201).json({ message: '✅ تم إنشاء الدرس المباشر', liveClass });
    } catch (error) {
      next(error);
    }
  };

  updateClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const liveClass = await prisma.liveClass.update({ where: { id: req.params.id }, data: req.body });
      res.json({ message: '✅ تم تحديث الدرس المباشر', liveClass });
    } catch (error) {
      next(error);
    }
  };

  deleteClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.liveClass.delete({ where: { id: req.params.id } });
      res.json({ message: '✅ تم حذف الدرس المباشر' });
    } catch (error) {
      next(error);
    }
  };

  joinClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
      if (!student) throw new AppError('❌ يجب أن تكون طالباً', 403);

      const attendance = await prisma.liveAttendance.upsert({
        where: { liveClassId_studentId: { liveClassId: req.params.id, studentId: student.id } },
        update: { isPresent: true, joinedAt: new Date(), leftAt: null },
        create: { liveClassId: req.params.id, studentId: student.id },
      });
      res.json({ message: '✅ تم الانضمام إلى الدرس', attendance });
    } catch (error) {
      next(error);
    }
  };

  leaveClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
      if (!student) throw new AppError('❌ يجب أن تكون طالباً', 403);

      const attendance = await prisma.liveAttendance.update({
        where: { liveClassId_studentId: { liveClassId: req.params.id, studentId: student.id } },
        data: { leftAt: new Date(), duration: { increment: 0 } },
      });
      res.json({ message: '✅ تم مغادرة الدرس' });
    } catch (error) {
      next(error);
    }
  };

  raiseHand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
      if (!student) throw new AppError('❌ يجب أن تكون طالباً', 403);

      const hand = await prisma.raisedHand.create({
        data: { studentId: student.id, liveClassId: req.params.id, question: req.body.question },
      });
      res.json({ message: '✅ تم رفع اليد', hand });
    } catch (error) {
      next(error);
    }
  };

  resolveHand = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hand = await prisma.raisedHand.update({
        where: { id: req.params.id },
        data: { isResolved: true, resolvedAt: new Date() },
      });
      res.json({ message: '✅ تم حل رفع اليد' });
    } catch (error) {
      next(error);
    }
  };

  getRecordings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recordings = await prisma.recording.findMany({
        where: { isPublished: true },
        include: { chapters: true },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ recordings });
    } catch (error) {
      next(error);
    }
  };
}
