import { useEffect, useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../api/api";

interface Distributor {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
}

const DistributorList: FC = () => {
  const navigate = useNavigate();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Distributor | null>(null);
  const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    status: "active",
  });

  useEffect(() => {
    fetchDistributors();
  }, []);

  const fetchDistributors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.GET_USERS}?role=distributor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDistributors(data || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to fetch distributors");
        console.error("API Error:", errorData);
      }
    } catch (error) {
      console.error("Error fetching distributors:", error);
      toast.error("Error loading distributors. Please check if the backend API is properly configured.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDistributors = distributors.filter((dist) =>
    dist.full_name.toLowerCase().includes(search.toLowerCase()) ||
    dist.email.toLowerCase().includes(search.toLowerCase()) ||
    dist.phone.includes(search)
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
      suspended: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const handleEdit = (distributor: Distributor) => {
    setEditingDistributor(distributor);
    setEditForm({
      full_name: distributor.full_name,
      email: distributor.email,
      phone: distributor.phone,
      status: distributor.status,
    });
  };

  const handleUpdate = async () => {
    if (!editingDistributor) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.GET_USERS}/${editingDistributor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Distributor updated successfully");
        setDistributors((prev) =>
          prev.map((d) =>
            d.id === editingDistributor.id ? { ...d, ...editForm } : d
          )
        );
        setEditingDistributor(null);
      } else {
        toast.error(data.message || "Failed to update distributor");
      }
    } catch (error) {
      console.error("Error updating distributor:", error);
      toast.error("Error updating distributor");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.GET_USERS}/${deleteTarget.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Distributor deleted successfully");
        setDistributors((prev) => prev.filter((d) => d.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete distributor");
      }
    } catch (error) {
      console.error("Error deleting distributor:", error);
      toast.error("Error deleting distributor");
    }
  };

  const handleToggleStatus = async (distributor: Distributor) => {
    const newStatus = distributor.status === "active" ? "suspended" : "active";
    const endpoint = newStatus === "active" ? "activate" : "deactivate";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.GET_USERS}/${distributor.id}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Distributor ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
        setDistributors((prev) =>
          prev.map((d) =>
            d.id === distributor.id ? { ...d, status: newStatus } : d
          )
        );
      } else {
        toast.error(data.message || `Failed to ${endpoint} distributor`);
      }
    } catch (error) {
      console.error(`Error ${endpoint}ing distributor:`, error);
      toast.error(`Error ${endpoint}ing distributor`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#6E4294]">Distributors</h1>
          <p className="text-sm text-brownSoft">Manage distributor accounts and access</p>
        </div>
        <button
          onClick={() => navigate("/admin/distributors/register")}
          className="flex items-center gap-2 bg-[#6E4294] text-white px-6 py-2.5 rounded-lg hover:bg-[#7B5DE8] transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          Register Distributor
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="min-w-full w-full text-sm">
          <thead className="bg-slate-50 text-brown">
            <tr>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Phone</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Registered</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center">Loading distributors...</td>
              </tr>
            )}
            {!loading && filteredDistributors.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-brownSoft">
                  No distributors found.
                </td>
              </tr>
            )}
            {filteredDistributors.map((distributor) => (
              <tr key={distributor.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                <td className="px-5 py-4">
                  <p className="font-medium text-brown">{distributor.full_name}</p>
                </td>
                <td className="px-5 py-4 text-brownSoft">{distributor.email}</td>
                <td className="px-5 py-4 text-brownSoft">{distributor.phone}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleToggleStatus(distributor)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 ${getStatusBadge(distributor.status)}`}
                    title={`Click to ${distributor.status === "active" ? "suspend" : "activate"}`}
                  >
                    {distributor.status}
                  </button>
                </td>
                <td className="px-5 py-4 text-brownSoft">
                  {new Date(distributor.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(distributor)}
                      className="p-2 rounded-lg text-brownSoft hover:text-[#6E4294] hover:bg-[#6E4294]/10 transition"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(distributor)}
                      className="p-2 rounded-lg text-brownSoft hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete"
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

      {/* Edit Modal */}
      {editingDistributor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-brown">Edit Distributor</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
                  placeholder="Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
                  placeholder="Phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setEditingDistributor(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-[#6E4294] text-white rounded-lg text-sm hover:bg-[#7B5DE8]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-brown">Delete Distributor</h2>
            <p className="text-sm text-brownSoft">
              Are you sure you want to delete <span className="font-medium text-brown">{deleteTarget.full_name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
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

export default DistributorList;
