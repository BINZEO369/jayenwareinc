// ============================================
// index.js - Main Application Entry Point
// jayenwareinc/api/index.js
// ============================================

const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Import route modules
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const productDetailsRouter = require('./routes/product-details');
const menuRouter = require('./routes/menu');
const heroRouter = require('./routes/hero');
const contentRouter = require('./routes/content');
const pagesRouter = require('./routes/pages');
const footerRouter = require('./routes/footer');
const ordersRouter = require('./routes/orders');

const app = express();

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = "https://kfncdapeswlnwsackkdy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY5NjgsImV4cCI6MjA5NTYxMjk2OH0.w0JCxkp0GHhwBboSQXYjA3lqUKEWtgbOgq07D554wK8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ============================================
// MAKE SUPABASE AVAILABLE TO ROUTES
// ============================================
app.locals.supabase = supabase;

// ============================================
// API ROUTES
// ============================================

// Products
app.use('/api', productsRouter);

// Categories & Subcategories
app.use('/api', categoriesRouter);

// Product Details (Colors, Variants, Reviews, Videos, Banners)
app.use('/api', productDetailsRouter);

// Menu
app.use('/api', menuRouter);

// Hero Sections
app.use('/api', heroRouter);

// Content (News, Stories, Announcements, About Us)
app.use('/api', contentRouter);

// Pages (FAQ, Blog, Policies, Store Locator)
app.use('/api', pagesRouter);

// Footer
app.use('/api', footerRouter);

// Orders
app.use('/api', ordersRouter);

// ============================================
// PAGE ROUTES
// ============================================

// Category page (with subcategory support)
app.get('/category/:slug*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'category.html'));
});

// ============================================
// SPA FALLBACK (Must be last)
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

module.exports = app;
