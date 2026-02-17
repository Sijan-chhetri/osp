import { FC, useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { API } from "../../config/api.ts";


/* ================= TYPES ================= */

export type SoftwareCategoryRow = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/* ================= COMPONENT ================= */

const SoftwareCategories: FC = () => {
  const [categories, setCategories] = useState<SoftwareCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const [editingCategory, setEditingCategory] =
    useState<SoftwareCategoryRow | null>(null);

  const [editName, setEditName] = useState("");
  const [editActive, setEditActive] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<SoftwareCategoryRow | null>(
    null,
  );

  /* -------- Fetch Categories From API -------- */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("You are not authenticated.");
        }

        const res = await fetch(API.CATEGORIES, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: SoftwareCategoryRow[] = await res.json();

        setCategories(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* -------- Filter Logic -------- */

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch = cat.name.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        status === "all"
          ? true
          : status === "active"
            ? cat.is_active
            : !cat.is_active;

      return matchSearch && matchStatus;
    });
  }, [categories, search, status]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredCategories.slice(start, end);
  }, [filteredCategories, currentPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const res = await fetch(`${API.CATEGORIES}/${deleteTarget.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: { message?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      toast.success("Category deleted successfully");

      // remove from state
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));

      setDeleteTarget(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    }
  };


  const handleUpdate = async () => {
    if (!editingCategory) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const res = await fetch(`${API.CATEGORIES}/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          is_active: editActive,
        }),
      });

      const data: {
        message?: string;
        data?: SoftwareCategoryRow;
      } = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      toast.success(data.message || "Category updated successfully");

      // update state locally
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? data.data! : c)),
      );

      setEditingCategory(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    }
  };


  const handleAdd = () => {
    // static-only (keeps same button)
    toast("Connect API to create new categories ✨");
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT */}
        <div>
          <h1 className="text-2xl font-semibold text-brown">
            Software Categories
          </h1>
          <p className="text-sm text-brownSoft">
            Manage and organize software categories.
          </p>
        </div>

        {/* RIGHT */}
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                bg-[#6E4294] text-white text-sm font-medium
                hover:bg-[#6E4294]/90 active:scale-95 transition"
        >
          + Add Category
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
          />
        </div>

        {/* Status Filter */}
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

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-slate-50 text-brown">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Created</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center">
                  Loading categories...
                </td>
              </tr>
            )}

            {!loading && filteredCategories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-6 text-center text-brownSoft"
                >
                  No categories found.
                </td>
              </tr>
            )}

            {paginatedCategories.map((cat) => (
              <tr
                key={cat.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="px-5 py-4 font-medium text-brown">{cat.name}</td>

                <td className="px-5 py-4">
                  <StatusBadge active={cat.is_active} />
                </td>

                <td className="px-5 py-4 text-brownSoft">
                  {new Date(cat.created_at).toLocaleDateString()}
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* EDIT */}
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setEditName(cat.name);
                        setEditActive(cat.is_active);
                      }}
                      className="p-2 rounded-lg text-brownSoft hover:text-[#6E4294] hover:bg-[#6E4294]/10 transition"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-2 rounded-lg text-brownSoft hover:text-red-600 hover:bg-red-50 transition"
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

      {/* ================= PAGINATION ================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brownSoft">
          {filteredCategories.length === 0
            ? "Showing 0 categories"
            : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredCategories.length,
              )} of ${filteredCategories.length} categories`}
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

      {/* ================= EDIT MODAL ================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setEditingCategory(null)}
          />

          {/* MODAL */}
          <div className="relative bg-white w-full max-w-lg rounded-xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-brown">
              Edit Software Category
            </h2>

            <div className="space-y-3">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Name"
              />

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
                onClick={() => setEditingCategory(null)}
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

      {/* ================= DELETE MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-brown">
              Delete Software Category
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
};;

export default SoftwareCategories;

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
