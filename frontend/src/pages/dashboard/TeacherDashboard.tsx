import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { analyticsApi, adminApi } from '../../services/api';
import { Users, BookOpen, Video, Award, Clock } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const teacherId = (user as any)?.teacher?.id;

  const { data, isLoading } = useQuery({
    queryKey: ['teacher-analytics', teacherId],
    queryFn: () => analyticsApi.getTeacherAnalytics(teacherId),
    enabled: !!teacherId,
  });

  const stats = [
    { label: 'الطلاب', value: data?.data?.totalStudents || 0, icon: Users, color: 'text-blue-500 bg-blue-50' },
    { label: 'المجموعات', value: data?.data?.totalClasses || 0, icon: BookOpen, color: 'text-green-500 bg-green-50' },
    { label: 'التمارين', value: data?.data?.totalAssignments || 0, icon: Video, color: 'text-purple-500 bg-purple-50' },
    { label: 'التقييمات', value: data?.data?.recentSubmissions?.length || 0, icon: Award, color: 'text-orange-500 bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">مرحباً، أ. {user?.lastName} 👋</h1>
        <p className="opacity-90">لوحة تحكم الأستاذ - تابع أداء طلابك</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card">
            <div className={`p-2 rounded-lg inline-flex ${stat.color} mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold mb-4">آخر التقديمات</h2>
          {data?.data?.recentSubmissions?.map((sub: any) => (
            <div key={sub.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium">{sub.student?.user?.firstName} {sub.student?.user?.lastName}</p>
                <p className="text-sm text-gray-500">{new Date(sub.submittedAt).toLocaleDateString('ar-DZ')}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${sub.isGraded ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                {sub.isGraded ? 'مصحح' : 'بانتظار التصحيح'}
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-lg font-bold mb-4">إجراءات سريعة</h2>
          <div className="space-y-3">
            {[
              { label: 'إنشاء تمرين جديد', icon: BookOpen },
              { label: 'جدولة درس مباشر', icon: Video },
              { label: 'تصحيح تمارين', icon: Award },
            ].map((action, i) => (
              <button key={i} className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-right">
                <action.icon className="w-5 h-5 text-primary-600" />
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
