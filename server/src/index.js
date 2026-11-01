require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SIPEPES Backend API is running smoothly 🌊',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root Information
app.get('/', (req, res) => {
  res.send('🌊 SIPEPES (Sistem Informasi Pelaporan Pencemaran Sungai) API Server is Online.');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER_ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SIPEPES Server running at http://localhost:${PORT}${API_PREFIX}`);
  console.log(`📡 Health Check: http://localhost:${PORT}${API_PREFIX}/health`);
});
