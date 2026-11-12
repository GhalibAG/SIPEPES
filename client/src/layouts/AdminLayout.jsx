import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  MapPin,
  FileSpreadsheet,
  FolderTree,
  ShieldAlert,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Droplets,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminVerifyPage from '../pages/admin/AdminVerifyPage';
import AdminMap from '../pages/admin/AdminMap';
import AdminSegments from '../pages/admin/AdminSegments';
import AdminExport from '../pages/admin/AdminExport';
import AdminAuditLog from '../pages/admin/AdminAuditLog';
import AdminSettings from '../pages/admin/AdminSettings';

export default function AdminLayout({ onSwitchToWarga }) {
  const { adminUser, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Ringkasan Eksekutif',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'verify',
      label: 'Verifikasi Laporan',
      icon: FileCheck2,
      badge: '12',
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'map',
      label: 'Peta Spasial GIS',
      icon: MapPin,
      badge: 'dot',
      badgeColor: 'bg-rose-500'
    },
    {
      id: 'export',
      label: 'Advokasi & Ekspor DLH',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: 'segments',
      label: 'Titik Sempadan Musi',
      icon: FolderTree,
      badge: null
    },
    {
      id: 'audit',
      label: 'Log Audit Petugas',
      icon: ShieldAlert,
      badge: null
    },
    {
      id: 'settings',
      label: 'Pengaturan Sistem',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans antialiased overflow-x-hidden">
      {/* Backdrop Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Top Mobile Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0088cc] flex items-center justify-center text-white shadow-xs">
            <Droplets className="w-4 h-4 fill-white/20" />
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tight text-sm">SIPEPES</span>
            <span className="text-[9px] text-slate-400 block font-bold tracking-wider uppercase leading-none">
              GG RIVER CARE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifikasi Lonceng Mobile */}
          <div className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center relative">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-extrabold flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Sidebar Kiri (Desktop Persistent & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="flex flex-col h-full justify-between overflow-y-auto">
          <div>
            {/* Header Logo */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0077b3] to-[#0099e6] flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
                  <Droplets className="w-5 h-5 fill-white/20" />
                </div>
                <div>
                  <span className="text-lg font-black text-slate-900 tracking-tight leading-none block">
                    SIPEPES
                  </span>
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-1 block">
                    GG RIVER CARE
                  </span>
                </div>
              </div>

              {/* Close Button on Mobile Drawer */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Menu */}
            <nav className="p-3 space-y-1">
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge === 'dot' ? (
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    ) : item.badge ? (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : item.badgeColor
                          }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer Sidebar */}
          <div className="p-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Server Terhubung
              </span>
              <span className="text-slate-400 font-mono">42ms</span>
            </div>

            <div className="text-[10px] text-slate-400 text-center leading-relaxed">
              <p>&copy; 2026 SIPEPES PALEMBANG</p>
              <p>DLH Sumsel &times; GG River Care</p>
            </div>

            {onSwitchToWarga && (
              <button
                onClick={onSwitchToWarga}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Lihat Portal Warga</span>
              </button>
            )}

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Sesi Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Topbar Banner (Desktop & Tablet) */}
        <header className="hidden md:flex bg-white border-b border-slate-200 h-16 px-4 sm:px-6 lg:px-8 items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {onSwitchToWarga && (
              <button
                onClick={onSwitchToWarga}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
                title="Buka Halaman Publik Warga"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                <span>Portal Warga</span>
              </button>
            )}

            {/* Notifikasi Lonceng */}
            <div className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer relative shadow-2xs transition">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </div>

            {/* Profil Admin: Zira Pertiwi */}
            <div className="flex items-center gap-2.5 sm:gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="font-extrabold text-slate-900 text-xs leading-tight">
                  {adminUser?.full_name || 'Zira Pertiwi'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate max-w-[160px]">
                  {adminUser?.division || 'Divisi PKL • Pengelola Lingkungan'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                <User className="w-4 h-4 text-white/90" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Pages Rendering dengan Padding Responsif */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={setActiveTab} />}
          {activeTab === 'verify' && <AdminVerifyPage onNavigate={setActiveTab} />}
          {activeTab === 'map' && <AdminMap onNavigate={setActiveTab} />}
          {activeTab === 'export' && <AdminExport onNavigate={setActiveTab} />}
          {activeTab === 'segments' && <AdminSegments onNavigate={setActiveTab} />}
          {activeTab === 'audit' && <AdminAuditLog onNavigate={setActiveTab} />}
          {activeTab === 'settings' && <AdminSettings onNavigate={setActiveTab} />}
        </main>
      </div>
    </div>
  );
}
