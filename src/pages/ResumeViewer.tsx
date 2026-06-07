import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { ArrowLeft, Printer, Trash2 } from 'lucide-react';
import { apiService, CompanyResponse, GeneratedResumeResponse } from '../services/api';

export default function ResumeViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const resumeId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id]);

  const [resume, setResume] = useState<GeneratedResumeResponse | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResume = async () => {
      if (resumeId === null) {
        setError('유효하지 않은 자소서 ID입니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [resumeData, companies] = await Promise.all([
          apiService.getGeneratedResume(resumeId),
          apiService.listCompanies(),
        ]);

        setResume(resumeData);
        setCompanyName(companies.find((company: CompanyResponse) => company.id === resumeData.company_id)?.name ?? `기업 #${resumeData.company_id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : '자소서 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, [resumeId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (resumeId === null || !window.confirm('이 자소서를 삭제할까요?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await apiService.deleteGeneratedResume(resumeId);
      navigate('/resumes');
    } catch (err) {
      setError(err instanceof Error ? err.message : '자소서를 삭제하지 못했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-black pb-4 no-print">
        <button onClick={() => navigate('/resumes')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </button>
        <div className="flex gap-4">
          <button onClick={handlePrint} className="flex items-center gap-2 border border-black px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4" />
            인쇄 / PDF 저장
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || resume === null}
            className="flex items-center gap-2 border border-black px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? '삭제 중' : '삭제'}
          </button>
        </div>
      </div>

      {error && <div className="border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="bg-white max-w-4xl mx-auto print:max-w-none print:m-0">
        {isLoading ? (
          <div className="border border-black p-8 text-center text-gray-500">불러오는 중...</div>
        ) : resume ? (
          <div className="space-y-6">
            <div className="border border-black p-6">
              <div className="text-sm text-gray-500 mb-2">{companyName}</div>
              <h1 className="text-3xl font-serif font-bold">{resume.title}</h1>
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <div>상태: {resume.status ?? '-'}</div>
                <div>생성일: {resume.created_at ?? '-'}</div>
                <div>수정일: {resume.updated_at ?? '-'}</div>
              </div>
            </div>
            <div className="prose prose-neutral max-w-none prose-headings:font-serif prose-h1:text-3xl prose-h1:border-b prose-h1:border-black prose-h1:pb-4 prose-h2:text-xl prose-h2:mt-8 prose-p:leading-relaxed prose-p:text-gray-800">
              {resume.content_markdown ? <Markdown>{resume.content_markdown}</Markdown> : <div>작성된 내용이 없습니다.</div>}
            </div>
          </div>
        ) : (
          <div className="border border-black p-8 text-center text-gray-500">자소서 정보를 찾을 수 없습니다.</div>
        )}
      </div>
    </div>
  );
}
