require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Core middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// CORS (set CORS_ORIGIN to restrict, comma-separated)
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors({
  origin: corsOrigin ? corsOrigin.split(',').map((o) => o.trim()) : true,
  credentials: Boolean(corsOrigin),
}));

// Basic rate limiter
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Basic API endpoints
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the Node backend!' });
});

app.post('/api/echo', (req, res) => {
  // Echo back JSON body
  res.json({ youSent: req.body });
});

// Serve static files from `public` if present
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Fallback for SPA routes (if index.html exists in public)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const accepts = req.headers.accept || '';
  if (!accepts.includes('text/html') && !accepts.includes('*/*')) return next();

  const indexPath = path.join(publicDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) return next();
  });
});

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints: GET /health, GET /api/hello, POST /api/echo');
});

// Connect to MongoDB (optional)
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err.message));
} else {
  console.log('MONGO_URI not provided; using in-memory user store.');
}
