import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles, Target } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="h-16 border-b border-black flex items-center justify-between px-8">
        <div className="font-serif text-2xl font-bold tracking-tighter">hyre-me</div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-sm font-medium hover:underline">로그인</Link>
          <Link to="/signup" className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors">시작하기</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          당신의 경험을<br />가장 완벽한 언어로.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl">
          AI 에이전트가 당신의 포트폴리오와 목표 기업의 공고를 분석하여, 
          가장 적합한 맞춤형 자기소개서를 마크다운 형태로 생성합니다.
        </p>
        
        <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-lg font-medium hover:bg-gray-800 transition-colors">
          무료로 시작하기 <ArrowRight className="w-5 h-5" />
        </Link>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl w-full text-left">
          <div className="border border-black p-8">
            <FileText className="w-8 h-8 mb-4" />
            <h3 className="font-serif text-xl font-bold mb-2">1. 포트폴리오 등록</h3>
            <p className="text-gray-600">당신의 스펙, 경력, 학력 등 모든 경험을 한 번만 입력하세요.</p>
          </div>
          <div className="border border-black p-8">
            <Target className="w-8 h-8 mb-4" />
            <h3 className="font-serif text-xl font-bold mb-2">2. 목표 기업 설정</h3>
            <p className="text-gray-600">지원하고자 하는 기업의 채용 공고와 인재상을 등록하세요.</p>
          </div>
          <div className="border border-black p-8">
            <Sparkles className="w-8 h-8 mb-4" />
            <h3 className="font-serif text-xl font-bold mb-2">3. AI 자소서 생성</h3>
            <p className="text-gray-600">클릭 한 번으로 기업에 완벽하게 맞춰진 자소서를 받아보세요.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-black text-center text-sm text-gray-500">
        &copy; 2026 hyre-me. All rights reserved.
      </footer>
    </div>
  );
}
