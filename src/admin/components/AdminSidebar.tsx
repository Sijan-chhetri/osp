import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import type { FC } from "react";
import {
  Squares2X2Icon,
  UsersIcon,
  RectangleGroupIcon,
  ChevronDownIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  userId: string;
  username: string;
  email: string;
  role?: string;
}

const AdminSidebar: FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const [openTemplateCategories, setOpenTemplateCategories] = useState(false);
  const [openTemplates, setOpenTemplates] = useState(false);


  const baseLink ="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out";

  const activeLink = "bg-primary/10 text-brown";

  const inactiveLink ="text-brownSoft hover:text-brown hover:bg-primary/10 hover:translate-x-1";

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <aside
      className={`
    fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
    >
      {/* LOGO */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div>
          <img
            src="/assets/images/OSP_Logo.png"
            alt="Buildify logo"
            className="h-[42px] cursor-pointer"
          />
        </div>
        <div>
          <h1 className="text-[#482072] font-semibold text-xl font-baskerville">
            OSP
          </h1>
          <p className="text-xs text-brownSoft">Admin Panel</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 space-y-1">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          <Squares2X2Icon className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          <UsersIcon className="w-5 h-5" />
          User Management
        </NavLink>

        <button
          type="button"
          onClick={() => {
            setOpenTemplateCategories((prev) => !prev);
            setOpenTemplates(false); // close other dropdown
          }}
          className={`${baseLink} ${inactiveLink} w-full justify-between`}
        >
          <div className="flex items-center gap-3">
            <TagIcon className="w-5 h-5" />
            Software Category
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              openTemplateCategories ? "rotate-180" : ""
            }`}
          />
        </button>

        {openTemplateCategories && (
          <div className="ml-8 mt-1 space-y-1">
            <NavLink
              to="/admin/category/softwareCreate"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "text-brownSoft font-bold"
                    : "text-brownSoft hover:font-bold"
                }`
              }
            >
              Create Category
            </NavLink>

            <NavLink
              to="/admin/category"
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "text-brownSoft font-bold"
                    : "text-brownSoft hover:font-bold"
                }`
              }
            >
              Category List
            </NavLink>
          </div>
        )}

        {/* TEMPLATES DROPDOWN */}
        <button
          type="button"
          onClick={() => {
            setOpenTemplates((prev) => !prev);
            setOpenTemplateCategories(false);
          }}
          className={`${baseLink} ${inactiveLink} w-full justify-between`}
        >
          <div className="flex items-center gap-3">
            <RectangleGroupIcon className="w-5 h-5" />
            Softwares
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              openTemplates ? "rotate-180" : ""
            }`}
          />
        </button>

        {openTemplates && (
          <div className="ml-8 mt-1 space-y-1">
            <NavLink
              to="/admin/templates/create"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "text-brownSoft font-bold"
                    : "text-brownSoft hover:font-bold"
                }`
              }
            >
              Create Software
            </NavLink>

            <NavLink
              to="/admin/templates"
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "text-brownSoft font-bold"
                    : "text-brownSoft hover:font-bold"
                }`
              }
            >
              Software List
            </NavLink>
          </div>
        )}
      </nav>

      {/* ADMIN FOOTER */}
      <div className="p-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
          {user?.username?.charAt(0).toUpperCase() || "A"}
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-brown">
            {user?.username || "Admin"}
          </p>
          <p className="text-xs text-slate-400">{user?.email || ""}</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
