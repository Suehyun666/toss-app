'use client';
import { useState, useEffect } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { useRouter } from 'next/navigation';
import { formatMoney, maskSsn } from '@/utils/format';

export default function Step11Confirm() {
  const {
    vehicleInfo, carNumber, driverScope, driverMinAge,
    insured, contractor, isSamePerson,
    verificationToken, quote,
    proposalId, policyNo,
    setProposal, prevStep,
  } = useEnrollmentStore();

  const router = useRouter();
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
        productId: 1,
        verifyToken: verificationToken,
        quoteSnapshot: q,
        insuredName: insured.name,
        insuredSsn: insured.ssn.replace(/-/g, ''),
        insuredPhone: insured.phone,
        contractorName: contractorInfo.name,
        contractorSsn: contractorInfo.ssn.replace(/-/g, ''),
        contractorPhone: contractorInfo.phone,
        isSamePerson,
        carNumber,
        driverScope,
        driverMinAge,
      });
      setProposal(data.proposalId);
      setStatus(data.status);
      setPolling(true);
    } catch {
      setError('청약 제출에 실패했습니다. 다시 시도해 주세요.');
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
      } catch { /* 폴링 실패 무시 */ }
    }, 1000);
    return () => clearInterval(id);
  }, [polling, proposalId]);

  // ─── 심사 중 ──────────────────────────────────────────────────────────
  if (polling || status === 'CREDIT_CHECKED' || status === 'UNDERWRITING') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-base font-semibold">청약 심사 진행 중</p>
        <p className="text-sm text-gray-500">
          {status === 'SUBMITTED' && '청약 접수 완료, 신용조회 중...'}
          {status === 'CREDIT_CHECKED' && '신용조회 완료, 인수심사 중...'}
          {status === 'UNDERWRITING' && '언더라이팅 처리 중...'}
        </p>
      </div>
    );
  }

  // ─── 가입 완료 ────────────────────────────────────────────────────────
  if (status === 'APPROVED') {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-8">
        <div className="text-5xl">🎉</div>
        <div>
          <h2 className="text-2xl font-bold text-blue-600">가입 완료</h2>
          <p className="text-gray-500 mt-1">보험 가입이 정상 완료되었습니다.</p>
        </div>
        <div className="w-full bg-blue-50 rounded-xl p-5 text-left">
          <p className="text-sm text-gray-500 mb-1">증권번호</p>
          <p className="text-lg font-bold">{policyNo}</p>
          <p className="text-sm text-gray-500 mt-3 mb-1">최종 보험료 (일시납)</p>
          <p className="text-lg font-bold text-blue-600">{formatMoney(q.totalPremium)}</p>
        </div>
        <button onClick={() => router.push('/insurance/contracts')} className="w-full bg-blue-500 text-white font-semibold p-4 rounded-xl">
          계약 내역 확인
        </button>
      </div>
    );
  }

  if (status === 'SUPPLEMENT_REQUIRED') {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-8">
        <div className="text-5xl">📋</div>
        <h2 className="text-xl font-bold">서류 보완 필요</h2>
        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left text-sm">
          <p className="font-semibold text-yellow-700 mb-1">안내 사항</p>
          <p className="text-gray-600">운전경력 증빙서류를 고객센터 또는 앱에서 제출해 주세요.</p>
        </div>
        <button onClick={() => router.push('/insurance/contracts')} className="w-full border border-gray-300 text-gray-700 font-semibold p-4 rounded-xl">
          계약 내역으로 이동
        </button>
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div className="flex flex-col items-center text-center gap-6 py-8">
        <div className="text-5xl">❌</div>
        <h2 className="text-xl font-bold">인수 거절</h2>
        <p className="text-sm text-gray-500">현재 조건으로는 보험 가입이 어렵습니다.</p>
        <button onClick={() => router.push('/insurance/products')} className="w-full border border-gray-300 text-gray-700 font-semibold p-4 rounded-xl">
          다른 상품 보기
        </button>
      </div>
    );
  }

  // ─── 청약 내용 확인 ────────────────────────────────────────────────────
  const contractorInfo = isSamePerson ? insured : contractor;
  const scopeLabel: Record<string, string> = {
    NAMED_ONLY: '본인 한정', COUPLE: '부부 한정', FAMILY: '가족 한정', ALL: '누구나',
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">청약 내용 확인</h2>
        <p className="text-sm text-gray-500 mt-1">최종 내용을 확인하고 청약하기를 눌러주세요.</p>
      </div>

      <Section title="차량 정보">
        <Row label="차량번호" value={carNumber} />
        <Row label="차종" value={`${vehicleInfo?.modelName} (${vehicleInfo?.modelYear})`} />
        <Row label="운전자 범위" value={scopeLabel[driverScope]} />
        <Row label="최소 연령" value={driverMinAge === 0 ? '전연령' : `${driverMinAge}세 이상`} />
      </Section>

      <Section title="피보험자">
        <Row label="이름" value={insured.name} />
        <Row label="주민번호" value={maskSsn(insured.ssn.replace(/-/g, ''))} />
        <Row label="연락처" value={insured.phone} />
      </Section>

      {!isSamePerson && (
        <Section title="계약자">
          <Row label="이름" value={contractorInfo.name} />
          <Row label="연락처" value={contractorInfo.phone} />
        </Section>
      )}

      <Section title="보험료 (일시납)">
        <Row label="할인 전" value={formatMoney(q.totalBeforeDiscount)} />
        <Row label="할인 합계" value={formatMoney(q.totalDiscount)} />
        <div className="flex justify-between items-center px-4 py-3 bg-blue-50">
          <span className="text-sm font-bold">최종 보험료</span>
          <span className="text-base font-bold text-blue-600">{formatMoney(q.totalPremium)}</span>
        </div>
      </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">{title}</div>
      <div className="divide-y">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
