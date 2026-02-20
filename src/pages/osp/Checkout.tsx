import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/osp/Navbar";
import Footer from "../../components/osp/Footer";
import { API_ENDPOINTS } from "../../api/api";
import { getAuthToken } from "../../utils/auth";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  plan_name: string;
  duration_type: string;
  price: string;
  original_price: string | null;
  features: string;
  has_discount: boolean;
}

interface Product {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  description: string;
  brand_name: string;
  brand_image_url: string;
  category_name: string;
  plans: Plan[];
}

interface CartItem {
  product: Product;
  plan: Plan;
  quantity: number;
  addedAt: string;
}

interface APICartItem {
  id: string;
  cart_id: string;
  software_plan_id: string;
  plan_name: string;
  duration_type: string;
  product_name: string;
  brand_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  current_price: number;
  price_changed: boolean;
}

interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}

type PaymentMethod = "esewa" | "khalti" | "ips" | "cash" | null;

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle both single item and multiple items from cart
  const stateData = location.state as { 
    product?: Product; 
    plan?: Plan;
    cartItems?: CartItem[];
    apiCartItems?: APICartItem[];
    isMultipleItems?: boolean;
    isFromAPI?: boolean;
  } || {};
  
  const { product, plan, cartItems, apiCartItems, isMultipleItems, isFromAPI } = stateData;

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
    const userToken = getAuthToken();
    const userData = localStorage.getItem("user");
    
    if (userToken && userData) {
      try {
        const user = JSON.parse(userData);
        setFormData((prev) => ({
          ...prev,
          fullName: user.full_name || prev.fullName,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Redirect if no product data
  React.useEffect(() => {
    if (!product && !cartItems && !apiCartItems) {
      navigate("/");
    }
  }, [product, cartItems, apiCartItems, navigate]);

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
      toast.error("Please select a payment method");
      return;
    }

    setIsSubmitting(true);

    try {
      const userToken = getAuthToken();
      
      // Map payment method to API format
      const paymentMethodMap: Record<string, string> = {
        esewa: "esewa",
        khalti: "khalti",
        ips: "ips",
        cash: "cod", // Cash maps to COD (Cash on Delivery)
      };

      const billingInfo = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
      };

      const paymentMethod = paymentMethodMap[selectedPayment];

      let response;
      let endpoint;

      if (userToken) {
        // Logged-in user
        if (product && plan && !isMultipleItems) {
          // Direct purchase - single item
          endpoint = API_ENDPOINTS.ORDER_GUEST; // Use guest endpoint for direct purchase
          const items = [{
            software_plan_id: plan.id,
            quantity: 1,
            unit_price: parseFloat(plan.price),
          }];

          const payload = {
            billing_info: billingInfo,
            payment_method: paymentMethod,
            items: items,
          };

          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(payload),
          });
        } else {
          // Order from cart
          endpoint = API_ENDPOINTS.ORDER_FROM_CART;
          const payload = {
            billing_info: billingInfo,
            payment_method: paymentMethod,
          };

          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(payload),
          });
        }
      } else {
        // Guest user: Order with items from localStorage
        endpoint = API_ENDPOINTS.ORDER_GUEST;
        
        // Get items from localStorage
        const localCart = localStorage.getItem("cart");
        let items: any[] = [];

        if (localCart) {
          try {
            const cartData = JSON.parse(localCart);
            items = cartData.map((item: CartItem) => ({
              software_plan_id: item.plan.id,
              quantity: item.quantity,
              unit_price: parseFloat(item.plan.price),
            }));
          } catch (error) {
            console.error("Error parsing cart:", error);
          }
        }

        // If single item checkout (not from cart)
        if (!isMultipleItems && product && plan) {
          items = [{
            software_plan_id: plan.id,
            quantity: 1,
            unit_price: parseFloat(plan.price),
          }];
        }

        if (items.length === 0) {
          toast.error("No items to checkout");
          setIsSubmitting(false);
          return;
        }

        const payload = {
          billing_info: billingInfo,
          payment_method: paymentMethod,
          items: items,
        };

        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (response.ok) {
        // Clear cart from localStorage after successful order
        if (!userToken) {
          localStorage.removeItem("cart");
        }

        // Dispatch cart update event
        window.dispatchEvent(new Event("cartUpdated"));

        toast.success(`Order placed successfully! Order ID: ${data.order?.id?.slice(0, 8) || "N/A"}`);
        
        // Redirect to order history page
        setTimeout(() => {
          navigate("/my-orders");
        }, 1000);
      } else {
        alert(data.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred while placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((!product || !plan) && !cartItems && !apiCartItems) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">No items to checkout</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#7B5DE8] text-white px-6 py-3 rounded-full hover:bg-[#6A4BC4]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate totals
  const calculateSubtotal = () => {
    if (isFromAPI && apiCartItems) {
      return apiCartItems.reduce((sum, item) => {
        return sum + item.subtotal;
      }, 0);
    } else if (isMultipleItems && cartItems) {
      return cartItems.reduce((sum, item) => {
        return sum + parseFloat(item.plan.price) * item.quantity;
      }, 0);
    } else if (plan) {
      return parseFloat(plan.price);
    }
    return 0;
  };

  const calculateDiscount = () => {
    if (isFromAPI && apiCartItems) {
      // API items don't have discount info in the current structure
      return 0;
    } else if (isMultipleItems && cartItems) {
      return cartItems.reduce((sum, item) => {
        if (item.plan.has_discount && item.plan.original_price) {
          return sum + (parseFloat(item.plan.original_price) - parseFloat(item.plan.price)) * item.quantity;
        }
        return sum;
      }, 0);
    } else if (plan && plan.has_discount && plan.original_price) {
      return parseFloat(plan.original_price) - parseFloat(plan.price);
    }
    return 0;
  };

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount();
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Navbar />
      
      <section className="relative w-full min-h-screen flex flex-col items-center py-40 px-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-purple-100 px-6 py-2 rounded-full mb-4">
              <span className="text-[#7B5DE8] font-semibold text-sm">SECURE CHECKOUT</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#482072] mb-4">
              Complete Your Order
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              You're just one step away from getting your genuine software license
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-[#7B5DE8]' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === 1 ? 'bg-[#7B5DE8] text-white' : 'bg-gray-200'}`}>
                        1
                      </div>
                      <span className="font-semibold hidden sm:inline">Billing Info</span>
                    </div>
                    <div className="w-16 h-1 bg-gray-200"></div>
                    <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-[#7B5DE8]' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep === 2 ? 'bg-[#7B5DE8] text-white' : 'bg-gray-200'}`}>
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
                      <div className="w-10 h-10 bg-[#7B5DE8] rounded-full flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <h2 className="text-2xl font-bold text-[#482072]">Billing Information</h2>
                    </div>

                    <form onSubmit={handleNext} className="space-y-6">
                  {/* Full Name */}
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
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#7B5DE8] focus:ring-2 focus:ring-[#7B5DE8]/20 transition-all"
                      required
                    />
                  </div>

                  {/* Email and Phone */}
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
                        className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#7B5DE8] focus:ring-2 focus:ring-[#7B5DE8]/20 transition-all"
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
                        className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#7B5DE8] focus:ring-2 focus:ring-[#7B5DE8]/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
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
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#7B5DE8] focus:ring-2 focus:ring-[#7B5DE8]/20 resize-none transition-all"
                      required
                    />
                  </div>

                  {/* City */}
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
                      className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#7B5DE8] focus:ring-2 focus:ring-[#7B5DE8]/20 transition-all"
                      required
                    />
                  </div>

                  {/* Security Badge */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-green-800 font-semibold text-sm">Secure Checkout</p>
                      <p className="text-green-600 text-xs">Your information is protected with SSL encryption</p>
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#6E4294] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#6A4BC4] transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  <div className="w-10 h-10 bg-[#7B5DE8] rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <h2 className="text-2xl font-bold text-[#482072]">Select Payment Method</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Options */}
                  <div className="space-y-4">
                    {/* eSewa */}
                    <label
                      className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPayment === "esewa"
                          ? "border-[#7B5DE8] bg-purple-50"
                          : "border-gray-200 hover:border-[#7B5DE8]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="esewa"
                        checked={selectedPayment === "esewa"}
                        onChange={() => setSelectedPayment("esewa")}
                        className="w-5 h-5 text-[#7B5DE8]"
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
                          ? "border-[#7B5DE8] bg-purple-50"
                          : "border-gray-200 hover:border-[#7B5DE8]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="khalti"
                        checked={selectedPayment === "khalti"}
                        onChange={() => setSelectedPayment("khalti")}
                        className="w-5 h-5 text-[#7B5DE8]"
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
                          ? "border-[#7B5DE8] bg-purple-50"
                          : "border-gray-200 hover:border-[#7B5DE8]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="ips"
                        checked={selectedPayment === "ips"}
                        onChange={() => setSelectedPayment("ips")}
                        className="w-5 h-5 text-[#7B5DE8]"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">IPS (Internet Payment Service)</p>
                        <p className="text-sm text-gray-600">Pay directly from your bank account</p>
                      </div>
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                        IPS
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPayment === "cash"
                          ? "border-[#7B5DE8] bg-purple-50"
                          : "border-gray-200 hover:border-[#7B5DE8]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={selectedPayment === "cash"}
                        onChange={() => setSelectedPayment("cash")}
                        className="w-5 h-5 text-[#7B5DE8]"
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

                  {/* Action Buttons */}
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
                      className="flex-1 bg-[#6E4294] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#6A4BC4] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
              {/* Trust Badges - Above Order Summary */}
              <div className="mb-6 bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#7B5DE8]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm font-semibold">100% Genuine Software</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#7B5DE8]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm font-semibold">Instant Delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#7B5DE8]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm font-semibold">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="bg-gradient-to-br from-[#482072] to-[#7B5DE8] rounded-2xl shadow-xl p-8 text-white lg:sticky lg:top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                
                {/* Product Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {isFromAPI && apiCartItems ? (
                    apiCartItems.map((item, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{item.product_name}</p>
                            <p className="text-xs text-white/70 truncate">{item.plan_name}</p>
                            <p className="text-xs text-white/60 capitalize">{item.duration_type}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/80">Qty: {item.quantity}</span>
                          <span className="font-semibold">Rs. {item.subtotal.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  ) : isMultipleItems && cartItems ? (
                    cartItems.map((item, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.product.brand_image_url ? (
                              <img src={item.product.brand_image_url} alt={item.product.brand_name} className="w-full h-full object-contain p-1" />
                            ) : (
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{item.product.name}</p>
                            <p className="text-xs text-white/70 truncate">{item.plan.plan_name}</p>
                            <p className="text-xs text-white/60 capitalize">{item.plan.duration_type}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/80">Qty: {item.quantity}</span>
                          <span className="font-semibold">Rs. {(parseFloat(item.plan.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  ) : product && plan ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.brand_image_url ? (
                            <img src={product.brand_image_url} alt={product.brand_name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-white/70">{plan.plan_name}</p>
                          <p className="text-xs text-white/60 capitalize">{plan.duration_type}</p>
                        </div>
                      </div>
                      <p className="text-xs text-white/70">{product.description}</p>
                    </div>
                  ) : null}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                  <div className="flex justify-between text-white/90">
                    <span>Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center bg-green-500/20 rounded-lg px-3 py-2">
                      <span className="text-green-200 text-sm">Discount</span>
                      <span className="font-semibold text-green-200">- Rs. {discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-bold">Rs. {total.toFixed(2)}</span>
                </div>

                {/* Complete Purchase Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-white text-[#482072] py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

      <Footer />
    </div>
  );
};

export default Checkout;
