import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EgNavbar from "../../components/eg/egNavbar";
import EgFooter from "../../components/eg/egFooter";
import { API_ENDPOINTS } from "../../api/api";
import { getAuthToken } from "../../utils/auth";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  cartridge_product_id: string;
  product_name: string;
  model_number: string;
  brand_name: string;
  category_name: string;
  quantity: number;
  unit_price: string;
  serial_number: string;
}

interface Order {
  id: string;
  billing_full_name: string;
  billing_email: string;
  billing_phone: string;
  billing_address: string;
  status: string;
  total: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const MyCartridgeOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/user-login");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(API_ENDPOINTS.USER_CARTRIDGE_ORDERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data || []);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const parseSerialNumbers = (serialNumberStr: string): string[] => {
    try {
      return JSON.parse(serialNumberStr);
    } catch {
      return [serialNumberStr];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <EgNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]"></div>
            <p className="text-gray-600 mt-4">Loading your orders...</p>
          </div>
        </div>
        <EgFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <EgNavbar />

      <section className="relative w-full min-h-screen py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4">
              My Cartridge Orders
            </h1>
            <p className="text-gray-600 text-lg">
              View and manage your cartridge orders
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-600 text-lg mb-6">You haven't placed any orders yet</p>
              <button
                onClick={() => navigate("/eg")}
                className="bg-[#1e3a8a] text-white px-8 py-3 rounded-full hover:bg-[#1e40af] transition-all"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm opacity-90">Order ID</p>
                        <p className="font-mono font-bold text-lg">{order.id.slice(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Order Date</p>
                        <p className="font-semibold">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Total Amount</p>
                        <p className="font-bold text-2xl">Rs. {parseFloat(order.total).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-[#1e3a8a] mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items && order.items.length > 0 ? order.items.map((item) => {
                        const serialNumbers = parseSerialNumbers(item.serial_number);
                        return (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-lg">{item.product_name}</p>
                                <p className="text-sm text-gray-600">Brand: {item.brand_name}</p>
                                <p className="text-sm text-gray-600">Model: {item.model_number}</p>
                                <p className="text-sm text-gray-600">Category: {item.category_name}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#1e3a8a] text-lg">
                                  Rs. {parseFloat(item.unit_price).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">per unit</p>
                              </div>
                            </div>

                            {/* Serial Numbers */}
                            {serialNumbers.length > 0 && serialNumbers[0] && (
                              <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                <p className="text-xs font-semibold text-gray-600 mb-2">
                                  Serial Number{serialNumbers.length > 1 ? "s" : ""}:
                                </p>
                                {serialNumbers.map((sn, idx) => (
                                  <div key={idx} className="flex items-center gap-2 mb-1">
                                    <code className="text-sm font-mono bg-white px-3 py-1 rounded border border-gray-200 flex-1">
                                      {sn}
                                    </code>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(sn);
                                        toast.success("Serial number copied!");
                                      }}
                                      className="text-[#1e3a8a] hover:text-[#1e40af] text-sm font-semibold"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }) : (
                        <p className="text-gray-500 text-center py-4">No items found</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <EgFooter />
    </div>
  );
};

export default MyCartridgeOrders;
