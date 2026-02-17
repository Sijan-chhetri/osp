import React from "react";
import { useNavigate } from "react-router-dom";

const EgNavbar: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full flex justify-center px-8 pt-6 absolute top-0 left-0 right-0 z-50">
      <div className="w-[85%] bg-white rounded-full shadow-xl px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-4xl font-bold">
            <span className="text-[#1e3a8a]">E</span>
            <span className="text-[#dc2626]">G</span>
          </div>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-10 text-gray-600 font-medium text-base">
          <button onClick={() => scrollToSection("hero")} className="hover:text-[#1e3a8a] transition-colors">
            HOME
          </button>
          <button onClick={() => scrollToSection("shop")} className="hover:text-[#1e3a8a] transition-colors">
            SHOP
          </button>
          <button onClick={() => scrollToSection("services")} className="hover:text-[#1e3a8a] transition-colors">
            SERVICES
          </button>
          <button onClick={() => scrollToSection("about")} className="hover:text-[#1e3a8a] transition-colors">
            ABOUT US
          </button>
          <button onClick={() => scrollToSection("contact")} className="hover:text-[#1e3a8a] transition-colors">
            CONTACT
          </button>
        </div>

        {/* Search and Sign In */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="bg-[#1e3a8a] text-white px-10 py-3 rounded-full font-semibold hover:bg-[#1e40af] transition-all duration-200">
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  );
};

export default EgNavbar;
