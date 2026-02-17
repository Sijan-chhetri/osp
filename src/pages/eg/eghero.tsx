import React from "react";
import EgNavbar from "../../components/eg/egNavbar";

const EgHero: React.FC = () => {
  return (
    <div className="p-5">
      <section
        id="hero"
        className="relative w-full h-[85vh] flex flex-col"
        style={{
          background: "radial-gradient(ellipse 150% 100% at bottom center, #ffffff 0%, #e5e7eb 20%, #991b1b 45%, #7f1d1d 55%, #1e3a8a 75%, #0f172a 100%)",
          borderRadius: "20px",
        }}
      >
        {/* Navbar - Centered Floating */}
        <EgNavbar />

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-between px-16 pt-32 pb-16 max-w-7xl mx-auto w-full">
          {/* Left Side - Text Content */}
          <div className="flex-1 max-w-xl">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-white text-2xl font-medium">Print with Precision</h2>
              <h1 className="text-white text-6xl font-bold">
                PRINT WITH <span className="text-white" style={{ 
                  WebkitTextStroke: "2px #ffffffff",
                  WebkitTextFillColor: "transparent"
                }}>CONFIDENCE</span>
              </h1>
            </div>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Original and high-quality compatible cartridges for home, office, and business use. Crisp prints, long-lasting performance, and affordable pricing.
            </p>

            {/* Shop Now Button */}
            <button className="bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#1e40af] transition-all duration-300 flex items-center gap-2 group">
              Shop Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Right Side - Cartridge Image */}
          <div className="flex-1 flex items-start justify-end pr-[26px] pb-[30px] pt-32">
            <div className="relative">
              <img
                src="/cartridge.png"
                alt="EG Premium Laser Toner Cartridge"
                className="w-full max-w-2xl object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EgHero;
