'use client';

import { useEffect } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { getCookie } from '@/queries/api';
import { StepHeader } from '@/components/common/ui/StepHeader';
import { StepNavigation } from '@/components/common/ui/StepNavigation';
import VerifyForm from '@/components/enrollment/steps/VerifyForm';

export default function Step03Verify() {
  const { ownerPhone, verificationToken, setVerificationToken, nextStep, prevStep } = useEnrollmentStore();

  useEffect(() => {
    const cookieToken = getCookie('identity_verify_token');

    // Auto-skip only when identity-login verification token exists.
    if (verificationToken) {
      if (cookieToken && verificationToken === cookieToken) {
        nextStep();
      }
      return;
    }

    if (!cookieToken) return;
    setVerificationToken(cookieToken);
    nextStep();
  }, [verificationToken, setVerificationToken, nextStep]);

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="본인인증"
        description={`${ownerPhone} 로 인증번호를 발송합니다`}
      />

      <VerifyForm />

      <StepNavigation onPrev={prevStep} />
    </div>
  );
}
