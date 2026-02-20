import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../../api/api";
import { getAuthToken, isAuthenticated, logout } from "../../utils/auth";

const EgNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Check if user is logged in
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [location]);

  // Update cart count
  useEffect(() => {
    const updateCartCount = async () => {
      const token = getAuthToken();

      if (token) {
        // Logged-in user: Fetch from API
        try {
          const response = await fetch(API_ENDPOINTS.CARTRIDGE_CART_GET, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            setCartCount(data.item_count || 0);
          } else {
            setCartCount(0);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          setCartCount(0);
        }
      } else {
        // Guest user: Use cartridgeCart from localStorage for EG products
        const cart = localStorage.getItem("cartridgeCart");
        if (cart) {
          try {
            const cartItems = JSON.parse(cart);
            const totalCount = cartItems.reduce(
              (sum: number, item: { quantity: number }) => sum + item.quantity,
              0,
            );
            setCartCount(totalCount);
          } catch (error) {
            console.error("Error parsing cart:", error);
            setCartCount(0);
          }
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
    logout();
    localStorage.removeItem("cartridgeCart"); // Clear guest cart on logout
    setIsLoggedIn(false);
    setShowUserMenu(false);
    setCartCount(0);
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full flex justify-center px-8 pt-6 absolute top-0 left-0 right-0 z-50">
      <div className="w-[85%] bg-white rounded-full shadow-xl px-8 py-2 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/eg")}
        >
          <img
            src="/assets/images/EG_Logo.webp"
            alt="EG Logo"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-10 text-gray-600 font-medium text-base">
          <button
            onClick={() => navigate("/eg")}
            className="hover:text-[#1e3a8a] transition-colors"
          >
            HOME
          </button>
          <button
            onClick={() => navigate("/eg/shop")}
            className="hover:text-[#1e3a8a] transition-colors"
          >
            SHOP
          </button>
          <button
            onClick={() => navigate("/eg/services")}
            className="hover:text-[#1e3a8a] transition-colors"
          >
            SERVICES
          </button>
          <button
            onClick={() => navigate("/eg/about")}
            className="hover:text-[#1e3a8a] transition-colors"
          >
            ABOUT US
          </button>
          <button
            onClick={() => navigate("/eg/contact")}
            className="hover:text-[#1e3a8a] transition-colors"
          >
            CONTACT
          </button>
        </div>

        {/* Search and User Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => navigate("/eg/cart")}
            className="relative text-gray-600 hover:text-[#1e3a8a] transition-colors p-2"
            aria-label="Shopping Cart"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {/* Cart Badge */}
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Sign In Button or User Icon */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white hover:bg-[#1e40af] transition-all"
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
                      navigate("/eg/my-orders");
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
              className="bg-[#1e3a8a] text-white px-10 py-3 rounded-full font-semibold hover:bg-[#1e40af] transition-all duration-200"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EgNavbar;
