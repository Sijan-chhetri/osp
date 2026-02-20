import { useState } from "react";
import type { FC } from "react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../api/api";
import { useNavigate } from "react-router-dom";

const CartridgeCategoryCreate: FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const payload = { name: name.trim(), is_active: isActive };

      if (!payload.name) {
        toast.error("Category name is required");
        return;
      }

      const response = await fetch(API_ENDPOINTS.CARTRIDGE_CATEGORIES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Category created successfully ✨");
        setName("");
        setIsActive(true);
        navigate("/admin/cartridge/categories");
      } else {
        toast.error(data.message || "Failed to create category");
      }
    } catch (err) {
      toast.error("Error creating category");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#6E4294]">Create Cartridge Category</h1>
        <p className="text-sm text-[#482072]">Add a new category to organize cartridge products.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">Category Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Toner Cartridges"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brown">Active</p>
            <p className="text-xs text-brownSoft">Inactive categories won't be shown to users</p>
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

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-[#6E4294] text-white text-sm font-medium hover:bg-[#6E4294]/90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CartridgeCategoryCreate;
