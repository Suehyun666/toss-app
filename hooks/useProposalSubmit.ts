import { useState, useEffect } from 'react';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { fetchApi } from '@/queries/api';

export function useProposalSubmit() {
  const {
    vehicleInfo, carNumber, driverScope, driverMinAge,
    insured, contractor, isSamePerson,
    verificationToken, quote,
    proposalId, policyNo, setProposal
  } = useEnrollmentStore();

  const [submitting, setSubmitting] = useState(false);
  const [polling, setPolling] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState('');

  const callProxy = async (path: string, method: string, body?: object) => {
    return fetchApi(path, {
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const contractorInfo = isSamePerson ? insured : contractor;
      const data = await callProxy('/proposals', 'POST', {
        productId: 1, verifyToken: verificationToken, quoteSnapshot: quote,
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
  }, [polling, proposalId, setProposal]);

  return { handleSubmit, submitting, polling, status, error, quote, policyNo, isSamePerson, insured, contractor, carNumber, vehicleInfo, driverScope, driverMinAge };
}
