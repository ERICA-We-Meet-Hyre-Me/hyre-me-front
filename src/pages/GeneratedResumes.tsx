import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Trash2 } from 'lucide-react';
import { apiService, CompanyResponse, GeneratedResumeResponse } from '../services/api';

export default function GeneratedResumes() {
  const [resumes, setResumes] = useState<GeneratedResumeResponse[]>([]);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResumes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [resumeData, companyData] = await Promise.all([
          apiService.listGeneratedResumes(),
          apiService.listCompanies(),
        ]);

        setResumes(resumeData);
        setCompanies(companyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '자소서 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadResumes();
  }, []);

  const companyNameById = useMemo(() => {
    return new Map(companies.map((company) => [company.id, company.name]));
  }, [companies]);

  const sortedResumes = useMemo(
    () =>
      [...resumes].sort((left, right) => (right.updated_at ?? right.created_at ?? '').localeCompare(left.updated_at ?? left.created_at ?? '')),
    [resumes],
  );

  const handleDelete = async (resumeId: number) => {
    if (!window.confirm('이 자소서를 삭제할까요?')) {
      return;
    }

    setDeletingId(resumeId);
    setError(null);

    try {
      await apiService.deleteGeneratedResume(resumeId);
      setResumes((current) => current.filter((resume) => resume.id !== resumeId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '자소서를 삭제하지 못했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">생성된 자소서</h1>
          <p className="text-gray-600 mt-2">서버에 저장된 자소서 목록과 상세 내용을 확인할 수 있습니다.</p>
        </div>
      </header>

      {error && <div className="border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full border border-black p-8 text-center text-gray-500">불러오는 중...</div>
        ) : sortedResumes.length === 0 ? (
          <div className="col-span-full border border-black p-8 text-center text-gray-500">등록된 자소서가 없습니다.</div>
        ) : (
          sortedResumes.map((resume) => {
            const companyName = companyNameById.get(resume.company_id) ?? `기업 #${resume.company_id}`;

            return (
              <div key={resume.id} className="border border-black p-6 flex flex-col hover:shadow-md transition-shadow bg-white">
                <div className="flex items-start justify-between mb-4">
                  <FileText className="w-8 h-8 text-black" />
                  <span className="text-xs font-medium px-2 py-1 border border-black bg-gray-50">
                    {companyName}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2">{resume.title}</h3>
                <div className="text-sm text-gray-600 mb-4">{resume.status ?? '상태 미설정'}</div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 mt-auto pt-4">
                  <Calendar className="w-4 h-4" />
                  {resume.updated_at ?? resume.created_at ?? '-'}
                </div>
                <div className="flex gap-2 border-t border-black pt-4">
                  <Link
                    to={`/resumes/${resume.id}`}
                    className="flex-1 text-center bg-black text-white py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    열람하기
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(resume.id)}
                    disabled={deletingId === resume.id}
                    className="inline-flex items-center justify-center gap-1 border border-black px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deletingId === resume.id ? '삭제 중' : '삭제'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
