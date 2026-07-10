// api/news.js
const express = require('express');
const { supabase } = require('./_lib/supabase');
const { setupMiddleware } = require('./_lib/middleware');

const app = express();
setupMiddleware(app);

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

module.exports = app;
