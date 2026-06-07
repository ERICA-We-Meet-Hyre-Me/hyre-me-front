import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MyPage from './pages/MyPage';
import PortfolioEditor from './pages/PortfolioEditor';
import CompanyList from './pages/CompanyList';
import CompanyEditor from './pages/CompanyEditor';
import ResumeGenerator from './pages/ResumeGenerator';
import GeneratedResumes from './pages/GeneratedResumes';
import ResumeViewer from './pages/ResumeViewer';

function HomeRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
}

// Protected Route 컴포넌트
function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return element;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Authenticated Routes (with Sidebar) */}
      <Route
        element={
          <ProtectedRoute element={<MainLayout />} />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/portfolio" element={<PortfolioEditor />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/:id" element={<CompanyEditor />} />
        <Route path="/generate" element={<ResumeGenerator />} />
        <Route path="/resumes" element={<GeneratedResumes />} />
        <Route path="/resumes/:id" element={<ResumeViewer />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/">
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
