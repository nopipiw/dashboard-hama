import React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Shield,
  Sprout,
  User,
  X,
} from "lucide-react";

import RodentNotificationButton from "../features/notifications/components/RodentNotificationButton.jsx";
import SidebarNavLink from "../shared/components/SidebarNavLink.jsx";

export default function DashboardLayout({
  auth,
  children,
  handleLogout,
  isSidebarOpen,
  notification,
  setIsSidebarOpen,
  setNotification,
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f3f7f5_100%)] flex flex-col lg:flex-row font-sans text-slate-900 overflow-x-hidden">
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-600 rounded-lg">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-black text-slate-800 tracking-tighter">
            SiTani <span className="text-green-600 font-medium">Smart</span>
          </h1>
        </div>
        <button
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {notification && (
        <div className="fixed top-20 lg:top-8 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-6 z-[100] w-[92%] md:w-96 animate-in slide-in-from-top-4 lg:slide-in-from-right duration-500">
          <div className="bg-white border-2 border-red-200 rounded-2xl shadow-2xl p-4 lg:p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-50 rounded-xl text-red-600 animate-bounce">
                <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-800 uppercase tracking-tighter text-xs lg:text-sm mb-1">
                  Peringatan!
                </h4>
                <p className="text-[11px] lg:text-xs font-bold text-slate-600 leading-snug break-words">
                  {notification.message}
                </p>
                <div className="mt-3">
                  <Link
                    className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:underline"
                    onClick={() => setNotification(null)}
                    to="/rekomendasi"
                  >
                    Lihat Solusi &rarr;
                  </Link>
                </div>
              </div>
              <button
                className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                onClick={() => setNotification(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-full w-72 lg:w-[260px] bg-white/95 backdrop-blur border-r border-slate-200/80 p-5 lg:px-5 lg:py-6 flex flex-col shadow-[0_12px_40px_rgba(15,23,42,0.06)] z-[60] transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex lg:hidden items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-black">SiTani</h1>
          </div>
          <button className="p-2 bg-slate-100 rounded-xl" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3 mb-7 pb-5 border-b border-slate-100">
          <div className="p-2.5 bg-green-600 rounded-2xl shadow-lg shadow-green-200/70">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[1.55rem] font-black tracking-tight text-slate-800 uppercase leading-none">
            SiTani <span className="text-green-600 font-medium lowercase">Smart</span>
          </h1>
        </div>

        <nav className="space-y-2.5 flex-1">
          <SidebarNavLink
            icon={<LayoutDashboard size={28} />}
            label="Beranda (Utama)"
            onClick={() => setIsSidebarOpen(false)}
            to="/"
          />
          <SidebarNavLink
            icon={<Clock size={28} />}
            label="Hama Hari Ini"
            onClick={() => setIsSidebarOpen(false)}
            to="/hari-ini"
          />
          <SidebarNavLink
            icon={<BarChart3 size={28} />}
            label="Chart Hama"
            onClick={() => setIsSidebarOpen(false)}
            to="/chart-hama"
          />
          <SidebarNavLink
            icon={<Lightbulb size={28} />}
            label="Saran & Solusi"
            onClick={() => setIsSidebarOpen(false)}
            to="/rekomendasi"
          />
          <SidebarNavLink
            icon={<User size={28} />}
            label="Profil Petani"
            onClick={() => setIsSidebarOpen(false)}
            to="/profil"
          />
          {auth?.user?.role === "admin" && (
            <SidebarNavLink
              icon={<Shield size={28} />}
              label="Mode Admin"
              onClick={() => setIsSidebarOpen(false)}
              to="/admin"
            />
          )}
        </nav>

        <button
          className="mt-6 flex items-center justify-center gap-3 px-5 py-3.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all font-black text-sm lg:text-base border-2 border-red-100 shadow-md"
          onClick={handleLogout}
        >
          <LogOut size={22} />
          Keluar Sistem
        </button>
      </aside>

      <main className="flex-1 p-3 md:p-5 lg:px-6 lg:py-5 w-full overflow-hidden">
        <div className="max-w-[1220px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-4 lg:gap-5 mb-4 lg:mb-6 bg-white/70 border border-slate-200/70 shadow-sm p-4 lg:px-5 lg:py-4 rounded-2xl">
          <div className="space-y-1">
            <h2 className="text-[10px] lg:text-xs font-black text-green-600 uppercase tracking-[0.22em] mb-0.5 lg:mb-1">
              Wilayah: Karawang, Tempuran
            </h2>
            <h3 className="text-[1.6rem] lg:text-[2.35rem] font-black text-slate-800 leading-[0.95] tracking-tight">Monitoring Sawah</h3>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3 lg:gap-4">
            <RodentNotificationButton />
            <Link
              className="flex items-center gap-2 lg:gap-3 bg-white p-1.5 pr-3 lg:p-2.5 lg:pr-4 rounded-xl shadow-sm border border-slate-100 hover:border-green-200 transition-all min-w-[160px]"
              to="/profil"
            >
              <div className="w-8 h-8 lg:w-11 lg:h-11 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border border-slate-200 uppercase text-sm lg:text-base">
                {auth?.user?.username ? auth.user.username[0] : "?"}
              </div>
              <div className="text-left">
                <p className="text-[8px] lg:text-[10px] text-slate-400 font-black uppercase tracking-[0.12em] leading-none">
                  {auth?.user?.role || "petani"}
                </p>
                <p className="text-xs lg:text-sm font-black text-slate-700 leading-tight">
                  {auth?.user?.username || "User"}
                </p>
              </div>
            </Link>
          </div>
        </header>

        <div className="bg-white/35 backdrop-blur-sm rounded-2xl min-h-[calc(100vh-14rem)] lg:min-h-[calc(100vh-10rem)] pb-6 lg:pb-7">
          {children}
        </div>
        </div>
      </main>
    </div>
  );
}
