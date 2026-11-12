import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import WargaLayout from './layouts/WargaLayout';
import AdminLayout from './layouts/AdminLayout';

// Halaman Portal Warga
import WargaHome from './pages/warga/WargaHome';
import WargaReportForm from './pages/warga/WargaReportForm';
import WargaTrack from './pages/warga/WargaTrack';
import WargaGuide from './pages/warga/WargaGuide';

// Halaman Portal Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminVerifyPage from './pages/admin/AdminVerifyPage';
import AdminMap from './pages/admin/AdminMap';
import AdminExport from './pages/admin/AdminExport';
import AdminAuditLog from './pages/admin/AdminAuditLog';
import AdminSegments from './pages/admin/AdminSegments';

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* =========================================
              1. Rute Publik Warga (WargaLayout)
             ========================================= */}
          <Route element={<WargaLayout />}>
            <Route path="/" element={<WargaHome />} />
            <Route path="/lapor" element={<WargaReportForm />} />
            <Route path="/lapor/berhasil/:kode" element={<WargaReportForm />} />
            <Route path="/lacak" element={<WargaTrack />} />
            <Route path="/lacak/:kode" element={<WargaTrack />} />
            <Route path="/panduan" element={<WargaGuide />} />
          </Route>

          {/* =========================================
              2. Login Admin (Tanpa Auth Guard)
             ========================================= */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* =========================================
              3. Rute Terproteksi Admin (AdminLayout)
             ========================================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Halaman Utama Admin: Antrean Verifikasi */}
            <Route index element={<AdminVerifyPage />} />
            <Route path="laporan/:id" element={<AdminVerifyPage />} />
            <Route path="peta" element={<AdminMap />} />
            <Route path="rekap" element={<AdminExport />} />
            <Route path="riwayat" element={<AdminAuditLog />} />
            <Route path="data-master" element={<AdminSegments />} />
            {/* Redirect alias lama */}
            <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Fallback Rute Tidak Dikenal */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}
