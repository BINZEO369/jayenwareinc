// ============================================
// server.js - Complete API Server
// Supabase Integrated | Production Ready
// With Auth, Countries, Products & UI APIs
// ============================================

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// ============================================
// SUPABASE CONFIGURATION
// ============================================
const SUPABASE_URL = "https://qaxaaqanmvqkjxpgirdp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheGFhcWFubXZxa2p4cGdpcmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDYyMzQsImV4cCI6MjA5ODI4MjIzNH0.fJ2g4g2dJq9pH8J5Yb39nkFLtYfZFcC4LHjBRvSPDoI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// MIDDLEWARE
// ============================================

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for frontend assets
}));

// Enable CORS for frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // আপনার ফ্রন্টএন্ড URL দিন
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // limit auth attempts
    message: { error: 'Too many auth attempts, please try again later.' }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// Optional auth middleware (doesn't require auth but attaches user if token present)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user } } = await supabase.auth.getUser(token);
            if (user) req.user = user;
        }
    } catch (err) {
        // Silently fail - user will just be unauthenticated
    }
    next();
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Create slug from string
function createSlug(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Format product with category/subcategory names
function formatProduct(product) {
    if (!product) return null;
    
    // Remove circular references and format
    const { categories, subcategories, ...productData } = product;
    
    return {
        ...productData,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
        category: categories?.name || null,
        subcategory: subcategories?.name || null
    };
}

function formatProducts(products) {
    if (!products) return [];
    return products.map(formatProduct);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// AUTH APIS
// ============================================

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, first_name, last_name, country_id } = req.body;

        // Validation
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['email', 'password', 'first_name', 'last_name']
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name,
                    last_name
                }
            }
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        // Update country_id if provided
        if (country_id && authData.user) {
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({ country_id })
                .eq('id', authData.user.id);

            if (updateError) {
                console.error('Country update error:', updateError);
            }
        }

        res.status(201).json({
            success: true,
            message: 'User created successfully. Please check your email for verification.',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                first_name,
                last_name,
                country_id: country_id || null
            }
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sign In
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        // Get user profile
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('*, countries(name, code)')
            .eq('id', data.user.id)
            .single();

        res.json({
            success: true,
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at
            },
            user: {
                id: data.user.id,
                email: data.user.email,
                first_name: profile?.first_name,
                last_name: profile?.last_name,
                country: profile?.countries || null
            }
        });

    } catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Sign Out
