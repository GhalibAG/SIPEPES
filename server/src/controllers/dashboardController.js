// server/src/controllers/dashboardController.js
const supabase = require('../config/supabase');
const { successResponse } = require('../utils/response');

// Fungsi untuk mengambil 5 metrik utama di bagian atas dashboard
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

const getUrgentReports = async (req, res, next) => {
  try {
    const { data: urgentReports, error } = await supabase
      .from('reports')
      .select('id, tracking_code, title, address_landmark, photo_url, estimated_severity, status, is_urgent, created_at')
      .or('status.eq.menunggu,is_urgent.eq.true')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      throw new Error("Gagal mengambil data antrean verifikasi mendesak");
    }

    // UBAH BAGIAN INI: Gunakan successResponse bawaan proyek
    return successResponse(res, 'Data antrean mendesak berhasil dimuat', urgentReports || []);

  } catch (error) {
    next(error);
  }
};



// Pastikan untuk mengekspor fungsi baru ini di bagian paling bawah file
module.exports = {
  getDashboardStats,
  getUrgentReports
};