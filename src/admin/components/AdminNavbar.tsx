import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  UsersIcon,
  PlusCircleIcon,
  Bars3Icon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface DropdownItemProps {
  icon: FC<{ className?: string }>;
  label: string;
  onClick?: () => void;
}

interface AdminNavbarProps {
  onMenuClick: () => void;
}

const DropdownItem: FC<DropdownItemProps> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
  >
    <Icon className="w-5 h-5 text-slate-500" />
    {label}
  </button>
);

interface User {
  userId: string;
  username: string;
  email: string;
  role?: string;
}


const AdminNavbar: FC<AdminNavbarProps> = ({ onMenuClick }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);



  /* Close on outside click */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  /* ───────── LOGOUT ───────── */

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="h-16 w-full bg-white border-b border-slate-200 flex items-center px-6 relative">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* HAMBURGER (mobile only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-700 hover:text-slate-900"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* SPACER */}
      <div className="flex-1" />

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-5 relative" ref={dropdownRef}>
        {/* Notifications */}
        <button className="relative text-slate-600 hover:text-slate-900 transition">
          <BellIcon className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* AVATAR BUTTON */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-slate-300 focus:outline-none text-primary font-semibold"
        >
          {user?.username?.charAt(0).toUpperCase() || "A"}
        </button>

        {/* DROPDOWN */}
        <div
          className={`
                absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50
                transform transition-all duration-200 ease-out
                ${
                  open
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                }
            `}
        >
          {/* USER INFO */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-slate-500">{user?.email || ""}</p>
            </div>
          </div>

          {/* MENU */}
          <div className="py-2">
            <DropdownItem
              icon={UserIcon}
              label="My account"
              onClick={() => navigate("/admin/adminProfile")}
            />
            <DropdownItem icon={Cog6ToothIcon} label="Setting" />
          </div>

          <div className="border-t border-slate-200 py-2">
            <DropdownItem icon={UsersIcon} label="Manage team" />
            <DropdownItem icon={PlusCircleIcon} label="Add team account" />
          </div>

          <div className="border-t border-slate-200 py-2">
            <button
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              onClick={handleLogout}
            >
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};;

export default AdminNavbar;
