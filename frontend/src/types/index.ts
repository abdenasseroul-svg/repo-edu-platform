// ===== أنواع البيانات الأساسية =====

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  student: {
    id: string;
    level: Level;
    stream?: Stream;
    studyHoursPerWeek: number;
    levelTestScore?: number;
    levelTestCompleted: boolean;
    totalStudyTime: number;
    completedAssignments: number;
    averageScore: number;
    streakDays: number;
    xpPoints: number;
    weakSubjects: StudentWeakSubject[];
  };
}

export interface Teacher extends User {
  teacher: {
    id: string;
    certification?: string;
    certificationVerified: boolean;
    bio?: string;
    rating: number;
    specialties: TeacherSpecialty[];
  };
}

export interface StudentWeakSubject {
  id: string;
  subjectId: string;
  subject: Subject;
  score?: number;
  priority: number;
}

export interface TeacherSpecialty {
  id: string;
  subjectId: string;
  subject: Subject;
  experience?: number;
  level?: Level;
}

export interface Subject {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  levels: LevelSubject[];
  children: Subject[];
  parent?: Subject;
}

export interface LevelSubject {
  id: string;
  level: Level;
  stream?: Stream;
  isRequired: boolean;
  coefficient: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  titleFr: string;
  content: string;
  summary?: string;
  videoUrl?: string;
  videoEmbed?: string;
  pdfUrl?: string;
  duration?: number;
  order: number;
  isPublished: boolean;
  isFree: boolean;
  views: number;
  chapter: Chapter;
  resources: Resource[];
  assignments: Assignment[];
  quizzes: Quiz[];
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  fileUrl: string;
  size?: number;
  downloads: number;
  isFree: boolean;
}

export interface Question {
  id: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  points: number;
  hints?: string;
  explanation?: string;
  options: QuestionOption[];
  tags: QuestionTag[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface QuestionTag {
  id: string;
  name: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  type: QuizType;
  difficulty: Difficulty;
  timeLimit?: number;
  passingScore?: number;
  isTimed: boolean;
  shuffleQuestions: boolean;
  points: number;
  maxAttempts?: number;
  questions: Question[];
  attempts: QuizAttempt[];
}

export interface QuizAttempt {
  id: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed?: boolean;
  timeTaken?: number;
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  pointsEarned?: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  type: AssignmentType;
  difficulty: Difficulty;
  points: number;
  timeLimit?: number;
  dueDate?: string;
  maxAttempts?: number;
  questions: Question[];
  submissions: Submission[];
}

export interface Submission {
  id: string;
  score?: number;
  maxScore: number;
  percentage?: number;
  passed?: boolean;
  feedback?: string;
  timeTaken?: number;
  attemptNumber: number;
  isGraded: boolean;
  submittedAt: string;
  answers: QuestionAnswer[];
}

export interface LiveClass {
  id: string;
  title: string;
  description?: string;
  teacher: Teacher;
  lesson?: Lesson;
  scheduledFor: string;
  duration: number;
  isActive: boolean;
  roomId: string;
  attendees: LiveAttendance[];
  chatMessages: ChatMessage[];
}

export interface LiveAttendance {
  id: string;
  studentId: string;
  joinedAt: string;
  leftAt?: string;
  duration?: number;
  isPresent: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  isSystem: boolean;
  sentAt: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author: User;
  subject?: Subject;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  repliesCount: number;
  replies: ForumReply[];
  tags: string[];
  createdAt: string;
}

export interface ForumReply {
  id: string;
  content: string;
  author: User;
  isSolution: boolean;
  likes: number;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  description?: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
  isPopular: boolean;
  trialPeriod?: number;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
}

export type Level = 'ONE_AS' | 'TWO_AS' | 'THREE_AS';
export type Stream = 'SCIENCE' | 'LITERATURE' | 'TECHNICAL_MATH' | 'MATH' | 'FOREIGN_LANGUAGES' | 'MANAGEMENT';
export type ResourceType = 'PDF' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'PRESENTATION' | 'SPREADSHEET' | 'OTHER';
export type QuestionType = 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'MATCHING' | 'OPEN_ENDED' | 'PROGRAMMING' | 'MATH';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'CHALLENGE';
export type QuizType = 'PRACTICE' | 'PLACEMENT_TEST' | 'CHAPTER_TEST' | 'FINAL_EXAM' | 'DIAGNOSTIC' | 'ADAPTIVE';
export type AssignmentType = 'PRACTICE' | 'QUIZ' | 'EXAM' | 'CHALLENGE' | 'PROJECT';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING' | 'TRIAL' | 'SUSPENDED';
export type PaymentMethod = 'CARD' | 'CIB' | 'D17' | 'BARIDIMOB' | 'STRIPE' | 'PAYPAL';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  pagination?: Pagination;
}
