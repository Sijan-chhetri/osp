import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EgNavbar from "../../components/eg/egNavbar";
import EgFooter from "../../components/eg/egFooter";
import { API_ENDPOINTS } from "../../api/api";

interface CartItem {
  id: string;
  product_name: string;
  model_number: string;
  unit_price: number;
  special_price: number | null;
  quantity: number;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}

type PaymentMethod = "esewa" | "khalti" | "ips" | "cash" | null;

const CartridgeCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const stateData = location.state as { 
    cartItems?: CartItem[];
    cartridgeProduct?: any;
    quantity?: number;
    isCartridge?: boolean;
  } || {};
  
  const { cartItems, cartridgeProduct, quantity } = stateData;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  // Auto-fill form if user is logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("userToken");
      
      if (token) {
        try {
          // Try to fetch user profile from API
          const response = await fetch(API_ENDPOINTS.AUTH_PROFILE, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setFormData((prev) => ({
              ...prev,
              fullName: userData.full_name || prev.fullName,
              email: userData.email || prev.email,
              phone: userData.phone || prev.phone,
              address: userData.address || prev.address,
              city: userData.city || prev.city,
            }));
          } else {
            // Fallback to localStorage
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              const user = JSON.parse(storedUser);
              setFormData((prev) => ({
                ...prev,
                fullName: user.full_name || prev.fullName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback to localStorage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              setFormData((prev) => ({
                ...prev,
                fullName: user.full_name || prev.fullName,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
              }));
            } catch (parseError) {
              console.error("Error parsing user data:", parseError);
            }
          }
        }
      }
    };

    fetchUserProfile();
  }, []);

  // Redirect if no product data
  React.useEffect(() => {
    if (!cartItems && !cartridgeProduct) {
      navigate("/eg");
    }
  }, [cartItems, cartridgeProduct, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("userToken");
      
      // Map payment methods to API format
      const paymentMethodMap: Record<string, string> = {
        esewa: "esewa",
        khalti: "khalti",
        ips: "ips",
        cash: "cod",
      };

      const apiPaymentMethod = paymentMethodMap[selectedPayment];

      // Prepare billing info
      const billingInfo = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
      };

      let requestBody: any = {
        billing_info: billingInfo,
        payment_method: apiPaymentMethod,
      };

      // If guest user or single product checkout, include items
      if (!token || cartridgeProduct) {
        const items = cartItems
          ? cartItems.map((item) => ({
              cartridge_product_id: item.id,
              quantity: item.quantity,
              unit_price: item.special_price || item.unit_price,
            }))
          : [
              {
                cartridge_product_id: cartridgeProduct.id,
                quantity: quantity || 1,
                unit_price: cartridgeProduct.special_price || cartridgeProduct.unit_price,
              },
            ];
        requestBody.items = items;
      }

      // Make API call
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(API_ENDPOINTS.CARTRIDGE_ORDER_FROM_CART, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear cart from localStorage for guest users
        if (!token) {
          localStorage.removeItem("cartridgeCart");
        }
        
        // Dispatch cart update event
        window.dispatchEvent(new Event("cartUpdated"));

        alert(`Order placed successfully! Order ID: ${data.order.id}`);
        navigate("/eg");
      } else {
        alert(data.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartItems && !cartridgeProduct) {
    return null;
  }

  // Calculate totals
  const calculateSubtotal = () => {
    if (cartItems) {
      return cartItems.reduce((sum, item) => {
        const price = item.special_price || item.unit_price;
        return sum + price * item.quantity;
      }, 0);
    } else if (cartridgeProduct) {
      const price = cartridgeProduct.special_price || cartridgeProduct.unit_price;
      return price * (quantity || 1);
    }
    return 0;
  };

  const subtotal = calculateSubtotal();
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <EgNavbar />
      
      <section className="relative w-full min-h-screen flex flex-col items-center py-40 px-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 px-6 py-2 rounded-full mb-4">
              <span className="text-[#1e3a8a] font-semibold text-sm">SECURE CHECKOUT</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4">
              Complete Your Order
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              You're just one step away from getting your genuine cartridge
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === 1 ? 'bg-[#1e3a8a] text-white' : 'bg-gray-200'}`}>
                        1
                      </div>
                      <span className="font-semibold hidden sm:inline">Billing Info</span>
                    </div>
                    <div className="w-16 h-1 bg-gray-200"></div>
                    <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === 2 ? 'bg-[#1e3a8a] text-white' : 'bg-gray-200'}`}>
                        2
                      </div>
                      <span className="font-semibold hidden sm:inline">Payment</span>
                    </div>
                  </div>
                </div>

                {/* Step 1: Billing Information */}
                {currentStep === 1 && (
                  <>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <h2 className="text-2xl font-bold text-[#1e3a8a]">Billing Information</h2>
                    </div>

                    <form onSubmit={handleNext} className="space-y-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+977 9800000000"
                            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter your complete address"
                          rows={3}
                          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 resize-none transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Kathmandu"
                          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all"
                          required
                        />
                      </div>

                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                        <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-green-800 font-semibold text-sm">Secure Checkout</p>
                          <p className="text-green-600 text-xs">Your information is protected with SSL encryption</p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1e40af] transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Next: Payment Method →
                      </button>
                    </form>
                  </>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <h2 className="text-2xl font-bold text-[#1e3a8a]">Select Payment Method</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        {/* eSewa */}
                        <label
                          className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedPayment === "esewa"
                              ? "border-[#1e3a8a] bg-blue-50"
                              : "border-gray-200 hover:border-[#1e3a8a]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="esewa"
                            checked={selectedPayment === "esewa"}
                            onChange={() => setSelectedPayment("esewa")}
                            className="w-5 h-5 text-[#1e3a8a]"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">eSewa</p>
                            <p className="text-sm text-gray-600">Pay with eSewa digital wallet</p>
                          </div>
                          <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                            eSewa
                          </div>
                        </label>

                        {/* Khalti */}
                        <label
                          className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedPayment === "khalti"
                              ? "border-[#1e3a8a] bg-blue-50"
                              : "border-gray-200 hover:border-[#1e3a8a]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="khalti"
                            checked={selectedPayment === "khalti"}
                            onChange={() => setSelectedPayment("khalti")}
                            className="w-5 h-5 text-[#1e3a8a]"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">Khalti</p>
                            <p className="text-sm text-gray-600">Pay with Khalti digital wallet</p>
                          </div>
                          <div className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                            Khalti
                          </div>
                        </label>

                        {/* IPS */}
                        <label
                          className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedPayment === "ips"
                              ? "border-[#1e3a8a] bg-blue-50"
                              : "border-gray-200 hover:border-[#1e3a8a]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="ips"
                            checked={selectedPayment === "ips"}
                            onChange={() => setSelectedPayment("ips")}
                            className="w-5 h-5 text-[#1e3a8a]"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">IPS (Internet Payment Service)</p>
                            <p className="text-sm text-gray-600">Pay directly from your bank account</p>
                          </div>
                          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                            IPS
                          </div>
                        </label>

                        {/* Cash */}
                        <label
                          className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedPayment === "cash"
                              ? "border-[#1e3a8a] bg-blue-50"
                              : "border-gray-200 hover:border-[#1e3a8a]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value="cash"
                            checked={selectedPayment === "cash"}
                            onChange={() => setSelectedPayment("cash")}
                            className="w-5 h-5 text-[#1e3a8a]"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-gray-800">Cash Payment</p>
                            <p className="text-sm text-gray-600">Pay with cash at our office</p>
                          </div>
                          <div className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                            Cash
                          </div>
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all duration-300"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          disabled={!selectedPayment || isSubmitting}
                          className="flex-1 bg-[#1e3a8a] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1e40af] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Processing..." : "Complete Purchase"}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              {/* Trust Badges */}
              <div className="mb-6 bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#1e3a8a]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm font-semibold">100% Genuine Products</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#1e3a8a]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm font-semibold">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#1e3a8a]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm font-semibold">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-2xl shadow-xl p-8 text-white lg:sticky lg:top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                {/* Product Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartItems ? (
                    cartItems.map((item, index) => {
                      const displayPrice = item.special_price || item.unit_price;
                      return (
                        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                              <img src="/cartridge.png" alt={item.product_name} className="w-full h-full object-contain p-1" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{item.product_name}</p>
                              <p className="text-xs text-white/70 truncate">{item.model_number}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-white/80">Qty: {item.quantity}</span>
                            <span className="font-semibold">Rs. {(displayPrice * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : cartridgeProduct ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                          <img src="/cartridge.png" alt={cartridgeProduct.product_name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{cartridgeProduct.product_name}</p>
                          <p className="text-sm text-white/70">{cartridgeProduct.model_number}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/80">Qty: {quantity || 1}</span>
                        <span className="font-semibold">Rs. {((cartridgeProduct.special_price || cartridgeProduct.unit_price) * (quantity || 1)).toLocaleString()}</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                  <div className="flex justify-between text-white/90">
                    <span>Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-bold">Rs. {total.toLocaleString()}</span>
                </div>

                {/* Complete Purchase Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-white text-[#1e3a8a] py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? "Processing..." : "Complete Purchase"}
                </button>

                {/* Payment Methods */}
                <div className="text-center">
                  <p className="text-white/60 text-xs mb-3">We accept</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="bg-white/20 px-3 py-1.5 rounded text-xs font-semibold">eSewa</div>
                    <div className="bg-white/20 px-3 py-1.5 rounded text-xs font-semibold">Khalti</div>
                    <div className="bg-white/20 px-3 py-1.5 rounded text-xs font-semibold">IPS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EgFooter />
    </div>
  );
};

export default CartridgeCheckout;
