// ============================================================================
// components.js - Shared Header, Footer, Common Functions & Glassmorphism UI
// Version: 10.0 (Database-Driven - 10 Tables Integration)
// Brand: JABIYEN (Premium Apparel)
// ============================================================================

let cart = JSON.parse(localStorage.getItem('jabiyen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jabiyen_wish') || '[]');
let allMenuItems = [];
let allCategories = [];
let allSubcategories = [];
let announcementData = null;
let footerData = {
    social_links: [],
    quick_links: [],
    quick_links_tree: [],
    footer_content: [],
    payment_methods: [],
    shipping_partners: [],
    certifications: [],
    app_links: [],
    countries: [],
    trust_badges: [],
    settings: null
};

window.JABIYEN_COMPONENTS_INITIALIZED = window.JABIYEN_COMPONENTS_INITIALIZED || false;

// ============================================================================
// FONT CONFIGURATION LOADER
// ============================================================================
function loadFontsConfiguration() {
    if (!window.JABIYEN_FONTS) {
        const script = document.createElement('script');
        script.src = '/fonts.js';
        script.async = false;
        script.onload = () => { applyFontVariables(); };
        document.head.appendChild(script);
    } else {
        applyFontVariables();
    }
}

function applyFontVariables() {
    const fonts = window.JABIYEN_FONTS;
    if (!fonts) return;
    const root = document.documentElement;
    const vars = fonts.cssVariables;
    for (const [key, value] of Object.entries(vars)) {
        root.style.setProperty(key, value);
    }
    root.style.setProperty('--font-heading', fonts.families.heading || 'Manrope, sans-serif');
    root.style.setProperty('--font-subtitle', fonts.families.subtitle || 'Sora, sans-serif');
    root.style.setProperty('--font-body', fonts.families.body || 'Inter, sans-serif');
}

// ============================================================================
// API FETCH FUNCTIONS
// ============================================================================
async function fetchAnnouncement() {
    try {
        const response = await fetch('/api/announcement');
        if (!response.ok) throw new Error('Failed to fetch announcement');
        announcementData = await response.json();
        return announcementData;
    } catch (error) {
        console.error('Announcement fetch error:', error);
        return null;
    }
}

async function fetchFooterData() {
    try {
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error('Failed to fetch footer data');
        footerData = await response.json();
        return footerData;
    } catch (error) {
        console.error('Footer data fetch error:', error);
        return null;
    }
}

async function fetchMenuItems() {
    try {
        const response = await fetch('/api/menu-items');
        if (!response.ok) throw new Error('Failed to fetch menu pipeline');
        allMenuItems = await response.json();
        return allMenuItems;
    } catch (error) {
        console.error('Menu infrastructure error:', error);
        return [];
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        allCategories = await response.json();
        return allCategories;
    } catch (error) {
        console.error('Category framework error:', error);
        return [];
    }
}

async function fetchSubcategories() {
    try {
        const response = await fetch('/api/subcategories');
        if (!response.ok) throw new Error('Failed to fetch subcategories');
        allSubcategories = await response.json();
        return allSubcategories;
    } catch (error) {
        console.error('Subcategory architecture error:', error);
        return [];
    }
}

