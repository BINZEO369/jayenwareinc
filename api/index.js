// ============================================
// server.js - Complete API Server
// JBYN-OneID Global Profile System
// Supabase Integrated | Production Ready
// Enhanced Error Handling & Notifications
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
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDAzNjk2OCwiZXhwIjoyMDk1NjEyOTY4fQ.Eh6CdjVYOHiWLqZSBUNPXfndoksbM3NoZQSHT5PNsZQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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
        data.country
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

// Format phone number (direct number format)
function formatPhoneNumber(phone) {
    if (!phone || phone === 'N/A') return phone;
    
    // Remove all non-digit characters
    let cleaned = phone.replace(/[^\d]/g, '');
    
    return cleaned;
}

// Validate phone format (6-15 digits)
function isValidPhone(phone) {
    return phone === 'N/A' || /^[0-9]{6,15}$/.test(phone);
}

// Validate JBYN-OneID format
function isValidOneID(oneid) {
    return /^JBYN-OneID-[A-Z0-9]{12}$/.test(oneid);
}

// Get authenticated user helper
async function getAuthenticatedUser(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { user: null, error: 'No authorization token provided' };
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    return { user, error };
}

// Helper function to extract meaningful error message
function extractErrorMessage(err) {
    if (typeof err === 'string') return err;
    if (err.message) return err.message;
    if (err.details) return err.details;
    if (err.hint) return err.hint;
    if (err.error_description) return err.error_description;
    return 'An unexpected error occurred';
}

// ============================================
// AUTHENTICATION API ROUTES
// ============================================

