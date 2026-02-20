// CartridgeAbout.tsx
import React from "react";
import EgNavbar from "../../components/eg/egNavbar";
import EgFooter from "../../components/eg/egFooter";
import { useNavigate } from "react-router-dom";


const CartridgeAbout: React.FC = () => {
    const navigate = useNavigate();

    return (
      <div className="min-h-screen flex flex-col">
        {/* Navbar + Hero share SAME background (no visible line) */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#092D5A] via-[#0b3a73] to-[#D32721]">
          {/* Optional subtle texture / overlay (looks like the reference image) */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Optional “image-like” blobs */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-28 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <EgNavbar />

            {/* Hero / Banner Section */}
            <div className="pt-36 pb-16 px-6 md:px-10">
              <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight">
                  About Us
                </h1>

                <p className="mt-4 text-white/80 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
                  We help customers find the right ink & toner cartridges with
                  trusted guidance, fair pricing, and reliable delivery support.
                  Share your printer model and we’ll recommend the best match.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Page Content */}
        <main className="flex-1 bg-white">
          <section className="px-6 md:px-10 py-14">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left */}
              <div className="lg:col-span-1">
                <h2 className="text-2xl font-extrabold text-[#092D5A]">
                  Who we are
                </h2>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  EG Cartridge focuses on quality cartridges and honest support.
                  We help you avoid wrong purchases by matching cartridges to
                  your exact printer model.
                </p>
              </div>

              {/* Right cards */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-[#092D5A]">Fast Assistance</h3>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    Quick help to identify the correct cartridge by printer
                    brand, model, and cartridge code.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-[#092D5A]">Quality Focus</h3>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    Consistent print quality with options that fit your budget
                    and printing needs.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-[#092D5A]">Delivery Support</h3>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    Smooth ordering and delivery support, including bulk
                    purchase guidance.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-[#092D5A]">Customer First</h3>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    We prioritize clarity, transparency, and the right solution
                    — not upselling.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =======================
    Why Choose Our Cartridge Section
    ======================= */}
          <section className="relative bg-gray-50 py-20 px-6 md:px-10 overflow-hidden">
            {/* Decorative Background Shape */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#092D5A]/10 to-[#D32721]/10 rounded-full blur-3xl" />

            <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#092D5A] leading-tight">
                  Perfect Cartridge to Enhance Your
                  <span className="block text-[#D32721] mt-2">
                    Printing Experience
                  </span>
                </h2>

                <p className="mt-6 text-gray-600 text-base leading-relaxed">
                  We focus on quality, sustainability, and customer satisfaction
                  to deliver the best cartridge solutions for your printer.
                </p>

                {/* Bullet Points */}
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-[#092D5A] text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">Easy Refill System.</span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-[#092D5A] text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">
                      Eco-Friendly & Sustainable.
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-[#092D5A] text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">
                      Free Toner Pack with Every Cartridge Purchase.
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-[#092D5A] text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">
                      Designed for quick refill in minutes — no technician
                      required.
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-[#092D5A] text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">
                      High-quality cartridge accessories curated carefully.
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-[#092D5A] text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">
                      One goal in mind — Customer Satisfaction.
                    </span>
                  </li>
                </ul>

                {/* CTA */}
                <div className="mt-10">
                  <button
                    onClick={() => navigate("/eg/shop")}
                    className="px-8 py-3 rounded-xl bg-[#D32721] text-white font-semibold shadow-md hover:bg-[#b41f1a] hover:shadow-lg transition"
                  >
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Right Visual Card */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
                  <h3 className="text-xl font-bold text-[#092D5A]">
                    Why Customers Choose Us
                  </h3>

                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Customers seek reliable, long-lasting printing performance.
                    We combine affordability, sustainability, and user-friendly
                    design to give you the best cartridge experience.
                  </p>

                  <div className="mt-6 p-6 rounded-2xl bg-[#092D5A] text-white">
                    <p className="text-lg font-semibold">
                      "Quality Prints. Easy Refills. Guaranteed Satisfaction."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <EgFooter />
      </div>
    );
};

export default CartridgeAbout;
