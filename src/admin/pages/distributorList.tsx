import { useEffect, useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center">Loading distributors...</td>
              </tr>
            )}
            {!loading && filteredDistributors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-brownSoft">
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(distributor.status)}`}>
                    {distributor.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-brownSoft">
                  {new Date(distributor.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistributorList;
