import React from 'react';
import { Link } from 'react-router-dom';
import PartnerLogo from './PartnerLogo';

/**
 * SiteFooter Component - SIPEPES v2.0
 */
export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-garis mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-garis">
          {/* Logo Mitra & Penjelasan */}
          <div className="flex items-center gap-4">
            <PartnerLogo size={64} />
            <div>
              <p className="text-sm sm:text-base font-bold text-ink">
                Green Generation Palembang
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                Program GG River Care &bull; Gerakan Peduli Kebersihan &amp; Kelestarian Sungai Musi
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-ink-soft">
            <Link to="/" className="hover:text-musi-600 transition">Beranda &amp; Peta</Link>
            <Link to="/lapor" className="hover:text-musi-600 transition">Buat Laporan</Link>
            <Link to="/lacak" className="hover:text-musi-600 transition">Lacak Laporan</Link>
            <Link to="/panduan" className="hover:text-musi-600 transition">Panduan</Link>
            <Link to="/admin/login" className="hover:text-musi-600 transition">Portal Admin</Link>
          </div>
        </div>

        {/* Baris Bawah: Hak Cipta & Penafian Sesuai Referensi Desain */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <p>
            &copy; 2026 SIPEPES &bull; Dikelola bersama Green Generation Palembang (Program GG River Care).
          </p>
          <p>
            Tingkat pencemaran adalah dugaan visual warga &bull; Data pada demo ini adalah data uji.
          </p>
        </div>
      </div>
    </footer>
  );
}

