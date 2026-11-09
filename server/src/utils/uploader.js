const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const crypto = require('crypto');
const supabase = require('../config/supabase');

const MAX_FILE_SIZE = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 2) * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'sipepes-reports';

// Memory Storage agar file bisa diproses oleh Sharp sebelum disimpan
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Format file tidak didukung. Harap unggah foto berekstensi JPG, PNG, atau WebP.');
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

/**
 * Kompresi dan unggah foto ke Supabase Storage (atau fallback lokal/mock)
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} folder
 * @returns {Promise<{photoUrl: string, thumbnailUrl: string}>}
 */
const processAndUploadPhoto = async (fileBuffer, originalName = 'photo.jpg', folder = 'reports') => {
  const timestamp = Date.now();
  const randomId = crypto.randomBytes(4).toString('hex');
  const baseFileName = `${folder}/${timestamp}-${randomId}`;

  // 1. Kompresi gambar utama (maks lebar 1600px, WebP quality 80)
  const compressedMainBuffer = await sharp(fileBuffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // 2. Buat thumbnail ringan (maks lebar 320px, WebP quality 70)
  const thumbnailBuffer = await sharp(fileBuffer)
    .resize({ width: 320, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toBuffer();

  const mainPath = `${baseFileName}.webp`;
  const thumbPath = `${baseFileName}-thumb.webp`;

  const isSupabaseConfigured = process.env.SUPABASE_URL &&
    !process.env.SUPABASE_URL.includes('your-project-id') &&
    process.env.SUPABASE_ANON_KEY &&
    !process.env.SUPABASE_ANON_KEY.includes('your_');

  if (isSupabaseConfigured) {
    try {
      // Pastikan bucket ada
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(BUCKET_NAME);
      if (bucketError && bucketError.message.includes('not found')) {
        await supabase.storage.createBucket(BUCKET_NAME, { public: true });
      }

      // Unggah file utama
      const { error: mainUploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(mainPath, compressedMainBuffer, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (mainUploadError) throw mainUploadError;

      // Unggah thumbnail
      const { error: thumbUploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(thumbPath, thumbnailBuffer, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (thumbUploadError) throw thumbUploadError;

      // Ambil Public URL
      const { data: mainUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(mainPath);
      const { data: thumbUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(thumbPath);

      return {
        photoUrl: mainUrlData.publicUrl,
        thumbnailUrl: thumbUrlData.publicUrl,
      };
    } catch (err) {
      console.error('⚠️ [STORAGE_UPLOAD_ERROR] Gagal upload ke Supabase Storage, beralih ke fallback:', err.message);
    }
  }

  // Fallback dev mode jika Supabase Storage belum terkoneksi credentials aslinya
  const fallbackMain = `https://storage.sipepes.or.id/reports/${timestamp}-${randomId}.webp`;
  const fallbackThumb = `https://storage.sipepes.or.id/reports/${timestamp}-${randomId}-thumb.webp`;

  return {
    photoUrl: fallbackMain,
    thumbnailUrl: fallbackThumb,
  };
};

module.exports = {
  upload,
  processAndUploadPhoto,
  MAX_FILE_SIZE,
};
