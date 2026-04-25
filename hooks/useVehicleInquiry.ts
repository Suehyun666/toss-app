import { useState } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { fetchApi } from '@/queries/api';

export function useVehicleInquiry() {
  const { carNumber, setVehicleInfo, nextStep } = useEnrollmentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInquire = async () => {
    if (!carNumber.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchApi('/vehicles/inquire', {
        method: 'POST',
        body: JSON.stringify({ carNumber: carNumber.trim(), inquiryAgentId: 'CUSTOMER' }),
      });
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

  return { handleInquire, loading, error, setError };
}
