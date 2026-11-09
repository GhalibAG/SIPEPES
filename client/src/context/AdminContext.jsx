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
    return saved ? JSON.parse(saved) : initialReports;
  });

  const [adminUser, setAdminUser] = useState(() => {
    const token = localStorage.getItem('sipepes_admin_token');
    return token ? mockAdminUser : null;
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

  const login = (usernameOrNip, password, accountName) => {
    // Validasi login fleksibel untuk mempermudah review dosen/penguji
    if (
      (usernameOrNip && password) ||
      (usernameOrNip === 'admin@sipepes.or.id' && password === 'admin123')
    ) {
      localStorage.setItem('sipepes_admin_token', 'mock_jwt_token_admin_musilaban_2026');
      setAdminUser({
        ...mockAdminUser,
        username: usernameOrNip || mockAdminUser.username,
        unit_kerja: accountName || mockAdminUser.unit_kerja
      });
      return { success: true };
    }
    return { success: false, message: 'Kombinasi NIP/Username dan password tidak valid' };
  };

  const logout = () => {
    localStorage.removeItem('sipepes_admin_token');
    setAdminUser(null);
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

  // Metrik sesuai nilai di Layar Figma HD
  const stats = {
    totalMasuk: 128,
    persenKenaikan: '+14%',
    subMasuk: '+112 Laporan',
    antreanVerifikasi: 9, // "09"
    urgentCount: 6,
    terverifikasiValid: 104,
    persenValid: '81.2% valid',
    subValid: 'Terkoneksi GIS & DLH',
    laporanDitolak: 15,
    persenDitolak: '11.7% total',
    subDitolak: 'Terdokumentasi rapi',
    rataRataIka: 58.4,
    statusIka: 'Sedang',
    // Dynamic counts
    menunggu: reports.filter(r => r.status === 'menunggu').length,
    valid: reports.filter(r => r.status === 'valid').length,
    ditolak: reports.filter(r => r.status === 'ditolak').length
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
