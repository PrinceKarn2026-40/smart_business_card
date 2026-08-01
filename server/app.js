require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Security & parsing middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Trust proxy (needed for correct IP on Render)
app.set('trust proxy', 1);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'client')));

// API routes
app.use('/api', require('./routes'));

// Public card API
app.use('/api/card', require('./routes/cardRoutes'));

// Public card page — serve the card HTML shell
app.get('/card/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'pages', 'card.html'));
});

// Catch-all: serve client for any non-API route
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
