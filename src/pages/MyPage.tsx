export default function MyPage() {
  const DUMMY_USER = {
    name: '홍길동',
    email: 'hong@example.com',
    joinDate: '2026-01-15',
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-serif font-bold">마이페이지</h1>
        <p className="text-gray-600 mt-2">계정 정보를 확인하고 수정할 수 있습니다.</p>
      </header>

      <div className="border border-black p-8 max-w-2xl">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="name">이름</label>
            <input 
              type="text" 
              id="name" 
              defaultValue={DUMMY_USER.name}
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">이메일</label>
            <input 
              type="email" 
              id="email" 
              defaultValue={DUMMY_USER.email}
              disabled
              className="w-full border border-gray-300 bg-gray-50 text-gray-500 p-3 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다.</p>
          </div>

          <div className="pt-4 border-t border-black">
            <label className="block text-sm font-medium mb-2" htmlFor="password">새 비밀번호</label>
            <input 
              type="password" 
              id="password" 
              placeholder="변경하려면 입력하세요"
              className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors">
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
