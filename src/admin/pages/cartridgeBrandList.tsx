import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../api/api";
import { useNavigate } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  thumbnail_url?: string;
  original_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CartridgeBrandList: FC = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.CARTRIDGE_BRANDS, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setBrands(data.brands || data || []);
      } else {
        toast.error(data.message || "Failed to fetch brands");
      }
    } catch (err) {
      toast.error("Error loading brands");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = useMemo(() => {
    return brands.filter((b) => {
      const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        status === "all" ? true : status === "active" ? b.is_active : !b.is_active;
      return matchSearch && matchStatus;
    });
  }, [brands, search, status]);

  useEffect(() => setCurrentPage(1), [search, status]);

  const totalPages = Math.ceil(filteredBrands.length / ITEMS_PER_PAGE);
  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBrands.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredBrands, currentPage]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.CARTRIDGE_BRAND(deleteTarget.id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Brand deleted successfully");
        setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete brand");
      }
    } catch (err) {
      toast.error("Error deleting brand");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#6E4294]">Cartridge Brands</h1>
          <p className="text-sm text-[#482072]">Manage and organize cartridge brands.</p>
        </div>
        <button
          onClick={() => navigate("/admin/cartridge/brands/create")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#6E4294] text-white text-sm font-medium hover:bg-[#6E4294]/90 active:scale-95 transition"
        >
          + Add Brand
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | "active" | "inactive")}
          className="w-full md:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-slate-50 text-brown">
            <tr>
              <th className="px-5 py-3 text-left">Image</th>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Created</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center">Loading brands...</td>
              </tr>
            )}
            {!loading && filteredBrands.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-brownSoft">No brands found.</td>
              </tr>
            )}
            {paginatedBrands.map((brand) => (
              <tr key={brand.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                <td className="px-5 py-4">
                  {brand.thumbnail_url ? (
                    <img
                      src={API_ENDPOINTS.CARTRIDGE_BRAND_IMAGE(brand.thumbnail_url)}
                      alt={brand.name}
                      className="w-16 h-16 object-contain border border-slate-200 rounded-lg p-1"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="10">No Image</text></svg>';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 border border-slate-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-400">No Image</span>
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 font-medium text-brown">{brand.name}</td>
                <td className="px-5 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    brand.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {brand.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-brownSoft">
                  {new Date(brand.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate(`/admin/cartridge/brands/edit/${brand.id}`)}
                      className="p-2 rounded-lg text-brownSoft hover:text-[#6E4294] hover:bg-[#6E4294]/10 transition"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(brand)}
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brownSoft">
          {filteredBrands.length === 0
            ? "Showing 0 brands"
            : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredBrands.length
              )} of ${filteredBrands.length} brands`}
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-brown">Delete Cartridge Brand</h2>
            <p className="text-sm text-brownSoft">
              Are you sure you want to delete <span className="font-medium text-brown">{deleteTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartridgeBrandList;
