import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function ResumeGenerator() {
  const handleGenerate = () => {
    alert('AI 자소서 생성은 아직 준비 중입니다.');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="text-center">
        <h1 className="text-3xl font-serif font-bold">AI 자소서 생성</h1>
        <p className="text-gray-600 mt-2">이 기능은 아직 서버 구현이 완료되지 않아 준비 중입니다.</p>
      </header>

      <div className="border border-black p-8 space-y-6 text-center bg-white">
        <Sparkles className="w-10 h-10 mx-auto" />
        <p className="text-gray-700">
          현재는 포트폴리오와 목표 기업 데이터를 등록하고, 이미 생성된 자소서를 열람/관리하는 기능만 사용할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          AI 자소서 생성하기
        </button>
        <div className="flex justify-center gap-4">
          <Link to="/portfolio" className="border border-black px-6 py-3 font-medium hover:bg-gray-50 transition-colors">
            포트폴리오 관리
          </Link>
          <Link to="/companies" className="border border-black px-6 py-3 font-medium hover:bg-gray-50 transition-colors">
            기업 관리
          </Link>
          <Link to="/resumes" className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors">
            자소서 목록
          </Link>
        </div>
      </div>
    </div>
  );
}
