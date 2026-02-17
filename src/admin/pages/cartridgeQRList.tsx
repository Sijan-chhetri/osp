import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../api/api";

interface QRCode {
  id: string;
  cartridge_product_id: string;
  qr_value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CartridgeQRList: FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.CARTRIDGE_QR_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setQrCodes(Array.isArray(data) ? data : []);
      } else {
        toast.error(data.message || "Failed to fetch QR codes");
      }
    } catch (err) {
      toast.error("Error loading QR codes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQRCodes = useMemo(() => {
    return qrCodes.filter((qr) => {
      const matchSearch = qr.qr_value.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        status === "all" ? true : status === "active" ? qr.is_active : !qr.is_active;
      return matchSearch && matchStatus;
    });
  }, [qrCodes, search, status]);

  useEffect(() => setCurrentPage(1), [search, status]);

  const totalPages = Math.ceil(filteredQRCodes.length / ITEMS_PER_PAGE);
  const paginatedQRCodes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredQRCodes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQRCodes, currentPage]);

  const handleAction = async (productId: string, action: "deactivate" | "reactivate" | "delete") => {
    if (action === "delete" && !window.confirm("Are you sure you want to delete this QR code?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      let method = "POST";

      if (action === "deactivate") {
        endpoint = API_ENDPOINTS.CARTRIDGE_QR_DEACTIVATE(productId);
      } else if (action === "reactivate") {
        endpoint = API_ENDPOINTS.CARTRIDGE_QR_REACTIVATE(productId);
      } else {
        endpoint = API_ENDPOINTS.CARTRIDGE_QR_DELETE(productId);
        method = "DELETE";
      }

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success(`QR code ${action}d successfully!`);
        fetchQRCodes();
      } else {
        const data = await response.json();
        toast.error(data.message || `Failed to ${action} QR code`);
      }
    } catch (err) {
      toast.error(`Error ${action}ing QR code`);
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#6E4294]">Cartridge QR Codes</h1>
          <p className="text-sm text-brownSoft">Manage all cartridge product QR codes.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search QR value..."
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
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-50 text-brown">
            <tr>
              <th className="px-5 py-3 text-left">QR Value</th>
              <th className="px-5 py-3 text-left">Product ID</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Created</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center">
                  Loading QR codes...
                </td>
              </tr>
            )}
            {!loading && filteredQRCodes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-brownSoft">
                  No QR codes found.
                </td>
              </tr>
            )}
            {paginatedQRCodes.map((qr) => (
              <tr key={qr.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                <td className="px-5 py-4 font-mono text-brown">{qr.qr_value}</td>
                <td className="px-5 py-4 text-brownSoft font-mono text-xs">
                  {qr.cartridge_product_id.substring(0, 8)}...
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      qr.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {qr.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-4 text-brownSoft">
                  {new Date(qr.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {qr.is_active ? (
                      <button
                        onClick={() => handleAction(qr.cartridge_product_id, "deactivate")}
                        className="px-3 py-1.5 text-xs rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(qr.cartridge_product_id, "reactivate")}
                        className="px-3 py-1.5 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
                      >
                        Reactivate
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(qr.cartridge_product_id, "delete")}
                      className="px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                    >
                      Delete
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
          {filteredQRCodes.length === 0
            ? "Showing 0 QR codes"
            : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredQRCodes.length
              )} of ${filteredQRCodes.length} QR codes`}
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
    </div>
  );
};

export default CartridgeQRList;
