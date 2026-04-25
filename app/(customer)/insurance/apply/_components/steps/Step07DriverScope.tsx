'use client';
import { useEffect } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { calcAgeFromSsn, calcAgeFromBirthYear, ageToMinAgeBracket } from '@/utils/format';
import type { DriverScope, FamilyMember } from '@/types/enrollment';

const SCOPES: { value: DriverScope; label: string; desc: string }[] = [
  { value: 'NAMED_ONLY', label: '본인 한정',  desc: '기명피보험자(본인)만 운전' },
  { value: 'COUPLE',     label: '부부 한정',  desc: '기명피보험자 및 배우자' },
  { value: 'FAMILY',     label: '가족 한정',  desc: '기명피보험자 및 배우자·부모·자녀' },
  { value: 'ALL',        label: '누구나',     desc: '운전자 제한 없음' },
];

const RELATIONS = [
  { value: 'SPOUSE', label: '배우자' },
  { value: 'PARENT', label: '부모' },
  { value: 'CHILD',  label: '자녀' },
  { value: 'OTHER',  label: '기타' },
] as const;

export default function Step07DriverScope() {
  const {
    ownerSsnFront, ownerSsnBack,
    driverScope, driverMinAge, familyMembers,
    setDriverScope, setDriverMinAge, setFamilyMembers,
    nextStep, prevStep,
  } = useEnrollmentStore();

  // 운전자 목록 변경 시 최소연령 자동 계산
  useEffect(() => {
    const ages: number[] = [];

    // 소유자(본인) 나이
    if (ownerSsnFront.length === 6 && ownerSsnBack.length >= 1) {
      const ownerAge = calcAgeFromSsn(ownerSsnFront, ownerSsnBack[0]);
      if (ownerAge > 0) ages.push(ownerAge);
    }

    // 가족 구성원 나이 (부부/가족 한정일 때만)
    if (driverScope === 'COUPLE' || driverScope === 'FAMILY') {
      familyMembers.forEach((m) => {
        const age = calcAgeFromBirthYear(m.birthYear);
        if (age > 0) ages.push(age);
      });
    }

    if (ages.length > 0) {
      const youngest = Math.min(...ages);
      setDriverMinAge(ageToMinAgeBracket(youngest));
    }
  }, [driverScope, familyMembers, ownerSsnFront, ownerSsnBack]);

  const handleScopeChange = (scope: DriverScope) => {
    setDriverScope(scope);
    // 전환 시 가족 목록 초기화
    if (scope === 'NAMED_ONLY' || scope === 'ALL') {
      setFamilyMembers([]);
    }
    if (scope === 'COUPLE' && familyMembers.length > 1) {
      setFamilyMembers(familyMembers.slice(0, 1));
    }
  };

  const addMember = () => {
    const maxCount = driverScope === 'COUPLE' ? 1 : 10;
    if (familyMembers.length >= maxCount) return;
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      birthYear: new Date().getFullYear() - 30,
      gender: 'M',
      relation: driverScope === 'COUPLE' ? 'SPOUSE' : 'CHILD',
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const updateMember = (id: string, changes: Partial<FamilyMember>) => {
    setFamilyMembers(familyMembers.map((m) => (m.id === id ? { ...m, ...changes } : m)));
  };

  const removeMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((m) => m.id !== id));
  };

  const minAgeBracketLabel = (bracket: number) =>
    bracket === 0 ? '전연령' : `${bracket}세 이상`;

  const needsFamilyInput = driverScope === 'COUPLE' || driverScope === 'FAMILY';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">운전자 범위</h2>
        <p className="text-sm text-gray-500 mt-1">운전자 범위를 좁힐수록 보험료가 낮아집니다.</p>
      </div>

      {/* 운전자 범위 선택 */}
      <div className="flex flex-col gap-2">
        {SCOPES.map((s) => (
          <label
            key={s.value}
            className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${
              driverScope === s.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              name="scope"
              checked={driverScope === s.value}
              onChange={() => handleScopeChange(s.value)}
              className="mt-0.5 accent-blue-500"
            />
            <div>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {/* 가족 구성원 입력 (부부/가족 한정) */}
      {needsFamilyInput && (
        <div className="border rounded-xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {driverScope === 'COUPLE' ? '배우자 정보' : '가족 구성원 정보'}
            </p>
            {(driverScope === 'FAMILY' || familyMembers.length === 0) && (
              <button
                onClick={addMember}
                className="text-xs text-blue-500 border border-blue-400 px-3 py-1 rounded-lg"
              >
                + 추가
              </button>
            )}
          </div>

          {familyMembers.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">
              {driverScope === 'COUPLE' ? '배우자를 추가해 주세요.' : '가족 구성원을 추가해 주세요.'}
            </p>
          )}

          {familyMembers.map((member) => (
            <div key={member.id} className="bg-gray-50 rounded-lg p-3 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600">
                  {RELATIONS.find((r) => r.value === member.relation)?.label}
                </span>
                <button onClick={() => removeMember(member.id)} className="text-xs text-red-400">삭제</button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 관계 */}
                {driverScope === 'FAMILY' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">관계</label>
                    <select
                      className="w-full border rounded p-2 text-xs bg-white"
                      value={member.relation}
                      onChange={(e) => updateMember(member.id, { relation: e.target.value as FamilyMember['relation'] })}
                    >
                      {RELATIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                )}

                {/* 성별 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">성별</label>
                  <div className="flex gap-1">
                    {(['M', 'F'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => updateMember(member.id, { gender: g })}
                        className={`flex-1 py-2 rounded text-xs font-medium border transition-colors ${
                          member.gender === g ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        {g === 'M' ? '남' : '여'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 출생연도 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">출생연도</label>
                  <input
                    type="number"
                    min={1940}
                    max={new Date().getFullYear() - 16}
                    className="w-full border rounded p-2 text-xs"
                    value={member.birthYear}
                    onChange={(e) => updateMember(member.id, { birthYear: parseInt(e.target.value) || member.birthYear })}
                  />
                </div>
              </div>

              <p className="text-xs text-blue-600">
                만 {calcAgeFromBirthYear(member.birthYear)}세
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 자동 계산된 최소연령 표시 */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">운전자 최소연령 (자동 설정)</span>
          <span className="text-sm font-bold text-blue-600">{minAgeBracketLabel(driverMinAge)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {driverScope === 'NAMED_ONLY'
            ? `본인(만 ${ownerSsnFront.length === 6 && ownerSsnBack.length >= 1 ? calcAgeFromSsn(ownerSsnFront, ownerSsnBack[0]) : '?'}세) 기준으로 자동 설정됩니다.`
            : '등록된 운전자 중 가장 어린 사람 기준으로 자동 설정됩니다.'}
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={prevStep} className="flex-1 border border-gray-300 text-gray-700 font-semibold p-4 rounded-xl">이전</button>
        <button onClick={nextStep} className="flex-1 bg-blue-500 text-white font-semibold p-4 rounded-xl">다음</button>
      </div>
    </div>
  );
}
