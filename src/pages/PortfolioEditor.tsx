import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Upload, Pencil } from 'lucide-react';
import {
  apiService,
  PortfolioCertificationCreateRequest,
  PortfolioCertificationResponse,
  PortfolioCertificationUpdateRequest,
  PortfolioExperienceCreateRequest,
  PortfolioExperienceResponse,
  PortfolioExperienceUpdateRequest,
  PortfolioLanguageCreateRequest,
  PortfolioLanguageResponse,
  PortfolioLanguageUpdateRequest,
  PortfolioProfileResponse,
  PortfolioProfileUpsertRequest,
} from '../services/api';

type ProfileFormState = {
  education: string;
  gpa: string;
  core_skills_text: string;
  self_intro_keywords: string;
};

type ExperienceFormState = {
  category: string;
  title: string;
  organization: string;
  period_text: string;
  role: string;
  tech_stack: string;
  description: string;
  achievement: string;
  learned: string;
  related_skills: string;
  sort_order: string;
};

type CertificationFormState = {
  name: string;
  issuer: string;
  acquired_date: string;
  description: string;
};

type LanguageFormState = {
  test_name: string;
  score: string;
  grade: string;
  acquired_date: string;
  description: string;
};

const EMPTY_PROFILE: ProfileFormState = {
  education: '',
  gpa: '',
  core_skills_text: '',
  self_intro_keywords: '',
};

const EMPTY_EXPERIENCE: ExperienceFormState = {
  category: '',
  title: '',
  organization: '',
  period_text: '',
  role: '',
  tech_stack: '',
  description: '',
  achievement: '',
  learned: '',
  related_skills: '',
  sort_order: '0',
};

const EMPTY_CERTIFICATION: CertificationFormState = {
  name: '',
  issuer: '',
  acquired_date: '',
  description: '',
};

const EMPTY_LANGUAGE: LanguageFormState = {
  test_name: '',
  score: '',
  grade: '',
  acquired_date: '',
  description: '',
};

