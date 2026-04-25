'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { ApiError } from "@/services/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await login({ email, password });
            const maxAge = 86400;
            document.cookie = `is_logged_in=true; path=/; max-age=${maxAge}`;
            document.cookie = `user_role=${res.role}; path=/; max-age=${maxAge}`;
            document.cookie = `access_token=${encodeURIComponent(res.accessToken)}; path=/; max-age=${maxAge}`;
            document.cookie = `refresh_token=${encodeURIComponent(res.refreshToken)}; path=/; max-age=${maxAge * 7}`;

            if (res.role === "ADMIN" || res.role === "EMPLOYEE") {
                router.push("/employee/dashboard");
            } else {
                router.push("/");
            }
            router.refresh();
        } catch (error) {
            if (error instanceof ApiError) {
                alert(`로그인 실패: ${error.message}`);
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    return (
        <main style={{ maxWidth: 400, width: "100%", margin: "80px auto", padding: "0 20px" }}>
            <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">이메일</label>
                    <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="이메일 또는 ID"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">비밀번호</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="비밀번호 입력"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold p-3 rounded mt-2 hover:bg-blue-600 transition"
                >
                    로그인
                </button>
            </form>
            <div className="text-center mt-4 text-sm text-gray-500">
                계정이 없으신가요?
                <Link href="/auth/signup" className="text-blue-500 underline ml-2">회원가입</Link>
            </div>
        </main>
    );
}
