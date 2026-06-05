const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const SUPABASE_URL = "https://kfncdapeswlnwsackkdy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY5NjgsImV4cCI6MjA5NTYxMjk2OH0.w0JCxkp0GHhwBboSQXYjA3lqUKEWtgbOgq07D554wK8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(express.static(path.join(__dirname, '..', 'public')));

// ============================================
// Helper: Slug থেকে last segment বের করা
// ============================================
function getLastSlugSegment(fullSlug) {
    if (!fullSlug) return '';
    const parts = fullSlug.split('/');
    return parts[parts.length - 1];
}

// ============================================
// API Routes
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
// ক্যাটাগরি API (Slug-based - সরাসরি ডাটাবেস থেকে)
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
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ক্যাটাগরি ডিটেইলস - slug দিয়ে (ডাটাবেস slug ফিল্ড থেকে সরাসরি)
app.get('/api/categories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        console.log('Fetching category with slug:', slug);
        
        // প্রথমে exact slug match করার চেষ্টা
        let { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
        
        // যদি exact match না মেলে, তাহলে last segment দিয়ে খোঁজা
        if (!data || error) {
            console.log('Exact match failed, trying last segment...');
            
            const lastSegment = getLastSlugSegment(slug);
            console.log('Looking for last segment:', lastSegment);
            
            const { data: allData, error: allError } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true);
            
            if (allError) {
                console.error('Error fetching all categories:', allError);
                return res.status(500).json({ error: allError.message });
            }
            
            console.log('All categories count:', allData?.length || 0);
            
            data = allData?.find(cat => {
                const catLastSegment = getLastSlugSegment(cat.slug);
                console.log('Comparing:', cat.slug, '->', catLastSegment, 'with', lastSegment);
                return catLastSegment === lastSegment || cat.slug === slug;
            });
            
            if (!data) {
                console.error('Category not found for slug:', slug);
                return res.status(404).json({ error: 'Category not found', slug });
            }
        }
        
        if (error && error.code !== 'PGRST116') {
            console.error('Supabase query error:', error);
            return res.status(500).json({ error: error.message });
        }
        
        console.log('Category found:', data.name, 'ID:', data.id, 'Slug:', data.slug);
        res.json(data);
        
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ক্যাটাগরি প্রোডাক্টস - slug দিয়ে
app.get('/api/categories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        
        console.log('Fetching products for category slug:', slug);
        
        // ক্যাটাগরি খুঁজুন - সরাসরি slug দিয়ে
        let { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name, slug')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
        
        // Fallback: last segment দিয়ে খোঁজা
        if (!category || catError) {
            console.log('Exact match failed for category, trying fallback...');
            
            const lastSegment = getLastSlugSegment(slug);
            const { data: allCategories } = await supabase
                .from('categories')
                .select('id, name, slug')
                .eq('is_active', true);
            
            category = allCategories?.find(cat => {
                const catLastSegment = getLastSlugSegment(cat.slug);
                return catLastSegment === lastSegment || cat.slug === slug;
            });
            
            if (!category) {
                console.error('Category not found for slug:', slug);
                return res.status(404).json({ error: 'Category not found', slug });
            }
        }
        
        console.log('Category found:', category.name, 'ID:', category.id);
        
        // প্রোডাক্ট ফেচ করুন
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', category.id)
            .order('created_at', { ascending: false });
        
        if (prodError) {
            console.error('Products query error:', prodError);
            return res.status(500).json({ error: prodError.message });
        }
        
        console.log(`Found ${products?.length || 0} products for category:`, category.name);
        res.json(products || []);
        
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// সাব-ক্যাটাগরি API (Slug-based - সরাসরি ডাটাবেস থেকে)
// ============================================

// সব সাব-ক্যাটাগরি বা ক্যাটাগরি অনুযায়ী ফিল্টার
app.get('/api/subcategories', async (req, res) => {
    try {
        const { category_slug } = req.query;
        
        console.log('Fetching subcategories, category_slug:', category_slug);
        
        if (category_slug) {
            // প্রথমে ক্যাটাগরি খুঁজুন
            let { data: category, error: catError } = await supabase
                .from('categories')
                .select('id, name, slug')
                .eq('slug', category_slug)
                .eq('is_active', true)
                .single();
            
            // Fallback
            if (!category || catError) {
                console.log('Category exact match failed, trying fallback...');
                
                const lastSegment = getLastSlugSegment(category_slug);
                const { data: allCategories } = await supabase
                    .from('categories')
                    .select('id, name, slug')
                    .eq('is_active', true);
                
                category = allCategories?.find(cat => {
                    const catLastSegment = getLastSlugSegment(cat.slug);
                    return catLastSegment === lastSegment || cat.slug === category_slug;
                });
                
                if (!category) {
                    console.error('Category not found for slug:', category_slug);
                    return res.status(404).json({ error: 'Category not found', category_slug });
                }
            }
            
            console.log('Category found:', category.name, 'ID:', category.id);
            
            // সাব-ক্যাটাগরি ফেচ করুন
            const { data, error } = await supabase
                .from('subcategories')
                .select('*')
                .eq('category_id', category.id)
                .eq('is_active', true)
                .order('sort_order', { ascending: true });
            
            if (error) {
                console.error('Subcategories query error:', error);
                return res.status(500).json({ error: error.message });
            }
            
            console.log(`Found ${data?.length || 0} subcategories for category:`, category.name);
            return res.json(data || []);
        }
        
        // সব সাব-ক্যাটাগরি
        const { data, error } = await supabase
            .from('subcategories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) {
            console.error('All subcategories query error:', error);
            return res.status(500).json({ error: error.message });
        }
        
        console.log(`Found ${data?.length || 0} subcategories total`);
        res.json(data || []);
        
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});

// সাব-ক্যাটাগরি ডিটেইলস - slug দিয়ে
app.get('/api/subcategories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        console.log('Fetching subcategory with slug:', slug);
        
        // Exact slug match
        let { data, error } = await supabase
            .from('subcategories')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
        
        // Fallback
        if (!data || error) {
            console.log('Exact match failed for subcategory, trying fallback...');
            
            const lastSegment = getLastSlugSegment(slug);
            const { data: allData } = await supabase
                .from('subcategories')
                .select('*')
                .eq('is_active', true);
            
            data = allData?.find(sub => {
                const subLastSegment = getLastSlugSegment(sub.slug);
                return subLastSegment === lastSegment || sub.slug === slug;
            });
            
            if (!data) {
                console.error('Subcategory not found for slug:', slug);
                return res.status(404).json({ error: 'Subcategory not found', slug });
            }
        }
        
        if (error && error.code !== 'PGRST116') {
            console.error('Supabase query error:', error);
            return res.status(500).json({ error: error.message });
        }
        
        console.log('Subcategory found:', data.name, 'ID:', data.id, 'Slug:', data.slug);
        res.json(data);
        
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});

// সাব-ক্যাটাগরি প্রোডাক্টস
app.get('/api/subcategories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        
        console.log('Fetching products for subcategory slug:', slug);
        
        // সাব-ক্যাটাগরি খুঁজুন
        let { data: subcategory, error: subError } = await supabase
            .from('subcategories')
            .select('id, name, slug, category_id')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
        
        // Fallback
        if (!subcategory || subError) {
            console.log('Exact match failed for subcategory, trying fallback...');
            
            const lastSegment = getLastSlugSegment(slug);
            const { data: allSubcategories } = await supabase
                .from('subcategories')
                .select('id, name, slug, category_id')
                .eq('is_active', true);
            
            subcategory = allSubcategories?.find(sub => {
                const subLastSegment = getLastSlugSegment(sub.slug);
                return subLastSegment === lastSegment || sub.slug === slug;
            });
            
            if (!subcategory) {
                console.error('Subcategory not found for slug:', slug);
                return res.status(404).json({ error: 'Subcategory not found', slug });
            }
        }
        
        console.log('Subcategory found:', subcategory.name, 'ID:', subcategory.id);
        
        // প্রোডাক্ট ফেচ করুন
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('*')
            .eq('subcategory_id', subcategory.id)
            .order('created_at', { ascending: false });
        
        if (prodError) {
            console.error('Products query error:', prodError);
            return res.status(500).json({ error: prodError.message });
        }
        
        console.log(`Found ${products?.length || 0} products for subcategory:`, subcategory.name);
        res.json(products || []);
        
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// মেনু API
// ============================================

// Main Menu - সমস্ত মেনু আইটেম
app.get('/api/menu', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                *,
                categories:category_id (id, name, slug),
                subcategories:subcategory_id (id, name, slug)
            `)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        
        // Build menu hierarchy
        const buildMenuTree = (items, parentId = null) => {
            return items
                .filter(item => item.parent_id === parentId)
                .map(item => ({
                    ...item,
                    category_slug: item.categories?.slug || null,
                    subcategory_slug: item.subcategories?.slug || null,
                    children: buildMenuTree(items, item.id)
                }));
        };
        
        const menuTree = buildMenuTree(data);
        res.json(menuTree);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Flat menu items
app.get('/api/menu-items', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                *,
                categories:category_id (id, name, slug),
                subcategories:subcategory_id (id, name, slug)
            `)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        
        const menuItems = data.map(item => ({
            ...item,
            category_slug: item.categories?.slug || null,
            subcategory_slug: item.subcategories?.slug || null
        }));
        
        res.json(menuItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// হিরো API
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
// নিউজ API
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
// প্রোডাক্ট API
// ============================================

// প্রোডাক্ট ডিটেইলস - slug দিয়ে
app.get('/api/product/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();
        
        if (error && error.code === 'PGRST116') {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (error) return res.status(500).json({ error: error.message });
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// প্রোডাক্ট কালার
app.get('/api/product-colors', async (req, res) => {
    try {
        const { slug } = req.query;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: product } = await supabase
            .from('products')
            .select('id')
            .eq('slug', slug)
            .single();
        
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

// প্রোডাক্ট ভেরিয়েন্ট
app.get('/api/product-variants', async (req, res) => {
    try {
        const { slug } = req.query;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: product } = await supabase
            .from('products')
            .select('id')
            .eq('slug', slug)
            .single();
        
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

// প্রোডাক্ট রিভিউ
app.get('/api/product-reviews', async (req, res) => {
    try {
        const { slug } = req.query;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: product } = await supabase
            .from('products')
            .select('id')
            .eq('slug', slug)
            .single();
        
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

// প্রোডাক্ট ভিডিও
app.get('/api/product-videos', async (req, res) => {
    try {
        const { slug } = req.query;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: product } = await supabase
            .from('products')
            .select('id')
            .eq('slug', slug)
            .single();
        
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

// প্রোডাক্ট ব্যানার
app.get('/api/product-banners', async (req, res) => {
    try {
        const { slug } = req.query;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: product } = await supabase
            .from('products')
            .select('id')
            .eq('slug', slug)
            .single();
        
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

// কালার সাইজ
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
// SPA Fallback
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
