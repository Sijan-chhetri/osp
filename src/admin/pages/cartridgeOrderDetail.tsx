import { useEffect, useState } from "react";
import type { FC } from "react";
import { API_ENDPOINTS } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

interface CartridgeOrderDetail {
  order: {
    id: string;
    buyer_user_id: string | null;
    billing_full_name: string;
    billing_email: string;
    billing_phone: string;
    billing_address: string;
    status: string;
    total: number;
    created_at: string;
    updated_at: string;
    user_email: string | null;
    user_role: string | null;
    user_full_name: string | null;
  };
  payment: {
    id: string;
    cartridge_order_id: string;
    payment_type: string;
    gateway: string | null;
    gateway_txn_id: string | null;
    manual_reference: string | null;
    amount: number;
    status: string;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
  };
  items: Array<{
    id: string;
    cartridge_product_id: string;
    quantity: number;
    unit_price: number;
    serial_number: string;
    barcode_image: string;
    created_at: string;
    product_name: string;
    model_number: string;
    brand_name: string;
    category_name: string;
  }>;
  summary: {
    total_items: number;
    total_quantity: number;
  };
}

const CartridgeOrderDetail: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [orderDetail, setOrderDetail] = useState<CartridgeOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.CARTRIDGE_ORDER_DETAILS(id!), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setOrderDetail(data);
      } else {
        setError(data.message || "Failed to fetch order details");
      }
    } catch (err) {
      setError("Error loading order details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error || !orderDetail) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate("/admin/cartridge/orders")}
          className="text-[#6E4294] hover:underline flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Order not found"}
        </div>
      </div>
    );
  }

  const { order, payment, items, summary } = orderDetail;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
      cancelled: "bg-gray-100 text-gray-700",
      success: "bg-green-100 text-green-700",
      initiated: "bg-blue-100 text-blue-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/admin/cartridge/orders")}
            className="text-[#6E4294] hover:underline flex items-center gap-2 mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
          <h1 className="text-2xl font-semibold text-[#6E4294]">Cartridge Order Details</h1>
          <p className="text-sm text-brownSoft">Order ID: {order.id}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-brown mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-brownSoft mb-1">Full Name</p>
                <p className="font-medium text-brown">{order.billing_full_name}</p>
              </div>
              <div>
                <p className="text-xs text-brownSoft mb-1">Email</p>
                <p className="font-medium text-brown">{order.billing_email}</p>
              </div>
              <div>
                <p className="text-xs text-brownSoft mb-1">Phone</p>
                <p className="font-medium text-brown">{order.billing_phone}</p>
              </div>
              <div>
                <p className="text-xs text-brownSoft mb-1">Address</p>
                <p className="font-medium text-brown">{order.billing_address}</p>
              </div>
              {order.user_role && (
                <div>
                  <p className="text-xs text-brownSoft mb-1">User Role</p>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm font-medium">
                    {order.user_role}
                  </span>
                </div>
              )}
              {!order.buyer_user_id && (
                <div>
                  <p className="text-xs text-brownSoft mb-1">Order Type</p>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                    Guest Order
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-brown mb-4">Order Items ({summary.total_items})</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-brown">{item.product_name}</p>
                      <p className="text-sm text-brownSoft">Model: {item.model_number}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {item.brand_name}
                        </span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {item.category_name}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-brownSoft">Unit Price</p>
                      <p className="font-bold text-brown">Rs. {item.unit_price.toLocaleString()}</p>
                      <p className="text-xs text-brownSoft mt-1">Subtotal</p>
                      <p className="font-semibold text-[#6E4294]">Rs. {(item.unit_price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Serial Number and Barcode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t">
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-brownSoft mb-1">Serial Number</p>
                      <p className="font-mono text-sm text-brown break-all">{item.serial_number}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-brownSoft mb-2">Barcode</p>
                      {item.barcode_image ? (
                        <img 
                          src={item.barcode_image} 
                          alt={`Barcode for ${item.product_name}`}
                          className="w-full h-auto max-h-16 object-contain"
                        />
                      ) : (
                        <p className="text-xs text-gray-400">No barcode available</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Payment & Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Payment Information */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-brown mb-4">Payment Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-brownSoft mb-1">Payment Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-brownSoft mb-1">Payment Type</p>
                <p className="font-medium text-brown capitalize">{payment.payment_type}</p>
              </div>
              {payment.gateway && (
                <div>
                  <p className="text-xs text-brownSoft mb-1">Gateway</p>
                  <p className="font-medium text-brown">{payment.gateway}</p>
                </div>
              )}
              {payment.gateway_txn_id && (
                <div>
                  <p className="text-xs text-brownSoft mb-1">Transaction ID</p>
                  <p className="font-mono text-xs text-brown break-all">{payment.gateway_txn_id}</p>
                </div>
              )}
              {payment.manual_reference && (
                <div>
                  <p className="text-xs text-brownSoft mb-1">Reference</p>
                  <p className="font-medium text-brown">{payment.manual_reference}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-brownSoft mb-1">Amount</p>
                <p className="text-2xl font-bold text-[#6E4294]">Rs. {payment.amount.toLocaleString()}</p>
              </div>
              {payment.paid_at && (
                <div>
                  <p className="text-xs text-brownSoft mb-1">Paid At</p>
                  <p className="text-sm text-brown">{new Date(payment.paid_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-[#6E4294] to-[#7B5DE8] rounded-xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/80">Total Items</span>
                <span className="font-semibold">{summary.total_items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Total Quantity</span>
                <span className="font-semibold">{summary.total_quantity}</span>
              </div>
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold">Rs. {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-brown mb-4">Timestamps</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-brownSoft mb-1">Created At</p>
                <p className="text-sm text-brown">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-brownSoft mb-1">Last Updated</p>
                <p className="text-sm text-brown">{new Date(order.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartridgeOrderDetail;
