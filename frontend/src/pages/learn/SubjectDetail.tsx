import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { subjectApi } from '../../services/api';
import { ChevronLeft, Play, FileText, Video, BookOpen } from 'lucide-react';

const SubjectDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['subject', id],
    queryFn: () => subjectApi.getById(id!),
    enabled: !!id,
  });

  const subject = data?.data?.subject;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 skeleton w-64" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/subjects" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{subject?.nameAr}</h1>
          <p className="text-gray-500">{subject?.nameFr} - {subject?.name}</p>
        </div>
      </div>

      {/* Chapters */}
      {subject?.levels?.map((level: any) => (
        <div key={level.id} className="space-y-4">
          <h2 className="text-xl font-bold">الفصول الدراسية</h2>

          {level.chapters?.map((chapter: any) => (
            <div key={chapter.id} className="card">
              <h3 className="text-lg font-bold mb-4">{chapter.nameAr}</h3>
              <div className="space-y-2">
                {chapter.lessons?.map((lesson: any) => (
                  <Link key={lesson.id} to={`/lessons/${lesson.id}`}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                        {lesson.videoUrl || lesson.videoEmbed ? <Video className="w-5 h-5 text-primary-600" /> : <FileText className="w-5 h-5 text-primary-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{lesson.titleAr}</p>
                        <p className="text-sm text-gray-500">{lesson.duration ? `${lesson.duration} دقيقة` : ''}</p>
                      </div>
                    </div>
                    <Play className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SubjectDetail;
