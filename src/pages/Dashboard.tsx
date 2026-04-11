import { Link } from 'react-router-dom';
import { FileText, Building2, Sparkles, ArrowRight } from 'lucide-react';

const DUMMY_STATS = {
  portfolioItems: 12,
  savedCompanies: 5,
  generatedResumes: 8,
};

const RECENT_ACTIVITIES = [
  { id: 1, type: 'resume', title: '네이버 프론트엔드 개발자 자소서', date: '2026-04-10' },
  { id: 2, type: 'company', title: '카카오 2026 하반기 공채 스크랩', date: '2026-04-09' },
  { id: 3, type: 'portfolio', title: '정보처리기사 자격증 추가', date: '2026-04-08' },
  { id: 4, type: 'resume', title: '토스 코어 프론트엔드 자소서', date: '2026-04-05' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif font-bold">대시보드</h1>
        <p className="text-gray-600 mt-2">환영합니다. 오늘 당신의 커리어를 한 단계 발전시켜 보세요.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-black p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5" />
            <h2 className="font-serif font-bold">내 포트폴리오 항목</h2>
          </div>
          <div className="text-4xl font-serif mt-auto">{DUMMY_STATS.portfolioItems}</div>
        </div>
        <div className="border border-black p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-5 h-5" />
            <h2 className="font-serif font-bold">스크랩한 기업</h2>
          </div>
          <div className="text-4xl font-serif mt-auto">{DUMMY_STATS.savedCompanies}</div>
        </div>
        <div className="border border-black p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-serif font-bold">생성된 자소서</h2>
          </div>
          <div className="text-4xl font-serif mt-auto">{DUMMY_STATS.generatedResumes}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link to="/generate" className="flex items-center gap-2 bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors">
          <Sparkles className="w-4 h-4" /> 새 자소서 생성하기
        </Link>
        <Link to="/portfolio" className="flex items-center gap-2 border border-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors">
          포트폴리오 업데이트
        </Link>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-serif font-bold mb-4 border-b border-black pb-2">최근 활동</h2>
        <div className="border border-black divide-y divide-black">
          {RECENT_ACTIVITIES.map((activity) => (
            <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                {activity.type === 'resume' && <FileText className="w-5 h-5 text-gray-500" />}
                {activity.type === 'company' && <Building2 className="w-5 h-5 text-gray-500" />}
                {activity.type === 'portfolio' && <UserIcon className="w-5 h-5 text-gray-500" />}
                <span className="font-medium">{activity.title}</span>
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-4">
                {activity.date}
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
