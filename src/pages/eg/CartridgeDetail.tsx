import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../api/api";
import EgNavbar from "../../components/eg/egNavbar";
import EgFooter from "../../components/eg/egFooter";
import toast from "react-hot-toast";
import { getAuthToken } from "../../utils/auth";

interface CartridgeProduct {
  id: string;
  brand_id: string;
  category_id: string;
  product_name: string;
  model_number: string;
  description: string;
  unit_price: number;
  special_price: number | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const CartridgeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<CartridgeProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CARTRIDGE_PRODUCT_DETAIL(id!));
      const data = await response.json();

      if (response.ok) {
        setProduct(data);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Error loading product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const token = getAuthToken();

    if (token) {
      // Logged-in user: Use API
      try {
        const response = await fetch(API_ENDPOINTS.CARTRIDGE_CART_ADD, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cartridge_product_id: product.id,
            quantity: quantity,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Product added to cart!");
          window.dispatchEvent(new Event("cartUpdated"));
        } else {
          toast.error(data.message || "Failed to add to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Error adding to cart");
      }
    } else {
      // Guest user: Use localStorage
      const existingCart = localStorage.getItem("cartridgeCart");
      let cart = existingCart ? JSON.parse(existingCart) : [];

      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);

      if (existingItemIndex > -1) {
        // Update quantity
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.push({
          id: product.id,
          product_name: product.product_name,
          model_number: product.model_number,
          unit_price: product.unit_price,
          special_price: product.special_price,
          quantity: quantity,
          addedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem("cartridgeCart", JSON.stringify(cart));
      toast.success("Product added to cart!");
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    // Navigate to checkout with product data
    navigate("/eg/checkout", {
      state: {
        cartridgeProduct: product,
        quantity: quantity,
        isCartridge: true,
      },
    });
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <EgNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]"></div>
        </div>
        <EgFooter />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <EgNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">{error || "Product not found"}</p>
            <button
              onClick={() => navigate("/eg")}
              className="bg-[#1e3a8a] text-white px-6 py-3 rounded-full hover:bg-[#1e40af]"
            >
              Back to Products
            </button>
          </div>
        </div>
        <EgFooter />
      </div>
    );
  }

  const displayPrice = product.special_price || product.unit_price;
  const hasDiscount = product.special_price && product.special_price < product.unit_price;
  const savings = hasDiscount ? product.unit_price - product.special_price : 0;

  return (
    <div className="min-h-screen bg-white">
      <EgNavbar />

      <section className="max-w-7xl mx-auto px-8 py-20 mt-20">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/eg")}
            className="text-[#1e3a8a] hover:underline flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
        </div>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-12">
            <img
              src="/cartridge.png"
              alt={product.product_name}
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

          {/* Right Side - Details */}
          <div className="flex flex-col justify-center">
            {/* Product Name */}
            <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">
              {product.product_name}
            </h1>

            {/* Model Number */}
            <p className="text-gray-600 text-lg mb-6">
              Model: <span className="font-semibold">{product.model_number}</span>
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-[#1e3a8a]">
                  Rs. {displayPrice.toLocaleString()}
                </p>
                {hasDiscount && (
                  <p className="text-2xl text-gray-400 line-through">
                    Rs. {product.unit_price.toLocaleString()}
                  </p>
                )}
              </div>
              {hasDiscount && (
                <div className="mt-2 inline-block bg-red-100 text-red-700 px-4 py-2 rounded-lg">
                  <p className="font-semibold">Save Rs. {savings.toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-2xl font-bold text-[#1e3a8a] w-16 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1e3a8a] hover:text-white transition-all duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1e40af] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Genuine Product</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Warranty</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">24/7 Support</span>
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

export default CartridgeDetail;
