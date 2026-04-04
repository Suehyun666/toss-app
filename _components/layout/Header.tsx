'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    // Simple client-side auth check
    setIsLogged(document.cookie.includes('is_logged_in=true'));
  }, []);

  const handleLogout = () => {
    document.cookie = "is_logged_in=; path=/; max-age=0";
    setIsLogged(false);
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-sm">🛡️</span>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">한국생명보험</span>
        </Link>
        <nav className="hidden md:flex gap-8 text-[15px] font-bold text-slate-600">
          <Link href="/insurance/products" className="hover:text-blue-600 transition-colors">상품조회</Link>
          <Link href="/insurance/contracts" className="hover:text-blue-600 transition-colors">계약관리</Link>
          <Link href="/insurance/claims?type=accident" className="hover:text-blue-600 transition-colors">보상/청구</Link>
        </nav>
        <div className="flex items-center gap-4">
          {isLogged ? (
            <>
              <span className="text-sm font-semibold text-slate-500 hidden sm:inline">환영합니다!</span>
              <button onClick={handleLogout} className="text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 px-2 py-2">
                로그인
              </Link>
              <Link href="/auth/signup" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-sm shadow-blue-500/20">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
