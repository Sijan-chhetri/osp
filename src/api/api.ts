export const API_BASE_URL = "http://localhost:3001/api";

export const API_ENDPOINTS = {
  SHOP_BRANDS: `${API_BASE_URL}/shop/brands`,
  BRAND_PRODUCTS: (brandId: string) => `${API_BASE_URL}/shop/brands/${brandId}/products`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_PROFILE: `${API_BASE_URL}/auth/profile`,
  CART: `${API_BASE_URL}/cart`,
  CART_ITEM: (itemId: string) => `${API_BASE_URL}/cart/${itemId}`,
  ORDER_FROM_CART: `${API_BASE_URL}/orders/from-cart`,
  ORDER_GUEST: `${API_BASE_URL}/orders/from-cart`,
  
  // Admin Order APIs
  ADMIN_ORDERS_ALL: `${API_BASE_URL}/orders/admin/all`,
  ADMIN_ORDER_DETAILS: (orderId: string) => `${API_BASE_URL}/orders/admin/details/${orderId}`,
  
  // Cartridge Management (Admin)
  CARTRIDGE_BRANDS: `${API_BASE_URL}/cartridge/brands`,
  CARTRIDGE_BRAND: (id: string) => `${API_BASE_URL}/cartridge/brands/${id}`,
  CARTRIDGE_CATEGORIES: `${API_BASE_URL}/cartridge/categories`,
  CARTRIDGE_CATEGORY: (id: string) => `${API_BASE_URL}/cartridge/categories/${id}`,
  CARTRIDGE_PRODUCTS: `${API_BASE_URL}/cartridge/products`,
  CARTRIDGE_PRODUCT: (id: string) => `${API_BASE_URL}/cartridge/products/${id}`,
  CARTRIDGE_PRODUCT_DETAIL: (id: string) => `${API_BASE_URL}/cartridge/products/${id}`,
  CARTRIDGE_QR_ALL: `${API_BASE_URL}/cartridge/products/qr`,
  CARTRIDGE_QR_BY_PRODUCT: (productId: string) => `${API_BASE_URL}/cartridge/products/qr/${productId}`,
  CARTRIDGE_QR_DEACTIVATE: (productId: string) => `${API_BASE_URL}/cartridge/products/qr/${productId}/deactivate`,
  CARTRIDGE_QR_REACTIVATE: (productId: string) => `${API_BASE_URL}/cartridge/products/qr/${productId}/reactivate`,
  CARTRIDGE_QR_DELETE: (productId: string) => `${API_BASE_URL}/cartridge/products/qr/${productId}`,
};