// ============================================================================
// SHARED CSS STYLES
// ============================================================================
function injectSharedStyles() {
    if (document.getElementById("shared-components-style")) return;

    const styles = `
    <style id="shared-components-style">
        :root {
            --primary: #000000;
            --accent: #ffffff;
            --glass-white: rgba(255, 255, 255, 0.15);
            --glass-white-thick: rgba(255, 255, 255, 0.7);
            --glass-black: rgba(0, 0, 0, 0.6);
            --glass-black-thick: rgba(0, 0, 0, 0.82);
            --glass-border-light: rgba(255, 255, 255, 0.2);
            --glass-border-dark: rgba(0, 0, 0, 0.06);
            --glass-border-inline: rgba(255, 255, 255, 0.15);
            --glass-blur: blur(25px) saturate(200%);
            --bar-height: 36px;
        }
        
        html, body {
            overflow-x: hidden !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important; 
            padding: 0 !important;
            box-sizing: border-box;
        }
        
        *, *:before, *:after { box-sizing: inherit; }
        
        /* ==================== TYPOGRAPHY ==================== */
        .text-heading-hero { font-family: var(--font-heading); font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.05; font-weight: 800; letter-spacing: -0.03em; color: var(--primary); }
        .text-heading-xl { font-family: var(--font-heading); font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; color: var(--primary); }
        .text-heading-lg { font-family: var(--font-heading); font-size: clamp(1.5rem, 4vw, 2.5rem); line-height: 1.15; font-weight: 700; letter-spacing: -0.015em; color: var(--primary); }
        .text-heading-md { font-family: var(--font-heading); font-size: clamp(1.25rem, 3vw, 2rem); line-height: 1.2; font-weight: 600; color: var(--primary); }
        .text-heading-sm { font-family: var(--font-heading); font-size: clamp(1rem, 2.5vw, 1.5rem); line-height: 1.25; font-weight: 600; color: var(--primary); }
        .text-body-sm { font-family: var(--font-body); font-size: 0.875rem; line-height: 1.55; font-weight: 400; color: #2c2c2e; }
        .text-body-xs { font-family: var(--font-body); font-size: 0.75rem; line-height: 1.5; font-weight: 400; color: #3a3a3c; }
        
        /* ==================== TOP ANNOUNCEMENT BAR ==================== */
        .top-announcement-bar {
            background: #000000 !important;
            color: #ffffff !important;
            font-family: var(--font-body);
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            height: var(--bar-height);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100% !important;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 60;
            padding: 0 45px 0 16px;
            text-align: center;
            overflow: hidden;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, height 0.4s ease;
        }
        .top-announcement-bar.bar-hidden {
            transform: translateY(-100%);
            opacity: 0;
            height: 0 !important;
            pointer-events: none;
        }
        .top-announcement-bar a {
            color: rgba(255,255,255,0.7);
            text-decoration: underline;
            font-weight: 700;
            margin-left: 6px;
            transition: color 0.2s ease;
        }
        .top-announcement-bar a:hover { color: #ffffff; }
        .announcement-close-btn {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255,255,255,0.6);
            cursor: pointer;
            padding: 4px;
            transition: color 0.2s ease, transform 0.2s ease;
        }
        .announcement-close-btn:hover { color: #ffffff; transform: translateY(-50%) scale(1.1); }

        /* ==================== GLASS NAVIGATION ==================== */
        .glass-nav {
            position: fixed;
            top: var(--bar-height); 
            left: 0 !important; 
            right: 0 !important;
            width: 100% !important; 
            background: var(--glass-white);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border-bottom: 1px solid var(--glass-border-light);
            box-shadow: none;
            transition: background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, top 0.4s ease;
            z-index: 50;
            margin: 0 !important;
            padding: 0 !important;
        }
        .glass-nav.nav-scrolled {
            top: 0 !important; 
            background: rgba(255,255,255,0.85) !important;
            backdrop-filter: blur(30px) saturate(190%);
            -webkit-backdrop-filter: blur(30px) saturate(190%);
            border-bottom: 1px solid var(--glass-border-dark);
            box-shadow: 0 4px 30px rgba(0,0,0,0.03);
        }
        body.announcement-dismissed .glass-nav:not(.nav-scrolled) { top: 0 !important; }
        .glass-nav > div {
            padding-left: 16px !important;
            padding-right: 12px !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
        }
        @media (min-width: 1024px) {
            .glass-nav > div {
                padding-left: 40px !important;
                padding-right: 28px !important;
            }
        }
        body { 
            padding-top: 0 !important;
            font-family: var(--font-body);
            background-color: #ffffff;
            color: var(--primary);
        }

        /* ==================== HEADER ICONS ==================== */
        .header-icon-btn {
            background: none;
            border: none;
            padding: 4px;
            margin: 0 1px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--primary);
            transition: opacity 0.25s ease;
            position: relative;
        }
        .header-icon-btn:hover { opacity: 0.6; }
        .drawer-close-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: currentColor;
            transition: opacity 0.25s ease;
        }
        .drawer-close-btn:hover { opacity: 0.5; }

        /* ==================== SIDE DRAWER ==================== */
        .side-menu-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.25);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 199; opacity: 0; visibility: hidden;
            transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .side-menu-overlay.active { opacity: 1; visibility: visible; }
        .side-menu-drawer {
            position: fixed; top: 0; right: 0;
            width: 100%; max-width: 400px;
            height: 100vh; height: 100dvh;
            background: rgba(255,255,255,0.45);
            backdrop-filter: blur(40px) saturate(250%);
            -webkit-backdrop-filter: blur(40px) saturate(250%);
            border-left: 1px solid rgba(255,255,255,0.55);
            z-index: 200;
            transform: translateX(105%); 
            visibility: hidden; 
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex; flex-direction: column;
            box-shadow: -20px 0 60px rgba(0,0,0,0.03);
        }
        .side-menu-drawer.open { transform: translateX(0); visibility: visible; }
        .side-menu-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 20px 24px; border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .side-menu-scroll { flex-grow: 1; overflow-y: auto; padding: 20px 24px; }
        .menu-node-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 14px 4px; border-bottom: 1px solid rgba(0,0,0,0.04);
            font-family: var(--font-heading);
            font-size: 14px; font-weight: 700; letter-spacing: 0.03em;
            color: var(--primary); text-decoration: none; cursor: pointer;
            transition: all 0.3s ease;
        }
        .menu-node-item:hover { padding-left: 10px; opacity: 0.7; }
        .menu-node-submenu { display: none; padding-left: 16px; border-left: 1.5px solid var(--primary); margin: 4px 0 8px 4px; }
        .menu-node-submenu.open { display: block; }
        .menu-node-sub-item {
            display: block; padding: 10px 12px; font-family: var(--font-subtitle); font-size: 12px; font-weight: 600;
            color: #3a3a3c; text-decoration: none; transition: all 0.2s ease;
        }
        .menu-node-sub-item:hover { color: var(--primary); padding-left: 4px; }
        .side-drawer-footer { padding: 24px; border-top: 1px solid rgba(0,0,0,0.05); background: rgba(255,255,255,0.2); flex-shrink: 0; }

        /* ==================== CART DRAWER ==================== */
        #cart-drawer {
            position: fixed; top: 0; right: 0; width: 100%; max-width: 420px; height: 100vh; height: 100dvh;
            background: var(--glass-black-thick) !important; backdrop-filter: var(--glass-blur) !important;
            -webkit-backdrop-filter: var(--glass-blur) !important; border-left: 1px solid var(--glass-border-inline); z-index: 210;
            transform: translateX(105%) !important; visibility: hidden;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important, visibility 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
            will-change: transform; color: var(--accent) !important; display: flex; flex-direction: column;
        }
        #cart-drawer.open { transform: translateX(0) !important; visibility: visible !important; }
        #cart-drawer h2, #cart-drawer span, #cart-drawer p, #cart-drawer h4, #cart-drawer div { color: var(--accent); }
        #cart-drawer .bg-soft { background: rgba(255,255,255,0.06) !important; border-bottom: 1px solid rgba(255,255,255,0.1); }
        #cart-items > div { background: rgba(255,255,255,0.04) !important; border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(12px); border-radius: 16px; }
        .custom-scroll::-webkit-scrollbar { width: 2px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }

        /* ==================== CART ITEM ==================== */
        .cart-item-card {
            background: rgba(255,255,255,0.04) !important;
            border: 1px solid rgba(255,255,255,0.06) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            border-radius: 16px !important;
            padding: 12px !important;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
            position: relative;
            overflow: hidden;
        }
        .cart-item-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
            pointer-events: none;
        }
        .cart-item-card:hover {
            background: rgba(255,255,255,0.07) !important;
            border-color: rgba(255,255,255,0.12) !important;
        }
        .cart-item-image {
            width: 64px; height: 64px; object-fit: cover;
            border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);
            flex-shrink: 0; background: rgba(255,255,255,0.03);
        }
        .cart-item-title {
            font-family: var(--font-heading); font-weight: 700;
            font-size: 12px; color: #ffffff; line-height: 1.3; letter-spacing: -0.01em;
        }
        .cart-item-variant { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
        .cart-item-variant-badge {
            display: inline-flex; align-items: center; gap: 4px;
            background: rgba(255,255,255,0.06); padding: 1px 10px 1px 6px;
            border-radius: 14px; font-size: 7px; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.04em;
            color: rgba(255,255,255,0.65); font-family: var(--font-subtitle);
            border: 1px solid rgba(255,255,255,0.03);
        }
        .cart-item-variant-badge .color-dot {
            width: 8px; height: 8px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.12); flex-shrink: 0;
        }
        .cart-item-price { font-family: var(--font-body); font-weight: 900; font-size: 14px; color: #ffffff; letter-spacing: -0.01em; }
        .cart-item-old-price { font-family: var(--font-body); font-size: 9px; text-decoration: line-through; color: rgba(255,255,255,0.25); }
        
        .cart-item-quantity-control {
            display: flex; align-items: center; gap: 2px;
            background: rgba(255,255,255,0.06); border-radius: 10px;
            padding: 1px 2px; border: 1px solid rgba(255,255,255,0.04);
        }
        .cart-item-quantity-control button {
            background: none; border: none; color: rgba(255,255,255,0.5);
            cursor: pointer; padding: 2px 8px; font-size: 13px; font-weight: 700;
            transition: all 0.2s ease; border-radius: 8px; min-width: 28px;
            display: flex; align-items: center; justify-content: center;
            line-height: 1; touch-action: manipulation;
        }
        .cart-item-quantity-control button:active { transform: scale(0.85); background: rgba(255,255,255,0.1); }
        .cart-item-quantity-control button:hover { color: #ffffff; background: rgba(255,255,255,0.06); }
        .cart-item-quantity-control .qty-num {
            font-size: 11px; font-weight: 700; min-width: 20px;
            text-align: center; color: rgba(255,255,255,0.9);
            font-family: var(--font-body); user-select: none;
        }
        .cart-item-remove-btn {
            background: none; border: none; color: rgba(255,255,255,0.12);
            cursor: pointer; padding: 4px; transition: all 0.3s ease;
            border-radius: 8px; line-height: 1; touch-action: manipulation;
        }
        .cart-item-remove-btn:active { transform: scale(0.85); }
        .cart-item-remove-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
        
        .cart-item-sku-badge {
            font-family: var(--font-subtitle); font-size: 7px; font-weight: 600;
            color: rgba(255,255,255,0.2); letter-spacing: 0.04em; text-transform: uppercase;
            background: rgba(255,255,255,0.02); padding: 1px 8px; border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.02);
        }
        .cart-item-details-toggle {
            background: none; border: none; color: rgba(255,255,255,0.2);
            cursor: pointer; padding: 2px 6px; font-size: 7px; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.06em; transition: all 0.3s ease;
            font-family: var(--font-subtitle); touch-action: manipulation;
            border-radius: 6px; display: inline-flex; align-items: center; gap: 4px;
        }
        .cart-item-details-toggle:active { transform: scale(0.9); }
        .cart-item-details-toggle:hover { color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.04); }
        .cart-item-details-toggle .toggle-icon { transition: transform 0.3s ease; font-size: 6px; }
        .cart-item-details-toggle .toggle-icon.open { transform: rotate(180deg); }
        
        .cart-item-extra-details {
            max-height: 0; overflow: hidden;
            transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, margin 0.3s ease;
            opacity: 0; margin-top: 0;
        }
        .cart-item-extra-details.open { max-height: 200px; opacity: 1; margin-top: 6px; }
        .cart-item-extra-details-inner {
            display: flex; flex-wrap: wrap; gap: 3px 8px; padding: 6px 8px;
            background: rgba(255,255,255,0.03); border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.03);
        }
        .cart-item-extra-details-inner span {
            font-size: 6px; text-transform: uppercase; letter-spacing: 0.05em;
            color: rgba(255,255,255,0.3); font-family: var(--font-subtitle); font-weight: 500;
        }
        .cart-item-extra-details-inner span::before { content: '•'; margin-right: 4px; color: rgba(255,255,255,0.08); }
        .cart-item-extra-details-inner span:first-child::before { display: none; }
        .cart-item-bottom-row { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; flex-wrap: wrap; gap: 4px; }

        /* ==================== TOAST ==================== */
        #toast > div {
            background: rgba(255,255,255,0.85) !important; backdrop-filter: blur(40px) saturate(250%) !important;
            -webkit-backdrop-filter: blur(40px) saturate(250%) !important; border: 1px solid rgba(255,255,255,0.55) !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important; border-radius: 20px !important; color: var(--primary) !important;
        }
        #toast-icon { background: var(--primary) !important; color: var(--accent) !important; }

        /* ==================== FOOTER - PREMIUM STYLES ==================== */
        #main-footer {
            background: #000000; color: #8e8e93;
            border-top: 1px solid #1c1c1e;
            width: 100% !important; position: relative; clear: both;
        }
        #main-footer h4, #main-footer h5, #main-footer a { color: var(--accent) !important; transition: opacity 0.25s ease; }
        #main-footer a:hover { opacity: 0.5; }
        
        .social-icon-link {
            display: inline-flex; align-items: center; justify-content: center;
            width: 38px; height: 38px; border-radius: 50%;
            background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
            color: rgba(255,255,255,0.5); transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none; position: relative; overflow: hidden;
        }
        .social-icon-link::before {
            content: ''; position: absolute; inset: 0; border-radius: 50%;
            background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
            opacity: 0; transition: opacity 0.35s ease;
        }
        .social-icon-link:hover {
            transform: translateY(-3px) scale(1.05); background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.15); color: #ffffff; box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        .social-icon-link:hover::before { opacity: 1; }
        .social-icon-link svg { width: 16px; height: 16px; position: relative; z-index: 1; transition: transform 0.3s ease; }
        .social-icon-link:hover svg { transform: scale(1.1); }
        .social-icons-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-start; }
        
        @media (max-width: 640px) {
            .social-icon-link { width: 34px; height: 34px; }
            .social-icon-link svg { width: 14px; height: 14px; }
            .social-icons-grid { gap: 6px; }
        }
        
        .footer-payment-icons img, .footer-shipping-icons img, .footer-cert-badges img {
            filter: grayscale(100%) brightness(200%); transition: all 0.3s ease;
        }
        .footer-payment-icons img:hover, .footer-shipping-icons img:hover, .footer-cert-badges img:hover {
            filter: grayscale(0%) brightness(100%); transform: scale(1.05);
        }
        .footer-country-select {
            background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
            color: rgba(255,255,255,0.7); border-radius: 10px; padding: 6px 12px;
            font-size: 10px; font-family: var(--font-body); cursor: pointer;
            transition: all 0.3s ease; outline: none;
        }
        .footer-country-select:hover { border-color: rgba(255,255,255,0.2); }
        .footer-country-select:focus { border-color: rgba(255,255,255,0.3); box-shadow: 0 0 0 2px rgba(255,255,255,0.05); }
        .footer-app-btn {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px; padding: 6px 14px; transition: all 0.3s ease;
            text-decoration: none; color: rgba(255,255,255,0.7);
        }
        .footer-app-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); opacity: 1 !important; }
        .footer-trust-badge-item {
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            transition: all 0.3s ease;
        }
        .footer-trust-badge-item:hover { transform: translateY(-2px); }
        .footer-trust-badge-item img { filter: grayscale(100%) brightness(150%); transition: all 0.3s ease; }
        .footer-trust-badge-item:hover img { filter: grayscale(0%) brightness(100%); }
        
        .btn-primary {
            font-family: var(--font-body); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
            background: var(--primary) !important; color: var(--accent) !important; border-radius: 12px !important;
            transition: all 0.3s ease !important;
        }
        .btn-primary:hover { background: #1c1c1e !important; transform: translateY(-1px); }
        #wish-count, #cart-count {
            background: var(--primary) !important; color: var(--accent) !important;
            font-size: 7px !important; font-weight: 700; border: 1px solid rgba(255,255,255,0.55);
            top: -2px !important; right: -2px !important;
            min-width: 16px !important; height: 16px !important; padding: 0 4px !important;
        }
        .cart-empty-state { text-align: center; padding: 40px 20px; }
        .cart-empty-state i { font-size: 44px; color: rgba(255,255,255,0.05); margin-bottom: 16px; }
        .cart-empty-state h3 { font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
        .cart-empty-state p { font-family: var(--font-body); font-size: 11px; color: rgba(255,255,255,0.15); }
        .cart-summary-row { display: flex; justify-content: space-between; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 0; }
        .cart-summary-row .label { color: rgba(255,255,255,0.35); }
        .cart-summary-row .value { font-weight: 700; color: rgba(255,255,255,0.85); }
        .cart-summary-total { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; margin-top: 4px; }
        .cart-summary-total .label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.5); }
        .cart-summary-total .value { font-size: 18px; font-weight: 900; color: #ffffff; letter-spacing: -0.01em; }
        .cart-checkout-btn { padding: 14px !important; font-size: 10px !important; border-radius: 14px !important; letter-spacing: 0.08em !important; }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================================================
// UTILITIES
// ============================================================================
function createSlug(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

function buildMenuTree(items, parentId = null) {
    return items
        .filter(item => (item.parent_id || null) === (parentId || null))
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(item => ({ ...item, children: buildMenuTree(items, item.id) }));
}

function getMenuLinkUrl(item) {
    if (item.link && item.link.trim() !== '') return item.link;
    const slug = item.slug || '';
    switch (item.menu_type) {
        case 'home': return '/';
        case 'products': return '/products';
        case 'category': return item.category_slug ? `/category/${item.category_slug}` : '#';
        case 'subcategory': return (item.category_slug && item.subcategory_slug) ? `/category/${item.category_slug}/${item.subcategory_slug}` : '#';
        case 'contact': return '/contact';
        case 'about': return '/about';
        case 'journal': return '/journal';
        default: return slug ? `/${slug}` : '#';
    }
}

// ============================================================================
// DRAWER MENU ENGINE
// ============================================================================
function renderUnifiedDrawerMenu(rootItems) {
    let html = '';
    rootItems.forEach((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const linkUrl = getMenuLinkUrl(item);
        const uniqueId = `drawer-node-${index}-${Date.now()}`;
        if (hasChildren) {
            html += `
            <div>
                <div class="menu-node-item" onclick="toggleDrawerSubmenu('${uniqueId}', this)">
                    <span>${item.title || item.name || ''}</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-40"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="menu-node-submenu" id="${uniqueId}">${renderDrawerSubItems(item, uniqueId)}</div>
            </div>`;
        } else {
            html += `
            <a href="${linkUrl}" class="menu-node-item no-underline">
                <span>${item.title || item.name || ''}</span>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-30"><path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>`;
        }
    });
    return html;
}

