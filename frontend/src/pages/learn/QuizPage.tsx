import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { quizApi } from '../../services/api';
import { Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const QuizPage = () => {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizApi.getById(id!),
    enabled: !!id,
  });

  const startMutation = useMutation({
    mutationFn: () => quizApi.start(id!),
    onSuccess: () => setStarted(true),
  });

  const submitMutation = useMutation({
    mutationFn: () => quizApi.submit(id!, { answers: Object.entries(answers).map(([k, v]) => ({ questionId: k, answer: v })) }),
    onSuccess: (res) => {
      setResult(res.data.result);
      setFinished(true);
      toast.success('✅ تم إرسال الإجابات!');
    },
    onError: () => toast.error('❌ حدث خطأ'),
  });

  const quiz = data?.data?.quiz;
  const questions = quiz?.questions || [];
  const currentQ = questions[currentQuestion];

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" /></div>;

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto card text-center py-16 animate-fade-in">
        <AlertCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">{quiz?.title}</h1>
        <p className="text-gray-500 mb-6">{quiz?.description}</p>
        <div className="flex justify-center gap-8 mb-8">
          <div><p className="font-bold text-lg">{questions.length}</p><p className="text-sm text-gray-500">أسئلة</p></div>
          <div><p className="font-bold text-lg">{quiz?.timeLimit || '∞'}</p><p className="text-sm text-gray-500">دقيقة</p></div>
          <div><p className="font-bold text-lg">{quiz?.points}</p><p className="text-sm text-gray-500">درجة</p></div>
        </div>
        <button onClick={() => startMutation.mutate()} className="btn-primary px-12 py-4 text-lg">ابدأ الاختبار</button>
      </div>
    );
  }

  if (finished) {
    const passed = result?.percentage >= (quiz?.passingScore || 50);
    return (
      <div className="max-w-2xl mx-auto card text-center py-16 animate-fade-in">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {passed ? '🎉' : '😅'}
        </div>
        <h1 className="text-2xl font-bold mb-2">{passed ? 'مبروك! لقد نجحت' : 'حاول مرة أخرى'}</h1>
        <div className="text-6xl font-bold text-primary-600 mb-2">{result?.percentage?.toFixed(0)}%</div>
        <p className="text-gray-500 mb-6">{result?.score} / {result?.maxScore}</p>
        <button onClick={() => window.location.reload()} className="btn-primary px-8">إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">سؤال {currentQuestion + 1} من {questions.length}</span>
        <span className="text-sm font-medium">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
        <div className="bg-primary-500 h-2 rounded-full transition-all" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full text-sm">{currentQ?.type === 'MULTIPLE_CHOICE' ? 'اختيار متعدد' : 'صح/خطأ'}</span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">{currentQ?.difficulty}</span>
          <span className="text-sm text-gray-500 mr-auto">{currentQ?.points} درجة</span>
        </div>
        <h2 className="text-xl font-bold my-4">{currentQ?.content}</h2>

        <div className="space-y-3">
          {currentQ?.options?.map((opt: any) => (
            <label key={opt.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              answers[currentQ.id] === opt.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}>
              <input type="radio" name={`q-${currentQ.id}`} value={opt.id} checked={answers[currentQ.id] === opt.id}
                onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })} className="text-primary-600" />
              <span className="font-medium">{opt.text}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}
            className="btn-secondary" style={{ visibility: currentQuestion === 0 ? 'hidden' : 'visible' }}>
            السابق
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="btn-primary">التالي</button>
          ) : (
            <button onClick={() => submitMutation.mutate()} className="btn-primary">إنهاء الاختبار</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
