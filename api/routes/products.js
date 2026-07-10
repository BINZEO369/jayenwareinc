// ============================================
// routes/products.js - Product Routes
// jayenwareinc/api/routes/products.js
// ============================================

const express = require('express');
const router = express.Router();
const { createSlug, formatProduct, formatProducts } = require('../helpers');

// ============================================
// GET ALL PRODUCTS
// ============================================
// Endpoint: GET /api/products
// Description: Fetch all products with category and subcategory names
// ============================================
router.get('/products', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('products')
            .select(`
                *,
                categories:category_id (name),
                subcategories:subcategory_id (name)
            `)
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        
        res.json(formatProducts(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET PRODUCT BY SLUG
// ============================================
// Endpoint: GET /api/product/:slug
// Description: Fetch single product by slug with category and subcategory names
// ============================================
router.get('/product/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        
        const { data, error } = await req.app.locals.supabase
            .from('products')
            .select(`
                *,
                categories:category_id (name),
                subcategories:subcategory_id (name)
            `)
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        
        // Find product by matching slug
        const product = data.find(p => (p.slug || createSlug(p.title)) === slug);
        
        if (!product) return res.status(404).json({ error: 'Product not found' });
        
        res.json(formatProduct(product));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
