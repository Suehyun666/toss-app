'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApplyPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return alert('주의사항에 동의해주세요.');
    alert('가입 신청이 완료되었습니다! 심사가 진행됩니다.');
    router.push('/insurance/contracts');
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">보험 가입 신청</h1>
      <form onSubmit={handleApply} className="flex flex-col gap-6">
        <div className="border p-4 rounded-lg bg-gray-50">
          <h2 className="font-bold mb-2">가입 전 알릴 의무 (고지사항)</h2>
          <p className="text-sm text-gray-600 mb-4">최근 3개월 이내에 의사로부터 진찰, 검사를 받은 적이 있습니까?</p>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <label htmlFor="agree" className="text-sm font-semibold">아니오, 없습니다. (동의)</label>
          </div>
        </div>
        
        <div>
          <label className="block text-sm mb-1">결제수단 선택</label>
          <select className="w-full border p-2 rounded">
            <option>토스페이</option>
            <option>신용/체크카드</option>
            <option>계좌이체</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded font-bold mt-4">
          가입 신청 완료
        </button>
      </form>
    </main>
  );
}
