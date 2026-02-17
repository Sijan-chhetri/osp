import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { API } from "../../config/api.ts";
import toast from "react-hot-toast";
import { useOutletContext } from "react-router-dom";

/* ================= TYPES ================= */

type ApiErrorResponse = { message?: string };

type UserRole = "admin" | "user" | string;
type UserStatus = "active" | "inactive" | string;

export type UserRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
};

type ProfileResponse = UserRow;

/* ================= HELPERS ================= */

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return "Something went wrong";
};

/* ================= COMPONENT ================= */

const AdminProfile = () => {
  const { setModalOpen } = useOutletContext<{
    setModalOpen: (v: boolean) => void;
  }>();

  const closeModal = () => {
    setIsPasswordOpen(false);
    setModalOpen(false);
  };

  // ✅ load user from localStorage once (no useEffect)
  const [user, setUser] = useState<UserRow | null>(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as UserRow;
    } catch {
      return null;
    }
  });

  // Editable form state (UI uses username, API uses full_name)
  const [form, setForm] = useState(() => ({
    username: user?.full_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    role: user?.role ?? "Admin",
  }));

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const firstLetter = useMemo(() => {
    const name = user?.full_name?.trim();
    return name ? name.charAt(0).toUpperCase() : "A";
  }, [user?.full_name]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const res = await fetch(`${API.ADMIN}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await res.json()) as ProfileResponse | ApiErrorResponse;

      if (!res.ok) {
        const msg =
          typeof data === "object" && data && "message" in data
            ? data.message
            : undefined;
        throw new Error(msg || "Failed to fetch profile");
      }

      const profile = data as ProfileResponse;

      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));

      setForm((prev) => ({
        ...prev,
        username: profile.full_name ?? prev.username,
        email: profile.email ?? prev.email,
        phone: profile.phone ?? prev.phone,
        role: profile.role ?? prev.role,
      }));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const res = await fetch(`${API.ADMIN}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.username,
          email: form.email,
          phone: form.phone.trim() ? form.phone.trim() : null,
        }),
      });

      const data = (await res.json()) as ApiErrorResponse;

      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      await fetchProfile();

      setIsEditOpen(false);
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleChangePassword = async () => {
    try {
      setSavingPassword(true);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not authenticated.");

      const res = await fetch(`${API.ADMIN}/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword,
        }),
      });


      const data = (await res.json()) as ApiErrorResponse;

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      setCurrentPassword("");
      setNewPassword("");
      setIsPasswordOpen(false);
      setModalOpen(false);

      toast.success(data.message || "Password changed successfully");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-700">My Profile</h1>
      </div>

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-6">
        {/* LETTER AVATAR */}
        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
          {firstLetter}
        </div>

        {/* USER INFO */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {user?.full_name || "Admin"}
          </h2>
          <p className="text-sm text-slate-500">{user?.role || "Admin"}</p>
          <p className="text-sm text-slate-400">Admin Dashboard</p>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-brown">
            Personal Information
          </h3>

          <div className="flex items-center gap-2">
            {/* Change Password */}
            <button
              onClick={() => {
                setIsPasswordOpen(true);
                setModalOpen(true);
              }}
              className="px-4 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-100 transition"
            >
              Change Password
            </button>

            {/* Edit Profile */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center bg-[#6E4294] gap-1.5 text-sm px-4 py-1.5 rounded-lg bg-primary text-white hover:bg-[#6E4294]/90 transition"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-5 text-sm">
          <InfoItem label="Username" value={user?.full_name || "—"} />
          <InfoItem label="Email Address" value={user?.email || "—"} />
          <InfoItem label="Phone Number" value={user?.phone || "—"} />
          <InfoItem label="User Role" value={String(user?.role || "Admin")} />
        </div>
      </div>

      {/* ───────── EDIT MODAL ───────── */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsEditOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-xl p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Edit Profile
              </h3>
              <button onClick={() => setIsEditOpen(false)}>
                <XMarkIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
              />

              <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <Input
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 98XXXXXXXX"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-lg bg-[#6E4294] text-white hover:bg-[#6E4294]/90"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────── CHANGE PASSWORD MODAL ───────── */}
      {isPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-xl p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Change Password
              </h3>
              <button onClick={closeModal}>
                <XMarkIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-5">
              {/* CURRENT PASSWORD */}
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E4294]"
                  >
                    {showCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6E4294]"
                  >
                    {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="px-4 py-2 text-sm rounded-lg bg-[#6E4294] text-white hover:bg-[#6E4294]/90 disabled:opacity-50"
              >
                {savingPassword ? "Saving..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;

/* ───────── SMALL COMPONENTS ───────── */

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
  </div>
);

const Input = ({
    label,
    ...props
    }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <div>
        <label className="text-xs text-slate-500">{label}</label>
        <input
        {...props}
        className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
    </div>
);

/* ───── ICONS ───── */

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
