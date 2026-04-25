import { useQuery } from '@tanstack/react-query';
import type { ProductCatalogItem, ProductCatalogDetail } from '@/types/product';

const BASE_URL = process.env.NEXT_PUBLIC_JAVA_SERVER_URL;

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
