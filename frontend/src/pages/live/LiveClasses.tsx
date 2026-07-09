import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { liveApi } from '../../services/api';
import { Video, Clock, Users, Calendar } from 'lucide-react';

const LiveClasses = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['live-classes'],
    queryFn: () => liveApi.getClasses({ status: 'upcoming' }),
  });

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-48 skeleton" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">الدروس المباشرة</h1>
        <Link to="/recordings" className="btn-secondary">التسجيلات</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.classes?.map((cls: any) => (
          <Link key={cls.id} to={`/live/${cls.id}`} className="card group hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-red-500" />
              </div>
              {new Date(cls.scheduledFor) > new Date() && (
                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full text-sm">قادم</span>
              )}
            </div>
            <h3 className="font-bold text-lg mb-2">{cls.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{cls.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(cls.scheduledFor).toLocaleDateString('ar-DZ')}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {cls.duration} دقيقة</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {cls._count?.attendees || 0}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LiveClasses;
