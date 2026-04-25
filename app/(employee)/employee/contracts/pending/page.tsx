'use client';

const MOCK: any[] = []; // 백엔드 청약 심사 API 연동 예정

export default function PendingContractsPage() {
    return (
        <div className="max-w-4xl space-y-5">
            <div>
                <h1 className="text-xl font-bold text-gray-800">청약 심사</h1>
                <p className="text-sm text-gray-500 mt-0.5">심사 대기 중인 청약 건을 검토하고 승인 또는 거절합니다.</p>
            </div>

            {/* 심사 기준 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-700 mb-2">심사 항목</p>
                <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
                    <li>계약자·피보험자 신원 확인</li>
                    <li>고지의무 위반 여부 검토</li>
                    <li>보험료 산출 적정성 확인</li>
                    <li>담보 조건 부합 여부 확인</li>
                </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500">
                        <tr>
                            {["청약번호", "피보험자", "상품명", "보험료", "청약일", "심사"].map(h => (
                                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MOCK.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                                    심사 대기 중인 청약이 없습니다
                                    <p className="text-xs mt-1 text-gray-300">백엔드 청약 API 연동 후 표시됩니다</p>
                                </td>
                            </tr>
                        ) : MOCK.map((c: any) => (
                            <tr key={c.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.applicationNo}</td>
                                <td className="px-4 py-3 font-medium">{c.insuredName}</td>
                                <td className="px-4 py-3 text-gray-600">{c.productName}</td>
                                <td className="px-4 py-3 text-right">{c.premium?.toLocaleString()}원</td>
                                <td className="px-4 py-3 text-xs text-gray-400">{c.appliedAt}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">
                                            승인
                                        </button>
                                        <button className="px-3 py-1 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50">
                                            거절
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
