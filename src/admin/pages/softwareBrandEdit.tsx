import { useState, useEffect } from "react";
import type { FC } from "react";
import toast from "react-hot-toast";
import { API } from "../../config/api.ts";
import { API_ENDPOINTS } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

/* ================= TYPES ================= */

export type SoftwareBrand = {
  id: string;
  name: string;
  is_active: boolean;
  thumbnail_url?: string | null;
  original_url?: string | null;
  created_at: string;
  updated_at: string;
};

type ApiErrorResponse = {
  message?: string;
};

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return "Something went wrong";
};

/* ================= COMPONENT ================= */

const SoftwareBrandEdit: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchBrand();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchBrand = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API.BRANDS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        const brand = data.brand || data;
        setName(brand.name);
        setIsActive(brand.is_active);
        if (brand.thumbnail_url) {
          setCurrentImageUrl(brand.thumbnail_url);
        }
      } else {
        toast.error(data.message || "Failed to fetch brand");
      }
    } catch (err) {
      toast.error("Error loading brand");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      if (!name.trim()) {
        toast.error("Brand name is required");
        return;
      }

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("is_active", String(isActive));
      
      // Only append image if a new one is selected
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${API.BRANDS}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data: ApiErrorResponse & { data?: SoftwareBrand } =
        await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update brand");
      }

      toast.success(data.message || "Brand updated successfully");
      navigate("/admin/brands");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading brand...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-[#6E4294]">
          Edit Software Brand
        </h1>
        <p className="text-sm text-[#482072]">
          Update brand details and image.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
      >
        {/* NAME */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">Brand Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Microsoft"
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* IMAGE */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-brown">Brand Image</label>
          <p className="text-xs text-brownSoft mb-2">
            Upload new brand logo (optional - JPEG, PNG, GIF, WebP - Max 5MB)
          </p>
          
          {currentImageUrl && !imagePreview && (
            <div className="mb-3">
              <p className="text-xs text-brownSoft mb-2">Current Image:</p>
              <img
                src={API_ENDPOINTS.SOFTWARE_BRAND_IMAGE(currentImageUrl)}
                alt="Current brand"
                className="w-32 h-32 object-contain border border-slate-200 rounded-lg p-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          
          {imagePreview && (
            <div className="mt-3">
              <p className="text-xs text-brownSoft mb-2">New Preview:</p>
              <img
                src={imagePreview}
                alt="Brand preview"
                className="w-32 h-32 object-contain border border-slate-200 rounded-lg p-2"
              />
            </div>
          )}
        </div>

        {/* ACTIVE */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-brown">Active</p>
            <p className="text-xs text-brownSoft">
              Inactive brands won't be shown to users
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
            type="button"
            onClick={() => navigate("/admin/brands")}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-[#6E4294] text-white text-sm font-medium hover:bg-[#6E4294]/90 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Brand"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SoftwareBrandEdit;
