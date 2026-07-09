import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Target, Clock, Award, TrendingUp, Zap } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const studentId = (user as any)?.student?.id;

  const { data, isLoading } = useQuery({
    queryKey: ['student-analytics', studentId],
    queryFn: () => analyticsApi.getStudentAnalytics(studentId),
    enabled: !!studentId,
  });

  const stats = [
    { label: 'وقت الدراسة', value: `${Math.floor((data?.data?.student?.totalStudyTime || 0) / 3600)}h`, icon: Clock, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { label: 'تمارين مكتملة', value: data?.data?.student?.completedAssignments || 0, icon: Target, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
    { label: 'المعدل العام', value: `${(data?.data?.student?.averageScore || 0).toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    { label: 'نقاط XP', value: data?.data?.student?.xpPoints || 0, icon: Zap, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 skeleton" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً، {user?.firstName} 👋</h1>
        <p className="opacity-90">واصل التقدم في رحلتك التعليمية</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Weak Subjects */}
      {data?.data?.weakSubjects?.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            مواد بحاجة للتحسين
          </h2>
          <div className="space-y-3">
            {data.data.weakSubjects.map((ws: any) => (
              <div key={ws.id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <div>
                  <p className="font-medium">{ws.subject.nameAr}</p>
                  <p className="text-sm text-gray-500">الأولوية: {ws.priority}</p>
                </div>
                <Link to={`/subjects/${ws.subjectId}`} className="text-primary-600 text-sm hover:underline">
                  ابدأ التعلم
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold mb-4">آخر الاختبارات</h2>
          {data?.data?.quizAttempts?.slice(0, 5).map((attempt: any) => (
            <div key={attempt.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div>
                <p className="font-medium">{attempt.quiz?.title || 'اختبار'}</p>
                <p className="text-sm text-gray-500">{new Date(attempt.completedAt).toLocaleDateString('ar-DZ')}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${attempt.passed ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                {attempt.percentage?.toFixed(0)}%
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-lg font-bold mb-4">التقدم في الدروس</h2>
          {data?.data?.lessonProgress?.slice(0, 5).map((lp: any) => (
            <div key={lp.id} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{lp.lesson?.titleAr || lp.lesson?.title}</span>
                <span>{lp.progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${lp.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
