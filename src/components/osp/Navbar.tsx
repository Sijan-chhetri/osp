import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useScrollDirection } from "../../hooks/useScrollDirection";

const Navbar: React.FC = () => {
  const { isVisible, isScrolling } = useScrollDirection();
  const navigate = useNavigate();
  const location = useLocation();

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
            ? ""
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
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="hover:text-[#6E4294] transition-colors"
          >
            How it Works
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

        {/* Button */}
        <button
          onClick={handleActivationClick}
          className="bg-[#6E4294] text-white px-8 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-200 text-xl font-semibold"
        >
          Get Activation Key
        </button>
      </div>
    </div>
  );
};

export default Navbar;
