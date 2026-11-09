const { POLLUTION_TYPES, SEVERITY_LEVELS } = require('../utils/constants');
const { errorResponse } = require('../utils/response');

/**
 * Validasi form laporan baru warga
 */
const validateReportInput = (req, res, next) => {
  const errors = [];
  const {
    title,
    description,
    latitude,
    longitude,
    district,
    pollution_type,
    estimated_severity,
  } = req.body;

  // 1. Validasi Foto
  if (!req.file) {
    errors.push({
      field: 'photo',
      message: 'Foto bukti pencemaran sungai wajib diunggah.',
    });
  }

  // 2. Validasi Judul
  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    errors.push({
      field: 'title',
      message: 'Judul laporan wajib diisi minimal 5 karakter.',
    });
  }

  // 3. Validasi Deskripsi
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push({
      field: 'description',
      message: 'Deskripsi laporan wajib diisi minimal 10 karakter.',
    });
  }

  // 4. Validasi Koordinat Latitude & Longitude
  const latNum = parseFloat(latitude);
  const lngNum = parseFloat(longitude);

  if (isNaN(latNum) || latNum < -90 || latNum > 90) {
    errors.push({
      field: 'latitude',
      message: 'Koordinat lintang (latitude) tidak valid.',
    });
  }

  if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
    errors.push({
      field: 'longitude',
      message: 'Koordinat bujur (longitude) tidak valid.',
    });
  }

  // 5. Validasi Kecamatan
  if (!district || typeof district !== 'string' || district.trim().length === 0) {
    errors.push({
      field: 'district',
      message: 'Nama kecamatan di Kota Palembang wajib dipilih.',
    });
  }

  // 6. Validasi Jenis Limbah
  if (!pollution_type || !POLLUTION_TYPES.includes(pollution_type)) {
    errors.push({
      field: 'pollution_type',
      message: `Jenis pencemaran harus salah satu dari: ${POLLUTION_TYPES.join(', ')}.`,
    });
  }

  // 7. Validasi Tingkat Keparahan
  if (!estimated_severity || !SEVERITY_LEVELS.includes(estimated_severity)) {
    errors.push({
      field: 'estimated_severity',
      message: `Tingkat dugaan keparahan harus salah satu dari: ${SEVERITY_LEVELS.join(', ')}.`,
    });
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validasi form pelaporan gagal', errors, 422);
  }

  next();
};

module.exports = {
  validateReportInput,
};
