const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const SUPABASE_URL = "https://kfncdapeswlnwsackkdy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY5NjgsImV4cCI6MjA5NTYxMjk2OH0.w0JCxkp0GHhwBboSQXYjA3lqUKEWtgbOgq07D554wK8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(express.static(path.join(__dirname, '..', 'public')));

// ============================================
// API Routes - সব ডাটা OUR SERVER হয়ে যাবে
// ============================================

// সব প্রোডাক্ট
app.get('/api/products', async (req, res) => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// ক্যাটাগরি
app.get('/api/categories', async (req, res) => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// হিরো স্লাইড
app.get('/api/hero', async (req, res) => {
    const { data, error } = await supabase.from('hero').select('*').order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// হিরো ভিডিও - শুধু active ভিডিওগুলো
app.get('/api/hero-videos', async (req, res) => {
    const { data, error } = await supabase
        .from('hero_videos')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// নিউজ
app.get('/api/news', async (req, res) => {
    const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// প্রোডাক্ট ডিটেইলস - slug দিয়ে
app.get('/api/product/:slug', async (req, res) => {
    const slug = req.params.slug;
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    const product = data.find(p => (p.slug || p.title.toLowerCase().replace(/[^\w]+/g, '-')) === slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

// প্রোডাক্ট কালার - slug দিয়ে
app.get('/api/product-colors', async (req, res) => {
    const slug = req.query.slug;
    if (!slug) return res.status(400).json({ error: 'Slug required' });
    
    const { data: products } = await supabase.from('products').select('*');
    const product = products.find(p => (p.slug || p.title.toLowerCase().replace(/[^\w]+/g, '-')) === slug);
    if (!product) return res.json([]);
    
    const { data, error } = await supabase.from('product_colors').select('*').eq('product_id', product.id).order('sort_order', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// প্রোডাক্ট ভেরিয়েন্ট - slug দিয়ে
app.get('/api/product-variants', async (req, res) => {
    const slug = req.query.slug;
    if (!slug) return res.status(400).json({ error: 'Slug required' });
    
    const { data: products } = await supabase.from('products').select('*');
    const product = products.find(p => (p.slug || p.title.toLowerCase().replace(/[^\w]+/g, '-')) === slug);
    if (!product) return res.json([]);
    
    const { data, error } = await supabase.from('product_variants').select('*').eq('product_id', product.id).order('sort_order', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// প্রোডাক্ট রিভিউ - slug দিয়ে
app.get('/api/product-reviews', async (req, res) => {
    const slug = req.query.slug;
    if (!slug) return res.status(400).json({ error: 'Slug required' });
    
    const { data: products } = await supabase.from('products').select('*');
    const product = products.find(p => (p.slug || p.title.toLowerCase().replace(/[^\w]+/g, '-')) === slug);
    if (!product) return res.json([]);
    
    const { data, error } = await supabase.from('product_reviews').select('*').eq('product_id', product.id).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// প্রোডাক্ট ভিডিও - slug দিয়ে
app.get('/api/product-videos', async (req, res) => {
    const slug = req.query.slug;
    if (!slug) return res.status(400).json({ error: 'Slug required' });
    
    const { data: products } = await supabase.from('products').select('*');
    const product = products.find(p => (p.slug || p.title.toLowerCase().replace(/[^\w]+/g, '-')) === slug);
    if (!product) return res.json([]);
    
    const { data, error } = await supabase.from('product_videos').select('*').eq('product_id', product.id).eq('is_active', true).order('sort_order', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// প্রোডাক্ট ব্যানার - slug দিয়ে
app.get('/api/product-banners', async (req, res) => {
    const slug = req.query.slug;
    if (!slug) return res.status(400).json({ error: 'Slug required' });
    
    const { data: products } = await supabase.from('products').select('*');
    const product = products.find(p => (p.slug || p.title.toLowerCase().replace(/[^\w]+/g, '-')) === slug);
    if (!product) return res.json([]);
    
    const { data, error } = await supabase.from('product_banners').select('*').eq('product_id', product.id).eq('is_active', true).order('sort_order', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// কালার সাইজ - color ids দিয়ে
app.get('/api/color-sizes', async (req, res) => {
    const ids = req.query.ids;
    if (!ids) return res.json([]);
    
    const idArray = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    if (!idArray.length) return res.json([]);
    
    const { data, error } = await supabase.from('color_sizes').select('*').in('color_id', idArray).order('sort_order', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
});

// রিভিউ সাবমিট
app.post('/api/submit-review', express.json(), async (req, res) => {
    const { product_id, user_name, rating, review_text } = req.body;
    if (!product_id || !rating || !review_text) return res.status(400).json({ error: 'Missing fields' });
    
    const { data, error } = await supabase.from('product_reviews').insert([{
        product_id,
        user_name: user_name || 'Guest User',
        rating: parseInt(rating),
        review_text
    }]);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

// SPA Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
