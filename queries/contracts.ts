import { fetchApi } from '@/queries/api';
import type { ContractRow } from '@/types/contract';

/** 고객: 내 계약 목록 */
export async function fetchMyContracts(): Promise<ContractRow[]> {
  const res = await fetchApi('/contracts/my', { method: 'GET' });
  return Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
}

/** 직원: 전체 계약 목록 */
export async function fetchAllContracts(): Promise<ContractRow[]> {
  const res = await fetchApi('/employee/contracts', { method: 'GET' });
  return Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
}
