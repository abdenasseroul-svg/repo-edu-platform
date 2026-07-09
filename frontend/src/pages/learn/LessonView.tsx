import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { lessonApi, quizApi } from '../../services/api';
import { BookOpen, Play, FileText, Clock, Eye, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const LessonView = () => {
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonApi.getById(id!),
    enabled: !!id,
  });

  const progressMutation = useMutation({
    mutationFn: (data: any) => lessonApi.trackProgress(id!, data),
  });

  const lesson = data?.data?.lesson;

  const handleComplete = () => {
    progressMutation.mutate({ progress: 100, completed: true, timeSpent: 600 });
    toast.success('✅ تم إكمال الدرس!');
  };

  const handleQuizSubmit = async () => {
    try {
      const res = await quizApi.submit(lesson?.quizzes?.[0]?.id || '', { answers: Object.entries(quizAnswers).map(([k, v]) => ({ questionId: k, answer: v })) });
      toast.success(`✅ النتيجة: ${res.data.result.score}/${res.data.result.maxScore}`);
      setShowQuiz(false);
    } catch (err) {
      toast.error('❌ حدث خطأ');
    }
  };

  if (isLoading) return <div className="space-y-4"><div className="h-64 skeleton" /><div className="h-32 skeleton" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Video */}
      {lesson?.videoEmbed && (
        <div className="aspect-video rounded-2xl overflow-hidden bg-black">
          <iframe src={lesson.videoEmbed} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}

      {/* Info */}
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">{lesson?.titleAr}</h1>
        <p className="text-gray-500 mb-4">{lesson?.titleFr}</p>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lesson?.duration || '?'} دقيقة</span>
          <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {lesson?.views || 0} مشاهدة</span>
        </div>
      </div>

      {/* Content */}
      <div className="card">
        <h2 className="text-lg font-bold mb-4">محتوى الدرس</h2>
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: lesson?.content || '' }} />
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">التقدم</h2>
          <span className="text-primary-600 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <div className="bg-primary-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setProgress(Math.min(100, progress + 10))} className="btn-secondary flex-1">تقدم +10%</button>
          <button onClick={handleComplete} className="btn-primary flex-1">إكمال الدرس</button>
        </div>
      </div>

      {/* Quick Quiz */}
      {lesson?.quizzes?.[0] && !showQuiz && (
        <button onClick={() => setShowQuiz(true)} className="btn-primary w-full py-4 text-lg">
          ابدأ الاختبار القصير
        </button>
      )}

      {showQuiz && lesson?.quizzes?.[0] && (
        <div className="card">
          <h2 className="text-lg font-bold mb-4">{lesson.quizzes[0].title}</h2>
          <div className="space-y-6">
            {lesson.quizzes[0].questions?.map((q: any, i: number) => (
              <div key={q.id}>
                <p className="font-medium mb-3">{i + 1}. {q.content}</p>
                <div className="space-y-2">
                  {q.options?.map((opt: any) => (
                    <label key={opt.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <input type="radio" name={`q-${q.id}`} value={opt.id} onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })} className="text-primary-600" />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleQuizSubmit} className="btn-primary w-full mt-6">إرسال الإجابات</button>
        </div>
      )}
    </div>
  );
};

export default LessonView;
