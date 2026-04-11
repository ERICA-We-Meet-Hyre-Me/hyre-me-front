import { Link } from 'react-router-dom';
import { FileText, Calendar } from 'lucide-react';

const DUMMY_RESUMES = [
  { id: 1, title: '네이버 프론트엔드 개발자 지원서', company: '네이버', date: '2026-04-10 14:30' },
  { id: 2, title: '토스 코어 프론트엔드 자소서', company: '토스', date: '2026-04-05 09:15' },
  { id: 3, title: '카카오 커머스 프론트엔드 (초안)', company: '카카오', date: '2026-03-28 16:45' },
];

export default function GeneratedResumes() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif font-bold">생성된 자소서</h1>
        <p className="text-gray-600 mt-2">AI가 작성한 자소서 및 이력서 목록입니다.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_RESUMES.map((resume) => (
          <div key={resume.id} className="border border-black p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <FileText className="w-8 h-8 text-black" />
              <span className="text-xs font-medium px-2 py-1 border border-black bg-gray-50">
                {resume.company}
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2">{resume.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 mt-auto pt-4">
              <Calendar className="w-4 h-4" />
              {resume.date}
            </div>
            <div className="flex gap-2 border-t border-black pt-4">
              <Link 
                to={`/resumes/${resume.id}`} 
                className="flex-1 text-center bg-black text-white py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                열람하기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
