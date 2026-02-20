
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import EgNavbar from "../../components/eg/egNavbar";
import EgFooter from "../../components/eg/egFooter";

import { API_ENDPOINTS } from "../../api/api";
import { getAuthToken } from "../../utils/auth";

interface CartridgeProduct {
    id: string;
    brand_id: string;
    category_id: string;
    product_name: string;
    model_number: string;
    description: string;
    unit_price: number;
    special_price: number | null;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
}

type GuestCartItem = {
    id: string;
    product_name: string;
    model_number: string;
    unit_price: number;
    special_price: number | null;
    quantity: number;
};

type CartridgeBrand = { id: string; name: string; is_active: boolean };
type CartridgeCategory = { id: string; name: string; is_active: boolean };

/* =========================
    Product Card
========================= */
    const ProductCard: React.FC<{
      product: CartridgeProduct;
      onCartUpdate: () => void;
      brandName?: string;
      categoryName?: string;
    }> = ({ product, onCartUpdate, brandName, categoryName }) => {
      const navigate = useNavigate();
      const displayPrice = product.special_price ?? product.unit_price;

      const hasDiscount =
        product.special_price !== null &&
        product.special_price < product.unit_price;

      const handleViewDetails = () => {
        navigate(`/eg/cartridge/${product.id}`);
      };

      const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        const token = getAuthToken();

        if (token) {
          try {
            const response = await fetch(API_ENDPOINTS.CARTRIDGE_CART_ADD, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                cartridge_product_id: product.id,
                quantity: 1,
              }),
            });

            const data = await response.json();

            if (response.ok) {
              toast.success(`${product.product_name} added to cart!`);
              onCartUpdate();
            } else {
              toast.error(data.message || "Failed to add to cart");
            }
          } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Error adding to cart");
          }
        } else {
          const existingCart = localStorage.getItem("cartridgeCart");
          const cart: GuestCartItem[] = existingCart
            ? JSON.parse(existingCart)
            : [];

          const existingItemIndex = cart.findIndex(
            (item) => item.id === product.id,
          );

          if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
            toast.success(`Increased quantity of ${product.product_name}`);
          } else {
            cart.push({
              id: product.id,
              product_name: product.product_name,
              model_number: product.model_number,
              unit_price: product.unit_price,
              special_price: product.special_price,
              quantity: 1,
            });
            toast.success(`${product.product_name} added to cart!`);
          }

          localStorage.setItem("cartridgeCart", JSON.stringify(cart));
          onCartUpdate();
        }
      };

      return (
        <div className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col items-center hover:shadow-xl transition-all duration-300">
          {/* Product Image with Badge */}
          <div
            className="relative w-full flex items-center justify-center mb-6 h-48 cursor-pointer"
            onClick={handleViewDetails}
          >
            {hasDiscount && (
              <div className="absolute top-0 right-0 bg-[#dc2626] text-white px-4 py-2 rounded-lg font-bold text-sm transform rotate-12">
                SAVE Rs.{" "}
                {product.unit_price - (product.special_price as number)}
              </div>
            )}
            <img
              src="/cartridge.png"
              alt={product.product_name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Product Name */}
          <h3
            className="text-[#1e3a8a] font-bold text-xl mb-1 text-center min-h-[60px] flex items-center cursor-pointer hover:text-[#1e40af]"
            onClick={handleViewDetails}
          >
            {product.product_name}
          </h3>

          {/* Model Number */}
          <p className="text-gray-500 text-sm mb-2">
            Model: {product.model_number}
          </p>

          {/* Brand + Category */}
          {/* Brand + Category */}
          {(brandName || categoryName) && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              {brandName && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1e3a8a]/10 text-[#1e3a8a] border border-[#1e3a8a]/20">
                  {brandName}
                </span>
              )}

              {categoryName && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  {categoryName}
                </span>
              )}
            </div>
          )}

          {/* Price and Buttons */}
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Price</p>
                <div className="flex items-center gap-2">
                <p
                    className={`font-bold text-xl ${
                    hasDiscount ? "text-[#dc2626]" : "text-[#1e3a8a]"
                    }`}
                >
                    Rs. {displayPrice}
                </p>

                {hasDiscount && (
                    <p className="text-gray-400 text-sm line-through">
                    Rs. {product.unit_price}
                    </p>
                )}
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4 w-full">
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 border-2 border-[#1e3a8a] text-[#1e3a8a] rounded-xl font-semibold text-sm tracking-wide hover:bg-[#1e3a8a] hover:text-white transition-all duration-300"
              >
                Add to Cart
              </button>

              <button
                onClick={handleViewDetails}
                className="flex-1 h-12 bg-[#1e3a8a] text-white rounded-xl font-semibold text-sm tracking-wide shadow-md hover:bg-[#1e40af] hover:shadow-lg transition-all duration-300"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      );
    };

/* =========================
   Helpers
========================= */
const getEffectivePrice = (p: CartridgeProduct) =>
  p.special_price ?? p.unit_price;


