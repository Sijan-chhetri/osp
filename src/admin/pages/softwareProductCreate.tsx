// src/admin/pages/SoftwareProductCreate.tsx
import { useEffect, useState } from "react";
import type { FC } from "react";
import toast from "react-hot-toast";
import { API } from "../../config/api.ts";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

export type SoftwareProduct = {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type SoftwareBrandRow = {
  id: string;
  name: string;
  is_active: boolean;
};

type SoftwareCategoryRow = {
  id: string;
  name: string;
  is_active: boolean;
};

type ApiErrorResponse = {
  message?: string;
};

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return "Something went wrong";
};

/* ================= COMPONENT ================= */

const SoftwareProductCreate: FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<SoftwareProduct["name"]>("");
  const [description, setDescription] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isActive, setIsActive] = useState<SoftwareProduct["is_active"]>(true);
  const [loading, setLoading] = useState(false);

  // dropdown data
  const [brands, setBrands] = useState<SoftwareBrandRow[]>([]);
  const [categories, setCategories] = useState<SoftwareCategoryRow[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  /* -------- Fetch Brands + Categories (for selects) -------- */
  useEffect(() => {
    const loadMeta = async () => {
      try {
        setLoadingMeta(true);

        const [brandRes, categoryRes] = await Promise.all([
          fetch(API.BRANDS),
          fetch(API.CATEGORIES),
        ]);

        if (!brandRes.ok) throw new Error("Failed to fetch brands");
        if (!categoryRes.ok) throw new Error("Failed to fetch categories");

        const brandData: any[] = await brandRes.json();
        const categoryData: any[] = await categoryRes.json();

        // keep only active (optional)
        const activeBrands = (brandData as SoftwareBrandRow[]).filter(
          (b) => b.is_active,
        );
        const activeCategories = (categoryData as SoftwareCategoryRow[]).filter(
          (c) => c.is_active,
        );

        setBrands(activeBrands);
        setCategories(activeCategories);

        // set defaults (optional)
        if (!brandId && activeBrands.length > 0) setBrandId(activeBrands[0].id);
        if (!categoryId && activeCategories.length > 0)
          setCategoryId(activeCategories[0].id);
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoadingMeta(false);
      }
    };

    loadMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- Submit -------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const payload = {
        name: name.trim(),
        description: description.trim() ? description.trim() : null,
        brand_id: brandId,
        category_id: categoryId,
        is_active: isActive,
      };

      if (!payload.name) {
        toast.error("Product name is required");
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

      const res = await fetch(API.PRODUCTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: ApiErrorResponse & { data?: SoftwareProduct } =
        await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      toast.success(data.message || "Product created successfully ✨");

      setName("");
      setDescription("");
      setIsActive(true);

      // change if your route is different
      navigate("/admin/products");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-[#6E4294]">
          Create Software Product
        </h1>
        <p className="text-sm text-brownSoft">
          Add a new software product with brand and category.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
      >
        {/* NAME */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">Product Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Microsoft Office 365"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
            placeholder="Short product description..."
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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

        {/* ACTIVE */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brown">Active</p>
            <p className="text-xs text-brownSoft">
              Inactive products won’t be shown to users
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

export default SoftwareProductCreate;
