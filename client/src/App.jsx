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

export default function App() {
  return (
    <AdminProvider>
      <AdminRoot />
    </AdminProvider>
  );
}
