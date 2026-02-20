import React from "react";

const EgFooter: React.FC = () => {
  return (
    <footer className="w-full" style={{ backgroundColor: "#EFDEE1" }}>
      {/* Main Footer Content */}
      <div className="px-16 py-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Side - Logo and Tagline */}
          <div className="flex items-center gap-4">
            <img
              src="/assets/images/EG_Logo.webp" 
              alt="EG Logo"
              className="h-20 w-auto object-contain"
            />
            <div>
              <h3 className="text-[#1e3a8a] font-bold text-2xl">EGCartridge</h3>
              <p className="text-gray-500 text-sm">
                Premium Printer Cartridges for
                <br />
                Sharp, Reliable Printing
              </p>
            </div>
          </div>

          {/* Right Side - Contact Info */}
          <div className="text-right">
            <p className="text-[#1e3a8a] font-medium mb-2">
              Pokhara 27, Sisuwa, Kaski Gandaki Nepal
            </p>
            <div className="flex items-center justify-end gap-6">
              <a
                href="tel:+9779061565002"
                className="flex items-center gap-2 text-[#1e3a8a] hover:text-[#1e40af]"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                +977 061565002
              </a>
              <a
                href="mailto:info@egcartridge.com"
                className="flex items-center gap-2 text-[#1e3a8a] hover:text-[#1e40af]"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                info@egcartridge.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-300 py-4">
        <p className="text-center text-[#1e3a8a] text-sm">
          2026 EGCartridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default EgFooter;
