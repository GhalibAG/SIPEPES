const RiverSegmentModel = require('../models/riverSegmentModel');
const { successResponse } = require('../utils/response');

/**
 * Handler GET /api/v1/river-segments
 * Mengambil master data segmen titik Sungai Musi
 */
const getAllRiverSegments = async (req, res, next) => {
  try {
    const segments = await RiverSegmentModel.findAll();
    return successResponse(
      res,
      'Data master segmen Sungai Musi berhasil dimuat',
      segments,
      { total: segments.length }
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRiverSegments,
};
