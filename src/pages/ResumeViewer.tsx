import { useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import { ArrowLeft, Printer, Download } from 'lucide-react';

const DUMMY_MARKDOWN = `
# 자기소개서: 네이버 프론트엔드 개발자

## 1. 지원동기 및 입사 후 포부
네이버는 끊임없는 기술 혁신을 통해 수천만 사용자의 일상을 연결하는 플랫폼입니다. 저는 사용자 경험을 최우선으로 생각하며, 복잡한 문제를 직관적인 UI로 풀어내는 프론트엔드 개발자로서 네이버의 비전에 깊이 공감합니다. 특히 최근 네이버가 주력하고 있는 글로벌 서비스 확장 과정에서, 제가 가진 React 기반의 SPA 최적화 경험과 다국어 처리 경험이 큰 시너지를 낼 것이라 확신하여 지원하게 되었습니다.

입사 후에는 네이버의 방대한 트래픽을 견고하게 처리할 수 있는 프론트엔드 아키텍처를 설계하고 싶습니다. 단순히 주어진 화면을 구현하는 것을 넘어, 성능 병목을 선제적으로 찾아 개선하고 접근성을 높여 모든 사용자가 소외 없이 네이버의 서비스를 누릴 수 있도록 기여하겠습니다.

## 2. 직무 관련 경험 및 역량
**[사내 어드민 대시보드 성능 30% 개선]**
테크스타트업 인턴십 기간 동안 React와 TypeScript를 활용하여 사내 어드민 대시보드를 개발했습니다. 초기 렌더링 속도가 느리다는 피드백을 받고, React.memo와 useMemo를 활용한 불필요한 렌더링 방지, 그리고 코드 스플리팅을 적용하여 초기 로딩 속도를 30% 이상 단축시킨 경험이 있습니다. 이 과정에서 브라우저의 렌더링 파이프라인을 깊이 이해할 수 있었습니다.

**[주도적인 문제 해결과 협업]**
웹 프로그래밍 동아리 회장으로 활동하며 교내 해커톤을 주최했습니다. 기획자, 디자이너, 개발자 간의 소통 부재로 프로젝트 진행이 지연되는 문제를 해결하기 위해, Notion과 Figma를 활용한 협업 가이드라인을 수립했습니다. 그 결과 참가 팀의 90%가 기한 내에 프로젝트를 완수할 수 있었으며, 저 또한 개발 외적인 커뮤니케이션 역량의 중요성을 깨달았습니다.

## 3. 네이버의 핵심 가치와 부합하는 경험
네이버의 핵심 가치 중 '주도적으로 문제를 찾고 해결하는 자세'는 저의 성장 방식과 일치합니다. 기존의 비효율적인 동아리 운영 방식을 자동화하기 위해 자발적으로 슬랙 봇을 개발하여 공지사항 전달 시간을 주당 2시간 절약한 경험이 있습니다. 네이버에서도 주어진 업무에 안주하지 않고, 서비스의 완성도를 높이기 위해 끊임없이 고민하고 개선하는 개발자가 되겠습니다.
`;

export default function ResumeViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Action Bar - Hidden on Print */}
      <div className="flex items-center justify-between border-b border-black pb-4 no-print">
        <button onClick={() => navigate('/resumes')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
          <ArrowLeft className="w-4 h-4" /> 목록으로 돌아가기
        </button>
        <div className="flex gap-4">
          <button onClick={handlePrint} className="flex items-center gap-2 border border-black px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors">
            <Printer className="w-4 h-4" /> 인쇄 / PDF 저장
          </button>
        </div>
      </div>

      {/* Resume Content - This part will be printed */}
      <div className="bg-white max-w-4xl mx-auto print:max-w-none print:m-0">
        <div className="prose prose-neutral max-w-none prose-headings:font-serif prose-h1:text-3xl prose-h1:border-b prose-h1:border-black prose-h1:pb-4 prose-h2:text-xl prose-h2:mt-8 prose-p:leading-relaxed prose-p:text-gray-800">
          <Markdown>{DUMMY_MARKDOWN}</Markdown>
        </div>
      </div>
    </div>
  );
}
