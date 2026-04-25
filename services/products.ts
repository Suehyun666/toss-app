import { fetchApi } from "./api";

function authHeader(): Record<string, string> {
    if (typeof document === "undefined") return {};
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
    return match ? { Authorization: `Bearer ${decodeURIComponent(match[1])}` } : {};
}

export async function getProducts() {
    return fetchApi("/products", { headers: authHeader() }).then(r => r.data);
}

export async function getProduct(id: number) {
    return fetchApi(`/products/${id}`, { headers: authHeader() });
}

export async function createProduct(data: any) {
    return fetchApi("/products", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function updateProduct(id: number, data: any) {
    return fetchApi(`/products/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function deleteProduct(id: number) {
    return fetchApi(`/products/${id}`, { method: "DELETE", headers: authHeader() });
}

export async function changeProductStatus(id: number, status: string) {
    return fetchApi(`/products/${id}/status`, {
        method: "PATCH",
        headers: authHeader(),
        body: JSON.stringify({ status }),
    });
}

export async function getProductDocuments(productId: number) {
    return fetchApi(`/products/${productId}/documents`, { headers: authHeader() }).then(r => r.data);
}

export async function addProductDocument(productId: number, formData: FormData) {
    // multipart/form-data — Content-Type은 브라우저가 boundary 포함해서 자동 세팅
    const headers = authHeader(); // Content-Type 없이 Authorization만
    return fetchApi(`/products/${productId}/documents`, {
        method: "POST",
        headers,
        body: formData,
    });
}

export async function downloadProductDocument(productId: number, docId: string, filename: string) {
    const BASE_URL = process.env.NEXT_PUBLIC_JAVA_SERVER_URL;
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
    const token = match ? decodeURIComponent(match[1]) : "";
    const res = await fetch(`${BASE_URL}/products/${productId}/documents/${docId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("다운로드 실패");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export async function deleteProductDocument(productId: number, docId: string) {
    return fetchApi(`/products/${productId}/documents/${docId}`, {
        method: "DELETE",
        headers: authHeader(),
    });
}
