import { Link, Outlet, useLocation } from 'react-router-dom';
import { FileText, Building2, LayoutDashboard, User, FileOutput } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();

  const navigation = [
    { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
    { name: '내 포트폴리오', href: '/portfolio', icon: User },
    { name: '목표 기업 관리', href: '/companies', icon: Building2 },
    { name: '자소서 생성', href: '/generate', icon: FileOutput },
    { name: '생성된 자소서', href: '/resumes', icon: FileText },
    { name: '마이페이지', href: '/mypage', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-black flex flex-col no-print">
        <div className="h-16 flex items-center px-6 border-b border-black">
          <Link to="/dashboard" className="font-serif text-2xl font-bold tracking-tighter">
            hyre-me
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
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
        <div className="p-4 border-t border-black">
          <Link to="/" className="text-sm text-gray-500 hover:text-black">
            로그아웃
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
