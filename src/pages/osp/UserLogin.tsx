// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import Navbar from "../../components/osp/Navbar";
// import Footer from "../../components/osp/Footer";
// import { API_ENDPOINTS } from "../../api/api";

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// const UserLogin: React.FC = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string>("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMsg("");
//     setLoading(true);

//     try {
//       const res = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.message || "Login failed.");
//       }

//       // Store token and user data based on role
//       if (data?.token && data?.user) {
//         const userRole = data.user.role;

//         // Save token based on role
//         if (userRole === "distributor") {
//           localStorage.setItem("distributorToken", data.token);
//         } else {
//           localStorage.setItem("userToken", data.token);
//         }

//         // Save user data
//         localStorage.setItem("user", JSON.stringify(data.user));
//       }

//       // Navigate to home or dashboard
//       navigate("/");
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setErrorMsg(err.message);
//       } else {
//         setErrorMsg("Server error. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section
//       id="user-login"
//       className="relative z-10 w-full min-h-screen bg-[#482072] flex flex-col items-center overflow-hidden"
//     >
//       <div className="relative z-50 w-full">
//         <Navbar />
//       </div>

//       <div
//         className="relative flex flex-col items-center justify-start w-full"
//         style={{ height: "900px" }}
//       >
//         <div
//           className="bg-white flex flex-col items-center justify-start absolute overflow-hidden"
//           style={{
//             width: "1711px",
//             height: "1122px",
//             top: "119px",
//             left: "-136px",
//             borderRadius: "50%",
//             boxShadow:
//               "0px -20px 33px 0px #FFFFFF42, 0px -40px 60px 20px #FFFFFF30, 0px -60px 80px 40px #FFFFFF20, inset 0px 20px 40px 0px rgba(255, 255, 255, 0.15), inset 0px 40px 70px 15px rgba(72, 32, 114, 0.3), inset 0px 80px 120px 40px rgba(72, 32, 114, 0.4), inset 0px 120px 160px 80px rgba(72, 32, 114, 0.25)",
//           }}
//         >
//           <div className="flex items-center justify-center gap-16 w-full px-20 pt-32">
//             {/* Left Side - Image */}
//             <div className="flex-shrink-0">
//               <div className="relative">
//                 <img
//                   src="/assets/images/Login.png"
//                   alt="Login"
//                   width={300}
//                   height={350}
//                 />
//               </div>
//             </div>

//             {/* Right Side - Login Form */}
//             <div className="flex-1 max-w-md">
//               <h1 className="text-3xl font-bold text-[#482072] mb-1 text-center">
//                 Welcome Back
//               </h1>
//               <p className="text-gray-600 mb-6 text-center text-sm">
//                 Sign in to your account to continue
//               </p>

//               {errorMsg && (
//                 <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
//                   {errorMsg}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-3">
//                 <div>
//                   <label className="block text-[#482072] font-bold mb-1.5 text-sm">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="you@example.com"
//                     className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-[#482072] font-bold mb-1.5 text-sm">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="Enter your password"
//                       className="w-full px-4 py-2.5 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-[#6E4294] transition"
//                     >
//                       {showPassword ? <EyeIcon /> : <EyeOffIcon />}
//                     </button>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-[#6E4294] text-white py-3 rounded-full font-bold text-lg hover:bg-[#6A4BC4] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-4"
//                 >
//                   {loading ? "Logging in..." : "Login"}
//                 </button>
//               </form>

//               <p className="text-gray-600 text-center mt-4 text-sm">
//                 Don't have an account?{" "}
//                 <Link
//                   to="/register"
//                   className="text-[#7B5DE8] font-semibold hover:underline"
//                 >
//                   Register here
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </section>
//   );
// };

// export default UserLogin;

// const EyeIcon = () => (
//   <svg
//     width="18"
//     height="18"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
//     <circle cx="12" cy="12" r="3" />
//   </svg>
// );

// const EyeOffIcon = () => (
//   <svg
//     width="18"
//     height="18"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M1 1l22 22" />
//     <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.08-6.11" />
//     <path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47" />
//     <path d="M14.47 14.47L9.53 9.53" />
//   </svg>
// );

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/osp/Navbar";
import Footer from "../../components/osp/Footer";
import { API_ENDPOINTS } from "../../api/api";

interface LoginFormData {
  email: string;
  password: string;
}

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Login failed.");

      if (data?.token && data?.user) {
        const userRole = data.user.role;

        if (userRole === "distributor") {
          localStorage.setItem("distributorToken", data.token);
        } else {
          localStorage.setItem("userToken", data.token);
        }

        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) setErrorMsg(err.message);
      else setErrorMsg("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="user-login"
      className="relative w-full min-h-screen bg-[#482072] flex flex-col overflow-hidden"
    >
      {/* Navbar */}
      <div className="relative z-50 w-full">
        <Navbar />
      </div>

      {/* Main */}
      <div className="relative flex-1 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-28 md:p-52 pb-10">
        {/* White glowing big circle background (responsive) */}
        <div
          className="pointer-events-none absolute left-1/2 top-[140px] -translate-x-1/2 w-[1200px] h-[1200px] sm:w-[1500px] sm:h-[1500px] lg:w-[1800px] lg:h-[1800px] rounded-full bg-white"
          style={{
            boxShadow:
              "0px -20px 33px 0px #FFFFFF42, 0px -40px 60px 20px #FFFFFF30, 0px -60px 80px 40px #FFFFFF20, inset 0px 20px 40px 0px rgba(255, 255, 255, 0.15), inset 0px 40px 70px 15px rgba(72, 32, 114, 0.3), inset 0px 80px 120px 40px rgba(72, 32, 114, 0.4), inset 0px 120px 160px 80px rgba(72, 32, 114, 0.25)",
          }}
        />

        {/* Content wrapper */}
        <div className="relative z-10 w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
            {/* Left: Image */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <img
                src="/assets/images/Login.png"
                alt="Login"
                className="w-[220px] sm:w-[280px] md:w-[320px] h-auto"
              />
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3 w-full max-w-2xl mx-auto lg:mx-0 bg-white/80 backdrop-blur-md border border-white/60 shadow-2xl rounded-3xl p-8 sm:p-10">
              <h1 className="text-3xl font-bold text-[#482072] mb-1 text-center">
                Welcome Back
              </h1>
              <p className="text-gray-600 mb-6 text-center text-sm">
                Sign in to your account to continue
              </p>

              {errorMsg && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm bg-white"
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
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#7B5DE8] text-sm bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-[#6E4294] transition"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6E4294] text-white py-3 rounded-full font-bold text-lg hover:bg-[#6A4BC4] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-gray-600 text-center mt-4 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#7B5DE8] font-semibold hover:underline"
                >
                  Register here
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

export default UserLogin;

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