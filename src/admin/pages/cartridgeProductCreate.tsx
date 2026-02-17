import { useEffect, useState } from "react";
import type { FC } from "react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../api/api";
import { useNavigate } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  is_active: boolean;
}

const CartridgeProductCreate: FC = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [specialPrice, setSpecialPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        setLoadingMeta(true);
        const token = localStorage.getItem("token");

        const [brandRes, categoryRes] = await Promise.all([
          fetch(API_ENDPOINTS.CARTRIDGE_BRANDS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(API_ENDPOINTS.CARTRIDGE_CATEGORIES, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!brandRes.ok) throw new Error("Failed to fetch brands");
        if (!categoryRes.ok) throw new Error("Failed to fetch categories");

        const brandData = await brandRes.json();
        const categoryData = await categoryRes.json();

        const activeBrands = (brandData.brands || brandData || []).filter(
          (b: Brand) => b.is_active
        );
        const activeCategories = (categoryData.categories || categoryData || []).filter(
          (c: Category) => c.is_active
        );

        setBrands(activeBrands);
        setCategories(activeCategories);

        if (!brandId && activeBrands.length > 0) setBrandId(activeBrands[0].id);
        if (!categoryId && activeCategories.length > 0) setCategoryId(activeCategories[0].id);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoadingMeta(false);
      }
    };

    loadMeta();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const payload = {
        brand_id: brandId,
        category_id: categoryId,
        product_name: productName.trim(),
        model_number: modelNumber.trim(),
        description: description.trim() || null,
        unit_price: parseFloat(unitPrice),
        special_price: specialPrice ? parseFloat(specialPrice) : null,
        is_active: isActive,
      };

      if (!payload.product_name) {
        toast.error("Product name is required");
        return;
      }
      if (!payload.model_number) {
        toast.error("Model number is required");
        return;
      }
      if (!payload.brand_id) {
        toast.error("Brand is required");
        return;
      }
      if (!payload.category_id) {
        toast.error("Category is required");
        return;
      }
      if (!payload.unit_price || isNaN(payload.unit_price)) {
        toast.error("Valid unit price is required");
        return;
      }

      const response = await fetch(API_ENDPOINTS.CARTRIDGE_PRODUCTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product created successfully! QR code generated ✨");
        navigate("/admin/cartridge/products");
      } else {
        toast.error(data.message || "Failed to create product");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#6E4294]">
          Create Cartridge Product
        </h1>
        <p className="text-sm text-brownSoft">
          Add a new cartridge product with brand and category (QR code will be auto-generated).
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
      >
        {/* PRODUCT NAME */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">Product Name</label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            placeholder="e.g. HP 85A Toner Cartridge"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
          />
        </div>

        {/* MODEL NUMBER */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">Model Number</label>
          <input
            value={modelNumber}
            onChange={(e) => setModelNumber(e.target.value)}
            required
            placeholder="e.g. CE285A"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Black toner cartridge for HP LaserJet printers..."
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
          />
        </div>

        {/* BRAND + CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BRAND */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-brown">Brand</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              disabled={loadingMeta}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white disabled:opacity-60"
            >
              {loadingMeta && <option>Loading brands...</option>}
              {!loadingMeta && brands.length === 0 && (
                <option value="">No active brands found</option>
              )}
              {!loadingMeta &&
                brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </select>
          </div>

          {/* CATEGORY */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-brown">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingMeta}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white disabled:opacity-60"
            >
              {loadingMeta && <option>Loading categories...</option>}
              {!loadingMeta && categories.length === 0 && (
                <option value="">No active categories found</option>
              )}
              {!loadingMeta &&
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* UNIT PRICE + SPECIAL PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-brown">Unit Price (Rs.)</label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              placeholder="3500"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-brown">
              Special Price (Rs.) - Optional
            </label>
            <input
              type="number"
              value={specialPrice}
              onChange={(e) => setSpecialPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="3200"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
            />
          </div>
        </div>

        {/* ACTIVE */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brown">Active</p>
            <p className="text-xs text-brownSoft">
              Inactive products won't be shown to users
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsActive((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              isActive ? "bg-[#6E4294]" : "bg-slate-300"
            }`}
            aria-label="Toggle active"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || loadingMeta}
            className="px-6 py-2 rounded-lg bg-[#6E4294] text-white text-sm font-medium hover:bg-[#6E4294]/90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CartridgeProductCreate;
