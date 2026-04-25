import React from 'react';
import { InputField } from '@/components/common/ui/forms/InputField';
import { SelectField } from '@/components/common/ui/forms/SelectField';
import { LOB_OPTIONS, STATUS_OPTIONS } from '@/types/product';

interface Step0Props {
    info: any;
    setInfo: (updater: (prev: any) => any) => void;
}

export function Step0BasicInfo({ info, setInfo }: Step0Props) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <InputField
                label="상품코드 *"
                value={info.productCode}
                onChange={e => setInfo(f => ({ ...f, productCode: e.target.value }))}
            />
            <InputField
                label="상품명 *"
                value={info.productName}
                onChange={e => setInfo(f => ({ ...f, productName: e.target.value }))}
            />
            <SelectField
                label="보험종목"
                value={info.lineOfBusiness}
                onChange={e => setInfo(f => ({ ...f, lineOfBusiness: e.target.value }))}
                options={LOB_OPTIONS}
            />
            <InputField
                label="가입대상"
                value={info.targetCustomer}
                onChange={e => setInfo(f => ({ ...f, targetCustomer: e.target.value }))}
            />
            <InputField
                type="date"
                label="판매시작일 *"
                value={info.saleStartDate}
                onChange={e => setInfo(f => ({ ...f, saleStartDate: e.target.value }))}
            />
            <InputField
                type="date"
                label="판매종료일"
                value={info.saleEndDate}
                onChange={e => setInfo(f => ({ ...f, saleEndDate: e.target.value }))}
            />
            <SelectField
                label="상태"
                value={info.status}
                onChange={e => setInfo(f => ({ ...f, status: e.target.value }))}
                options={STATUS_OPTIONS}
            />
            <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">상품 설명</label>
                <textarea
                    value={info.description}
                    onChange={e => setInfo(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-md px-2.5 py-[7px] text-sm outline-none focus:border-blue-500 bg-white min-h-[80px] resize-y"
                />
            </div>
        </div>
    );
}
