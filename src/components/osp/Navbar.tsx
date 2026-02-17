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
        className={`w-[70%] bg-white/90 backdrop-blur-md rounded-full px-6 py-2 flex items-center shadow-lg shadow-white/50 mt-[43px] transition-all duration-300 ${
          isScrolling ? "border-2 border-[#7B5DE8]" : "border-2 border-transparent"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#7B5DE8] flex items-center justify-center text-white text-xl font-bold">
            O
          </div>
        </div>

        {/* Menu */}
        <div className="hidden md:flex flex-1 justify-evenly text-gray-700 font-semibold text-lg text-center mx-6">
          <button onClick={() => scrollToSection("hero")} className="hover:text-[#7B5DE8] transition-colors">
            Home
          </button>
          <button onClick={() => scrollToSection("products")} className="hover:text-[#7B5DE8] transition-colors">
            Products
          </button>
          <button onClick={() => scrollToSection("how-it-works")} className="hover:text-[#7B5DE8] transition-colors">
            How it Works
          </button>
          <button onClick={() => scrollToSection("why-choose")} className="hover:text-[#7B5DE8] transition-colors">
            About
          </button>
          <button onClick={() => scrollToSection("contact")} className="hover:text-[#7B5DE8] transition-colors">
            Contact
          </button>
        </div>

        {/* Button */}
        <button
          onClick={handleActivationClick}
          className="bg-[#7B5DE8] text-white px-8 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-200 text-xl font-semibold"
        >
          Get Activation Key
        </button>
      </div>
    </div>
  );
};

export default Navbar;
