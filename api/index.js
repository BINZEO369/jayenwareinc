const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();

const SUPABASE_URL = "https://kfncdapeswlnwsackkdy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY5NjgsImV4cCI6MjA5NTYxMjk2OH0.w0JCxkp0GHhwBboSQXYjA3lqUKEWtgbOgq07D554wK8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Request logging
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// ============================================
// HELPERS
// ============================================

function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function buildFullAddress(data) {
    const parts = [
        data.apartment_house,
        data.street_address,
        data.city,
        data.state_province,
        data.postal_code,
        data.country
    ].filter(Boolean);
    return parts.join(', ') || '';
}

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

function formatPhoneToE164(phone) {
    if (!phone || phone === 'N/A') return phone;
    let cleaned = phone.replace(/[^\d]/g, '');
    if (/^01[3-9]/.test(cleaned) && cleaned.length === 11) return '+880' + cleaned.substring(1);
    if (/^8801[3-9]/.test(cleaned) && cleaned.length === 13) return '+' + cleaned;
    if (phone.startsWith('+')) return phone.replace(/[^\d+]/g, '');
    if (/^\d{10,15}$/.test(cleaned)) return '+' + cleaned;
    return phone;
}

function formatPhoneForDisplay(phone) {
    if (!phone || phone === 'N/A') return phone;
    if (phone.startsWith('+880')) return '0' + phone.substring(4);
    return phone;
}