function renderDrawerSubItems(item, parentId) {
    if (item.menu_type === 'category' && item.show_categories_from_db) return renderDatabaseCategoriesToDrawer(parentId);
    if (item.children && item.children.length > 0) {
        let html = '';
        item.children.forEach((child, idx) => {
            const hasGrandChildren = child.children && child.children.length > 0;
            const linkUrl = getMenuLinkUrl(child);
            const uniqueId = `${parentId}-sub-${idx}`;
            if (hasGrandChildren) {
                html += `
                <div>
                    <div class="menu-node-sub-item flex justify-between items-center cursor-pointer font-bold" onclick="toggleDrawerSubmenu('${uniqueId}', this)">
                        <span>${child.title || child.name || ''}</span>
                        <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-40"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <div class="menu-node-submenu" id="${uniqueId}">
                        ${child.children.map(gc => `<a href="${getMenuLinkUrl(gc)}" class="menu-node-sub-item">${gc.title || gc.name || ''}</a>`).join('')}
                    </div>
                </div>`;
            } else {
                html += `<a href="${linkUrl}" class="menu-node-sub-item">${child.title || child.name || ''}</a>`;
            }
        });
        return html;
    }
    return renderDatabaseCategoriesToDrawer(parentId);
}

function renderDatabaseCategoriesToDrawer(parentId) {
    if (!allCategories || allCategories.length === 0) return '';
    let html = '';
    allCategories.forEach((cat, idx) => {
        const catSlug = cat.slug || createSlug(cat.name);
        const catUrl = `/category/${catSlug}`;
        const uniqueId = `${parentId}-cat-${idx}`;
        const subcategories = allSubcategories.filter(sub => sub.category_id === cat.id);
        if (subcategories.length > 0) {
            html += `
            <div>
                <div class="menu-node-sub-item flex justify-between items-center cursor-pointer font-bold text-black" onclick="toggleDrawerSubmenu('${uniqueId}', this)">
                    <span>${cat.name}</span>
                    <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-40"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="menu-node-submenu" id="${uniqueId}">
                    <a href="${catUrl}" class="menu-node-sub-item font-black underline decoration-black/10">All ${cat.name}</a>
                    ${subcategories.map(sub => `<a href="/category/${catSlug}/${sub.slug || createSlug(sub.name)}" class="menu-node-sub-item">${sub.name}</a>`).join('')}
                </div>
            </div>`;
        } else {
            html += `<a href="${catUrl}" class="menu-node-sub-item">${cat.name}</a>`;
        }
    });
    return html;
}

