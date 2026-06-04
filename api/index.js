const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const SUPABASE_URL = "https://kfncdapeswlnwsackkdy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY5NjgsImV4cCI6MjA5NTYxMjk2OH0.w0JCxkp0GHhwBboSQXYjA3lqUKEWtgbOgq07D554wK8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(express.static(path.join(__dirname, '..', 'public')));

// ============================================
// Helper: Create slug from string
// ============================================
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')   // Remove special characters
        .replace(/\s+/g, '-')       // Replace spaces with hyphens
        .replace(/-+/g, '-')        // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
}

// ============================================
// API Routes - সব ডাটা OUR SERVER হয়ে যাবে
// ============================================

// সব প্রোডাক্ট
app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// ক্যাটাগরি API (Slug-based)
// ============================================

// সব ক্যাটাগরি - Public
app.get('/api/categories', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        
        // Add slugs to categories
        const categoriesWithSlugs = data.map(cat => ({
            ...cat,
            slug: createSlug(cat.name)
        }));
        
        res.json(categoriesWithSlugs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ক্যাটাগরি ডিটেইলস - slug দিয়ে
app.get('/api/categories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true);
        if (error) return res.status(500).json({ error: error.message });
        
        const category = data.find(cat => createSlug(cat.name) === slug);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        
        res.json({
            ...category,
            slug: createSlug(category.name)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// সাব-ক্যাটাগরি API (Slug-based)
// ============================================

// সব সাব-ক্যাটাগরি - Public (Optional: filter by category)
app.get('/api/subcategories', async (req, res) => {
    try {
        const { category_slug } = req.query;
        
        let query = supabase
            .from('subcategories')
            .select('*, categories(name, id)')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (category_slug) {
            // Get category ID from slug
            const { data: categories } = await supabase
                .from('categories')
                .select('id')
                .eq('is_active', true);
            
            const category = categories.find(cat => createSlug(cat.name) === category_slug);
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
            slug: createSlug(sub.name),
            category_slug: createSlug(sub.categories?.name || '')
        }));
        
        res.json(subcategoriesWithSlugs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// সাব-ক্যাটাগরি ডিটেইলস - slug দিয়ে
app.get('/api/subcategories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { category_slug } = req.query;
        
        const { data, error } = await supabase
            .from('subcategories')
            .select('*, categories(name, id)')
            .eq('is_active', true);
        if (error) return res.status(500).json({ error: error.message });
        
        let subcategory = data.find(sub => createSlug(sub.name) === slug);
        
        // If category_slug is provided, filter by it too
        if (category_slug && subcategory) {
            const catSlug = createSlug(subcategory.categories?.name || '');
            if (catSlug !== category_slug) {
                subcategory = null;
            }
        }
        
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        
        res.json({
            ...subcategory,
            slug: createSlug(subcategory.name),
            category_slug: createSlug(subcategory.categories?.name || '')
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// মেনু আইটেমস API (Complete Menu Structure)
// ============================================

// Main Menu - সমস্ত মেনু আইটেম হায়ারার্কি সহ
app.get('/api/menu', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                *,
                categories:category_id (id, name),
                subcategories:subcategory_id (id, name)
            `)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        
        // Build menu hierarchy and add slugs
        const buildMenuTree = (items, parentId = null) => {
            return items
                .filter(item => item.parent_id === parentId)
                .map(item => {
                    const menuItem = {
                        ...item,
                        slug: createSlug(item.title),
                        category_slug: item.categories ? createSlug(item.categories.name) : null,
                        subcategory_slug: item.subcategories ? createSlug(item.subcategories.name) : null,
                        children: buildMenuTree(items, item.id)
                    };
                    return menuItem;
                });
        };
        
        const menuTree = buildMenuTree(data);
        res.json(menuTree);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Flat menu items (simplified)
app.get('/api/menu-items', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                *,
                categories:category_id (id, name),
                subcategories:subcategory_id (id, name)
            `)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        
        const menuItemsWithSlugs = data.map(item => ({
            ...item,
            slug: createSlug(item.title),
            category_slug: item.categories ? createSlug(item.categories.name) : null,
            subcategory_slug: item.subcategories ? createSlug(item.subcategories.name) : null
        }));
        
        res.json(menuItemsWithSlugs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Menu item by slug
app.get('/api/menu-items/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                *,
                categories:category_id (id, name),
                subcategories:subcategory_id (id, name)
            `)
            .eq('is_active', true);
        if (error) return res.status(500).json({ error: error.message });
        
        const menuItem = data.find(item => createSlug(item.title) === slug);
        if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
        
        res.json({
            ...menuItem,
            slug: createSlug(menuItem.title),
            category_slug: menuItem.categories ? createSlug(menuItem.categories.name) : null,
            subcategory_slug: menuItem.subcategories ? createSlug(menuItem.subcategories.name) : null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// Category Product API (Get products by category)
// ============================================
app.get('/api/categories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Get category
        const { data: categories } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true);
        
        const category = categories.find(cat => createSlug(cat.name) === slug);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        
        // Get products for this category
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', category.id)
            .order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// Subcategory Products API
// ============================================
app.get('/api/subcategories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        
        // Get subcategory
        const { data: subcategories } = await supabase
            .from('subcategories')
            .select('*')
            .eq('is_active', true);
        
        const subcategory = subcategories.find(sub => createSlug(sub.name) === slug);
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        
        // Get products for this subcategory
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('subcategory_id', subcategory.id)
            .order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// হিরো স্লাইড
// ============================================
app.get('/api/hero', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('hero')
            .select('*')
            .order('created_at', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// হিরো ভিডিও - শুধু active ভিডিওগুলো
app.get('/api/hero-videos', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('hero_videos')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// হিরো সেকেন্ডারি - শুধু active সেকেন্ডারি ব্যানারগুলো
app.get('/api/hero-secondary', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('hero_secondary')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// নিউজ
// ============================================
app.get('/api/news', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// প্রোডাক্ট ডিটেইলস - slug দিয়ে
// ============================================
app.get('/api/product/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        
        const product = data.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// প্রোডাক্ট কালার - slug দিয়ে
app.get('/api/product-colors', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase
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

// প্রোডাক্ট ভেরিয়েন্ট - slug দিয়ে
app.get('/api/product-variants', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase
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

// প্রোডাক্ট রিভিউ - slug দিয়ে
app.get('/api/product-reviews', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase
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

// প্রোডাক্ট ভিডিও - slug দিয়ে
app.get('/api/product-videos', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase
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

// প্রোডাক্ট ব্যানার - slug দিয়ে
app.get('/api/product-banners', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase
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

// কালার সাইজ - color ids দিয়ে
app.get('/api/color-sizes', async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids) return res.json([]);
        
        const idArray = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        if (!idArray.length) return res.json([]);
        
        const { data, error } = await supabase
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

// ============================================
// রিভিউ সাবমিট
// ============================================
app.post('/api/submit-review', express.json(), async (req, res) => {
    try {
        const { product_id, user_name, rating, review_text } = req.body;
        if (!product_id || !rating || !review_text) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        
        const { data, error } = await supabase
            .from('product_reviews')
            .insert([{
                product_id,
                user_name: user_name || 'Guest User',
                rating: parseInt(rating),
                review_text
            }]);
        
        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// SPA Fallback - সব রাউট index.html এ ফরোয়ার্ড
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
