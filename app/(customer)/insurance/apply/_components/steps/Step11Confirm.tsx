'use client';
import { useState, useEffect } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { formatMoney, maskSsn } from '@/utils/format';
import { StepHeader } from '@/components/common/ui/StepHeader';
import { DataSection, DataRow } from '@/components/common/ui/DataViewer';
import { ConfirmResultView } from '@/components/enrollment/steps/ConfirmResultView';

export default function Step11Confirm() {
  const {
    vehicleInfo, carNumber, driverScope, driverMinAge,
    insured, contractor, isSamePerson,
    verificationToken, quote,
    proposalId, policyNo, setProposal, prevStep,
  } = useEnrollmentStore();

  const [submitting, setSubmitting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState('');
  const q = quote!;

  const callProxy = async (path: string, method: string, body?: object) => {
    const res = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, method, body }),
    });
    return res.json();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const contractorInfo = isSamePerson ? insured : contractor;
      const data = await callProxy('/proposals', 'POST', {
        productId: 1, verifyToken: verificationToken, quoteSnapshot: q,
        insuredName: insured.name, insuredSsn: insured.ssn.replace(/-/g, ''), insuredPhone: insured.phone,
        contractorName: contractorInfo.name, contractorSsn: contractorInfo.ssn.replace(/-/g, ''), contractorPhone: contractorInfo.phone,
        isSamePerson, carNumber, driverScope, driverMinAge,
      });
      setProposal(data.proposalId);
      setStatus(data.status);
      setPolling(true);
    } catch {
      setError('청약 제출에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!polling || !proposalId) return;
    const id = setInterval(async () => {
      try {
        const data = await callProxy(`/proposals/${proposalId}`, 'GET');
        setStatus(data.status);
        if (['APPROVED', 'SUPPLEMENT_REQUIRED', 'REJECTED'].includes(data.status)) {
          setPolling(false);
          if (data.policyNo) setProposal(proposalId, data.policyNo);
        }
      } catch { }
    }, 1000);
    return () => clearInterval(id);
  }, [polling, proposalId]);

  if (polling || status) {
    return <ConfirmResultView status={status} polling={polling} policyNo={policyNo ?? undefined} quoteTotalPremium={q?.totalPremium} />;
  }

  const contractorInfo = isSamePerson ? insured : contractor;
  const scopeLabel: Record<string, string> = { NAMED_ONLY: '본인 한정', COUPLE: '부부 한정', FAMILY: '가족 한정', ALL: '누구나' };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader title="청약 내용 확인" description="최종 내용을 확인하고 청약하기를 눌러주세요." />

      <DataSection title="차량 정보">
        <DataRow label="차량번호" value={carNumber} />
        <DataRow label="차종" value={`${vehicleInfo?.modelName} (${vehicleInfo?.modelYear})`} />
        <DataRow label="운전자 범위" value={scopeLabel[driverScope]} />
        <DataRow label="최소 연령" value={driverMinAge === 0 ? '전연령' : `${driverMinAge}세 이상`} />
      </DataSection>

      <DataSection title="피보험자">
        <DataRow label="이름" value={insured.name} />
        <DataRow label="주민번호" value={maskSsn(insured.ssn.replace(/-/g, ''))} />
        <DataRow label="연락처" value={insured.phone} />
      </DataSection>

      {!isSamePerson && (
        <DataSection title="계약자">
          <DataRow label="이름" value={contractorInfo.name} />
          <DataRow label="연락처" value={contractorInfo.phone} />
        </DataSection>
      )}

      <DataSection title="보험료 (일시납)">
        <DataRow label="할인 전" value={formatMoney(q.totalBeforeDiscount)} />
        <DataRow label="할인 합계" value={formatMoney(q.totalDiscount)} />
        <div className="flex justify-between items-center px-4 py-3 bg-blue-50">
          <span className="text-sm font-bold">최종 보험료</span>
          <span className="text-base font-bold text-blue-600">{formatMoney(q.totalPremium)}</span>
        </div>
      </DataSection>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button onClick={prevStep} className="flex-1 border border-gray-300 text-gray-700 font-semibold p-4 rounded-xl">이전</button>
        <button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-blue-500 disabled:bg-gray-300 text-white font-semibold p-4 rounded-xl">
          {submitting ? '제출 중...' : '청약하기'}
        </button>
      </div>
    </div>
  );
}
