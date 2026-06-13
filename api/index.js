const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const SUPABASE_URL = "https://kfncdapeswlnwsackkdy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY5NjgsImV4cCI6MjA5NTYxMjk2OH0.w0JCxkp0GHhwBboSQXYjA3lqUKEWtgbOgq07D554wK8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ============================================
// Helper: Create slug from string
// ============================================
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ============================================
// Helper: Format product with category/subcategory names
// ============================================
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

// ============================================
// Middleware: Authenticate User
// ============================================
async function authenticateUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header required' });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Authentication failed' });
    }
}

// ============================================
// Middleware: Check Admin (ডায়নামিক)
// ============================================
async function requireAdmin(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (error || !profile) {
            return res.status(403).json({ error: 'Profile not found' });
        }

        if (!['admin', 'super_admin'].includes(profile.role)) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.userProfile = profile;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Admin check failed' });
    }
}

// ============================================
// AUTH ROUTES
// ============================================

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, full_name, username, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Supabase Auth সাইন আপ
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: full_name || email.split('@')[0],
                    username: username || email.split('@')[0]
                }
            }
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        // Profiles টেবিলে ইউজারনেম/ফোন আপডেট (ট্রিগার অটো ক্রিয়েট করবে)
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    username: username || email.split('@')[0],
                    full_name: full_name || email.split('@')[0],
                    phone: phone || null
                })
                .eq('id', authData.user.id);

            if (profileError) {
                console.error('Profile update error:', profileError);
            }
        }

        res.json({
            success: true,
            message: 'Sign up successful! Please check your email for verification.',
            user: authData.user,
            session: authData.session
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sign In (Login)
app.post('/api/auth/login', async (req, res) => {
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

        // লগইন টাইম রেকর্ড (ট্রিগার অটো করবে)
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        res.json({
            success: true,
            message: 'Login successful',
            user: data.user,
            session: data.session,
            profile: profile
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sign Out (Logout)
app.post('/api/auth/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Current User
app.get('/api/auth/user', authenticateUser, async (req, res) => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            user: req.user,
            profile: profile
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Profile
app.put('/api/auth/profile', authenticateUser, async (req, res) => {
    try {
        const { full_name, username, phone, avatar_url } = req.body;
        const updates = {};

        if (full_name) updates.full_name = full_name;
        if (username) updates.username = username;
        if (phone) updates.phone = phone;
        if (avatar_url) updates.avatar_url = avatar_url;

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            profile: data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${req.protocol}://${req.get('host')}/reset-password`
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'New password is required' });
        }

        const { data, error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// ADMIN PROFILE ROUTES (ডায়নামিক অ্যাডমিন)
// ============================================

// সব প্রোফাইল লিস্ট (শুধু অ্যাডমিন)
app.get('/api/admin/profiles', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ইউজারের রোল আপডেট (শুধু super_admin)
app.put('/api/admin/profile/:userId/role', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!role || !['user', 'admin', 'super_admin'].includes(role)) {
            return res.status(400).json({ error: 'Valid role is required' });
        }

        // শুধু super_admin ই রোল চেঞ্জ করতে পারে
        if (req.userProfile.role !== 'super_admin') {
            return res.status(403).json({ error: 'Only super admin can change roles' });
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({ role })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({
            success: true,
            message: 'Role updated successfully',
            profile: data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// প্রোফাইল ডিলিট (শুধু অ্যাডমিন)
app.delete('/api/admin/profile/:userId', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const { userId } = req.params;

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// API Routes
// ============================================

// সব প্রোডাক্ট - ক্যাটাগরি ও সাব-ক্যাটাগরি নাম সহ
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
        
        // SQL ট্রিগার 'category/xxxx' ফরম্যাটে slug সংরক্ষণ করে
        // আমরা API-তে শুধু 'xxxx' পাঠাব
        const categoriesWithSlugs = data.map(cat => ({
            ...cat,
            slug: cat.slug ? cat.slug.replace(/^category\//, '') : createSlug(cat.name)
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

// ============================================
// সাব-ক্যাটাগরি API (Slug-based)
// ============================================

// সব সাব-ক্যাটাগরি - Public
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
            category_slug: sub.categories ? sub.categories.name : ''
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
            category_slug: subcategory.categories ? subcategory.categories.name : ''
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
        
        const { data: categories } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true);
        
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

// ============================================
// Subcategory Products API
// ============================================
app.get('/api/subcategories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        
        const { data: subcategories } = await supabase
            .from('subcategories')
            .select('*')
            .eq('is_active', true);
        
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

// প্রোডাক্ট কালার - slug দিয়ে
app.get('/api/product-colors', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) return res.status(400).json({ error: 'Slug required' });
        
        const { data: products } = await supabase
            .from('products')
            .select('*');
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
        
        const { data: products } = await supabase
            .from('products')
            .select('*');
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
        
        const { data: products } = await supabase
            .from('products')
            .select('*');
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
        
        const { data: products } = await supabase
            .from('products')
            .select('*');
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
        
        const { data: products } = await supabase
            .from('products')
            .select('*');
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
app.post('/api/submit-review', async (req, res) => {
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
// অ্যাডমিন চেক এন্ডপয়েন্ট
// ============================================
app.get('/api/auth/check-admin', authenticateUser, async (req, res) => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (error || !profile) {
            return res.json({ isAdmin: false });
        }

        res.json({
            isAdmin: ['admin', 'super_admin'].includes(profile.role),
            role: profile.role
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// CATEGORY PAGE ROUTE - Slug-based dynamic routing
// ============================================
app.get('/category/:slug*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'category.html'));
});

// ============================================
// SPA Fallback - সব রাউট index.html এ ফরোয়ার্ড
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
