'use client';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { StepHeader } from '@/components/common/ui/StepHeader';
import { StepNavigation } from '@/components/common/ui/StepNavigation';
import VerifyForm from '@/components/enrollment/steps/VerifyForm';

export default function Step03Verify() {
  const { ownerPhone, prevStep } = useEnrollmentStore();

  return (
    <div className="flex flex-col gap-6">
      <StepHeader 
        title="본인인증" 
        description={`${ownerPhone} 로 인증번호를 발송합니다.`} 
      />

      <VerifyForm />

      <StepNavigation onPrev={prevStep} />
    </div>
  );
}
