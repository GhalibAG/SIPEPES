// server/src/controllers/statsController.js
const supabase = require('../config/supabase');
const { successResponse } = require('../utils/response');

// (Fungsi getDashboardStats yang sebelumnya kita buat bisa diletakkan di atas ini)
const getDashboardStats = async (req, res) => {
    try {
        // Menghitung total semua laporan menggunakan fitur 'count' bawaan Supabase
        const { count: totalMasuk, error: errorTotal } = await supabase
            .from('reports')
            .select('*', { count: 'exact', head: true });

        // Menghitung antrean verifikasi (asumsi statusnya 'menunggu')
        const { count: antreanVerifikasi, error: errorAntrean } = await supabase
            .from('reports')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'menunggu');

        // Menghitung tiket terverifikasi valid
        const { count: terverifikasiValid, error: errorValid } = await supabase
            .from('reports')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'diverifikasi');

        // Menghitung tiket ditolak
        const { count: laporanDitolak, error: errorDitolak } = await supabase
            .from('reports')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'ditolak');

        // Jika terjadi error pada salah satu query Supabase, lempar ke blok catch
        if (errorTotal || errorAntrean || errorValid || errorDitolak) {
            throw new Error("Gagal menghitung data dari Supabase");
        }

        // Susun format response JSON agar sama persis dengan yang dibutuhkan Frontend
        res.json({
            totalMasuk: totalMasuk || 0,
            persenKenaikan: "12%", // Nilai statis sementara, butuh logika perhitungan antar-bulan
            subMasuk: "Dari bulan sebelumnya",
            antreanVerifikasi: antreanVerifikasi || 0,
            terverifikasiValid: terverifikasiValid || 0,
            subValid: "81% valid",
            laporanDitolak: laporanDitolak || 0,
            subDitolak: "11.7% tingkat penolakan",
            rataRataIka: "54.2", // Nilai statis sementara untuk IKA
            statusIka: "Waspada"
        });

    } catch (error) {
        console.error("Error di getDashboardStats:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};


const getDashboardTrends = async (req, res, next) => {
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

    // ==========================================
    // 1. PROSES DATA KOMPOSISI KATEGORI
    // ==========================================
    let countPlastik = 0; // Mewakili Sampah Domestik/Plastik
    let countB3 = 0;      // Mewakili Limbah Industri/Oli/B3
    let countOrganik = 0; // Mewakili Limbah Organik/Lainnya
    const totalReports = reports.length || 1; // Hindari pembagian dengan 0

    reports.forEach(report => {
      const kategori = (report.waste_category || '').toLowerCase();
      if (kategori.includes('domestik') || kategori.includes('plastik')) {
        countPlastik++;
      } else if (kategori.includes('industri') || kategori.includes('oli') || kategori.includes('b3')) {
        countB3++;
      } else {
        countOrganik++;
      }
    });

    const wasteComposition = [
      {
        label: 'Plastik / Domestik',
        count: countPlastik,
        percent: Math.round((countPlastik / totalReports) * 100),
        color: 'bg-slate-800' // Sesuai warna di Figma
      },
      {
        label: 'Limbah Cair / B3',
        count: countB3,
        percent: Math.round((countB3 / totalReports) * 100),
        color: 'bg-rose-500'
      },
      {
        label: 'Organik / Lainnya',
        count: countOrganik,
        percent: Math.round((countOrganik / totalReports) * 100),
        color: 'bg-emerald-600'
      }
    ];

    // ==========================================
    // 2. PROSES DATA TREN MINGGUAN (CHART)
    // ==========================================
    // Siapkan array kosong untuk 7 hari terakhir
    const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const weeklyTrendData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      // Hitung jumlah laporan di hari tersebut
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

    // Kembalikan response ke frontend
    return successResponse(res, 'Data tren dan komposisi berhasil dimuat', {
      wasteComposition,
      weeklyTrendData
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  // getDashboardStats, (jika ada)
  getDashboardTrends
};