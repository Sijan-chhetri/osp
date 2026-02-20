import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/osp/Navbar";
import Footer from "../../components/osp/Footer";
import { API_ENDPOINTS } from "../../api/api";
import { getAuthToken, isDistributor } from "../../utils/auth";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

interface ProfileFormData {
  full_name: string;
  email: string;
  phone: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/user-login");
      return;
    }
    
    // Redirect distributors to home page
    if (isDistributor()) {
      navigate("/");
      return;
    }
    
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(API_ENDPOINTS.AUTH_PROFILE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch profile");
      }

      setProfile(data);
      setFormData({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    try {
      const token = getAuthToken();
      const res = await fetch(API_ENDPOINTS.AUTH_PROFILE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      setProfile(data);
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);

      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
      });
    }
    setIsEditing(false);
    setErrorMsg("");
    setSuccessMsg("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600 text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <Navbar />

      <section className="relative w-full min-h-screen flex flex-col items-center py-40 px-4">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-purple-100 px-6 py-2 rounded-full mb-4">
              <span className="text-[#7B5DE8] font-semibold text-sm">MY ACCOUNT</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#482072] mb-4">
              User Profile
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your account information
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
            {/* Status Badge */}
            {profile && (
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#482072] to-[#7B5DE8] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#482072]">{profile.full_name}</h2>
                    <p className="text-gray-500 text-sm capitalize">{profile.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      profile.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {profile.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            )}

            {/* Messages */}
            {errorMsg && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
                {successMsg}
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none transition-all ${
                    isEditing
                      ? "border-gray-200 focus:border-[#7B5DE8] focus:ring-2 focus:ring-[#7B5DE8]/20 bg-white"
                      : "border-gray-100 bg-gray-50 cursor-not-allowed"
                  }`}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none transition-all ${
                    isEditing
                      ? "border-gray-200 focus:border-[#7B5DE8] focus:ring-2 focus:ring-[#7B5DE8]/20 bg-white"
                      : "border-gray-100 bg-gray-50 cursor-not-allowed"
                  }`}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-5 py-3.5 border-2 rounded-xl focus:outline-none transition-all ${
                    isEditing
                      ? "border-gray-200 focus:border-[#7B5DE8] focus:ring-2 focus:ring-[#7B5DE8]/20 bg-white"
                      : "border-gray-100 bg-gray-50 cursor-not-allowed"
                  }`}
                  required
                />
              </div>
            </form>

            {/* Action Buttons - Outside Form */}
            <div className="flex gap-4 pt-6">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="flex-1 bg-[#6E4294] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#6A4BC4] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-1 bg-[#6E4294] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#6A4BC4] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Additional Info */}
            {profile && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Account Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">User ID</p>
                    <p className="text-gray-700 font-mono text-xs">{profile.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Role</p>
                    <p className="text-gray-700 capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserProfile;
