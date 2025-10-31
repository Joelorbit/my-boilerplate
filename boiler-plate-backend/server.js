require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Basic security and logging
app.use(helmet());
app.use(morgan('dev'));

// Rate limiter (basic)
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }));

// Simple CORS middleware (no extra dependency needed)
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Credentials', 'true');
	if (req.method === 'OPTIONS') return res.sendStatus(204);
	next();
});

app.use(express.json());

// Mount auth routes (added in scaffold)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Basic API endpoints
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/hello', (req, res) => {
	res.json({ message: 'Hello from the Node backend!' });
});

app.post('/api/echo', (req, res) => {
	// echo back JSON body
	res.json({ youSent: req.body });
});

// Serve static files from `public` if present
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Fallback for SPA routes (if index.html exists in public)
// Use a generic middleware (no path pattern) so it doesn't get parsed by path-to-regexp.
app.use((req, res, next) => {
	// Only attempt to serve index.html for GET requests that accept HTML
	if (req.method !== 'GET') return next();
	const accepts = req.headers.accept || '';
	if (!accepts.includes('text/html') && !accepts.includes('*/*')) return next();

	const indexPath = path.join(publicDir, 'index.html');
	res.sendFile(indexPath, (err) => {
		// If the file doesn't exist or sendFile errors, continue to next handler
		if (err) return next();
	});
});

app.listen(PORT, () => {
	/* eslint-disable no-console */
	console.log(`Server running on port ${PORT}`);
	console.log('Available endpoints: GET /health, GET /api/hello, POST /api/echo');
});

// Connect to MongoDB (if provided)
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
	mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => console.log('Connected to MongoDB'))
		.catch((err) => console.error('MongoDB connection error:', err.message));
} else {
	console.log('MONGO_URI not provided; skipping MongoDB connection. Set MONGO_URI in .env to enable.');
}

