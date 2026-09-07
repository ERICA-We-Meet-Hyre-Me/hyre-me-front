import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Building2, Loader2, Globe } from 'lucide-react';
import { apiService, CompanyResponse } from '../services/api';
import type { ResumeGenerationStreamEvent } from '../services/resumeApi';

function getStreamStatusLabel(event: ResumeGenerationStreamEvent & { type: 'status' }) {
  const status = event.data.status?.toUpperCase();

  if (status === 'SAVING' || event.data.stage === 'saving') {
    return '생성된 내용을 저장하고 있습니다';
  }
  if (status === 'GENERATING' || event.data.stage === 'started') {
    return 'AI가 자소서를 작성하고 있습니다';
  }

  return event.data.stage || event.data.status || 'AI가 자소서를 작성하고 있습니다';
}

function StreamingText({ content, isGenerating }: { content: string; isGenerating: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.scrollTop = contentElement.scrollHeight;
    }
  }, [content]);

  return (
    <div ref={contentRef} className="resume-stream-text-scroll mt-8 min-h-0 flex-1 whitespace-pre-wrap break-words text-[15px] leading-8 text-gray-800 sm:text-base">
      {content || (
        <span className="text-gray-400">AI가 첫 문장을 준비하고 있습니다...</span>
      )}
      {isGenerating && <span className="resume-stream-cursor" aria-hidden="true" />}
    </div>
  );
}

export default function ResumeGenerator() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | ''>('');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('한국어');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStreamingPreview, setShowStreamingPreview] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [displayedContent, setDisplayedContent] = useState('');
  const [completedResumeId, setCompletedResumeId] = useState<number | null>(null);
  const [streamStatus, setStreamStatus] = useState('AI가 자소서를 작성하고 있습니다');
  const streamStartedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Reveal from one shared cursor. The larger the backlog, the more characters a frame consumes.
  useEffect(() => {
    if (!isGenerating) return;
    let animationFrame = 0;

    const revealFrame = () => {
      setDisplayedContent((current) => {
        if (current === streamingContent) return current;

        const pendingCharacters = Array.from(streamingContent.slice(current.length));
        const backlog = pendingCharacters.length;
        const charactersPerFrame = backlog > 400 ? 16 : backlog > 120 ? 8 : backlog > 32 ? 4 : backlog > 8 ? 2 : 1;

        return current + pendingCharacters.slice(0, charactersPerFrame).join('');
      });

      animationFrame = window.requestAnimationFrame(revealFrame);
    };

    animationFrame = window.requestAnimationFrame(revealFrame);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [streamingContent, isGenerating]);

  useEffect(() => {
    if (completedResumeId !== null && displayedContent === streamingContent) {
      navigate(`/resumes/${completedResumeId}`, {
        state: {
          resumeTransition: true,
          previewContent: displayedContent,
        },
      });
    }
  }, [completedResumeId, displayedContent, streamingContent, navigate]);

  // 1. 페이지 켜지면 내가 등록해둔 목표 기업 목록 가져오기
  useEffect(() => {
    apiService.listCompanies()
      .then(setCompanies)
      .catch(() => setError('기업 목록을 불러오지 못했습니다.'));
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // 2. 버튼 눌렀을 때 백엔드로 요청 보내기
  const handleGenerate = async () => {
    if (!selectedCompanyId) {
      alert('지원할 기업을 먼저 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setShowStreamingPreview(false);
    setStreamingContent('');
    setDisplayedContent('');
    setCompletedResumeId(null);
    setStreamStatus('AI가 자소서를 작성하고 있습니다');
    streamStartedRef.current = false;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const newResume = await apiService.generateResumeStream(
        {
          company_id: Number(selectedCompanyId),
          additional_prompt: additionalPrompt,
          language: selectedLanguage,
        },
        (event) => {
          if (event.type === 'status') {
            streamStartedRef.current = true;
            setShowStreamingPreview(true);
            setStreamStatus(getStreamStatusLabel(event));
            return;
          }

          if (event.type === 'content') {
            streamStartedRef.current = true;
            setShowStreamingPreview(true);
            if (event.data.replace) {
              setStreamingContent(event.data.delta);
              setDisplayedContent('');
            } else {
              setStreamingContent((current) => current + event.data.delta);
            }
            return;
          }

          if (event.type === 'complete') {
            setStreamStatus('저장 완료');
          }
        },
        abortController.signal,
      );
      
      setCompletedResumeId(newResume.id);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      if (streamStartedRef.current) {
        setStreamStatus('생성 중 오류가 발생했습니다');
        setShowStreamingPreview(false);
      }
      setError(err instanceof Error ? err.message : 'AI 자소서 작성 중 오류가 발생했습니다.');
      setIsGenerating(false);
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
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

      {showStreamingPreview && (
        <section
          className="resume-stream-backdrop resume-stream-preview absolute inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-live="polite"
          aria-label="AI 자소서 생성 미리보기"
        >
          <article className="resume-stream-paper flex flex-col border border-black bg-white p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4 border-b border-black pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">HYRE-ME / AI DRAFT</p>
                <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">자기소개서</h2>
              </div>
              <div className="flex shrink-0 items-center gap-2 pt-1 text-right text-xs text-gray-500">
                {isGenerating && <span className="h-2 w-2 animate-pulse rounded-full bg-black" aria-hidden="true" />}
                {streamStatus}
              </div>
            </div>

            <StreamingText content={displayedContent} isGenerating={isGenerating} />
          </article>
        </section>
      )}

      <div className={`border border-black bg-white p-8 space-y-6 transition-opacity duration-300 ${isGenerating ? 'opacity-50' : ''}`}>
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
          type="button"
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