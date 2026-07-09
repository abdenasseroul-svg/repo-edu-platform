import { Request, Response, NextFunction } from 'express';
import prisma from '../database/prisma';

export class AnalyticsController {
  getStudentAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = req.params.id;

      const [progress, quizAttempts, submissions, lessonProgress, weakSubjects] = await Promise.all([
        prisma.student.findUnique({
          where: { id: studentId },
          select: { averageScore: true, totalStudyTime: true, completedAssignments: true, streakDays: true, xpPoints: true },
        }),
        prisma.quizAttempt.findMany({
          where: { studentId },
          include: { quiz: { select: { title: true, subjectId: true } } },
          orderBy: { completedAt: 'desc' },
          take: 20,
        }),
        prisma.submission.findMany({
          where: { studentId },
          include: { assignment: { select: { title: true } } },
          orderBy: { submittedAt: 'desc' },
          take: 20,
        }),
        prisma.lessonProgress.findMany({
          where: { studentId },
          include: { lesson: { select: { title: true, titleAr: true } } },
        }),
        prisma.studentWeakSubject.findMany({
          where: { studentId },
          include: { subject: true },
        }),
      ]);

      const progressBySubject = lessonProgress.reduce((acc: any, lp) => {
        // حساب التقدم حسب المادة
        return acc;
      }, {});

      res.json({
        student: progress,
        quizAttempts,
        submissions,
        lessonProgress,
        weakSubjects,
        progressBySubject,
      });
    } catch (error) {
      next(error);
    }
  };

  getTeacherAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.params.id;

      const [totalStudents, totalClasses, totalAssignments, recentSubmissions] = await Promise.all([
        prisma.classMember.count({
          where: { classGroup: { teacherId }, isActive: true },
        }),
        prisma.classGroup.count({ where: { teacherId, isActive: true } }),
        prisma.assignment.count({ where: { teacherId, isPublished: true } }),
        prisma.submission.findMany({
          where: { assignment: { teacherId } },
          include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } },
          orderBy: { submittedAt: 'desc' },
          take: 10,
        }),
      ]);

      res.json({ totalStudents, totalClasses, totalAssignments, recentSubmissions });
    } catch (error) {
      next(error);
    }
  };

  getPlatformAnalytics = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [dailyAnalytics, totalUsers, totalRevenue] = await Promise.all([
        prisma.dailyAnalytics.findMany({ orderBy: { date: 'desc' }, take: 30 }),
        prisma.user.count(),
        prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
      ]);

      res.json({ dailyAnalytics, totalUsers, totalRevenue: totalRevenue._sum.amount });
    } catch (error) {
      next(error);
    }
  };

  getRealtimeAnalytics = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const now = new Date();
      const fiveMinAgo = new Date(now.getTime() - 5 * 60000);

      const [activeUsers, recentAnalytics] = await Promise.all([
        prisma.user.count({ where: { lastLogin: { gte: fiveMinAgo } } }),
        prisma.realtimeAnalytics.findMany({ orderBy: { timestamp: 'desc' }, take: 10 }),
      ]);

      res.json({ activeUsers, recentAnalytics });
    } catch (error) {
      next(error);
    }
  };
}
