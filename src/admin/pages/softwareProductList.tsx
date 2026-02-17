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

export type SoftwareProductRow = {
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

type BrandRow = {
  id: string;
  name: string;
  is_active: boolean;
};

type CategoryRow = {
  id: string;
  name: string;
  is_active: boolean;
};

type ApiErrorResponse = { message?: string };

/** GET /products/:id returns product object (same shape) */
type ProductDetail = SoftwareProductRow;

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return "Something went wrong";
};

/* ================= COMPONENT ================= */

const SoftwareProducts: FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<SoftwareProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [editingProduct, setEditingProduct] =
    useState<SoftwareProductRow | null>(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBrandId, setEditBrandId] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editActive, setEditActive] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<SoftwareProductRow | null>(
    null,
  );

  // ✅ View modal state
  const [viewingProductId, setViewingProductId] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewProduct, setViewProduct] = useState<ProductDetail | null>(null);

  /* -------- Fetch Products + Brands + Categories -------- */

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          fetch(API.PRODUCTS),
          fetch(API.BRANDS),
          fetch(API.CATEGORIES),
        ]);

        if (!productsRes.ok) throw new Error("Failed to fetch products");
        if (!brandsRes.ok) throw new Error("Failed to fetch brands");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

        const productData = (await productsRes.json()) as SoftwareProductRow[];
        const brandData = (await brandsRes.json()) as BrandRow[];
        const categoryData = (await categoriesRes.json()) as CategoryRow[];

        setProducts(productData);
        setBrands(brandData);
        setCategories(categoryData);
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const brandNameById = useMemo(() => {
    const map = new Map<string, string>();
    brands.forEach((b) => map.set(b.id, b.name));
    return map;
  }, [brands]);

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  /* -------- View Product (GET /:id) -------- */

  const handleView = async (id: string) => {
    setViewingProductId(id);
    setViewProduct(null);
    setViewLoading(true);

    try {
      const res = await fetch(`${API.PRODUCTS}/${id}`);
      const data = (await res.json()) as ProductDetail | ApiErrorResponse;

      if (!res.ok) {
        const msg =
          typeof data === "object" && data && "message" in data
            ? data.message
            : undefined;
        throw new Error(msg || "Failed to fetch product details");
      }

      setViewProduct(data as ProductDetail);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
      setViewingProductId(null);
    } finally {
      setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    setViewingProductId(null);
    setViewProduct(null);
    setViewLoading(false);
  };

  /* -------- Filter Logic -------- */

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        status === "all"
          ? true
          : status === "active"
            ? p.is_active
            : !p.is_active;

      return matchSearch && matchStatus;
    });
  }, [products, search, status]);

  useEffect(() => setCurrentPage(1), [search, status]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  /* -------- Delete -------- */

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const res = await fetch(`${API.PRODUCTS}/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await res.json()) as ApiErrorResponse;

      if (!res.ok) throw new Error(data.message || "Delete failed");

      toast.success(data.message || "Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  /* -------- Update -------- */

  const handleUpdate = async () => {
    if (!editingProduct) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const payload = {
        name: editName.trim(),
        description: editDescription.trim() ? editDescription.trim() : null,
        brand_id: editBrandId,
        category_id: editCategoryId,
        is_active: editActive,
      };

      if (!payload.name) return toast.error("Product name is required");
      if (!payload.brand_id) return toast.error("Brand is required");
      if (!payload.category_id) return toast.error("Category is required");

      const res = await fetch(`${API.PRODUCTS}/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as ApiErrorResponse & {
        data?: SoftwareProductRow;
      };

      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success(data.message || "Product updated successfully");

      const updatedRow: SoftwareProductRow =
        data.data ??
        ({
          ...editingProduct,
          name: payload.name,
          description: payload.description,
          brand_id: payload.brand_id,
          category_id: payload.category_id,
          is_active: payload.is_active,
        } as SoftwareProductRow);

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedRow : p)),
      );

      setEditingProduct(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAdd = () => {
    navigate("/admin/products/softwareProductCreate");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#6E4294]">
            Software Products
          </h1>
          <p className="text-sm text-brownSoft">
            Manage and organize software products.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
            bg-[#6E4294] text-white text-sm font-medium
            hover:bg-[#6E4294]/90 active:scale-95 transition"
        >
          + Add Product
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search product..."
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
        <table className="min-w-[950px] w-full text-sm">
          <thead className="bg-slate-50 text-brown">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Brand</th>
              <th className="px-5 py-3 text-left">Category</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Created</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center">
                  Loading products...
                </td>
              </tr>
            )}

            {!loading && filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-center text-brownSoft"
                >
                  No products found.
                </td>
              </tr>
            )}

            {paginatedProducts.map((p) => (
              <tr
                key={p.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="px-5 py-4 font-medium text-brown">{p.name}</td>
                <td className="px-5 py-4 text-brownSoft">
                  {brandNameById.get(p.brand_id) || "—"}
                </td>
                <td className="px-5 py-4 text-brownSoft">
                  {categoryNameById.get(p.category_id) || "—"}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge active={p.is_active} />
                </td>
                <td className="px-5 py-4 text-brownSoft">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* ✅ VIEW */}
                    <button
                      onClick={() => handleView(p.id)}
                      className="p-2 rounded-lg text-brownSoft hover:text-slate-900 hover:bg-slate-100 transition"
                      title="View"
                      aria-label="View product"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setEditName(p.name);
                        setEditDescription(p.description || "");
                        setEditBrandId(p.brand_id);
                        setEditCategoryId(p.category_id);
                        setEditActive(p.is_active);
                      }}
                      className="p-2 rounded-lg text-brownSoft hover:text-[#6E4294] hover:bg-[#6E4294]/10 transition"
                      title="Edit"
                      aria-label="Edit product"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="p-2 rounded-lg text-brownSoft hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete"
                      aria-label="Delete product"
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
          {filteredProducts.length === 0
            ? "Showing 0 products"
            : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredProducts.length,
              )} of ${filteredProducts.length} products`}
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
      {viewingProductId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeViewModal}
          />

          <div className="relative bg-white w-full max-w-2xl rounded-xl p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-brown">
                  Product Details
                </h2>
                <p className="text-xs text-brownSoft">
                  Full information for this product.
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
              <p className="text-sm text-brownSoft">
                Loading product details...
              </p>
            )}

            {!viewLoading && viewProduct && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Detail label="Name" value={viewProduct.name} />
                  <Detail
                    label="Active"
                    value={viewProduct.is_active ? "Yes" : "No"}
                  />
                  <Detail
                    label="Brand"
                    value={
                      brandNameById.get(viewProduct.brand_id) ||
                      viewProduct.brand_id
                    }
                  />
                  <Detail
                    label="Category"
                    value={
                      categoryNameById.get(viewProduct.category_id) ||
                      viewProduct.category_id
                    }
                  />
                  <Detail label="Created By" value={viewProduct.created_by} />
                  <Detail
                    label="Created At"
                    value={new Date(viewProduct.created_at).toLocaleString()}
                  />
                  <Detail
                    label="Updated At"
                    value={new Date(viewProduct.updated_at).toLocaleString()}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-brown mb-1">
                    Description
                  </p>
                  <div className="border rounded-lg p-3 text-sm text-brownSoft whitespace-pre-wrap">
                    {viewProduct.description ? viewProduct.description : "—"}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setEditingProduct(viewProduct);
                      setEditName(viewProduct.name);
                      setEditDescription(viewProduct.description || "");
                      setEditBrandId(viewProduct.brand_id);
                      setEditCategoryId(viewProduct.category_id);
                      setEditActive(viewProduct.is_active);
                      closeViewModal();
                    }}
                    className="px-4 py-2 rounded-lg bg-[#6E4294] text-white text-sm hover:bg-[#6E4294]/90"
                  >
                    Edit Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setEditingProduct(null)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-brown">
              Edit Software Product
            </h2>

            <div className="space-y-3">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Product name"
              />

              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                rows={4}
                placeholder="Description (optional)"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  value={editBrandId}
                  onChange={(e) => setEditBrandId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
                onClick={() => setEditingProduct(null)}
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
            <h2 className="text-lg font-semibold text-brown">
              Delete Software Product
            </h2>

            <p className="text-sm text-brownSoft">
              Are you sure you want to delete
              <span className="font-medium text-brown">
                {" "}
                {deleteTarget.name}
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

export default SoftwareProducts;

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
