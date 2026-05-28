'use client';

import { useEffect, useState } from "react";
import { fetchApi } from "@/queries/api";

type PendingRow = {
  id: string;
  proposalId: string;
  insuredName: string;
  productName: string;
  premium: number;
  appliedAt: string;
  status: string;
};

export default function PendingContractsPage() {
  const [rows, setRows] = useState<PendingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchApi("/employee/contracts/pending", { method: "GET" });
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Pending Review</h1>
        <p className="text-sm text-gray-500 mt-0.5">Proposal items waiting for underwriting review</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              {["Proposal No", "Insured", "Product", "Premium", "Applied At", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                  No pending proposals
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.proposalId}</td>
                  <td className="px-4 py-3 font-medium">{c.insuredName}</td>
                  <td className="px-4 py-3 text-gray-600">{c.productName}</td>
                  <td className="px-4 py-3 text-right">{(c.premium ?? 0).toLocaleString()} KRW</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{c.appliedAt}</td>
                  <td className="px-4 py-3 text-xs">PENDING</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
