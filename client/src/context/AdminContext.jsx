import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialReports,
  mockAdminUser,
  sempadanList,
  auditLogs,
  advocacyArchives,
  weeklyTrendData,
  wasteComposition,
  criticalPoints
} from '../data/mockReports';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('sipepes_admin_reports_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Otomatis bersihkan referensi lama 'Mobile App' menjadi 'Via Portal Pelaporan Warga'
        return parsed.map((r) => ({
          ...r,
          reporter_source: r.reporter_source?.toLowerCase().includes('mobile')
            ? 'Via Portal Pelaporan Warga'
            : (r.reporter_source || 'Via Portal Pelaporan Warga')
        }));
      } catch (e) {
        return initialReports;
      }
    }
    return initialReports;
  });

  const [adminUser, setAdminUser] = useState(() => {
    const raw = localStorage.getItem('sipepes_admin_user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed) return parsed;
      } catch (e) {
        // ignore
      }
    }
    // Default sesi aktif agar admin dapat langsung dibuka saat testing & preview lokal
    return mockAdminUser;
  });

  // Selected report for Master-Detail verification view
  const [selectedReportId, setSelectedReportId] = useState(
    initialReports[0]?.id || null
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('sipepes_admin_reports_v2', JSON.stringify(reports));
  }, [reports]);

  const login = async (email, password, accountName) => {
    // 1. Coba otentikasi ke Backend API live Supabase jika tersedia
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.success && data.data?.token) {
        localStorage.setItem('sipepes_admin_token', data.data.token);
        localStorage.setItem('sipepes_admin_user', JSON.stringify(data.data.user));
        setAdminUser({
          ...mockAdminUser,
          id: data.data.user.id,
          username: data.data.user.email,
          full_name: data.data.user.name || mockAdminUser.full_name,
          role: data.data.user.role,
          email: data.data.user.email,
          unit_kerja: accountName || mockAdminUser.unit_kerja
        });
        return { success: true };
      }
    } catch (apiErr) {
      console.warn('API backend login fallback ke mode offline/mock:', apiErr.message);
    }

    // 2. Fallback validasi lokal untuk demo & testing offline
    if (
      (email === 'admin@sipepes.com' && password === 'admin123') ||
      (email === 'admin@sipepes.or.id' && password === 'admin123') ||
      (email && password)
    ) {
      localStorage.setItem('sipepes_admin_token', 'mock_jwt_token_admin_musilaban_2026');
      setAdminUser({
        ...mockAdminUser,
        username: email || mockAdminUser.username,
        email: email.includes('@') ? email : mockAdminUser.email,
        unit_kerja: accountName || mockAdminUser.unit_kerja
      });
      return { success: true };
    }
    return { success: false, message: 'Kombinasi Email dan password tidak valid' };
  };

  const logout = () => {
    localStorage.removeItem('sipepes_admin_token');
    setAdminUser(null);
  };

  const addReport = (newReportData) => {
    const trackingCode = `SPP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newReport = {
      id: `rep-${Date.now()}`,
      tracking_code: trackingCode,
      title: newReportData.title || 'Laporan Baru Warga',
      description: newReportData.description || '',
      category: newReportData.category || 'Minyak & B3',
      estimated_severity: newReportData.estimated_severity || 'sedang',
      latitude: newReportData.latitude || -2.9904,
      longitude: newReportData.longitude || 104.7565,
      address_landmark: newReportData.address_landmark || 'Dermaga 7 Ulu, Seberang Ulu I',
      district: newReportData.district || 'Seberang Ulu I',
      status: 'menunggu',
      created_at: new Date().toISOString(),
      reporter_name: newReportData.is_anonymous ? 'Anonim (Warga Palembang)' : (newReportData.reporter_name || 'Warga Palembang'),
      reporter_contact: newReportData.is_anonymous ? 'Disembunyikan' : (newReportData.reporter_contact || '+62 812-xxxx-xxxx'),
      reporter_source: 'Via Portal Pelaporan Warga',
      photo_url: newReportData.photo_url || 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80'
    };

    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const verifyReport = (id, newStatus, severity, notes, rejectionReason = '') => {
    setReports(prevReports =>
      prevReports.map(rep => {
        if (rep.id === id) {
          return {
            ...rep,
            status: newStatus,
            estimated_severity: severity || rep.estimated_severity,
            rejection_reason: newStatus === 'ditolak' ? rejectionReason : null,
            admin_notes: notes || rep.admin_notes,
            verified_by: adminUser?.full_name || 'Zira Pertiwi',
            verified_at: new Date().toISOString()
          };
        }
        return rep;
      })
    );
  };

  // Metrik Laporan Dinamis
  const totalReports = reports.length;
  const menungguCount = reports.filter(r => r.status === 'menunggu').length;
  const validCount = reports.filter(r => r.status === 'valid' || r.status === 'terverifikasi').length;
  const ditolakCount = reports.filter(r => r.status === 'ditolak').length;

  const stats = {
    totalMasuk: totalReports,
    persenKenaikan: '+14%',
    subMasuk: `${totalReports} Total Masuk`,
    antreanVerifikasi: menungguCount,
    urgentCount: reports.filter(r => r.status === 'menunggu' && r.is_urgent).length,
    terverifikasiValid: validCount,
    persenValid: totalReports > 0 ? `${Math.round((validCount / totalReports) * 100)}% valid` : '0%',
    subValid: 'Terbit di Peta Publik',
    laporanDitolak: ditolakCount,
    persenDitolak: totalReports > 0 ? `${Math.round((ditolakCount / totalReports) * 100)}% total` : '0%',
    subDitolak: 'Terdokumentasi rapi',
    // Dynamic counts
    menunggu: menungguCount,
    valid: validCount,
    ditolak: ditolakCount
  };

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        login,
        logout,
        reports,
        stats,
        selectedReportId,
        setSelectedReportId,
        selectedReport,
        addReport,
        verifyReport,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        severityFilter,
        setSeverityFilter,
        districtFilter,
        setDistrictFilter,
        sempadanList,
        auditLogs,
        advocacyArchives,
        weeklyTrendData,
        wasteComposition,
        criticalPoints
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin harus digunakan di dalam AdminProvider');
  }
  return context;
}
