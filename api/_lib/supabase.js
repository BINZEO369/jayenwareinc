// ============================================
// api/_lib/supabase.js
// Supabase Client & Helper Functions
// ============================================

const { createClient } = require('@supabase/supabase-js');

// Supabase Configuration
const SUPABASE_URL = "https://kfncdapeswlnwsackkdy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbmNkYXBlc3dsbndzYWNra2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzY5NjgsImV4cCI6MjA5NTYxMjk2OH0.w0JCxkp0GHhwBboSQXYjA3lqUKEWtgbOgq07D554wK8";

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Create slug from string
function createSlug(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
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

// Format multiple products
function formatProducts(products) {
    if (!products) return [];
    return products.map(formatProduct);
}

module.exports = {
    supabase,
    createSlug,
    formatProduct,
    formatProducts
};