// ============================================================================
// HEADER SYSTEM
// ============================================================================
async function renderHeader() {
    if (document.getElementById('main-nav') || document.getElementById('top-announcement-bar')) return;

    const [menuItems, categories, subcategories, announcement] = await Promise.all([
        fetchMenuItems(), fetchCategories(), fetchSubcategories(), fetchAnnouncement()
    ]);
    
    allCategories = categories;
    allSubcategories = subcategories;
    announcementData = announcement;
    const menuTree = buildMenuTree(menuItems);
    
    const isBarDismissed = localStorage.getItem('jabiyen_announcement_hidden') === 'true';
    const hasAnnouncement = announcementData && announcementData.message;
    const shouldShowBar = hasAnnouncement && !isBarDismissed;
    if (isBarDismissed) document.body.classList.add('announcement-dismissed');

    let announcementHTML = '';
    if (hasAnnouncement) {
        const bgColor = announcementData.bg_color || '#000000';
        const textColor = announcementData.text_color || '#ffffff';
        const message = announcementData.message || '';
        const linkUrl = announcementData.link_url || '';
        const linkTitle = announcementData.link_title || '';
        let linkHTML = '';
        if (linkUrl && linkTitle) linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkTitle}</a>`;
        announcementHTML = `
        <div class="top-announcement-bar ${shouldShowBar ? '' : 'bar-hidden'}" id="top-announcement-bar" style="background: ${bgColor} !important; color: ${textColor} !important;">
            <span id="announcement-text">${message} ${linkHTML}</span>
            <button class="announcement-close-btn" onclick="dismissAnnouncementBar()" aria-label="Close Announcement">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>`;
    } else {
        document.body.classList.add('announcement-dismissed');
    }

    const drawerContent = menuTree.length > 0 ? renderUnifiedDrawerMenu(menuTree) : '';

    const headerHTML = `
    ${announcementHTML}
    <div class="side-menu-overlay" id="sideMenuOverlay" onclick="closeSideMenu()"></div>
    <div class="side-menu-drawer" id="sideMenuDrawer">
        <div class="side-menu-header">
            <a href="/" class="flex items-center gap-3 no-underline">
                <img src="/logo.png" class="w-8 h-8 rounded-xl border border-white/20 shadow-sm" alt="Logo">
                <span class="font-black text-base sm:text-lg tracking-widest" style="font-family: var(--font-heading); color: var(--primary);">JABIYEN</span>
            </a>
            <button onclick="closeSideMenu()" class="drawer-close-btn" aria-label="Close menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
        <div class="side-menu-scroll" id="sideMenuContent">${drawerContent}</div>
        <div class="side-drawer-footer">
            <a href="/login" class="block w-full py-3.5 bg-black text-white rounded-xl text-center font-bold uppercase tracking-widest text-[9px] no-underline transition hover:bg-neutral-900">Account Architecture</a>
        </div>
    </div>
    <nav class="glass-nav" id="main-nav">
        <div class="h-14 lg:h-16 flex justify-between items-center">
            <a href="/" class="flex items-center gap-2.5 shrink-0 no-underline">
                <img src="/logo.png" class="w-7 h-7 lg:w-9 lg:h-9 rounded-xl" alt="JABIYEN Logo">
                <span class="text-base sm:text-lg lg:text-xl font-black tracking-widest" style="font-family: var(--font-heading); color: var(--primary);">JABIYEN</span>
            </a>
            <div class="flex items-center shrink-0 gap-0.5">
                <a href="/wishlist" class="header-icon-btn" aria-label="Wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span id="wish-count" class="absolute text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                <a href="/cart" onclick="toggleCart();return false;" class="header-icon-btn" aria-label="Cart">
                    <svg width="17" height="19" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 6H18V18C18 19.1046 17.1046 20 16 20H3C1.89543 20 1 19.1046 1 18V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 6C5 3.5 6.5 1 9.5 1C12.5 1 14 3.5 14 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                    <span id="cart-count" class="absolute text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                <button onclick="openSideMenu()" class="header-icon-btn" aria-label="Open Navigation Menu">
                    <svg width="20" height="13" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1H21M1 7.5H21M1 14H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                </button>
            </div>
        </div>
    </nav>
    <div id="cart-drawer" class="shadow-2xl">
        <div class="p-4 border-b flex justify-between items-center bg-soft">
            <h2 class="text-[10px] font-black uppercase tracking-widest">Shopping Vault</h2>
            <button onclick="toggleCart()" class="drawer-close-btn text-gray-400 hover:text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
        <div id="cart-items" class="flex-grow overflow-y-auto p-4 space-y-3 custom-scroll"></div>
        <div class="p-4 border-t bg-soft">
            <div class="space-y-1 mb-4">
                <div class="cart-summary-row"><span class="label">Subtotal</span><span class="value" id="cart-subtotal">৳ 0.00</span></div>
                <div class="cart-summary-row"><span class="label">Items</span><span class="value" id="cart-item-count">0</span></div>
                <div class="cart-summary-row cart-summary-total"><span class="label">Total</span><span class="value" id="cart-total">৳ 0.00</span></div>
            </div>
            <a href="/checkout" class="w-full py-3.5 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] transition text-center block hover:bg-neutral-100 no-underline shadow-lg cart-checkout-btn">Execute Checkout</a>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

function dismissAnnouncementBar() {
    const bar = document.getElementById('top-announcement-bar');
    const nav = document.getElementById('main-nav');
    if (bar) bar.classList.add('bar-hidden');
    localStorage.setItem('jabiyen_announcement_hidden', 'true');
    document.body.classList.add('announcement-dismissed');
    if (nav && !nav.classList.contains('nav-scrolled')) nav.style.top = '0px';
}

// ============================================================================
// SOCIAL ICONS - PREMIUM MONOCHROME SVG SET
// ============================================================================
function getSocialIconSVG(platform) {
    const icons = {
        'facebook': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'instagram': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.908 12.2384 16.0396 11.4077 15.9059C10.5771 15.7722 9.80971 15.3801 9.21479 14.7851C8.61987 14.1902 8.2278 13.4228 8.09412 12.5922C7.96044 11.7615 8.092 10.9098 8.47026 10.1583C8.84852 9.40678 9.45418 8.7937 10.2009 8.4062C10.9477 8.0187 11.7978 7.87652 12.63 8C13.4789 8.12583 14.2648 8.52151 14.8716 9.12836C15.4785 9.73521 15.8742 10.5211 16 11.37Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`,
        'youtube': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8387 5.15941C21.4982 4.80824 21.0708 4.55518 20.6 4.43C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92916 4.58518 2.50178 4.83824 2.16132 5.18941C1.82085 5.54057 1.57882 5.97541 1.46 6.45C1.14521 8.17418 0.991095 9.92534 1 11.68C0.991095 13.4347 1.14521 15.1858 1.46 16.91C1.57882 17.3846 1.82085 17.8194 2.16132 18.1706C2.50178 18.5218 2.92916 18.7748 3.4 18.9C5.12 19.36 12 19.36 12 19.36C12 19.36 18.88 19.36 20.6 18.9C21.0708 18.7748 21.4982 18.5218 21.8387 18.1706C22.1792 17.8194 22.4212 17.3846 22.54 16.91C22.8548 15.1858 23.0089 13.4347 23 11.68C23.0089 9.92534 22.8548 8.17418 22.54 6.42Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.75 15.02L15.5 11.68L9.75 8.34V15.02Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'tiktok': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12V8.5C9 6.01472 11.0147 4 13.5 4H16M9 20C7.34315 20 6 18.6569 6 17C6 15.3431 7.34315 14 9 14C10.6569 14 12 15.3431 12 17V4M20 8V12C18.3431 12 17 10.6569 17 9V8H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'x': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor"/></svg>`,
        'pinterest': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16C8 16 6 10 6 8C6 4 9 2 12 2C16 2 18 5 18 8C18 12 16 16 13 16C11 16 10 14 10 14M10 14L8 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg>`,
        'threads': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M16.5 10.5C16.5 10.5 15.5 8 12 8C8.5 8 7.5 10.5 7.5 12.5C7.5 14.5 8.5 16.5 12 16.5C14.5 16.5 15.5 14.5 15.5 13.5C15.5 12.5 14.5 12 13 12C11.5 12 10.5 12.5 10.5 13.5C10.5 14.5 11.5 15 12 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        'whatsapp': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C9.38318 21 7.42019 20.3098 5.86667 19.1333L2 20L2.86667 16.1333C1.69019 14.5798 1 12.6168 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8.5C8 8.5 8.5 7.5 9.5 7.5C10.5 7.5 11 8 11.5 9C12 10 12.5 10.5 13 11C13.5 11.5 14 12 14.5 12.5C15 13 15.5 13.5 16 14.5C16.5 15.5 16 16 16 16L15 16.5C14.5 16.5 13.5 16 13 15.5C12.5 15 11 13.5 10.5 13C10 12.5 9.5 12 9 11.5C8.5 11 8 10.5 8 9.5C8 8.5 8 8.5 8 8.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
        'linkedin': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 12V21H18V12C18 10.5 17.5 9 16 9C14.5 9 14 10.5 14 12V21H10V9H14V11C14 11 14.5 9.5 16.5 9.5C18.5 9.5 22 10.5 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`,
        'email': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 20.9 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };
    return icons[platform] || null;
}

// ============================================================================
// FOOTER - FULLY DYNAMIC (10 Tables - Database Driven)
// ============================================================================
async function renderFooter() {
    if (document.getElementById('main-footer')) return;
    await fetchFooterData();

    // ======================== SOCIAL LINKS ========================
    let socialIconsHTML = '';
    if (footerData.social_links?.length) {
        socialIconsHTML = footerData.social_links.map(social => {
            if (social.platform_icon && social.platform_icon.trim().startsWith('<svg')) {
                return `<a href="${social.link_url}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${social.platform_name}">${social.platform_icon}</a>`;
            }
            const platformKey = social.platform_name.toLowerCase().replace(/\s+/g, '');
            const svg = getSocialIconSVG(platformKey);
            if (svg) {
                return `<a href="${social.link_url}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${social.platform_name}">${svg}</a>`;
            }
            return `<a href="${social.link_url}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${social.platform_name}"><span class="text-[8px] font-bold">${social.platform_name.charAt(0)}</span></a>`;
        }).join('');
    }

    // ======================== QUICK LINKS TREE ========================
    let quickLinksColumn2HTML = '';
    let quickLinksColumn3HTML = '';
    if (footerData.quick_links_tree?.length) {
        const mid = Math.ceil(footerData.quick_links_tree.length / 2);
        const col1 = footerData.quick_links_tree.slice(0, mid);
        const col2 = footerData.quick_links_tree.slice(mid);
        const renderSection = (items) => items.map(s => {
            if (s.children?.length) {
                return `<div class="mb-4"><h5 class="text-[10px] uppercase tracking-widest mb-2 opacity-40">${s.title}</h5><ul class="space-y-1.5 text-[10px] list-none p-0 opacity-70">${s.children.map(c => `<li><a href="${c.link_url}" class="no-underline">${c.title}</a></li>`).join('')}</ul></div>`;
            }
            return `<div class="mb-3"><a href="${s.link_url}" class="text-[10px] uppercase tracking-widest opacity-40 no-underline hover:opacity-70 transition-opacity">${s.title}</a></div>`;
        }).join('');
        quickLinksColumn2HTML = renderSection(col1);
        quickLinksColumn3HTML = renderSection(col2);
    }

    // ======================== FOOTER CONTENT (brand & contact) ========================
    const brandSection = footerData.footer_content?.find(c => c.section_name === 'brand') || {};
    const contactSection = footerData.footer_content?.find(c => c.section_name === 'contact') || {};

    // ======================== PAYMENT METHODS ========================
    let paymentMethodsHTML = '';
    if (footerData.payment_methods?.length) {
        paymentMethodsHTML = `<div class="mt-6"><h5 class="text-[9px] uppercase tracking-widest mb-2.5 opacity-40">Payment Methods</h5><div class="flex flex-wrap items-center gap-3 footer-payment-icons">${footerData.payment_methods.map(pm => pm.icon_url ? `<img src="${pm.icon_url}" alt="${pm.name}" class="h-5 w-auto opacity-60 hover:opacity-100 transition-all duration-300" title="${pm.name}" loading="lazy">` : `<span class="text-[8px] uppercase tracking-wider opacity-50 bg-white/5 px-2 py-1 rounded-md">${pm.name}</span>`).join('')}</div></div>`;
    }

    // ======================== SHIPPING PARTNERS ========================
    let shippingPartnersHTML = '';
    if (footerData.shipping_partners?.length) {
        shippingPartnersHTML = `<div class="mt-4"><h5 class="text-[9px] uppercase tracking-widest mb-2 opacity-40">Shipping Partners</h5><div class="flex flex-wrap items-center gap-3 footer-shipping-icons">${footerData.shipping_partners.map(sp => sp.icon_url ? `<img src="${sp.icon_url}" alt="${sp.name}" class="h-4 w-auto opacity-50 hover:opacity-90 transition-all duration-300" title="${sp.name}" loading="lazy">` : `<span class="text-[7px] uppercase tracking-wide opacity-40 bg-white/5 px-2 py-0.5 rounded">${sp.name}</span>`).join('')}</div></div>`;
    }

    // ======================== CERTIFICATIONS ========================
    let certificationsHTML = '';
    if (footerData.certifications?.length) {
        certificationsHTML = `<div class="mt-4"><h5 class="text-[9px] uppercase tracking-widest mb-2 opacity-40">Certifications</h5><div class="flex flex-wrap items-center gap-3 footer-cert-badges">${footerData.certifications.map(cert => { const bc = cert.badge_url ? `<img src="${cert.badge_url}" alt="${cert.name}" class="h-5 w-auto opacity-60 hover:opacity-100 transition-all duration-300" loading="lazy">` : `<span class="text-[7px] uppercase tracking-wider opacity-50">${cert.name}</span>`; return cert.link_url ? `<a href="${cert.link_url}" target="_blank" rel="noopener noreferrer" title="${cert.name}" class="inline-block">${bc}</a>` : `<span class="inline-block" title="${cert.name}">${bc}</span>`; }).join('')}</div></div>`;
    }

    // ======================== APP LINKS ========================
    let appLinksHTML = '';
    if (footerData.app_links?.length) {
        const btns = footerData.app_links.map(app => {
            let h = '';
            if (app.app_store_url) h += `<a href="${app.app_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn">${app.icon_url ? `<img src="${app.icon_url}" alt="${app.platform_name}" class="w-4 h-4 opacity-70" loading="lazy">` : ''}<div class="text-left leading-tight"><span class="text-[6px] uppercase tracking-widest opacity-50 block">Download on</span><span class="text-[9px] font-bold tracking-wide">App Store</span></div></a>`;
            if (app.play_store_url) h += `<a href="${app.play_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn">${app.icon_url ? `<img src="${app.icon_url}" alt="${app.platform_name}" class="w-4 h-4 opacity-70" loading="lazy">` : ''}<div class="text-left leading-tight"><span class="text-[6px] uppercase tracking-widest opacity-50 block">Get it on</span><span class="text-[9px] font-bold tracking-wide">Google Play</span></div></a>`;
            return h;
        }).join('');
        if (btns) appLinksHTML = `<div class="mt-5"><h5 class="text-[9px] uppercase tracking-widest mb-2.5 opacity-40">Get Our App</h5><div class="flex flex-wrap gap-2">${btns}</div></div>`;
    }

    // ======================== COUNTRY SELECTOR ========================
    let countrySelectorHTML = '';
    if (footerData.countries?.length) {
        countrySelectorHTML = `<div class="mt-4"><h5 class="text-[9px] uppercase tracking-widest mb-2 opacity-40">Country & Language</h5><select id="footer-country-select" class="footer-country-select" onchange="handleCountryChange(this)">${footerData.countries.map(c => `<option value="${c.country_code}" data-currency="${c.currency_code||'BDT'}" data-symbol="${c.currency_symbol||'৳'}" data-language="${c.language_code||'en'}" ${c.is_default?'selected':''}>${c.flag_url?c.flag_url+' ':''}${c.country_name} (${c.language_name||c.language_code||'EN'})</option>`).join('')}</select></div>`;
    }

    // ======================== TRUST BADGES ========================
    let trustBadgesHTML = '';
    if (footerData.trust_badges?.length) {
        trustBadgesHTML = `<div class="mt-5 pt-4 border-t border-white/5"><h5 class="text-[9px] uppercase tracking-widest mb-3 opacity-40 text-center">Trust Badges</h5><div class="flex flex-wrap items-center justify-center gap-6">${footerData.trust_badges.map(b => b.badge_url ? `<div class="footer-trust-badge-item"><img src="${b.badge_url}" alt="${b.title}" class="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity duration-300" loading="lazy">${b.subtitle?`<span class="text-[6px] uppercase tracking-widest opacity-40">${b.subtitle}</span>`:''}</div>` : `<div class="footer-trust-badge-item text-center"><span class="text-[8px] font-bold tracking-wider opacity-70 block">${b.title}</span>${b.subtitle?`<span class="text-[6px] uppercase tracking-widest opacity-40">${b.subtitle}</span>`:''}</div>`).join('')}</div></div>`;
    }

    // ======================== SETTINGS (Database-Driven) ========================
    const s = footerData.settings || {};
    const theme = s.theme || 'dark';
    const layout = s.layout_style || 'standard';
    const version = s.version || '1.0';

    // ======================== BUILD FOOTER ========================
    const footerHTML = `
    <footer class="pt-12 pb-6" id="main-footer" data-theme="${theme}" data-layout="${layout}" data-version="${version}">
        <div class="w-full px-4 lg:px-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div class="md:col-span-1">
                    ${brandSection.title ? `<div class="flex items-center gap-2.5 mb-3"><img src="${brandSection.logo_url || '/logo.png'}" class="w-7 h-7 rounded-lg" alt="${brandSection.title}"><h4 class="text-sm font-bold tracking-widest">${brandSection.title}</h4></div>` : ''}
                    ${brandSection.description ? `<p class="text-[10px] leading-relaxed mb-4 opacity-50">${brandSection.description}</p>` : ''}
                    ${socialIconsHTML ? `<div class="social-icons-grid mt-3">${socialIconsHTML}</div>` : ''}
                    ${paymentMethodsHTML}${shippingPartnersHTML}${certificationsHTML}${countrySelectorHTML}${appLinksHTML}
                </div>
                <div>${quickLinksColumn2HTML}</div>
                <div>${quickLinksColumn3HTML}</div>
                <div>
                    ${contactSection.title ? `<h5 class="text-[10px] uppercase tracking-widest mb-3 opacity-40">${contactSection.title}</h5>` : ''}
                    <div class="space-y-2">
                        ${contactSection.description ? `<p class="text-[10px] opacity-60 flex items-center gap-2"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="opacity-40 shrink-0"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 20.9 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2"/></svg><a href="mailto:${contactSection.description}" class="no-underline">${contactSection.description}</a></p>` : ''}
                    </div>
                </div>
            </div>
            ${trustBadgesHTML}
            <div class="border-t border-neutral-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-gray-600 ${footerData.trust_badges?.length ? 'mt-0' : 'mt-6'}">
                <p class="text-[8px] uppercase tracking-widest opacity-40">Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="text-neutral-400 no-underline font-bold hover:text-white transition-colors">BINZEO</a></p>
                <p class="text-[8px] uppercase tracking-widest">&copy; <span id="display-year"></span> ${s.copyright_text || 'JABIYEN'} <span class="opacity-40 ml-1">v${version}</span></p>
            </div>
        </div>
    </footer>`;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
}

// ============================================================================
// COUNTRY CHANGE HANDLER
// ============================================================================
window.handleCountryChange = function(selectElement) {
    const opt = selectElement.options[selectElement.selectedIndex];
    const currency = opt.getAttribute('data-currency') || 'BDT';
    const symbol = opt.getAttribute('data-symbol') || '৳';
    const language = opt.getAttribute('data-language') || 'en';
    localStorage.setItem('jabiyen_country', selectElement.value);
    localStorage.setItem('jabiyen_currency', currency);
    localStorage.setItem('jabiyen_currency_symbol', symbol);
    localStorage.setItem('jabiyen_language', language);
    window.dispatchEvent(new CustomEvent('countryChanged', { detail: { countryCode: selectElement.value, currency, symbol, language } }));
    const countryName = opt.textContent.trim().split(' ')[0];
    showToast(`Region set to ${countryName} (${symbol})`, 'success');
};

// ============================================================================
// TOAST SYSTEM
// ============================================================================
function showToast(text, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed bottom-5 right-5 z-[100] transition-transform duration-300 translate-x-[120%]';
        toast.innerHTML = `<div class="shadow-xl p-3.5 flex items-center gap-3 min-w-[240px]"><span id="toast-icon" class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0"></span><p id="toast-text" class="text-[10px] font-bold flex-grow tracking-wide" style="font-family: var(--font-body);"></p><button onclick="hideToast()" class="drawer-close-btn text-gray-400 hover:text-black shrink-0"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`;
        document.body.appendChild(toast);
    }
    document.getElementById('toast-text').innerText = text;
    const iconEl = document.getElementById('toast-icon');
    iconEl.innerHTML = type === 'success' ? '✓' : '!';
    iconEl.style.background = type === 'success' ? '#000' : '#ef4444';
    iconEl.style.color = '#fff';
    toast.style.transform = 'translateX(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.transform = 'translateX(120%)'; }, 3000);
}
function hideToast() { const toast = document.getElementById('toast'); if (toast) toast.style.transform = 'translateX(120%)'; }

