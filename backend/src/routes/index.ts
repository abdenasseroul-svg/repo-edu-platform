// تجميع جميع المسارات
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import subjectRoutes from './subject.routes';
import lessonRoutes from './lesson.routes';
import quizRoutes from './quiz.routes';
import assignmentRoutes from './assignment.routes';
import questionRoutes from './question.routes';
import liveRoutes from './live.routes';
import paymentRoutes from './payment.routes';
import forumRoutes from './forum.routes';
import adminRoutes from './admin.routes';
import analyticsRoutes from './analytics.routes';
import aiRoutes from './ai.routes';

const router = Router();

const routes = [
  { path: '/auth', route: authRoutes },
  { path: '/users', route: userRoutes },
  { path: '/subjects', route: subjectRoutes },
  { path: '/lessons', route: lessonRoutes },
  { path: '/quizzes', route: quizRoutes },
  { path: '/assignments', route: assignmentRoutes },
  { path: '/questions', route: questionRoutes },
  { path: '/live', route: liveRoutes },
  { path: '/payments', route: paymentRoutes },
  { path: '/forum', route: forumRoutes },
  { path: '/admin', route: adminRoutes },
  { path: '/analytics', route: analyticsRoutes },
  { path: '/ai', route: aiRoutes },
];

routes.forEach(({ path, route }) => router.use(path, route));

export default router;