/* =========================
   Cartridge Shop Page
========================= */
const CartridgeShop: React.FC = () => {
  const [products, setProducts] = useState<CartridgeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);

  const [brands, setBrands] = useState<CartridgeBrand[]>([]);
  const [categories, setCategories] = useState<CartridgeCategory[]>([]);
const [showFilters, setShowFilters] = useState(false);
const [closing, setClosing] = useState(false);

const PAGE_SIZE = 9;
const [page, setPage] = useState(1);


const closeFilters = () => {
setClosing(true);
setTimeout(() => {
    setShowFilters(false);
    setClosing(false);
}, 300);
};


  const brandMap = useMemo(() => {
    const map = new Map<string, string>();
    brands.forEach((b) => map.set(b.id, b.name));
    return map;
  }, [brands]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);


  useEffect(() => {
    fetchProducts();
  }, []);

    const handleCartUpdate = () => {
        window.dispatchEvent(new Event("cartUpdated"));
    };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsRes, brandsRes, categoriesRes] = await Promise.all([
        fetch(API_ENDPOINTS.CARTRIDGE_PRODUCTS),
        fetch(API_ENDPOINTS.CARTRIDGE_BRANDS),
        fetch(API_ENDPOINTS.CARTRIDGE_CATEGORIES),
      ]);

      const productsData = await productsRes.json();
      const brandsData = await brandsRes.json();
      const categoriesData = await categoriesRes.json();

      if (!productsRes.ok) {
        setError(productsData?.message || "Failed to load products");
        return;
      }

      // ✅ products
      const all = (productsData.products ||
        productsData.data ||
        productsData ||
        []) as CartridgeProduct[];
      const active = all.filter((p) => p.is_active);
      setProducts(active);

      // ✅ brands (backend: { brands })
      const b = (brandsData.brands ||
        brandsData.data ||
        brandsData ||
        []) as CartridgeBrand[];
      setBrands(b.filter((x) => x.is_active));

      // ✅ categories (your backend might return {categories} OR array)
      const c = (categoriesData.categories ||
        categoriesData.data ||
        categoriesData ||
        []) as CartridgeCategory[];
      setCategories(c.filter((x) => x.is_active));

      // price range init
      if (active.length > 0) {
        const prices = active.map(getEffectivePrice);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinPrice(min);
        setMaxPrice(max);
        setPriceRange([min, max]);
      } else {
        setMinPrice(0);
        setMaxPrice(0);
        setPriceRange([0, 0]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  };


  const brandOptions = useMemo(() => {
    const usedIds = new Set(products.map((p) => p.brand_id));
    return brands.filter((b) => usedIds.has(b.id));
  }, [products, brands]);

  const categoryOptions = useMemo(() => {
    const usedIds = new Set(products.map((p) => p.category_id));
    return categories.filter((c) => usedIds.has(c.id));
  }, [products, categories]);


    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase();
        const [minR, maxR] = priceRange;

        return products.filter((p) => {
        const price = getEffectivePrice(p);

        const matchesSearch =
            q.length === 0 ||
            p.product_name.toLowerCase().includes(q) ||
            p.model_number.toLowerCase().includes(q) ||
            (p.description || "").toLowerCase().includes(q);

        const matchesBrand =
            selectedBrands.length === 0 || selectedBrands.includes(p.brand_id);
        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(p.category_id);

        const matchesDiscount =
            !onlyDiscounted ||
            (p.special_price !== null && p.special_price < p.unit_price);

        const matchesPrice = price >= minR && price <= maxR;

        return (
            matchesSearch &&
            matchesBrand &&
            matchesCategory &&
            matchesDiscount &&
            matchesPrice
        );
        });
    }, [
        products,
        search,
        selectedBrands,
        selectedCategories,
        onlyDiscounted,
        priceRange,
    ]);

    const totalPages = Math.max(
      1,
      Math.ceil(filteredProducts.length / PAGE_SIZE),
    );

    const paginatedProducts = useMemo(() => {
      const start = (page - 1) * PAGE_SIZE;
      return filteredProducts.slice(start, start + PAGE_SIZE);
    }, [filteredProducts, page]);

    useEffect(() => {
      if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);


  const clearFilters = () => {
    setSearch("");
    setSelectedBrands([]);
    setSelectedCategories([]);
    setOnlyDiscounted(false);
    setPriceRange([minPrice, maxPrice]);
  };

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];


  const FiltersPanel = (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#1e3a8a]">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm font-semibold text-gray-500 hover:text-[#1e3a8a] transition"
        >
          Clear
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Price range</p>

        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Min</label>
              <input
                type="number"
                min={minPrice}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => {
                  const v = Number(e.target.value || 0);
                  setPriceRange([Math.min(v, priceRange[1]), priceRange[1]]);
                }}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Max</label>
              <input
                type="number"
                min={priceRange[0]}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => {
                  const v = Number(e.target.value || 0);
                  setPriceRange([priceRange[0], Math.max(v, priceRange[0])]);
                }}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
              />
            </div>
          </div>

          <div className="pt-2">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPriceRange([Math.min(v, priceRange[1]), priceRange[1]]);
              }}
              className="w-full"
            />
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => {
                const v = Number(e.target.value);
                setPriceRange([priceRange[0], Math.max(v, priceRange[0])]);
              }}
              className="w-full"
            />

            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <span>Rs. {minPrice}</span>
              <span>Rs. {maxPrice}</span>
            </div>
          </div>

          <div className="text-sm text-gray-700">
            Showing:{" "}
            <span className="font-semibold">
              Rs. {priceRange[0]} – Rs. {priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Discount */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyDiscounted}
            onChange={(e) => setOnlyDiscounted(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm font-semibold text-gray-700">
            Only discounted
          </span>
        </label>
      </div>

      {/* Brand */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Brand</p>
        {brandOptions.length === 0 ? (
          <p className="text-sm text-gray-500">No brand data</p>
        ) : (
          <div className="max-h-56 overflow-auto pr-1 space-y-2">
            {brandOptions.map((b) => (
              <label
                key={b.id}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b.id)}
                  onChange={() =>
                    setSelectedBrands((prev) => toggleInList(prev, b.id))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{b.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Category</p>
        {categoryOptions.length === 0 ? (
          <p className="text-sm text-gray-500">No category data</p>
        ) : (
          <div className="max-h-56 overflow-auto pr-1 space-y-2">
            {categoryOptions.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c.id)}
                  onChange={() =>
                    setSelectedCategories((prev) => toggleInList(prev, c.id))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{c.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

    return (
      <div className="min-h-screen flex flex-col bg-white">
        {/* NAVBAR */}
        <EgNavbar />

        {/* Page Content */}
        <main className="flex-1 pt-32">
          <section className="relative w-full bg-white py-6 px-6 md:px-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                CARTRIDGE <span className="text-[#dc2626]">SHOP</span>
              </h1>
              <p className="text-gray-500 text-base md:text-lg">
                Search, filter, and find the right ink/toner for your printer.
              </p>
            </div>

            {/* Layout */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Filters */}
              {/* Desktop Sidebar (ONLY on lg+) */}
              <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky top-6">{FiltersPanel}</div>
              </aside>

              {/* Right Products */}
              <main className="lg:col-span-9">
                {/* ✅ Mobile Filter Button (ONLY on mobile/tablet) */}
                <div className="flex items-center justify-between lg:hidden mb-4">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="px-5 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Filters
                  </button>

                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-[#1e3a8a]">
                      {filteredProducts.length}
                    </span>{" "}
                    items
                  </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-700">
                        Search products
                      </label>
                      <div className="mt-2 relative">
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search by name, model, or description..."
                          className="w-full rounded-full border border-gray-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20"
                        />
                        {search.trim().length > 0 && (
                          <button
                            onClick={() => setSearch("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            aria-label="Clear search"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold text-[#1e3a8a]">
                          {filteredProducts.length}
                        </span>{" "}
                        items
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loading */}
                {loading && (
                  <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]" />
                    <p className="text-gray-600 mt-4">Loading products...</p>
                  </div>
                )}

                {/* Error */}
                {error && !loading && (
                  <div className="text-center py-16">
                    <p className="text-red-600 text-lg">{error}</p>
                  </div>
                )}

                {/* Grid */}
                {!loading && !error && (
                  <>
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-16">
                        <p className="text-gray-600 text-lg">
                          No products match your filters.
                        </p>
                        <button
                          onClick={clearFilters}
                          className="mt-4 bg-[#1e3a8a] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1e40af] transition"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {paginatedProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onCartUpdate={handleCartUpdate}
                            brandName={brandMap.get(product.brand_id)}
                            categoryName={categoryMap.get(product.category_id)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {filteredProducts.length > PAGE_SIZE && (
                  <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1;
                      const active = p === page;
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`h-10 w-10 rounded-lg text-sm font-bold border transition ${
                            active
                              ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}

                <div className="h-10" />
              </main>
            </div>
          </section>
        </main>

        {/* ✅ Mobile Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-[999] lg:hidden">
            {/* Backdrop */}
            <div
              className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                closing ? "opacity-0" : "opacity-100"
              }`}
              onClick={closeFilters}
            />

            {/* Drawer */}
            <div
              className={`absolute left-0 top-0 h-full w-[90%] max-w-sm bg-white shadow-2xl p-5 overflow-y-auto
        border-r border-gray-200 transition-transform duration-300 ease-out
        ${closing ? "-translate-x-full" : "translate-x-0"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1e3a8a]">Filters</h2>
                <button
                  onClick={closeFilters}
                  className="text-gray-500 hover:text-gray-900 text-xl"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {FiltersPanel}

              <button
                onClick={closeFilters}
                className="mt-5 w-full bg-[#1e3a8a] text-white py-3 rounded-xl font-semibold hover:bg-[#1e40af] transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <EgFooter />
      </div>
    );
};

export default CartridgeShop;