// SIGNUP - Professional Signup with full address
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

        console.log('Signup request received:', { email, name, hasPhone: !!phone, country });

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required',
                field: !email ? 'email' : 'password'
            });
        }

        if (!name || name.trim().length < 3) {
            return res.status(400).json({
                error: 'Full name is required (minimum 3 characters)',
                field: 'name'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters',
                field: 'password'
            });
        }

        // Phone formatting and validation
        const formattedPhone = formatPhoneNumber(phone);
        if (phone && !isValidPhone(formattedPhone)) {
            return res.status(400).json({
                error: 'Invalid phone format. Enter 6-15 digits without country code',
                field: 'phone'
            });
        }

        // Build complete address
        const fullAddress = buildFullAddress({
            apartment_house: apartment_house || '',
            street_address: street_address || '',
            city: city || '',
            state_province: state_province || '',
            postal_code: postal_code || '',
            country: country || ''
        });

        if (!fullAddress || fullAddress.length < 10) {
            return res.status(400).json({
                error: 'Please provide complete address details (minimum 10 characters)',
                field: 'address'
            });
        }

        // Prepare user metadata
        const userMetadata = {
            full_name: name.trim(),
            phone: formattedPhone || 'N/A',
            country: country || null,
            state_province: state_province || null,
            city: city || null,
            postal_code: postal_code || null,
            street_address: street_address || null,
            apartment_house: apartment_house || null,
            full_address: fullAddress
        };

        console.log('Attempting Supabase signup with metadata:', userMetadata);

        // Supabase signup with user_metadata
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userMetadata
            }
        });

        if (signUpError) {
            console.error('Supabase signup error:', signUpError);
            
            if (signUpError.message && signUpError.message.includes('already registered')) {
                return res.status(400).json({ 
                    error: 'This email is already registered. Please login instead.',
                    code: 'EMAIL_EXISTS'
                });
            }
            
            return res.status(400).json({ 
                error: extractErrorMessage(signUpError),
                code: signUpError.code || 'SIGNUP_FAILED'
            });
        }

        console.log('Supabase signup successful, user ID:', signUpData.user?.id);

        // Wait briefly for database trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get generated OneID and notifications from profile
        let oneid = null;
        let notifications = [];
        let profileData = null;

        if (signUpData.user) {
            // Retry profile fetch (up to 3 times with delay) - USING supabaseAdmin
            for (let attempt = 0; attempt < 3; attempt++) {
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('jbyn_oneid, is_verified, name, email')
                    .eq('id', signUpData.user.id)
                    .single();
                
                if (profile) {
                    profileData = profile;
                    oneid = profile.jbyn_oneid || null;
                    console.log('Profile found on attempt', attempt + 1, ':', oneid);
                    break;
                }
                
                console.log('Profile not found, retrying... attempt', attempt + 1);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Get notifications if profile exists - USING supabaseAdmin
            if (profileData) {
                const { data: userNotifications } = await supabaseAdmin
                    .from('profile_notifications')
                    .select('*')
                    .eq('user_id', signUpData.user.id)
                    .eq('is_read', false)
                    .order('created_at', { ascending: false })
                    .limit(5);
                
                notifications = userNotifications || [];
                console.log('Notifications fetched:', notifications.length);
            } else {
                console.warn('Profile not found after retries, checking error logs...');
                
                // Check error logs - USING supabaseAdmin
                const { data: errorLogs } = await supabaseAdmin
                    .from('profile_creation_errors')
                    .select('*')
                    .eq('user_id', signUpData.user.id)
                    .order('created_at', { ascending: false })
                    .limit(1);
                
                if (errorLogs && errorLogs.length > 0) {
                    console.error('Profile creation error found:', errorLogs[0].error_message);
                    return res.status(500).json({
                        error: 'Profile creation failed: ' + errorLogs[0].error_message,
                        code: 'PROFILE_CREATION_FAILED'
                    });
                }
            }
        }

        res.status(201).json({
            message: 'Registration successful! Please check your email for verification.',
            user: signUpData.user,
            session: signUpData.session,
            jbyn_oneid: oneid,
            profile: profileData,
            notifications: notifications
        });

    } catch (err) {
        console.error('Signup error details:', {
            message: err.message,
            stack: err.stack?.split('\n').slice(0, 3).join('\n'),
            code: err.code,
            details: err.details,
            hint: err.hint
        });
        
        const errorMessage = extractErrorMessage(err);
        
        res.status(500).json({ 
            error: errorMessage,
            code: err.code || 'SERVER_ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

// LOGIN
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

        // Fetch complete profile data - USING supabaseAdmin
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        // Get unread notifications - USING supabaseAdmin
        const { data: notifications } = await supabaseAdmin
            .from('profile_notifications')
            .select('*')
            .eq('user_id', data.user.id)
            .eq('is_read', false)
            .order('created_at', { ascending: false })
            .limit(10);

        // Get unread notification count - USING supabaseAdmin
        const { count: unreadCount } = await supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', data.user.id)
            .eq('is_read', false);

        res.json({
            message: 'Login successful!',
            user: data.user,
            session: data.session,
            profile: profile || null,
            notifications: notifications || [],
            unread_notifications_count: unreadCount || 0
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
        
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

// GET CURRENT USER SESSION
app.get('/api/auth/user', async (req, res) => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Complete profile fetch - USING supabaseAdmin
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return res.status(500).json({ error: profileError.message });
        }

        res.json({
            user,
            profile: profile || null
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

// UPDATE PROFILE
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
            avatar_url
        } = req.body;

        // Validate name
        if (name && name.trim().length < 3) {
            return res.status(400).json({ error: 'Name must be at least 3 characters' });
        }

        // Validate phone format
        if (phone) {
            const formattedPhone = formatPhoneNumber(phone);
            if (!isValidPhone(formattedPhone)) {
                return res.status(400).json({ error: 'Invalid phone format. Enter 6-15 digits' });
            }
        }

        // Build update data
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (phone) updateData.phone = formatPhoneNumber(phone);
        if (country !== undefined) updateData.country = country;
        if (state_province !== undefined) updateData.state_province = state_province;
        if (city !== undefined) updateData.city = city;
        if (postal_code !== undefined) updateData.postal_code = postal_code;
        if (street_address !== undefined) updateData.street_address = street_address;
        if (apartment_house !== undefined) updateData.apartment_house = apartment_house;
        if (avatar_url) updateData.avatar_url = avatar_url;

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Get updated notifications - USING supabaseAdmin
        const { data: notifications } = await supabaseAdmin
            .from('profile_notifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_read', false)
            .order('created_at', { ascending: false })
            .limit(5);

        res.json({
            message: 'Profile updated successfully',
            profile: data,
            notifications: notifications || []
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
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('jbyn_oneid')
            .eq('id', user.id)
            .single();

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            jbyn_oneid: profile.jbyn_oneid
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve OneID' });
    }
});

// FORGOT PASSWORD
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

// RESET PASSWORD
app.put('/api/auth/reset-password', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters' 
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

// DELETE ACCOUNT (Soft Delete)
app.post('/api/auth/delete-account', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { reason } = req.body;

        const { data, error } = await supabase
            .rpc('soft_delete_user', {
                p_user_id: user.id,
                p_reason: reason || 'User requested deletion'
            });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Sign out after soft delete
        await supabase.auth.signOut();

        res.json({
            message: 'Account deletion requested. Your account will be permanently deleted after 30 days.',
            success: data
        });

    } catch (err) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

// ============================================
// NOTIFICATION API ROUTES
// ============================================

// Get all user notifications (paginated)
app.get('/api/notifications', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const filter = req.query.filter || 'all';
        const type = req.query.type || 'all';

        let query = supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id);

        if (filter === 'unread') {
            query = query.eq('is_read', false);
        } else if (filter === 'read') {
            query = query.eq('is_read', true);
        }

        if (type !== 'all') {
            query = query.eq('notification_type', type);
        }

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const { count: unreadCount } = await supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        res.json({
            notifications: data || [],
            total: count || 0,
            page: page,
            limit: limit,
            totalPages: Math.ceil((count || 0) / limit),
            unreadCount: unreadCount || 0,
            filters: { filter, type }
        });

    } catch (err) {
        console.error('Get notifications error:', err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Get unread notifications only
app.get('/api/notifications/unread', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { data, error } = await supabaseAdmin
            .from('profile_notifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_read', false)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const { count: unreadCount } = await supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        res.json({
            notifications: data || [],
            unreadCount: unreadCount || 0
        });

    } catch (err) {
        console.error('Get unread notifications error:', err);
        res.status(500).json({ error: 'Failed to fetch unread notifications' });
    }
});

// Get notification count
app.get('/api/notifications/count', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { count: totalCount } = await supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        const { count: unreadCount } = await supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        const { count: successCount } = await supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('notification_type', 'success');

        const { count: errorCount } = await supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('notification_type', 'error');

        const { count: warningCount } = await supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('notification_type', 'warning');

        const { count: infoCount } = await supabaseAdmin
            .from('profile_notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('notification_type', 'info');

        res.json({
            total: totalCount || 0,
            unread: unreadCount || 0,
            success: successCount || 0,
            error: errorCount || 0,
            warning: warningCount || 0,
            info: infoCount || 0
        });

    } catch (err) {
        console.error('Get notification count error:', err);
        res.status(500).json({ error: 'Failed to fetch notification count' });
    }
});

// Mark single notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const notificationId = parseInt(req.params.id);

        const { data, error } = await supabaseAdmin
            .from('profile_notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.json({
            message: 'Notification marked as read',
            notification: data
        });

    } catch (err) {
        console.error('Mark notification read error:', err);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// Mark all notifications as read
app.put('/api/notifications/read-all', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { error } = await supabaseAdmin
            .from('profile_notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({
            message: 'All notifications marked as read',
            success: true
        });

    } catch (err) {
        console.error('Mark all notifications read error:', err);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
});

// Delete single notification
app.delete('/api/notifications/:id', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const notificationId = parseInt(req.params.id);

        const { error } = await supabaseAdmin
            .from('profile_notifications')
            .delete()
            .eq('id', notificationId)
            .eq('user_id', user.id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({
            message: 'Notification deleted successfully',
            success: true
        });

    } catch (err) {
        console.error('Delete notification error:', err);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

// Delete all notifications
app.delete('/api/notifications', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const filter = req.query.filter || 'all';

        let query = supabaseAdmin
            .from('profile_notifications')
            .delete()
            .eq('user_id', user.id);

        if (filter === 'read') {
            query = query.eq('is_read', true);
        }

        const { error } = await query;

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({
            message: filter === 'all' ? 'All notifications deleted' : 'All read notifications deleted',
            success: true
        });

    } catch (err) {
        console.error('Delete all notifications error:', err);
        res.status(500).json({ error: 'Failed to delete notifications' });
    }
});

// ============================================
// OneID LOOKUP & SEARCH API
// ============================================

// Search user by OneID (Privacy-safe - limited info)
app.get('/api/oneid/search/:oneid', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { oneid } = req.params;

        if (!isValidOneID(oneid)) {
            return res.status(400).json({ error: 'Invalid JBYN-OneID format. Use: JBYN-OneID-XXXXXXXXXXXX' });
        }

        const { data, error } = await supabaseAdmin
            .rpc('search_user_by_oneid', {
                lookup_oneid: oneid
            });

        if (error) {
            return res.status(404).json({ error: error.message });
        }

        res.json(data?.[0] || null);

    } catch (err) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Lookup user by OneID (Respects privacy settings)
app.get('/api/oneid/lookup/:oneid', async (req, res) => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { oneid } = req.params;

        if (!isValidOneID(oneid)) {
            return res.status(400).json({ error: 'Invalid JBYN-OneID format' });
        }

        const { data, error } = await supabaseAdmin
            .rpc('lookup_user_by_oneid', {
                lookup_oneid: oneid
            });

        if (error) {
            return res.status(404).json({ error: error.message });
        }

        res.json(data?.[0] || null);

    } catch (err) {
        res.status(500).json({ error: 'Lookup failed' });
    }
});

// Check if OneID exists
app.get('/api/oneid/exists/:oneid', async (req, res) => {
    try {
        const { oneid } = req.params;

        if (!isValidOneID(oneid)) {
            return res.status(400).json({ error: 'Invalid JBYN-OneID format' });
        }

        const { data, error } = await supabaseAdmin
            .rpc('profile_exists', {
                lookup_oneid: oneid
            });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ exists: data });

    } catch (err) {
        res.status(500).json({ error: 'Check failed' });
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

// Submit product review
app.post('/api/submit-review', async (req, res) => {
    try {
        const { product_id, user_name, rating, review_text } = req.body;
        
        if (!product_id || !rating || !review_text) {
            return res.status(400).json({ error: 'Missing required fields' });
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
// PAGE ROUTES
// ============================================

// Auth pages
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

// Notifications page
app.get('/notifications', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'notifications.html'));
});

// Category page (with subcategory support)
app.get('/category/:slug*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'category.html'));
});

// ============================================
// SPA FALLBACK (Must be last)
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
