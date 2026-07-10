// ============================================
// routes/product-details.js - Product Details Routes
// jayenwareinc/api/routes/product-details.js
// ============================================

const express = require('express');
const router = express.Router();
const { createSlug } = require('../helpers');

// ============================================
// HELPER: Find product by slug
// ============================================
async function findProductBySlug(supabase, slug) {
    const { data: products } = await supabase
        .from('products')
        .select('*');
    
    return products.find(p => (p.slug || createSlug(p.title)) === slug);
}

// ============================================
// GET PRODUCT COLORS
// ============================================
// Endpoint: GET /api/product-colors?slug=product-slug
// Description: Fetch all colors for a specific product
// ============================================
router.get('/product-colors', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const product = await findProductBySlug(req.app.locals.supabase, slug);
        if (!product) return res.json([]);
        
        const { data, error } = await req.app.locals.supabase
            .from('product_colors')
            .select('*')
            .eq('product_id', product.id)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET PRODUCT VARIANTS
// ============================================
// Endpoint: GET /api/product-variants?slug=product-slug
// Description: Fetch all variants for a specific product
// ============================================
router.get('/product-variants', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const product = await findProductBySlug(req.app.locals.supabase, slug);
        if (!product) return res.json([]);
        
        const { data, error } = await req.app.locals.supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', product.id)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET PRODUCT REVIEWS
// ============================================
// Endpoint: GET /api/product-reviews?slug=product-slug
// Description: Fetch all reviews for a specific product
// ============================================
router.get('/product-reviews', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const product = await findProductBySlug(req.app.locals.supabase, slug);
        if (!product) return res.json([]);
        
        const { data, error } = await req.app.locals.supabase
            .from('product_reviews')
            .select('*')
            .eq('product_id', product.id)
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// SUBMIT PRODUCT REVIEW
// ============================================
// Endpoint: POST /api/submit-review
// Description: Submit a new review for a product
// Body: { product_id, user_name, rating, review_text }
// ============================================
router.post('/submit-review', async (req, res) => {
    try {
        const { product_id, user_name, rating, review_text } = req.body;
        
        // Validate required fields
        if (!product_id || !rating || !review_text) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['product_id', 'rating', 'review_text']
            });
        }
        
        // Validate rating range
        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        const { data, error } = await req.app.locals.supabase
            .from('product_reviews')
            .insert([{
                product_id,
                user_name: user_name || 'Guest User',
                rating: ratingNum,
                review_text
            }])
            .select()
            .single();
        
        if (error) return res.status(500).json({ error: error.message });
        
        res.status(201).json({ 
            success: true, 
            message: 'Review submitted successfully',
            review: data 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET PRODUCT VIDEOS
// ============================================
// Endpoint: GET /api/product-videos?slug=product-slug
// Description: Fetch all active videos for a specific product
// ============================================
router.get('/product-videos', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const product = await findProductBySlug(req.app.locals.supabase, slug);
        if (!product) return res.json([]);
        
        const { data, error } = await req.app.locals.supabase
            .from('product_videos')
            .select('*')
            .eq('product_id', product.id)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET PRODUCT BANNERS
// ============================================
// Endpoint: GET /api/product-banners?slug=product-slug
// Description: Fetch all active banners for a specific product
// ============================================
router.get('/product-banners', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const product = await findProductBySlug(req.app.locals.supabase, slug);
        if (!product) return res.json([]);
        
        const { data, error } = await req.app.locals.supabase
            .from('product_banners')
            .select('*')
            .eq('product_id', product.id)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET COLOR SIZES
// ============================================
// Endpoint: GET /api/color-sizes?ids=1,2,3
// Description: Fetch sizes for specific color IDs
// ============================================
router.get('/color-sizes', async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids) return res.json([]);
        
        // Parse and validate color IDs
        const idArray = ids.split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));
        
        if (!idArray.length) return res.json([]);
        
        const { data, error } = await req.app.locals.supabase
            .from('color_sizes')
            .select('*')
            .in('color_id', idArray)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
