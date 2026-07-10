// ============================================
// routes/menu.js - Menu Routes
// jayenwareinc/api/routes/menu.js
// ============================================

const express = require('express');
const router = express.Router();
const { createSlug } = require('../helpers');

// ============================================
// GET MENU HIERARCHY (TREE STRUCTURE)
// ============================================
// Endpoint: GET /api/menu
// Description: Fetch complete menu as a nested tree structure
// ============================================
router.get('/menu', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('menu_items')
            .select(`
                *,
                categories:category_id (id, name),
                subcategories:subcategory_id (id, name)
            `)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        
        // Recursive function to build menu tree
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

// ============================================
// GET FLAT MENU ITEMS
// ============================================
// Endpoint: GET /api/menu-items
// Description: Fetch all active menu items as a flat list
// ============================================
router.get('/menu-items', async (req, res) => {
    try {
        const { data, error } = await req.app.locals.supabase
            .from('menu_items')
            .select(`
                *,
                categories:category_id (id, name),
                subcategories:subcategory_id (id, name)
            `)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) return res.status(500).json({ error: error.message });
        
        // Format with computed slugs
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

// ============================================
// GET MENU ITEM BY SLUG
// ============================================
// Endpoint: GET /api/menu-items/:slug
// Description: Fetch a single menu item by its slug
// ============================================
router.get('/menu-items/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        
        const { data, error } = await req.app.locals.supabase
            .from('menu_items')
            .select(`
                *,
                categories:category_id (id, name),
                subcategories:subcategory_id (id, name)
            `)
            .eq('is_active', true);
        
        if (error) return res.status(500).json({ error: error.message });
        
        // Find menu item by matching slug
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

module.exports = router;
