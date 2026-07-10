// api/index.js
const express = require('express');
const path = require('path');
const { setupMiddleware } = require('./_lib/middleware');

const app = express();
setupMiddleware(app);

// Import route modules
const heroRoutes = require('./hero');
const announcementRoutes = require('./announcement');
const newsRoutes = require('./news');

// Mount routes
app.use(heroRoutes);
app.use(announcementRoutes);
app.use(newsRoutes);

// SPA Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
