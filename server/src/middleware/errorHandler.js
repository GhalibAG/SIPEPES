const { errorResponse } = require('../utils/response');

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[UNHANDLED_ERROR]', err);

  // Multer Error (e.g. File size limit)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(
        res,
        'Ukuran foto melebihi batas maksimal (maksimal 2MB).',
        [{ field: 'photo', message: 'Ukuran foto bukti tidak boleh melebihi 2MB' }],
        400
      );
    }
    return errorResponse(res, `Kesalahan unggah file: ${err.message}`, null, 400);
  }

  const statusCode = err.status || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  return errorResponse(
    res,
    message,
    process.env.NODE_ENV === 'development' ? [{ field: 'stack', message: err.stack }] : null,
    statusCode
  );
};

module.exports = errorHandler;
