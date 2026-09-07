import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MyPage() {
  const navigate = useNavigate();
  const { user, updateProfile, deleteAccount } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPassword('');
      setConfirmPassword('');
      setMessage(null);
      setError(null);
    }
  }, [user]);

  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : '-';

  const hasChanges = user ? name.trim() !== user.name || password.trim().length > 0 : false;

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setDeletePassword('');
    setIsDeleteConfirmed(false);
    setDeleteError(null);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deletePassword.trim()) {
      setDeleteError('현재 비밀번호를 입력해주세요.');
      return;
    }

    if (!isDeleteConfirmed) {
      setDeleteError('탈퇴 진행 동의 항목을 확인해주세요.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteAccount(deletePassword);
      navigate('/', { replace: true });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : '회원 탈퇴에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !hasChanges) {
      return;
    }

    if (password.trim() && password !== confirmPassword) {
      setError('새 비밀번호와 확인 값이 일치하지 않습니다.');
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
            <label className="block text-sm font-medium mb-2 mt-4" htmlFor="confirmPassword">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="변경하려면 다시 입력하세요"
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
              disabled={isSaving}
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <a
              href="#account-deletion"
              onClick={(e) => {
                e.preventDefault();
                setDeleteError(null);
                setIsDeleteModalOpen(true);
              }}
              className="text-sm text-red-800 underline underline-offset-4 hover:text-red-950"
            >
              탈퇴하기
            </a>
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

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-md border border-black bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="delete-account-title" className="font-serif text-xl font-bold">
                  정말 탈퇴하시겠습니까?
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  기업 정보와 자소서를 포함한 모든 정보가 삭제됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                aria-label="탈퇴 모달 닫기"
                className="text-2xl leading-none text-gray-500 hover:text-black disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleDeleteAccount} className="mt-6 space-y-5">
              {deleteError && (
                <div className="border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">
                  {deleteError}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="deletePassword">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  id="deletePassword"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                  autoComplete="current-password"
                  disabled={isDeleting}
                  required
                />
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-sm leading-6">
                <input
                  type="checkbox"
                  checked={isDeleteConfirmed}
                  onChange={(e) => setIsDeleteConfirmed(e.target.checked)}
                  disabled={isDeleting}
                  className="mt-1 h-4 w-4 accent-black"
                />
                <span>네, 탈퇴를 진행하겠습니다</span>
              </label>

              <div className="flex justify-end gap-3 border-t border-black pt-5">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="border border-black px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || !isDeleteConfirmed || !deletePassword.trim()}
                  className="bg-red-900 px-4 py-2 text-sm font-medium text-white hover:bg-red-950 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isDeleting ? '탈퇴 처리 중...' : '탈퇴하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
