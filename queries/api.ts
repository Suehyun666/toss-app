const BASE_URL = process.env.NEXT_PUBLIC_JAVA_SERVER_URL;

export class ApiError extends Error {
    public status?: number;
    public code?: string;
    constructor(message: string, status?: number, code?: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

// 전역 에러 핸들러 콜백
type AuthFailureHandler = () => void;
let authFailureHandler: AuthFailureHandler | null = null;

export function setAuthFailureHandler(handler: AuthFailureHandler) {
    authFailureHandler = handler;
}

function handleAuthFailure() {
    ["is_logged_in", "user_role", "access_token", "refresh_token"].forEach(
        k => (document.cookie = `${k}=; path=/; max-age=0`)
    );
    if (authFailureHandler) {
        authFailureHandler();
    } else {
        window.location.href = "/auth/login";
    }
}

export function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
}

async function refreshAccessToken(): Promise<string> {
    const refreshToken = getCookie("refresh_token");
    if (!refreshToken) {
        handleAuthFailure();
        throw new ApiError("로그인이 필요합니다.", 401);
    }
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
        handleAuthFailure();
        throw new ApiError("세션이 만료되었습니다. 다시 로그인해 주세요.", 401);
    }
    const data = await res.json();
    const newToken: string = data.data?.accessToken ?? data.accessToken;
    setCookie("access_token", newToken, 3600);
    return newToken;
}

async function request(path: string, options: RequestInit): Promise<any> {
    const token = getCookie("access_token");
    const headers: any = { ...options.headers };
    if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }
    
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });
    if (!res.ok) {
        let errorData: any = {};
        try { errorData = await res.json(); } catch {}
        throw new ApiError(errorData.message || "요청에 실패했습니다.", errorData.status || res.status, errorData.code);
    }
    if (res.status === 204) return null;
    return res.json();
}

export async function fetchApi(path: string, options: RequestInit = {}) {
    try {
        return await request(path, options);
    } catch (err: any) {
        if (err?.status === 401) {
            // 토큰 만료 시 갱신 후 1회 재시도
            const newToken = await refreshAccessToken();
            const retryOptions = {
                ...options,
                headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
            };
            return await request(path, retryOptions);
        }
        if (err?.status === 403) {
            throw new ApiError('접근 권한이 없습니다.', 403, err?.code);
        }
        throw err;
    }
}
