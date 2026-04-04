'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CalculatorPage() {
  const [result, setResult] = useState<number | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(Math.floor(Math.random() * 50000) + 15000); // Mock calculate
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">내 보험료 계산하기</h1>
      <form onSubmit={calculate} className="border p-5 rounded-lg flex flex-col gap-4">
        <div>
          <label className="block text-sm mb-1">나이</label>
          <input type="number" required className="w-full border p-2 rounded" placeholder="만 나이를 입력하세요" />
        </div>
        <div>
          <label className="block text-sm mb-1">성별</label>
          <select className="w-full border p-2 rounded">
            <option>남성</option>
            <option>여성</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded font-bold">
          계산하기
        </button>
      </form>
      {result !== null && (
        <div className="mt-8 p-5 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-600 mb-2">고객님의 예상 월 보험료는</p>
          <p className="text-3xl font-bold text-blue-600 mb-4">{result.toLocaleString()}원</p>
          <Link href="/insurance/apply" className="block w-full bg-blue-600 text-white p-3 rounded font-bold">
            이 보험 가입하기
          </Link>
        </div>
      )}
    </main>
  );
}
