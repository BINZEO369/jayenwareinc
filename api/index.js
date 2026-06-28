// ============================================
// server.js - Complete API Server
// JBYN-OneID Global Profile System
// Supabase Integrated | Production Ready
// All Endpoints Working | SQL Schema Compatible
// ============================================

const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

// Build full address from components
function buildFullAddress(data) {
    const parts = [
        data.apartment_house,
        data.street_address,
        data.city,
        data.state_province,
        data.postal_code,
        data.country || 'Bangladesh'
    ].filter(Boolean);
    
    return parts.join(', ') || 'Address not provided';
}

// Format product with category/subcategory names
function formatProduct(product) {
    if (!product) return null;
    return {
        ...product,
        category: product.categories?.name || null,
        subcategory: product.subcategories?.name || null
    };
}

function formatProducts(products) {
    if (!products) return [];
    return products.map(formatProduct);
}

// Format phone number to international format (E.164)
function formatPhoneNumber(phone) {
    if (!phone || phone === 'N/A') return phone;
    
    let cleaned = phone.replace(/[^\d]/g, '');
    
    if (cleaned.startsWith('01') && cleaned.length === 11) {
        return '+880' + cleaned.substring(1);
    }
    
    if (cleaned.startsWith('8801') && cleaned.length === 13) {
        return '+' + cleaned;
    }
    
    if (phone.startsWith('+')) {
        return phone;
    }
    
    return phone;
}

// Validate E.164 phone format
function isValidPhone(phone) {
    return phone === 'N/A' || /^\+[1-9]\d{6,14}$/.test(phone);
}

// Validate JBYN-OneID format
function isValidOneID(oneid) {
    return /^JBYN-OneID-[A-Z0-9]{12}$/.test(oneid);
}

// ============================================
// AUTHENTICATION API ROUTES (NO CUSTOM TABLE / AUTH METADATA BASED)
// ============================================

// SIGNUP - Saving everything natively into Supabase Auth Metadata
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { 
            email, 
            password, 
            first_name, 
            last_name,
            phone,
            country,
            city,
            postal_code,
            address_line_1,
            address_line_2
        } = req.body;

        // Validations
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        if (!first_name || !last_name) {
            return res.status(400).json({ error: 'First name and Last name are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const formattedPhone = formatPhoneNumber(phone);
        if (phone && !isValidPhone(formattedPhone)) {
            return res.status(400).json({ error: 'Invalid phone format (e.g., +8801XXXXXXXXX)' });
        }

        const fullAddress = buildFullAddress({
            apartment_house: address_line_2 || '',
            street_address: address_line_1 || '',
            city: city || '',
            state_province: '',
            postal_code: postal_code || '',
            country: country || 'Bangladesh'
        });

        // Register directly into Supabase Auth and inject data into raw_user_meta_data
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: first_name.trim(),
                    last_name: last_name.trim(),
                    full_name: `${first_name.trim()} ${last_name.trim()}`,
                    mobile_phone: formattedPhone || 'N/A',
                    country: country || 'Bangladesh',
                    city_suburb: city || null,
                    zip_postcode: postal_code || null,
                    address_line_1: address_line_1 || null,
                    address_line_2: address_line_2 || null,
                    full_address: fullAddress
                }
            }
        });

        if (error) {
            if (error.message.includes('already registered')) {
                return res.status(400).json({ error: 'This email is already registered. Please login instead.' });
            }
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({
            message: 'Registration successful! Metadata saved in auth section. Please check email to verify.',
            user: data.user,
            session: data.session
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            if (error.message.includes('Email not confirmed')) {
                return res.status(401).json({ error: 'Please verify your email before logging in' });
            }
            return res.status(401).json({ error: error.message });
        }

        res.json({
            message: 'Login successful!',
            user: data.user,
            session: data.session
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// LOGOUT
app.post('/api/auth/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

// GET CURRENT USER SESSION & METADATA
app.get('/api/auth/user', async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return res.status(401).json({ error: 'Not authenticated' });

        res.json({
            user,
            metadata: user.user_metadata || null
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

// UPDATE PROFILE METADATA Directly in Auth Storage
app.put('/api/auth/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { 
            first_name, 
            last_name, 
            phone, 
            country,
            city,
            postal_code,
            address_line_1,
            address_line_2
        } = req.body;

        const updatedData = { ...user.user_metadata };

        if (first_name) updatedData.first_name = first_name.trim();
        if (last_name) updatedData.last_name = last_name.trim();
        if (first_name || last_name) {
            updatedData.full_name = `${updatedData.first_name || ''} ${updatedData.last_name || ''}`.trim();
        }
        if (phone) updatedData.mobile_phone = formatPhoneNumber(phone);
        if (country) updatedData.country = country;
        if (city) updatedData.city_suburb = city;
        if (postal_code) updatedData.zip_postcode = postal_code;
        if (address_line_1) updatedData.address_line_1 = address_line_1;
        if (address_line_2) updatedData.address_line_2 = address_line_2;

        updatedData.full_address = buildFullAddress({
            apartment_house: updatedData.address_line_2 || '',
            street_address: updatedData.address_line_1 || '',
            city: updatedData.city_suburb || '',
            state_province: '',
            postal_code: updatedData.zip_postcode || '',
            country: updatedData.country || 'Bangladesh'
        });

        const { data, error } = await supabase.auth.updateUser({
            data: updatedData
        });

        if (error) return res.status(500).json({ error: error.message });

        res.json({
            message: 'Profile metadata updated successfully',
            user: data.user
        });

    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// FORGOT PASSWORD
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${req.protocol}://${req.get('host')}/reset-password`
        });

        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to send reset email' });
    }
});

// RESET PASSWORD
app.put('/api/auth/reset-password', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const { error } = await supabase.auth.updateUser({ password: password });
        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// ============================================
// PRODUCTS API (Categories, Subcategories with Slug)
// ============================================

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
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
        const { data, error } = await supabase.from('categories').select('*').eq('is_active', true);
        
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
        const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true);
        
        const category = categories.find(cat => {
            const dbSlug = cat.slug || createSlug(cat.name);
            return dbSlug.replace(/^category\//, '') === slug;
        });
        
        if (!category) return res.status(404).json({ error: 'Category not found' });
        
        const { data, error } = await supabase
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
            const { data: categories } = await supabase.from('categories').select('id, slug').eq('is_active', true);
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

// Get products by subcategory slug
app.get('/api/subcategories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data: subcategories } = await supabase.from('subcategories').select('*').eq('is_active', true);
        
        const subcategory = subcategories.find(sub => {
            const dbSlug = sub.slug || createSlug(sub.name);
            return dbSlug.replace(/^category\/[^/]+\//, '') === slug;
        });
        
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        
        const { data, error } = await supabase
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

// ============================================
// PRODUCT DETAILS API (Colors, Variants, Reviews, Videos, Banners)
// ============================================

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

// Submit product review
app.post('/api/submit-review', async (req, res) => {
    try {
        const { product_id, user_name, rating, review_text } = req.body;
        if (!product_id || !rating || !review_text) return res.status(400).json({ error: 'Missing required fields' });
        
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
// MENU, HERO SLIDES, NEWS & VIDEOS API
// ============================================

app.get('/api/menu', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select(`*, categories:category_id (id, name), subcategories:subcategory_id (id, name)`)
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

app.get('/api/hero', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hero').select('*').order('created_at', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/news', async (req, res) => {
    try {
        const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// PAGE ROUTES & SPA FALLBACK
// ============================================
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'signup.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'profile.html')));
app.get('/category/:slug*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'category.html')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
