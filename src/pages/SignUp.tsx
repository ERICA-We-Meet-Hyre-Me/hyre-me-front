import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setLocalError('비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setLocalError(null);

    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
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
          <h1 className="text-xl mt-4 font-serif">회원가입</h1>
        </div>

        {displayError && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="name">이름</label>
            <input 
              type="text" 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="홍길동"
              required
              disabled={isLoading}
            />
          </div>
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

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="••••••••"
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? '가입 중...' : '가입하기'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요? <Link to="/login" className="text-black hover:underline font-medium">로그인</Link>
        </div>
      </div>
    </div>
  );
}
