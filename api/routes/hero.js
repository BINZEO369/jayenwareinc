// ============================================
// routes/hero.js - Hero Section Routes
// jayenwareinc/api/routes/hero.js
// ============================================

const express = require('express');
const router = express.Router();

// ============================================
// GET HERO SLIDES
// ============================================
// Endpoint: GET /api/hero
// Description: Fetch all hero slides ordered by creation date
// ============================================
router.get('/hero', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('hero')
            .select('*')
            .order('created_at', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// GET HERO VIDEOS
// ============================================
// Endpoint: GET /api/hero-videos
// Description: Fetch all active hero videos ordered by sort order
// ============================================
router.get('/hero-videos', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
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

// ============================================
// GET HERO SECONDARY ITEMS
// ============================================
// Endpoint: GET /api/hero-secondary
// Description: Fetch all active secondary hero items ordered by sort order
// ============================================
router.get('/hero-secondary', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
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

module.exports = router;
