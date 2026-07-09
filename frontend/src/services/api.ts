import axios from 'axios';
import { getToken, refreshToken, logout } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// إضافة رمز الدخول تلقائياً
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// معالجة الأخطاء وتجديد الرمز تلقائياً
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ===== API Services =====

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: any) =>
    api.post('/auth/register', data),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken?: string) =>
    api.post('/auth/logout', { refreshToken }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),
};

export const userApi = {
  getAll: (params?: any) => api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const subjectApi = {
  getAll: () => api.get('/subjects'),
  getById: (id: string) => api.get(`/subjects/${id}`),
  getChapters: (id: string, params?: any) => api.get(`/subjects/${id}/chapters`, { params }),
  create: (data: any) => api.post('/subjects', data),
  update: (id: string, data: any) => api.put(`/subjects/${id}`, data),
  delete: (id: string) => api.delete(`/subjects/${id}`),
};

export const lessonApi = {
  getAll: (params?: any) => api.get('/lessons', { params }),
  getById: (id: string) => api.get(`/lessons/${id}`),
  create: (data: any) => api.post('/lessons', data),
  update: (id: string, data: any) => api.put(`/lessons/${id}`, data),
  delete: (id: string) => api.delete(`/lessons/${id}`),
  trackProgress: (id: string, data: any) => api.post(`/lessons/${id}/progress`, data),
};

export const quizApi = {
  getAll: (params?: any) => api.get('/quizzes', { params }),
  getById: (id: string) => api.get(`/quizzes/${id}`),
  create: (data: any) => api.post('/quizzes', data),
  update: (id: string, data: any) => api.put(`/quizzes/${id}`, data),
  delete: (id: string) => api.delete(`/quizzes/${id}`),
  start: (id: string) => api.post(`/quizzes/${id}/start`),
  submit: (id: string, data: any) => api.post(`/quizzes/${id}/submit`, data),
  getResults: (id: string) => api.get(`/quizzes/${id}/results`),
};

export const assignmentApi = {
  getAll: (params?: any) => api.get('/assignments', { params }),
  getById: (id: string) => api.get(`/assignments/${id}`),
  create: (data: any) => api.post('/assignments', data),
  submit: (id: string, data: any) => api.post(`/assignments/${id}/submit`, data),
  getSubmissions: (id: string) => api.get(`/assignments/${id}/submissions`),
};

export const questionApi = {
  getAll: (params?: any) => api.get('/questions', { params }),
  getById: (id: string) => api.get(`/questions/${id}`),
  create: (data: any) => api.post('/questions', data),
  update: (id: string, data: any) => api.put(`/questions/${id}`, data),
  delete: (id: string) => api.delete(`/questions/${id}`),
};

export const liveApi = {
  getClasses: (params?: any) => api.get('/live/classes', { params }),
  getClassById: (id: string) => api.get(`/live/classes/${id}`),
  createClass: (data: any) => api.post('/live/classes', data),
  updateClass: (id: string, data: any) => api.put(`/live/classes/${id}`, data),
  deleteClass: (id: string) => api.delete(`/live/classes/${id}`),
  joinClass: (id: string) => api.post(`/live/classes/${id}/join`),
  leaveClass: (id: string) => api.post(`/live/classes/${id}/leave`),
  raiseHand: (id: string, question?: string) =>
    api.post(`/live/classes/${id}/raise-hand`, { question }),
  getRecordings: () => api.get('/live/recordings'),
};

export const paymentApi = {
  getPlans: () => api.get('/payments/plans'),
  subscribe: (data: any) => api.post('/payments/subscribe', data),
  getSubscriptions: () => api.get('/payments/subscriptions'),
  cancelSubscription: () => api.post('/payments/cancel'),
  validateCoupon: (code: string) => api.post('/payments/coupon/validate', { code }),
  getPaymentHistory: () => api.get('/payments/history'),
};

export const forumApi = {
  getTopics: (params?: any) => api.get('/forum/topics', { params }),
  getTopicById: (id: string) => api.get(`/forum/topics/${id}`),
  createTopic: (data: any) => api.post('/forum/topics', data),
  createReply: (topicId: string, content: string) =>
    api.post(`/forum/topics/${topicId}/replies`, { content }),
  likeTopic: (topicId: string) => api.post(`/forum/topics/${topicId}/like`),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  toggleUser: (id: string) => api.put(`/admin/users/${id}/toggle`),
  getPendingTeachers: () => api.get('/admin/teachers/pending'),
  verifyTeacher: (id: string) => api.put(`/admin/teachers/${id}/verify`),
  getContentStats: () => api.get('/admin/content/stats'),
  getSubscriptions: () => api.get('/admin/subscriptions'),
  getFinancialReport: () => api.get('/admin/reports/financial'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),
  getLogs: (params?: any) => api.get('/admin/logs', { params }),
};

export const analyticsApi = {
  getStudentAnalytics: (id: string) => api.get(`/analytics/student/${id}`),
  getTeacherAnalytics: (id: string) => api.get(`/analytics/teacher/${id}`),
  getPlatformAnalytics: () => api.get('/analytics/platform'),
};

export const aiApi = {
  chat: (message: string, chatId?: string) =>
    api.post('/ai/chat', { message, chatId }),
  getChats: () => api.get('/ai/chats'),
  getChatMessages: (chatId: string) => api.get(`/ai/chats/${chatId}`),
  getRecommendations: () => api.post('/ai/recommendations'),
  generateQuestions: (data: any) => api.post('/ai/generate/questions', data),
  analyzeStudent: () => api.post('/ai/analyze'),
};