// ============================================
// AUTH ROUTES
// ============================================

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        console.log('📝 Signup request received');
        
        const { 
            email, password, name, full_name, phone,
            country, state_province, city, postal_code,
            street_address, apartment_house, full_address
        } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const displayName = (name || full_name || '').trim();
        if (!displayName || displayName.length < 3) {
            return res.status(400).json({ error: 'Full name is required (minimum 3 characters)' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        // Phone formatting
        const formattedPhone = formatPhoneToE164(phone);
        console.log('📱 Phone:', formattedPhone);

        // Build complete address
        const completeAddress = (full_address || buildFullAddress({
            apartment_house: apartment_house || '',
            street_address: street_address || '',
            city: city || '',
            state_province: state_province || '',
            postal_code: postal_code || '',
            country: country || ''
        })).trim();

        console.log('📍 Address:', completeAddress);

        // ✅ ADDRESS LENGTH CHECK (SQL trigger requirement)
        if (!completeAddress || completeAddress.length < 10) {
            return res.status(400).json({ 
                error: 'Please provide a complete address (minimum 10 characters). Include street, city, and country.' 
            });
        }

        // Supabase signup
        console.log('🔐 Calling Supabase signup...');
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: displayName,
                    name: displayName,
                    phone: formattedPhone || 'N/A',
                    country: country || null,
                    state_province: state_province || null,
                    city: city || null,
                    postal_code: postal_code || null,
                    street_address: street_address || null,
                    apartment_house: apartment_house || null,
                    full_address: completeAddress,
                    address: completeAddress
                }
            }
        });

        if (error) {
            console.error('❌ Supabase error:', error.message);
            if (error.message.includes('already registered') || error.message.includes('already exists')) {
                return res.status(400).json({ error: 'This email is already registered. Please login instead.' });
            }
            if (error.message.includes('rate limit') || error.message.includes('Too many')) {
                return res.status(429).json({ error: 'Too many attempts. Please wait and try again.' });
            }
            return res.status(400).json({ error: error.message });
        }

        console.log('✅ Auth user created:', data.user?.id);

        // Fetch JBYN-OneID (with retry)
        let jbyn_oneid = null;
        let profile = null;
        
        if (data.user) {
            // Wait for trigger to complete
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('jbyn_oneid, contact_privacy, allow_search')
                .eq('id', data.user.id)
                .single();
            
            if (profileData) {
                jbyn_oneid = profileData.jbyn_oneid;
                profile = profileData;
                console.log('🆔 JBYN-OneID:', jbyn_oneid);
            } else {
                // Retry once
                console.warn('⚠️ Profile not found, retrying...');
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const { data: retryData } = await supabase
                    .from('profiles')
                    .select('jbyn_oneid, contact_privacy, allow_search')
                    .eq('id', data.user.id)
                    .single();
                
                if (retryData) {
                    jbyn_oneid = retryData.jbyn_oneid;
                    profile = retryData;
                    console.log('🆔 JBYN-OneID (retry):', jbyn_oneid);
                } else {
                    console.warn('⚠️ Profile still not found after retry');
                }
            }
        }

        console.log('✅ Signup complete');
        res.status(201).json({
            message: 'Registration successful! Please check your email for verification.',
            user: data.user,
            session: data.session,
            jbyn_oneid: jbyn_oneid,
            profile: profile
        });

    } catch (err) {
        console.error('💥 Signup error:', err.message);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// Login
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
            profile: profile || null,
            jbyn_oneid: profile?.jbyn_oneid || null
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// Logout
app.post('/api/auth/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

// Get current user
app.get('/api/auth/user', async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return res.status(401).json({ error: 'Not authenticated' });

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
// PROFILE ROUTES
// ============================================

// Get own profile
app.get('/api/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { data, error } = await supabase.rpc('get_my_profile');
        
        if (error) {
            const { data: profile, error: fallbackError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (fallbackError) return res.status(404).json({ error: 'Profile not found' });
            return res.json({ profile, jbyn_oneid: profile.jbyn_oneid });
        }

        res.json({ profile: data, jbyn_oneid: data?.[0]?.jbyn_oneid || null });

    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Search user by OneID
app.get('/api/profile/:oneid', async (req, res) => {
    try {
        const { oneid } = req.params;
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { data, error } = await supabase.rpc('search_user_by_oneid', { lookup_oneid: oneid });
        if (error) return res.status(404).json({ error: error.message || 'User not found' });

        res.json({ user: data?.[0] || null, access_level: data?.[0]?.access_level || 'public' });

    } catch (err) {
        console.error('OneID search error:', err);
        res.status(500).json({ error: 'Failed to search user' });
    }
});

// Lookup user by OneID (privacy-aware)
app.post('/api/profile/lookup', async (req, res) => {
    try {
        const { oneid } = req.body;
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });
        if (!oneid) return res.status(400).json({ error: 'OneID is required' });

        const { data, error } = await supabase.rpc('lookup_user_by_oneid', { lookup_oneid: oneid });
        if (error) return res.status(404).json({ error: error.message || 'User not found' });

        res.json({ user: data?.[0] || null });

    } catch (err) {
        console.error('OneID lookup error:', err);
        res.status(500).json({ error: 'Failed to lookup user' });
    }
});

// Check if OneID exists
app.get('/api/profile/check/:oneid', async (req, res) => {
    try {
        const { oneid } = req.params;
        const { data, error } = await supabase.rpc('profile_exists', { lookup_oneid: oneid });
        if (error) return res.status(400).json({ error: error.message });
        res.json({ exists: data || false });
    } catch (err) {
        console.error('Profile check error:', err);
        res.status(500).json({ error: 'Failed to check profile' });
    }
});

// Update profile
app.put('/api/auth/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { 
            name, full_name, phone, country, state_province, city,
            postal_code, street_address, apartment_house, avatar_url,
            contact_privacy, allow_search
        } = req.body;

        const displayName = (name || full_name || '').trim();
        if (displayName && displayName.length < 3) {
            return res.status(400).json({ error: 'Name must be at least 3 characters' });
        }

        if (phone) {
            const cleanedPhone = phone.replace(/[^\d+]/g, '');
            if (!/^\+[1-9]\d{6,14}$/.test(cleanedPhone) && !/^01[3-9]\d{8}$/.test(cleanedPhone)) {
                return res.status(400).json({ error: 'Invalid phone format. Use E.164: +8801XXXXXXXXX or 01XXXXXXXXX' });
            }
        }

        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!existingProfile) return res.status(404).json({ error: 'Profile not found' });

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

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single();

        if (error) return res.status(500).json({ error: error.message });

        res.json({ message: 'Profile updated successfully', profile: data, jbyn_oneid: data.jbyn_oneid });

    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update privacy settings
app.put('/api/profile/privacy', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { privacy_level, allow_search } = req.body;

        const { data, error } = await supabase.rpc('update_privacy_settings', {
            p_privacy_level: privacy_level || null,
            p_allow_search: allow_search !== undefined ? allow_search : null
        });

        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Privacy settings updated', success: data });

    } catch (err) {
        console.error('Privacy update error:', err);
        res.status(500).json({ error: 'Failed to update privacy settings' });
    }
});

