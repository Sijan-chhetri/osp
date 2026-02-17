import React from "react";
import { useBrands } from "../../hooks/icon"; // Import the icons hook

interface BrandItem {
  name: string;
  color: string;
  icon?: React.ReactNode;
  bgColor?: string;
}

const BrandIcon: React.FC<BrandItem> = ({ name, color, bgColor, icon }) => {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      {icon ? (
        <div className={bgColor ? `${bgColor} p-2 rounded` : ""}>
          <div className={bgColor ? "text-white" : color}>{icon}</div>
        </div>
      ) : (
        bgColor && (
          <div className={`${bgColor} p-2 rounded`}>
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
          </div>
        )
      )}
      <span className={`font-semibold ${color} text-lg`}>{name}</span>
    </div>
  );
};

const Hero: React.FC = () => {
  const brands = useBrands(); // Use the icons hook

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-[#482072] flex flex-col items-center overflow-hidden"
    >
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Hero Content - Ellipse White Container */}
      <div
        className="relative z-10 flex flex-col items-center justify-start w-full"
        style={{ height: "900px" }}
      >
        <div
          className="bg-white flex flex-col items-center justify-start absolute overflow-hidden"
          style={{
            width: "1711px",
            height: "1122px",
            top: "119px",
            left: "-136px",
            borderRadius: "50%",
            boxShadow:
              "0px -20px 33px 0px #FFFFFF42, 0px -40px 60px 20px #FFFFFF30, 0px -60px 80px 40px #FFFFFF20, inset 0px 20px 40px 0px rgba(255, 255, 255, 0.15), inset 0px 40px 70px 15px rgba(72, 32, 114, 0.3), inset 0px 80px 120px 40px rgba(72, 32, 114, 0.4), inset 0px 120px 160px 80px rgba(72, 32, 114, 0.25)",
          }}
        >
          <div className="flex flex-col items-center justify-start w-full pt-20 px-6">
            <span className="text-white text-base mb-6 px-8 py-1 border-2 border-white rounded-full relative z-20 font-medium bg-[#482072]/25 flex items-center gap-2 backdrop-blur-md">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              Trusted by 500+ Customers
            </span>

            <h1 className="text-4xl md:text-4xl font-bold text-[#482072] mb-2 text-center max-w-2xl relative z-20">
              Power Your Digital World with
            </h1>

            <h2 className="text-5xl md:text-7xl font-extrabold text-[#6E4294] mb-6 text-center max-w-2xl relative z-20">
              Genuine Software
            </h2>

            <p className="text-[#727272] max-w-2xl mb-8 text-center text-lg relative z-20">
              Get 100% genuine licenses for productivity, security, creativity,
              and business tools — delivered instantly with dedicated customer
              support.
            </p>

            {/* Hero Buttons */}
            <div className="flex gap-4 flex-wrap justify-center mb-12 relative z-20">
              <button className="bg-[#6E4294] text-white px-8 py-3 rounded-xl shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold">
                Get Your License →
              </button>
              <button className="bg-transparent border-2 border-[#6E4294] text-[#6E4294] px-8 py-3 rounded-xl hover:bg-[#7B5DE8]/10 transition-all duration-200 font-semibold">
                Browse Products
              </button>
            </div>

            {/* Features Section */}
            <div className="flex gap-8 flex-wrap justify-center relative z-20">
              <div className="flex items-center gap-3">
                <div className="bg-[#7B5DE8]/20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-[#6E4294]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#6E4294]">100% Genuine</p>
                  <p className="text-[#7E6995] text-sm">Authentic Licenses</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#7B5DE8]/20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-[#6E4294]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#6E4294]">24/7 Support</p>
                  <p className="text-[#7E6995] text-sm">Always Available</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#7B5DE8]/20 p-3 rounded-lg">
                  <svg
                    className="w-6 h-6 text-[#6E4294]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#6E4294]">500+</p>
                  <p className="text-[#7E6995] text-sm">Happy Customers</p>
                </div>
              </div>
            </div>

            {/* Available Software Brands Section */}
            <div className="relative z-20 mt-12 w-full flex flex-col items-center justify-center">
              <h1 className="text-center text-[#6E4294] font-bold text-3xl mb-8 animate-fade-in">
                AVAILABLE SOFTWARE BRANDS
              </h1>
              <div className="relative overflow-hidden w-full max-w-5xl mx-auto">
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                <div className="flex gap-10 animate-scroll-infinite">
                  {brands.map((brand, index) => (
                    <BrandIcon key={`brand-${index}`} {...brand} />
                  ))}
                  {brands.map((brand, index) => (
                    <BrandIcon key={`brand-duplicate-${index}`} {...brand} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
