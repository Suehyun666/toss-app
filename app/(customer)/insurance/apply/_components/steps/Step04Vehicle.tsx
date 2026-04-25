'use client';
import { useState } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';

export default function Step04Vehicle() {
  const { carNumber, setCarNumber, setVehicleInfo, nextStep, prevStep } = useEnrollmentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInquire = async () => {
    if (!carNumber.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/vehicles/inquire',
          method: 'POST',
          body: { carNumber: carNumber.trim(), inquiryAgentId: 'CUSTOMER' },
        }),
      });
      const data = await res.json();
      if (data.failureReason) {
        setError(data.failureReason);
      } else {
        setVehicleInfo(data);
        nextStep();
      }
    } catch {
      setError('차량 조회에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">차량번호 입력</h2>
        <p className="text-sm text-gray-500 mt-1">보험에 가입할 차량 번호를 입력해 주세요.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">차량번호</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg p-3 text-sm text-center text-lg tracking-wider"
            placeholder="예) 12가 3456"
            value={carNumber}
            onChange={(e) => { setCarNumber(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleInquire()}
          />
          <button
            onClick={handleInquire}
            disabled={!carNumber.trim() || loading}
            className="bg-blue-500 disabled:bg-gray-300 text-white px-5 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            {loading ? '조회 중...' : '조회'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">차량번호 형식</p>
        <p>예) 12가3456 · 서울12가3456 · 전기차 123가4567</p>
      </div>

      <button onClick={prevStep} className="w-full border border-gray-300 text-gray-700 font-semibold p-4 rounded-xl">
        이전
      </button>
    </div>
  );
}
