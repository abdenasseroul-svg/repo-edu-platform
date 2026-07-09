import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { forumApi } from '../services/api';
import { ChevronLeft, Eye, MessageSquare, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const ForumTopicPage = () => {
  const { id } = useParams();
  const [replyContent, setReplyContent] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['forum-topic', id],
    queryFn: () => forumApi.getTopicById(id!),
    enabled: !!id,
  });

  const replyMutation = useMutation({
    mutationFn: () => forumApi.createReply(id!, replyContent),
    onSuccess: () => {
      setReplyContent('');
      toast.success('✅ تم إضافة الرد');
      refetch();
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => forumApi.likeTopic(id!),
    onSuccess: () => refetch(),
  });

  const topic = data?.data?.topic;

  if (isLoading) return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 skeleton" />)}</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Link to="/forum" className="flex items-center gap-2 text-gray-500 hover:text-primary-600">
        <ChevronLeft className="w-4 h-4" />
        العودة للمنتدى
      </Link>

      <div className="card">
        <h1 className="text-2xl font-bold mb-2">{topic?.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span>{topic?.author?.firstName} {topic?.author?.lastName}</span>
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {topic?.views}</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {topic?.replies?.length}</span>
          <span>{new Date(topic?.createdAt).toLocaleDateString('ar-DZ')}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300">{topic?.content}</p>
        <button onClick={() => likeMutation.mutate()} className="mt-4 flex items-center gap-2 text-gray-500 hover:text-red-500">
          <Heart className="w-5 h-5" /> {topic?.likes?.length || 0}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold">الردود ({topic?.replies?.length || 0})</h2>
        {topic?.replies?.map((reply: any) => (
          <div key={reply.id} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center font-bold">
                {reply.author?.firstName?.[0]}
              </div>
              <div>
                <p className="font-medium">{reply.author?.firstName} {reply.author?.lastName}</p>
                <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString('ar-DZ')}</p>
              </div>
              {reply.isSolution && <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm mr-auto">الحل</span>}
            </div>
            <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">أضف رداً</h3>
        <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)}
          className="input-field min-h-[120px] mb-4" placeholder="اكتب ردك..." />
        <button onClick={() => replyMutation.mutate()} disabled={!replyContent.trim()} className="btn-primary">
          إرسال الرد
        </button>
      </div>
    </div>
  );
};

export default ForumTopicPage;
