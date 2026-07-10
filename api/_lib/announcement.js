// ============================================
// api/announcement.js
// Announcement Bar API
// ============================================

const express = require('express');
const router = express.Router();
const { supabase } = require('./_lib/supabase');

// Get active announcement (সবচেয়ে সক্রিয় একটি)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('announcement_bar')
            .select('*')
            .eq('is_active', true)
            .lte('start_date', new Date().toISOString())
            .gte('end_date', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error) return res.status(500).json({ error: error.message });
        
        // যদি ডাটা থাকে তাহলে প্রথমটি রিটার্ন করবে, নাহলে null
        res.json(data && data.length > 0 ? data[0] : null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all active announcements (একাধিক থাকলে)
router.get('/all', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('announcement_bar')
            .select('*')
            .eq('is_active', true)
            .lte('start_date', new Date().toISOString())
            .gte('end_date', new Date().toISOString())
            .order('created_at', { ascending: false });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
