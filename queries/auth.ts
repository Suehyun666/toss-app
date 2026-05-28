import { fetchApi } from "./api";

// ─── 세션 쿠키 키 목록 ───────────────────────────────────────────────

const SESSION_COOKIE_KEYS = [
    "is_logged_in",
    "user_role",
    "access_token",
    "refresh_token",
    "identity_verify_token",
] as const;

// ─── 세션 저장 ───────────────────────────────────────────────────────

export function saveSession(res: { role: string; accessToken: string; refreshToken: string }) {
    const maxAge = 86400; // 1일
    document.cookie = `is_logged_in=true; path=/; max-age=${maxAge}`;
    document.cookie = `user_role=${res.role}; path=/; max-age=${maxAge}`;
    document.cookie = `access_token=${encodeURIComponent(res.accessToken)}; path=/; max-age=${maxAge}`;
    document.cookie = `refresh_token=${encodeURIComponent(res.refreshToken)}; path=/; max-age=${maxAge * 7}`;
}

export function saveIdentityToken(token: string) {
    document.cookie = `identity_verify_token=${encodeURIComponent(token)}; path=/; max-age=86400`;
}

// ─── 세션 제거 (로그아웃) ────────────────────────────────────────────

export function clearSession() {
    SESSION_COOKIE_KEYS.forEach((k) => {
        document.cookie = `${k}=; path=/; max-age=0`;
    });
}

// ─── API 함수 ────────────────────────────────────────────────────────

export async function login(data: any) {
    return fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function signup(data: any) {
    return fetchApi("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function loginByIdentity(verifyToken: string) {
    return fetchApi("/auth/login/identity", {
        method: "POST",
        body: JSON.stringify({ verifyToken }),
    });
}
