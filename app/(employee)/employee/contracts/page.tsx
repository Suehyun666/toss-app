'use client';

import { useState } from "react";
import Link from "next/link";

// 백엔드 연동 전 UI 스캐폴드
const STATUS_META: Record<string, { label: string; color: string }> = {
    PENDING:    { label: "청약 심사 중",  color: "bg-yellow-100 text-yellow-700" },
    ACTIVE:     { label: "유지",          color: "bg-green-100 text-green-700" },
    LAPSED:     { label: "실효",          color: "bg-red-100 text-red-600" },
    CANCELLED:  { label: "해지",          color: "bg-gray-100 text-gray-500" },
    MATURED:    { label: "만기",          color: "bg-blue-100 text-blue-600" },
};

const MOCK: any[] = []; // 백엔드 연동 후 실데이터로 교체 예정

export default function ContractListPage() {
    const [tab, setTab] = useState<"ALL" | keyof typeof STATUS_META>("ALL");

    const filtered = tab === "ALL" ? MOCK : MOCK.filter(c => c.status === tab);

    return (
        <div className="max-w-5xl space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">계약 목록</h1>
                    <p className="text-sm text-gray-500 mt-0.5">전체 보험계약 현황</p>
                </div>
            </div>

            {/* 탭 */}
            <div className="flex gap-1 border-b border-gray-200">
                {(["ALL", ...Object.keys(STATUS_META)] as const).map(s => (
                    <button key={s} onClick={() => setTab(s as any)}
                        className={`px-4 py-2 text-xs font-medium transition-colors border-b-2 -mb-px
                            ${tab === s
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                        {s === "ALL" ? "전체" : STATUS_META[s].label}
                    </button>
                ))}
            </div>

            {/* 테이블 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500">
                        <tr>
                            {["증권번호", "피보험자", "상품명", "보험료", "계약일", "만기일", "상태", ""].map(h => (
                                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                                    계약 데이터가 없습니다
                                    <p className="text-xs mt-1 text-gray-300">백엔드 계약 API 연동 후 표시됩니다</p>
                                </td>
                            </tr>
                        ) : filtered.map((c: any) => {
                            const badge = STATUS_META[c.status] ?? { label: c.status, color: "bg-gray-100 text-gray-500" };
                            return (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.policyNo}</td>
                                    <td className="px-4 py-3 font-medium">{c.insuredName}</td>
                                    <td className="px-4 py-3 text-gray-600">{c.productName}</td>
                                    <td className="px-4 py-3 text-right">{c.premium?.toLocaleString()}원</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{c.startDate}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{c.endDate}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={`/employee/contracts/${c.id}`}
                                            className="text-xs text-blue-500 hover:text-blue-700">상세</Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
