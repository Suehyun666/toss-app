'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import EnrollmentWizard from './_components/EnrollmentWizard';

function ApplyContent() {
  const searchParams = useSearchParams();
  const prodId = Number(searchParams.get('prodId') ?? '0');
  const setProductId = useEnrollmentStore((s) => s.setProductId);

  useEffect(() => {
    if (prodId > 0) setProductId(prodId);
  }, [prodId, setProductId]);

  return <EnrollmentWizard />;
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-gray-400">로딩 중...</div>}>
      <ApplyContent />
    </Suspense>
  );
}
