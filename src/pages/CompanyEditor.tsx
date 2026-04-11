import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CompanyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  return (
    <div className="space-y-8">
      <header>
        <button onClick={() => navigate('/companies')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4">
          <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
        </button>
        <h1 className="text-3xl font-serif font-bold">{isNew ? '새 목표 기업 추가' : '기업 정보 편집'}</h1>
        <p className="text-gray-600 mt-2">채용 공고의 상세 내용과 인재상을 입력하면 AI가 더 정확한 자소서를 작성합니다.</p>
      </header>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">기업명</label>
            <input type="text" className="w-full border border-black p-3" placeholder="예: 네이버" defaultValue={!isNew ? '네이버' : ''} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">지원 직무</label>
            <input type="text" className="w-full border border-black p-3" placeholder="예: 프론트엔드 개발자" defaultValue={!isNew ? '프론트엔드 개발자' : ''} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">채용 마감일</label>
            <input type="text" className="w-full border border-black p-3" placeholder="예: 2026-05-01" defaultValue={!isNew ? '2026-05-01' : ''} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">채용 공고 링크</label>
            <input type="url" className="w-full border border-black p-3" placeholder="https://..." defaultValue={!isNew ? 'https://recruit.navercorp.com/...' : ''} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">자격 요건 (Required)</label>
          <textarea 
            className="w-full border border-black p-4 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-black" 
            placeholder="공고에 명시된 필수 자격 요건을 복사하여 붙여넣으세요."
            defaultValue={!isNew ? '- React, Vue 등 SPA 프레임워크 사용 경험\n- HTML/CSS/JavaScript에 대한 깊은 이해' : ''}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">우대 사항 (Preferred)</label>
          <textarea 
            className="w-full border border-black p-4 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-black" 
            placeholder="공고에 명시된 우대 사항을 복사하여 붙여넣으세요."
            defaultValue={!isNew ? '- TypeScript 적용 경험\n- 웹 접근성 및 성능 최적화 경험' : ''}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">기업 인재상 / 핵심 가치</label>
          <textarea 
            className="w-full border border-black p-4 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-black" 
            placeholder="기업 홈페이지에 있는 인재상이나 조직 문화를 입력하세요."
            defaultValue={!isNew ? '주도적으로 문제를 찾고 해결하는 사람, 동료와 적극적으로 소통하는 사람' : ''}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={() => navigate('/companies')} className="px-6 py-3 border border-black font-medium hover:bg-gray-50 transition-colors">
            취소
          </button>
          <button type="button" className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors">
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
}
