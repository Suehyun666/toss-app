import React from 'react';
import { LOB_OPTIONS } from '@/types/product';
import { InputField } from '@/components/common/ui/forms/InputField';
import { SelectField } from '@/components/common/ui/forms/SelectField';

interface Step3Props {
    info: any;
    selCoverages: Record<number, { basePremium: string; mandatory: boolean }>;
    selRiders: Set<number>;
    adjustments: Array<{ itemName: string; adjType: string; rate: string; conditionDesc: string; }>;
    setAdj: (i: number, k: string, v: string) => void;
    addAdj: () => void;
    removeAdj: (i: number) => void;
}

export function Step3Adjustments({ info, selCoverages, selRiders, adjustments, setAdj, addAdj, removeAdj }: Step3Props) {
    const totalBase = Object.values(selCoverages).reduce((s, c) => s + (Number(c.basePremium) || 0), 0);

    return (
        <div>
            <div className="mb-5 p-4 bg-blue-50 rounded-lg text-sm">
                <h3 className="font-semibold text-blue-800 mb-2">수정 요약</h3>
                <div className="text-blue-700 space-y-1 text-xs">
                    <div><span className="text-blue-500">상품명</span>: {info.productName} <span className="font-mono text-blue-400">({info.productCode})</span></div>
                    <div><span className="text-blue-500">종목</span>: {LOB_OPTIONS.find(o => o.value === info.lineOfBusiness)?.label}</div>
                    <div><span className="text-blue-500">선택 담보</span>: {Object.keys(selCoverages).length}개 | 합산 기준 순보험료: <strong>{totalBase.toLocaleString()}원</strong></div>
                    <div><span className="text-blue-500">선택 특약</span>: {selRiders.size}개</div>
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">할인·할증 항목을 수정하세요.</p>
            <div className="space-y-2">
                {adjustments.map((a, i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <InputField
                            label=""
                            value={a.itemName} onChange={e => setAdj(i, "itemName", e.target.value)}
                            placeholder="항목명 (예: 블랙박스 할인)"
                            className="flex-1"
                        />
                        <SelectField
                            label=""
                            value={a.adjType} onChange={e => setAdj(i, "adjType", e.target.value)}
                            className="w-24"
                            options={[
                                { value: "DISCOUNT", label: "할인" },
                                { value: "SURCHARGE", label: "할증" }
                            ]}
                        />
                        <div className="relative w-28">
                            <InputField
                                type="number" step="0.1" min="0" value={a.rate}
                                onChange={e => setAdj(i, "rate", e.target.value)}
                                placeholder="5.0" className="pr-5" label=""
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                        </div>
                        <InputField
                            label=""
                            value={a.conditionDesc} onChange={e => setAdj(i, "conditionDesc", e.target.value)}
                            placeholder="적용 조건 (선택)"
                            className="flex-1"
                        />
                        <button type="button" onClick={() => removeAdj(i)}
                            className="text-red-400 hover:text-red-600 text-xl leading-none">×</button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addAdj}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800">+ 항목 추가</button>
        </div>
    );
}
