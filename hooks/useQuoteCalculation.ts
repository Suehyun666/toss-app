import { useState, useCallback } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';

export function useQuoteCalculation() {
  const {
    vehicleInfo, carNumber, driverScope, driverMinAge,
    mileageDiscount, selectedAdjustments,
    hasBlackbox, hasAdvancedSafety, overrideValue, ownerSsnFront,
    quote, setQuote
  } = useEnrollmentStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuote = useCallback(async () => {
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
  }, [
    carNumber, driverScope, driverMinAge, mileageDiscount, selectedAdjustments,
    hasBlackbox, hasAdvancedSafety, overrideValue, vehicleInfo, ownerSsnFront, setQuote
  ]);

  const resetQuote = useCallback(() => {
    setQuote(null);
  }, [setQuote]);

  return { quote, loading, error, fetchQuote, resetQuote };
}
