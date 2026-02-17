import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EgNavbar from "../../components/eg/egNavbar";
import EgFooter from "../../components/eg/egFooter";

interface CartItem {
  id: string;
  product_name: string;
  model_number: string;
  unit_price: number;
  special_price: number | null;
  quantity: number;
  addedAt: string;
}

const CartridgeCart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = localStorage.getItem("cartridgeCart");
    if (cart) {
      try {
        const items = JSON.parse(cart);
        setCartItems(items);
        // Select all items by default
        setSelectedItems(new Set(items.map((item: CartItem) => item.id)));
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartridgeCart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartridgeCart", JSON.stringify(updatedCart));
    
    const newSelected = new Set(selectedItems);
    newSelected.delete(id);
    setSelectedItems(newSelected);
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item.id)
    );

    if (selectedCartItems.length === 0) {
      alert("Please select at least one item to checkout");
      return;
    }

    navigate("/eg/checkout", {
      state: {
        cartItems: selectedCartItems,
        isCartridge: true,
      },
    });
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.has(item.id))
      .reduce((sum, item) => {
        const price = item.special_price || item.unit_price;
        return sum + price * item.quantity;
      }, 0);
  };

  const selectedCount = selectedItems.size;
  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <EgNavbar />
        <div className="max-w-7xl mx-auto px-8 py-32 mt-20">
          <div className="text-center">
            <svg
              className="w-32 h-32 mx-auto text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Add some cartridges to get started!
            </p>
            <button
              onClick={() => navigate("/eg")}
              className="bg-[#1e3a8a] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1e40af] transition-all"
            >
              Browse Products
            </button>
          </div>
        </div>
        <EgFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EgNavbar />

      <section className="max-w-7xl mx-auto px-8 py-20 mt-20">
        <h1 className="text-4xl font-bold text-[#1e3a8a] mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Select All */}
              <div className="flex items-center gap-3 pb-4 border-b mb-4">
                <input
                  type="checkbox"
                  checked={selectedItems.size === cartItems.length}
                  onChange={handleSelectAll}
                  className="w-5 h-5 text-[#1e3a8a] rounded focus:ring-[#1e3a8a]"
                />
                <span className="font-semibold text-gray-700">
                  Select All ({cartItems.length} items)
                </span>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const displayPrice = item.special_price || item.unit_price;
                  const hasDiscount = item.special_price && item.special_price < item.unit_price;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-5 h-5 text-[#1e3a8a] rounded focus:ring-[#1e3a8a]"
                      />

                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          src="/cartridge.png"
                          alt={item.product_name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 mb-1 truncate">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Model: {item.model_number}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-[#1e3a8a]">
                            Rs. {displayPrice.toLocaleString()}
                          </p>
                          {hasDiscount && (
                            <p className="text-sm text-gray-400 line-through">
                              Rs. {item.unit_price.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right w-32">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-lg font-bold text-[#1e3a8a]">
                          Rs. {(displayPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] rounded-2xl shadow-xl p-6 text-white sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/90">
                  <span>Selected Items</span>
                  <span className="font-semibold">{selectedCount}</span>
                </div>
                <div className="flex justify-between text-white/90">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-bold">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedCount === 0}
                className="w-full bg-white text-[#1e3a8a] py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout Selected ({selectedCount})
              </button>

              <button
                onClick={() => navigate("/eg")}
                className="w-full mt-4 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </section>

      <EgFooter />
    </div>
  );
};

export default CartridgeCart;
