import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Building2, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
    { name: '내 포트폴리오', href: '/portfolio', icon: User },
    { name: '목표 기업 관리', href: '/companies', icon: Building2 },
    { name: '생성된 자소서', href: '/resumes', icon: FileText },
    { name: '마이페이지', href: '/mypage', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-dvh flex overflow-hidden bg-white text-black">
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
      <main className="flex-1 flex min-h-0 min-w-0 flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
