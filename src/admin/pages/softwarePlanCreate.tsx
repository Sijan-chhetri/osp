// src/admin/pages/SoftwarePlanCreate.tsx
import { useEffect, useState } from "react";
import type { FC } from "react";
import toast from "react-hot-toast";
import { API } from "../../config/api.ts";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

export type SoftwarePlan = {
  id: string;
  software_product_id: string;
  plan_name: string;
  duration_type: "monthly" | "yearly";
  price: number;
  special_price: number | null;
  features: string | null;
  activation_key: string | null;
  start_date: string | null;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type SoftwareProductRow = {
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

const SoftwarePlanCreate: FC = () => {
  const navigate = useNavigate();

  const [softwareProductId, setSoftwareProductId] = useState<string>("");
  const [planName, setPlanName] = useState<string>("");
  const [durationType, setDurationType] =
    useState<SoftwarePlan["duration_type"]>("monthly");
  const [price, setPrice] = useState<string>("");
  const [specialPrice, setSpecialPrice] = useState<string>("");
  const [features, setFeatures] = useState<string>("");
  const [activationKey, setActivationKey] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [isActive, setIsActive] = useState<SoftwarePlan["is_active"]>(true);

  const [loading, setLoading] = useState(false);

  // dropdown data
  const [products, setProducts] = useState<SoftwareProductRow[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  /* -------- Fetch Products (for select) -------- */
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);

        const res = await fetch(API.PRODUCTS);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = (await res.json()) as SoftwareProductRow[];

        // optional: only active
        const activeProducts = data.filter((p) => p.is_active);

        setProducts(activeProducts);

        if (!softwareProductId && activeProducts.length > 0) {
          setSoftwareProductId(activeProducts[0].id);
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------- Submit -------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const parsedPrice = Number(price);
      const parsedSpecial =
        specialPrice.trim() === "" ? null : Number(specialPrice);

      if (!softwareProductId) {
        toast.error("Software product is required");
        return;
      }
      if (!planName.trim()) {
        toast.error("Plan name is required");
        return;
      }
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        toast.error("Price must be a valid number");
        return;
      }
      if (
        parsedSpecial !== null &&
        (!Number.isFinite(parsedSpecial) || parsedSpecial < 0)
      ) {
        toast.error("Special price must be a valid number");
        return;
      }
      
      // Validate special price is not greater than regular price
      if (parsedSpecial !== null && parsedSpecial > parsedPrice) {
        toast.error("Special price must be less than or equal to regular price");
        return;
      }
      
      // Validate dates
      if (startDate && expiryDate) {
        const start = new Date(startDate);
        const expiry = new Date(expiryDate);
        if (expiry <= start) {
          toast.error("Expiry date must be after start date");
          return;
        }
      }

      const payload = {
        software_product_id: softwareProductId,
        plan_name: planName.trim(),
        duration_type: durationType,
        price: parsedPrice,
        special_price: parsedSpecial,
        features: features.trim() ? features.trim() : null,
        activation_key: activationKey.trim() ? activationKey.trim() : null,
        start_date: startDate ? startDate : null,
        expiry_date: expiryDate ? expiryDate : null,
        is_active: isActive,
      };

      const res = await fetch(API.PLANS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: ApiErrorResponse & { data?: SoftwarePlan } = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create plan");
      }

      toast.success(data.message || "Plan created successfully ✨");

      // reset
      setPlanName("");
      setDurationType("monthly");
      setPrice("");
      setSpecialPrice("");
      setFeatures("");
      setActivationKey("");
      setStartDate("");
      setExpiryDate("");
      setIsActive(true);

      // change route if your list page route differs
      navigate("/admin/plans");
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
          Create Software Plan
        </h1>
        <p className="text-sm text-[#482072]">
          Add a plan for a specific software product.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
      >
        {/* PRODUCT */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">
            Software Product
          </label>
          <select
            value={softwareProductId}
            onChange={(e) => setSoftwareProductId(e.target.value)}
            disabled={loadingProducts}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white disabled:opacity-60"
          >
            {loadingProducts && <option>Loading products...</option>}
            {!loadingProducts && products.length === 0 && (
              <option value="">No active products found</option>
            )}
            {!loadingProducts &&
              products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>

        {/* PLAN NAME */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">Plan Name</label>
          <input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            required
            placeholder="e.g. Home & Student"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* DURATION + PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DURATION */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-brown">
              Duration Type
            </label>
            <select
              value={durationType}
              onChange={(e) =>
                setDurationType(e.target.value as SoftwarePlan["duration_type"])
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* PRICE */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-brown">Price</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              min={0}
              step="0.01"
              required
              placeholder="e.g. 2999"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* SPECIAL PRICE */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-brown">
              Special Price (optional)
            </label>
            <input
              value={specialPrice}
              onChange={(e) => setSpecialPrice(e.target.value)}
              type="number"
              min={0}
              step="0.01"
              placeholder="e.g. 2499"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* FEATURES */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">
            Features (optional)
          </label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="Write features here (you can use bullet points)..."
            rows={4}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* ACTIVATION KEY */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">
            Activation Key (optional)
          </label>
          <input
            value={activationKey}
            onChange={(e) => setActivationKey(e.target.value)}
            placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* START DATE + EXPIRY DATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-brown">
              Start Date (optional)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-brown">
              Expiry Date (optional)
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={startDate || undefined}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {startDate && expiryDate && new Date(expiryDate) <= new Date(startDate) && (
              <p className="text-xs text-red-600">Expiry date must be after start date</p>
            )}
          </div>
        </div>

        {/* ACTIVE */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brown">Active</p>
            <p className="text-xs text-brownSoft">
              Inactive plans won’t be shown to users
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
            disabled={loading || loadingProducts}
            className="px-6 py-2 rounded-lg bg-[#6E4294] text-white text-sm font-medium hover:bg-[#6E4294]/90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SoftwarePlanCreate;
