import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/osp/Navbar";
import Footer from "../../components/osp/Footer";
import { API_ENDPOINTS } from "../../api/api";

interface RegisterFormData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Registration failed.");
      }

      setSuccessMsg("Registration successful! Redirecting to login...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/user-login");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="register"
      className="relative z-10 w-full min-h-screen bg-[#482072] flex flex-col items-center overflow-hidden"
    >
      <div className="relative z-50 w-full">
        <Navbar />
      </div>

      <div
        className="relative flex flex-col items-center justify-start w-full"
        style={{ minHeight: "900px" }}
      >
        <div
          className="bg-white flex flex-col items-center justify-start absolute overflow-hidden"
          style={{
            width: "1711px",
            minHeight: "1122px",
            top: "119px",
            left: "-136px",
            borderRadius: "50%",
            boxShadow:
              "0px -20px 33px 0px #FFFFFF42, 0px -40px 60px 20px #FFFFFF30, 0px -60px 80px 40px #FFFFFF20, inset 0px 20px 40px 0px rgba(255, 255, 255, 0.15), inset 0px 40px 70px 15px rgba(72, 32, 114, 0.3), inset 0px 80px 120px 40px rgba(72, 32, 114, 0.4), inset 0px 120px 160px 80px rgba(72, 32, 114, 0.25)",
          }}
        >
          <div className="flex items-center justify-center gap-16 w-full px-20 pt-20 pb-20">
            {/* Left Side - Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src="/assets/images/Login.png"
                  alt="Register"
                  width={300}
                  height={350}
                />
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 max-w-md">
              <h1 className="text-3xl font-bold text-[#482072] mb-1 text-center">
                Create Account
              </h1>
              <p className="text-gray-600 mb-6 text-center text-sm">
                Join us to get genuine software licenses
              </p>

              {errorMsg && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[#482072] font-bold mb-1.5 text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#482072] font-bold mb-1.5 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#482072] font-bold mb-1.5 text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9841234567"
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#482072] font-bold mb-1.5 text-sm">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="w-full px-4 py-2.5 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-[#6E4294] transition"
                    >
                      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#482072] font-bold mb-1.5 text-sm">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-2.5 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-[#6E4294] transition"
                    >
                      {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6E4294] text-white py-3 rounded-full font-bold text-lg hover:bg-[#6A4BC4] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </form>

              <p className="text-gray-600 text-center mt-4 text-sm">
                Already have an account?{" "}
                <Link
                  to="/user-login"
                  className="text-[#7B5DE8] font-semibold hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Register;

const EyeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 1l22 22" />
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.08-6.11" />
    <path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47" />
    <path d="M14.47 14.47L9.53 9.53" />
  </svg>
);
