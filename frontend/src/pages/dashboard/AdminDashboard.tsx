import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Users, BookOpen, CreditCard, TrendingUp, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  const stats = [
    { label: 'إجمالي المستخدمين', value: data?.data?.stats?.totalUsers || 0, icon: Users, color: 'text-blue-500 bg-blue-50' },
    { label: 'الطلاب', value: data?.data?.stats?.totalStudents || 0, icon: Users, color: 'text-green-500 bg-green-50' },
    { label: 'الأساتذة', value: data?.data?.stats?.totalTeachers || 0, icon: Users, color: 'text-purple-500 bg-purple-50' },
    { label: 'الدروس', value: data?.data?.stats?.totalLessons || 0, icon: BookOpen, color: 'text-orange-500 bg-orange-50' },
    { label: 'الاشتراكات النشطة', value: data?.data?.stats?.activeSubscriptions || 0, icon: CreditCard, color: 'text-teal-500 bg-teal-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-primary-600 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-2">لوحة تحكم الإدارة</h1>
        <p className="opacity-90">إدارة المنصة والمستخدمين والمحتوى</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            إحصائيات سريعة
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>المستخدمين النشطين اليوم</span>
              <span className="font-bold">{data?.data?.stats?.todayAnalytics?.activeUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>المستخدمين الجدد</span>
              <span className="font-bold">{data?.data?.stats?.todayAnalytics?.newUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>الدروس المشاهدة</span>
              <span className="font-bold">{data?.data?.stats?.todayAnalytics?.lessonsViewed || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            روابط سريعة
          </h2>
          <div className="space-y-3">
            {[
              { label: 'إدارة المستخدمين', href: '/admin/users', icon: Users },
              { label: 'إدارة المحتوى', href: '/subjects', icon: BookOpen },
              { label: 'إدارة الاشتراكات', href: '/subscriptions', icon: CreditCard },
              { label: 'التقارير المالية', href: '/admin/reports', icon: DollarSign },
            ].map((link, i) => (
              <a key={i} href={link.href} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <link.icon className="w-5 h-5 text-primary-600" />
                <span className="font-medium">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
