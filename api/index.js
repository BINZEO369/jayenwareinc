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
// Helper: Build full address from components
// ============================================
function buildFullAddress(data) {
    const parts = [
        data.apartment_house,
        data.street_address,
        data.city,
        data.state_province,
        data.postal_code,
        data.country
    ].filter(Boolean);
    
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
// Helper: Format phone number to E.164
// ============================================
function formatPhoneToE164(phone) {
    if (!phone || phone === 'N/A') return phone;
    
    // Remove all non-digit characters
    let cleaned = phone.replace(/[^\d]/g, '');
    
    // If starts with 01, convert to +8801 format (Bangladesh)
    if (/^01[3-9]/.test(cleaned) && cleaned.length === 11) {
        return '+880' + cleaned.substring(1);
    }
    
    // If starts with 8801, add +
    if (/^8801[3-9]/.test(cleaned) && cleaned.length === 13) {
        return '+' + cleaned;
    }
    
    // If already has +, return as-is
    if (phone.startsWith('+')) return phone;
    
    // Default: add + if numbers only
    if (/^\d{10,15}$/.test(cleaned)) {
        return '+' + cleaned;
    }
    
    return phone;
}

// ============================================
// Helper: Format phone for display
// ============================================
function formatPhoneForDisplay(phone) {
    if (!phone || phone === 'N/A') return phone;
    if (phone.startsWith('+880')) {
        return '0' + phone.substring(4); // +8801XXXXXXXXX → 01XXXXXXXXX
    }
    return phone;
}

// ============================================
// AUTHENTICATION API ROUTES
// ============================================

// সাইনআপ - Professional Signup with full address & JBYN-OneID
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { 
            email, 
            password, 
            name,
            full_name,
            phone,
            country,
            state_province,
            city,
            postal_code,
            street_address,
            apartment_house,
            full_address
        } = req.body;

        // বেসিক ভ্যালিডেশন
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }

        const displayName = (name || full_name || '').trim();
        if (!displayName || displayName.length < 3) {
            return res.status(400).json({
                error: 'Full name is required (minimum 3 characters)'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({ 
                error: 'Password must be at least 8 characters' 
            });
        }

        // ফোন নম্বর E.164 ফরম্যাটিং
        const formattedPhone = formatPhoneToE164(phone);

        // Complete address building
        const completeAddress = full_address || buildFullAddress({
            apartment_house: apartment_house || '',
            street_address: street_address || '',
            city: city || '',
            state_province: state_province || '',
            postal_code: postal_code || '',
            country: country || ''
        });

        // Supabase সাইনআপ - user_metadata সহ (SQL trigger compatibility)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: displayName,          // SQL trigger expects 'full_name' or 'name'
                    name: displayName,               // Both for compatibility
                    phone: formattedPhone || 'N/A',
                    country: country || null,        // NULL allowed (global users)
                    state_province: state_province || null,
                    city: city || null,
                    postal_code: postal_code || null,
                    street_address: street_address || null,
                    apartment_house: apartment_house || null,
                    full_address: completeAddress,   // SQL trigger checks this
                    address: completeAddress         // Both for compatibility
                }
            }
        });

        if (error) {
            if (error.message.includes('already registered') || error.message.includes('already exists')) {
                return res.status(400).json({ 
                    error: 'This email is already registered. Please login instead.' 
                });
            }
            if (error.message.includes('rate limit') || error.message.includes('Too many')) {
                return res.status(429).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }

        // Fetch the JBYN-OneID from profile (auto-created by SQL trigger)
        let jbyn_oneid = null;
        let profile = null;
        
        if (data.user) {
            // Wait briefly for trigger to complete
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
            jbyn_oneid: jbyn_oneid,
            profile: profile
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// লগইন - ইউজার অথেন্টিকেশন (with full profile + JBYN-OneID)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                return res.status(401).json({ 
                    error: 'Invalid email or password' 
                });
            }
            if (error.message.includes('Email not confirmed')) {
                return res.status(401).json({ 
                    error: 'Please verify your email before logging in' 
                });
            }
            return res.status(401).json({ error: error.message });
        }

        // Fetch complete profile data with JBYN-OneID
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        res.json({
            message: 'Login successful!',
            user: data.user,
            session: data.session,
            profile: profile || null,
            jbyn_oneid: profile?.jbyn_oneid || null
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
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

// বর্তমান ইউজার সেশন চেক (Enhanced with complete profile + JBYN-OneID)
app.get('/api/auth/user', async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Complete profile fetch
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        res.json({
            user,
            profile: profile || null,
            jbyn_oneid: profile?.jbyn_oneid || null
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

// ============================================
// PROFILE API ROUTES (JBYN-OneID System)
// ============================================

// Get own profile (full access - owner only)
app.get('/api/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Use get_my_profile RPC function (security invoker)
        const { data, error } = await supabase.rpc('get_my_profile');
        
        if (error) {
            // Fallback to direct query
            const { data: profile, error: fallbackError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (fallbackError) {
                return res.status(404).json({ error: 'Profile not found' });
            }
            
            return res.json({
                profile: profile,
                jbyn_oneid: profile.jbyn_oneid
            });
        }

        res.json({
            profile: data,
            jbyn_oneid: data?.[0]?.jbyn_oneid || null
        });

    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Search user by OneID (privacy-safe - no email/phone)
app.get('/api/profile/:oneid', async (req, res) => {
    try {
        const { oneid } = req.params;
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Use search_user_by_oneid RPC function (privacy-safe)
        const { data, error } = await supabase.rpc('search_user_by_oneid', {
            lookup_oneid: oneid
        });

        if (error) {
            return res.status(404).json({ error: error.message || 'User not found' });
        }

        res.json({
            user: data?.[0] || null,
            access_level: data?.[0]?.access_level || 'public'
        });

    } catch (err) {
        console.error('OneID search error:', err);
        res.status(500).json({ error: 'Failed to search user' });
    }
});

// Lookup user by OneID (respects contact_privacy)
app.post('/api/profile/lookup', async (req, res) => {
    try {
        const { oneid } = req.body;
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!oneid) {
            return res.status(400).json({ error: 'OneID is required' });
        }

        // Use lookup_user_by_oneid RPC function (privacy-aware)
        const { data, error } = await supabase.rpc('lookup_user_by_oneid', {
            lookup_oneid: oneid
        });

        if (error) {
            return res.status(404).json({ error: error.message || 'User not found' });
        }

        res.json({
            user: data?.[0] || null
        });

    } catch (err) {
        console.error('OneID lookup error:', err);
        res.status(500).json({ error: 'Failed to lookup user' });
    }
});

// Check if OneID exists
app.get('/api/profile/check/:oneid', async (req, res) => {
    try {
        const { oneid } = req.params;

        // Use profile_exists RPC function
        const { data, error } = await supabase.rpc('profile_exists', {
            lookup_oneid: oneid
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({
            exists: data || false
        });

    } catch (err) {
        console.error('Profile check error:', err);
        res.status(500).json({ error: 'Failed to check profile' });
    }
});

// প্রোফাইল আপডেট (Professional fields + JBYN-OneID preserved)
app.put('/api/auth/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { 
            name, 
            full_name,
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

        // ভ্যালিডেশন
        const displayName = (name || full_name || '').trim();
        if (displayName && displayName.length < 3) {
            return res.status(400).json({ error: 'Name must be at least 3 characters' });
        }

        // Phone validation (E.164)
        if (phone) {
            const cleanedPhone = phone.replace(/[^\d+]/g, '');
            if (!/^\+[1-9]\d{6,14}$/.test(cleanedPhone) && 
                !/^01[3-9]\d{8}$/.test(cleanedPhone)) {
                return res.status(400).json({ 
                    error: 'Invalid phone format. Use E.164: +8801XXXXXXXXX or 01XXXXXXXXX' 
                });
            }
        }

        // Get existing profile to merge
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!existingProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Build update data
        const updateData = {};
        if (displayName) updateData.name = displayName;
        if (phone) updateData.phone = formatPhoneToE164(phone);
        if (country !== undefined) updateData.country = country || null;
        if (state_province !== undefined) updateData.state_province = state_province || null;
        if (city !== undefined) updateData.city = city || null;
        if (postal_code !== undefined) updateData.postal_code = postal_code || null;
        if (street_address !== undefined) updateData.street_address = street_address || null;
        if (apartment_house !== undefined) updateData.apartment_house = apartment_house || null;
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url || null;
        if (contact_privacy !== undefined) updateData.contact_privacy = contact_privacy;
        if (allow_search !== undefined) updateData.allow_search = allow_search;

        // Don't update JBYN-OneID (trigger prevents it anyway)

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({
            message: 'Profile updated successfully',
            profile: data,
            jbyn_oneid: data.jbyn_oneid
        });

    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update privacy settings (using RPC function)
app.put('/api/profile/privacy', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { privacy_level, allow_search } = req.body;

        // Use update_privacy_settings RPC function
        const { data, error } = await supabase.rpc('update_privacy_settings', {
            p_privacy_level: privacy_level || null,
            p_allow_search: allow_search !== undefined ? allow_search : null
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({
            message: 'Privacy settings updated',
            success: data
        });

    } catch (err) {
        console.error('Privacy update error:', err);
        res.status(500).json({ error: 'Failed to update privacy settings' });
    }
});

// JBYN-OneID রিট্রিভ (Self lookup)
app.get('/api/auth/passkey', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('jbyn_oneid')
            .eq('id', user.id)
            .single();

        if (error || !profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            jbyn_oneid: profile.jbyn_oneid
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve OneID' });
    }
});

// সফট ডিলিট অ্যাকাউন্ট (30-day grace period)
app.delete('/api/auth/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { reason } = req.body;

        // Use soft_delete_user RPC function
        const { data, error } = await supabase.rpc('soft_delete_user', {
            p_user_id: user.id,
            p_reason: reason || 'User requested deletion'
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({
            message: 'Account scheduled for deletion. You have 30 days to restore it.',
            success: data
        });

    } catch (err) {
        console.error('Delete account error:', err);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// রিস্টোর অ্যাকাউন্ট (within grace period)
app.post('/api/auth/profile/restore', async (req, res) => {
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

        res.json({
            message: 'Account restored successfully',
            success: data
        });

    } catch (err) {
        console.error('Restore account error:', err);
        res.status(500).json({ error: 'Failed to restore account' });
    }
});

// পাসওয়ার্ড রিসেট রিকোয়েস্ট
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${req.protocol}://${req.get('host')}/reset-password`
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ 
            message: 'Password reset link sent to your email' 
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to send reset email' });
    }
});

// পাসওয়ার্ড আপডেট (রিসেটের পর)
app.put('/api/auth/reset-password', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 8) {
            return res.status(400).json({ 
                error: 'Password must be at least 8 characters' 
            });
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// ============================================
// ADMIN API ROUTES (requires admin role)
// ============================================

// Admin: Full user lookup
app.get('/api/admin/user/:oneid', async (req, res) => {
    try {
        const { oneid } = req.params;
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data, error } = await supabase.rpc('admin_lookup_user', {
            lookup_oneid: oneid
        });

        if (error) {
            return res.status(403).json({ error: error.message || 'Admin access required' });
        }

        res.json({ user: data?.[0] || null });

    } catch (err) {
        console.error('Admin lookup error:', err);
        res.status(500).json({ error: 'Failed to lookup user' });
    }
});

// Admin: System health check
app.get('/api/admin/health', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data, error } = await supabase.rpc('get_system_health');

        if (error) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        res.json({ health: data || [] });

    } catch (err) {
        console.error('Health check error:', err);
        res.status(500).json({ error: 'Failed to get system health' });
    }
});

// Admin: GDPR compliance check
app.get('/api/admin/gdpr', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data, error } = await supabase.rpc('check_gdpr_compliance');

        if (error) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        res.json({ compliance: data || [] });

    } catch (err) {
        console.error('GDPR check error:', err);
        res.status(500).json({ error: 'Failed to check GDPR compliance' });
    }
});

// ============================================
// API Routes (Products, Categories, etc.) - UNCHANGED
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
// ক্যাটাগরি API (Slug-based) - UNCHANGED
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
// সাব-ক্যাটাগরি API (Slug-based) - UNCHANGED
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
// মেনু আইটেমস API (Complete Menu Structure) - UNCHANGED
// ============================================

// Main Menu - হায়ারার্কি সহ
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
// Category Product API - UNCHANGED
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
// Subcategory Products API - UNCHANGED
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
// হিরো স্লাইড - UNCHANGED
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

// হিরো ভিডিও
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

// হিরো সেকেন্ডারি
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
// নিউজ - UNCHANGED
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
// প্রোডাক্ট ডিটেইলস - slug দিয়ে - UNCHANGED
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

// প্রোডাক্ট কালার
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

// প্রোডাক্ট ভেরিয়েন্ট
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

// প্রোডাক্ট রিভিউ
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

// প্রোডাক্ট ভিডিও
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

// প্রোডাক্ট ব্যানার
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
// রিভিউ সাবমিট - UNCHANGED
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
// AUTH PAGES ROUTES - UNCHANGED
// ============================================
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'reset-password.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'profile.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'account.html'));
});

// ============================================
// CATEGORY PAGE ROUTE - UNCHANGED
// ============================================
app.get('/category/:slug*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'category.html'));
});

// ============================================
// SPA Fallback - UNCHANGED
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