// Get JBYN-OneID
app.get('/api/auth/passkey', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('jbyn_oneid')
            .eq('id', user.id)
            .single();

        if (error || !profile) return res.status(404).json({ error: 'Profile not found' });

        res.json({ jbyn_oneid: profile.jbyn_oneid });

    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve OneID' });
    }
});

// Soft delete account
app.delete('/api/auth/profile', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { reason } = req.body;

        const { data, error } = await supabase.rpc('soft_delete_user', {
            p_user_id: user.id,
            p_reason: reason || 'User requested deletion'
        });

        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Account scheduled for deletion. You have 30 days to restore it.', success: data });

    } catch (err) {
        console.error('Delete account error:', err);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// Restore account
app.post('/api/auth/profile/restore', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { data, error } = await supabase.rpc('restore_user', { p_user_id: user.id });

        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: 'Account restored successfully', success: data });

    } catch (err) {
        console.error('Restore account error:', err);
        res.status(500).json({ error: 'Failed to restore account' });
    }
});

// Forgot password
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

// Reset password
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
// ADMIN ROUTES
// ============================================

// Admin: Full user lookup
app.get('/api/admin/user/:oneid', async (req, res) => {
    try {
        const { oneid } = req.params;
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { data, error } = await supabase.rpc('admin_lookup_user', { lookup_oneid: oneid });
        if (error) return res.status(403).json({ error: error.message || 'Admin access required' });

        res.json({ user: data?.[0] || null });

    } catch (err) {
        console.error('Admin lookup error:', err);
        res.status(500).json({ error: 'Failed to lookup user' });
    }
});

// Admin: System health
app.get('/api/admin/health', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { data, error } = await supabase.rpc('get_system_health');
        if (error) return res.status(403).json({ error: 'Admin access required' });

        res.json({ health: data || [] });

    } catch (err) {
        console.error('Health check error:', err);
        res.status(500).json({ error: 'Failed to get system health' });
    }
});

// Admin: GDPR compliance
app.get('/api/admin/gdpr', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return res.status(401).json({ error: 'Not authenticated' });

        const { data, error } = await supabase.rpc('check_gdpr_compliance');
        if (error) return res.status(403).json({ error: 'Admin access required' });

        res.json({ compliance: data || [] });

    } catch (err) {
        console.error('GDPR check error:', err);
        res.status(500).json({ error: 'Failed to check GDPR compliance' });
    }
});

// ============================================
// PRODUCT ROUTES
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
            .select(`*, categories:category_id (name), subcategories:subcategory_id (name)`)
            .order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        
        const product = data.find(p => (p.slug || createSlug(p.title)) === slug);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        
        res.json(formatProduct(product));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

