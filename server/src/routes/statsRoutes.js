const express = require('express');
const router = express.Router();
const { successResponse } = require('../utils/response');
const supabase = require('../config/supabase'); // Menghubungkan ke database

/**
 * Route Statistik & Ringkasan Metrik Dashboard
 * Bagian Backend: Crespo Silaban
 */

// ==========================================
// 1. GET /api/v1/stats/summary (Metrik Utama)
// ==========================================
router.get('/summary', async (req, res, next) => {
  try {
    const { count: totalMasuk, error: errTotal } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true });

    const { count: antreanVerifikasi, error: errAntrean } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'menunggu');

    const { count: terverifikasiValid, error: errValid } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'diverifikasi');

    const { count: laporanDitolak, error: errDitolak } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ditolak');

    if (errTotal || errAntrean || errValid || errDitolak) {
      throw new Error("Gagal mengambil komputasi statistik dari Supabase");
    }

    return successResponse(res, 'Statistik ringkasan laporan berhasil dimuat', {
      totalMasuk: totalMasuk || 0,
      persenKenaikan: "12%",
      subMasuk: "Dari bulan sebelumnya",
      antreanVerifikasi: antreanVerifikasi || 0,
      terverifikasiValid: terverifikasiValid || 0,
      subValid: "81% valid",
      laporanDitolak: laporanDitolak || 0,
      subDitolak: "11.7% tingkat penolakan",
      rataRataIka: "54.2",
      statusIka: "Waspada"
    });

  } catch (error) {
    next(error);
  }
});


// ==========================================
// 2. GET /api/v1/stats/trends (Grafik Mingguan)
// ==========================================
router.get('/trends', async (req, res, next) => {
  try {
    // Tentukan batas waktu 7 hari ke belakang
    const tujuhHariLalu = new Date();
    tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 7);

    // Ambil data laporan dari Supabase yang masuk dalam 7 hari terakhir
    const { data: reports, error } = await supabase
      .from('reports')
      .select('created_at, waste_category')
      .gte('created_at', tujuhHariLalu.toISOString());

    if (error) throw new Error("Gagal mengambil data tren dari Supabase");

    // Hitung Komposisi Kategori
    let countPlastik = 0, countB3 = 0, countOrganik = 0;
    const totalReports = reports.length || 1; // Hindari pembagian dengan 0

    reports.forEach(report => {
      const kategori = (report.waste_category || '').toLowerCase();
      if (kategori.includes('domestik') || kategori.includes('plastik')) countPlastik++;
      else if (kategori.includes('industri') || kategori.includes('oli') || kategori.includes('b3')) countB3++;
      else countOrganik++;
    });

    const wasteComposition = [
      { label: 'Plastik / Domestik', count: countPlastik, percent: Math.round((countPlastik / totalReports) * 100), color: 'bg-slate-800' },
      { label: 'Limbah Cair / B3', count: countB3, percent: Math.round((countB3 / totalReports) * 100), color: 'bg-rose-500' },
      { label: 'Organik / Lainnya', count: countOrganik, percent: Math.round((countOrganik / totalReports) * 100), color: 'bg-emerald-600' }
    ];

    // Hitung Data Tren Mingguan per Hari
    const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const weeklyTrendData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const laporanHariIni = reports.filter(r => {
        const tglLaporan = new Date(r.created_at);
        return tglLaporan.getDate() === d.getDate() && tglLaporan.getMonth() === d.getMonth();
      });

      let plastikHarian = 0, b3Harian = 0, organikHarian = 0;
      
      laporanHariIni.forEach(r => {
        const kat = (r.waste_category || '').toLowerCase();
        if (kat.includes('domestik') || kat.includes('plastik')) plastikHarian++;
        else if (kat.includes('industri') || kat.includes('oli') || kat.includes('b3')) b3Harian++;
        else organikHarian++;
      });

      weeklyTrendData.push({
        day: namaHari[d.getDay()],
        plastik: plastikHarian,
        b3: b3Harian,
        organik: organikHarian
      });
    }

    return successResponse(res, 'Data tren dan komposisi berhasil dimuat', {
      wasteComposition,
      weeklyTrendData
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;