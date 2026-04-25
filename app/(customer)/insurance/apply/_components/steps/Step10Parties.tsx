'use client';
import { useEffect } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { maskSsn } from '@/utils/format';
import PartyForm from '@/components/enrollment/PartyForm';

export default function Step10Parties() {
  const {
    ownerName, ownerSsnFront, ownerSsnBack, ownerPhone,
    insured, contractor, isSamePerson,
    setInsured, setContractor, setIsSamePerson,
    nextStep, prevStep,
  } = useEnrollmentStore();

  // 첫 진입 시 소유자 정보로 피보험자 자동 채우기
  useEffect(() => {
    if (!insured.name && ownerName) {
      setInsured({
        name: ownerName,
        ssn: ownerSsnFront && ownerSsnBack ? `${ownerSsnFront}-${ownerSsnBack}` : '',
        phone: ownerPhone,
      });
    }
  }, []);

  const isInsuredValid =
    insured.name.trim().length >= 2 &&
    insured.ssn.replace(/-/g, '').length === 13 &&
    insured.phone.replace(/-/g, '').length >= 10;

  const isContractorValid =
    isSamePerson ||
    (contractor.name.trim().length >= 2 &&
      contractor.ssn.replace(/-/g, '').length === 13 &&
      contractor.phone.replace(/-/g, '').length >= 10);

  const isValid = isInsuredValid && isContractorValid;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">계약자·피보험자 정보</h2>
        <p className="text-sm text-gray-500 mt-1">보험계약에 필요한 당사자 정보를 확인·입력해 주세요.</p>
      </div>

      {/* 피보험자 */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">피보험자 (차량 소유자)</h3>
        <PartyForm
          value={insured}
          onChange={setInsured}
          placeholder={{ name: ownerName, phone: ownerPhone }}
        />
        {insured.ssn && (
          <p className="text-xs text-gray-400 mt-1 px-1">주민번호: {maskSsn(insured.ssn.replace(/-/g, ''))}</p>
        )}
      </section>

      {/* 계약자 = 피보험자 여부 */}
      <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer">
        <input
          type="checkbox"
          checked={isSamePerson}
          onChange={(e) => setIsSamePerson(e.target.checked)}
          className="w-5 h-5 accent-blue-500"
        />
        <div>
          <p className="text-sm font-medium">계약자와 피보험자가 동일합니다</p>
          <p className="text-xs text-gray-400">보험료를 납부하는 계약자가 피보험자와 같은 경우 선택</p>
        </div>
      </label>

      {/* 계약자 별도 입력 */}
      {!isSamePerson && (
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">계약자 (보험료 납부자)</h3>
          <PartyForm value={contractor} onChange={setContractor} />
        </section>
      )}

      <div className="flex gap-3">
        <button onClick={prevStep} className="flex-1 border border-gray-300 text-gray-700 font-semibold p-4 rounded-xl">이전</button>
        <button disabled={!isValid} onClick={nextStep} className="flex-1 bg-blue-500 disabled:bg-gray-300 text-white font-semibold p-4 rounded-xl">다음</button>
      </div>
    </div>
  );
}
