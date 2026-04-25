import { fetchApi } from "./api";

function authHeader(): Record<string, string> {
    if (typeof document === "undefined") return {};
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
    return match ? { Authorization: `Bearer ${decodeURIComponent(match[1])}` } : {};
}

// ── 담보 마스터 ──────────────────────────────────────────────
export async function getCoverages() {
    return fetchApi("/master/coverages", { headers: authHeader() }).then(r => r.data);
}

export async function createCoverage(data: any) {
    return fetchApi("/master/coverages", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function getCoverage(id: number) {
    return fetchApi(`/master/coverages/${id}`, { headers: authHeader() }); // 단일 객체는 래핑 없음
}

export async function updateCoverage(id: number, data: any) {
    return fetchApi(`/master/coverages/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function deleteCoverage(id: number) {
    return fetchApi(`/master/coverages/${id}`, { method: "DELETE", headers: authHeader() });
}

// ── 기초율 ───────────────────────────────────────────────────
export async function getBaseRates(type?: string) {
    const url = type ? `/master/base-rates?type=${encodeURIComponent(type)}` : "/master/base-rates";
    return fetchApi(url, { headers: authHeader() }).then(r => r.data);
}

export async function createBaseRate(data: any) {
    return fetchApi("/master/base-rates", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function updateBaseRate(id: number, data: any) {
    return fetchApi(`/master/base-rates/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function deleteBaseRate(id: number) {
    return fetchApi(`/master/base-rates/${id}`, { method: "DELETE", headers: authHeader() });
}

export async function getBaseRateStats(type?: string) {
    const url = type ? `/master/base-rates/stats?type=${encodeURIComponent(type)}` : "/master/base-rates/stats";
    return fetchApi(url, { headers: authHeader() }).then(r => r.data);
}

// ── 면책사유 ─────────────────────────────────────────────────
export async function getExclusions() {
    return fetchApi("/master/exclusions", { headers: authHeader() }).then(r => r.data);
}

export async function createExclusion(data: any) {
    return fetchApi("/master/exclusions", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function deleteExclusion(id: number) {
    return fetchApi(`/master/exclusions/${id}`, { method: "DELETE", headers: authHeader() });
}

// ── 특약 마스터 ───────────────────────────────────────────────
export async function getRiders() {
    return fetchApi("/master/riders", { headers: authHeader() }).then(r => r.data);
}

export async function getRider(id: number) {
    return fetchApi(`/master/riders/${id}`, { headers: authHeader() });
}

export async function createRider(data: any) {
    return fetchApi("/master/riders", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function updateRider(id: number, data: any) {
    return fetchApi(`/master/riders/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function deleteRider(id: number) {
    return fetchApi(`/master/riders/${id}`, { method: "DELETE", headers: authHeader() });
}

// ── 표준 약관 ────────────────────────────────────────────────
export async function getProvisions() {
    return fetchApi("/master/provisions", { headers: authHeader() }).then(r => r.data);
}

export async function getProvision(id: number) {
    return fetchApi(`/master/provisions/${id}`, { headers: authHeader() });
}

export async function createProvision(data: any) {
    return fetchApi("/master/provisions", {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function deleteProvision(id: number) {
    return fetchApi(`/master/provisions/${id}`, { method: "DELETE", headers: authHeader() });
}

// ── 표준 약관 항목 (트리) ─────────────────────────────────────
export async function getProvisionItems() {
    return fetchApi("/master/provisions/items", { headers: authHeader() }).then(r => r.data);
}

export async function getProvisionTree(id: number) {
    return fetchApi(`/master/provisions/${id}/items`, { headers: authHeader() }).then(r => r.data);
}

export async function addProvisionItem(provisionId: number, data: any) {
    return fetchApi(`/master/provisions/${provisionId}/items`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function updateProvisionItem(itemId: number, data: any) {
    return fetchApi(`/master/provisions/items/${itemId}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
}

export async function deleteProvisionItem(itemId: number) {
    return fetchApi(`/master/provisions/items/${itemId}`, { method: "DELETE", headers: authHeader() });
}
