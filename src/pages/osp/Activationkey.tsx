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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serial_number: formData.serialNumber,
          phone: formData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to request activation key");
      }

      // Success
      setSuccessMessage(data.message || "Activation key request submitted successfully!");
      toast.success("Activation key request submitted successfully!");
      
      // Clear form
      setFormData({
        phoneNumber: "",
        serialNumber: "",
      });
    } catch (error) {
      console.error("Error requesting activation key:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit request. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="activation"
      className="relative w-full min-h-screen bg-[#482072] flex flex-col items-center overflow-hidden"
    >
      {/* Activation Content - Ellipse White Container */}
      <div className="relative z-10 flex flex-col items-center justify-start w-full" style={{ height: "900px" }}>
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
          <div className="flex items-center justify-center gap-16 w-full px-20 pt-32">
            {/* Left Side - Shield Icon */}
            <div className="flex-shrink-0">
              <div className="relative">
                <svg
                  width="300"
                  height="350"
                  viewBox="0 0 300 350"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Shield Background */}
                  <path
                    d="M150 20L50 70V150C50 235 95 310 150 330C205 310 250 235 250 150V70L150 20Z"
                    fill="#7B5DE8"
                    opacity="0.9"
                  />
                  <path
                    d="M150 20L50 70V150C50 235 95 310 150 330C205 310 250 235 250 150V70L150 20Z"
                    stroke="#5A3FB8"
                    strokeWidth="8"
                  />
                  {/* Checkmark */}
                  <path
                    d="M110 160L135 185L190 130"
                    stroke="white"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 max-w-md">
              <h1 className="text-4xl font-bold text-[#482072] mb-2 text-center">
                Get Your Activation Key
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Enter your details to receive your software activation key instantly
              </p>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Number */}
                <div>
                  <label className="block text-[#482072] font-bold mb-2 text-lg">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-lg"
                    required
                  />
                </div>

                {/* Serial Number */}
                <div>
                  <label className="block text-[#482072] font-bold mb-2 text-lg">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="XXXXX-XXXXX-XXXXX"
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-lg"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7B5DE8] text-white py-4 rounded-full font-bold text-xl hover:bg-[#6A4BC4] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>

              {/* Help Text */}
              <p className="text-gray-500 text-sm text-center mt-6">
                Need help? Contact our support team on WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer/> */}
    </section>
  );
};

export default Activationkey;
