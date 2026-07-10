// ============================================
// routes/categories.js - Category & Subcategory Routes
// jayenwareinc/api/routes/categories.js
// ============================================

const express = require('express');
const router = express.Router();
const { createSlug, formatProducts, cleanSlugPrefix } = require('../helpers');

// ============================================
// GET ALL CATEGORIES
// ============================================
// Endpoint: GET /api/categories
// Description: Fetch all active categories with clean slugs
// ============================================
router.get('/categories', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        
        const categoriesWithSlugs = data.map(cat => ({
            ...cat,
            slug: cleanSlugPrefix(cat.slug) || createSlug(cat.name)
        }));
        
        res.json(categoriesWithSlugs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET CATEGORY BY SLUG
// ============================================
// Endpoint: GET /api/categories/:slug
// Description: Fetch single category by slug
// ============================================
router.get('/categories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        const { data, error } = await req.app.locals.supabase
            .from('categories')
            .select('*')
            .eq('is_active', true);
        
        if (error) return res.status(500).json({ error: error.message });
        
        const category = data.find(cat => {
            const dbSlug = cleanSlugPrefix(cat.slug) || createSlug(cat.name);
            return dbSlug === slug;
        });
        
        if (!category) return res.status(404).json({ error: 'Category not found' });
        
        res.json({
            ...category,
            slug: cleanSlugPrefix(category.slug) || createSlug(category.name)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET PRODUCTS BY CATEGORY SLUG
// ============================================
// Endpoint: GET /api/categories/:slug/products
// Description: Fetch all products under a specific category
// ============================================
router.get('/categories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        
        // First find the category
        const { data: categories } = await req.app.locals.supabase
            .from('categories')
            .select('*')
            .eq('is_active', true);
        
        const category = categories.find(cat => {
            const dbSlug = cleanSlugPrefix(cat.slug) || createSlug(cat.name);
            return dbSlug === slug;
        });
        
        if (!category) return res.status(404).json({ error: 'Category not found' });
        
        // Then fetch products for this category
        const { data, error } = await req.app.locals.supabase
            .from('products')
            .select(`
                *,
                categories:category_id (name),
                subcategories:subcategory_id (name)
            `)
            .eq('category_id', category.id)
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        
        res.json(formatProducts(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET ALL SUBCATEGORIES
// ============================================
// Endpoint: GET /api/subcategories
// Query: ?category_slug=optional
// Description: Fetch all subcategories, optionally filtered by category slug
// ============================================
router.get('/subcategories', async (req, res) => {
    try {
        const { category_slug } = req.query;
        
        let query = req.app.locals.supabase
            .from('subcategories')
            .select('*, categories!inner(name, id, slug)')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (category_slug) {
            // Find category first
            const { data: categories } = await req.app.locals.supabase
                .from('categories')
                .select('id, slug')
                .eq('is_active', true);
            
            const category = categories.find(cat => {
                const dbSlug = cleanSlugPrefix(cat.slug) || createSlug(cat.name);
                return dbSlug === category_slug;
            });
            
            if (category) {
                query = query.eq('category_id', category.id);
            } else {
                return res.status(404).json({ error: 'Category not found' });
            }
        }
        
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        
        const subcategoriesWithSlugs = data.map(sub => ({
            ...sub,
            slug: sub.slug ? cleanSlugPrefix(sub.slug, 'category/[^/]+/') : createSlug(sub.name),
            category_slug: sub.categories ? createSlug(sub.categories.name) : ''
        }));
        
        res.json(subcategoriesWithSlugs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET SUBCATEGORY BY SLUG
// ============================================
// Endpoint: GET /api/subcategories/:slug
// Query: ?category_slug=optional
// Description: Fetch single subcategory by slug
// ============================================
router.get('/subcategories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { category_slug } = req.query;
        
        const { data, error } = await req.app.locals.supabase
            .from('subcategories')
            .select('*, categories(name, id, slug)')
            .eq('is_active', true);
        
        if (error) return res.status(500).json({ error: error.message });
        
        let subcategory = data.find(sub => {
            const dbSlug = sub.slug ? cleanSlugPrefix(sub.slug, 'category/[^/]+/') : createSlug(sub.name);
            return dbSlug === slug;
        });
        
        // If category_slug provided, verify the subcategory belongs to that category
        if (category_slug && subcategory) {
            const catSlug = subcategory.categories?.slug || createSlug(subcategory.categories?.name || '');
            const cleanCatSlug = cleanSlugPrefix(catSlug);
            if (cleanCatSlug !== category_slug) {
                subcategory = null;
            }
        }
        
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        
        res.json({
            ...subcategory,
            slug: subcategory.slug ? cleanSlugPrefix(subcategory.slug, 'category/[^/]+/') : createSlug(subcategory.name),
            category_slug: subcategory.categories ? createSlug(subcategory.categories.name) : ''
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET PRODUCTS BY SUBCATEGORY SLUG
// ============================================
// Endpoint: GET /api/subcategories/:slug/products
// Description: Fetch all products under a specific subcategory
// ============================================
router.get('/subcategories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Find the subcategory first
        const { data: subcategories } = await req.app.locals.supabase
            .from('subcategories')
            .select('*')
            .eq('is_active', true);
        
        const subcategory = subcategories.find(sub => {
            const dbSlug = sub.slug ? cleanSlugPrefix(sub.slug, 'category/[^/]+/') : createSlug(sub.name);
            return dbSlug === slug;
        });
        
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        
        // Fetch products for this subcategory
        const { data, error } = await req.app.locals.supabase
            .from('products')
            .select(`
                *,
                categories:category_id (name),
                subcategories:subcategory_id (name)
            `)
            .eq('subcategory_id', subcategory.id)
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        
        res.json(formatProducts(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
