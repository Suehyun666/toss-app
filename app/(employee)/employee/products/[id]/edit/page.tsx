'use client';

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProductEditData, useUpdateProduct } from "@/queries/product.query";
import { useProductEditForm } from "@/hooks/useProductEditForm";
import { StepIndicator } from "@/components/common/ui/StepIndicator";
import { Step0BasicInfo } from "./_components/Step0BasicInfo";
import { Step1Coverages } from "./_components/Step1Coverages";
import { Step2Riders } from "./_components/Step2Riders";
import { Step3Adjustments } from "./_components/Step3Adjustments";

const STEPS = ["기본정보", "담보 선택", "특약 선택", "할인·할증"];

export default function ProductEditPage() {
    const { id } = useParams();
    const router = useRouter();
    const pid = Number(id);

    const { data, isLoading: initialLoading, isError } = useProductEditData(pid);
    const { mutateAsync: updateProduct, isPending: loading } = useUpdateProduct();

    const form = useProductEditForm();

    // Pre-fill data when loaded
    useEffect(() => {
        if (!data) return;
        const { product: p } = data;
        form.setInfo({
            productCode:      p.productCode ?? "",
            productName:      p.productName ?? "",
            lineOfBusiness:   p.lineOfBusiness ?? "PERSONAL_AUTO",
            targetCustomer:   p.targetCustomer ?? "",
            saleStartDate:    p.saleStartDate ?? "",
            saleEndDate:      p.saleEndDate ?? "",
            status:           p.status ?? "DESIGNING",
            description:      p.description ?? "",
        });

        const covMap: Record<number, { basePremium: string; mandatory: boolean }> = {};
        (p.coverages ?? []).forEach((c: any) => {
            covMap[c.coverageMasterId] = {
                basePremium: String(c.basePremium ?? ""),
                mandatory: c.mandatory ?? false,
            };
        });
        form.setSelCoverages(covMap);

        form.setSelRiders(new Set((p.riders ?? []).map((r: any) => r.riderId)));

        form.setAdjustments((p.adjustments ?? []).map((a: any) => ({
            itemName:     a.itemName ?? "",
            adjType:      a.adjType ?? "DISCOUNT",
            rate:         a.rate != null ? String(Math.abs(a.rate * 100)) : "",
            conditionDesc: a.conditionDesc ?? "",
        })));
    }, [data, form.setInfo, form.setSelCoverages, form.setSelRiders, form.setAdjustments]);

    const handleSubmit = async () => {
        form.setError("");
        try {
            await updateProduct({
                id: pid,
                data: {
                    ...form.info,
                    saleEndDate: form.info.saleEndDate || null,
                    coverages: Object.entries(form.selCoverages).map(([cid, c], idx) => ({
                        coverageMasterId: Number(cid),
                        basePremium: Number(c.basePremium) || 0,
                        mandatory: c.mandatory,
                        sortOrder: idx,
                    })),
                    riders: Array.from(form.selRiders).map((rid, idx) => ({
                        riderId: rid, isDefault: false, sortOrder: idx,
                    })),
                    adjustments: form.adjustments.filter(a => a.itemName.trim()).map((a, idx) => ({
                        itemName: a.itemName,
                        adjType: a.adjType,
                        rate: Number(a.rate) / 100,
                        conditionDesc: a.conditionDesc || null,
                        sortOrder: idx,
                    })),
                }
            });
            router.push(`/employee/products/${pid}`);
        } catch (e: any) {
            form.setError(e.message ?? "수정 실패");
        }
    };

    if (initialLoading) return <p className="text-gray-400 text-sm p-6">로딩 중...</p>;
    if (isError) return <p className="text-red-500 text-sm p-6">상품 정보 로드 실패</p>;

    return (
        <div className="max-w-3xl">
            <StepIndicator steps={STEPS} currentStep={form.step} />

            <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600">← 뒤로</button>
                <h1 className="text-xl font-bold text-gray-800">상품 수정</h1>
                <span className="text-sm text-gray-400 font-mono">{form.info.productCode}</span>
            </div>
            {form.error && <p className="mb-4 text-sm text-red-500">{form.error}</p>}

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                {form.step === 0 && <Step0BasicInfo info={form.info} setInfo={form.setInfo} />}
                {form.step === 1 && <Step1Coverages allCoverages={data?.coverages ?? []} selCoverages={form.selCoverages} toggleCoverage={form.toggleCoverage} setSelCoverages={form.setSelCoverages} />}
                {form.step === 2 && <Step2Riders allRiders={data?.riders ?? []} selRiders={form.selRiders} toggleRider={form.toggleRider} />}
                {form.step === 3 && <Step3Adjustments info={form.info} selCoverages={form.selCoverages} selRiders={form.selRiders} adjustments={form.adjustments} setAdj={form.setAdj} addAdj={form.addAdj} removeAdj={form.removeAdj} />}
            </div>

            <div className="flex justify-between mt-4">
                <button type="button"
                    onClick={() => form.step > 0 ? form.handlePrev() : router.back()}
                    className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                    {form.step === 0 ? "취소" : "이전"}
                </button>
                {form.step < STEPS.length - 1 ? (
                    <button type="button" onClick={form.handleNext}
                        className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        다음
                    </button>
                ) : (
                    <button type="button" onClick={handleSubmit} disabled={loading}
                        className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? "저장 중..." : "수정 완료"}
                    </button>
                )}
            </div>
        </div>
    );
}
