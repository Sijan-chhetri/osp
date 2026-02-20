import React from "react";
import { useBrands } from "../../hooks/icon";
import { MdOutlineHeadsetMic } from "react-icons/md";
import { motion } from "framer-motion";

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

const fadeUpContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.6, // starts shortly after h2 animation
    },
  },
};

const fadeUpItem = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const Hero: React.FC = () => {
  const brands = useBrands();

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-[#482072] overflow-hidden"
    >
      {/* Responsive glowing circle background */}
      <div
        className="pointer-events-none absolute left-1/2 top-[120px] -translate-x-1/2
                    w-[1100px] h-[1100px]
                    sm:w-[1400px] sm:h-[1400px]
                    lg:w-[1750px] lg:h-[1750px]
                    rounded-full bg-white"
        style={{
          boxShadow:
            "0px -20px 33px 0px #FFFFFF42, 0px -40px 60px 20px #FFFFFF30, 0px -60px 80px 40px #FFFFFF20, inset 0px 20px 40px 0px rgba(255, 255, 255, 0.15), inset 0px 40px 70px 15px rgba(72, 32, 114, 0.3), inset 0px 80px 120px 40px rgba(72, 32, 114, 0.4), inset 0px 120px 160px 80px rgba(72, 32, 114, 0.25)",
        }}
      />

      {/* Content container */}
      <div className="relative z-10 w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-36 md:pt-52 pb-16">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          {/* Trust pill */}
          <span className="text-white text-sm sm:text-base mb-6 px-6 sm:px-8 py-1.5 border-2 border-white rounded-full font-medium bg-[#482072]/25 flex items-center gap-2 backdrop-blur-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            Trusted by 500+ Customers
          </span>

          {/* Headings */}

          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#482072] mb-2 text-center max-w-3xl"
          >
            Power Your Digital World with
          </motion.h1>

          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#6E4294] mb-6 text-center max-w-3xl"
          >
            Genuine Software
          </motion.h2>

          <motion.div
            variants={fadeUpContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center w-full"
          >
            {/* Description */}
            <motion.p
              variants={fadeUpItem}
              className="text-[#727272] max-w-3xl mb-8 text-center text-base sm:text-lg"
            >
              Get 100% genuine licenses for productivity, security, creativity,
              and business tools — delivered instantly with dedicated customer
              support.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeUpItem}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10 w-full sm:w-auto"
            >
              <button className="bg-[#6E4294] text-white px-8 py-3 rounded-xl shadow-2xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200 font-semibold w-full sm:w-auto">
                Get Your License →
              </button>
              <button className="bg-transparent border-2 border-[#6E4294] text-[#6E4294] px-8 py-3 rounded-xl hover:bg-[#7B5DE8]/10 transition-all duration-200 font-semibold w-full sm:w-auto">
                Browse Products
              </button>
            </motion.div>

            {/* Features */}
            <motion.div
              variants={fadeUpItem}
              className="flex gap-6 sm:gap-8 flex-wrap justify-center"
            >
              {/* Feature 1 */}
              <div className="flex items-center gap-3">
                <div className="bg-[#7B5DE8]/20 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-[#6E4294]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#6E4294]">100% Genuine</p>
                  <p className="text-[#7E6995] text-sm">Authentic Licenses</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3">
                <div className="bg-[#7B5DE8]/20 p-3 rounded-lg">
                  <MdOutlineHeadsetMic className="w-6 h-6 text-[#6E4294]" />
                </div>
                <div>
                  <p className="font-semibold text-[#6E4294]">24/7 Support</p>
                  <p className="text-[#7E6995] text-sm">Always Available</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3">
                <div className="bg-[#7B5DE8]/20 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-[#6E4294]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#6E4294]">500+</p>
                  <p className="text-[#7E6995] text-sm">Happy Customers</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Brands marquee */}
          <div className="mt-12 w-full flex flex-col items-center">
            <h1 className="text-center text-[#6E4294] font-bold text-2xl sm:text-3xl mb-6">
              AVAILABLE SOFTWARE BRANDS
            </h1>

            <div className="relative overflow-hidden w-full max-w-5xl mx-auto">
              {/* Fade edges */}
              <div className="absolute inset-y-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              {/* Scrolling row */}
              <div className="flex gap-10 animate-scroll-infinite py-2">
                {brands.map((brand, index) => (
                  <BrandIcon key={`brand-${index}`} {...brand} />
                ))}
                {brands.map((brand, index) => (
                  <BrandIcon key={`brand-dup-${index}`} {...brand} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
