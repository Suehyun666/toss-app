export interface ProductCoverage {
  id: number;
  productId: number;
  coverageMasterId: number;
  coverageName: string;
  coverageType: string;
  basePremium: number;
  mandatory: boolean;
  sortOrder: number;
}

export interface ProductRider {
  id: number;
  productId: number;
  riderId: number;
  riderName: string;
  riderCode: string;
  description: string | null;
  isDefault: boolean;
  sortOrder: number;
}

export interface ProductAdjustment {
  id: number;
  productId: number;
  itemName: string;
  adjType: string;
  rate: number;
  conditionDesc: string;
  sortOrder: number;
}

/** 고객 화면 - 상품 목록 카드 (담보·특약·할인 제외) */
export interface ProductCatalogItem {
  id: number;
  productCode: string;
  productName: string;
  lineOfBusiness: string;
  lineOfBusinessDisplayName: string;
  targetCustomer: string;
  saleStartDate: string;
  saleEndDate: string | null;
  description: string;
}

/** 고객 화면 - 상품 상세 / 가입 화면 (담보·특약·할인 포함) */
export interface ProductCatalogDetail extends ProductCatalogItem {
  coverages: ProductCoverage[];
  riders: ProductRider[];
  adjustments: ProductAdjustment[];
}

/** @deprecated Use ProductCatalogItem or ProductCatalogDetail */
export type Product = ProductCatalogDetail;
