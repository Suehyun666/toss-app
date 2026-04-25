'use client';

import { useState } from "react";

export default function ContractSearchPage() {
    const [query, setQuery]   = useState({ policyNo: "", name: "", productName: "", status: "" });
    const [results, setResults] = useState<any[] | null>(null);

    const handleSearch = async () => {
        // TODO: 백엔드 계약 검색 API 연동
        setResults([]);
    };

    return (
        <div className="max-w-4xl space-y-5">
            <div>
                <h1 className="text-xl font-bold text-gray-800">계약 조회</h1>
                <p className="text-sm text-gray-500 mt-0.5">증권번호, 피보험자명, 상품명으로 계약을 검색합니다.</p>
            </div>

            {/* 검색 폼 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">증권번호</label>
                        <input
                            value={query.policyNo}
                            onChange={e => setQuery(q => ({ ...q, policyNo: e.target.value }))}
                            placeholder="예) 202501-000001"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">피보험자명</label>
                        <input
                            value={query.name}
                            onChange={e => setQuery(q => ({ ...q, name: e.target.value }))}
                            placeholder="피보험자 이름"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">상품명</label>
                        <input
                            value={query.productName}
                            onChange={e => setQuery(q => ({ ...q, productName: e.target.value }))}
                            placeholder="보험 상품명"
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">계약 상태</label>
                        <select
                            value={query.status}
                            onChange={e => setQuery(q => ({ ...q, status: e.target.value }))}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">전체</option>
                            <option value="PENDING">청약 심사 중</option>
                            <option value="ACTIVE">유지</option>
                            <option value="LAPSED">실효</option>
                            <option value="CANCELLED">해지</option>
                            <option value="MATURED">만기</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button onClick={handleSearch}
                        className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        조회
                    </button>
                </div>
            </div>

            {/* 결과 */}
            {results !== null && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500">
                            <tr>
                                {["증권번호", "피보험자", "상품명", "보험료", "계약일", "만기일", "상태"].map(h => (
                                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                                        검색 결과가 없습니다
                                    </td>
                                </tr>
                            ) : results.map((c: any) => (
                                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs">{c.policyNo}</td>
                                    <td className="px-4 py-3">{c.insuredName}</td>
                                    <td className="px-4 py-3 text-gray-600">{c.productName}</td>
                                    <td className="px-4 py-3 text-right">{c.premium?.toLocaleString()}원</td>
                                    <td className="px-4 py-3 text-xs text-gray-400">{c.startDate}</td>
                                    <td className="px-4 py-3 text-xs text-gray-400">{c.endDate}</td>
                                    <td className="px-4 py-3 text-xs">{c.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
