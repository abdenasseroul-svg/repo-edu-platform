// نماذج التحقق من صحة البيانات باستخدام Zod
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('❌ البريد الإلكتروني غير صالح'),
  password: z.string().min(6, '❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  firstName: z.string().min(2, '❌ الاسم قصير جداً'),
  lastName: z.string().min(2, '❌ اللقب قصير جداً'),
  phone: z.string().optional(),
  role: z.enum(['STUDENT', 'TEACHER']),
  level: z.enum(['ONE_AS', 'TWO_AS', 'THREE_AS']).optional(),
  stream: z.enum(['SCIENCE', 'LITERATURE', 'TECHNICAL_MATH', 'MATH', 'FOREIGN_LANGUAGES', 'MANAGEMENT']).optional(),
  studyHoursPerWeek: z.number().min(1).max(168).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('❌ البريد الإلكتروني غير صالح'),
  password: z.string().min(1, '❌ كلمة المرور مطلوبة'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('❌ البريد الإلكتروني غير صالح'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, '❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
});

export const createSubjectSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().min(2),
  nameFr: z.string().min(2),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  order: z.number().optional(),
  parentId: z.string().optional(),
});

export const createLessonSchema = z.object({
  title: z.string().min(2),
  titleAr: z.string().min(2),
  titleFr: z.string().min(2),
  content: z.string().min(1),
  contentAr: z.string().optional(),
  contentFr: z.string().optional(),
  summary: z.string().optional(),
  chapterId: z.string().min(1),
  videoUrl: z.string().optional(),
  videoEmbed: z.string().optional(),
  pdfUrl: z.string().optional(),
  duration: z.number().optional(),
  isPublished: z.boolean().optional(),
  isFree: z.boolean().optional(),
});

export const createQuestionSchema = z.object({
  content: z.string().min(1),
  contentAr: z.string().optional(),
  contentFr: z.string().optional(),
  type: z.enum(['MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'MATCHING', 'OPEN_ENDED', 'PROGRAMMING', 'MATH']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'CHALLENGE']).optional(),
  points: z.number().optional(),
  subjectId: z.string().optional(),
  chapterId: z.string().optional(),
  options: z.array(z.object({
    text: z.string(),
    textAr: z.string().optional(),
    textFr: z.string().optional(),
    isCorrect: z.boolean(),
    order: z.number(),
  })).optional(),
});

export const createQuizSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['PRACTICE', 'PLACEMENT_TEST', 'CHAPTER_TEST', 'FINAL_EXAM', 'DIAGNOSTIC', 'ADAPTIVE']).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'CHALLENGE']).optional(),
  timeLimit: z.number().optional(),
  passingScore: z.number().optional(),
  isTimed: z.boolean().optional(),
  shuffleQuestions: z.boolean().optional(),
  subjectId: z.string().optional(),
  chapterId: z.string().optional(),
  lessonId: z.string().optional(),
  questionIds: z.array(z.string()).optional(),
});

export const createAssignmentSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['PRACTICE', 'QUIZ', 'EXAM', 'CHALLENGE', 'PROJECT']).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'CHALLENGE']).optional(),
  points: z.number().optional(),
  timeLimit: z.number().optional(),
  dueDate: z.string().datetime().optional(),
  subjectId: z.string().optional(),
  chapterId: z.string().optional(),
  lessonId: z.string().optional(),
  classGroupId: z.string().optional(),
});

export const submitAnswerSchema = z.object({
  assignmentId: z.string().optional(),
  quizId: z.string().optional(),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string(),
  })),
});

export const createLiveClassSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  lessonId: z.string().optional(),
  classGroupId: z.string().optional(),
  scheduledFor: z.string().datetime(),
  duration: z.number().min(15).max(180),
  maxStudents: z.number().optional(),
});

export const createForumTopicSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(1),
  subjectId: z.string().optional(),
  chapterId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const paymentSchema = z.object({
  planId: z.string().min(1),
  paymentMethod: z.enum(['CARD', 'CIB', 'D17', 'BARIDIMOB', 'STRIPE', 'PAYPAL']),
  couponCode: z.string().optional(),
});
