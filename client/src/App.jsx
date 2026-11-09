import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';

function AdminRoot() {
  const { adminUser } = useAdmin();

  // Jika belum login, tampilkan layar login SIPEPES Enterprise
  if (!adminUser) {
    return <AdminLogin />;
  }

  // Jika sudah login, tampilkan AdminLayout terpadu
  return <AdminLayout />;
}


function WargaRoot() {
  const [activeTab, setActiveTab] = useState('pantauan'); // pantauan, lapor, lacak, edukasi

  return (
    <BaseLayoutWarga activeTab={activeTab} setActiveTab={setActiveTab}>
      
      {/* Halaman Beranda Peta Pantauan Warga */}
      {activeTab === 'pantauan' && (
        <DashboardWarga 
          onNavigateToReport={() => setActiveTab('lapor')} 
          onNavigateToTrack={() => setActiveTab('lacak')} 
        />
      )}

      {/* Halaman Formulir Pelaporan Masalah Warga */}
      {activeTab === 'lapor' && (
        <CreateReportWarga onBackToHome={() => setActiveTab('pantauan')} />
      )}

      {/* Halaman Pelacakan Tiket Laporan Warga */}
      {activeTab === 'lacak' && (
        <TrackReportWarga />
      )}

      {/* Halaman Panduan Visual & Edukasi Warga */}
      {activeTab === 'edukasi' && (
        <EducationWarga onNavigateToReport={() => setActiveTab('lapor')} />
      )}

    </BaseLayoutWarga>
  );
}

// 🌐 3. MAIN APP ROUTER (PENGATUR ALUR UTAMA WEBSITE)
export default function App() {
  // Deteksi apakah warga sedang mengakses URL khusus '/admin'
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AdminProvider>
        <AdminRoot />
      </AdminProvider>
    );
  }

  // Jika membuka URL biasa (bukan /admin), arahkan langsung ke halaman Warga
  return <WargaRoot />;
}
