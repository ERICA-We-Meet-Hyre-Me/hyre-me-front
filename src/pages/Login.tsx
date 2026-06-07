import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md border border-black p-8">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-3xl font-bold tracking-tighter">hyre-me</Link>
          <h1 className="text-xl mt-4 font-serif">로그인</h1>
        </div>

        {displayError && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">이메일</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="name@example.com"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">비밀번호</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요? <Link to="/signup" className="text-black hover:underline font-medium">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
