/**
 * compressImage.js - SIPEPES v2.0
 * Kompresi gambar di sisi client (browser) menggunakan HTML5 Canvas.
 * - Format output: image/webp atau image/jpeg
 * - Sisi terpanjang maksimal: 1600px
 * - Target ukuran file: di bawah 2 MB (FR-3)
 */
export async function compressImage(file, maxDimension = 1600, maxSizeBytes = 2 * 1024 * 1024) {
  // Validasi tipe berkas foto
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Format file tidak didukung. Mohon gunakan foto berekstensi JPG, PNG, atau WebP.');
  }

  // Jika ukuran file asli sudah di bawah 1MB dan formatnya sudah webp/jpeg, langsung gunakan
  if (file.size <= 800 * 1024 && file.type === 'image/webp') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas foto.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Berkas gambar rusak atau tidak dapat dimuat.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Skala proporsional jika melebihi maxDimension (1600px)
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Turunkan kualitas bertahap hingga di bawah 2MB
        let quality = 0.85;

        const attemptCompression = (currentQuality) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Gagal melakukan kompresi foto pada canvas.'));
                return;
              }

              if (blob.size > maxSizeBytes && currentQuality > 0.4) {
                // Kompres ulang dengan kualitas lebih rendah
                attemptCompression(currentQuality - 0.15);
              } else {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                  type: 'image/webp',
                  lastModified: Date.now()
                });
                resolve({
                  file: compressedFile,
                  previewUrl: URL.createObjectURL(blob),
                  originalSize: file.size,
                  compressedSize: blob.size
                });
              }
            },
            'image/webp',
            currentQuality
          );
        };

        attemptCompression(quality);
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

