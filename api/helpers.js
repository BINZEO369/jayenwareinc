// ============================================
// helpers.js - Shared Utility Functions
// jayenwareinc/api/helpers.js
// ============================================

/**
 * Create URL-friendly slug from text
 * @param {string} text - Input text
 * @returns {string} URL-friendly slug
 */
function createSlug(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')     // Remove special characters
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Replace multiple hyphens with single
        .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens
}

/**
 * Format single product with category and subcategory names
 * @param {Object} product - Raw product object from database
 * @returns {Object} Formatted product object
 */
function formatProduct(product) {
    if (!product) return null;
    return {
        ...product,
        category: product.categories?.name || null,
        subcategory: product.subcategories?.name || null
    };
}

/**
 * Format array of products with category and subcategory names
 * @param {Array} products - Array of raw product objects
 * @returns {Array} Array of formatted product objects
 */
function formatProducts(products) {
    if (!products) return [];
    return products.map(formatProduct);
}

/**
 * Clean slug prefix (e.g., "category/shoes" → "shoes")
 * @param {string} slug - Raw slug from database
 * @param {string} prefix - Prefix to remove (e.g., "category/")
 * @returns {string} Cleaned slug
 */
function cleanSlugPrefix(slug, prefix = 'category/') {
    if (!slug) return '';
    return slug.replace(new RegExp(`^${prefix}`), '');
}

module.exports = {
    createSlug,
    formatProduct,
    formatProducts,
    cleanSlugPrefix
};
