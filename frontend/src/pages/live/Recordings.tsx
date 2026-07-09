import { useQuery } from '@tanstack/react-query';
import { liveApi } from '../../services/api';
import { Play, Clock, Eye } from 'lucide-react';

const Recordings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['recordings'],
    queryFn: () => liveApi.getRecordings(),
  });

  if (isLoading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="h-64 skeleton" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">التسجيلات</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.recordings?.map((rec: any) => (
          <div key={rec.id} className="card group cursor-pointer hover:shadow-xl transition-all">
            <div className="aspect-video bg-gray-900 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
              {rec.thumbnail ? (
                <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover" />
              ) : (
                <Play className="w-12 h-12 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
              )}
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                {Math.floor(rec.duration / 60)}:{(rec.duration % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <h3 className="font-bold mb-2">{rec.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{rec.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {rec.views}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {Math.floor(rec.duration / 60)} دقيقة</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recordings;
