const crypto = require('crypto');

/**
 * Generate Unique Tracking Code dengan format: SPP-YYYYMM-XXXX
 * Contoh: SPP-202611-0482
 * @returns {string}
 */
const generateTrackingCode = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomSuffix = crypto.randomInt(1000, 9999); // 4 digit angka acak unik

  return `SPP-${year}${month}-${randomSuffix}`;
};

module.exports = {
  generateTrackingCode,
};
