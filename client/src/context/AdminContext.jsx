import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialReports, riverSegments, monthlyStats, mockAdminUser } from '../data/mockReports';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // Ambil data laporan dari localStorage atau pakai initialReports
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('sipepes_admin_reports');
    return saved ? JSON.parse(saved) : initialReports;
  });

  // Auth state (mock token login)
  const [adminUser, setAdminUser] = useState(() => {
    const token = localStorage.getItem('sipepes_admin_token');
    return token ? mockAdminUser : null;
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'menunggu', 'valid', 'ditolak'
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all', 'ringan', 'sedang', 'berat'
  const [districtFilter, setDistrictFilter] = useState('all');

  // Modal Verifikasi State
  const [selectedReport, setSelectedReport] = useState(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Simpan ke localStorage saat reports berubah
  useEffect(() => {
    localStorage.setItem('sipepes_admin_reports', JSON.stringify(reports));
  }, [reports]);

  // Login handler
  const login = (email, password) => {
    // Sesuai docs/API_CONTRACT.md rute /auth/login
    if (email === 'admin@sipepes.or.id' && password === 'admin123') {
      localStorage.setItem('sipepes_admin_token', 'mock_jwt_token_admin_musilaban_2026');
      setAdminUser(mockAdminUser);
      return { success: true };
    }
    return { success: false, message: 'Email atau kata sandi admin tidak valid' };
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('sipepes_admin_token');
    setAdminUser(null);
  };

  // Verifikasi laporan handler (sesuai docs/API_CONTRACT.md PATCH /admin/reports/:id/verify)
  const verifyReport = (id, newStatus, severity, notes, rejectionReason = '') => {
    setReports(prevReports =>
      prevReports.map(rep => {
        if (rep.id === id) {
          return {
            ...rep,
            status: newStatus,
            estimated_severity: severity || rep.estimated_severity,
            rejection_reason: newStatus === 'ditolak' ? rejectionReason : null,
            admin_notes: notes || null,
            verified_by: adminUser ? adminUser.full_name : 'M. Ghalib Assiddiq Gusri',
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
        return rep;
      })
    );
  };

  // Hitung metrik ringkasan dinamis (docs/API_CONTRACT.md GET /stats/summary)
  const stats = {
    total: reports.length,
    menunggu: reports.filter(r => r.status === 'menunggu').length,
    valid: reports.filter(r => r.status === 'valid').length,
    ditolak: reports.filter(r => r.status === 'ditolak').length,
    berat: reports.filter(r => r.status === 'valid' && r.estimated_severity === 'berat').length,
    sedang: reports.filter(r => r.status === 'valid' && r.estimated_severity === 'sedang').length,
    ringan: reports.filter(r => r.status === 'valid' && r.estimated_severity === 'ringan').length
  };

  // Filter laporan
  const filteredReports = reports.filter(rep => {
    const matchSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rep.reporter_name && rep.reporter_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === 'all' || rep.status === statusFilter;
    const matchSeverity = severityFilter === 'all' || rep.estimated_severity === severityFilter;
    const matchDistrict = districtFilter === 'all' || rep.district === districtFilter;

    return matchSearch && matchStatus && matchSeverity && matchDistrict;
  });

  const openVerifyModal = (report) => {
    setSelectedReport(report);
    setIsVerifyModalOpen(true);
  };

  const closeVerifyModal = () => {
    setSelectedReport(null);
    setIsVerifyModalOpen(false);
  };

  return (
    <AdminContext.Provider
      value={{
        reports,
        filteredReports,
        stats,
        riverSegments,
        monthlyStats,
        adminUser,
        login,
        logout,
        verifyReport,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        severityFilter,
        setSeverityFilter,
        districtFilter,
        setDistrictFilter,
        selectedReport,
        isVerifyModalOpen,
        openVerifyModal,
        closeVerifyModal
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
