import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiService, CompanyCreateRequest, CompanyResponse, CompanyUpdateRequest } from '../services/api';

type CompanyFormState = {
  name: string;
  role: string;
  deadline_text: string;
  job_posting_url: string;
  requirements: string;
  preferences: string;
  core_values: string;
};

const EMPTY_FORM: CompanyFormState = {
  name: '',
  role: '',
  deadline_text: '',
  job_posting_url: '',
  requirements: '',
  preferences: '',
  core_values: '',
};

function toFormState(company: CompanyResponse | null): CompanyFormState {
  if (!company) {
    return EMPTY_FORM;
  }

  return {
    name: company.name ?? '',
    role: company.role ?? '',
    deadline_text: company.deadline_text ?? '',
    job_posting_url: company.job_posting_url ?? '',
    requirements: company.requirements ?? '',
    preferences: company.preferences ?? '',
    core_values: company.core_values ?? '',
  };
}

function toNullable(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export default function CompanyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const companyId = useMemo(() => {
    if (!id || isNew) {
      return null;
    }

    const parsed = Number(id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [id, isNew]);

  const [form, setForm] = useState<CompanyFormState>(EMPTY_FORM);
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      if (isNew) {
        setForm(EMPTY_FORM);
        setCompany(null);
        setIsLoading(false);
        return;
      }

      if (companyId === null) {
        setError('유효하지 않은 기업 ID입니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await apiService.getCompany(companyId);
        setCompany(data);
        setForm(toFormState(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : '기업 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCompany();
  }, [companyId, isNew]);

  const title = isNew ? '새 목표 기업 추가' : '기업 정보 편집';

  const handleChange = (field: keyof CompanyFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    const payload: CompanyCreateRequest | CompanyUpdateRequest = {
      name: form.name.trim(),
      role: form.role.trim(),
      deadline_text: toNullable(form.deadline_text),
      job_posting_url: toNullable(form.job_posting_url),
      requirements: toNullable(form.requirements),
      preferences: toNullable(form.preferences),
      core_values: toNullable(form.core_values),
    };

    try {
      const saved = isNew
        ? await apiService.createCompany(payload as CompanyCreateRequest)
        : await apiService.updateCompany(companyId as number, payload as CompanyUpdateRequest);

      setCompany(saved);
      setForm(toFormState(saved));
      setMessage('저장되었습니다.');

      if (isNew) {
        navigate(`/companies/${saved.id}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '기업을 저장하지 못했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (companyId === null || !window.confirm('이 기업을 삭제할까요?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await apiService.deleteCompany(companyId);
      navigate('/companies');
    } catch (err) {
      setError(err instanceof Error ? err.message : '기업을 삭제하지 못했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <button onClick={() => navigate('/companies')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4">
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </button>
        <h1 className="text-3xl font-serif font-bold">{title}</h1>
        <p className="text-gray-600 mt-2">기업 공고와 인재상을 입력하면 포트폴리오와 자소서에서 재사용할 수 있습니다.</p>
      </header>

      <div className="border border-black p-8 bg-white">
        {isLoading ? (
          <div className="text-center text-gray-500">불러오는 중...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {(error || message) && (
              <div className={`p-3 border ${error ? 'bg-red-50 border-red-300 text-red-700' : 'bg-green-50 border-green-300 text-green-700'}`}>
                {error || message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="name">기업명</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="예: 네이버"
                  required
                  disabled={isSaving || isDeleting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="role">지원 직무</label>
                <input
                  id="role"
                  type="text"
                  value={form.role}
                  onChange={handleChange('role')}
                  className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="예: 프론트엔드 개발자"
                  required
                  disabled={isSaving || isDeleting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="deadline_text">채용 마감일</label>
                <input
                  id="deadline_text"
                  type="datetime-local"
                  value={form.deadline_text}
                  onChange={handleChange('deadline_text')}
                  className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                  disabled={isSaving || isDeleting}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" htmlFor="job_posting_url">채용 공고 링크</label>
                <input
                  id="job_posting_url"
                  type="url"
                  value={form.job_posting_url}
                  onChange={handleChange('job_posting_url')}
                  className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="https://..."
                  disabled={isSaving || isDeleting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="requirements">자격 요건</label>
              <textarea
                id="requirements"
                value={form.requirements}
                onChange={handleChange('requirements')}
                className="w-full border border-black p-4 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="공고에 명시된 필수 자격 요건을 입력하세요."
                disabled={isSaving || isDeleting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="preferences">우대 사항</label>
              <textarea
                id="preferences"
                value={form.preferences}
                onChange={handleChange('preferences')}
                className="w-full border border-black p-4 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="공고에 명시된 우대 사항을 입력하세요."
                disabled={isSaving || isDeleting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="core_values">기업 인재상 / 핵심 가치</label>
              <textarea
                id="core_values"
                value={form.core_values}
                onChange={handleChange('core_values')}
                className="w-full border border-black p-4 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="기업 홈페이지의 인재상을 입력하세요."
                disabled={isSaving || isDeleting}
              />
            </div>

            <div className="flex justify-between gap-4 pt-4">
              <div>
                {!isNew && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSaving || isDeleting}
                    className="px-6 py-3 border border-red-300 text-red-700 font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/companies')}
                  className="px-6 py-3 border border-black font-medium hover:bg-gray-50 transition-colors"
                  disabled={isSaving || isDeleting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isSaving || isDeleting || !form.name.trim() || !form.role.trim()}
                >
                  {isSaving ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
