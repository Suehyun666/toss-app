'use client';
import Link from 'next/link';

const MOCK_PRODUCTS = [
  { id: 1, name: '토스 든든 건강보험', desc: '암, 뇌, 심장까지 한 번에', minPrice: 20000 },
  { id: 2, 무: '토스 안전 운전자보험', desc: '안전 운전 할인 혜택', minPrice: 15000 },
];

export default function ProductsPage() {
  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">추천 보험 상품</h1>
      <div className="flex flex-col gap-4">
        {MOCK_PRODUCTS.map((prod) => (
          <div key={prod.id} className="border rounded-lg p-5 shadow-sm">
            <h2 className="text-lg font-semibold">{prod.name}</h2>
            <p className="text-gray-500 mb-4">{prod.desc}</p>
            <p className="text-sm text-blue-600 mb-4">예상 월 보험료: {prod.minPrice.toLocaleString()}원~</p>
            <div className="flex gap-2">
              <Link href={`/insurance/calculator?prodId=${prod.id}`} className="flex-1 bg-gray-100 p-2 text-center rounded">
                보험료 계산
              </Link>
              <Link href={`/insurance/apply?prodId=${prod.id}`} className="flex-1 bg-blue-500 text-white p-2 text-center rounded">
                바로 가입
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
