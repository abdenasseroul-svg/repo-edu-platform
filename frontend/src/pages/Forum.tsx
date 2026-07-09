import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { forumApi } from '../services/api';
import { MessageCircle, Pin, Eye, MessageSquare } from 'lucide-react';

const Forum = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['forum-topics'],
    queryFn: () => forumApi.getTopics(),
  });

  if (isLoading) return <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-20 skeleton" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المنتدى النقاشي</h1>
        <Link to="/forum/new" className="btn-primary">موضوع جديد</Link>
      </div>

      <div className="space-y-3">
        {data?.data?.topics?.map((topic: any) => (
          <Link key={topic.id} to={`/forum/${topic.id}`} className="card block hover:shadow-xl transition-all">
            <div className="flex items-start gap-4">
              {topic.isPinned && <Pin className="w-5 h-5 text-primary-500 mt-1 shrink-0" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1">{topic.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{topic.content}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <span>{topic.author?.firstName} {topic.author?.lastName}</span>
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {topic.views}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {topic.repliesCount}</span>
                  <span>{new Date(topic.createdAt).toLocaleDateString('ar-DZ')}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Forum;
