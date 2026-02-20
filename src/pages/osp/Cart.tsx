import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/osp/Navbar";
import Footer from "../../components/osp/Footer";
import { API_ENDPOINTS } from "../../api/api";
import { getAuthToken, isAuthenticated } from "../../utils/auth";

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

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [apiCartItems, setApiCartItems] = useState<APICartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    loadCart();
  }, []);

  const loadCart = async () => {
    const token = getAuthToken();
    
    if (token) {
      // Load from API for logged-in users
      try {
        const response = await fetch(API_ENDPOINTS.CART, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.items) {
          setApiCartItems(data.items);
          // Select all items by default
          setSelectedItems(data.items.map((_: APICartItem, index: number) => index));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // Load from localStorage for non-logged-in users
      const cart = localStorage.getItem("cart");
      if (cart) {
        const items = JSON.parse(cart);
        setCartItems(items);
        setSelectedItems(items.map((_: CartItem, index: number) => index));
      }
      setLoading(false);
    }
  };

  const toggleSelectItem = (index: number) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleSelectAll = () => {
    const totalItems = isLoggedIn ? apiCartItems.length : cartItems.length;
    if (selectedItems.length === totalItems) {
      setSelectedItems([]);
    } else {
      setSelectedItems(Array.from({ length: totalItems }, (_, i) => i));
    }
  };

  const updateCart = (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = async (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    if (isLoggedIn) {
      // Update via API
      const item = apiCartItems[index];
      const token = getAuthToken();

      try {
        const response = await fetch(API_ENDPOINTS.CART_ITEM(item.id), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });

        if (response.ok) {
          // Reload cart to get updated data
          loadCart();
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      // Update localStorage
      const updatedCart = [...cartItems];
      updatedCart[index].quantity = newQuantity;
      updateCart(updatedCart);
    }
  };

  const removeItem = async (index: number) => {
    if (isLoggedIn) {
      // Remove via API
      const item = apiCartItems[index];
      const token = getAuthToken();

      try {
        const response = await fetch(API_ENDPOINTS.CART_ITEM(item.id), {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Reload cart to get updated data
          loadCart();
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      // Remove from localStorage
      const updatedCart = cartItems.filter((_, i) => i !== index);
      updateCart(updatedCart);
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      // Clear via API
      const token = getAuthToken();

      try {
        const response = await fetch(API_ENDPOINTS.CART, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setApiCartItems([]);
          setSelectedItems([]);
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      // Clear localStorage
      localStorage.removeItem("cart");
      setCartItems([]);
      setSelectedItems([]);
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleCheckout = (item: CartItem) => {
    navigate("/checkout", {
      state: {
        product: item.product,
        plan: item.plan,
      },
    });
  };

  const handleCheckoutSelected = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout");
      return;
    }
    
    if (isLoggedIn) {
      // Get selected API cart items
      const selectedCartItems = selectedItems.map(index => apiCartItems[index]);
      
      navigate("/checkout", {
        state: {
          apiCartItems: selectedCartItems,
          isMultipleItems: true,
          isFromAPI: true,
        },
      });
    } else {
      // Get selected localStorage items
      const selectedCartItems = selectedItems.map(index => cartItems[index]);
      
      navigate("/checkout", {
        state: {
          cartItems: selectedCartItems,
          isMultipleItems: true,
        },
      });
    }
  };

  const calculateSubtotal = () => {
    if (isLoggedIn) {
      return selectedItems.reduce((sum, index) => {
        const item = apiCartItems[index];
        return sum + item.subtotal;
      }, 0);
    } else {
      return selectedItems.reduce((sum, index) => {
        const item = cartItems[index];
        return sum + parseFloat(item.plan.price) * item.quantity;
      }, 0);
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const getSelectedItemsCount = () => {
    if (isLoggedIn) {
      return selectedItems.reduce((sum, index) => {
        return sum + apiCartItems[index].quantity;
      }, 0);
    } else {
      return selectedItems.reduce((sum, index) => {
        return sum + cartItems[index].quantity;
      }, 0);
    }
  };

  const totalItemsInCart = isLoggedIn ? apiCartItems.length : cartItems.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <Navbar />
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-40 px-4">
          <div className="text-center">
            <p className="text-gray-600 text-xl">Loading cart...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (totalItemsInCart === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <Navbar />
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-40 px-4">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-[#482072] mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Add some products to get started!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#6E4294] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#6E4294]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse Products
            </button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
  //     <Navbar />

  //     <section className="relative w-full min-h-screen flex flex-col items-center py-40 px-4">
  //       <div className="w-full max-w-6xl">
  //         {/* Header */}
  //         <div className="text-center mb-12">
  //           {/* <div className="inline-block bg-purple-100 px-6 py-2 rounded-full mb-4">
  //             <span className="text-[#7B5DE8] font-semibold text-sm">SHOPPING CART</span>
  //           </div> */}
  //           <h1 className="text-4xl md:text-5xl font-bold text-[#6E4294] mb-4">
  //             Your Cart
  //           </h1>
  //           <p className="text-gray-600 text-lg">
  //             {totalItemsInCart} {totalItemsInCart === 1 ? "item" : "items"} in
  //             your cart
  //           </p>
  //         </div>

  //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  //           {/* Cart Items */}
  //           <div className="lg:col-span-2 space-y-4">
  //             {/* Select All */}
  //             <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-center gap-3">
  //               <input
  //                 type="checkbox"
  //                 id="select-all"
  //                 checked={
  //                   selectedItems.length === totalItemsInCart &&
  //                   totalItemsInCart > 0
  //                 }
  //                 onChange={toggleSelectAll}
  //                 className="w-5 h-5 text-[#7B5DE8] border-gray-300 rounded focus:ring-[#7B5DE8] cursor-pointer"
  //               />
  //               <label
  //                 htmlFor="select-all"
  //                 className="font-semibold text-gray-700 cursor-pointer"
  //               >
  //                 Select All ({totalItemsInCart} items)
  //               </label>
  //             </div>

  //             {/* Display API Cart Items (Logged In) */}
  //             {isLoggedIn &&
  //               apiCartItems.map((item, index) => (
  //                 <div
  //                   key={index}
  //                   className={`bg-white rounded-2xl shadow-lg border-2 p-6 hover:shadow-xl transition-all ${
  //                     selectedItems.includes(index)
  //                       ? "border-[#7B5DE8]"
  //                       : "border-gray-100"
  //                   }`}
  //                 >
  //                   <div className="flex gap-6">
  //                     {/* Checkbox */}
  //                     <div className="flex-shrink-0 flex items-start pt-2">
  //                       <input
  //                         type="checkbox"
  //                         checked={selectedItems.includes(index)}
  //                         onChange={() => toggleSelectItem(index)}
  //                         className="w-5 h-5 text-[#7B5DE8] border-gray-300 rounded focus:ring-[#7B5DE8] cursor-pointer"
  //                       />
  //                     </div>

  //                     {/* Product Image Placeholder */}
  //                     <div className="flex-shrink-0">
  //                       <div className="w-24 h-24 bg-purple-50 rounded-lg flex items-center justify-center overflow-hidden">
  //                         <svg
  //                           className="w-12 h-12 text-[#7B5DE8]"
  //                           fill="currentColor"
  //                           viewBox="0 0 20 20"
  //                         >
  //                           <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  //                         </svg>
  //                       </div>
  //                     </div>

  //                     {/* Product Details */}
  //                     <div className="flex-1">
  //                       <div className="flex items-start justify-between mb-2">
  //                         <div>
  //                           <h3 className="text-xl font-bold text-[#482072]">
  //                             {item.product_name}
  //                           </h3>
  //                           <p className="text-gray-600 text-sm">
  //                             {item.brand_name}
  //                           </p>
  //                         </div>
  //                         <button
  //                           onClick={() => removeItem(index)}
  //                           className="text-red-500 hover:text-red-700 transition-colors p-2"
  //                           aria-label="Remove item"
  //                         >
  //                           <svg
  //                             className="w-6 h-6"
  //                             fill="none"
  //                             stroke="currentColor"
  //                             viewBox="0 0 24 24"
  //                           >
  //                             <path
  //                               strokeLinecap="round"
  //                               strokeLinejoin="round"
  //                               strokeWidth={2}
  //                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  //                             />
  //                           </svg>
  //                         </button>
  //                       </div>

  //                       <div className="mb-3">
  //                         <span className="inline-block bg-purple-100 text-[#7B5DE8] px-3 py-1 rounded text-xs font-semibold">
  //                           {item.plan_name}
  //                         </span>
  //                         <span className="ml-2 text-xs text-gray-500 capitalize">
  //                           {item.duration_type}
  //                         </span>
  //                         {item.price_changed && (
  //                           <span className="ml-2 text-xs text-orange-600 font-semibold">
  //                             Price Updated
  //                           </span>
  //                         )}
  //                       </div>

  //                       <div className="flex items-center justify-between">
  //                         {/* Quantity Controls */}
  //                         <div className="flex items-center gap-3">
  //                           <span className="text-gray-600 text-sm font-semibold">
  //                             Quantity:
  //                           </span>
  //                           <div className="flex items-center border-2 border-gray-200 rounded-lg">
  //                             <button
  //                               onClick={() =>
  //                                 updateQuantity(index, item.quantity - 1)
  //                               }
  //                               className="px-3 py-1 hover:bg-gray-100 transition-colors"
  //                               disabled={item.quantity <= 1}
  //                             >
  //                               −
  //                             </button>
  //                             <span className="px-4 py-1 border-x-2 border-gray-200 font-semibold">
  //                               {item.quantity}
  //                             </span>
  //                             <button
  //                               onClick={() =>
  //                                 updateQuantity(index, item.quantity + 1)
  //                               }
  //                               className="px-3 py-1 hover:bg-gray-100 transition-colors"
  //                             >
  //                               +
  //                             </button>
  //                           </div>
  //                         </div>

  //                         {/* Price */}
  //                         <div className="text-right">
  //                           <p className="text-2xl font-bold text-[#7B5DE8]">
  //                             Rs. {item.subtotal.toFixed(2)}
  //                           </p>
  //                           <p className="text-xs text-gray-500">
  //                             Rs. {item.unit_price} × {item.quantity}
  //                           </p>
  //                         </div>
  //                       </div>

  //                       {/* Checkout Button for Individual Item */}
  //                       <button
  //                         onClick={() => {
  //                           // For API items, we need to convert to the format expected by checkout
  //                           navigate("/checkout", {
  //                             state: {
  //                               apiCartItems: [item],
  //                               isMultipleItems: false,
  //                               isFromAPI: true,
  //                             },
  //                           });
  //                         }}
  //                         className="w-full mt-4 bg-white border-2 border-[#6E4294] text-[#6E4294] py-2 rounded-lg font-semibold hover:bg-[#6E4294] hover:text-white transition-all"
  //                       >
  //                         Checkout This Item
  //                       </button>
  //                     </div>
  //                   </div>
  //                 </div>
  //               ))}

  //             {/* Display LocalStorage Cart Items (Not Logged In) */}
  //             {!isLoggedIn &&
  //               cartItems.map((item, index) => (
  //                 <div
  //                   key={index}
  //                   className={`bg-white rounded-2xl shadow-lg border-2 p-6 hover:shadow-xl transition-all ${
  //                     selectedItems.includes(index)
  //                       ? "border-[#7B5DE8]"
  //                       : "border-gray-100"
  //                   }`}
  //                 >
  //                   <div className="flex gap-6">
  //                     {/* Checkbox */}
  //                     <div className="flex-shrink-0 flex items-start pt-2">
  //                       <input
  //                         type="checkbox"
  //                         checked={selectedItems.includes(index)}
  //                         onChange={() => toggleSelectItem(index)}
  //                         className="w-5 h-5 text-[#7B5DE8] border-gray-300 rounded focus:ring-[#7B5DE8] cursor-pointer"
  //                       />
  //                     </div>

  //                     {/* Product Image */}
  //                     <div className="flex-shrink-0">
  //                       <div className="w-24 h-24 bg-purple-50 rounded-lg flex items-center justify-center overflow-hidden">
  //                         {item.product.brand_image_url ? (
  //                           <img
  //                             src={item.product.brand_image_url}
  //                             alt={item.product.brand_name}
  //                             className="w-full h-full object-contain p-2"
  //                           />
  //                         ) : (
  //                           <svg
  //                             className="w-12 h-12 text-[#7B5DE8]"
  //                             fill="currentColor"
  //                             viewBox="0 0 20 20"
  //                           >
  //                             <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  //                           </svg>
  //                         )}
  //                       </div>
  //                     </div>

  //                     {/* Product Details */}
  //                     <div className="flex-1">
  //                       <div className="flex items-start justify-between mb-2">
  //                         <div>
  //                           <h3 className="text-xl font-bold text-[#6E4294]">
  //                             {item.product.name}
  //                           </h3>
  //                           <p className="text-gray-600 text-sm">
  //                             {item.product.brand_name}
  //                           </p>
  //                         </div>
  //                         <button
  //                           onClick={() => removeItem(index)}
  //                           className="text-red-500 hover:text-red-700 transition-colors p-2"
  //                           aria-label="Remove item"
  //                         >
  //                           <svg
  //                             className="w-6 h-6"
  //                             fill="none"
  //                             stroke="currentColor"
  //                             viewBox="0 0 24 24"
  //                           >
  //                             <path
  //                               strokeLinecap="round"
  //                               strokeLinejoin="round"
  //                               strokeWidth={2}
  //                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  //                             />
  //                           </svg>
  //                         </button>
  //                       </div>

  //                       <div className="mb-3">
  //                         <span className="inline-block bg-purple-100 text-[#7B5DE8] px-3 py-1 rounded text-xs font-semibold">
  //                           {item.plan.plan_name}
  //                         </span>
  //                         <span className="ml-2 text-xs text-gray-500 capitalize">
  //                           {item.plan.duration_type}
  //                         </span>
  //                       </div>

  //                       <p className="text-gray-600 text-sm mb-4">
  //                         {item.plan.features}
  //                       </p>

  //                       <div className="flex items-center justify-between">
  //                         {/* Quantity Controls */}
  //                         <div className="flex items-center gap-3">
  //                           <span className="text-gray-600 text-sm font-semibold">
  //                             Quantity:
  //                           </span>
  //                           <div className="flex items-center border-2 border-gray-200 rounded-lg">
  //                             <button
  //                               onClick={() =>
  //                                 updateQuantity(index, item.quantity - 1)
  //                               }
  //                               className="px-3 py-1 hover:bg-gray-100 transition-colors"
  //                               disabled={item.quantity <= 1}
  //                             >
  //                               −
  //                             </button>
  //                             <span className="px-4 py-1 border-x-2 border-gray-200 font-semibold">
  //                               {item.quantity}
  //                             </span>
  //                             <button
  //                               onClick={() =>
  //                                 updateQuantity(index, item.quantity + 1)
  //                               }
  //                               className="px-3 py-1 hover:bg-gray-100 transition-colors"
  //                             >
  //                               +
  //                             </button>
  //                           </div>
  //                         </div>

  //                         {/* Price */}
  //                         <div className="text-right">
  //                           {item.plan.has_discount &&
  //                             item.plan.original_price && (
  //                               <p className="text-sm text-gray-400 line-through">
  //                                 Rs.{" "}
  //                                 {parseFloat(item.plan.original_price) *
  //                                   item.quantity}
  //                               </p>
  //                             )}
  //                           <p className="text-2xl font-bold text-[#7B5DE8]">
  //                             Rs.{" "}
  //                             {(
  //                               parseFloat(item.plan.price) * item.quantity
  //                             ).toFixed(2)}
  //                           </p>
  //                         </div>
  //                       </div>

  //                       {/* Checkout Button for Individual Item */}
  //                       <button
  //                         onClick={() => handleCheckout(item)}
  //                         className="w-full mt-4 bg-white border-2 border-[#6E4294] text-[#6E4294] py-2 rounded-lg font-semibold hover:bg-[#6E4294] hover:text-white transition-all"
  //                       >
  //                         Checkout This Item
  //                       </button>
  //                     </div>
  //                   </div>
  //                 </div>
  //               ))}

  //             {/* Clear Cart Button */}
  //             <button
  //               onClick={clearCart}
  //               className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-all border-2 border-red-200"
  //             >
  //               Clear Cart
  //             </button>
  //           </div>

  //           {/* Order Summary */}
  //           <div className="lg:col-span-1">
  //             <div className="bg-gradient-to-br from-[#6E4294] to-[#6E4294]/80 rounded-2xl shadow-xl p-8 text-white sticky top-32">
  //               <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

  //               {/* Summary Details */}
  //               <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
  //                 <div className="flex justify-between text-white/90">
  //                   <span>Selected Items</span>
  //                   <span className="font-semibold">
  //                     {selectedItems.length}
  //                   </span>
  //                 </div>
  //                 <div className="flex justify-between text-white/90">
  //                   <span>Total Quantity</span>
  //                   <span className="font-semibold">
  //                     {getSelectedItemsCount()}
  //                   </span>
  //                 </div>
  //                 <div className="flex justify-between text-white/90">
  //                   <span>Subtotal</span>
  //                   <span className="font-semibold">
  //                     Rs. {calculateSubtotal().toFixed(2)}
  //                   </span>
  //                 </div>
  //               </div>

  //               {/* Total */}
  //               <div className="flex justify-between items-center mb-6">
  //                 <span className="text-xl font-bold">Total</span>
  //                 <span className="text-3xl font-bold">
  //                   Rs. {calculateTotal().toFixed(2)}
  //                 </span>
  //               </div>

  //               {/* Checkout Selected Button */}
  //               <button
  //                 onClick={handleCheckoutSelected}
  //                 disabled={selectedItems.length === 0}
  //                 className="w-full bg-white text-[#482072] py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
  //               >
  //                 Checkout Selected ({selectedItems.length})
  //               </button>

  //               {/* Info */}
  //               <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
  //                 <p className="text-white/80 text-sm">
  //                   {selectedItems.length === 0
  //                     ? "Select items to checkout"
  //                     : "You can checkout selected items or continue shopping."}
  //                 </p>
  //               </div>

  //               {/* Continue Shopping */}
  //               <button
  //                 onClick={() => navigate("/")}
  //                 className="w-full bg-white text-[#482072] py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
  //               >
  //                 Continue Shopping
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>

  //     <Footer />
  //   </div>
  // );


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Navbar />

      <section className="relative w-full min-h-screen flex flex-col items-center pt-28 sm:pt-32 lg:pt-40 pb-16 px-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6E4294] mb-3">
              Your Cart
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              {totalItemsInCart} {totalItemsInCart === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={
                    selectedItems.length === totalItemsInCart &&
                    totalItemsInCart > 0
                  }
                  onChange={toggleSelectAll}
                  className="w-5 h-5 text-[#7B5DE8] border-gray-300 rounded focus:ring-[#7B5DE8] cursor-pointer"
                />
                <label
                  htmlFor="select-all"
                  className="font-semibold text-gray-700 cursor-pointer"
                >
                  Select All ({totalItemsInCart} items)
                </label>
              </div>

              {/* ===================== LOGGED IN (API) ===================== */}
              {isLoggedIn &&
                apiCartItems.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl shadow-lg border-2 p-4 sm:p-6 hover:shadow-xl transition-all overflow-hidden ${
                      selectedItems.includes(index)
                        ? "border-[#7B5DE8]"
                        : "border-gray-100"
                    }`}
                  >
                    {/* top bar (mobile friendly) */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(index)}
                        onChange={() => toggleSelectItem(index)}
                        className="w-5 h-5 text-[#7B5DE8] border-gray-300 rounded focus:ring-[#7B5DE8] cursor-pointer mt-1"
                      />

                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 -mr-2"
                        aria-label="Remove item"
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

                    {/* main layout: stack on mobile */}
                    <div className="flex flex-col gap-4">
                      {/* image + info */}
                      <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-purple-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          <svg
                            className="w-8 h-8 sm:w-12 sm:h-12 text-[#7B5DE8]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>

                        {/* IMPORTANT: min-w-0 prevents overflow */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-[#482072] break-words">
                            {item.product_name}
                          </h3>
                          <p className="text-gray-600 text-sm break-words">
                            {item.brand_name}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-block bg-purple-100 text-[#7B5DE8] px-3 py-1 rounded text-xs font-semibold">
                              {item.plan_name}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {item.duration_type}
                            </span>
                            {item.price_changed && (
                              <span className="text-xs text-orange-600 font-semibold">
                                Price Updated
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* quantity + price: stack on mobile */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center justify-between sm:justify-start gap-3">
                          <span className="text-gray-600 text-sm font-semibold whitespace-nowrap">
                            Quantity:
                          </span>

                          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(index, item.quantity - 1)
                              }
                              className="w-10 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="w-12 h-9 flex items-center justify-center border-x-2 border-gray-200 font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(index, item.quantity + 1)
                              }
                              className="w-10 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-left sm:text-right min-w-0">
                          <p className="text-xl sm:text-2xl font-bold text-[#7B5DE8] break-words">
                            Rs. {item.subtotal.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 break-words">
                            Rs. {item.unit_price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          navigate("/checkout", {
                            state: {
                              apiCartItems: [item],
                              isMultipleItems: false,
                              isFromAPI: true,
                            },
                          });
                        }}
                        className="w-full bg-white border-2 border-[#6E4294] text-[#6E4294] py-3 rounded-xl font-semibold hover:bg-[#6E4294] hover:text-white transition-all"
                      >
                        Checkout This Item
                      </button>
                    </div>
                  </div>
                ))}

              {/* ===================== NOT LOGGED IN (LOCAL) ===================== */}
              {!isLoggedIn &&
                cartItems.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl shadow-lg border-2 p-4 sm:p-6 hover:shadow-xl transition-all overflow-hidden ${
                      selectedItems.includes(index)
                        ? "border-[#7B5DE8]"
                        : "border-gray-100"
                    }`}
                  >
                    {/* top bar */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(index)}
                        onChange={() => toggleSelectItem(index)}
                        className="w-5 h-5 text-[#7B5DE8] border-gray-300 rounded focus:ring-[#7B5DE8] cursor-pointer mt-1"
                      />

                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 -mr-2"
                        aria-label="Remove item"
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

                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-purple-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.product.brand_image_url ? (
                            <img
                              src={item.product.brand_image_url}
                              alt={item.product.brand_name}
                              className="w-full h-full object-contain p-2"
                            />
                          ) : (
                            <svg
                              className="w-8 h-8 sm:w-12 sm:h-12 text-[#7B5DE8]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-[#6E4294] break-words">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-600 text-sm break-words">
                            {item.product.brand_name}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-block bg-purple-100 text-[#7B5DE8] px-3 py-1 rounded text-xs font-semibold">
                              {item.plan.plan_name}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                              {item.plan.duration_type}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mt-2 break-words">
                            {item.plan.features}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center justify-between sm:justify-start gap-3">
                          <span className="text-gray-600 text-sm font-semibold whitespace-nowrap">
                            Quantity:
                          </span>
                          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(index, item.quantity - 1)
                              }
                              className="w-10 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="w-12 h-9 flex items-center justify-center border-x-2 border-gray-200 font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(index, item.quantity + 1)
                              }
                              className="w-10 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-left sm:text-right min-w-0">
                          {item.plan.has_discount &&
                            item.plan.original_price && (
                              <p className="text-sm text-gray-400 line-through break-words">
                                Rs.{" "}
                                {parseFloat(item.plan.original_price) *
                                  item.quantity}
                              </p>
                            )}
                          <p className="text-xl sm:text-2xl font-bold text-[#7B5DE8] break-words">
                            Rs.{" "}
                            {(
                              parseFloat(item.plan.price) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCheckout(item)}
                        className="w-full bg-white border-2 border-[#6E4294] text-[#6E4294] py-3 rounded-xl font-semibold hover:bg-[#6E4294] hover:text-white transition-all"
                      >
                        Checkout This Item
                      </button>
                    </div>
                  </div>
                ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-all border-2 border-red-200"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#6E4294] to-[#6E4294]/80 rounded-2xl shadow-xl p-6 sm:p-8 text-white lg:sticky lg:top-32">
                <h2 className="text-xl sm:text-2xl font-bold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                  <div className="flex justify-between text-white/90">
                    <span>Selected Items</span>
                    <span className="font-semibold">
                      {selectedItems.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/90">
                    <span>Total Quantity</span>
                    <span className="font-semibold">
                      {getSelectedItemsCount()}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/90">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      Rs. {calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg sm:text-xl font-bold">Total</span>
                  <span className="text-2xl sm:text-3xl font-bold break-words">
                    Rs. {calculateTotal().toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckoutSelected}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-white text-[#482072] py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Checkout Selected ({selectedItems.length})
                </button>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                  <p className="text-white/80 text-sm">
                    {selectedItems.length === 0
                      ? "Select items to checkout"
                      : "You can checkout selected items or continue shopping."}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-white text-[#482072] py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
