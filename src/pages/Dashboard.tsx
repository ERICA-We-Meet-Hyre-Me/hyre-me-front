import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, FileText, Sparkles, ArrowRight, User } from 'lucide-react';
import {
  apiService,
  CompanyResponse,
  GeneratedResumeResponse,
  PortfolioCertificationResponse,
  PortfolioExperienceResponse,
  PortfolioLanguageResponse,
  PortfolioProfileResponse,
} from '../services/api';

type ActivityItem = {
  id: string;
  type: 'resume' | 'company' | 'portfolio';
  title: string;
  date: string;
};

export default function Dashboard() {
  const [profile, setProfile] = useState<PortfolioProfileResponse | null>(null);
  const [experiences, setExperiences] = useState<PortfolioExperienceResponse[]>([]);
  const [certifications, setCertifications] = useState<PortfolioCertificationResponse[]>([]);
  const [languages, setLanguages] = useState<PortfolioLanguageResponse[]>([]);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [resumes, setResumes] = useState<GeneratedResumeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [profileData, experienceData, certificationData, languageData, companyData, resumeData] = await Promise.all([
          apiService.getPortfolioProfile(),
          apiService.listPortfolioExperiences(),
          apiService.listPortfolioCertifications(),
          apiService.listPortfolioLanguages(),
          apiService.listCompanies(),
          apiService.listGeneratedResumes(),
        ]);

        setProfile(profileData);
        setExperiences(experienceData);
        setCertifications(certificationData);
        setLanguages(languageData);
        setCompanies(companyData);
        setResumes(resumeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '대시보드를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const portfolioItems = (profile ? 1 : 0) + experiences.length + certifications.length + languages.length;
    return {
      portfolioItems,
      savedCompanies: companies.length,
      generatedResumes: resumes.length,
    };
  }, [profile, experiences.length, certifications.length, languages.length, companies.length, resumes.length]);

  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];

    if (profile?.updated_at) {
      items.push({ id: 'profile', type: 'portfolio', title: '포트폴리오 기본 정보 업데이트', date: profile.updated_at });
    }

    experiences.forEach((item) => {
      items.push({
        id: `experience-${item.id}`,
        type: 'portfolio',
        title: item.title,
        date: item.updated_at ?? item.created_at ?? '',
      });
    });

    certifications.forEach((item) => {
      items.push({
        id: `certification-${item.id}`,
        type: 'portfolio',
        title: item.name,
        date: item.updated_at ?? item.created_at ?? '',
      });
    });

    languages.forEach((item) => {
      items.push({
        id: `language-${item.id}`,
        type: 'portfolio',
        title: item.test_name,
        date: item.updated_at ?? item.created_at ?? '',
      });
    });

    companies.forEach((item) => {
      items.push({
        id: `company-${item.id}`,
        type: 'company',
        title: `${item.name} ${item.role}`,
        date: item.updated_at ?? item.created_at ?? '',
      });
    });

    resumes.forEach((item) => {
      items.push({
        id: `resume-${item.id}`,
        type: 'resume',
        title: item.title,
        date: item.updated_at ?? item.created_at ?? '',
      });
    });

    return items
      .filter((item) => item.date)
      .sort((left, right) => right.date.localeCompare(left.date))
      .slice(0, 4);
  }, [profile, experiences, certifications, languages, companies, resumes]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif font-bold">대시보드</h1>
        <p className="text-gray-600 mt-2">등록된 포트폴리오와 기업, 자소서 현황을 한눈에 확인하세요.</p>
      </header>

      {error && <div className="border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={FileText} title="내 포트폴리오 항목" value={isLoading ? '...' : stats.portfolioItems} />
        <StatCard icon={Building2} title="스크랩한 기업" value={isLoading ? '...' : stats.savedCompanies} />
        <StatCard icon={Sparkles} title="생성된 자소서" value={isLoading ? '...' : stats.generatedResumes} />
      </div>

      <div className="flex gap-4">
        <Link to="/portfolio" className="flex items-center gap-2 bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors">
          <FileText className="w-4 h-4" />
          포트폴리오 업데이트
        </Link>
        <Link to="/companies" className="flex items-center gap-2 border border-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors">
          기업 관리
        </Link>
        <Link to="/resumes" className="flex items-center gap-2 border border-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors">
          자소서 목록 보기
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-serif font-bold mb-4 border-b border-black pb-2">최근 활동</h2>
        <div className="border border-black divide-y divide-black">
          {isLoading ? (
            <div className="p-4 text-gray-500">불러오는 중...</div>
          ) : activities.length === 0 ? (
            <div className="p-4 text-gray-500">최근 활동이 없습니다.</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {activity.type === 'resume' && <FileText className="w-5 h-5 text-gray-500" />}
                  {activity.type === 'company' && <Building2 className="w-5 h-5 text-gray-500" />}
                  {activity.type === 'portfolio' && <User className="w-5 h-5 text-gray-500" />}
                  <span className="font-medium">{activity.title}</span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  {activity.date}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number | string;
}) {
  return (
    <div className="border border-black p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5" />
        <h2 className="font-serif font-bold">{title}</h2>
      </div>
      <div className="text-4xl font-serif mt-auto">{value}</div>
    </div>
  );
}
