const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const SUPABASE_URL = "https://kfncdapeswlnwsackkdy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY5NjgsImV4cCI6MjA5NTYxMjk2OH0.w0JCxkp0GHhwBboSQXYjA3lqUKEWtgbOgq07D554wK8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// JSON body parser for POST requests
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
// Helper: Format phone number to E.164
// ============================================
function formatPhoneToE164(phone) {
    if (!phone || phone === 'N/A') return phone;
    
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // If starts with '01', convert to +8801 format (Bangladesh)
    if (/^01/.test(cleaned) && cleaned.length === 11) {
        cleaned = '+880' + cleaned.substring(1);
    }
    
    // If starts with '880', add '+'
    if (/^880/.test(cleaned)) {
        cleaned = '+' + cleaned;
    }
    
    // If already has + and country code, return as-is
    if (/^\+[1-9]\d{6,14}$/.test(cleaned)) {
        return cleaned;
    }
    
    // If no country code, assume Bangladesh
    if (/^01/.test(cleaned)) {
        return '+880' + cleaned.substring(1);
    }
    
    return cleaned;
}

// ============================================
// Helper: Build full address string
// ============================================
function buildFullAddress(data) {
    const parts = [
        data.apartment_house,
        data.street_address,
        data.city,
        data.state_province,
        data.postal_code,
        data.country || 'Bangladesh'
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ') || 'Address not provided';
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
// AUTHENTICATION API ROUTES
// ============================================

// সাইনআপ - SQL Database Compatible
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
            apartment_house,
            full_address // Frontend থেকে আসতে পারে
        } = req.body;

        // ==========================================
        // বেসিক ভ্যালিডেশন (SQL validate_signup_data() trigger অনুযায়ী)
        // ==========================================
        if (!email || email.trim() === '') {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        
        if (email.length > 254) {
            return res.status(400).json({ error: 'Email address is too long' });
        }

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ error: 'Name must be at least 3 characters' });
        }

        if (password && password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // ==========================================
        // ফোন E.164 ফরম্যাটিং (SQL CHECK constraint: ^\+[1-9]\d{6,14}$)
        // ==========================================
        const formattedPhone = formatPhoneToE164(phone);
        if (formattedPhone !== 'N/A' && !/^\+[1-9]\d{6,14}$/.test(formattedPhone)) {
            return res.status(400).json({ 
                error: 'Invalid phone format. Use E.164: +[country][number] (e.g., +8801XXXXXXXXX, +1212XXXXXXX)' 
            });
        }

        // ==========================================
        // ঠিকানা ভ্যালিডেশন (SQL CHECK: char_length >= 10)
        // ==========================================
        const finalFullAddress = full_address || buildFullAddress({
            apartment_house: apartment_house || '',
            street_address: street_address || '',
            city: city || '',
            state_province: state_province || '',
            postal_code: postal_code || '',
            country: country || 'Bangladesh'
        });

        if (!finalFullAddress || finalFullAddress.trim().length < 10) {
            return res.status(400).json({ 
                error: 'Please provide complete address (minimum 10 characters)' 
            });
        }

        // ==========================================
        // Supabase সাইনআপ - SQL handle_new_user() trigger compatible
        // ==========================================
        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    full_name: name.trim(),           // SQL checks 'full_name' first
                    phone: formattedPhone || 'N/A',   // E.164 format
                    country: country || null,          // NULL allowed per SQL
                    state_province: state_province || null,
                    city: city || null,
                    postal_code: postal_code || null,
                    street_address: street_address || null,
                    apartment_house: apartment_house || null,
                    full_address: finalFullAddress.trim() // SQL checks 'full_address' first
                }
            }
        });

        if (error) {
            if (error.message.includes('already registered') || error.message.includes('already exists')) {
                return res.status(400).json({ error: 'This email is already registered. Please login instead.' });
            }
            if (error.message.includes('rate limit') || error.message.includes('Too many')) {
                return res.status(429).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }

        // ==========================================
        // jbyn_oneid রিট্রিভ (SQL trigger তৈরি করবে)
        // ==========================================
        let jbyn_oneid = null;
        let profile = null;
        
        if (data.user) {
            // SQL trigger handle_new_user() অটোমেটিক প্রোফাইল তৈরি করবে
            // সামান্য ওয়েট করে প্রোফাইল ফেচ
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const { data: profileData } = await supabase
                .from('profiles')
                .select('jbyn_oneid, contact_privacy, allow_search')
                .eq('id', data.user.id)
                .single();
            
            if (profileData) {
                jbyn_oneid = profileData.jbyn_oneid;
                profile = profileData;
            }
        }

        res.status(201).json({
            message: 'Registration successful! Please check your email for verification.',
            user: data.user,
            session: data.session,
            jbyn_oneid: jbyn_oneid,          // Frontend-এ দেখানোর জন্য
            profile: profile
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// লগইন
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

        // Fetch complete profile with jbyn_oneid
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

// লগআউট
app.post('/api/auth/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

// বর্তমান ইউজার সেশন + সম্পূর্ণ প্রোফাইল
app.get('/api/auth/user', async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Use SQL function get_my_profile() for complete data
        const { data: profile, error: profileError } = await supabase
            .rpc('get_my_profile');

        if (profileError) {
            // Fallback to direct query
            const { data: fallbackProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            return res.json({ user, profile: fallbackProfile || null });
        }

        res.json({ user, profile: profile?.[0] || null });

    } catch (err) {
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

// ============================================
// PROFILE API ROUTES (SQL RPC Functions)
// ============================================

// নিজের প্রোফাইল দেখা (SQL: get_my_profile)
app.get('/api/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data, error } = await supabase.rpc('get_my_profile');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ profile: data?.[0] || null });

    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// OneID দিয়ে প্রোফাইল সার্চ (SQL: search_user_by_oneid - Privacy Safe)
app.get('/api/profile/search/:oneid', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { oneid } = req.params;

        const { data, error } = await supabase.rpc('search_user_by_oneid', {
            lookup_oneid: oneid
        });

        if (error) {
            if (error.message.includes('Rate limit')) {
                return res.status(429).json({ error: error.message });
            }
            return res.status(404).json({ error: error.message });
        }

        res.json({ profile: data?.[0] || null });

    } catch (err) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// OneID দিয়ে লুকআপ (SQL: lookup_user_by_oneid - Privacy Respecting)
app.get('/api/profile/lookup/:oneid', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { oneid } = req.params;

        const { data, error } = await supabase.rpc('lookup_user_by_oneid', {
            lookup_oneid: oneid
        });

        if (error) {
            if (error.message.includes('Rate limit')) {
                return res.status(429).json({ error: error.message });
            }
            return res.status(404).json({ error: error.message });
        }

        res.json({ profile: data?.[0] || null });

    } catch (err) {
        res.status(500).json({ error: 'Lookup failed' });
    }
});

// প্রোফাইল আপডেট (SQL Constraints Compatible)
app.put('/api/auth/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { 
            name, 
            phone, 
            country,
            state_province,
            city,
            postal_code,
            street_address,
            apartment_house,
            avatar_url,
            contact_privacy,
            allow_search
        } = req.body;

        // ভ্যালিডেশন (SQL constraints অনুযায়ী)
        if (name && name.trim().length < 3) {
            return res.status(400).json({ error: 'Name must be at least 3 characters' });
        }

        // E.164 ফোন ভ্যালিডেশন
        let formattedPhone = null;
        if (phone) {
            formattedPhone = formatPhoneToE164(phone);
            if (!/^\+[1-9]\d{6,14}$/.test(formattedPhone)) {
                return res.status(400).json({ 
                    error: 'Invalid phone format. Use E.164: +[country][number]' 
                });
            }
        }

        // contact_privacy ভ্যালিডেশন
        if (contact_privacy && !['public', 'contacts_only', 'private'].includes(contact_privacy)) {
            return res.status(400).json({ 
                error: 'Invalid privacy setting. Use: public, contacts_only, or private' 
            });
        }

        // প্রোফাইল আপডেট ডাটা তৈরি
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (formattedPhone) updateData.phone = formattedPhone;
        if (country !== undefined) updateData.country = country || null;
        if (state_province !== undefined) updateData.state_province = state_province || null;
        if (city !== undefined) updateData.city = city || null;
        if (postal_code !== undefined) updateData.postal_code = postal_code || null;
        if (street_address !== undefined) updateData.street_address = street_address || null;
        if (apartment_house !== undefined) updateData.apartment_house = apartment_house || null;
        if (avatar_url) updateData.avatar_url = avatar_url;
        if (contact_privacy) updateData.contact_privacy = contact_privacy;
        if (allow_search !== undefined) updateData.allow_search = allow_search;
        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select('*')
            .single();

        if (error) {
            if (error.message.includes('violates')) {
                return res.status(400).json({ error: 'Invalid data format' });
            }
            return res.status(500).json({ error: error.message });
        }

        res.json({
            message: 'Profile updated successfully',
            profile: data
        });

    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// প্রাইভেসি সেটিংস আপডেট (SQL: update_privacy_settings)
app.put('/api/profile/privacy', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { privacy_level, allow_search } = req.body;

        const { data, error } = await supabase.rpc('update_privacy_settings', {
            p_privacy_level: privacy_level || null,
            p_allow_search: allow_search !== undefined ? allow_search : null
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Privacy settings updated', success: data });

    } catch (err) {
        res.status(500).json({ error: 'Failed to update privacy settings' });
    }
});

// JBYN-OneID রিট্রিভ (নিজের)
app.get('/api/auth/oneid', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('jbyn_oneid')
            .eq('id', user.id)
            .single();

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({ jbyn_oneid: profile.jbyn_oneid });

    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve OneID' });
    }
});

// OneID এক্সিস্টেন্স চেক (SQL: profile_exists)
app.get('/api/profile/exists/:oneid', async (req, res) => {
    try {
        const { oneid } = req.params;

        const { data, error } = await supabase.rpc('profile_exists', {
            lookup_oneid: oneid
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ exists: data });

    } catch (err) {
        res.status(500).json({ error: 'Check failed' });
    }
});

// ============================================
// ACCOUNT DELETE & RESTORE (SQL Functions)
// ============================================

// সফট ডিলিট (SQL: soft_delete_user)
app.delete('/api/auth/account', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { reason } = req.body;

        const { data, error } = await supabase.rpc('soft_delete_user', {
            p_user_id: user.id,
            p_reason: reason || 'User requested deletion'
        });

        if (error) {
            if (error.message.includes('Rate limit') || error.message.includes('Too many')) {
                return res.status(429).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }

        res.json({ 
            message: 'Account deletion scheduled. You have 30 days to restore your account.',
            success: data 
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// অ্যাকাউন্ট রিস্টোর (SQL: restore_user)
app.post('/api/auth/restore', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data, error } = await supabase.rpc('restore_user', {
            p_user_id: user.id
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Account restored successfully', success: data });

    } catch (err) {
        res.status(500).json({ error: 'Failed to restore account' });
    }
});

// ============================================
// PASSWORD MANAGEMENT
// ============================================

// পাসওয়ার্ড রিসেট রিকোয়েস্ট
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

// পাসওয়ার্ড আপডেট
app.put('/api/auth/reset-password', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        const { error } = await supabase.auth.updateUser({ password });
        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================

// অ্যাডমিন: OneID দিয়ে সম্পূর্ণ প্রোফাইল (SQL: admin_lookup_user)
app.get('/api/admin/profile/:oneid', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { oneid } = req.params;

        const { data, error } = await supabase.rpc('admin_lookup_user', {
            lookup_oneid: oneid
        });

        if (error) {
            if (error.message.includes('Admin access required')) {
                return res.status(403).json({ error: 'Admin access required' });
            }
            return res.status(404).json({ error: error.message });
        }

        res.json({ profile: data?.[0] || null });

    } catch (err) {
        res.status(500).json({ error: 'Admin lookup failed' });
    }
});

// সিস্টেম হেলথ (SQL: get_system_health)
app.get('/api/admin/health', async (req, res) => {
    try {
        const { data, error } = await supabase.rpc('get_system_health');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ health: data });

    } catch (err) {
        res.status(500).json({ error: 'Health check failed' });
    }
});

// GDPR কমপ্লায়েন্স চেক (SQL: check_gdpr_compliance)
app.get('/api/admin/gdpr', async (req, res) => {
    try {
        const { data, error } = await supabase.rpc('check_gdpr_compliance');

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ compliance: data });

    } catch (err) {
        res.status(500).json({ error: 'GDPR check failed' });
    }
});

// ============================================
// API Routes (Products, Categories, etc.)
// ============================================

// সব প্রোডাক্ট
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

// সব ক্যাটাগরি
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

// ক্যাটাগরি ডিটেইলস
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

// সব সাব-ক্যাটাগরি
app.get('/api/subcategories', async (req, res) => {
    try {
        const { category_slug } = req.query;
        let query = supabase.from('subcategories').select('*, categories(name, id, slug)').eq('is_active', true).order('sort_order', { ascending: true });
        
        if (category_slug) {
            const { data: categories } = await supabase.from('categories').select('id, slug').eq('is_active', true);
            const category = categories.find(cat => {
                const dbSlug = cat.slug || createSlug(cat.name);
                return dbSlug.replace(/^category\//, '') === category_slug;
            });
            if (category) query = query.eq('category_id', category.id);
            else return res.status(404).json({ error: 'Category not found' });
        }
        
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        
        res.json(data.map(sub => ({
            ...sub,
            slug: sub.slug ? sub.slug.replace(/^category\/[^/]+\//, '') : createSlug(sub.name),
            category_slug: sub.categories ? sub.categories.name : ''
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// সাব-ক্যাটাগরি ডিটেইলস
app.get('/api/subcategories/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabase.from('subcategories').select('*, categories(name, id, slug)').eq('is_active', true);
        if (error) return res.status(500).json({ error: error.message });
        
        let subcategory = data.find(sub => {
            const dbSlug = sub.slug || createSlug(sub.name);
            return dbSlug.replace(/^category\/[^/]+\//, '') === slug;
        });
        
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

// মেনু
app.get('/api/menu', async (req, res) => {
    try {
        const { data, error } = await supabase.from('menu_items').select(`*, categories:category_id (id, name), subcategories:subcategory_id (id, name)`).eq('is_active', true).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        
        const buildMenuTree = (items, parentId = null) => {
            return items.filter(item => item.parent_id === parentId).map(item => ({
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

// প্রোডাক্ট ডিটেইলস
app.get('/api/product/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;
        const { data, error } = await supabase.from('products').select(`*, categories:category_id (name), subcategories:subcategory_id (name)`).order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        
        const product = data.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        
        res.json(formatProduct(product));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// হিরো
app.get('/api/hero', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hero').select('*').order('created_at', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
// AUTH PAGES ROUTES
// ============================================
app.get('/login', (req, res) => { res.sendFile(path.join(__dirname, '..', 'public', 'login.html')); });
app.get('/signup', (req, res) => { res.sendFile(path.join(__dirname, '..', 'public', 'signup.html')); });
app.get('/reset-password', (req, res) => { res.sendFile(path.join(__dirname, '..', 'public', 'reset-password.html')); });
app.get('/profile', (req, res) => { res.sendFile(path.join(__dirname, '..', 'public', 'profile.html')); });
app.get('/account', (req, res) => { res.sendFile(path.join(__dirname, '..', 'public', 'account.html')); });
app.get('/category/:slug*', (req, res) => { res.sendFile(path.join(__dirname, '..', 'public', 'category.html')); });

// SPA Fallback
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, '..', 'public', 'index.html')); });

module.exports = app;
