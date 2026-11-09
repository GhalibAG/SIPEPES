import React from 'react';
import { Waves, Send, Phone, MessageSquare } from 'lucide-react';

export default function BaseLayoutWarga({ children, activeTab, setActiveTab }) {
  const navItems = [
    { id: 'pantauan', label: 'Beranda & Peta' },
    { id: 'lapor', label: 'Lapor Pencemaran' },
    { id: 'lacak', label: 'Lacak Laporan' },
    { id: 'edukasi', label: 'Panduan & Edukasi' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* =========================================================
          INTERNAL COMPONENT 1: Top Navigation Bar (`NavbarWarga`)
          ========================================================= */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Side: Brand Logo & Title */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group" 
              onClick={() => setActiveTab('pantauan')}
            >
              <div className="w-10 h-10 rounded-xl bg-river-600 text-white flex items-center justify-center shadow-md group-hover:bg-river-700 transition-colors">
                <Waves className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 leading-tight text-base sm:text-lg tracking-tight">
                  SIPEPES
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
                  MUSI PALEMBANG (WARGA)
                </span>
              </div>
            </div>

            {/* Middle Component (Desktop Navigation Menu): hidden md:flex */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'text-river-600 bg-sky-50 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right Side Component: Mobile Action & User Profile Avatar */}
            <div className="flex items-center space-x-3">
              {/* Mobile Report Shortcut Button (Visible ONLY on mobile: md:hidden) */}
              <button
                onClick={() => setActiveTab('lapor')}
                className="md:hidden p-2 rounded-lg bg-river-600 text-white hover:bg-river-700 transition-colors shadow-sm flex items-center justify-center"
                title="Lapor Pencemaran"
                aria-label="Lapor Pencemaran"
              >
                <Send className="w-4 h-4" />
              </button>

              {/* User Avatar Layout Container */}
              <div className="w-9 h-9 rounded-full bg-river-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                W
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* =========================================================
          INTERNAL COMPONENT 2: Global Barometer Sub-header Bar
          ========================================================= */}
      <div className="bg-amber-50 border-t border-b border-amber-100 py-2 text-center text-xs font-medium text-amber-800 shadow-inner px-4">
        <span>🔸 Barometer Musi: </span>
        <span className="font-bold">IKA 58.4 (Cemar Sedang)</span>
        <span> Palembang Hari Ini</span>
      </div>

      {/* =========================================================
          MAIN CONTENT SLOT VIEWPORT
          ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 mb-16 md:mb-0">
        {children}
      </main>

      {/* =========================================================
          INTERNAL COMPONENT 3: Citizen Footer Bar (`FooterWarga`)
          ========================================================= */}
      <footer className="bg-white border-t border-slate-200 pt-6 pb-20 md:pb-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          
          {/* Entity & App Identification */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-xs">SIPEPES Warga Palembang</h4>
            <p className="text-slate-500 text-xs">
              Dinas Lingkungan Hidup Kota Palembang & Relawan Musi River Care
            </p>
          </div>

          {/* Emergency Hotline Action Grid */}
          <div className="flex gap-3 justify-center text-xs font-semibold max-w-sm mx-auto">
            {/* Left Button (Emergency) */}
            <a
              href="tel:112"
              className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 py-2.5 px-4 rounded-lg transition shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>112 Darurat</span>
            </a>

            {/* Right Button (WhatsApp) */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 py-2.5 px-4 rounded-lg transition shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp DLH</span>
            </a>
          </div>

          {/* Absolute Baseline Copyright Text */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] text-slate-400">
              © 2026 SIPEPES Warga Palembang • Saluran Resmi Pemantauan Ekologi Sungai Musi
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}