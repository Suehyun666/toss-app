import { fetchApi } from "./api";

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
