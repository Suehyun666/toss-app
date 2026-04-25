import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCoverages, getRiders } from "@/queries/master";
import type { ProductCatalogItem, ProductCatalogDetail } from '@/types/product';
import { fetchApi, getCookie } from "./api";

const BASE_URL = process.env.NEXT_PUBLIC_JAVA_SERVER_URL;

export async function getProducts() {
  return fetchApi("/products").then(r => r.data);
}

export async function getProduct(id: number) {
  return fetchApi(`/products/${id}`);
}

export async function createProduct(data: any) {
  return fetchApi("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: number, data: any) {
  return fetchApi(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number) {
  return fetchApi(`/products/${id}`, { method: "DELETE" });
}

export async function changeProductStatus(id: number, status: string) {
  return fetchApi(`/products/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getProductDocuments(productId: number) {
  return fetchApi(`/products/${productId}/documents`).then(r => r.data);
}

export async function addProductDocument(productId: number, formData: FormData) {
  return fetchApi(`/products/${productId}/documents`, {
    method: "POST",
    body: formData,
  });
}

export async function downloadProductDocument(productId: number, docId: string, filename: string) {
  const token = getCookie("access_token");
  const res = await fetch(`${BASE_URL}/products/${productId}/documents/${docId}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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
  });
}


async function fetchOnSaleProducts(): Promise<ProductCatalogItem[]> {
  const res = await fetch(`${BASE_URL}/public/products`);
  if (!res.ok) throw new Error('상품 목록을 불러오지 못했습니다.');
  const json = await res.json();
  return json.data ?? json;
}

async function fetchOnSaleProduct(id: number): Promise<ProductCatalogDetail> {
  const res = await fetch(`${BASE_URL}/public/products/${id}`);
  if (!res.ok) throw new Error('상품 정보를 불러오지 못했습니다.');
  return res.json();
}

export function useOnSaleProducts() {
  return useQuery<ProductCatalogItem[]>({
    queryKey: ['products', 'catalog'],
    queryFn: fetchOnSaleProducts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOnSaleProduct(id: number) {
  return useQuery<ProductCatalogDetail>({
    queryKey: ['products', 'catalog', id],
    queryFn: () => fetchOnSaleProduct(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductEditData(productId: number) {
  return useQuery({
    queryKey: ["product-edit-data", productId],
    queryFn: async () => {
      if (!productId || isNaN(productId)) throw new Error("Invalid Product ID");
      const [productRes, coverages, riders] = await Promise.all([
        getProduct(productId),
        getCoverages(),
        getRiders(),
      ]);
      return {
        product: productRes.data ?? productRes,
        coverages,
        riders,
      };
    },
    enabled: !!productId && !isNaN(productId),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["product-edit-data", variables.id] });
    },
  });
}
