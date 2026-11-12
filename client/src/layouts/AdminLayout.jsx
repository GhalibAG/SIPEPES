import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  MapPin,
  FileSpreadsheet,
  FolderTree,
  History,
  LogOut,
  Menu,
  X,
  Droplets,
  ExternalLink,
  User
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import PartnerLogo from '../components/PartnerLogo';

/**
 * AdminLayout - SIPEPES v2.0
 * Tata letak portal admin GG River Care.
 * Menu admin: Antrean, Peta, Rekap, Riwayat, Data Master.
 */
export default function AdminLayout() {
  const { adminUser, logout, reports } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Hitung antrean yang menunggu verifikasi secara dinamis
  const pendingCount = (reports || []).filter(r => r.status === 'menunggu').length;

  const menuItems = [
    {
      to: '/admin',
      end: true,
      label: 'Antrean Verifikasi',
      icon: FileCheck2,
      badge: pendingCount > 0 ? String(pendingCount) : null,
      badgeColor: 'bg-ceria-400 text-ink'
    },
    {
      to: '/admin/peta',
      end: false,
      label: 'Peta Sebaran',
      icon: MapPin,
      badge: null
    },
    {
      to: '/admin/rekap',
      end: false,
      label: 'Rekap & Ekspor',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      to: '/admin/riwayat',
      end: false,
      label: 'Riwayat Verifikasi',
      icon: History,
      badge: null
    },
    {
      to: '/admin/data-master',
      end: false,
      label: 'Data Master',
      icon: FolderTree,
      badge: null
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-abu-100 flex flex-col md:flex-row text-ink font-sans antialiased">
      {/* Backdrop Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-ink/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Top Mobile Bar (< 768px) */}
      <div className="md:hidden bg-white border-b border-garis px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-ungu-600 flex items-center justify-center text-white shadow-xs">
            <Droplets className="w-4 h-4 fill-white/20" />
          </div>
          <div>
            <span className="font-extrabold text-ink tracking-tight text-sm">SIPEPES</span>
            <span className="text-xs text-ink-muted block font-semibold uppercase leading-none">
              Admin GG River Care
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-ink hover:bg-slate-100 transition cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 bg-white border-r border-garis flex flex-col justify-between transition-transform duration-300 ease-halus shrink-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full justify-between overflow-y-auto scrollbar-none">
          <div>
            {/* Header Sidebar Brand */}
            <div className="p-5 border-b border-garis flex items-center justify-between">
              <Link to="/admin" className="flex items-center gap-3">
                <PartnerLogo size={36} />
                <div>
                  <span className="font-bold text-ink text-sm block leading-tight">
                    GG River Care
                  </span>
                  <span className="text-xs text-ink-muted font-medium block">
                    Portal Admin
                  </span>
                </div>
              </Link>

              {/* Close Button on Mobile Drawer */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden text-ink-muted hover:text-ink p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Menu */}
            <nav className="p-3 space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-150 ease-halus ${
                        isActive
                          ? 'bg-ungu-100 text-ungu-800 font-bold shadow-2xs'
                          : 'text-ink-soft hover:bg-slate-50 hover:text-ink'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-ceria-100 text-ceria-800'}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Footer Sidebar */}
          <div className="p-4 border-t border-garis space-y-3">
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-ink-soft hover:text-ink bg-slate-50 hover:bg-slate-100 rounded-2xl transition border border-garis"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Portal Warga</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-tingkat-berat-tx hover:bg-tingkat-berat-bg rounded-2xl transition border border-transparent cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Sesi Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Topbar Banner Desktop */}
        <header className="hidden md:flex bg-white border-b border-garis h-16 px-6 lg:px-8 items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="text-xs font-semibold text-ink-muted">
            Komunitas Green Generation Palembang &bull; Program GG River Care
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-garis hover:bg-slate-100 text-ink text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
              <span>Portal Warga</span>
            </Link>

            {/* Profil Admin */}
            <div className="flex items-center gap-3 pl-3 border-l border-garis">
              <div className="text-right">
                <p className="font-bold text-ink text-xs leading-tight">
                  {adminUser?.full_name || 'Admin GG River Care'}
                </p>
                <p className="text-xs text-ink-muted font-medium">
                  Divisi PKL &bull; Relawan Lingkungan
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-ungu-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Pages Rendering via Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
