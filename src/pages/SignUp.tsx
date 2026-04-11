import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy signup action
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md border border-black p-8">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-3xl font-bold tracking-tighter">hyre-me</Link>
          <h1 className="text-xl mt-4 font-serif">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="name">이름</label>
            <input 
              type="text" 
              id="name" 
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="홍길동"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">이메일</label>
            <input 
              type="email" 
              id="email" 
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors">
            가입하기
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요? <Link to="/login" className="text-black hover:underline font-medium">로그인</Link>
        </div>
      </div>
    </div>
  );
}
