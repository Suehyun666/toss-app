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

export async function fetchApi(path: string, options: RequestInit = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        let errorData: any = {};
        try {
            errorData = await response.json();
        } catch (e) {
            // Not JSON
        }
        throw new ApiError(
            errorData.message || "요청에 실패했습니다.", 
            errorData.status || response.status, 
            errorData.code
        );
    }

    if (response.status === 204) return null;
    return response.json();
}
