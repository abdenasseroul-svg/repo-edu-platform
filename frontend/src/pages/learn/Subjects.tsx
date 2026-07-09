import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { subjectApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, ChevronLeft } from 'lucide-react';

const LEVELS: Record<string, string> = {
  ONE_AS: 'السنة الأولى ثانوي',
  TWO_AS: 'السنة الثانية ثانوي',
  THREE_AS: 'السنة الثالثة ثانوي',
};

const Subjects = () => {
  const { user } = useAuth();
  const studentLevel = (user as any)?.student?.level;
  const studentStream = (user as any)?.student?.stream;

  const { data, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => subjectApi.getAll(),
  });

  // فلترة المواد حسب المستوى والشعبة
  const filteredSubjects = data?.data?.subjects?.filter((subject: any) => {
    if (!studentLevel) return true;
    return subject.levels?.some((l: any) => l.level === studentLevel && (!l.stream || !studentStream || l.stream === studentStream));
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 skeleton w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-40 skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المواد الدراسية</h1>
        {studentLevel && (
          <span className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl text-sm">
            {LEVELS[studentLevel]}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects?.map((subject: any) => (
          <Link key={subject.id} to={`/subjects/${subject.id}`} className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-2xl">
                  {subject.icon || '📚'}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{subject.nameAr}</h3>
                  <p className="text-sm text-gray-500">{subject.levels?.length || 0} مستويات</p>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
            </div>
            {subject.description && (
              <p className="text-sm text-gray-500 mt-4 line-clamp-2">{subject.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
