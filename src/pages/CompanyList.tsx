import { Link } from 'react-router-dom';
import { Plus, Building2, ExternalLink } from 'lucide-react';

const DUMMY_COMPANIES = [
  { id: 1, name: '네이버', role: '프론트엔드 개발자', deadline: '2026-05-01', status: '지원 준비중' },
  { id: 2, name: '카카오', role: '웹 프론트엔드 (커머스)', deadline: '2026-04-20', status: '자소서 작성중' },
  { id: 3, name: '토스', role: 'Frontend Developer (Core)', deadline: '상시채용', status: '스크랩' },
];

export default function CompanyList() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">목표 기업 관리</h1>
          <p className="text-gray-600 mt-2">지원하고자 하는 기업의 공고를 스크랩하고 관리하세요.</p>
        </div>
        <Link to="/companies/new" className="flex items-center gap-2 bg-black text-white px-4 py-2 font-medium hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" /> 기업 추가
        </Link>
      </header>

      <div className="border border-black">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black bg-gray-50">
              <th className="p-4 font-serif font-bold">기업명</th>
              <th className="p-4 font-serif font-bold">지원 직무</th>
              <th className="p-4 font-serif font-bold">마감일</th>
              <th className="p-4 font-serif font-bold">상태</th>
              <th className="p-4 font-serif font-bold text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {DUMMY_COMPANIES.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{company.name}</span>
                </td>
                <td className="p-4">{company.role}</td>
                <td className="p-4">{company.deadline}</td>
                <td className="p-4">
                  <span className="inline-block px-2 py-1 border border-black text-xs">
                    {company.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link to={`/companies/${company.id}`} className="text-sm font-medium hover:underline mr-4">편집</Link>
                  <Link to="/generate" className="text-sm font-medium text-white bg-black px-3 py-1 hover:bg-gray-800">자소서 쓰기</Link>
                </td>
              </tr>
            ))}
            {DUMMY_COMPANIES.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  등록된 기업이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
