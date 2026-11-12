const excel = require('exceljs');
const PDFDocument = require('pdfkit');

/**
 * Service Pembuatan Berkas Ekspor Advokasi (Excel & PDF)
 * Acuan: docs/API_CONTRACT.md & docs/ERD_SCHEMA.md
 */

/**
 * 1. Generate Excel (.xlsx) Buffer
 * @param {Array} reports
 * @returns {Promise<Buffer>}
 */
const generateExcel = async (reports = []) => {
  const workbook = new excel.Workbook();
  workbook.creator = 'SIPEPES GG River Care';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Rekap Advokasi Musi', {
    pageSetup: { paperSize: 9, orientation: 'landscape' },
  });

  // Format Kolom
  worksheet.columns = [
    { header: 'No', key: 'no', width: 6 },
    { header: 'Kode Tiket', key: 'tracking_code', width: 20 },
    { header: 'Tanggal Lapor', key: 'created_at', width: 18 },
    { header: 'Kecamatan', key: 'district', width: 22 },
    { header: 'Patokan Lokasi', key: 'address_landmark', width: 30 },
    { header: 'Jenis Pencemaran', key: 'pollution_type', width: 20 },
    { header: 'Tingkat Dugaan', key: 'estimated_severity', width: 16 },
    { header: 'Status Verifikasi', key: 'status', width: 16 },
    { header: 'Nama Pelapor', key: 'reporter_name', width: 20 },
    { header: 'Judul Laporan', key: 'title', width: 35 },
  ];

  // Header Styling
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0284C7' }, // River Blue
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 24;

  // Masukkan Baris Data
  reports.forEach((report, index) => {
    const formattedDate = report.created_at
      ? new Date(report.created_at).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '-';

    const row = worksheet.addRow({
      no: index + 1,
      tracking_code: report.tracking_code || '-',
      created_at: formattedDate,
      district: report.district || '-',
      address_landmark: report.address_landmark || '-',
      pollution_type: report.pollution_type || '-',
      estimated_severity: (report.estimated_severity || '-').toUpperCase(),
      status: (report.status || '-').toUpperCase(),
      reporter_name: report.reporter_name || 'Warga Peduli',
      title: report.title || '-',
    });

    row.alignment = { vertical: 'middle' };
    row.getCell('no').alignment = { horizontal: 'center' };
    row.getCell('tracking_code').alignment = { horizontal: 'center' };
    row.getCell('created_at').alignment = { horizontal: 'center' };
    row.getCell('estimated_severity').alignment = { horizontal: 'center' };
    row.getCell('status').alignment = { horizontal: 'center' };
  });

  return await workbook.xlsx.writeBuffer();
};

/**
 * 2. Generate PDF (.pdf) Buffer
 * @param {Array} reports
 * @returns {Promise<Buffer>}
 */
const generatePDF = (reports = []) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Header Dokumen
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#0284C7')
        .text('SIPEPES — LAPORAN REKAPITULASI ADVOKASI LINGKUNGAN', { align: 'center' });

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#64748B')
        .text('Green Generation Palembang (Program GG River Care)', { align: 'center' });

      doc
        .fontSize(9)
        .text(`Dicetak pada: ${new Date().toLocaleString('id-ID')} | Total Data: ${reports.length} Laporan`, {
          align: 'center',
        });

      doc.moveDown(1);
      doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(1);

      // Daftar Laporan
      if (reports.length === 0) {
        doc.fontSize(11).font('Helvetica-Oblique').fillColor('#94A3B8').text('Tidak ada data laporan yang sesuai kriteria.', { align: 'center' });
      } else {
        reports.forEach((report, index) => {
          // Check page break
          if (doc.y > 720) {
            doc.addPage();
          }

          const severityColor =
            report.estimated_severity === 'berat'
              ? '#DC2626'
              : report.estimated_severity === 'sedang'
              ? '#D97706'
              : '#059669';

          doc
            .fontSize(11)
            .font('Helvetica-Bold')
            .fillColor('#0F172A')
            .text(`${index + 1}. [${report.tracking_code || 'TIKET'}] ${report.title || 'Laporan Pencemaran'}`);

          doc
            .fontSize(9)
            .font('Helvetica')
            .fillColor('#475569')
            .text(
              `Kecamatan: ${report.district || '-'} | Patokan: ${report.address_landmark || '-'} | Jenis: ${report.pollution_type || '-'}`
            );

          doc
            .fontSize(9)
            .font('Helvetica-Bold')
            .fillColor(severityColor)
            .text(`Tingkat Keparahan: ${(report.estimated_severity || '-').toUpperCase()} `, { continued: true })
            .font('Helvetica')
            .fillColor('#64748B')
            .text(`| Status: ${(report.status || '-').toUpperCase()} | Tanggal: ${report.created_at ? new Date(report.created_at).toLocaleDateString('id-ID') : '-'}`);

          if (report.description) {
            doc
              .fontSize(9)
              .font('Helvetica-Oblique')
              .fillColor('#334155')
              .text(`Deskripsi: "${report.description.slice(0, 150)}${report.description.length > 150 ? '...' : ''}"`);
          }

          doc.moveDown(0.8);
        });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateExcel,
  generatePDF,
};
