import React from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

/**
 * WargaLayout - SIPEPES v2.0
 * Layout induk untuk semua halaman publik warga.
 */
export default function WargaLayout({ children }) {
  return (
    <div className="min-h-screen bg-krem text-ink flex flex-col font-sans">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children || <Outlet />}
      </main>
      <SiteFooter />
    </div>
  );
}
