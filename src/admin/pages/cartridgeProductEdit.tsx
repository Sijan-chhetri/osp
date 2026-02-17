import { useState, useEffect } from "react";
import type { FC } from "react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

interface Brand {
  id: string;
  name: string;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  is_active: boolean;
}

interface QRCode {
  id: string;
  qr_value: string;
  is_active: boolean;
}

const CartridgeProductEdit: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [productName, setProductName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [specialPrice, setSpecialPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [qrCode, setQrCode] = useState<QRCode | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [productRes, brandsRes, categoriesRes, qrRes] = await Promise.all([
        fetch(API_ENDPOINTS.CARTRIDGE_PRODUCT(id!), {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(API_ENDPOINTS.CARTRIDGE_BRANDS, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(API_ENDPOINTS.CARTRIDGE_CATEGORIES, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(API_ENDPOINTS.CARTRIDGE_QR_BY_PRODUCT(id!), {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const productData = await productRes.json();
      const brandsData = await brandsRes.json();
      const categoriesData = await categoriesRes.json();
      const qrData = await qrRes.json();

      if (productRes.ok) {
        const product = productData.product || productData;
        setProductName(product.product_name);
        setModelNumber(product.model_number);
        setDescription(product.description || "");
        setBrandId(product.brand_id);
        setCategoryId(product.category_id);
        setUnitPrice(product.unit_price.toString());
        setSpecialPrice(product.special_price ? product.special_price.toString() : "");
        setIsActive(product.is_active);
      }

      setBrands(brandsData.brands || brandsData || []);
      setCategories(categoriesData.categories || categoriesData || []);
      if (qrRes.ok) {
        setQrCode(qrData);
      }
    } catch (err) {
      toast.error("Error loading product data");
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

      const payload = {
        brand_id: brandId,
        category_id: categoryId,
        product_name: productName.trim(),
        model_number: modelNumber.trim(),
        description: description.trim() || null,
        unit_price: parseFloat(unitPrice),
        special_price: specialPrice ? parseFloat(specialPrice) : null,
        is_active: isActive,
      };

      if (!payload.product_name) {
        toast.error("Product name is required");
        return;
      }
      if (!payload.model_number) {
        toast.error("Model number is required");
        return;
      }

      const response = await fetch(API_ENDPOINTS.CARTRIDGE_PRODUCT(id!), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product updated successfully!");
        navigate("/admin/cartridge/products");
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (err) {
      toast.error("Error updating product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQRAction = async (action: "deactivate" | "reactivate" | "delete") => {
    if (action === "delete" && !window.confirm("Are you sure you want to delete this QR code?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      let method = "POST";

      if (action === "deactivate") {
        endpoint = API_ENDPOINTS.CARTRIDGE_QR_DEACTIVATE(id!);
      } else if (action === "reactivate") {
        endpoint = API_ENDPOINTS.CARTRIDGE_QR_REACTIVATE(id!);
      } else {
        endpoint = API_ENDPOINTS.CARTRIDGE_QR_DELETE(id!);
        method = "DELETE";
      }

      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success(`QR code ${action}d successfully!`);
        fetchData();
      } else {
        const data = await response.json();
        toast.error(data.message || `Failed to ${action} QR code`);
      }
    } catch (err) {
      toast.error(`Error ${action}ing QR code`);
      console.error(err);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#6E4294]">
          Edit Cartridge Product
        </h1>
        <p className="text-sm text-brownSoft">
          Update product details and manage QR code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN FORM */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl border border-slate-200 p-6 space-y-6"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-brown">Product Name</label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-brown">Model Number</label>
              <input
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-brown">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-brown">Brand</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-brown">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-brown">Unit Price (Rs.)</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-brown">Special Price (Rs.)</label>
                <input
                  type="number"
                  value={specialPrice}
                  onChange={(e) => setSpecialPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#6E4294]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-brown">Active</p>
                <p className="text-xs text-brownSoft">Inactive products won't be shown to users</p>
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
                type="button"
                onClick={() => navigate("/admin/cartridge/products")}
                className="px-4 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-[#6E4294] text-white text-sm font-medium hover:bg-[#6E4294]/90 disabled:opacity-60"
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>

        {/* QR CODE SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-brown">QR Code Management</h2>

            {qrCode ? (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs text-brownSoft mb-1">QR Value</p>
                  <p className="font-mono text-sm break-all text-brown">{qrCode.qr_value}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-brownSoft">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      qrCode.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {qrCode.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  {qrCode.is_active ? (
                    <button
                      onClick={() => handleQRAction("deactivate")}
                      className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
                    >
                      Deactivate QR
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQRAction("reactivate")}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                    >
                      Reactivate QR
                    </button>
                  )}

                  <button
                    onClick={() => handleQRAction("delete")}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete QR Code
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-brownSoft text-sm">No QR code found for this product</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartridgeProductEdit;
