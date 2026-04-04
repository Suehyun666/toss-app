'use client';
import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();
    const [step, setStep] = useState<"search" | "pay" | "success">("search");
    const [loading, setLoading] = useState(false);
    const [payMethod, setPayMethod] = useState("토스페이");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setStep("pay"); }, 500);
    };

    const handlePayment = () => {
        setLoading(true);
        // 결제하기 버튼을 누르면 실제 토스페이먼츠 연동 페이지로 이동
        setTimeout(() => { 
            router.push('/payments'); 
        }, 500);
    };

    return (
        <main className="min-h-[100dvh] flex flex-col font-sans">
            {/* Hero Section */}
            <section className="relative w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 overflow-hidden border-b border-gray-100">
                <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                
                <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                    
                    {/* Left: Landing Copy */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-full text-sm mb-6 shadow-sm">
                            🎉 2026년 신규 상품 출시
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                            당신의 내일,<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">한국생명보험이</span><br/>
                            책임집니다.
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                            복잡한 보험가입과 결제는 이제 그만.<br className="hidden lg:block"/>
                            스마트 다이렉트 솔루션으로 1분 만에 끝내세요.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/insurance/products" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-lg transition-transform active:scale-95 shadow-xl">
                                내게 맞는 상품 찾기
                            </Link>
                            <Link href="/insurance/calculator" className="px-8 py-4 bg-white hover:bg-gray-50 text-slate-800 border border-gray-200 font-bold rounded-xl text-lg transition-transform active:scale-95 shadow-sm">
                                1분 보험료 계산
                            </Link>
                        </div>
                    </div>

                    {/* Right: Payment Portal Widget */}
                    <div className="w-full max-w-md lg:w-1/2">
                        <div className="bg-white/90 backdrop-blur-3xl rounded-[2rem] shadow-2xl shadow-blue-900/10 p-8 border border-white/60 transition-all duration-500">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xl shadow-md">💳</div>
                                <h2 className="text-xl font-bold text-gray-900">빠른 보험료 납부</h2>
                            </div>

                            {step === "search" && (
                                <form onSubmit={handleSearch} className="animate-fade-in-up">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">계약자 주민등록번호 / 계약번호</label>
                                    <input required type="text" className="w-full text-base px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm mb-4 placeholder:text-gray-300 font-medium" placeholder="예: 900101-1" />
                                    <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex justify-center h-14 items-center">
                                        {loading ? <span className="animate-spin border-4 border-white/20 border-t-white rounded-full w-5 h-5"></span> : "미납 보험료 조회"}
                                    </button>
                                </form>
                            )}

                            {step === "pay" && (
                                <div className="animate-fade-in-up">
                                    <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100/50 mb-5">
                                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md mb-2">신규 가입</span>
                                        <h3 className="text-sm font-bold text-gray-800 mb-1">토스 든든 건강보험 (초회)</h3>
                                        <p className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">45,000<span className="text-lg font-semibold text-gray-500 ml-1">원</span></p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-5">
                                        {['토스페이', '카카오페이', '신용카드', '계좌이체'].map(m => (
                                            <button key={m} onClick={() => setPayMethod(m)} className={`p-3 border rounded-lg font-bold text-sm transition-all auto-cols-auto ${payMethod === m ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 hover:border-blue-400 text-gray-500'}`}>
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                    <button disabled={loading} onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-bold py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-transform active:scale-95 flex justify-center h-14 items-center">
                                        {loading ? <span className="animate-spin border-4 border-white/20 border-t-white rounded-full w-5 h-5"></span> : `${payMethod}로 결제하기`}
                                    </button>
                                </div>
                            )}

                            {step === "success" && (
                                <div className="text-center animate-fade-in-up py-4">
                                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">✓</div>
                                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2">납부 완료!</h3>
                                    <p className="text-gray-500 font-medium mb-8 text-base">성공적으로 처리되었습니다.</p>
                                    <Link href="/insurance/contracts" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition-colors text-base">
                                        내 계약 상태 보러가기
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-24">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">왜 한국생명보험인가요?</h2>
                        <p className="text-lg text-slate-500 font-medium">가입부터 보상까지, 압도적으로 편리한 다이렉트 경험</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { title: '1분 다이렉트 가입', desc: '복잡한 서류 없이 모바일로 간편하게 가입하세요.', icon: '⚡' },
                            { title: '맞춤형 보험료 계산', desc: '내 나이와 성별로 가장 합리적인 옵션을 추천받으세요.', icon: '🎯' },
                            { title: '24시간 사고 접수', desc: '언제 어디서든 즉시 모바일로 접수하고 빠르게 보상받으세요.', icon: '🏥' }
                        ].map((f, i) => (
                            <div key={i} className="text-center p-8 rounded-3xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-100">
                                <div className="text-4xl mb-6">{f.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
            `}</style>
        </main>
    );
}