app.post('/api/submit-review', async (req, res) => {
    try {
        const { product_id, user_name, rating, review_text } = req.body;
        if (!product_id || !rating || !review_text) return res.status(400).json({ error: 'Missing fields' });
        const { data, error } = await supabase.from('product_reviews').insert([{ product_id, user_name: user_name || 'Guest User', rating: parseInt(rating), review_text }]);
        if (error) return res.status(500).json({ error: error.message });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// CATEGORY ROUTES
// ============================================

app.get('/api/categories', async (req, res) => {
    try {
        const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        const categoriesWithSlugs = data.map(cat => ({ ...cat, slug: cat.slug ? cat.slug.replace(/^category\//, '') : createSlug(cat.name) }));
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
        const category = data.find(cat => { const dbSlug = cat.slug || createSlug(cat.name); return dbSlug.replace(/^category\//, '') === slug; });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json({ ...category, slug: category.slug ? category.slug.replace(/^category\//, '') : createSlug(category.name) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/categories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true);
        const category = categories.find(cat => { const dbSlug = cat.slug || createSlug(cat.name); return dbSlug.replace(/^category\//, '') === slug; });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        const { data, error } = await supabase.from('products').select(`*, categories:category_id (name), subcategories:subcategory_id (name)`).eq('category_id', category.id).order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(formatProducts(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// SUBCATEGORY ROUTES
// ============================================

app.get('/api/subcategories', async (req, res) => {
    try {
        const { category_slug } = req.query;
        let query = supabase.from('subcategories').select('*, categories(name, id, slug)').eq('is_active', true).order('sort_order', { ascending: true });
        if (category_slug) {
            const { data: categories } = await supabase.from('categories').select('id, slug').eq('is_active', true);
            const category = categories.find(cat => { const dbSlug = cat.slug || createSlug(cat.name); return dbSlug.replace(/^category\//, '') === category_slug; });
            if (category) query = query.eq('category_id', category.id);
            else return res.status(404).json({ error: 'Category not found' });
        }
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        const subcategoriesWithSlugs = data.map(sub => ({ ...sub, slug: sub.slug ? sub.slug.replace(/^category\/[^/]+\//, '') : createSlug(sub.name), category_slug: sub.categories ? sub.categories.name : '' }));
        res.json(subcategoriesWithSlugs);
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
        let subcategory = data.find(sub => { const dbSlug = sub.slug || createSlug(sub.name); return dbSlug.replace(/^category\/[^/]+\//, '') === slug; });
        if (category_slug && subcategory) {
            const catSlug = subcategory.categories?.slug || createSlug(subcategory.categories?.name || '');
            if (catSlug.replace(/^category\//, '') !== category_slug) subcategory = null;
        }
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        res.json({ ...subcategory, slug: subcategory.slug ? subcategory.slug.replace(/^category\/[^/]+\//, '') : createSlug(subcategory.name), category_slug: subcategory.categories ? subcategory.categories.name : '' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/subcategories/:slug/products', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data: subcategories } = await supabase.from('subcategories').select('*').eq('is_active', true);
        const subcategory = subcategories.find(sub => { const dbSlug = sub.slug || createSlug(sub.name); return dbSlug.replace(/^category\/[^/]+\//, '') === slug; });
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        const { data, error } = await supabase.from('products').select(`*, categories:category_id (name), subcategories:subcategory_id (name)`).eq('subcategory_id', subcategory.id).order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(formatProducts(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// MENU ROUTES
// ============================================

app.get('/api/menu', async (req, res) => {
    try {
        const { data, error } = await supabase.from('menu_items').select(`*, categories:category_id (id, name), subcategories:subcategory_id (id, name)`).eq('is_active', true).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        const buildMenuTree = (items, parentId = null) => items.filter(item => item.parent_id === parentId).map(item => ({ ...item, slug: createSlug(item.title), category_slug: item.categories ? createSlug(item.categories.name) : null, subcategory_slug: item.subcategories ? createSlug(item.subcategories.name) : null, children: buildMenuTree(items, item.id) }));
        res.json(buildMenuTree(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/menu-items', async (req, res) => {
    try {
        const { data, error } = await supabase.from('menu_items').select(`*, categories:category_id (id, name), subcategories:subcategory_id (id, name)`).eq('is_active', true).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data.map(item => ({ ...item, slug: createSlug(item.title), category_slug: item.categories ? createSlug(item.categories.name) : null, subcategory_slug: item.subcategories ? createSlug(item.subcategories.name) : null })));
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
        res.json({ ...menuItem, slug: createSlug(menuItem.title), category_slug: menuItem.categories ? createSlug(menuItem.categories.name) : null, subcategory_slug: menuItem.subcategories ? createSlug(menuItem.subcategories.name) : null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// HERO & NEWS ROUTES
// ============================================

app.get('/api/hero', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hero').select('*').order('created_at', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hero-videos', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hero_videos').select('*').eq('is_active', true).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hero-secondary', async (req, res) => {
    try {
        const { data, error } = await supabase.from('hero_secondary').select('*').eq('is_active', true).order('sort_order', { ascending: true });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/news', async (req, res) => {
    try {
        const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ============================================
// PAGE ROUTES
// ============================================

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'signup.html')));
app.get('/reset-password', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'reset-password.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'profile.html')));
app.get('/account', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'account.html')));
app.get('/category/:slug*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'category.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
    console.error('💥 Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
