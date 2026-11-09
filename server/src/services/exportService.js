// server/src/services/exportService.js
const excel = require('exceljs');
const PDFDocument = require('pdfkit');

// A. Fungsi Membuat Excel
const generateExcel = async (reports) => {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Rekap Laporan SIPEPES');

  // Definisi Kolom Tabel Excel
  worksheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Kode Laporan', key: 'tracking_code', width: 20 },
    { header: 'Tanggal', key: 'created_at', width: 20 },
    { header: 'Judul Insiden', key: 'title', width: 35 },
    { header: 'Lokasi/Landmark', key: 'address_landmark', width: 40 },
    { header: 'Kategori', key: 'waste_category', width: 15 },
    { header: 'Tingkat', key: 'estimated_severity', width: 15 },
    { header: 'Status', key: 'status', width: 15 }
  ];

  // Memasukkan data ke baris Excel
  reports.forEach((report, index) => {
    worksheet.addRow({
      no: index + 1,
      tracking_code: report.tracking_code || '-',
      created_at: new Date(report.created_at).toLocaleDateString('id-ID'),
      title: report.title || '-',
      address_landmark: report.address_landmark || '-',
      waste_category: report.waste_category || '-',
      estimated_severity: report.estimated_severity || '-',
      status: report.status || '-'
    });
  });

  // Tebalkan baris header
  worksheet.getRow(1).font = { bold: true };

  // Mengembalikan file dalam bentuk buffer
  return await workbook.xlsx.writeBuffer();
};

// B. Fungsi Membuat PDF
const generatePDF = (reports) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    // Kumpulkan potongan data PDF ke array
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header Dokumen
    doc.fontSize(18).font('Helvetica-Bold').text('Rekapitulasi Laporan Kerusakan Sungai (SIPEPES)', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, { align: 'center' });
    doc.moveDown(2);

    // List Laporan
    reports.forEach((report, index) => {
      doc.fontSize(12).font('Helvetica-Bold').text(`${index + 1}. [${report.tracking_code || '-'}] ${report.title || '-'}`);
      doc.fontSize(10).font('Helvetica').text(`Lokasi: ${report.address_landmark || '-'}`);
      doc.text(`Kategori: ${report.waste_category || '-'} | Status: ${report.status || '-'}`);
      doc.moveDown(1);
    });

    // Selesaikan penulisan dokumen
    doc.end();
  });
};

module.exports = {
  generateExcel,
  generatePDF
};