// ============================================================================
// SIDE DRAWER & CART CONTROLLERS
// ============================================================================
function openSideMenu() { document.getElementById('sideMenuDrawer')?.classList.add('open'); document.getElementById('sideMenuOverlay')?.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeSideMenu() { document.getElementById('sideMenuDrawer')?.classList.remove('open'); document.getElementById('sideMenuOverlay')?.classList.remove('active'); document.body.style.overflow = ''; document.querySelectorAll('.menu-node-submenu.open').forEach(s => s.classList.remove('open')); }
function toggleDrawerSubmenu(id) { document.getElementById(id)?.classList.toggle('open'); }
function toggleCart() { const d = document.getElementById('cart-drawer'); if (d) { d.classList.toggle('open'); if (d.classList.contains('open')) renderCartItems(); } }
window.toggleCartItemDetails = function(idx) { document.getElementById(`cart-details-${idx}`)?.classList.toggle('open'); document.getElementById(`cart-toggle-icon-${idx}`)?.classList.toggle('open'); };

// ============================================================================
// CART SYSTEM
// ============================================================================
window.addToCart = function(productId, options = {}) {
    if (!productId || !options.title) return;
    const existing = cart.findIndex(item => {
        if (item.product_id !== productId) return false;
        if (options.variant_id && item.variant_id === options.variant_id) return true;
        if (!options.variant_id && !item.variant_id) return item.color_id === (options.color_id||null) && item.size_id === (options.size_id||null);
        return false;
    });
    if (existing > -1) { cart[existing].quantity += (options.quantity||1); showToast(`Updated: ${cart[existing].title}${options.color_name?' '+options.color_name:''} × ${cart[existing].quantity}`, 'success'); }
    else {
        const vp = []; if (options.color_name) vp.push(options.color_name); if (options.size_name) vp.push(options.size_name);
        cart.push({ id: Date.now(), product_id: productId, title: options.title, price: options.price||0, old_price: options.old_price||null, img: options.color_image||options.img||'/logo.png', variant_id: options.variant_id||null, variant_name: options.variant_name||null, color_id: options.color_id||null, color_name: options.color_name||null, color_code: options.color_code||null, color_image: options.color_image||null, size_id: options.size_id||null, size_name: options.size_name||null, main_barcode: options.main_barcode||options.barcode||null, variant_barcode: options.variant_barcode||null, sku: options.sku||null, category: options.category||null, subcategory: options.subcategory||null, stock: options.stock||null, weight: options.weight||null, fabric_type: options.fabric_type||null, gsm_type: options.gsm_type||null, fit_type: options.fit_type||null, gender: options.gender||null, print_type: options.print_type||null, quantity: options.quantity||1 });
        showToast(`Added: ${options.title}${vp.length?' ('+vp.join(' • ')+')':''}`, 'success');
    }
    saveCart(); renderCartItems();
};
window.removeFromCart = function(idx) { const item = cart[idx]; if (!item) return; if (cart.length === 1 || window.confirm(`Remove "${item.title}${item.color_name?' ('+item.color_name+')':''}${item.size_name?' '+item.size_name:''}" from bag?`)) { cart.splice(idx,1); saveCart(); renderCartItems(); showToast('Removed from Bag','info'); } };
window.updateCartQuantity = function(idx, qty) { if (qty < 1) { removeFromCart(idx); return; } cart[idx].quantity = qty; saveCart(); renderCartItems(); };

function renderCartItems() {
    const c = document.getElementById('cart-items'), s = document.getElementById('cart-subtotal'), t = document.getElementById('cart-total'), ic = document.getElementById('cart-item-count');
    if (!c) return;
    if (!cart.length) { c.innerHTML = `<div class="cart-empty-state"><i class="fa-regular fa-bag-shopping"></i><h3>Your Vault is Empty</h3><p>Start shopping to fill your collection</p></div>`; if(s)s.innerText='৳ 0.00'; if(t)t.innerText='৳ 0.00'; if(ic)ic.innerText='0'; updateCounts(); return; }
    let sub=0, ti=0;
    c.innerHTML = cart.map((item,idx) => { const it=item.price*(item.quantity||1); sub+=it; ti+=(item.quantity||1);
        let vb=[]; if(item.color_name) vb.push(`<span class="cart-item-variant-badge">${item.color_code?`<span class="color-dot" style="background:${item.color_code};"></span>`:''}${item.color_name}</span>`); if(item.size_name) vb.push(`<span class="cart-item-variant-badge">${item.size_name}</span>`); if(item.sku) vb.push(`<span class="cart-item-sku-badge">SKU: ${item.sku}</span>`);
        let bp=[], ed=[]; if(item.main_barcode) bp.push(`Main: ${item.main_barcode}`); if(item.variant_barcode) bp.push(`Var: ${item.variant_barcode}`);
        if(item.fabric_type) ed.push(`Fabric: ${item.fabric_type}`); if(item.fit_type) ed.push(`Fit: ${item.fit_type}`); if(item.gsm_type) ed.push(`GSM: ${item.gsm_type}`); if(item.weight) ed.push(`Weight: ${item.weight}g`); if(item.gender) ed.push(`Gender: ${item.gender}`); if(item.print_type) ed.push(`Print: ${item.print_type}`);
        let ct=''; if(item.category){ ct=item.category; if(item.subcategory) ct+=' / '+item.subcategory; }
        const hasExtra = ed.length>0||ct||bp.length;
        return `<div class="cart-item-card"><div class="flex gap-3"><img src="${item.img}" class="cart-item-image" alt="${item.title}" onerror="this.src='/logo.png'"><div class="flex-grow min-w-0"><div class="flex items-start justify-between gap-1"><h4 class="cart-item-title">${item.title}</h4></div><div class="cart-item-variant">${vb.join('')}</div><div class="cart-item-bottom-row"><div class="flex items-center gap-2"><span class="cart-item-price">৳${it.toFixed(2)}</span>${item.old_price?`<span class="cart-item-old-price">৳${(item.old_price*item.quantity).toFixed(2)}</span>`:''}</div><div class="cart-item-quantity-control"><button onclick="updateCartQuantity(${idx},${(item.quantity||1)-1})">−</button><span class="qty-num">${item.quantity||1}</span><button onclick="updateCartQuantity(${idx},${(item.quantity||1)+1})">+</button></div></div>${hasExtra?`<button class="cart-item-details-toggle" onclick="toggleCartItemDetails(${idx})">Details <span class="toggle-icon" id="cart-toggle-icon-${idx}">▼</span></button>`:''}<div class="cart-item-extra-details" id="cart-details-${idx}"><div class="cart-item-extra-details-inner">${ct?`<span>📁 ${ct}</span>`:''}${bp.length?`<span>🔲 ${bp.join(' | ')}</span>`:''}${ed.map(d=>`<span>${d}</span>`).join('')}</div></div></div><button onclick="removeFromCart(${idx})" class="cart-item-remove-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>`;
    }).join('');
    if(s)s.innerText=`৳${sub.toFixed(2)}`; if(t)t.innerText=`৳${sub.toFixed(2)}`; if(ic)ic.innerText=ti; updateCounts();
}

// ============================================================================
// CART UTILS
// ============================================================================
window.getCartItemDetails = (pid, vid=null) => cart.find(i => i.product_id===pid && (!vid||i.variant_id===vid)) || null;
window.isVariantInCart = (pid, cid, sid) => cart.some(i => i.product_id===pid && (!cid||i.color_id===cid) && (!sid||i.size_id===sid));
window.getProductQuantityInCart = pid => cart.filter(i => i.product_id===pid).reduce((t,i) => t+(i.quantity||0), 0);
window.getVariantQuantityInCart = (pid, vid) => { const i = cart.find(i => i.product_id===pid && i.variant_id===vid); return i?i.quantity:0; };
window.clearCart = () => { if(!cart.length) return; if(window.confirm('Clear all items?')){ cart=[]; saveCart(); renderCartItems(); showToast('Bag Cleared','info'); } };
window.getCartSummary = () => ({ items: cart.map(i => ({ id:i.id, product_id:i.product_id, title:i.title, price:i.price, quantity:i.quantity, variant:{ color:i.color_name, color_code:i.color_code, color_image:i.color_image, size:i.size_name, sku:i.sku, main_barcode:i.main_barcode, variant_barcode:i.variant_barcode }, extra:{ fabric:i.fabric_type, fit:i.fit_type, gsm:i.gsm_type, weight:i.weight, gender:i.gender, print:i.print_type }, total:i.price*i.quantity })), subtotal: cart.reduce((s,i) => s+(i.price*i.quantity), 0), total_items: cart.reduce((s,i) => s+(i.quantity||0), 0), item_count: cart.length });

// ============================================================================
// WISHLIST & COUNTS
// ============================================================================
function toggleWishlist(id) { if(wishlist.includes(id)){ wishlist=wishlist.filter(x=>x!==id); showToast('Purged from Registry','info'); } else { wishlist.push(id); showToast('Saved to Vault Collection ❤️','success'); } localStorage.setItem('jabiyen_wish',JSON.stringify(wishlist)); updateCounts(); }
function updateCounts() { const cc=document.getElementById('cart-count'), wc=document.getElementById('wish-count'); const ti=cart.reduce((s,i)=>s+(i.quantity||0),0); if(cc){ cc.innerText=ti; cc.style.transform='scale(1.4)'; setTimeout(()=>{cc.style.transform='scale(1)';},150); } if(wc)wc.innerText=wishlist.length; }
function saveCart() { localStorage.setItem('jabiyen_cart',JSON.stringify(cart)); updateCounts(); }

// ============================================================================
// SCROLL DETECTOR
// ============================================================================
function handleNavScroll() {
    const nav = document.getElementById('main-nav'); if(!nav) return;
    const isBarDismissed = localStorage.getItem('jabiyen_announcement_hidden')==='true';
    const hasAnnouncement = announcementData && announcementData.message;
    const barHeight = (hasAnnouncement && !isBarDismissed) ? '36px' : '0px';
    if(window.scrollY>20){ nav.classList.add('nav-scrolled'); nav.style.top='0px'; } else { nav.classList.remove('nav-scrolled'); nav.style.top=barHeight; }
}

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================
window.showToast = showToast;
window.hideToast = hideToast;
window.toggleWishlist = toggleWishlist;
window.addToCart = addToCart;
window.toggleCart = toggleCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.toggleCartItemDetails = toggleCartItemDetails;
window.getCartItemDetails = getCartItemDetails;
window.isVariantInCart = isVariantInCart;
window.getProductQuantityInCart = getProductQuantityInCart;
window.getVariantQuantityInCart = getVariantQuantityInCart;
window.clearCart = clearCart;
window.getCartSummary = getCartSummary;
window.openSideMenu = openSideMenu;
window.closeSideMenu = closeSideMenu;
window.toggleDrawerSubmenu = toggleDrawerSubmenu;
window.saveCart = saveCart;
window.renderCartItems = renderCartItems;
window.updateCounts = updateCounts;
window.dismissAnnouncementBar = dismissAnnouncementBar;
window.fetchAnnouncement = fetchAnnouncement;
window.fetchFooterData = fetchFooterData;
window.handleCountryChange = handleCountryChange;

// ============================================================================
// INITIALIZATION
// ============================================================================
async function initSharedComponents() {
    if (window.JABIYEN_COMPONENTS_INITIALIZED) return;
    window.JABIYEN_COMPONENTS_INITIALIZED = true;
    loadFontsConfiguration();
    injectSharedStyles();
    await renderHeader();
    await renderFooter();
    updateCounts();
    window.removeEventListener('scroll', handleNavScroll);
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
    setTimeout(initSharedComponents, 60);
}