app.post('/api/auth/signout', authenticateUser, async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) return res.status(500).json({ error: error.message });
        
        res.json({ success: true, message: 'Signed out successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get current user
app.get('/api/auth/me', authenticateUser, async (req, res) => {
    try {
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*, countries(name, code)')
            .eq('id', req.user.id)
            .single();

        if (error) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            user: {
                id: req.user.id,
                email: req.user.email,
                first_name: profile.first_name,
                last_name: profile.last_name,
                country: profile.countries || null,
                created_at: profile.created_at
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user profile
app.patch('/api/auth/profile', authenticateUser, async (req, res) => {
    try {
        const { first_name, last_name, country_id } = req.body;
        
        const updates = {};
        if (first_name) updates.first_name = first_name;
        if (last_name) updates.last_name = last_name;
        if (country_id) updates.country_id = country_id;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', req.user.id)
            .select('*, countries(name, code)')
            .single();

        if (error) return res.status(500).json({ error: error.message });

        res.json({
            success: true,
            user: {
                id: req.user.id,
                email: req.user.email,
                ...data
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// COUNTRIES API
// ============================================

// Get all countries (public)
app.get('/api/countries', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .order('name', { ascending: true });

        if (error) return res.status(500).json({ error: error.message });

        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single country
app.get('/api/countries/:id', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('countries')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) return res.status(404).json({ error: 'Country not found' });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// PRODUCTS API (Categories, Subcategories with Slug)
// ============================================

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const { category, subcategory, search, page = 1, limit = 20 } = req.query;
        
        let query = supabase
            .from('products')
            .select(`
                *,
                categories:category_id (name),
                subcategories:subcategory_id (name)
            `, { count: 'exact' });

        // Apply filters
        if (category) {
            const { data: catData } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', `category/${category}`)
                .single();
            
            if (catData) query = query.eq('category_id', catData.id);
        }

        if (subcategory) {
            const { data: subData } = await supabase
                .from('subcategories')
                .select('id')
                .eq('slug', `category/${category}/${subcategory}`)
                .single();
            
            if (subData) query = query.eq('subcategory_id', subData.id);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        
        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) return res.status(500).json({ error: error.message });

        res.json({
            products: formatProducts(data),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product by slug
app.get('/api/product/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                categories:category_id (name),
                subcategories:subcategory_id (name)
            `)
            .order('created_at', { ascending: false });

        if (error) return res.status(500).json({ error: error.message });

        const product = data.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.json(formatProduct(product));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all categories (with slugs)
app.get('/api/categories', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) return res.status(500).json({ error: error.message });

        const categoriesWithSlugs = data.map(cat => ({
            ...cat,
            slug: cat.slug ? cat.slug.replace(/^category\//, '') : createSlug(cat.name)
        }));

        res.json(categoriesWithSlugs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get category by slug
app.get('/api/categories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true);

        if (error) return res.status(500).json({ error: error.message });

        const category = data.find(cat => {
            const dbSlug = cat.slug || createSlug(cat.name);
            return dbSlug.replace(/^category\//, '') === slug;
        });

        if (!category) return res.status(404).json({ error: 'Category not found' });

        res.json({
            ...category,
            slug: category.slug ? category.slug.replace(/^category\//, '') : createSlug(category.name)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get products by category slug
app.get('/api/categories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const { data: categories } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true);

        const category = categories.find(cat => {
            const dbSlug = cat.slug || createSlug(cat.name);
            return dbSlug.replace(/^category\//, '') === slug;
        });

        if (!category) return res.status(404).json({ error: 'Category not found' });

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('products')
            .select(`
                *,
                categories:category_id (name),
                subcategories:subcategory_id (name)
            `, { count: 'exact' })
            .eq('category_id', category.id)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) return res.status(500).json({ error: error.message });

        res.json({
            products: formatProducts(data),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all subcategories
app.get('/api/subcategories', async (req, res) => {
    try {
        const { category_slug } = req.query;

        let query = supabase
            .from('subcategories')
            .select('*, categories(name, id, slug)')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (category_slug) {
            const { data: categories } = await supabase
                .from('categories')
                .select('id, slug')
                .eq('is_active', true);

            const category = categories.find(cat => {
                const dbSlug = cat.slug || createSlug(cat.name);
                return dbSlug.replace(/^category\//, '') === category_slug;
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
            slug: sub.slug ? sub.slug.replace(/^category\/[^/]+\//, '') : createSlug(sub.name),
            category_slug: sub.categories ? createSlug(sub.categories.name) : ''
        }));

        res.json(subcategoriesWithSlugs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get subcategory by slug
app.get('/api/subcategories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { category_slug } = req.query;

        const { data, error } = await supabase
            .from('subcategories')
            .select('*, categories(name, id, slug)')
            .eq('is_active', true);

        if (error) return res.status(500).json({ error: error.message });

        let subcategory = data.find(sub => {
            const dbSlug = sub.slug || createSlug(sub.name);
            return dbSlug.replace(/^category\/[^/]+\//, '') === slug;
        });

        if (category_slug && subcategory) {
            const catSlug = subcategory.categories?.slug || createSlug(subcategory.categories?.name || '');
            const cleanCatSlug = catSlug.replace(/^category\//, '');
            if (cleanCatSlug !== category_slug) {
                subcategory = null;
            }
        }

        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });

        res.json({
            ...subcategory,
            slug: subcategory.slug ? subcategory.slug.replace(/^category\/[^/]+\//, '') : createSlug(subcategory.name),
            category_slug: subcategory.categories ? createSlug(subcategory.categories.name) : ''
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get products by subcategory slug
app.get('/api/subcategories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const { data: subcategories } = await supabase
            .from('subcategories')
            .select('*')
            .eq('is_active', true);

        const subcategory = subcategories.find(sub => {
            const dbSlug = sub.slug || createSlug(sub.name);
            return dbSlug.replace(/^category\/[^/]+\//, '') === slug;
        });

        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('products')
            .select(`
                *,
                categories:category_id (name),
                subcategories:subcategory_id (name)
            `, { count: 'exact' })
            .eq('subcategory_id', subcategory.id)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) return res.status(500).json({ error: error.message });

        res.json({
            products: formatProducts(data),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// MENU API
// ============================================

// Get menu hierarchy
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

        const buildMenuTree = (items, parentId = null) => {
            return items
                .filter(item => item.parent_id === parentId)
                .map(item => ({
                    ...item,
                    slug: createSlug(item.title),
                    category_slug: item.categories ? createSlug(item.categories.name) : null,
                    subcategory_slug: item.subcategories ? createSlug(item.subcategories.name) : null,
                    children: buildMenuTree(items, item.id)
                }));
        };

        res.json(buildMenuTree(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get flat menu items
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

// Get menu item by slug
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
// HERO SLIDES & VIDEOS API
// ============================================

// Get hero slides
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

// Get hero videos
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

// Get hero secondary items
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
// NEWS API
// ============================================
app.get('/api/news', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await supabase
            .from('news')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) return res.status(500).json({ error: error.message });

        res.json({
            news: data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// PRODUCT DETAILS API (Colors, Variants, Reviews, Videos, Banners)
// ============================================

// Get product colors
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

// Get product variants
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

// Get product reviews
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

// Submit product review (guest allowed or authenticated)
app.post('/api/submit-review', optionalAuth, async (req, res) => {
    try {
        const { product_id, user_name, rating, review_text } = req.body;

        if (!product_id || !rating || !review_text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const reviewData = {
            product_id,
            user_name: user_name || req.user?.user_metadata?.first_name || 'Guest User',
            rating: parseInt(rating),
            review_text,
            user_id: req.user?.id || null
        };

        const { data, error } = await supabase
            .from('product_reviews')
            .insert([reviewData])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json({ success: true, data: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product videos
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

// Get product banners
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

// Get color sizes
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
// SEARCH API
// ============================================
app.get('/api/search', async (req, res) => {
    try {
        const { q, type = 'all' } = req.query;
        
        if (!q || q.length < 2) {
            return res.json({ products: [], categories: [] });
        }

        const searchTerm = `%${q}%`;
        const results = {};

        // Search products
        if (type === 'all' || type === 'products') {
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
                .limit(10);
            
            results.products = products || [];
        }

        // Search categories
        if (type === 'all' || type === 'categories') {
            const { data: categories } = await supabase
                .from('categories')
                .select('*')
                .ilike('name', searchTerm)
                .eq('is_active', true)
                .limit(5);
            
            results.categories = categories || [];
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
    try {
        const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: error ? 'error' : 'connected',
            uptime: process.uptime()
        });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
});

// ============================================
// PAGE ROUTES
// ============================================

// Auth pages
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

// Category page (with subcategory support)
app.get('/category/:slug*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'category.html'));
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    next();
});

// ============================================
// SPA FALLBACK (Must be last)
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${PORT}`);
        console.log(`📦 API Base URL: http://localhost:${PORT}/api`);
        console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
        console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}\n`);
    });
}

module.exports = app;
