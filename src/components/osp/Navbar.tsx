import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { getAuthToken, isAuthenticated, isDistributor, logout } from "../../utils/auth";


/** ✅ Declared outside render */
const MobileNavButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 text-[#4b4b4b] font-semibold hover:bg-[#6E4294]/10 transition-colors"
  >
    {label}
  </button>
);

const Navbar: React.FC = () => {
  const { isVisible, isScrolling } = useScrollDirection();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = isAuthenticated();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleBtnRef = useRef<HTMLButtonElement | null>(null); // ✅ NEW

  const closeMenus = () => {
    setShowUserMenu(false);
    setMobileMenuOpen(false);
  };

  const navigateTo = (path: string) => {
    closeMenus();
    navigate(path);
  };

  // Outside click close (ignore toggle button clicks)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;

      // If click is on hamburger/close button, ignore
      if (
        mobileToggleBtnRef.current &&
        mobileToggleBtnRef.current.contains(t)
      ) {
        return;
      }

      if (
        showUserMenu &&
        userMenuRef.current &&
        !userMenuRef.current.contains(t)
      ) {
        setShowUserMenu(false);
      }

      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(t)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu, mobileMenuOpen]);

  // Cart count
  useEffect(() => {
    const updateCartCount = async () => {
      const token = getAuthToken();

      if (token) {
        try {
          const response = await fetch("http://localhost:3001/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
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
        const cart = localStorage.getItem("cart");
        if (cart) {
          const cartItems = JSON.parse(cart);
          const totalCount = cartItems.reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0,
          );
          setCartCount(totalCount);
        } else {
          setCartCount(0);
        }
      }
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate("/");
  };

  const scrollToSection = (sectionId: string) => {
    closeMenus();

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleActivationClick = () => {
    closeMenus();
    navigate("/activation");
  };

  return (
    <div
      className={`w-full flex justify-center fixed top-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className={`w-[92%] lg:w-[70%] bg-white/90 backdrop-blur-md rounded-full px-4 md:px-5 py-2 flex items-center shadow-lg shadow-white/50 mt-[20px] md:mt-[43px] transition-all duration-300 ${
          isScrolling
            ? "border-2 border-[#7B5DE8]"
            : "border-2 border-transparent"
        }`}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center overflow-hidden">
            <img
              src="/assets/images/OSP_Logo.png"
              alt="OSP Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>
        </div>

        {/* Desktop Menu (only lg+) */}
        <div className="hidden lg:flex flex-1 justify-evenly text-[#727272] font-semibold text-lg text-center mx-6">
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
          <button
            onClick={() => navigateTo("/services")}
            className="hover:text-[#6E4294] transition-colors"
          >
            Services
          </button>
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

        {/* Right Side */}
        <div className="flex items-center gap-3 lg:gap-4 ml-auto">
          {/* Cart */}
          <button
            onClick={() => navigateTo("/cart")}
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13L4.707 15.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Login/User from md+ */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
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

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {!isDistributor() && (
                      <button
                        onClick={() => navigateTo("/profile")}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        My Profile
                      </button>
                    )}
                    <button
                      onClick={() => navigateTo("/orders")}
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
                onClick={() => navigateTo("/user-login")}
                className="bg-transparent border-2 border-[#6E4294] text-[#6E4294] px-5 py-2 rounded-full hover:bg-[#6E4294] hover:text-white transition-all duration-200 text-sm font-semibold"
              >
                Login
              </button>
            )}
          </div>

          {/* Activation only lg+ */}
          <button
            onClick={handleActivationClick}
            className="hidden lg:inline-flex bg-[#6E4294] text-white lg:px-5 xl:px-8 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-200 text-lg font-semibold"
          >
            Get Activation Key
          </button>

          {/* Hamburger (md & down, hidden on lg+) */}
          <button
            ref={mobileToggleBtnRef}
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevent outside-click from interfering
              setMobileMenuOpen((v) => !v);
            }}
            className="lg:hidden w-11 h-11 rounded-full border border-[#6E4294]/30 text-[#6E4294] flex items-center justify-center hover:bg-[#6E4294]/10 transition"
            aria-label="Open Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-[110px] left-0 right-0 z-50 px-4"
          >
            <motion.div
              ref={mobileMenuRef}
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden mx-auto w-[92%] lg:w-[70%]"
              onClick={(e) => e.stopPropagation()} // ✅ protect inside clicks
            >
              <div className="py-2">
                <MobileNavButton
                  label="Home"
                  onClick={() => scrollToSection("hero")}
                />
                <MobileNavButton
                  label="Products"
                  onClick={() => scrollToSection("products")}
                />
                <MobileNavButton
                  label="Services"
                  onClick={() => navigateTo("/services")}
                />
                <MobileNavButton
                  label="About"
                  onClick={() => scrollToSection("why-choose")}
                />
                <MobileNavButton
                  label="Contact"
                  onClick={() => scrollToSection("contact")}
                />
              </div>

              <div className="border-t border-gray-200 py-2">
                {isLoggedIn ? (
                  <>
                    {!isDistributor() && (
                      <MobileNavButton
                        label="My Profile"
                        onClick={() => navigateTo("/profile")}
                      />
                    )}
                    <MobileNavButton
                      label="My Orders"
                      onClick={() => navigateTo("/orders")}
                    />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigateTo("/user-login")}
                    className="w-full text-left px-4 py-3 text-[#6E4294] font-semibold hover:bg-[#6E4294]/10 transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>

              <div className="border-t border-gray-200 p-3">
                <button
                  onClick={handleActivationClick}
                  className="w-full bg-[#6E4294] text-white py-3 rounded-xl shadow-md hover:scale-[1.01] transition-transform font-semibold"
                >
                  Get Activation Key
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
