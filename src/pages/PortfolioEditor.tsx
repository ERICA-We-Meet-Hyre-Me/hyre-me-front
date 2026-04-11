import { Upload, Plus, Trash2 } from 'lucide-react';

const DUMMY_EXPERIENCES = [
  { id: 1, title: '프론트엔드 개발 인턴', company: '테크스타트업', period: '2025.07 - 2025.12', description: 'React 기반 사내 어드민 대시보드 개발' },
  { id: 2, title: '웹 프로그래밍 동아리 회장', company: '한국대학교', period: '2024.03 - 2025.02', description: '주 1회 스터디 주도 및 교내 해커톤 주최' },
];

export default function PortfolioEditor() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif font-bold">내 포트폴리오</h1>
        <p className="text-gray-600 mt-2">AI가 분석할 당신의 모든 경험과 스펙을 자세히 기록해 주세요.</p>
      </header>

      {/* File Upload Area */}
      <section className="border border-black p-8 text-center border-dashed">
        <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        <h3 className="font-medium mb-2">기존 이력서 파일 업로드 (PDF, Word)</h3>
        <p className="text-sm text-gray-500 mb-4">파일을 업로드하면 AI가 내용을 추출하여 아래 폼을 자동으로 채워줍니다.</p>
        <button className="border border-black px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
          파일 선택
        </button>
      </section>

      {/* Basic Info */}
      <section>
        <h2 className="text-xl font-serif font-bold mb-4 border-b border-black pb-2">기본 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">최종 학력</label>
            <input type="text" className="w-full border border-black p-3" defaultValue="한국대학교 컴퓨터공학과 학사" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">학점</label>
            <input type="text" className="w-full border border-black p-3" defaultValue="3.8 / 4.5" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">핵심 역량 (쉼표로 구분)</label>
            <input type="text" className="w-full border border-black p-3" defaultValue="React, TypeScript, Tailwind CSS, 커뮤니케이션" />
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-black pb-2">
          <h2 className="text-xl font-serif font-bold">경력 및 경험</h2>
          <button className="flex items-center gap-1 text-sm font-medium hover:underline">
            <Plus className="w-4 h-4" /> 추가하기
          </button>
        </div>
        
        <div className="space-y-4">
          {DUMMY_EXPERIENCES.map((exp) => (
            <div key={exp.id} className="border border-black p-6 relative group">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">활동명/직무</label>
                  <input type="text" className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black" defaultValue={exp.title} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">소속/기관</label>
                  <input type="text" className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black" defaultValue={exp.company} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">기간</label>
                  <input type="text" className="w-full border-b border-gray-300 py-1 focus:outline-none focus:border-black" defaultValue={exp.period} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">상세 내용 및 성과</label>
                <textarea className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black min-h-[100px]" defaultValue={exp.description} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end pt-8">
        <button className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
          포트폴리오 저장
        </button>
      </div>
    </div>
  );
}