function toNullable(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toProfileForm(profile: PortfolioProfileResponse | null): ProfileFormState {
  if (!profile) {
    return EMPTY_PROFILE;
  }

  return {
    education: profile.education ?? '',
    gpa: profile.gpa ?? '',
    core_skills_text: profile.core_skills_text ?? '',
    self_intro_keywords: profile.self_intro_keywords ?? '',
  };
}

function toExperienceForm(item: PortfolioExperienceResponse | null): ExperienceFormState {
  if (!item) {
    return EMPTY_EXPERIENCE;
  }

  return {
    category: item.category ?? '',
    title: item.title ?? '',
    organization: item.organization ?? '',
    period_text: item.period_text ?? '',
    role: item.role ?? '',
    tech_stack: item.tech_stack ?? '',
    description: item.description ?? '',
    achievement: item.achievement ?? '',
    learned: item.learned ?? '',
    related_skills: item.related_skills ?? '',
    sort_order: item.sort_order?.toString() ?? '0',
  };
}

function toCertificationForm(item: PortfolioCertificationResponse | null): CertificationFormState {
  if (!item) {
    return EMPTY_CERTIFICATION;
  }

  return {
    name: item.name ?? '',
    issuer: item.issuer ?? '',
    acquired_date: item.acquired_date ?? '',
    description: item.description ?? '',
  };
}

function toLanguageForm(item: PortfolioLanguageResponse | null): LanguageFormState {
  if (!item) {
    return EMPTY_LANGUAGE;
  }

  return {
    test_name: item.test_name ?? '',
    score: item.score ?? '',
    grade: item.grade ?? '',
    acquired_date: item.acquired_date ?? '',
    description: item.description ?? '',
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return '-';
  }

  return value.slice(0, 10);
}

export default function PortfolioEditor() {
  const [profile, setProfile] = useState<ProfileFormState>(EMPTY_PROFILE);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioProfile, setPortfolioProfile] = useState<PortfolioProfileResponse | null>(null);
  const [experiences, setExperiences] = useState<PortfolioExperienceResponse[]>([]);
  const [certifications, setCertifications] = useState<PortfolioCertificationResponse[]>([]);
  const [languages, setLanguages] = useState<PortfolioLanguageResponse[]>([]);
  const [experienceForm, setExperienceForm] = useState<ExperienceFormState>(EMPTY_EXPERIENCE);
  const [certificationForm, setCertificationForm] = useState<CertificationFormState>(EMPTY_CERTIFICATION);
  const [languageForm, setLanguageForm] = useState<LanguageFormState>(EMPTY_LANGUAGE);
  const [editingExperienceId, setEditingExperienceId] = useState<number | null>(null);
  const [editingCertificationId, setEditingCertificationId] = useState<number | null>(null);
  const [editingLanguageId, setEditingLanguageId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSavingExperience, setIsSavingExperience] = useState(false);
  const [isSavingCertification, setIsSavingCertification] = useState(false);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);
  const [deletingExperienceId, setDeletingExperienceId] = useState<number | null>(null);
  const [deletingCertificationId, setDeletingCertificationId] = useState<number | null>(null);
  const [deletingLanguageId, setDeletingLanguageId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPortfolio = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [profileData, experienceData, certificationData, languageData] = await Promise.all([
        apiService.getPortfolioProfile(),
        apiService.listPortfolioExperiences(),
        apiService.listPortfolioCertifications(),
        apiService.listPortfolioLanguages(),
      ]);

      setPortfolioProfile(profileData);
      setProfile(toProfileForm(profileData));
      setExperiences(experienceData);
      setCertifications(certificationData);
      setLanguages(languageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '포트폴리오를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const sortedExperiences = useMemo(
    () =>
      [...experiences].sort((left, right) => {
        const leftOrder = left.sort_order ?? 0;
        const rightOrder = right.sort_order ?? 0;
        return leftOrder - rightOrder || (right.updated_at ?? right.created_at ?? '').localeCompare(left.updated_at ?? left.created_at ?? '');
      }),
    [experiences],
  );

  const sortedCertifications = useMemo(
    () =>
      [...certifications].sort((left, right) => (right.acquired_date ?? right.updated_at ?? right.created_at ?? '').localeCompare(left.acquired_date ?? left.updated_at ?? left.created_at ?? '')),
    [certifications],
  );

  const sortedLanguages = useMemo(
    () =>
      [...languages].sort((left, right) => (right.acquired_date ?? right.updated_at ?? right.created_at ?? '').localeCompare(left.acquired_date ?? left.updated_at ?? left.created_at ?? '')),
    [languages],
  );

  const handleProfileChange = (field: keyof ProfileFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleExperienceChange = (field: keyof ExperienceFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExperienceForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleCertificationChange = (field: keyof CertificationFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCertificationForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleLanguageChange = (field: keyof LanguageFormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLanguageForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setError(null);
    setMessage(null);

    const payload: PortfolioProfileUpsertRequest = {
      education: toNullable(profile.education),
      gpa: toNullable(profile.gpa),
      core_skills_text: toNullable(profile.core_skills_text),
      self_intro_keywords: toNullable(profile.self_intro_keywords),
    };

    try {
      const saved = await apiService.upsertPortfolioProfile(payload);
      setPortfolioProfile(saved);
      setProfile(toProfileForm(saved));
      setMessage('기본 정보가 저장되었습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '기본 정보를 저장하지 못했습니다.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setError('업로드할 파일을 선택하세요.');
      return;
    }

    setIsUploadingFile(true);
    setError(null);
    setMessage(null);

    try {
      // 1. 백엔드로 파일 전송 (여기서 AI 분석 및 DB 저장이 일어남)
      await apiService.uploadResumeFile(resumeFile);
      
      // 2. AI가 DB에 저장한 '경험, 자격증, 어학성적'을 화면에 반영하기 위해 전체 다시 불러오기
      await loadPortfolio();
      
      setResumeFile(null);
      setMessage('이력서 분석이 완료되어 데이터가 추가되었습니다!');
    } catch (err) {
      setError(err instanceof Error ? err.message : '이력서 분석에 실패했습니다.');
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleExperienceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingExperience(true);
    setError(null);
    setMessage(null);

    const payload: PortfolioExperienceCreateRequest | PortfolioExperienceUpdateRequest = {
      category: experienceForm.category.trim(),
      title: experienceForm.title.trim(),
      organization: toNullable(experienceForm.organization),
      period_text: toNullable(experienceForm.period_text),
      role: toNullable(experienceForm.role),
      tech_stack: toNullable(experienceForm.tech_stack),
      description: toNullable(experienceForm.description),
      achievement: toNullable(experienceForm.achievement),
      learned: toNullable(experienceForm.learned),
      related_skills: toNullable(experienceForm.related_skills),
      sort_order: experienceForm.sort_order.trim().length > 0 ? Number(experienceForm.sort_order) : null,
    };

    try {
      if (editingExperienceId === null) {
        const created = await apiService.createPortfolioExperience(payload as PortfolioExperienceCreateRequest);
        setExperiences((current) => [...current, created]);
        setMessage('경험이 추가되었습니다.');
      } else {
        const updated = await apiService.updatePortfolioExperience(editingExperienceId, payload as PortfolioExperienceUpdateRequest);
        setExperiences((current) => current.map((item) => (item.id === editingExperienceId ? updated : item)));
        setMessage('경험이 수정되었습니다.');
      }

      setExperienceForm(EMPTY_EXPERIENCE);
      setEditingExperienceId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '경험을 저장하지 못했습니다.');
    } finally {
      setIsSavingExperience(false);
    }
  };

  const handleCertificationSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingCertification(true);
    setError(null);
    setMessage(null);

    const payload: PortfolioCertificationCreateRequest | PortfolioCertificationUpdateRequest = {
      name: certificationForm.name.trim(),
      issuer: toNullable(certificationForm.issuer),
      acquired_date: toNullable(certificationForm.acquired_date),
      description: toNullable(certificationForm.description),
    };

    try {
      if (editingCertificationId === null) {
        const created = await apiService.createPortfolioCertification(payload as PortfolioCertificationCreateRequest);
        setCertifications((current) => [...current, created]);
        setMessage('자격증이 추가되었습니다.');
      } else {
        const updated = await apiService.updatePortfolioCertification(editingCertificationId, payload as PortfolioCertificationUpdateRequest);
        setCertifications((current) => current.map((item) => (item.id === editingCertificationId ? updated : item)));
        setMessage('자격증이 수정되었습니다.');
      }

      setCertificationForm(EMPTY_CERTIFICATION);
      setEditingCertificationId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '자격증을 저장하지 못했습니다.');
    } finally {
      setIsSavingCertification(false);
    }
  };

  const handleLanguageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingLanguage(true);
    setError(null);
    setMessage(null);

    const payload: PortfolioLanguageCreateRequest | PortfolioLanguageUpdateRequest = {
      test_name: languageForm.test_name.trim(),
      score: toNullable(languageForm.score),
      grade: toNullable(languageForm.grade),
      acquired_date: toNullable(languageForm.acquired_date),
      description: toNullable(languageForm.description),
    };

    try {
      if (editingLanguageId === null) {
        const created = await apiService.createPortfolioLanguage(payload as PortfolioLanguageCreateRequest);
        setLanguages((current) => [...current, created]);
        setMessage('어학 성적이 추가되었습니다.');
      } else {
        const updated = await apiService.updatePortfolioLanguage(editingLanguageId, payload as PortfolioLanguageUpdateRequest);
        setLanguages((current) => current.map((item) => (item.id === editingLanguageId ? updated : item)));
        setMessage('어학 성적이 수정되었습니다.');
      }

      setLanguageForm(EMPTY_LANGUAGE);
      setEditingLanguageId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '어학 성적을 저장하지 못했습니다.');
    } finally {
      setIsSavingLanguage(false);
    }
  };

  const handleDeleteExperience = async (experienceId: number) => {
    if (!window.confirm('이 경험을 삭제할까요?')) {
      return;
    }

    setDeletingExperienceId(experienceId);
    setError(null);

    try {
      await apiService.deletePortfolioExperience(experienceId);
      setExperiences((current) => current.filter((item) => item.id !== experienceId));
      if (editingExperienceId === experienceId) {
        setEditingExperienceId(null);
        setExperienceForm(EMPTY_EXPERIENCE);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '경험을 삭제하지 못했습니다.');
    } finally {
      setDeletingExperienceId(null);
    }
  };

  const handleDeleteCertification = async (certificationId: number) => {
    if (!window.confirm('이 자격증을 삭제할까요?')) {
      return;
    }

    setDeletingCertificationId(certificationId);
    setError(null);

    try {
      await apiService.deletePortfolioCertification(certificationId);
      setCertifications((current) => current.filter((item) => item.id !== certificationId));
      if (editingCertificationId === certificationId) {
        setEditingCertificationId(null);
        setCertificationForm(EMPTY_CERTIFICATION);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '자격증을 삭제하지 못했습니다.');
    } finally {
      setDeletingCertificationId(null);
    }
  };

  const handleDeleteLanguage = async (languageId: number) => {
    if (!window.confirm('이 어학 성적을 삭제할까요?')) {
      return;
    }

    setDeletingLanguageId(languageId);
    setError(null);

    try {
      await apiService.deletePortfolioLanguage(languageId);
      setLanguages((current) => current.filter((item) => item.id !== languageId));
      if (editingLanguageId === languageId) {
        setEditingLanguageId(null);
        setLanguageForm(EMPTY_LANGUAGE);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '어학 성적을 삭제하지 못했습니다.');
    } finally {
      setDeletingLanguageId(null);
    }
  };

  const profileFileName = resumeFile?.name ?? portfolioProfile?.resume_file_url?.split('/').pop() ?? '-';

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-serif font-bold">내 포트폴리오</h1>
        <p className="text-gray-600 mt-2">기본 정보, 경험, 자격증, 어학 성적을 실제 데이터로 관리합니다.</p>
      </header>

      {error && <div className="border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}
      {message && <div className="border border-green-300 bg-green-50 p-4 text-green-700">{message}</div>}

      <section className="border border-black p-6 space-y-6 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-black pb-3">
          <h2 className="text-xl font-serif font-bold">이력서 파일</h2>
          <span className="text-sm text-gray-600">현재 파일: {profileFileName}</span>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2" htmlFor="resume_file">기존 이력서 파일 업로드</label>
            <input
              id="resume_file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
              className="w-full border border-black p-3"
              disabled={isUploadingFile}
            />
          </div>
          <button
            type="button"
            onClick={handleResumeUpload}
            disabled={!resumeFile || isUploadingFile}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            {isUploadingFile ? 'AI가 이력서를 분석 중입니다 (최대 1분 소요)...' : 'AI 분석 및 업로드'}
          </button>
        </div>
      </section>

      <section className="border border-black p-6 space-y-6 bg-white">
        <div className="flex items-center justify-between border-b border-black pb-3">
          <h2 className="text-xl font-serif font-bold">기본 정보</h2>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="education">최종 학력</label>
              <input
                id="education"
                type="text"
                value={profile.education}
                onChange={handleProfileChange('education')}
                className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                disabled={isSavingProfile}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="gpa">학점</label>
              <input
                id="gpa"
                type="text"
                value={profile.gpa}
                onChange={handleProfileChange('gpa')}
                className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                disabled={isSavingProfile}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" htmlFor="core_skills_text">핵심 역량</label>
              <textarea
                id="core_skills_text"
                value={profile.core_skills_text}
                onChange={handleProfileChange('core_skills_text')}
                className="w-full border border-black p-3 min-h-[96px] focus:outline-none focus:ring-1 focus:ring-black"
                disabled={isSavingProfile}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" htmlFor="self_intro_keywords">자소서 키워드</label>
              <textarea
                id="self_intro_keywords"
                value={profile.self_intro_keywords}
                onChange={handleProfileChange('self_intro_keywords')}
                className="w-full border border-black p-3 min-h-[96px] focus:outline-none focus:ring-1 focus:ring-black"
                disabled={isSavingProfile}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSavingProfile ? '저장 중...' : '기본 정보 저장'}
            </button>
          </div>
        </form>
      </section>

      <section className="border border-black p-6 space-y-6 bg-white">
        <div className="flex items-center justify-between border-b border-black pb-3">
          <h2 className="text-xl font-serif font-bold">경험</h2>
          <button
            type="button"
            onClick={() => {
              setEditingExperienceId(null);
              setExperienceForm(EMPTY_EXPERIENCE);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <Plus className="w-4 h-4" />
            새 경험 추가
          </button>
        </div>

        <form onSubmit={handleExperienceSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="카테고리" value={experienceForm.category} onChange={handleExperienceChange('category')} required />
            <Input label="제목" value={experienceForm.title} onChange={handleExperienceChange('title')} required />
            <Input label="소속/기관" value={experienceForm.organization} onChange={handleExperienceChange('organization')} />
            <Input label="기간" value={experienceForm.period_text} onChange={handleExperienceChange('period_text')} />
            <Input label="역할" value={experienceForm.role} onChange={handleExperienceChange('role')} />
            <Input label="기술 스택" value={experienceForm.tech_stack} onChange={handleExperienceChange('tech_stack')} />
            <Input label="정렬 순서" type="number" value={experienceForm.sort_order} onChange={handleExperienceChange('sort_order')} />
            <Textarea label="상세 내용" value={experienceForm.description} onChange={handleExperienceChange('description')} />
            <Textarea label="성과" value={experienceForm.achievement} onChange={handleExperienceChange('achievement')} />
            <Textarea label="배운 점" value={experienceForm.learned} onChange={handleExperienceChange('learned')} />
            <Textarea label="관련 역량" value={experienceForm.related_skills} onChange={handleExperienceChange('related_skills')} />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingExperience}
              className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSavingExperience ? '저장 중...' : editingExperienceId === null ? '경험 추가' : '경험 수정'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {sortedExperiences.length === 0 ? (
            <div className="text-sm text-gray-500">등록된 경험이 없습니다.</div>
          ) : (
            sortedExperiences.map((item) => (
              <div key={item.id} className="border border-black p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">
                      {item.title} <span className="text-gray-500">· {item.category}</span>
                    </div>
                    <div className="text-sm text-gray-600">{item.organization ?? '-'} / {item.period_text ?? '-'}</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExperienceId(item.id);
                        setExperienceForm(toExperienceForm(item));
                      }}
                      className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      <Pencil className="w-4 h-4" />
                      편집
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExperience(item.id)}
                      disabled={deletingExperienceId === item.id}
                      className="inline-flex items-center gap-1 text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingExperienceId === item.id ? '삭제 중' : '삭제'}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{item.description ?? '-'}</div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="border border-black p-6 space-y-6 bg-white">
        <div className="flex items-center justify-between border-b border-black pb-3">
          <h2 className="text-xl font-serif font-bold">자격증</h2>
          <button
            type="button"
            onClick={() => {
              setEditingCertificationId(null);
              setCertificationForm(EMPTY_CERTIFICATION);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <Plus className="w-4 h-4" />
            새 자격증 추가
          </button>
        </div>

        <form onSubmit={handleCertificationSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="이름" value={certificationForm.name} onChange={handleCertificationChange('name')} required />
            <Input label="발급 기관" value={certificationForm.issuer} onChange={handleCertificationChange('issuer')} />
            <Input label="취득일" type="date" value={certificationForm.acquired_date} onChange={handleCertificationChange('acquired_date')} />
            <Textarea label="설명" value={certificationForm.description} onChange={handleCertificationChange('description')} />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingCertification}
              className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSavingCertification ? '저장 중...' : editingCertificationId === null ? '자격증 추가' : '자격증 수정'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {sortedCertifications.length === 0 ? (
            <div className="text-sm text-gray-500">등록된 자격증이 없습니다.</div>
          ) : (
            sortedCertifications.map((item) => (
              <div key={item.id} className="border border-black p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.issuer ?? '-'} / {formatDate(item.acquired_date)}</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCertificationId(item.id);
                        setCertificationForm(toCertificationForm(item));
                      }}
                      className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      <Pencil className="w-4 h-4" />
                      편집
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCertification(item.id)}
                      disabled={deletingCertificationId === item.id}
                      className="inline-flex items-center gap-1 text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingCertificationId === item.id ? '삭제 중' : '삭제'}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{item.description ?? '-'}</div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="border border-black p-6 space-y-6 bg-white">
        <div className="flex items-center justify-between border-b border-black pb-3">
          <h2 className="text-xl font-serif font-bold">어학 성적</h2>
          <button
            type="button"
            onClick={() => {
              setEditingLanguageId(null);
              setLanguageForm(EMPTY_LANGUAGE);
            }}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <Plus className="w-4 h-4" />
            새 어학 성적 추가
          </button>
        </div>

        <form onSubmit={handleLanguageSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="시험명" value={languageForm.test_name} onChange={handleLanguageChange('test_name')} required />
            <Input label="점수" value={languageForm.score} onChange={handleLanguageChange('score')} />
            <Input label="등급" value={languageForm.grade} onChange={handleLanguageChange('grade')} />
            <Input label="취득일" type="date" value={languageForm.acquired_date} onChange={handleLanguageChange('acquired_date')} />
            <Textarea label="설명" value={languageForm.description} onChange={handleLanguageChange('description')} />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingLanguage}
              className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSavingLanguage ? '저장 중...' : editingLanguageId === null ? '어학 성적 추가' : '어학 성적 수정'}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {sortedLanguages.length === 0 ? (
            <div className="text-sm text-gray-500">등록된 어학 성적이 없습니다.</div>
          ) : (
            sortedLanguages.map((item) => (
              <div key={item.id} className="border border-black p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{item.test_name}</div>
                    <div className="text-sm text-gray-600">
                      {item.score ?? '-'} / {item.grade ?? '-'} / {formatDate(item.acquired_date)}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLanguageId(item.id);
                        setLanguageForm(toLanguageForm(item));
                      }}
                      className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                    >
                      <Pencil className="w-4 h-4" />
                      편집
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLanguage(item.id)}
                      disabled={deletingLanguageId === item.id}
                      className="inline-flex items-center gap-1 text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingLanguageId === item.id ? '삭제 중' : '삭제'}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">{item.description ?? '-'}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        className="w-full border border-black p-3 min-h-[96px] focus:outline-none focus:ring-1 focus:ring-black"
      />
    </div>
  );
}
