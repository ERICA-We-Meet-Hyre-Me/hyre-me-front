import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FileText, FileOutput, Building2, LayoutDashboard, User, LogOut, FileOutputIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ResumeTransitionState {
  resumeTransition?: boolean;
  previewContent?: string;
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const transitionState = location.state as ResumeTransitionState | null;
  const isResumeTransition = location.pathname.startsWith('/resumes/') && transitionState?.resumeTransition === true;
  const [isTransitionExiting, setIsTransitionExiting] = useState(false);

  const navigation = [
    { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
    { name: '내 포트폴리오', href: '/portfolio', icon: User },
    { name: '목표 기업 관리', href: '/companies', icon: Building2 },
    { name: 'AI 자소서 생성', href: '/generate', icon: FileOutput },
    { name: '생성된 자소서', href: '/resumes', icon: FileText },
    { name: '마이페이지', href: '/mypage', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!isResumeTransition) {
      setIsTransitionExiting(false);
      return;
    }

    setIsTransitionExiting(false);
    let exitTimer: number | null = null;
    const handleResumeViewerReady = (event: Event) => {
      const readyEvent = event as CustomEvent<{ id?: number }>;
      const currentId = Number(location.pathname.split('/').pop());

      if (readyEvent.detail?.id !== undefined && readyEvent.detail.id !== currentId) {
        return;
      }

      setIsTransitionExiting(true);
      exitTimer = window.setTimeout(() => {
        navigate(location.pathname, { replace: true, state: null });
      }, 720);
    };

    window.addEventListener('resume-viewer-ready', handleResumeViewerReady);
    return () => {
      window.removeEventListener('resume-viewer-ready', handleResumeViewerReady);
      if (exitTimer !== null) {
        window.clearTimeout(exitTimer);
      }
    };
  }, [isResumeTransition, location.pathname, navigate]);

  return (
    <div className="h-dvh flex overflow-hidden bg-white text-black print:h-auto print:overflow-visible print:block">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black flex h-full flex-col overflow-hidden no-print">
        <div className="h-16 flex items-center px-6 border-b border-black">
          <Link to="/dashboard" className="font-serif text-2xl font-bold tracking-tighter">
            hyre-me
          </Link>
        </div>
        <nav className="flex-1 min-h-0 overflow-y-auto py-6 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-black space-y-3">
          {user && (
            <div className="text-xs text-gray-600 px-2">
              <div className="font-medium text-black">{user.name}</div>
              <div className="truncate">{user.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 rounded transition-colors text-black"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 flex min-h-0 min-w-0 flex-col overflow-hidden print:block print:overflow-visible print:h-auto">
        <div className="flex-1 min-h-0 overflow-y-auto p-8 print:overflow-visible print:h-auto print:p-0">
          <div className="max-w-5xl mx-auto print:max-w-none print:m-0">
            <Outlet />
          </div>
        </div>
        {isResumeTransition && (
          <div
            className={`resume-route-transition ${isTransitionExiting ? 'resume-route-transition-exiting' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="완성된 자소서로 이동 중"
          >
            <article className="resume-stream-paper resume-route-transition-paper flex flex-col border border-black bg-white p-6 sm:p-10">
              <div className="flex items-start justify-between gap-4 border-b border-black pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">HYRE-ME / AI DRAFT</p>
                  <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">자기소개서</h2>
                </div>
                <span className="pt-1 text-right text-xs text-gray-500">생성 완료</span>
              </div>
              <div className="resume-stream-text-scroll mt-8 min-h-0 flex-1 whitespace-pre-wrap break-words text-[15px] leading-8 text-gray-800 sm:text-base">
                {transitionState?.previewContent || '작성된 내용이 없습니다.'}
              </div>
            </article>
          </div>
        )}
      </main>
    </div>
  );
}
