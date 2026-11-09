require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// 1. Middleware Dasar
app.use(cors({
  origin: process.env.CLIENT_ORIGIN_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Health Check & Root
app.get(`${API_PREFIX}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SIPEPES Backend API is running smoothly 🌊',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/', (req, res) => {
  res.send('🌊 SIPEPES (Sistem Informasi Pelaporan Pencemaran Sungai) API Server is Online.');
});

// 3. API V1 Routes
app.use(API_PREFIX, apiRoutes);

// 4. 404 Handler untuk rute yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rute '${req.method} ${req.originalUrl}' tidak ditemukan pada server SIPEPES.`,
  });
});

// 5. Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 SIPEPES Server running at http://localhost:${PORT}${API_PREFIX}`);
    console.log(`📡 Health Check: http://localhost:${PORT}${API_PREFIX}/health`);
  });
}

module.exports = app;
