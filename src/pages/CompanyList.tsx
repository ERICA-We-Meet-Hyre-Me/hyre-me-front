import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Trash2 } from 'lucide-react';
import { apiService, CompanyResponse } from '../services/api';

export default function CompanyList() {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await apiService.listCompanies();
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '기업 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const sortedCompanies = useMemo(
    () =>
      [...companies].sort((left, right) => {
        const leftDate = left.updated_at ?? left.created_at ?? '';
        const rightDate = right.updated_at ?? right.created_at ?? '';
        return rightDate.localeCompare(leftDate);
      }),
    [companies],
  );

  const handleDelete = async (companyId: number) => {
    if (!window.confirm('이 기업을 삭제할까요?')) {
      return;
    }

    setIsDeleting(companyId);
    setError(null);

    try {
      await apiService.deleteCompany(companyId);
      setCompanies((current) => current.filter((company) => company.id !== companyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '기업을 삭제하지 못했습니다.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">목표 기업 관리</h1>
          <p className="text-gray-600 mt-2">지원할 기업의 공고 정보를 등록하고 관리하세요.</p>
        </div>
        <Link to="/companies/new" className="flex items-center gap-2 bg-black text-white px-4 py-2 font-medium hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          기업 추가
        </Link>
      </header>

      {error && <div className="border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="border border-black overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">불러오는 중...</div>
        ) : sortedCompanies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">등록된 기업이 없습니다.</div>
        ) : (
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
              {sortedCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{company.name}</div>
                      {company.job_posting_url && <div className="text-xs text-gray-500 truncate max-w-[240px]">{company.job_posting_url}</div>}
                    </div>
                  </td>
                  <td className="p-4">{company.role}</td>
                  <td className="p-4">{company.deadline_text ?? '-'}</td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 border border-black text-xs">
                      {company.status ?? '미설정'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/companies/${company.id}`} className="text-sm font-medium hover:underline mr-4">
                      편집
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(company.id)}
                      disabled={isDeleting === company.id}
                      className="inline-flex items-center gap-1 text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isDeleting === company.id ? '삭제 중' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
