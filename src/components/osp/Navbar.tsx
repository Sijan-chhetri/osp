import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useScrollDirection } from "../../hooks/useScrollDirection";

const Navbar: React.FC = () => {
  const { isVisible, isScrolling } = useScrollDirection();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, [location]);

  // Update cart count
  useEffect(() => {
    const updateCartCount = async () => {
      const token = localStorage.getItem("userToken");
      
      if (token) {
        // Fetch cart count from API for logged-in users
        try {
          const response = await fetch("http://localhost:3001/api/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setCartCount(data.item_count || 0);
          } else {
            setCartCount(0);
          }
        } catch (error) {
          console.error("Error fetching cart count:", error);
          setCartCount(0);
        }
      } else {
        // Use localStorage for non-logged-in users
        const cart = localStorage.getItem("cart");
        if (cart) {
          const cartItems = JSON.parse(cart);
          const totalCount = cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
          setCartCount(totalCount);
        } else {
          setCartCount(0);
        }
      }
    };

    // Initial count
    updateCartCount();

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartCount);
    
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowUserMenu(false);
    navigate("/");
  };

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleActivationClick = () => {
    navigate("/activation");
  };

  return (
    <div
      className={`w-full flex justify-center fixed top-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className={`w-[70%] bg-white/90 backdrop-blur-md rounded-full px-5 py-2 flex items-center shadow-lg shadow-white/50 mt-[43px] transition-all duration-300 ${
          isScrolling
            ? "border-2 border-[#7B5DE8]"
            : "border-2 border-transparent"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
            <img
              src="assets/images/OSP_Logo.png"
              alt="Logo"
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>

        {/* Menu */}
        <div className="hidden md:flex flex-1 justify-evenly text-[#727272] font-semibold text-lg text-center mx-6">
          <button
            onClick={() => scrollToSection("hero")}
            className="hover:text-[#6E4294] transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("products")}
            className="hover:text-[#6E4294] transition-colors"
          >
            Products
          </button>
          {/* <button
            onClick={() => scrollToSection("how-it-works")}
            className="hover:text-[#6E4294] transition-colors"
          >
            How it Works
          </button> */}
          <button
            onClick={() => scrollToSection("why-choose")}
            className="hover:text-[#6E4294] transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="hover:text-[#6E4294] transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <button
            onClick={() => navigate("/cart")}
            className="relative text-[#6E4294] hover:text-[#7B5DE8] transition-colors"
            aria-label="Shopping Cart"
          >
            <svg
              className="w-7 h-7"
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
            {/* Cart Badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Login Button or User Icon */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-[#6E4294] rounded-full flex items-center justify-center text-white hover:bg-[#7B5DE8] transition-all"
                aria-label="User Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/orders");
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    My Orders
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/user-login")}
              className="bg-transparent border-2 border-[#6E4294] text-[#6E4294] px-6 py-2 rounded-full hover:bg-[#6E4294] hover:text-white transition-all duration-200 text-base font-semibold"
            >
              Login
            </button>
          )}

          {/* Get Activation Key Button */}
          <button
            onClick={handleActivationClick}
            className="bg-[#6E4294] text-white px-8 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-200 text-xl font-semibold"
          >
            Get Activation Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
