'use client';

import { useRouter } from "next/navigation";
import { useMasterData, useCreateProduct } from "@/queries/products";
import { useProductEditForm } from "@/hooks/useProductEditForm";
import { StepIndicator } from "@/components/common/ui/StepIndicator";
import { PRODUCT_WIZARD_STEPS } from "@/constants/product";
import { Step0BasicInfo } from "../_components/steps/Step0BasicInfo";
import { Step1Coverages } from "../_components/steps/Step1Coverages";
import { Step2Riders } from "../_components/steps/Step2Riders";

const STEPS = [...PRODUCT_WIZARD_STEPS];

export default function ProductNewPage() {
    const router = useRouter();

    const { data: masterData, isLoading: masterLoading } = useMasterData();
    const { mutateAsync: createProduct, isPending: loading } = useCreateProduct();

    const form = useProductEditForm();

    const handleSubmit = async () => {
        form.setError("");
        try {
            await createProduct({
                ...form.info,
                saleEndDate: form.info.saleEndDate || null,
                coverages: Object.entries(form.selCoverages).map(([cid, opts], idx) => ({
                    coverageMasterId: Number(cid),
                    limitOptionIds: Array.from(opts),
                    sortOrder: idx,
                })),
                riders: Array.from(form.selRiders).map((rid, idx) => ({
                    riderId: rid, isDefault: false, sortOrder: idx,
                })),
            });
            router.push("/employee/products");
        } catch (e: any) {
            form.setError(e.message ?? "등록 실패");
        }
    };

    return (
        <div className="max-w-3xl">
            <StepIndicator steps={STEPS} currentStep={form.step} />

            <div className="flex items-center gap-3 mb-6">
                <button type="button" onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600">← 목록</button>
                <h1 className="text-xl font-bold text-gray-800">보험상품 신규 등록</h1>
            </div>
            {form.error && <p className="mb-4 text-sm text-red-500">{form.error}</p>}

            <div className="bg-white border border-gray-200 rounded-xl p-6">
                {form.step === 0 && (
                    <Step0BasicInfo info={form.info} setInfo={form.setInfo} />
                )}
                {form.step === 1 && (
                    <Step1Coverages
                        allCoverages={masterData?.coverages ?? []}
                        selCoverages={form.selCoverages}
                        toggleCoverage={form.toggleCoverage}
                        toggleOption={form.toggleOption}
                    />
                )}
                {form.step === 2 && (
                    <Step2Riders
                        allRiders={masterData?.riders ?? []}
                        selRiders={form.selRiders}
                        toggleRider={form.toggleRider}
                    />
                )}
                {masterLoading && form.step > 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">마스터 데이터 로딩 중...</p>
                )}
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
                        {loading ? "등록 중..." : "상품 등록"}
                    </button>
                )}
            </div>
        </div>
    );
}
