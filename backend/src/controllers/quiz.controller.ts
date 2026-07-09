import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';
import { AppError } from '../middleware/error';

export class QuizController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subjectId, chapterId, level, type } = req.query;
      const where: any = {};
      if (subjectId) where.subjectId = subjectId;
      if (chapterId) where.chapterId = chapterId;
      if (type) where.type = type;
      if (level) where.chapter = { levelSubject: { level } };

      const quizzes = await prisma.quiz.findMany({
        where: { ...where, isPublished: true },
        include: { _count: { select: { questions: true, attempts: true } } },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ quizzes });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quiz = await prisma.quiz.findUnique({
        where: { id: req.params.id },
        include: {
          questions: {
            include: { options: { orderBy: { order: 'asc' } }, tags: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      if (!quiz) throw new AppError('❌ الاختبار غير موجود', 404);
      res.json({ quiz });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionIds, ...data } = req.body;
      const quiz = await prisma.quiz.create({
        data: {
          ...data,
          teacherId: req.user!.role === 'TEACHER' ? (await prisma.teacher.findUnique({ where: { userId: req.user!.userId } }))?.id : undefined,
          questions: questionIds ? { connect: questionIds.map((id: string) => ({ id })) } : undefined,
        },
        include: { questions: true },
      });
      res.status(201).json({ message: '✅ تم إنشاء الاختبار', quiz });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quiz = await prisma.quiz.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ message: '✅ تم تحديث الاختبار', quiz });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.quiz.update({ where: { id: req.params.id }, data: { isPublished: false } });
      res.json({ message: '✅ تم حذف الاختبار' });
    } catch (error) {
      next(error);
    }
  };

  startQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
      if (!student) throw new AppError('❌ يجب أن تكون طالباً', 403);

      const existingAttempt = await prisma.quizAttempt.findFirst({
        where: { studentId: student.id, quizId: req.params.id, completedAt: null },
      });

      if (existingAttempt) {
        return res.json({ attempt: existingAttempt });
      }

      const attempt = await prisma.quizAttempt.create({
        data: { studentId: student.id, quizId: req.params.id, maxScore: 0, score: 0, percentage: 0 },
      });

      res.json({ attempt });
    } catch (error) {
      next(error);
    }
  };

  submitQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
      if (!student) throw new AppError('❌ يجب أن تكون طالباً', 403);

      const attempt = await prisma.quizAttempt.findFirst({
        where: { studentId: student.id, quizId: req.params.id, completedAt: null },
      });
      if (!attempt) throw new AppError('❌ لا توجد محاولة نشطة', 404);

      const quiz = await prisma.quiz.findUnique({
        where: { id: req.params.id },
        include: { questions: { include: { options: true } } },
      });
      if (!quiz) throw new AppError('❌ الاختبار غير موجود', 404);

      let totalScore = 0;
      let maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);

      for (const answer of req.body.answers) {
        const question = quiz.questions.find((q) => q.id === answer.questionId);
        if (!question) continue;

        let isCorrect = false;
        let pointsEarned = 0;

        if (question.type === 'MULTIPLE_CHOICE' || question.type === 'SINGLE_CHOICE' || question.type === 'TRUE_FALSE') {
          const correctOption = question.options.find((o) => o.isCorrect);
          isCorrect = answer.answer === correctOption?.id;
          pointsEarned = isCorrect ? question.points : 0;
        }

        totalScore += pointsEarned;

        await prisma.questionAnswer.create({
          data: {
            questionId: question.id,
            studentId: student.id,
            answer: answer.answer,
            isCorrect,
            pointsEarned,
            quizAttemptId: attempt.id,
          },
        });
      }

      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

      await prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: { score: totalScore, maxScore, percentage, completedAt: new Date() },
      });

      await prisma.submission.create({
        data: {
          studentId: student.id,
          quizAttemptId: attempt.id,
          score: totalScore,
          maxScore,
          percentage,
          passed: quiz.passingScore ? percentage >= quiz.passingScore : undefined,
          isGraded: true,
        },
      });

      await prisma.student.update({
        where: { id: student.id },
        data: { averageScore: { increment: 1 } },
      });

      res.json({
        message: '✅ تم إرسال الإجابات',
        result: { score: totalScore, maxScore, percentage, passed: percentage >= (quiz.passingScore || 50) },
      });
    } catch (error) {
      next(error);
    }
  };

  getResults = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.student.findUnique({ where: { userId: req.user!.userId } });
      if (!student) throw new AppError('❌ يجب أن تكون طالباً', 403);

      const attempts = await prisma.quizAttempt.findMany({
        where: { studentId: student.id, quizId: req.params.id },
        include: { answers: { include: { question: true } } },
        orderBy: { startedAt: 'desc' },
      });

      res.json({ attempts });
    } catch (error) {
      next(error);
    }
  };
}
