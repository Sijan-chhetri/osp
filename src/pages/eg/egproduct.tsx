import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../api/api";
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

const ProductCard: React.FC<{ product: CartridgeProduct; onCartUpdate: () => void }> = ({ product, onCartUpdate }) => {
  const navigate = useNavigate();
  const displayPrice = product.special_price || product.unit_price;
  const hasDiscount = product.special_price && product.special_price < product.unit_price;

  const handleViewDetails = () => {
    navigate(`/eg/cartridge/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
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
            quantity: 1,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(`${product.product_name} added to cart!`);
          onCartUpdate();
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
        // Increase quantity
        cart[existingItemIndex].quantity += 1;
        toast.success(`Increased quantity of ${product.product_name}`);
      } else {
        // Add new item
        cart.push({
          id: product.id,
          product_name: product.product_name,
          model_number: product.model_number,
          unit_price: product.unit_price,
          special_price: product.special_price,
          quantity: 1,
        });
        toast.success(`${product.product_name} added to cart!`);
      }

      // Save to localStorage
      localStorage.setItem("cartridgeCart", JSON.stringify(cart));
      onCartUpdate();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center hover:shadow-xl transition-all duration-300">
      {/* Product Image with Badge */}
      <div className="relative w-full flex items-center justify-center mb-6 h-48 cursor-pointer" onClick={handleViewDetails}>
        {hasDiscount && (
          <div className="absolute top-0 right-0 bg-[#dc2626] text-white px-4 py-2 rounded-lg font-bold text-sm transform rotate-12">
            SAVE Rs. {product.unit_price - product.special_price!}
          </div>
        )}
        <img
          src="/cartridge.png"
          alt={product.product_name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Name */}
      <h3 className="text-[#1e3a8a] font-bold text-xl mb-2 text-center min-h-[60px] flex items-center cursor-pointer hover:text-[#1e40af]" onClick={handleViewDetails}>
        {product.product_name}
      </h3>

      {/* Model Number */}
      <p className="text-gray-500 text-sm mb-4">Model: {product.model_number}</p>

      {/* Price and Buttons */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Price</p>
            <div className="flex items-center gap-2">
              <p className="text-[#1e3a8a] font-bold text-xl">Rs. {displayPrice}</p>
              {hasDiscount && (
                <p className="text-gray-400 text-sm line-through">Rs. {product.unit_price}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-3 rounded-full font-semibold hover:bg-[#1e3a8a] hover:text-white transition-all duration-200"
          >
            Add to Cart
          </button>
          <button 
            onClick={handleViewDetails}
            className="flex-1 bg-[#1e3a8a] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1e40af] transition-all duration-200"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

const EgProduct: React.FC = () => {
  const [products, setProducts] = useState<CartridgeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCartUpdate = () => {
    setCartUpdateTrigger(prev => prev + 1);
    // Dispatch custom event for navbar to update cart count
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CARTRIDGE_PRODUCTS);
      const data = await response.json();

      if (response.ok) {
        // Filter only active products
        const activeProducts = (data.products || data || []).filter(
          (product: CartridgeProduct) => product.is_active
        );
        setProducts(activeProducts);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      console.error("Error fetching cartridge products:", err);
      setError("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-white py-5 px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          FIND OUR <span className="text-[#dc2626]">PRODUCTS</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Browse our collection of high-quality ink and toner cartridges
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]"></div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No products available at the moment.</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onCartUpdate={handleCartUpdate} />
              ))}
            </div>
          )}
        </>
      )}
      <br />
    </section>
  );
};

export default EgProduct;
