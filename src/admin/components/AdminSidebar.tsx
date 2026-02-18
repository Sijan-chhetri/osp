import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import type { FC } from "react";
import {
  Squares2X2Icon,
  UsersIcon,
  ChevronDownIcon,
  TagIcon,
  SwatchIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  ListBulletIcon,
  ShoppingBagIcon,
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

type DropdownKey = "categories" | "brands" | "softwares" | "plans" | "cartridgeBrands" | "cartridgeCategories" | "cartridgeProducts" | null;

const AdminSidebar: FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);

  const [user] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  });

  const baseLink =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out";
  const activeLink = "bg-[#6E4294]/20 text-[#482072]";
  const inactiveLink =
    "text-[#482072] hover:text-[#6E4294] hover:bg-[#6E4294]/10 hover:translate-x-1";

  // ✅ Close dropdown when sidebar closes (mobile)
  useEffect(() => {
    if (!isOpen) setOpenDropdown(null);
  }, [isOpen]);

  const toggle = (key: Exclude<DropdownKey, null>) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  const subLink = (isActive: boolean) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
      isActive ? "text-brownSoft font-bold" : "text-brownSoft hover:font-bold"
    }`;

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
            alt="OSP logo"
            className="h-[42px] cursor-pointer"
            onClick={handleNavClick}
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
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          <Squares2X2Icon className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          <UsersIcon className="w-5 h-5" />
          User Management
        </NavLink>

        {/* ================= CATEGORY DROPDOWN ================= */}
        <button
          type="button"
          onClick={() => toggle("categories")}
          className={`${baseLink} ${inactiveLink} w-full justify-between`}
        >
          <div className="flex items-center gap-3">
            <TagIcon className="w-5 h-5" />
            Software Categories
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              openDropdown === "categories" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDropdown === "categories" && (
          <div className="ml-8 mt-1 space-y-1">
            <NavLink
              to="/admin/category/softwareCategoryCreate"
              onClick={handleNavClick}
              className={({ isActive }) => subLink(isActive)}
            >
              <PlusCircleIcon className="w-4 h-4" />
              Create Category
            </NavLink>

            <NavLink
              to="/admin/category"
              end
              onClick={handleNavClick}
              className={({ isActive }) => subLink(isActive)}
            >
              <ListBulletIcon className="w-4 h-4" />
              Category List
            </NavLink>
          </div>
        )}

        {/* ================= BRAND DROPDOWN ================= */}
        <button
          type="button"
          onClick={() => toggle("brands")}
          className={`${baseLink} ${inactiveLink} w-full justify-between`}
        >
          <div className="flex items-center gap-3">
            <SwatchIcon className="w-5 h-5" />
            Software Brands
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              openDropdown === "brands" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDropdown === "brands" && (
          <div className="ml-8 mt-1 space-y-1">
            <NavLink
              to="/admin/brands/softwareBrandCreate"
              onClick={handleNavClick}
              className={({ isActive }) => subLink(isActive)}
            >
              <PlusCircleIcon className="w-4 h-4" />
              Create Brand
            </NavLink>

            <NavLink
              to="/admin/brands"
              end
              onClick={handleNavClick}
              className={({ isActive }) => subLink(isActive)}
            >
              <ListBulletIcon className="w-4 h-4" />
              Brand List
            </NavLink>
          </div>
        )}

        {/* ================= PRODUCTS DROPDOWN ================= */}
        <button
          type="button"
          onClick={() => toggle("softwares")}
          className={`${baseLink} ${inactiveLink} w-full justify-between`}
        >
          <div className="flex items-center gap-3">
            <CubeIcon className="w-5 h-5" />
            Software Products
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              openDropdown === "softwares" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDropdown === "softwares" && (
          <div className="ml-8 mt-1 space-y-1">
            <NavLink
              to="/admin/products/softwareProductCreate"
              onClick={handleNavClick}
              className={({ isActive }) => subLink(isActive)}
            >
              <PlusCircleIcon className="w-4 h-4" />
              Create Product
            </NavLink>

            <NavLink
              to="/admin/products"
              end
              onClick={handleNavClick}
              className={({ isActive }) => subLink(isActive)}
            >
              <ListBulletIcon className="w-4 h-4" />
              Product List
            </NavLink>
          </div>
        )}

        {/* ================= PLANS DROPDOWN ================= */}
        <button
          type="button"
          onClick={() => toggle("plans")}
          className={`${baseLink} ${inactiveLink} w-full justify-between`}
        >
          <div className="flex items-center gap-3">
            <ClipboardDocumentListIcon className="w-5 h-5" />
            Software Plans
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              openDropdown === "plans" ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDropdown === "plans" && (
          <div className="ml-8 mt-1 space-y-1">
            <NavLink
              to="/admin/plans/softwarePlanCreate"
              onClick={handleNavClick}
              className={({ isActive }) => subLink(isActive)}
            >
              <PlusCircleIcon className="w-4 h-4" />
              Create Plan
            </NavLink>

            <NavLink
              to="/admin/plans"
              end
              onClick={handleNavClick}
              className={({ isActive }) => subLink(isActive)}
            >
              <ListBulletIcon className="w-4 h-4" />
              Plan List
            </NavLink>
          </div>
        )}

        {/* ================= SOFTWARE ORDERS ================= */}
        <NavLink
          to="/admin/orders"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `${baseLink} ${isActive ? activeLink : inactiveLink}`
          }
        >
          <ShoppingBagIcon className="w-5 h-5" />
          Software Orders
        </NavLink>

        {/* ================= CARTRIDGE SECTION ================= */}
        <div className="pt-4 mt-4 border-t border-slate-200">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Cartridge Management
          </p>

          {/* CARTRIDGE BRANDS */}
          <button
            type="button"
            onClick={() => toggle("cartridgeBrands")}
            className={`${baseLink} ${inactiveLink} w-full justify-between`}
          >
            <div className="flex items-center gap-3">
              <SwatchIcon className="w-5 h-5" />
              Cartridge Brands
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                openDropdown === "cartridgeBrands" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdown === "cartridgeBrands" && (
            <div className="ml-8 mt-1 space-y-1">
              <NavLink
                to="/admin/cartridge/brands/create"
                onClick={handleNavClick}
                className={({ isActive }) => subLink(isActive)}
              >
                <PlusCircleIcon className="w-4 h-4" />
                Create Brand
              </NavLink>

              <NavLink
                to="/admin/cartridge/brands"
                end
                onClick={handleNavClick}
                className={({ isActive }) => subLink(isActive)}
              >
                <ListBulletIcon className="w-4 h-4" />
                Brand List
              </NavLink>
            </div>
          )}

          {/* CARTRIDGE CATEGORIES */}
          <button
            type="button"
            onClick={() => toggle("cartridgeCategories")}
            className={`${baseLink} ${inactiveLink} w-full justify-between`}
          >
            <div className="flex items-center gap-3">
              <TagIcon className="w-5 h-5" />
              Cartridge Categories
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                openDropdown === "cartridgeCategories" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdown === "cartridgeCategories" && (
            <div className="ml-8 mt-1 space-y-1">
              <NavLink
                to="/admin/cartridge/categories/create"
                onClick={handleNavClick}
                className={({ isActive }) => subLink(isActive)}
              >
                <PlusCircleIcon className="w-4 h-4" />
                Create Category
              </NavLink>

              <NavLink
                to="/admin/cartridge/categories"
                end
                onClick={handleNavClick}
                className={({ isActive }) => subLink(isActive)}
              >
                <ListBulletIcon className="w-4 h-4" />
                Category List
              </NavLink>
            </div>
          )}

          {/* CARTRIDGE PRODUCTS */}
          <button
            type="button"
            onClick={() => toggle("cartridgeProducts")}
            className={`${baseLink} ${inactiveLink} w-full justify-between`}
          >
            <div className="flex items-center gap-3">
              <CubeIcon className="w-5 h-5" />
              Cartridge Products
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                openDropdown === "cartridgeProducts" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdown === "cartridgeProducts" && (
            <div className="ml-8 mt-1 space-y-1">
              <NavLink
                to="/admin/cartridge/products/create"
                onClick={handleNavClick}
                className={({ isActive }) => subLink(isActive)}
              >
                <PlusCircleIcon className="w-4 h-4" />
                Create Product
              </NavLink>

              <NavLink
                to="/admin/cartridge/products"
                end
                onClick={handleNavClick}
                className={({ isActive }) => subLink(isActive)}
              >
                <ListBulletIcon className="w-4 h-4" />
                Product List
              </NavLink>
            </div>
          )}

          {/* CARTRIDGE QR CODES */}
          <NavLink
            to="/admin/cartridge/qr-codes"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            QR Codes
          </NavLink>

          {/* CARTRIDGE ORDERS */}
          <NavLink
            to="/admin/cartridge/orders"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `${baseLink} ${isActive ? activeLink : inactiveLink}`
            }
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Cartridge Orders
          </NavLink>
        </div>
      </nav>

      {/* ADMIN FOOTER */}
      <div className="p-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#482072]/10 flex items-center justify-center text-[#482072] text-sm font-bold">
          {user?.username?.charAt(0).toUpperCase() || "A"}
        </div>

        <div className="flex-1">
          <p className="text-sm font-medium text-[#482072]">
            {user?.username || "Admin"}
          </p>
          <p className="text-xs text-slate-400">{user?.email || ""}</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
