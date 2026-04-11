import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter basename="/hyre-me-front/">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Authenticated Routes (with Sidebar) */}
        <Route element={<MainLayout />}>
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
    </BrowserRouter>
  );
}
