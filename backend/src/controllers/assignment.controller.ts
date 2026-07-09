import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';
import { AppError } from '../middleware/error';

export class AssignmentController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subjectId, chapterId, type, level } = req.query;
      const where: any = { isPublished: true };
      if (subjectId) where.subjectId = subjectId;
      if (chapterId) where.chapterId = chapterId;
      if (type) where.type = type;

      const assignments = await prisma.assignment.findMany({
        where,
        include: {
          subject: { select: { id: true, name: true, nameAr: true } },
          _count: { select: { questions: true, submissions: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ assignments });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignment = await prisma.assignment.findUnique({
        where: { id: req.params.id },
        include: {
          questions: { include: { options: true } },
          gradingRubric: true,
        },
      });
      if (!assignment) throw new AppError('❌ التمرين غير موجود', 404);
      res.json({ assignment });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacher = await prisma.teacher.findUnique({ where: { userId: req.user!.userId } });
      const data = { ...req.body, teacherId: teacher?.id };
      const assignment = await prisma.assignment.create({ data });
      res.status(201).json({ message: '✅ تم إنشاء التمرين', assignment });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignment = await prisma.assignment.update({ where: { id: req.params.id }, data: req.body });
      res.json({ message: '✅ تم تحديث التمرين', assignment });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.assignment.update({ where: { id: req.params.id }, data: { isPublished: false } });
      res.json({ message: '✅ تم حذف التمرين' });
    } catch (error) {
      next(error);
    }
  };

  submit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
      if (!student) throw new AppError('❌ يجب أن تكون طالباً', 403);

      const { answers } = req.body;
      const assignment = await prisma.assignment.findUnique({
        where: { id: req.params.id },
        include: { questions: { include: { options: true } } },
      });
      if (!assignment) throw new AppError('❌ التمرين غير موجود', 404);

      let totalScore = 0;
      const maxScore = assignment.questions.reduce((s, q) => s + q.points, 0);

      for (const ans of answers) {
        const question = assignment.questions.find((q) => q.id === ans.questionId);
        if (!question) continue;

        let isCorrect = false;
        let pointsEarned = 0;

        if (['MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE'].includes(question.type)) {
          const correctOption = question.options.find((o) => o.isCorrect);
          isCorrect = ans.answer === correctOption?.id;
          pointsEarned = isCorrect ? question.points : 0;
          totalScore += pointsEarned;
        }

        if (question.type === 'OPEN_ENDED' || question.type === 'MATH' || question.type === 'PROGRAMMING') {
          await prisma.openEndedAnswer.create({
            data: {
              questionId: question.id,
              studentId: student.id,
              answer: ans.answer,
            },
          });
        }
      }

      const submission = await prisma.submission.create({
        data: {
          studentId: student.id,
          assignmentId: assignment.id,
          score: totalScore,
          maxScore,
          isGraded: false,
        },
      });

      res.json({ message: '✅ تم إرسال التمرين', submission });
    } catch (error) {
      next(error);
    }
  };

  getSubmissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const where: any = { assignmentId: req.params.id };
      if (req.user!.role === 'STUDENT') {
        const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
        where.studentId = student?.id;
      }

      const submissions = await prisma.submission.findMany({
        where,
        include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } },
        orderBy: { submittedAt: 'desc' },
      });
      res.json({ submissions });
    } catch (error) {
      next(error);
    }
  };
}
