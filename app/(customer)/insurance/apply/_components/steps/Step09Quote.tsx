'use client';
import { useEffect, useState } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { formatMoney } from '@/utils/format';

export default function Step09Quote() {
  const {
    vehicleInfo, carNumber, driverScope, driverMinAge,
    mileageDiscount, selectedAdjustments,
    hasBlackbox, hasAdvancedSafety, overrideValue, ownerSsnFront,
    quote, setQuote, nextStep, prevStep,
  } = useEnrollmentStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuote = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/quotes/calculate',
          method: 'POST',
          body: {
            productId: 1,
            carNumber,
            driverScope,
            driverMinAge,
            mileageDiscount,
            publicTransport: selectedAdjustments.some((a) => a.itemName.includes('대중교통')),
            tmap: selectedAdjustments.some((a) => a.itemName.includes('티맵')),
            naverMap: false,
            child: selectedAdjustments.some((a) => a.itemName.includes('자녀')),
            hasBlackbox,
            hasAdvancedSafety,
            vehicleValue: overrideValue ?? vehicleInfo?.standardValue ?? 0,
            ownerSsn: ownerSsnFront,
            coverageOptions: null,
          },
        }),
      });
      const data = await res.json();
      setQuote(data);
    } catch {
      setError('보험료 계산 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!quote) fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">보험료를 계산하고 있습니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={fetchQuote} className="w-full bg-blue-500 text-white p-4 rounded-xl font-semibold">다시 계산</button>
        <button onClick={prevStep} className="w-full border border-gray-300 text-gray-700 p-4 rounded-xl font-semibold">이전</button>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">보험료 확인</h2>
        <p className="text-sm text-gray-500 mt-1">선택한 조건에 따른 보험료입니다.</p>
      </div>

      {/* 담보별 보험료 */}
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">담보별 보험료</div>
        <div className="divide-y">
          {quote.coverages.map((c, i) => (
            <div key={i} className="flex justify-between items-center px-4 py-3">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-gray-400">{c.limitDesc}</p>
              </div>
              <p className="text-sm">{formatMoney(c.premium)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 할인 내역 */}
      {quote.appliedDiscounts.length > 0 && (
        <div className="border rounded-xl overflow-hidden">
          <div className="bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">적용 할인</div>
          <div className="divide-y">
            {quote.appliedDiscounts.map((d, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-3">
                <p className="text-sm">{d.name}</p>
                <p className="text-sm text-green-600">{formatMoney(d.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 합계 */}
      <div className="bg-blue-50 rounded-xl p-5">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>할인 전 보험료</span>
          <span>{formatMoney(quote.totalBeforeDiscount)}</span>
        </div>
        <div className="flex justify-between text-sm text-green-600 mb-3">
          <span>할인 합계</span>
          <span>{formatMoney(quote.totalDiscount)}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold">최종 보험료</span>
          <span className="text-2xl font-bold text-blue-600">{formatMoney(quote.totalPremium)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">일시납 기준</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setQuote(null); fetchQuote(); }}
          className="border border-gray-300 text-gray-600 px-4 py-3 rounded-xl text-sm"
        >
          재계산
        </button>
        <button onClick={prevStep} className="flex-1 border border-gray-300 text-gray-700 font-semibold p-4 rounded-xl">이전</button>
        <button onClick={nextStep} className="flex-1 bg-blue-500 text-white font-semibold p-4 rounded-xl">다음</button>
      </div>
    </div>
  );
}
