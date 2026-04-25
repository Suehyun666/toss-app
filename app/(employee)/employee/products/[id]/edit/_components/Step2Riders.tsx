import React from 'react';

interface Step2Props {
    allRiders: any[];
    selRiders: Set<number>;
    toggleRider: (id: number) => void;
}

export function Step2Riders({ allRiders, selRiders, toggleRider }: Step2Props) {
    return (
        <div>
            <p className="text-sm text-gray-500 mb-4">
                이 상품에 적용할 특약을 선택하세요.
            </p>
            {allRiders.length === 0 && (
                <p className="text-gray-400 text-sm">등록된 특약이 없습니다.</p>
            )}
            <div className="space-y-2">
                {allRiders.map((r: any) => {
                    const sel = selRiders.has(r.id);
                    return (
                        <div key={r.id} className={`border rounded-lg p-4 transition-colors ${sel ? "border-blue-300 bg-blue-50/30" : "border-gray-200"}`}>
                            <div className="flex items-start gap-3">
                                <input type="checkbox" checked={sel} onChange={() => toggleRider(r.id)}
                                    className="mt-0.5 w-4 h-4 accent-blue-600" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-sm">{r.name}</span>
                                        <span className="text-xs font-mono text-gray-400">{r.riderCode}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${r.riderType === "DISCOUNT" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
                                            {r.riderTypeDisplayName ?? r.riderType}
                                            {r.riderType === "DISCOUNT" && r.discountRate
                                                ? ` ${(r.discountRate * 100).toFixed(1)}%`
                                                : ""}
                                        </span>
                                        {r.mandatory && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">필수</span>}
                                    </div>
                                    {r.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
