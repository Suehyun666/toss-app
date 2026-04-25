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

export const LOB_OPTIONS = [
    { value: "PERSONAL_AUTO",   label: "개인용자동차보험" },
    { value: "COMMERCIAL_AUTO", label: "업무용자동차보험" },
    { value: "BUSINESS_AUTO",   label: "영업용자동차보험" },
    { value: "MOTORCYCLE",      label: "이륜자동차보험" },
    { value: "AGRICULTURAL",    label: "농기계보험" },
] as const;

export const STATUS_OPTIONS = [
    { value: "DESIGNING",      label: "설계 중" },
    { value: "KIDI_SUBMITTED", label: "보험개발원 제출" },
    { value: "KIDI_CONFIRMED", label: "요율확인서 수령" },
    { value: "FSS_APPLIED",    label: "금감원 인가신청" },
    { value: "FSS_APPROVED",   label: "금감원 인가완료" },
    { value: "FILING",         label: "판매신고 중" },
    { value: "FILED",          label: "판매 확정" },
    { value: "ON_SALE",        label: "판매 중" },
    { value: "DISCONTINUED",   label: "판매 중단" },
] as const;
