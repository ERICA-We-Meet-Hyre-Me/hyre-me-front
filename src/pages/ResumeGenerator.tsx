import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';

const DUMMY_COMPANIES = [
  { id: 1, name: '네이버 - 프론트엔드 개발자' },
  { id: 2, name: '카카오 - 웹 프론트엔드 (커머스)' },
  { id: 3, name: '토스 - Frontend Developer (Core)' },
];

export default function ResumeGenerator() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');

  const handleGenerate = () => {
    if (!selectedCompany) {
      alert('목표 기업을 선택해주세요.');
      return;
    }
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      navigate('/resumes/1'); // Navigate to dummy generated resume
    }, 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-serif font-bold">AI 자소서 생성</h1>
        <p className="text-gray-600 mt-2">내 포트폴리오와 목표 기업의 공고를 바탕으로 최적화된 자소서를 생성합니다.</p>
      </header>

      <div className="border border-black p-8 space-y-8">
        {/* Step 1: Portfolio Check */}
        <div>
          <h2 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-black text-white text-xs rounded-full">1</span>
            포트폴리오 확인
          </h2>
          <div className="bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
            <p>✓ 기본 정보 및 학력 (입력 완료)</p>
            <p>✓ 경력 및 경험 2건 (입력 완료)</p>
            <p className="mt-2 text-xs text-gray-500">* 포트폴리오 내용은 '내 포트폴리오' 메뉴에서 수정할 수 있습니다.</p>
          </div>
        </div>

        {/* Step 2: Select Company */}
        <div>
          <h2 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-black text-white text-xs rounded-full">2</span>
            목표 기업 선택
          </h2>
          <select 
            className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            disabled={isGenerating}
          >
            <option value="">기업을 선택하세요</option>
            {DUMMY_COMPANIES.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>

        {/* Step 3: Additional Prompt (Optional) */}
        <div>
          <h2 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 bg-black text-white text-xs rounded-full">3</span>
            추가 요청사항 (선택)
          </h2>
          <textarea 
            className="w-full border border-black p-3 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="예: 리더십 경험을 특히 강조해주세요. 분량은 1000자 내외로 해주세요."
            disabled={isGenerating}
          />
        </div>

        {/* Generate Button */}
        <div className="pt-4 border-t border-black text-center">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI가 자소서를 작성하고 있습니다...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                AI 자소서 생성하기
              </>
            )}
          </button>
          {isGenerating && (
            <p className="text-sm text-gray-500 mt-4">
              기업의 인재상과 당신의 경험을 매칭하는 중입니다. 최대 1분 정도 소요될 수 있습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
