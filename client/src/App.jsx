import React, { useState, useEffect } from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';

// Import Komponen Portal Warga
import WargaLayout from './layouts/WargaLayout';
import WargaHome from './pages/warga/WargaHome';
import WargaReportForm from './pages/warga/WargaReportForm';
import WargaTrack from './pages/warga/WargaTrack';
import WargaGuide from './pages/warga/WargaGuide';

function AppRoot() {
  const { adminUser } = useAdmin();

  // Deteksi rute awal dari URL browser
  const [currentPortal, setCurrentPortal] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      return 'admin';
    }
    return 'warga';
  });

  const [wargaTab, setWargaTab] = useState('home'); // 'home' | 'report' | 'track' | 'guide'

  // Sinkronisasi dengan URL browser
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setCurrentPortal('admin');
      } else {
        setCurrentPortal('warga');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const switchToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentPortal('admin');
  };

  const switchToWarga = () => {
    window.history.pushState({}, '', '/');
    setCurrentPortal('warga');
  };

  // 1. Render Portal Admin (Jika rute /admin atau tombol admin diklik)
  if (currentPortal === 'admin') {
    if (!adminUser) {
      return <AdminLogin onSwitchToWarga={switchToWarga} />;
    }
    return <AdminLayout onSwitchToWarga={switchToWarga} />;
  }

  // 2. Render Portal Publik Warga (Default di /)
  return (
    <WargaLayout
      activeTab={wargaTab}
      setActiveTab={setWargaTab}
      onOpenAdmin={switchToAdmin}
    >
      {wargaTab === 'home' && <WargaHome onNavigate={setWargaTab} />}
      {wargaTab === 'report' && <WargaReportForm onNavigate={setWargaTab} />}
      {wargaTab === 'track' && <WargaTrack onNavigate={setWargaTab} />}
      {wargaTab === 'guide' && <WargaGuide onNavigate={setWargaTab} />}
    </WargaLayout>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AppRoot />
    </AdminProvider>
  );
}
