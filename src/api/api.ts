export const API_BASE_URL = "http://localhost:3001/api";

export const API_ENDPOINTS = {
  SHOP_BRANDS: `${API_BASE_URL}/shop/brands`,
  BRAND_PRODUCTS: (brandId: string) => `${API_BASE_URL}/shop/brands/${brandId}/products`,
};
