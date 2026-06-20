import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Building2, Loader2, Globe } from 'lucide-react';
import { apiService, CompanyResponse } from '../services/api';

export default function ResumeGenerator() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | ''>('');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('한국어');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. 페이지 켜지면 내가 등록해둔 목표 기업 목록 가져오기
  useEffect(() => {
    apiService.listCompanies()
      .then(setCompanies)
      .catch(() => setError('기업 목록을 불러오지 못했습니다.'));
  }, []);

  // 2. 버튼 눌렀을 때 백엔드로 요청 보내기
  const handleGenerate = async () => {
    if (!selectedCompanyId) {
      alert('지원할 기업을 먼저 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 백엔드 API 호출
const newResume = await apiService.generateResume({
        company_id: Number(selectedCompanyId),
        additional_prompt: additionalPrompt,
        language: selectedLanguage
      });
      
      // 생성이 완료되면 생성된 자소서 열람 페이지로 이동
      navigate(`/resumes/${newResume.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 자소서 작성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-serif font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8" />
          AI 맞춤형 자소서 생성
        </h1>
        <p className="text-gray-600 mt-2">등록한 포트폴리오와 기업정보를 융합하여 자기소개서를 생성합니다.</p>
      </header>

      <div className="border border-black p-8 space-y-6 bg-white">
        {error && <div className="p-4 bg-red-50 text-red-600 border border-red-200">{error}</div>}

        {/* 기업 선택 영역 */}
        <div className="space-y-2">
          <label className="block font-medium text-gray-700 flex items-center gap-2">
            <Building2 className="w-5 h-5" /> 목표 지원 기업 선택
          </label>
          <select 
            className="w-full border border-black p-3"
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value ? Number(e.target.value) : '')}
            disabled={isGenerating}
          >
            <option value="">지원할 기업을 선택하세요</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
            ))}
          </select>
        </div>
        
        {/* 출력 언어 선택 영역 */}
        <div className="space-y-2">
          <label className="block font-medium text-gray-700 flex items-center gap-2">
            <Globe className="w-5 h-5" /> 출력 자소서 언어 선택
          </label>
          <select 
            className="w-full border border-black p-3 bg-white"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={isGenerating}
          >
            <option value="한국어">한국어 (Default)</option>
            <option value="영어">영어 (English)</option>
            <option value="일본어">일본어 (日本語)</option>
            <option value="중국어">중국어 (中文)</option>
            <option value="아랍어">아랍어 (العربية)</option>
            <option value="스페인어">스페인어 (Español)</option>
          </select>
        </div>

        {/* 추가 요청사항 영역 */}
        <div className="space-y-2">
          <label className="block font-medium text-gray-700">추가 요청사항 (선택)</label>
          <textarea 
            className="w-full border border-black p-3 h-32"
            placeholder="예시: 글자 수 500자 내외로 조율해, 내가 프로젝트 회장직 수행하며 갈등을 해결했던 에피소드를 특히 강조해 줘."
            value={additionalPrompt}
            onChange={(e) => setAdditionalPrompt(e.target.value)}
            disabled={isGenerating}
          />
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedCompanyId}
          className="w-full flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI가 이력서를 분석하여 자소서를 쓰는 중... (약 15초 소요)
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              최종 자소서 생성하기
            </>
          )}
        </button>
      </div>
    </div>
  );
}