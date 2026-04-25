import { useState, useCallback } from "react";
import type { ProductCoverage, ProductRider, ProductAdjustment } from "@/types/product";

export function useProductEditForm(initialData?: any) {
    const [step, setStep] = useState(0);
    const [error, setError] = useState("");

    const [info, setInfo] = useState({
        productCode: "", productName: "", lineOfBusiness: "PERSONAL_AUTO",
        targetCustomer: "", saleStartDate: "", saleEndDate: "",
        status: "DESIGNING", description: "",
    });

    const [selCoverages, setSelCoverages] = useState<Record<number, { basePremium: string; mandatory: boolean }>>({});
    const [selRiders, setSelRiders] = useState<Set<number>>(new Set());
    const [adjustments, setAdjustments] = useState<Array<{
        itemName: string; adjType: string; rate: string; conditionDesc: string;
    }>>([]);

    const toggleCoverage = useCallback((id: number) => {
        setSelCoverages(prev => {
            const next = { ...prev };
            if (next[id]) delete next[id];
            else next[id] = { basePremium: "", mandatory: false };
            return next;
        });
    }, []);

    const toggleRider = useCallback((id: number) => {
        setSelRiders(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const addAdj = useCallback(() => setAdjustments(a => [...a, { itemName: "", adjType: "DISCOUNT", rate: "", conditionDesc: "" }]), []);
    const removeAdj = useCallback((i: number) => setAdjustments(a => a.filter((_, idx) => idx !== i)), []);
    const setAdj = useCallback((i: number, k: string, v: string) =>
        setAdjustments(a => a.map((item, idx) => idx === i ? { ...item, [k]: v } : item)), []);

    const validate = useCallback(() => {
        if (step === 0) {
            if (!info.productCode.trim()) { setError("상품코드를 입력하세요."); return false; }
            if (!info.productName.trim()) { setError("상품명을 입력하세요."); return false; }
            if (!info.saleStartDate)      { setError("판매시작일을 입력하세요."); return false; }
        }
        setError(""); return true;
    }, [step, info]);

    const handleNext = useCallback(() => { if (validate()) setStep(s => s + 1); }, [validate]);
    const handlePrev = useCallback(() => { if (step > 0) setStep(s => s - 1); }, [step]);

    return {
        step, setStep,
        error, setError,
        info, setInfo,
        selCoverages, setSelCoverages,
        selRiders, setSelRiders,
        adjustments, setAdjustments,
        toggleCoverage, toggleRider,
        addAdj, removeAdj, setAdj,
        validate, handleNext, handlePrev
    };
}
