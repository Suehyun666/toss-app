'use client';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ClaimsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') === 'payout' ? '보험금 청구' : '사고 접수';
  const cid = searchParams.get('cid') || '선택 안됨';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`[${type}] 처리가 등록되었습니다! (대상 계약: ${cid})`);
    router.push('/insurance/contracts');
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{type} 신청</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">대상 계약 번호</label>
          <input type="text" readOnly value={cid} className="w-full border p-2 bg-gray-100 rounded" />
        </div>
        
        {type === '사고 접수' ? (
          <div>
            <label className="block text-sm font-semibold mb-1">사고 발생일시 및 경위</label>
            <textarea required className="w-full border p-2 rounded h-32" placeholder="사고 경위를 상세히 적어주세요." />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold mb-1">청구 금액 및 사유</label>
            <input type="number" required className="w-full border p-2 rounded mb-2" placeholder="청구 금액 (원)" />
            <textarea required className="w-full border p-2 rounded h-24" placeholder="진단명, 수술여부 등을 적어주세요." />
          </div>
        )}
        
        <div className="border p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600 mb-2">필요 서류 업로드</p>
          <input type="file" className="text-sm" />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded font-bold mt-4">
          {type} 완료하기
        </button>
      </form>
    </main>
  );
}
