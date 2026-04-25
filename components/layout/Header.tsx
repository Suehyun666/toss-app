'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsLogged(document.cookie.includes('is_logged_in=true'));
    setRole(getCookie('user_role'));
  }, [pathname]);

  // 직원/관리자는 사이드바 레이아웃이 있으므로 헤더 불필요
  if (role === 'EMPLOYEE' || role === 'ADMIN') return null;

  const handleLogout = () => {
    ['is_logged_in', 'user_role', 'access_token'].forEach(k => {
      document.cookie = `${k}=; path=/; max-age=0`;
    });
    window.location.href = '/';
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
            <button onClick={handleLogout} className="text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors">
              로그아웃
            </button>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 px-2 py-2">로그인</Link>
              <Link href="/auth/signup" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors shadow-sm shadow-blue-500/20">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
