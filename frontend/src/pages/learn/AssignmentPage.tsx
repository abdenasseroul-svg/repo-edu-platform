import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { assignmentApi } from '../../services/api';
import { Clock, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AssignmentPage = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentApi.getById(id!),
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: () => assignmentApi.submit(id!, { answers: Object.entries(answers).map(([k, v]) => ({ questionId: k, answer: v })) }),
    onSuccess: (res) => {
      toast.success(`✅ تم الإرسال بنجاح`);
    },
  });

  const assignment = data?.data?.assignment;

  if (isLoading) return <div className="h-96 skeleton" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="card">
        <h1 className="text-2xl font-bold mb-2">{assignment?.title}</h1>
        <p className="text-gray-500 mb-4">{assignment?.description}</p>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {assignment?.questions?.length || 0} أسئلة</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {assignment?.timeLimit || 'بدون'} دقيقة</span>
          <span className="font-bold text-primary-600">{assignment?.points} درجة</span>
        </div>
      </div>

      {assignment?.questions?.map((q: any, i: number) => (
        <div key={q.id} className="card">
          <p className="font-bold mb-4">{i + 1}. {q.content}</p>
          <div className="space-y-2">
            {q.options?.map((opt: any) => (
              <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${
                answers[q.id] === opt.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input type={q.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'} name={`q-${q.id}`}
                  value={opt.id} onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} />
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending} className="btn-primary w-full py-4 text-lg">
        {submitMutation.isPending ? 'جاري الإرسال...' : 'إرسال الإجابات'}
      </button>
    </div>
  );
};

export default AssignmentPage;
