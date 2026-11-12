import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

/**
 * ProtectedRoute Component - SIPEPES v2.0
 * Melindungi rute /admin/* agar hanya bisa diakses admin yang sudah login.
 */
export default function ProtectedRoute({ children }) {
  const { adminUser } = useAdmin();

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return children || <Outlet />;
}

