'use client';
import { useState } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { fetchApi } from '@/queries/api';

import { VERIFICATION_METHODS } from '@/types/enrollmentConstants';

export default function VerifyForm() {
  const {
    ownerName, ownerSsnFront, ownerPhone,
    verificationMethod, verificationSessionId,
    setVerificationMethod, setVerificationSession, setVerificationToken,
    nextStep,
  } = useEnrollmentStore();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const callProxy = async (path: string, method: string, body?: object) => {
    return fetchApi(path, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  const handleSend = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await callProxy('/verify/send-otp', 'POST', {
        name: ownerName,
        ssn: ownerSsnFront,
        phone: ownerPhone,
        method: verificationMethod,
      });
      setVerificationSession(data.sessionId);
      setSent(true);
    } catch {
      setError('OTP 발송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await callProxy('/verify/confirm', 'POST', {
        sessionId: verificationSessionId,
        otp,
      });
      if (data.success) {
        setVerificationToken(data.token);
        nextStep();
      } else {
        setError(data.failureReason ?? '인증에 실패했습니다.');
      }
    } catch {
      setError('인증 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium mb-2">인증 방법 선택</p>
        <div className="grid grid-cols-4 gap-2">
          {VERIFICATION_METHODS.map((m) => (
            <button
              key={m.value}
              onClick={() => setVerificationMethod(m.value)}
              className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                verificationMethod === m.value ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-600'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {!sent ? (
        <button onClick={handleSend} disabled={loading} className="w-full bg-blue-500 disabled:bg-gray-300 text-white font-semibold p-4 rounded-xl">
          {loading ? '발송 중...' : '인증번호 발송'}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-green-600 font-medium">✓ 인증번호가 발송되었습니다. (테스트: 123456)</p>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="flex-1 border rounded-lg p-3 text-sm tracking-widest text-center text-lg"
              placeholder="인증번호 6자리"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
            <button onClick={handleSend} className="text-sm text-blue-500 px-3 border border-blue-400 rounded-lg whitespace-nowrap">
              재발송
            </button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button onClick={handleConfirm} disabled={otp.length !== 6 || loading} className="w-full bg-blue-500 disabled:bg-gray-300 text-white font-semibold p-4 rounded-xl">
            {loading ? '확인 중...' : '확인'}
          </button>
        </div>
      )}
    </div>
  );
}
