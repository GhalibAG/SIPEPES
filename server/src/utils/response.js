/**
 * Response Utility Helper sesuai spesifikasi docs/API_CONTRACT.md
 */

/**
 * Format Response Berhasil (Success Envelope)
 * @param {import('express').Response} res
 * @param {string} message
 * @param {any} data
 * @param {object} [meta]
 * @param {number} [statusCode=200]
 */
const successResponse = (res, message = 'Operasi berhasil dilakukan', data = null, meta = undefined, statusCode = 200) => {
  const payload = {
    success: true,
    message,
    data,
  };

  if (meta !== undefined) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

/**
 * Format Response Gagal / Error (Error Envelope)
 * @param {import('express').Response} res
 * @param {string} message
 * @param {Array<{field: string, message: string}>|null} [errors=null]
 * @param {number} [statusCode=400]
 */
const errorResponse = (res, message = 'Terjadi kesalahan pada permintaan', errors = null, statusCode = 400) => {
  const payload = {
    success: false,
    message,
  };

  if (errors && Array.isArray(errors) && errors.length > 0) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse,
};
