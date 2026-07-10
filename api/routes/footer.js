// ============================================
// routes/footer.js - Footer Routes
// jayenwareinc/api/routes/footer.js
// ============================================

const express = require('express');
const router = express.Router();

// ============================================
// FOOTER CONTENT ROUTES
// ============================================

// Get all footer content
router.get('/footer-content', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_content')
            .select('*')
            .eq('is_active', true);
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get footer content by section name
router.get('/footer-content/:section', async (req, res) => {
    try {
        const { section } = req.params;
        const { data, error } = await req.app.locals.supabase
            .from('footer_content')
            .select('*')
            .eq('section_name', section)
            .eq('is_active', true)
            .single();
        
        if (error) {
            // If no data found, return null instead of error
            if (error.code === 'PGRST116') return res.json(null);
            return res.status(500).json({ error: error.message });
        }
        res.json(data || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// FOOTER SOCIAL LINKS
// ============================================
router.get('/footer/social-links', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_social_links')
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
// FOOTER MENUS WITH QUICK LINKS
// ============================================
router.get('/footer/menus', async (req, res) => {
    try {
        // Fetch menus and links in parallel
        const [menuResult, linkResult] = await Promise.all([
            req.app.locals.supabase
                .from('footer_menus')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true }),
            req.app.locals.supabase
                .from('footer_quick_links')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true })
        ]);
        
        if (menuResult.error) return res.status(500).json({ error: menuResult.error.message });
        if (linkResult.error) return res.status(500).json({ error: linkResult.error.message });
        
        const menus = menuResult.data || [];
        const links = linkResult.data || [];
        
        // Attach links to their respective menus
        const menuWithLinks = menus.map(menu => ({
            ...menu,
            links: links.filter(link => link.menu_id === menu.id)
        }));
        
        res.json(menuWithLinks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// FOOTER QUICK LINKS
// ============================================
router.get('/footer/quick-links', async (req, res) => {
    try {
        const { menu_id } = req.query;
        
        let query = req.app.locals.supabase
            .from('footer_quick_links')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        // Optional filter by menu_id
        if (menu_id) {
            query = query.eq('menu_id', menu_id);
        }
        
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// FOOTER PAYMENT METHODS
// ============================================
router.get('/footer/payment-methods', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_payment_methods')
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
// FOOTER SHIPPING PARTNERS
// ============================================
router.get('/footer/shipping-partners', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_shipping_partners')
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
// FOOTER CERTIFICATIONS
// ============================================
router.get('/footer/certifications', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_certifications')
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
// FOOTER APP LINKS
// ============================================
router.get('/footer/app-links', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_app_links')
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
// FOOTER COUNTRY SELECTOR
// ============================================

// Get all active countries
router.get('/footer/countries', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_country_selector')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        res.json(data || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get default country
router.get('/footer/default-country', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_country_selector')
            .select('*')
            .eq('is_active', true)
            .eq('is_default', true)
            .single();
        
        if (error) {
            // If no default country found, return null
            if (error.code === 'PGRST116') return res.json(null);
            return res.status(500).json({ error: error.message });
        }
        res.json(data || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// FOOTER TRUST BADGES
// ============================================
router.get('/footer/trust-badges', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_trust_badges')
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
// FOOTER SETTINGS
// ============================================
router.get('/footer/settings', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('footer_settings')
            .select('*')
            .eq('is_active', true)
            .single();
        
        if (error) {
            // If no settings found, return null
            if (error.code === 'PGRST116') return res.json(null);
            return res.status(500).json({ error: error.message });
        }
        res.json(data || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================
// COMPLETE FOOTER DATA (ALL COMPONENTS)
// ============================================
router.get('/footer/complete', async (req, res) => {
    try {
        // Fetch all footer data in parallel
        const [
            contentResult,
            socialLinksResult,
            menusResult,
            quickLinksResult,
            paymentMethodsResult,
            shippingPartnersResult,
            certificationsResult,
            appLinksResult,
            countriesResult,
            trustBadgesResult,
            settingsResult
        ] = await Promise.all([
            req.app.locals.supabase.from('footer_content').select('*').eq('is_active', true),
            req.app.locals.supabase.from('footer_social_links').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
            req.app.locals.supabase.from('footer_menus').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
            req.app.locals.supabase.from('footer_quick_links').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
            req.app.locals.supabase.from('footer_payment_methods').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
            req.app.locals.supabase.from('footer_shipping_partners').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
            req.app.locals.supabase.from('footer_certifications').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
            req.app.locals.supabase.from('footer_app_links').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
            req.app.locals.supabase.from('footer_country_selector').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
            req.app.locals.supabase.from('footer_trust_badges').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
            req.app.locals.supabase.from('footer_settings').select('*').eq('is_active', true).single()
        ]);

        // Build menu with links
        const menus = menusResult.data || [];
        const quickLinks = quickLinksResult.data || [];
        
        const menuWithLinks = menus.map(menu => ({
            ...menu,
            links: quickLinks.filter(link => link.menu_id === menu.id)
        }));

        // Return complete footer object
        res.json({
            content: contentResult.data || [],
            socialLinks: socialLinksResult.data || [],
            menus: menuWithLinks,
            paymentMethods: paymentMethodsResult.data || [],
            shippingPartners: shippingPartnersResult.data || [],
            certifications: certificationsResult.data || [],
            appLinks: appLinksResult.data || [],
            countries: countriesResult.data || [],
            trustBadges: trustBadgesResult.data || [],
            settings: settingsResult.data || null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
