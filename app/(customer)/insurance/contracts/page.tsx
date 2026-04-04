'use client';
import Link from 'next/link';

const MOCK_CONTRACTS = [
  { id: 101, name: '토스 든든 건강보험', status: '심사 대기 중', date: '2023-10-01', premium: 35000 },
  { id: 102, name: '토스 안전 운전자보험', status: '승인', date: '2023-09-15', premium: 18000 },
  { id: 103, name: '토스 여행자보험', status: '계약 중', date: '2023-01-10', premium: 5000 },
];

export default function ContractsPage() {
  const handleAction = (action: string, id: number) => {
    alert(`${id}번 계약에 대해 [${action}] 신청 라우팅 처리`);
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">내 보험 계약 현황</h1>
      <div className="flex flex-col gap-4">
        {MOCK_CONTRACTS.map((contract) => (
          <div key={contract.id} className="border rounded-lg p-5">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold">{contract.name}</h2>
              <span className={`px-2 py-1 text-xs rounded font-bold ${contract.status === '심사 대기 중' ? 'bg-yellow-100 text-yellow-700' : contract.status === '승인' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {contract.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">신청일: {contract.date} | 월 {contract.premium.toLocaleString()}원</p>
            
            <div className="flex flex-wrap gap-2 mt-4 border-t pt-4">
              <button onClick={() => handleAction('계약 변경', contract.id)} className="px-3 py-1 bg-gray-100 text-sm rounded">계약 변경</button>
              <button onClick={() => handleAction('계약 해지', contract.id)} className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded">계약 해지</button>
              {contract.status === '계약 중' && (
                <>
                  <Link href={`/insurance/claims?type=accident&cid=${contract.id}`} className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded">사고 접수</Link>
                  <Link href={`/insurance/claims?type=payout&cid=${contract.id}`} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">보험금 청구</Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
