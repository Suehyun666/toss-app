import React from 'react';

interface Step1Props {
    allCoverages: any[];
    selCoverages: Record<number, { basePremium: string; mandatory: boolean }>;
    toggleCoverage: (id: number) => void;
    setSelCoverages: React.Dispatch<React.SetStateAction<Record<number, { basePremium: string; mandatory: boolean }>>>;
}

export function Step1Coverages({ allCoverages, selCoverages, toggleCoverage, setSelCoverages }: Step1Props) {
    const totalBase = Object.values(selCoverages).reduce((s, c) => s + (Number(c.basePremium) || 0), 0);

    return (
        <div>
            <p className="text-sm text-gray-500 mb-4">
                이 상품에 포함할 담보를 선택하고 <strong>담보별 기준 순보험료</strong>를 입력하세요.
            </p>
            {allCoverages.length === 0 && (
                <p className="text-gray-400 text-sm">등록된 담보가 없습니다.</p>
            )}
            <div className="space-y-3">
                {allCoverages.map((c: any) => {
                    const sel = !!selCoverages[c.id];
                    return (
                        <div key={c.id} className={`border rounded-lg p-4 transition-colors ${sel ? "border-blue-300 bg-blue-50/30" : "border-gray-200"}`}>
                            <div className="flex items-start gap-3">
                                <input type="checkbox" checked={sel} onChange={() => toggleCoverage(c.id)}
                                    className="mt-0.5 w-4 h-4 accent-blue-600" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">{c.name}</span>
                                        {c.mandatory && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">법정필수</span>}
                                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">{c.coverageType}</span>
                                    </div>
                                    {c.description && <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>}
                                    {sel && (
                                        <div className="mt-3 flex items-center gap-4">
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">기준 순보험료 (원)</label>
                                                <input type="number" value={selCoverages[c.id]?.basePremium ?? ""}
                                                    onChange={e => setSelCoverages(prev => ({
                                                        ...prev, [c.id]: { ...prev[c.id], basePremium: e.target.value }
                                                    }))}
                                                    className="border border-gray-200 rounded px-2.5 py-1.5 text-sm w-44 outline-none focus:border-blue-500" />
                                            </div>
                                            <label className="flex items-center gap-1.5 text-xs text-gray-500 mt-4">
                                                <input type="checkbox" checked={selCoverages[c.id]?.mandatory ?? false}
                                                    onChange={e => setSelCoverages(prev => ({
                                                        ...prev, [c.id]: { ...prev[c.id], mandatory: e.target.checked }
                                                    }))} className="accent-blue-600" />
                                                이 상품에서 필수 담보
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {Object.keys(selCoverages).length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm flex gap-4">
                    <span>선택 담보: <strong>{Object.keys(selCoverages).length}개</strong></span>
                    <span>합산 기준 순보험료: <strong className="text-blue-600">{totalBase.toLocaleString()}원</strong></span>
                </div>
            )}
        </div>
    );
}
