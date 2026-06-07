import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function MyPage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPassword('');
      setMessage(null);
      setError(null);
    }
  }, [user]);

  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-';

  const hasChanges = user ? name.trim() !== user.name || password.trim().length > 0 : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !hasChanges) {
      return;
    }

    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload: { name?: string; password?: string } = {};

      if (name.trim() !== user.name) {
        payload.name = name.trim();
      }

      if (password.trim()) {
        payload.password = password.trim();
      }

      await updateProfile(payload);
      setPassword('');
      setMessage('마이페이지 정보가 저장되었습니다.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-serif font-bold">마이페이지</h1>
          <p className="text-gray-600 mt-2">사용자 정보를 불러오는 중입니다.</p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">마이페이지</h1>
          <p className="text-gray-600 mt-2">계정 정보를 확인하고 수정할 수 있습니다.</p>
        </div>
        <div className="text-sm text-gray-600 border border-black/10 bg-gray-50 px-4 py-3">
          <div className="font-medium text-black">가입일</div>
          <div>{joinDate}</div>
        </div>
      </header>

      <div className="border border-black p-8 max-w-2xl bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || message) && (
            <div
              className={`p-3 rounded border ${
                error ? 'bg-red-50 border-red-300 text-red-700' : 'bg-green-50 border-green-300 text-green-700'
              }`}
            >
              {error || message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              disabled={isSaving}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="w-full border border-gray-300 bg-gray-50 text-gray-500 p-3 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다.</p>
          </div>

          <div className="pt-4 border-t border-black">
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              새 비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="변경하려면 입력하세요"
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              disabled={isSaving}
              autoComplete="new-password"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving || !hasChanges}
              className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}