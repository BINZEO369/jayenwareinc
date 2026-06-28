// ============================================
// server.js - Complete API Server (Ultimate Merged Edition)
// JBYN-OneID Global Profile System & Jayenware Core
// Supabase Integrated | Production Ready
// All Endpoints Restored & Verified | SQL Schema Compatible
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
// AUTHENTICATION API ROUTES (PRO-GRADE DATABASE SYNCED)
// ============================================

// SIGNUP - Registers to Auth and automatically triggers Postgres Profiles
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { 
            email, 
            password, 
            name, 
            phone,
            country,
            state_province,
            city,
            postal_code,
            street_address,
            apartment_house
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        if (!name || name.trim().length < 3) {
            return res.status(400).json({ error: 'Full name is required (minimum 3 characters)' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const formattedPhone = formatPhoneNumber(phone);
        if (phone && !isValidPhone(formattedPhone)) {
            return res.status(400).json({ error: 'Invalid phone format. Use international format (e.g., +8801XXXXXXXXX)' });
        }

        const fullAddress = buildFullAddress({
            apartment_house: apartment_house || '',
            street_address: street_address || '',
            city: city || '',
            state_province: state_province || '',
            postal_code: postal_code || '',
            country: country || 'Bangladesh'
        });

        if (!fullAddress || fullAddress.length < 10) {
            return res.status(400).json({ error: 'Please provide complete address details (minimum 10 characters)' });
        }

        // SignUp via Supabase Auth and seed metadata
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name.trim(),
                    phone: formattedPhone || 'N/A',
                    country: country || 'Bangladesh',
                    state_province: state_province || null,
                    city: city || null,
                    postal_code: postal_code || null,
                    street_address: street_address || null,
                    apartment_house: apartment_house || null,
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

        let oneid = null;
        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('jbyn_oneid')
                .eq('id', data.user.id)
                .single();
            
            oneid = profile?.jbyn_oneid || null;
        }

        res.status(201).json({
            message: 'Registration successful! Please check your email for verification.',
            user: data.user,
            session: data.session,
            jbyn_oneid: oneid
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

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        res.json({
            message: 'Login successful!',
            user: data.user,
            session: data.session,
            profile: profile || null
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

// GET CURRENT USER SESSION (Uses get_current_user_profile RPC)
app.get('/api/auth/user', async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { data: profileData, error: profileError } = await supabase
            .rpc('get_current_user_profile');

        if (profileError) return res.status(500).json({ error: profileError.message });
        const profile = profileData?.success ? profileData.data : null;

        res.json({ user, profile });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

// UPDATE PROFILE (Uses upsert_user_profile RPC)
app.put('/api/auth/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { 
            name, phone, country, state_province,
            city, postal_code, street_address, apartment_house 
        } = req.body;

        if (name && name.trim().length < 3) {
            return res.status(400).json({ error: 'Name must be at least 3 characters' });
        }

        const { data, error } = await supabase
            .rpc('upsert_user_profile', {
                p_name: name,
                p_phone: phone || null,
                p_country: country || null,
                p_state_province: state_province || null,
                p_city: city || null,
                p_postal_code: postal_code || null,
                p_street_address: street_address || null,
                p_apartment_house: apartment_house || null
            });

        if (error) return res.status(500).json({ error: error.message });

        if (!data.success) {
            return res.status(400).json({ 
                error: data.error, 
                field: data.field,
                code: data.code 
            });
        }

        res.json({
            message: data.message,
            action: data.action,
            oneid: data.oneid
        });

    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// GET JBYN PASSKEY (OneID)
app.get('/api/auth/passkey', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { data: profile } = await supabase
            .from('profiles')
            .select('jbyn_oneid')
            .eq('id', user.id)
            .single();

        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json({ jbyn_oneid: profile.jbyn_oneid });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve OneID' });
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

// DELETE ACCOUNT (Removes custom profile & clears active session)
app.post('/api/auth/delete-account', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', user.id);

        if (profileError) return res.status(400).json({ error: profileError.message });
        await supabase.auth.signOut();

        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// ============================================
// OneID LOOKUP & SEARCH API
// ============================================

// Search user by OneID (Privacy-safe)
app.get('/api/oneid/search/:oneid', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { oneid } = req.params;
        if (!isValidOneID(oneid)) {
            return res.status(400).json({ error: 'Invalid JBYN-OneID format. Use: JBYN-OneID-XXXXXXXXXXXX' });
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('name, jbyn_oneid, country, city, is_verified')
            .eq('jbyn_oneid', oneid)
            .single();

        if (error) return res.status(404).json({ error: 'User not found with this OneID' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Lookup user by OneID (Full details via Authorized Database RPC)
app.get('/api/oneid/lookup/:oneid', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { oneid } = req.params;
        if (!isValidOneID(oneid)) return res.status(400).json({ error: 'Invalid JBYN-OneID format' });

        const { data, error } = await supabase
            .rpc('lookup_user_by_oneid', { lookup_oneid: oneid });

        if (error) return res.status(404).json({ error: error.message });
        res.json(data?.[0] || null);
    } catch (err) {
        res.status(500).json({ error: 'Lookup failed' });
    }
});

// Check if OneID exists instantly
app.get('/api/oneid/exists/:oneid', async (req, res) => {
    try {
        const { oneid } = req.params;
        if (!isValidOneID(oneid)) return res.status(400).json({ error: 'Invalid JBYN-OneID format' });

        const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('jbyn_oneid', oneid)
            .single();

        if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
        res.json({ exists: !!data });
    } catch (err) {
        res.status(500).json({ error: 'Check failed' });
    }
});

// ============================================
// PRODUCTS API (Categories, Subcategories with Slug Engine)
// ============================================

app.get('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select(`*, categories:category_id (name), subcategories:subcategory_id (name)`)
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(formatProducts(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/product/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const { data, error } = await supabase
            .from('products')
            .select(`*, categories:category_id (name), subcategories:subcategory_id (name)`);
        
        if (error) return res.status(500).json({ error: error.message });
        
        const product = data.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        
        res.json(formatProduct(product));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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
            .select(`*, categories:category_id (name), subcategories:subcategory_id (name)`)
            .eq('category_id', category.id)
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(formatProducts(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/subcategories', async (req, res) => {
    try {
        const { category_slug } = req.query;
        let query = supabase.from('subcategories').select('*, categories(name, id, slug)').eq('is_active', true).order('sort_order', { ascending: true });
        
        if (category_slug) {
            const { data: categories } = await supabase.from('categories').select('id, slug').eq('is_active', true);
            const category = categories.find(cat => (cat.slug || createSlug(cat.name)).replace(/^category\//, '') === category_slug);
            if (category) query = query.eq('category_id', category.id);
            else return res.status(404).json({ error: 'Category not found' });
        }
        
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        
        res.json(data.map(sub => ({
            ...sub,
            slug: sub.slug ? sub.slug.replace(/^category\/[^/]+\//, '') : createSlug(sub.name),
            category_slug: sub.categories ? createSlug(sub.categories.name) : ''
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/subcategories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { category_slug } = req.query;
        const { data, error } = await supabase.from('subcategories').select('*, categories(name, id, slug)').eq('is_active', true);
        if (error) return res.status(500).json({ error: error.message });
        
        let subcategory = data.find(sub => (sub.slug || createSlug(sub.name)).replace(/^category\/[^/]+\//, '') === slug);
        if (category_slug && subcategory) {
            const cleanCatSlug = (subcategory.categories?.slug || createSlug(subcategory.categories?.name || '')).replace(/^category\//, '');
            if (cleanCatSlug !== category_slug) subcategory = null;
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

app.get('/api/subcategories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data: subcategories } = await supabase.from('subcategories').select('*').eq('is_active', true);
        const subcategory = subcategories.find(sub => (sub.slug || createSlug(sub.name)).replace(/^category\/[^/]+\//, '') === slug);
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        
        const { data, error } = await supabase
            .from('products')
            .select(`*, categories:category_id (name), subcategories:subcategory_id (name)`)
            .eq('subcategory_id', subcategory.id)
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(formatProducts(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// NAVIGATION MENU API
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

app.get('/api/menu-items', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select(`*, categories:category_id (id, name), subcategories:subcategory_id (id, name)`)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data.map(item => ({
            ...item,
            slug: createSlug(item.title),
            category_slug: item.categories ? createSlug(item.categories.name) : null,
            subcategory_slug: item.subcategories ? createSlug(item.subcategories.name) : null
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/menu-items/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabase.from('menu_items').select(`*, categories:category_id (id, name), subcategories:subcategory_id (id, name)`).eq('is_active', true);
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
// HERO SLIDES & MEDIA API
// ============================================

app.get('/api/hero', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hero').select('*').order('created_at', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/hero-videos', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hero_videos').select('*').eq('is_active', true).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/hero-secondary', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hero_secondary').select('*').eq('is_active', true).order('sort_order', { ascending: true });
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
        const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// PRODUCT ADVANCED DETAILS API (Colors, Sizes, Reviews, Videos, Banners)
// ============================================

app.get('/api/product-colors', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase.from('product_colors').select('*').eq('product_id', product.id).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/product-variants', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase.from('product_variants').select('*').eq('product_id', product.id).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/product-reviews', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase.from('product_reviews').select('*').eq('product_id', product.id).order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/submit-review', async (req, res) => {
    try {
        const { product_id, user_name, rating, review_text } = req.body;
        if (!product_id || !rating || !review_text) return res.status(400).json({ error: 'Missing required fields' });
        
        const { data, error } = await supabase
            .from('product_reviews')
            .insert([{ product_id, user_name: user_name || 'Guest User', rating: parseInt(rating), review_text }]);
        
        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/product-videos', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase.from('product_videos').select('*').eq('product_id', product.id).eq('is_active', true).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/product-banners', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase.from('products').select('*');
        const product = products.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.json([]);
        
        const { data, error } = await supabase.from('product_banners').select('*').eq('product_id', product.id).eq('is_active', true).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/color-sizes', async (req, res) => {
    try {
        const ids = req.query.ids;
        if (!ids) return res.json([]);
        
        const idArray = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        if (!idArray.length) return res.json([]);
        
        const { data, error } = await supabase.from('color_sizes').select('*').in('color_id', idArray).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// PAGE STRUCTURAL ROUTES
// ============================================
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'signup.html')));
app.get('/reset-password', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'reset-password.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'profile.html')));
app.get('/account', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'account.html')));
app.get('/category/:slug*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'category.html')));

// ============================================
// SPA FALLBACK ENGINE (Must be kept at bottom)
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
