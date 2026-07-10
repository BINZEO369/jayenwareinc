// ============================================
// routes/pages.js - Static Pages Routes
// jayenwareinc/api/routes/pages.js
// ============================================

const express = require('express');
const router = express.Router();

// ============================================
// GENERIC HANDLER FACTORY
// Creates getAll and getById handlers for any table
// ============================================
function createPageRoutes(tableName, singularName) {
    const routes = {};

    // Get all active entries
    routes.getAll = async (req, res) => {
        try {
            const { data, error } = await req.app.locals.supabase
                .from(tableName)
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (error) return res.status(500).json({ error: error.message });
            res.json(data || []);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Get single entry by ID
    routes.getById = async (req, res) => {
        try {
            const { id } = req.params;
            
            // Skip if id is "all"
            if (id === 'all') return;

            const { data, error } = await req.app.locals.supabase
                .from(tableName)
                .select('*')
                .eq('id', id)
                .eq('is_active', true)
                .single();

            if (error) return res.status(500).json({ error: error.message });
            if (!data) return res.status(404).json({ error: `${singularName} not found` });

            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    return routes;
}

// ============================================
// FAQ ROUTES (প্রশ্ন ও উত্তর)
// ============================================
const faqRoutes = createPageRoutes('faq', 'FAQ');
router.get('/faqs', faqRoutes.getAll);
router.get('/faqs/:id', faqRoutes.getById);

// ============================================
// BLOG ROUTES (ব্লগ)
// ============================================
const blogRoutes = createPageRoutes('blog', 'Blog entry');
router.get('/blog/all', blogRoutes.getAll);
router.get('/blog/:id', blogRoutes.getById);

// ============================================
// SHIPPING POLICY ROUTES (শিপিং নীতি)
// ============================================
const shippingRoutes = createPageRoutes('shipping_policy', 'Shipping policy');
router.get('/shipping-policy/all', shippingRoutes.getAll);
router.get('/shipping-policy/:id', shippingRoutes.getById);

// ============================================
// RETURN POLICY ROUTES (রিটার্ন নীতি)
// ============================================
const returnRoutes = createPageRoutes('return_policy', 'Return policy');
router.get('/return-policy/all', returnRoutes.getAll);
router.get('/return-policy/:id', returnRoutes.getById);

// ============================================
// REFUND POLICY ROUTES (ফেরত নীতি)
// ============================================
const refundRoutes = createPageRoutes('refund_policy', 'Refund policy');
router.get('/refund-policy/all', refundRoutes.getAll);
router.get('/refund-policy/:id', refundRoutes.getById);

// ============================================
// PRIVACY POLICY ROUTES (গোপনীয়তা নীতি)
// ============================================
const privacyRoutes = createPageRoutes('privacy_policy', 'Privacy policy');
router.get('/privacy-policy/all', privacyRoutes.getAll);
router.get('/privacy-policy/:id', privacyRoutes.getById);

// ============================================
// TERMS & CONDITIONS ROUTES (শর্তাবলী)
// ============================================
const termsRoutes = createPageRoutes('terms_conditions', 'Terms entry');
router.get('/terms/all', termsRoutes.getAll);
router.get('/terms/:id', termsRoutes.getById);

// ============================================
// COOKIE POLICY ROUTES (কুকি নীতি)
// ============================================
const cookieRoutes = createPageRoutes('cookie_policy', 'Cookie policy');
router.get('/cookie-policy/all', cookieRoutes.getAll);
router.get('/cookie-policy/:id', cookieRoutes.getById);

// ============================================
// STORE LOCATOR ROUTES (স্টোর লোকেটর)
// ============================================
const storeRoutes = createPageRoutes('store_locator', 'Store locator entry');
router.get('/store-locator/all', storeRoutes.getAll);
router.get('/store-locator/:id', storeRoutes.getById);

module.exports = router;
