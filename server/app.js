require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.set('trust proxy', 1);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '..', 'client')));

// API routes
app.use('/api', require('./routes'));
app.use('/api/card', require('./routes/cardRoutes'));

// Public card page - v2
app.get('/card/:slug', (req, res, next) => {
  const cardPath = path.join(__dirname, '..', 'client', 'pages', 'card.html');
  res.sendFile(cardPath, (err) => {
    if (err) next(err);
  });
});

// Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.use(errorHandler);

module.exports = app;
