import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialReports, riverSegments, monthlyStats, mockAdminUser, recentActivities } from '../data/mockReports';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('sipepes_admin_reports');
    return saved ? JSON.parse(saved) : initialReports;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('sipepes_admin_activities');
    return saved ? JSON.parse(saved) : recentActivities;
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
    localStorage.setItem('sipepes_admin_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('sipepes_admin_activities', JSON.stringify(activities));
  }, [activities]);

  const login = (email, password) => {
    if (email === 'admin@sipepes.or.id' && password === 'admin123') {
      localStorage.setItem('sipepes_admin_token', 'mock_jwt_token_admin_musilaban_2026');
      setAdminUser(mockAdminUser);
      return { success: true };
    }
    return { success: false, message: 'Email atau kata sandi admin tidak valid' };
  };

  const logout = () => {
    localStorage.removeItem('sipepes_admin_token');
    setAdminUser(null);
  };

  const verifyReport = (id, newStatus, severity, notes, rejectionReason = '') => {
    let targetReport = null;
    setReports(prevReports =>
      prevReports.map(rep => {
        if (rep.id === id) {
          targetReport = rep;
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

    if (targetReport) {
      const newLog = {
        id: `log-${Date.now()}`,
        report_title: targetReport.title,
        tracking_code: targetReport.tracking_code,
        admin_name: adminUser ? adminUser.full_name : 'M. Ghalib Assiddiq Gusri',
        action: newStatus,
        severity: severity || targetReport.estimated_severity,
        timestamp: new Date().toISOString()
      };
      setActivities(prev => [newLog, ...prev]);
    }
  };

  const stats = {
    total: reports.length,
    menunggu: reports.filter(r => r.status === 'menunggu').length,
    valid: reports.filter(r => r.status === 'valid').length,
    ditolak: reports.filter(r => r.status === 'ditolak').length,
    rekap: reports.filter(r => r.status === 'valid').length,
    berat: reports.filter(r => r.status === 'valid' && r.estimated_severity === 'berat').length,
    sedang: reports.filter(r => r.status === 'valid' && r.estimated_severity === 'sedang').length,
    ringan: reports.filter(r => r.status === 'valid' && r.estimated_severity === 'ringan').length
  };

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

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0] || null;

  return (
    <AdminContext.Provider
      value={{
        reports,
        filteredReports,
        stats,
        riverSegments,
        monthlyStats,
        activities,
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
        selectedReportId,
        setSelectedReportId,
        selectedReport
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
