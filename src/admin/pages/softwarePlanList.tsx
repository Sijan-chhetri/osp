// src/admin/pages/SoftwarePlanList.tsx
import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { API } from "../../config/api.ts";
import { useNavigate } from "react-router-dom";

/* ================= TYPES ================= */

export type SoftwarePlanRow = {
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

type ApiErrorResponse = { message?: string };

/* GET /plans/:id could return the same shape */
type PlanDetail = SoftwarePlanRow;

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return "Something went wrong";
};

/* ================= COMPONENT ================= */

const SoftwarePlanList: FC = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState<SoftwarePlanRow[]>([]);
  const [products, setProducts] = useState<SoftwareProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [editingPlan, setEditingPlan] = useState<SoftwarePlanRow | null>(null);

  const [editProductId, setEditProductId] = useState("");
  const [editPlanName, setEditPlanName] = useState("");
  const [editDurationType, setEditDurationType] =
    useState<SoftwarePlanRow["duration_type"]>("monthly");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editSpecialPrice, setEditSpecialPrice] = useState<string>("");
  const [editFeatures, setEditFeatures] = useState<string>("");
  const [editActivationKey, setEditActivationKey] = useState<string>("");
  const [editStartDate, setEditStartDate] = useState<string>("");
  const [editExpiryDate, setEditExpiryDate] = useState<string>("");
  const [editActive, setEditActive] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<SoftwarePlanRow | null>(
    null,
  );

  // ✅ View modal state
  const [viewingPlanId, setViewingPlanId] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewPlan, setViewPlan] = useState<PlanDetail | null>(null);

  /* -------- Fetch Plans + Products -------- */

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [plansRes, productsRes] = await Promise.all([
          fetch(API.PLANS),
          fetch(API.PRODUCTS),
        ]);

        if (!plansRes.ok) throw new Error("Failed to fetch plans");
        if (!productsRes.ok) throw new Error("Failed to fetch products");

        const planData = (await plansRes.json()) as SoftwarePlanRow[];
        const productData = (await productsRes.json()) as SoftwareProductRow[];

        setPlans(planData);
        setProducts(productData);
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const productNameById = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [products]);

  /* -------- View Plan (GET /:id) -------- */

  const handleView = async (id: string) => {
    setViewingPlanId(id);
    setViewPlan(null);
    setViewLoading(true);

    try {
      const res = await fetch(`${API.PLANS}/${id}`);
      const data = (await res.json()) as PlanDetail | ApiErrorResponse;

      if (!res.ok) {
        const msg =
          typeof data === "object" && data && "message" in data
            ? data.message
            : undefined;
        throw new Error(msg || "Failed to fetch plan details");
      }

      setViewPlan(data as PlanDetail);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
      setViewingPlanId(null);
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    setViewingPlanId(null);
    setViewPlan(null);
    setViewLoading(false);
  };

  /* -------- Filter Logic -------- */

  const filteredPlans = useMemo(() => {
    return plans.filter((pl) => {
      const matchSearch = pl.plan_name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        status === "all"
          ? true
          : status === "active"
            ? pl.is_active
            : !pl.is_active;

      return matchSearch && matchStatus;
    });
  }, [plans, search, status]);

  useEffect(() => setCurrentPage(1), [search, status]);

  const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredPlans.slice(start, end);
  }, [filteredPlans, currentPage]);

  /* -------- Delete -------- */

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const res = await fetch(`${API.PLANS}/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await res.json()) as ApiErrorResponse;

      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast.success(data.message || "Plan deleted successfully");
      setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  /* -------- Update -------- */

  const handleUpdate = async () => {
    if (!editingPlan) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const parsedPrice = Number(editPrice);
      const parsedSpecial =
        editSpecialPrice.trim() === "" ? null : Number(editSpecialPrice);

      if (!editProductId) return toast.error("Software product is required");
      if (!editPlanName.trim()) return toast.error("Plan name is required");

      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return toast.error("Price must be a valid number");
      }

      if (
        parsedSpecial !== null &&
        (!Number.isFinite(parsedSpecial) || parsedSpecial < 0)
      ) {
        return toast.error("Special price must be a valid number");
      }
      
      // Validate special price is not greater than regular price
      if (parsedSpecial !== null && parsedSpecial > parsedPrice) {
        return toast.error("Special price must be less than or equal to regular price");
      }
      
      // Validate dates
      if (editStartDate && editExpiryDate) {
        const start = new Date(editStartDate);
        const expiry = new Date(editExpiryDate);
        if (expiry <= start) {
          return toast.error("Expiry date must be after start date");
        }
      }

      const payload = {
        software_product_id: editProductId,
        plan_name: editPlanName.trim(),
        duration_type: editDurationType,
        price: parsedPrice,
        special_price: parsedSpecial,
        features: editFeatures.trim() ? editFeatures.trim() : null,
        activation_key: editActivationKey.trim() ? editActivationKey.trim() : null,
        start_date: editStartDate ? editStartDate : null,
        expiry_date: editExpiryDate ? editExpiryDate : null,
        is_active: editActive,
      };

      const res = await fetch(`${API.PLANS}/${editingPlan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as ApiErrorResponse & {
        data?: SoftwarePlanRow;
      };

      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success(data.message || "Plan updated successfully");

      const updatedRow: SoftwarePlanRow =
        data.data ??
        ({
          ...editingPlan,
          software_product_id: payload.software_product_id,
          plan_name: payload.plan_name,
          duration_type: payload.duration_type,
          price: payload.price,
          special_price: payload.special_price,
          features: payload.features,
          is_active: payload.is_active,
        } as SoftwarePlanRow);

      setPlans((prev) =>
        prev.map((p) => (p.id === editingPlan.id ? updatedRow : p)),
      );

      setEditingPlan(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAdd = () => {
    navigate("/admin/plans/softwarePlanCreate"); // change if your route differs
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#6E4294]">
            Software Plans
          </h1>
          <p className="text-sm text-[#482072]">
            Manage plans for software products.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
            bg-[#6E4294] text-white text-sm font-medium
            hover:bg-[#6E4294]/90 active:scale-95 transition"
        >
          + Add Plan
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
          />
        </div>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "all" | "active" | "inactive")
          }
          className="w-full md:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-slate-50 text-brown">
            <tr>
              <th className="px-5 py-3 text-left">Plan Name</th>
              <th className="px-5 py-3 text-left">Product</th>
              <th className="px-5 py-3 text-left">Duration</th>
              <th className="px-5 py-3 text-left">Price</th>
              <th className="px-5 py-3 text-left">Special</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Created</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-5 py-6 text-center">
                  Loading plans...
                </td>
              </tr>
            )}

            {!loading && filteredPlans.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-6 text-center text-brownSoft"
                >
                  No plans found.
                </td>
              </tr>
            )}

            {paginatedPlans.map((pl) => (
              <tr
                key={pl.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="px-5 py-4 font-medium text-brown">
                  {pl.plan_name}
                </td>

                <td className="px-5 py-4 text-brownSoft">
                  {productNameById.get(pl.software_product_id) || "—"}
                </td>

                <td className="px-5 py-4 text-brownSoft">{pl.duration_type}</td>

                <td className="px-5 py-4 text-brownSoft">
                  {pl.price.toLocaleString()}
                </td>

                <td className="px-5 py-4 text-brownSoft">
                  {pl.special_price === null
                    ? "—"
                    : pl.special_price.toLocaleString()}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge active={pl.is_active} />
                </td>

                <td className="px-5 py-4 text-brownSoft">
                  {new Date(pl.created_at).toLocaleDateString()}
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* VIEW */}
                    <button
                      onClick={() => handleView(pl.id)}
                      className="p-2 rounded-lg text-brownSoft hover:text-slate-900 hover:bg-slate-100 transition"
                      title="View"
                      aria-label="View plan"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setEditingPlan(pl);
                        setEditProductId(pl.software_product_id);
                        setEditPlanName(pl.plan_name);
                        setEditDurationType(pl.duration_type);
                        setEditPrice(String(pl.price));
                        setEditSpecialPrice(
                          pl.special_price === null
                            ? ""
                            : String(pl.special_price),
                        );
                        setEditFeatures(pl.features || "");
                        setEditActivationKey(pl.activation_key || "");
                        setEditStartDate(pl.start_date || "");
                        setEditExpiryDate(pl.expiry_date || "");
                        setEditActive(pl.is_active);
                      }}
                      className="p-2 rounded-lg text-brownSoft hover:text-[#6E4294] hover:bg-[#6E4294]/10 transition"
                      title="Edit"
                      aria-label="Edit plan"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setDeleteTarget(pl)}
                      className="p-2 rounded-lg text-brownSoft hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete"
                      aria-label="Delete plan"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brownSoft">
          {filteredPlans.length === 0
            ? "Showing 0 plans"
            : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredPlans.length,
              )} of ${filteredPlans.length} plans`}
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm
              hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm
              hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewingPlanId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeViewModal}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-xl p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-brown">
                  Plan Details
                </h2>
                <p className="text-xs text-brownSoft">
                  Full information for this plan.
                </p>
              </div>

              <button
                onClick={closeViewModal}
                className="px-3 py-1.5 border rounded-lg text-sm hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {viewLoading && (
              <p className="text-sm text-brownSoft">Loading plan details...</p>
            )}

            {!viewLoading && viewPlan && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Detail label="Plan Name" value={viewPlan.plan_name} />
                  <Detail
                    label="Software Product"
                    value={
                      productNameById.get(viewPlan.software_product_id) ||
                      viewPlan.software_product_id
                    }
                  />
                  <Detail
                    label="Duration Type"
                    value={viewPlan.duration_type}
                  />
                  <Detail
                    label="Active"
                    value={viewPlan.is_active ? "Yes" : "No"}
                  />
                  <Detail
                    label="Price"
                    value={viewPlan.price.toLocaleString()}
                  />
                  <Detail
                    label="Special Price"
                    value={
                      viewPlan.special_price === null
                        ? "—"
                        : viewPlan.special_price.toLocaleString()
                    }
                  />
                  <Detail
                    label="Created At"
                    value={new Date(viewPlan.created_at).toLocaleString()}
                  />
                  <Detail
                    label="Updated At"
                    value={new Date(viewPlan.updated_at).toLocaleString()}
                  />
                  <Detail
                    label="Activation Key"
                    value={viewPlan.activation_key || "—"}
                  />
                  <Detail
                    label="Start Date"
                    value={viewPlan.start_date ? new Date(viewPlan.start_date).toLocaleDateString() : "—"}
                  />
                  <Detail
                    label="Expiry Date"
                    value={viewPlan.expiry_date ? new Date(viewPlan.expiry_date).toLocaleDateString() : "—"}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-brown mb-1">
                    Features
                  </p>
                  <div className="border rounded-lg p-3 text-sm text-brownSoft whitespace-pre-wrap">
                    {viewPlan.features ? viewPlan.features : "—"}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      // quick jump to edit from view
                      setEditingPlan(viewPlan);
                      setEditProductId(viewPlan.software_product_id);
                      setEditPlanName(viewPlan.plan_name);
                      setEditDurationType(viewPlan.duration_type);
                      setEditPrice(String(viewPlan.price));
                      setEditSpecialPrice(
                        viewPlan.special_price === null
                          ? ""
                          : String(viewPlan.special_price),
                      );
                      setEditFeatures(viewPlan.features || "");
                      setEditActivationKey(viewPlan.activation_key || "");
                      setEditStartDate(viewPlan.start_date || "");
                      setEditExpiryDate(viewPlan.expiry_date || "");
                      setEditActive(viewPlan.is_active);
                      closeViewModal();
                    }}
                    className="px-4 py-2 rounded-lg bg-[#6E4294] text-white text-sm hover:bg-[#6E4294]/90"
                  >
                    Edit Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setEditingPlan(null)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-brown">Edit Plan</h2>

            <div className="space-y-3">
              <select
                value={editProductId}
                onChange={(e) => setEditProductId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                value={editPlanName}
                onChange={(e) => setEditPlanName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Plan name"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={editDurationType}
                  onChange={(e) =>
                    setEditDurationType(
                      e.target.value as SoftwarePlanRow["duration_type"],
                    )
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>

                <input
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Price"
                />

                <input
                  value={editSpecialPrice}
                  onChange={(e) => setEditSpecialPrice(e.target.value)}
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Special price"
                />
              </div>

              <textarea
                value={editFeatures}
                onChange={(e) => setEditFeatures(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
                placeholder="Features (optional)"
              />

              <input
                value={editActivationKey}
                onChange={(e) => setEditActivationKey(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Activation Key (optional)"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-brownSoft mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs text-brownSoft mb-1 block">Expiry Date</label>
                  <input
                    type="date"
                    value={editExpiryDate}
                    onChange={(e) => setEditExpiryDate(e.target.value)}
                    min={editStartDate || undefined}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {editStartDate && editExpiryDate && new Date(editExpiryDate) <= new Date(editStartDate) && (
                    <p className="text-xs text-red-600 mt-1">Expiry date must be after start date</p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editActive}
                  onChange={() => setEditActive((v) => !v)}
                />
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-[#6E4294] text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-brown">Delete Plan</h2>

            <p className="text-sm text-brownSoft">
              Are you sure you want to delete
              <span className="font-medium text-brown">
                {" "}
                {deleteTarget.plan_name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftwarePlanList;

/* ================= SMALL COMPONENTS ================= */

const StatusBadge: FC<{ active: boolean }> = ({ active }) => (
    <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
        }`}
    >
        {active ? "Active" : "Inactive"}
    </span>
);

const Detail: FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="border border-slate-200 rounded-lg p-3">
        <p className="text-xs text-brownSoft">{label}</p>
        <p className="text-sm font-medium text-brown break-words">{value}</p>
    </div>
);
