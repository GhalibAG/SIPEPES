import React, { useState } from 'react';
import {
  Waves,
  LayoutDashboard,
  FileText,
  MapPin,
  FolderTree,
  FileSpreadsheet,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Bell,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminReports from '../pages/admin/AdminReports';
import AdminMap from '../pages/admin/AdminMap';
import AdminSegments from '../pages/admin/AdminSegments';
import AdminExport from '../pages/admin/AdminExport';
import AdminVerifyModal from '../components/admin/AdminVerifyModal';

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
      id: 'reports',
      label: 'Daftar & Verifikasi',
      icon: FileText,
      badge: stats.menunggu > 0 ? stats.menunggu : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'map',
      label: 'Peta Sebaran Sungai',
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
      badge: 'PDF/XLS',
      badgeColor: 'bg-river-100 text-river-800'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      {/* Sidebar Mobile Toggle Button */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-river-600 flex items-center justify-center text-white">
            <Waves className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">SIPEPES Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Kiri (Desktop Persistent & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Header Sidebar */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-river-600 to-river-700 flex items-center justify-center text-white shadow-sm shadow-river-500/20">
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
              Menu Utama
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

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white text-river-700' : item.badgeColor || 'bg-slate-200 text-slate-700'
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
          {/* Info Admin */}
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

          {/* Tombol Lihat Web Publik */}
          <button
            onClick={onSwitchToPublic}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-river-600 hover:bg-river-50 rounded-lg transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Halaman Publik</span>
          </button>

          {/* Tombol Keluar */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun Admin</span>
          </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar Desktop */}
        <header className="hidden md:flex bg-white border-b border-slate-200 h-16 px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">SIPEPES</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>Portal Verifikasi Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-river-600 font-semibold capitalize">
              {menuItems.find(m => m.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-eco-50 border border-eco-200 text-eco-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sistem Monitoring Aktif</span>
            </div>
            <span className="text-xs text-slate-400">
              Palembang, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
            </span>
          </div>
        </header>

        {/* Halaman Dinamis */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={setActiveTab} />}
          {activeTab === 'reports' && <AdminReports />}
          {activeTab === 'map' && <AdminMap />}
          {activeTab === 'segments' && <AdminSegments />}
          {activeTab === 'export' && <AdminExport />}
        </main>
      </div>

      {/* Modal Verifikasi Global */}
      <AdminVerifyModal />
    </div>
  );
}
