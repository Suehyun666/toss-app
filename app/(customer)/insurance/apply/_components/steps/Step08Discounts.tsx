'use client';
import { useEnrollmentStore } from '@/store/enrollmentStore';
import { useOnSaleProduct } from '@/lib/queries/products';
import type { ProductAdjustment } from '@/types/product';
import type { SelectedAdjustment } from '@/types/enrollment';

/** 상품에 adjustments가 없는 경우 기본 할인 목록 */
const DEFAULT_DISCOUNTS: ProductAdjustment[] = [
  { id: 1, productId: 0, itemName: '마일리지 할인',      adjType: 'DISCOUNT', rate: -0.08, conditionDesc: '연간 주행거리 기준 최대 8% 할인', sortOrder: 1 },
  { id: 2, productId: 0, itemName: '블랙박스 할인',      adjType: 'DISCOUNT', rate: -0.02, conditionDesc: '블랙박스 장착 차량 2% 할인', sortOrder: 2 },
  { id: 3, productId: 0, itemName: '첨단안전장치 할인',  adjType: 'DISCOUNT', rate: -0.015, conditionDesc: 'AEB·LDWS 장착 차량 1.5% 할인', sortOrder: 3 },
  { id: 4, productId: 0, itemName: '티맵 안전운전 할인', adjType: 'DISCOUNT', rate: -0.012, conditionDesc: '티맵 안전운전 점수 70점 이상 1.2% 할인', sortOrder: 4 },
  { id: 5, productId: 0, itemName: '대중교통 이용 할인', adjType: 'DISCOUNT', rate: -0.03,  conditionDesc: '월 10회 이상 대중교통 이용 3.0% 할인', sortOrder: 5 },
  { id: 6, productId: 0, itemName: '자녀 할인',          adjType: 'DISCOUNT', rate: -0.005, conditionDesc: '만 7세 이하 자녀 있는 계약자 0.5% 할인', sortOrder: 6 },
];

export default function Step08Discounts() {
  const { productId, selectedAdjustments, toggleAdjustment, nextStep, prevStep } = useEnrollmentStore();
  const { data: product } = useOnSaleProduct(productId);

  const discounts: ProductAdjustment[] = (() => {
    if (product?.adjustments?.length) {
      return product.adjustments
        .filter((a) => a.adjType === 'DISCOUNT' || a.rate < 0)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return DEFAULT_DISCOUNTS;
  })();

  const isSelected = (itemName: string) =>
    selectedAdjustments.some((a) => a.itemName === itemName);

  const handleToggle = (adj: ProductAdjustment) => {
    const selected: SelectedAdjustment = {
      itemName: adj.itemName,
      adjType: adj.adjType,
      rate: adj.rate,
    };
    toggleAdjustment(selected);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">할인 특약 선택</h2>
        <p className="text-sm text-gray-500 mt-1">해당하는 특약을 모두 선택하면 보험료가 추가로 할인됩니다.</p>
      </div>

      <div className="flex flex-col gap-3">
        {discounts.map((adj) => {
          const selected = isSelected(adj.itemName);
          return (
            <div
              key={adj.id}
              onClick={() => handleToggle(adj)}
              className={`flex items-start justify-between p-4 border rounded-xl cursor-pointer transition-colors ${
                selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{adj.itemName}</p>
                  <span className="text-xs text-green-600 font-semibold">
                    {Math.abs(adj.rate * 100).toFixed(1)}% 할인
                  </span>
                </div>
                {adj.conditionDesc && (
                  <p className="text-xs text-gray-500 mt-0.5">{adj.conditionDesc}</p>
                )}
              </div>
              <div
                className={`relative w-11 h-6 rounded-full flex-shrink-0 mt-0.5 transition-colors ${
                  selected ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  selected ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={prevStep} className="flex-1 border border-gray-300 text-gray-700 font-semibold p-4 rounded-xl">이전</button>
        <button onClick={nextStep} className="flex-1 bg-blue-500 text-white font-semibold p-4 rounded-xl">보험료 계산</button>
      </div>
    </div>
  );
}
