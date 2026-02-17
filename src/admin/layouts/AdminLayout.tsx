import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
    setModalOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-100 font-admin relative">
      {(sidebarOpen || modalOpen) && (
        <div
          onClick={() => {
            setSidebarOpen(false);
            setModalOpen(false);
          }}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen relative z-10">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">
          <Outlet context={{ setModalOpen }} />
        </main>
      </div>
    </div>
  );
}
