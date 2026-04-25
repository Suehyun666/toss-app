'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCoverages, getRiders } from "@/lib/master";
import { createProduct } from "@/lib/products";

const STEPS = ["기본정보", "담보 선택", "특약 선택", "할인·할증"];

const LOB_OPTIONS = [
    { value: "PERSONAL_AUTO",   label: "개인용자동차보험" },
    { value: "COMMERCIAL_AUTO", label: "업무용자동차보험" },
    { value: "BUSINESS_AUTO",   label: "영업용자동차보험" },
    { value: "MOTORCYCLE",      label: "이륜자동차보험" },
    { value: "AGRICULTURAL",    label: "농기계보험" },
];

const STATUS_OPTIONS = [
    { value: "DESIGNING", label: "설계 중" },
    { value: "FILING",    label: "판매확정 신고 중" },
];

const I = "w-full border border-gray-200 rounded-md px-2.5 py-[7px] text-sm outline-none focus:border-blue-500 bg-white";
const L = "block text-xs font-medium text-gray-500 mb-1";

export default function ProductNewPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 0: 기본정보
    const [info, setInfo] = useState({
        productCode: "", productName: "", lineOfBusiness: "PERSONAL_AUTO",
        targetCustomer: "", saleStartDate: "", saleEndDate: "",
        status: "DESIGNING", description: "",
    });

    // Step 1: 담보
    const [allCoverages, setAllCoverages] = useState<any[]>([]);
    // coverageMasterId → { basePremium, mandatory }
    const [selCoverages, setSelCoverages] = useState<Record<number, { basePremium: string; mandatory: boolean }>>({});

    // Step 2: 특약 (master의 rider_master를 선택해서 상품에 매핑)
    const [allRiders, setAllRiders] = useState<any[]>([]);
    const [selRiders, setSelRiders] = useState<Set<number>>(new Set());

    // Step 3: 할인·할증
    const [adjustments, setAdjustments] = useState<Array<{
        itemName: string; adjType: string; rate: string; conditionDesc: string;
    }>>([]);

    useEffect(() => {
        getCoverages().then(setAllCoverages).catch(() => {});
        getRiders().then(setAllRiders).catch(() => {});
    }, []);

    const toggleCoverage = (id: number) => {
        setSelCoverages(prev => {
            const next = { ...prev };
            if (next[id]) delete next[id];
            else next[id] = { basePremium: "", mandatory: false };
            return next;
        });
    };

    const toggleRider = (id: number) => {
        setSelRiders(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const addAdj = () => setAdjustments(a => [...a, { itemName: "", adjType: "DISCOUNT", rate: "", conditionDesc: "" }]);
    const removeAdj = (i: number) => setAdjustments(a => a.filter((_, idx) => idx !== i));
    const setAdj = (i: number, k: string, v: string) =>
        setAdjustments(a => a.map((item, idx) => idx === i ? { ...item, [k]: v } : item));

    const totalBase = Object.values(selCoverages).reduce((s, c) => s + (Number(c.basePremium) || 0), 0);

    const validate = () => {
        if (step === 0) {
            if (!info.productCode.trim()) { setError("상품코드를 입력하세요."); return false; }
            if (!info.productName.trim()) { setError("상품명을 입력하세요."); return false; }
            if (!info.saleStartDate)      { setError("판매시작일을 입력하세요."); return false; }
        }
        setError(""); return true;
    };

    const handleNext = () => { if (validate()) setStep(s => s + 1); };

    const handleSubmit = async () => {
        setLoading(true); setError("");
        try {
            await createProduct({
                ...info,
                saleEndDate: info.saleEndDate || null,
                coverages: Object.entries(selCoverages).map(([id, c], idx) => ({
                    coverageMasterId: Number(id),
                    basePremium: Number(c.basePremium) || 0,
                    mandatory: c.mandatory,
                    sortOrder: idx,
                })),
                riders: Array.from(selRiders).map((id, idx) => ({
                    riderId: id, isDefault: false, sortOrder: idx,
                })),
                adjustments: adjustments.filter(a => a.itemName.trim()).map((a, idx) => ({
                    itemName: a.itemName,
                    adjType: a.adjType,
                    rate: Number(a.rate) / 100,
                    conditionDesc: a.conditionDesc || null,
                    sortOrder: idx,
                })),
            });
            router.push("/employee/products");
        } catch (e: any) {
            setError(e.message ?? "등록 실패");
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-3xl">
            {/* 스텝 인디케이터 */}
            <div className="flex items-center gap-2 mb-8">
                {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                            ${i === step ? "bg-blue-600 text-white" : i < step ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                            {i < step ? "✓" : i + 1}
                        </div>
                        <span className={`text-sm font-medium ${i === step ? "text-blue-600" : i < step ? "text-green-600" : "text-gray-400"}`}>{s}</span>
                        {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-200" />}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600">← 목록</button>
                <h1 className="text-xl font-bold text-gray-800">보험상품 신규 등록</h1>
            </div>
            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <div className="bg-white border border-gray-200 rounded-xl p-6">

                {/* ── Step 0: 기본정보 ── */}
                {step === 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={L}>상품코드 *</label>
                            <input value={info.productCode}
                                onChange={e => setInfo(f => ({ ...f, productCode: e.target.value }))}
                                placeholder="예: AUTO-2025-001" className={I} />
                        </div>
                        <div>
                            <label className={L}>상품명 *</label>
                            <input value={info.productName}
                                onChange={e => setInfo(f => ({ ...f, productName: e.target.value }))}
                                placeholder="예: 2025 안심 자동차보험" className={I} />
                        </div>
                        <div>
                            <label className={L}>보험종목 (Line of Business)</label>
                            <select value={info.lineOfBusiness}
                                onChange={e => setInfo(f => ({ ...f, lineOfBusiness: e.target.value }))} className={I}>
                                {LOB_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={L}>가입대상</label>
                            <input value={info.targetCustomer}
                                onChange={e => setInfo(f => ({ ...f, targetCustomer: e.target.value }))}
                                placeholder="예: 만 26세 이상 개인" className={I} />
                        </div>
                        <div>
                            <label className={L}>판매시작일 *</label>
                            <input type="date" value={info.saleStartDate}
                                onChange={e => setInfo(f => ({ ...f, saleStartDate: e.target.value }))} className={I} />
                        </div>
                        <div>
                            <label className={L}>판매종료일 (미입력 시 무기한)</label>
                            <input type="date" value={info.saleEndDate}
                                onChange={e => setInfo(f => ({ ...f, saleEndDate: e.target.value }))} className={I} />
                        </div>
                        <div>
                            <label className={L}>상태</label>
                            <select value={info.status}
                                onChange={e => setInfo(f => ({ ...f, status: e.target.value }))} className={I}>
                                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className={L}>상품 설명</label>
                            <textarea value={info.description}
                                onChange={e => setInfo(f => ({ ...f, description: e.target.value }))}
                                placeholder="상품의 주요 특징을 입력하세요"
                                className={`${I} min-h-[80px] resize-y`} />
                        </div>
                    </div>
                )}

                {/* ── Step 1: 담보 선택 ── */}
                {step === 1 && (
                    <div>
                        <p className="text-sm text-gray-500 mb-4">
                            이 상품에 포함할 담보를 선택하고 <strong>담보별 기준 순보험료</strong>를 입력하세요.
                            기준 순보험료는 기초율 계수 적용 전 참조 보험료입니다.
                        </p>
                        {allCoverages.length === 0 && (
                            <p className="text-gray-400 text-sm">등록된 담보가 없습니다. 담보 마스터를 먼저 등록해주세요.</p>
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
                                                                placeholder="예: 50000"
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
                )}

                {/* ── Step 2: 특약 선택 ── */}
                {step === 2 && (
                    <div>
                        <p className="text-sm text-gray-500 mb-4">
                            특약 마스터에서 이 상품에 적용할 특약을 선택하세요.
                            선택된 특약은 계약자가 가입 시 선택 가능합니다.
                        </p>
                        {allRiders.length === 0 && (
                            <p className="text-gray-400 text-sm">등록된 특약이 없습니다. 특약 마스터를 먼저 등록해주세요.</p>
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
                                                {r.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{r.description}</p>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Step 3: 할인·할증 + 요약 ── */}
                {step === 3 && (
                    <div>
                        <div className="mb-5 p-4 bg-blue-50 rounded-lg text-sm">
                            <h3 className="font-semibold text-blue-800 mb-2">상품 요약</h3>
                            <div className="text-blue-700 space-y-1 text-xs">
                                <div><span className="text-blue-500">상품명</span>: {info.productName} <span className="font-mono text-blue-400">({info.productCode})</span></div>
                                <div><span className="text-blue-500">종목</span>: {LOB_OPTIONS.find(o => o.value === info.lineOfBusiness)?.label}</div>
                                <div><span className="text-blue-500">선택 담보</span>: {Object.keys(selCoverages).length}개 | 합산 기준 순보험료: <strong>{totalBase.toLocaleString()}원</strong></div>
                                <div><span className="text-blue-500">선택 특약</span>: {selRiders.size}개</div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            상품에 적용할 할인·할증 항목을 추가하세요.
                            (기초율 계수와 별도로, 특정 조건에 따른 추가 조정)
                        </p>
                        <div className="space-y-2">
                            {adjustments.map((a, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input value={a.itemName} onChange={e => setAdj(i, "itemName", e.target.value)}
                                        placeholder="항목명 (예: 블랙박스 할인)" className={`${I} flex-1`} />
                                    <select value={a.adjType} onChange={e => setAdj(i, "adjType", e.target.value)} className={`${I} w-24`}>
                                        <option value="DISCOUNT">할인</option>
                                        <option value="SURCHARGE">할증</option>
                                    </select>
                                    <div className="relative w-28">
                                        <input type="number" step="0.1" min="0" value={a.rate}
                                            onChange={e => setAdj(i, "rate", e.target.value)}
                                            placeholder="5.0" className={`${I} pr-5`} />
                                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                                    </div>
                                    <input value={a.conditionDesc} onChange={e => setAdj(i, "conditionDesc", e.target.value)}
                                        placeholder="적용 조건 (선택)" className={`${I} flex-1`} />
                                    <button type="button" onClick={() => removeAdj(i)}
                                        className="text-red-400 hover:text-red-600 text-xl leading-none">×</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addAdj}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-800">+ 항목 추가</button>

                        {adjustments.some(a => a.itemName && a.rate) && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs space-y-1">
                                <div className="font-medium text-gray-600 mb-2">시뮬레이션 (기준 순보험료 {totalBase.toLocaleString()}원 기준)</div>
                                {adjustments.filter(a => a.itemName && a.rate).map((a, i) => (
                                    <div key={i} className={`flex justify-between ${a.adjType === "DISCOUNT" ? "text-green-700" : "text-red-600"}`}>
                                        <span>{a.adjType === "DISCOUNT" ? "▼" : "▲"} {a.itemName}</span>
                                        <span>
                                            {a.adjType === "DISCOUNT" ? "-" : "+"}{a.rate}%
                                            ({Math.abs(Math.round(totalBase * Number(a.rate) / 100)).toLocaleString()}원)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-between mt-4">
                <button type="button"
                    onClick={() => step > 0 ? setStep(s => s - 1) : router.back()}
                    className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                    {step === 0 ? "취소" : "이전"}
                </button>
                {step < STEPS.length - 1 ? (
                    <button type="button" onClick={handleNext}
                        className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        다음
                    </button>
                ) : (
                    <button type="button" onClick={handleSubmit} disabled={loading}
                        className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? "등록 중..." : "상품 등록"}
                    </button>
                )}
            </div>
        </div>
    );
}
