import React, { useState } from "react";
import { API_ENDPOINTS } from "../../api/api";
import toast from "react-hot-toast";

const Activationkey: React.FC = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    serialNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_ENDPOINTS.ACTIVATION_REQUEST_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serial_number: formData.serialNumber,
          phone: formData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to request activation key");
      }

      setSuccessMessage(
        data.message || "Activation key request submitted successfully!",
      );
      toast.success("Activation key request submitted successfully!");

      setFormData({ phoneNumber: "", serialNumber: "" });
    } catch (error) {
      console.error("Error requesting activation key:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit request. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="activation"
      className="relative w-full min-h-screen bg-[#482072] overflow-hidden"
    >
      {/* Center content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-12">
        {/* Responsive glowing circle background */}
        <div
          className="pointer-events-none absolute left-1/2 top-[140px] -translate-x-1/2 w-[1200px] h-[1200px] sm:w-[1500px] sm:h-[1500px] lg:w-[1800px] lg:h-[1800px] rounded-full bg-white"
          style={{
            boxShadow:
              "0px -20px 33px 0px #FFFFFF42, 0px -40px 60px 20px #FFFFFF30, 0px -60px 80px 40px #FFFFFF20, inset 0px 20px 40px 0px rgba(255, 255, 255, 0.15), inset 0px 40px 70px 15px rgba(72, 32, 114, 0.3), inset 0px 80px 120px 40px rgba(72, 32, 114, 0.4), inset 0px 120px 160px 80px rgba(72, 32, 114, 0.25)",
          }}
        />

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            {/* Left Side - Image */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <img
                src="/assets/images/Activiation_Shield.png"
                alt="Activation Shield"
                className="w-[220px] sm:w-[280px] md:w-[320px] lg:w-[360px] h-auto drop-shadow-2xl"
              />
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3 w-full max-w-xl mx-auto lg:mx-0 bg-white/75 backdrop-blur-md border border-white/60 shadow-2xl rounded-3xl p-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#6E4294] mb-2 text-center">
                Get Your Activation Key
              </h1>
              <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
                Enter your details to receive your software activation key.
              </p>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm flex items-start gap-2">
                  <svg
                    className="w-5 h-5 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Phone Number */}
                <div>
                  <label className="block text-[#482072] font-bold mb-2 text-sm sm:text-base">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    className="w-full px-4 sm:px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm sm:text-base bg-white"
                    required
                  />
                </div>

                {/* Serial Number */}
                <div>
                  <label className="block text-[#482072] font-bold mb-2 text-sm sm:text-base">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="XXXXX-XXXXX-XXXXX"
                    className="w-full px-4 sm:px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm sm:text-base bg-white"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6E4294] text-white py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-[#6E4294]/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>

              <p className="text-gray-500 text-xs sm:text-sm text-center mt-5">
                Need help? Contact our support team on WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activationkey;
