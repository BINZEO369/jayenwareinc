// ============================================
// routes/content.js - Content Routes
// jayenwareinc/api/routes/content.js
// ============================================

const express = require('express');
const router = express.Router();

// ============================================
// NEWS ROUTES
// ============================================

// Get all news
router.get('/news', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// STORY ROUTES (আমাদের গল্প)
// ============================================

// Get all active stories
router.get('/stories', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('story')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single story by ID
router.get('/stories/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await req.app.locals.supabase
            .from('story')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: 'Story not found' });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// ANNOUNCEMENT BAR ROUTES
// ============================================

// Get active announcement (latest one within date range)
router.get('/announcement', async (req, res) => {
    try {
        const now = new Date().toISOString();
        
        const { data, error } = await req.app.locals.supabase
            .from('announcement_bar')
            .select('*')
            .eq('is_active', true)
            .lte('start_date', now)
            .gte('end_date', now)
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error) return res.status(500).json({ error: error.message });
        
        // Return first active announcement or null
        res.json(data && data.length > 0 ? data[0] : null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all active announcements
router.get('/announcements', async (req, res) => {
    try {
        const now = new Date().toISOString();
        
        const { data, error } = await req.app.locals.supabase
            .from('announcement_bar')
            .select('*')
            .eq('is_active', true)
            .lte('start_date', now)
            .gte('end_date', now)
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// ABOUT US ROUTES (আমাদের সম্পর্কে)
// ============================================

// Get all active about us entries
router.get('/about-us/all', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('about_us')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single about us entry by ID
router.get('/about-us/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Skip if id is "all" (handled by route above)
        if (id === 'all') return;

        const { data, error } = await req.app.locals.supabase
            .from('about_us')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error) return res.status(500).json({ error: error.message });
        if (!data) return res.status(404).json({ error: 'About Us entry not found' });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
