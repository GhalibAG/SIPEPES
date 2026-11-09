import React, { useState } from 'react';
import {
  Waves,
  LayoutDashboard,
  ShieldCheck,
  FileCheck2,
  FileText,
  MapPin,
  FolderTree,
  FileSpreadsheet,
  LogOut,
  Bell,
  ExternalLink,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminVerifyPage from '../pages/admin/AdminVerifyPage';
import AdminReports from '../pages/admin/AdminReports';
import AdminMap from '../pages/admin/AdminMap';
import AdminSegments from '../pages/admin/AdminSegments';
import AdminExport from '../pages/admin/AdminExport';

export default function AdminLayout({ onSwitchToPublic }) {
  const { adminUser, logout, stats } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Ringkasan',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'verify',
      label: 'Verifikasi Laporan',
      icon: FileCheck2,
      badge: stats.menunggu > 0 ? stats.menunggu : null,
      badgeColor: 'bg-amber-500 text-white animate-pulse'
    },
    {
      id: 'reports',
      label: 'Daftar Seluruh Laporan',
      icon: FileText,
      badge: stats.total,
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'map',
      label: 'Peta Pemantauan Titik',
      icon: MapPin,
      badge: null
    },
    {
      id: 'segments',
      label: 'Master Segmen Sungai',
      icon: FolderTree,
      badge: null
    },
    {
      id: 'export',
      label: 'Rekapitulasi Advokasi',
      icon: FileSpreadsheet,
      badge: 'Cetak/PDF',
      badgeColor: 'bg-river-100 text-river-800'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Top Mobile Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-river-600 flex items-center justify-center text-white">
            <Waves className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-sm">SIPEPES Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Kiri (Desktop Persistent & Mobile Drawer, Sesuai Layar Figma) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Header Sidebar */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-river-600 to-river-700 flex items-center justify-center text-white shadow-sm shadow-river-600/20">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  SIPEPES
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-river-100 text-river-800">
                    ADMIN
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 font-medium">
                  Green Generation Palembang
                </p>
              </div>
            </div>
          </div>

          {/* Navigasi Utama */}
          <nav className="p-3 space-y-1">
            <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigasi Admin
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-river-600 text-white shadow-sm shadow-river-600/25'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-river-700' : item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bagian Bawah: Profil Admin & Tombol Aksi */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* Card Profil Verifikator */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-river-100 text-river-700 flex items-center justify-center font-bold text-xs">
              GA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {adminUser?.full_name || 'M. Ghalib Assiddiq'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Divisi PKL (Verifikator)
              </p>
            </div>
          </div>

          <button
            onClick={onSwitchToPublic}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-river-600 hover:bg-river-50 rounded-lg transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Portal Warga</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun Admin</span>
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Banner Kemitraan (Sesuai Seluruh Layar Figma) */}
        <header className="hidden md:flex bg-white border-b border-slate-200 h-16 px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-river-700 bg-river-50 px-3 py-1 rounded-full border border-river-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-river-600" />
              SISTEM INFORMASI PELAPORAN PENCEMARAN SUNGAI MUSI
            </span>
            <span className="text-xs text-slate-400 font-medium">
              &bull; Kolaborasi Green Generation Palembang (GG River Care)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center cursor-pointer relative">
              <Bell className="w-4 h-4" />
              {stats.menunggu > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
              )}
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-river-600 text-white flex items-center justify-center text-xs font-bold">
                GA
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-900 leading-tight">M. Ghalib Assiddiq</p>
                <p className="text-[10px] text-slate-400">Admin PKL</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={setActiveTab} />}
          {activeTab === 'verify' && <AdminVerifyPage />}
          {activeTab === 'reports' && <AdminReports onNavigate={setActiveTab} />}
          {activeTab === 'map' && <AdminMap onNavigate={setActiveTab} />}
          {activeTab === 'segments' && <AdminSegments />}
          {activeTab === 'export' && <AdminExport />}
        </main>
      </div>
    </div>
  );
}
