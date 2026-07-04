// ============================================================================
// components.js - Shared Header, Footer, Common Functions & Glassmorphism UI
// Version: 7.0 (Ultra Premium Cart - Full Product Details with Color, Size, Dual Barcode, Dynamic Images)
// Brand: JABIYEN (Premium Apparel)
// ============================================================================

let cart = JSON.parse(localStorage.getItem('jabiyen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jabiyen_wish') || '[]');
let userSession = null;
let allMenuItems = [];
let allCategories = [];
let allSubcategories = [];

// ডাবল রেন্ডার প্রতিরোধ করার জন্য গ্লোবাল ফ্ল্যাগ ট্র্যাকিং
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
        
        *, *:before, *:after {
            box-sizing: inherit;
        }
        
        /* ==================== TYPOGRAPHY SYSTEM ==================== */
        .text-heading-hero { font-family: var(--font-heading); font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.05; font-weight: 800; letter-spacing: -0.03em; color: var(--primary); }
        .text-heading-xl { font-family: var(--font-heading); font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; color: var(--primary); }
        .text-heading-lg { font-family: var(--font-heading); font-size: clamp(1.5rem, 4vw, 2.5rem); line-height: 1.15; font-weight: 700; letter-spacing: -0.015em; color: var(--primary); }
        .text-heading-md { font-family: var(--font-heading); font-size: clamp(1.25rem, 3vw, 2rem); line-height: 1.2; font-weight: 600; color: var(--primary); }
        .text-heading-sm { font-family: var(--font-heading); font-size: clamp(1rem, 2.5vw, 1.5rem); line-height: 1.25; font-weight: 600; color: var(--primary); }
        
        .text-subtitle-xl { font-family: var(--font-subtitle); font-size: clamp(1.25rem, 2.5vw, 1.75rem); line-height: 1.3; font-weight: 600; color: var(--primary); }
        .text-subtitle-lg { font-family: var(--font-subtitle); font-size: clamp(1.125rem, 2vw, 1.25rem); line-height: 1.4; font-weight: 500; color: var(--primary); }
        .text-subtitle-md { font-family: var(--font-subtitle); font-size: clamp(1rem, 1.5vw, 1.125rem); line-height: 1.4; font-weight: 500; color: var(--primary); }
        .text-subtitle-sm { font-family: var(--font-subtitle); font-size: 0.875rem; line-height: 1.5; font-weight: 500; color: var(--primary); }
        
        .text-body-xl { font-family: var(--font-body); font-size: 1.25rem; line-height: 1.7; font-weight: 400; color: #1c1c1e; }
        .text-body-lg { font-family: var(--font-body); font-size: 1.125rem; line-height: 1.65; font-weight: 400; color: #1c1c1e; }
        .text-body-md { font-family: var(--font-body); font-size: 1rem; line-height: 1.6; font-weight: 400; color: #1c1c1e; }
        .text-body-sm { font-family: var(--font-body); font-size: 0.875rem; line-height: 1.55; font-weight: 400; color: #2c2c2e; }
        
        /* ==================== TOP ANNOUNCEMENT BAR ==================== */
        .top-announcement-bar {
            background: #000000 !important;
            color: #ffffff !important;
            font-family: var(--font-body);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            height: var(--bar-height);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100% !important;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 60;
            padding: 0 45px 0 16px;
            text-align: center;
            overflow: hidden;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                        opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                        height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .top-announcement-bar.bar-hidden {
            transform: translateY(-100%);
            opacity: 0;
            height: 0 !important;
            pointer-events: none;
        }
        
        .announcement-close-btn {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            padding: 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s ease, transform 0.2s ease;
        }
        .announcement-close-btn:hover {
            color: #ffffff;
            transform: translateY(-50%) scale(1.1);
        }

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
            transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1), 
                        backdrop-filter 0.4s ease, 
                        border-color 0.4s ease, 
                        box-shadow 0.4s ease,
                        top 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
            z-index: 50;
            margin: 0 !important;
            padding: 0 !important;
        }

        .glass-nav.nav-scrolled {
            top: 0 !important; 
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(30px) saturate(190%);
            -webkit-backdrop-filter: blur(30px) saturate(190%);
            border-bottom: 1px solid var(--glass-border-dark);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
        }
        
        body.announcement-dismissed .glass-nav:not(.nav-scrolled) {
            top: 0 !important;
        }
        
        .glass-nav > div {
            padding-left: 24px !important;
            padding-right: 16px !important;
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
            padding: 6px;
            margin: 0 2px;
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
            padding: 8px;
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
            background: rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 199; opacity: 0; visibility: hidden;
            transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .side-menu-overlay.active { opacity: 1; visibility: visible; }
        
        .side-menu-drawer {
            position: fixed; top: 0; right: 0;
            width: 100%; max-width: 440px;
            height: 100vh; height: 100dvh;
            background: rgba(255, 255, 255, 0.45);
            backdrop-filter: blur(40px) saturate(250%);
            -webkit-backdrop-filter: blur(40px) saturate(250%);
            border-left: 1px solid rgba(255, 255, 255, 0.55);
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
            padding: 24px 32px; border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .side-menu-scroll { flex-grow: 1; overflow-y: auto; padding: 24px 32px; }
        
        .menu-node-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 18px 4px; border-bottom: 1px solid rgba(0, 0, 0, 0.04);
            font-family: var(--font-heading);
            font-size: 15px; font-weight: 700; letter-spacing: 0.03em;
            color: var(--primary); text-decoration: none; cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .menu-node-item:hover { padding-left: 10px; opacity: 0.7; }
        
        .menu-node-submenu { display: none; padding-left: 18px; border-left: 1.5px solid var(--primary); margin: 4px 0 8px 4px; }
        .menu-node-submenu.open { display: block; }
        
        .menu-node-sub-item {
            display: block; padding: 12px 14px; font-family: var(--font-subtitle); font-size: 13px; font-weight: 600;
            color: #3a3a3c; text-decoration: none; transition: all 0.2s ease;
        }
        .menu-node-sub-item:hover { color: var(--primary); padding-left: 4px; }
        
        .side-drawer-footer { padding: 32px; border-top: 1px solid rgba(0, 0, 0, 0.05); background: rgba(255, 255, 255, 0.2); flex-shrink: 0; }
        
        /* ==================== CART DRAWER - ULTRA PREMIUM ==================== */
        #cart-drawer {
            position: fixed; top: 0; right: 0; width: 100%; max-width: 480px; height: 100vh; height: 100dvh;
            background: var(--glass-black-thick) !important; backdrop-filter: var(--glass-blur) !important;
            -webkit-backdrop-filter: var(--glass-blur) !important; border-left: 1px solid var(--glass-border-inline); z-index: 210;
            transform: translateX(105%) !important; visibility: hidden;
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important, visibility 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
            will-change: transform; color: var(--accent) !important; display: flex; flex-direction: column;
        }
        #cart-drawer.open { transform: translateX(0) !important; visibility: visible !important; }
        #cart-drawer h2, #cart-drawer span, #cart-drawer p, #cart-drawer h4, #cart-drawer div { color: var(--accent); }
        #cart-drawer .bg-soft { background: rgba(255, 255, 255, 0.06) !important; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        #cart-items > div { background: rgba(255, 255, 255, 0.05) !important; border: 1px solid rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        
        /* ==================== CART ITEM - ULTRA PREMIUM CARD DESIGN ==================== */
        .cart-item-card {
            background: rgba(255, 255, 255, 0.04) !important;
            border: 1px solid rgba(255, 255, 255, 0.06) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-radius: 20px !important;
            padding: 18px !important;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
            position: relative;
            overflow: hidden;
        }
        .cart-item-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
            pointer-events: none;
        }
        .cart-item-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
            pointer-events: none;
        }
        .cart-item-card:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }
        
        .cart-item-image {
            width: 88px;
            height: 88px;
            object-fit: cover;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            flex-shrink: 0;
            background: rgba(255,255,255,0.05);
            transition: transform 0.3s ease;
        }
        .cart-item-card:hover .cart-item-image {
            transform: scale(1.02);
        }
        
        .cart-item-title {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 14px;
            color: #ffffff;
            line-height: 1.3;
            letter-spacing: -0.01em;
        }
        
        .cart-item-variant {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 4px;
        }
        
        .cart-item-variant-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.08);
            padding: 3px 14px 3px 8px;
            border-radius: 20px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(255,255,255,0.75);
            font-family: var(--font-subtitle);
            border: 1px solid rgba(255,255,255,0.04);
            backdrop-filter: blur(10px);
        }
        
        .cart-item-variant-badge .color-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.15);
            flex-shrink: 0;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }
        
        .cart-item-barcode {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            letter-spacing: 0.08em;
            color: rgba(255,255,255,0.25);
            margin-top: 3px;
            background: rgba(255,255,255,0.03);
            padding: 2px 10px;
            border-radius: 8px;
            display: inline-block;
            border: 1px solid rgba(255,255,255,0.03);
        }
        
        .cart-item-price {
            font-family: var(--font-body);
            font-weight: 900;
            font-size: 16px;
            color: #ffffff;
            letter-spacing: -0.01em;
        }
        
        .cart-item-old-price {
            font-family: var(--font-body);
            font-size: 11px;
            text-decoration: line-through;
            color: rgba(255,255,255,0.3);
        }
        
        .cart-item-quantity-control {
            display: flex;
            align-items: center;
            gap: 4px;
            background: rgba(255,255,255,0.06);
            border-radius: 14px;
            padding: 2px 4px;
            border: 1px solid rgba(255,255,255,0.04);
        }
        .cart-item-quantity-control button {
            background: none;
            border: none;
            color: rgba(255,255,255,0.5);
            cursor: pointer;
            padding: 4px 10px;
            font-size: 14px;
            transition: all 0.2s ease;
            border-radius: 10px;
            font-weight: 600;
        }
        .cart-item-quantity-control button:hover {
            color: #ffffff;
            background: rgba(255,255,255,0.08);
            transform: scale(1.05);
        }
        .cart-item-quantity-control .qty-num {
            font-size: 12px;
            font-weight: 700;
            min-width: 24px;
            text-align: center;
            color: rgba(255,255,255,0.9);
            font-family: var(--font-body);
        }
        
        .cart-item-remove-btn {
            background: none;
            border: none;
            color: rgba(255,255,255,0.15);
            cursor: pointer;
            padding: 8px;
            transition: all 0.3s ease;
            border-radius: 12px;
            line-height: 1;
        }
        .cart-item-remove-btn:hover {
            color: #ef4444;
            background: rgba(239,68,68,0.12);
            transform: scale(1.05);
        }
        
        .cart-item-sku-badge {
            font-family: var(--font-subtitle);
            font-size: 8px;
            font-weight: 600;
            color: rgba(255,255,255,0.25);
            letter-spacing: 0.05em;
            text-transform: uppercase;
            background: rgba(255,255,255,0.03);
            padding: 2px 10px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.03);
        }
        
        .cart-item-extra-details {
            display: flex;
            flex-wrap: wrap;
            gap: 4px 10px;
            margin-top: 4px;
        }
        .cart-item-extra-details span {
            font-size: 7px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: rgba(255,255,255,0.2);
            font-family: var(--font-subtitle);
            font-weight: 500;
        }
        .cart-item-extra-details span::before {
            content: '•';
            margin-right: 6px;
            color: rgba(255,255,255,0.1);
        }
        .cart-item-extra-details span:first-child::before {
            display: none;
        }
        
        .cart-item-category-tag {
            font-size: 7px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: rgba(255,255,255,0.15);
            font-family: var(--font-body);
            font-weight: 500;
            background: rgba(255,255,255,0.03);
            padding: 1px 10px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.03);
        }
        
        /* ==================== TOAST ==================== */
        #toast > div {
            background: rgba(255, 255, 255, 0.85) !important; backdrop-filter: blur(40px) saturate(250%) !important;
            -webkit-backdrop-filter: blur(40px) saturate(250%) !important; border: 1px solid rgba(255, 255, 255, 0.55) !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important; border-radius: 24px !important; color: var(--primary) !important;
        }
        #toast-icon { background: var(--primary) !important; color: var(--accent) !important; }
        
        /* ==================== FOOTER ==================== */
        #main-footer { background: #000000; color: #8e8e93; border-top: 1px solid #1c1c1e; width: 100% !important; position: relative; clear: both; }
        #main-footer h4, #main-footer h5, #main-footer a { color: var(--accent) !important; transition: opacity 0.25s ease; }
        #main-footer a:hover { opacity: 0.5; }
        
        .btn-primary {
            font-family: var(--font-body); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
            background: var(--primary) !important; color: var(--accent) !important; border-radius: 14px !important;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .btn-primary:hover { background: #1c1c1e !important; transform: translateY(-1px); }
        
        #wish-count, #cart-count {
            background: var(--primary) !important; color: var(--accent) !important;
            font-size: 8px !important; font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.55);
            top: -2px !important; right: -2px !important;
        }
        
        /* ==================== CART EMPTY STATE ==================== */
        .cart-empty-state {
            text-align: center;
            padding: 50px 20px;
        }
        .cart-empty-state i {
            font-size: 56px;
            color: rgba(255,255,255,0.06);
            margin-bottom: 20px;
        }
        .cart-empty-state h3 {
            font-family: var(--font-heading);
            font-size: 18px;
            font-weight: 700;
            color: rgba(255,255,255,0.5);
            margin-bottom: 6px;
        }
        .cart-empty-state p {
            font-family: var(--font-body);
            font-size: 13px;
            color: rgba(255,255,255,0.2);
        }
        
        /* ==================== CART CHECKOUT SUMMARY ==================== */
        .cart-summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 6px 0;
        }
        .cart-summary-row .label {
            color: rgba(255,255,255,0.4);
        }
        .cart-summary-row .value {
            font-weight: 700;
            color: rgba(255,255,255,0.9);
        }
        .cart-summary-total {
            border-top: 1px solid rgba(255,255,255,0.08);
            padding-top: 14px;
            margin-top: 8px;
        }
        .cart-summary-total .label {
            font-size: 13px;
            font-weight: 700;
            color: rgba(255,255,255,0.6);
        }
        .cart-summary-total .value {
            font-size: 22px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: -0.01em;
        }
        
        /* ==================== CART ITEM DIVIDER ==================== */
        .cart-item-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
            margin: 4px 0;
        }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================================================
// DATA CONTROLLER & UTILITIES
// ============================================================================
function createSlug(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
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
// RENDER UNIFIED DRAWER ENGINE
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
                <div class="menu-node-submenu" id="${uniqueId}">
                    ${renderDrawerSubItems(item, uniqueId)}
                </div>
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

// ============================================================================
// DRAWER INNER LOGICS
// ============================================================================
function renderDrawerSubItems(item, parentId) {
    if (item.menu_type === 'category' && item.show_categories_from_db) {
        return renderDatabaseCategoriesToDrawer(parentId);
    }
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
    if (!allCategories || allCategories.length === 0) {
        return '<div class="menu-node-sub-item opacity-40">No configuration found</div>';
    }
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
                    ${subcategories.map(sub => {
                        const subSlug = sub.slug || createSlug(sub.name);
                        return `<a href="/category/${catSlug}/${subSlug}" class="menu-node-sub-item">${sub.name}</a>`;
                    }).join('')}
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
    if (document.getElementById('main-nav') || document.getElementById('top-announcement-bar')) {
        return;
    }

    const [menuItems, categories, subcategories] = await Promise.all([
        fetchMenuItems(),
        fetchCategories(),
        fetchSubcategories()
    ]);
    
    allCategories = categories;
    allSubcategories = subcategories;
    const menuTree = buildMenuTree(menuItems);
    
    const isBarDismissed = localStorage.getItem('jabiyen_announcement_hidden') === 'true';
    if (isBarDismissed) {
        document.body.classList.add('announcement-dismissed');
    }

    const headerHTML = `
    <!-- TOP ANNOUNCEMENT BAR -->
    <div class="top-announcement-bar ${isBarDismissed ? 'bar-hidden' : ''}" id="top-announcement-bar">
        <span id="announcement-text">Sign up today and get 15% off your architecture collection order</span>
        <button class="announcement-close-btn" onclick="dismissAnnouncementBar()" aria-label="Close Announcement">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>

    <div class="side-menu-overlay" id="sideMenuOverlay" onclick="closeSideMenu()"></div>
    <div class="side-menu-drawer" id="sideMenuDrawer">
        <div class="side-menu-header">
            <a href="/" class="flex items-center gap-3 no-underline">
                <img src="/logo.png" class="w-9 h-9 rounded-xl border border-white/20 shadow-sm" alt="Logo">
                <span class="font-black text-lg sm:text-xl tracking-widest" style="font-family: var(--font-heading); color: var(--primary);">JABIYEN</span>
            </a>
            <button onclick="closeSideMenu()" class="drawer-close-btn" aria-label="Close menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
        <div class="side-menu-scroll" id="sideMenuContent">
            ${renderUnifiedDrawerMenu(menuTree)}
        </div>
        <div class="side-drawer-footer">
            <a href="/login" class="block w-full py-4 bg-black text-white rounded-xl text-center font-bold uppercase tracking-widest text-[10px] no-underline transition hover:bg-neutral-900">Account Architecture</a>
        </div>
    </div>
    
    <nav class="glass-nav" id="main-nav">
        <div class="h-16 lg:h-20 flex justify-between items-center">
            <a href="/" class="flex items-center gap-3 shrink-0 no-underline">
                <img src="/logo.png" class="w-9 h-9 lg:w-10 lg:h-10 rounded-xl" alt="JABIYEN Logo">
                <span class="text-lg sm:text-xl lg:text-2xl font-black tracking-widest" style="font-family: var(--font-heading); color: var(--primary);">JABIYEN</span>
            </a>
            
            <div class="flex items-center shrink-0">
                <a href="/wishlist" class="header-icon-btn" aria-label="Wishlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span id="wish-count" class="absolute text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                
                <a href="/cart" onclick="toggleCart();return false;" class="header-icon-btn" aria-label="Cart">
                    <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6H18V18C18 19.1046 17.1046 20 16 20H3C1.89543 20 1 19.1046 1 18V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                        <path d="M5 6C5 3.5 6.5 1 9.5 1C12.5 1 14 3.5 14 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                    <span id="cart-count" class="absolute text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                
                <button onclick="openSideMenu()" class="header-icon-btn" aria-label="Open Navigation Menu">
                    <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1H21M1 7.5H21M1 14H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    </nav>
    
    <div id="cart-drawer" class="shadow-2xl">
        <div class="p-6 border-b flex justify-between items-center bg-soft">
            <h2 class="text-xs font-black uppercase tracking-widest">Shopping Vault</h2>
            <button onclick="toggleCart()" class="drawer-close-btn text-gray-400 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
        <div id="cart-items" class="flex-grow overflow-y-auto p-6 space-y-4 custom-scroll"></div>
        <div class="p-6 border-t bg-soft">
            <div class="space-y-2 mb-6">
                <div class="cart-summary-row">
                    <span class="label">Subtotal</span>
                    <span class="value" id="cart-subtotal">৳ 0.00</span>
                </div>
                <div class="cart-summary-row">
                    <span class="label">Items</span>
                    <span class="value" id="cart-item-count">0</span>
                </div>
                <div class="cart-summary-row cart-summary-total">
                    <span class="label">Total</span>
                    <span class="value" id="cart-total">৳ 0.00</span>
                </div>
            </div>
            <a href="/checkout" class="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[11px] transition text-center block hover:bg-neutral-100 no-underline shadow-lg">Execute Checkout</a>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// ============================================================================
// ANNOUNCEMENT LOGIC
// ============================================================================
function dismissAnnouncementBar() {
    const bar = document.getElementById('top-announcement-bar');
    const nav = document.getElementById('main-nav');
    
    if (bar) {
        bar.classList.add('bar-hidden');
    }
    
    localStorage.setItem('jabiyen_announcement_hidden', 'true');
    document.body.classList.add('announcement-dismissed');
    
    if (nav && !nav.classList.contains('nav-scrolled')) {
        nav.style.top = '0px';
    }
}

// ============================================================================
// FOOTER & TOAST
// ============================================================================
function renderFooter() {
    if (document.getElementById('main-footer')) return;

    const footerHTML = `
    <footer class="pt-16 pb-8" id="main-footer">
        <div class="w-full px-6 lg:px-12">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div class="col-span-2 md:col-span-1">
                    <h4 class="text-sm font-bold tracking-widest mb-4">JABIYEN</h4>
                    <p class="text-[11px] leading-relaxed mb-4 opacity-50">Premium lifestyle apparel architecture calibrated for modern aesthetics. Built on <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="font-bold underline text-white">BINZEO</a>.</p>
                </div>
                <div>
                    <h5 class="text-xs uppercase tracking-widest mb-4 opacity-40">Pipeline Links</h5>
                    <ul class="space-y-2 text-[11px] list-none p-0 opacity-70">
                        <li><a href="/about" class="no-underline">About Corporate</a></li>
                        <li><a href="/contact" class="no-underline">Contact Portal</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-xs uppercase tracking-widest mb-4 opacity-40">Governance</h5>
                    <ul class="space-y-2 text-[11px] list-none p-0 opacity-70">
                        <li><a href="/privacy-policy" class="no-underline">Privacy Core</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-xs uppercase tracking-widest mb-4 opacity-40">Direct Contact</h5>
                    <p class="text-[11px] opacity-60">binzeo369@outlook.com</p>
                </div>
            </div>
            <div class="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600">
                <p class="text-[9px] uppercase tracking-widest">Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="text-neutral-400 no-underline font-bold">BINZEO Infrastructure</a></p>
                <p class="text-[9px] uppercase tracking-widest">&copy; <span id="display-year"></span> JABIYEN Engine.</p>
            </div>
        </div>
    </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

function showToast(text, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed bottom-5 right-5 z-[100] transition-transform duration-300 translate-x-[120%]';
        toast.innerHTML = `
            <div class="shadow-xl p-4 flex items-center gap-3.5 min-w-[280px]">
                <span id="toast-icon" class="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"></span>
                <p id="toast-text" class="text-xs font-bold flex-grow tracking-wide" style="font-family: var(--font-body);"></p>
                <button onclick="hideToast()" class="drawer-close-btn text-gray-400 hover:text-black shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            </div>
        `;
        document.body.appendChild(toast);
    }
    document.getElementById('toast-text').innerText = text;
    const iconEl = document.getElementById('toast-icon');
    iconEl.innerHTML = type === 'success' ? '✓' : '!';
    
    toast.style.transform = 'translateX(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.transform = 'translateX(120%)'; }, 3200);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.style.transform = 'translateX(120%)';
}

// ============================================================================
// SIDE DRAWER CONTROLLER
// ============================================================================
function openSideMenu() {
    const drawer = document.getElementById('sideMenuDrawer');
    if (drawer) drawer.classList.add('open');
    const overlay = document.getElementById('sideMenuOverlay');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
    const drawer = document.getElementById('sideMenuDrawer');
    if (drawer) drawer.classList.remove('open');
    const overlay = document.getElementById('sideMenuOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.querySelectorAll('.menu-node-submenu.open').forEach(sub => sub.classList.remove('open'));
}

// ============================================================================
// ==================== ENHANCED CART SYSTEM ====================
// Full Product Details: Color, Size, SKU, Dual Barcode, Dynamic Images
// ============================================================================

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) renderCartItems();
    }
}

// ============================================================================
// ADD TO CART - Premium Full Details with Color Image Matching
// ============================================================================
window.addToCart = function(productId, options = {}) {
    if (!productId || !options.title) {
        console.error('Product ID and Title are required');
        return;
    }
    
    // Check if same variant exists in cart
    const existingIndex = cart.findIndex(item => {
        if (item.product_id !== productId) return false;
        if (options.variant_id && item.variant_id === options.variant_id) return true;
        if (!options.variant_id && !item.variant_id) {
            return item.color_id === (options.color_id || null) && 
                   item.size_id === (options.size_id || null);
        }
        return false;
    });
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += (options.quantity || 1);
        const variantName = options.color_name ? ` ${options.color_name}` : '';
        showToast(`Updated: ${cart[existingIndex].title}${variantName} × ${cart[existingIndex].quantity}`, 'success');
    } else {
        let variantParts = [];
        if (options.color_name) variantParts.push(options.color_name);
        if (options.size_name) variantParts.push(options.size_name);
        const variantDisplay = variantParts.length ? ` (${variantParts.join(' • ')})` : '';
        
        const displayImage = options.color_image || options.img || '/logo.png';
        
        const newItem = {
            id: Date.now(),
            product_id: productId,
            title: options.title,
            price: options.price || 0,
            old_price: options.old_price || null,
            img: displayImage,
            
            // Variant Details
            variant_id: options.variant_id || null,
            variant_name: options.variant_name || null,
            
            // Color Details
            color_id: options.color_id || null,
            color_name: options.color_name || null,
            color_code: options.color_code || null,
            color_image: options.color_image || null,
            
            // Size Details
            size_id: options.size_id || null,
            size_name: options.size_name || null,
            
            // Dual Barcode System
            main_barcode: options.main_barcode || options.barcode || null,
            variant_barcode: options.variant_barcode || null,
            sku: options.sku || null,
            
            // Category Details
            category: options.category || null,
            subcategory: options.subcategory || null,
            
            // Stock & Pricing
            stock: options.stock || null,
            weight: options.weight || null,
            
            // Extra Details
            fabric_type: options.fabric_type || null,
            gsm_type: options.gsm_type || null,
            fit_type: options.fit_type || null,
            gender: options.gender || null,
            print_type: options.print_type || null,
            
            quantity: options.quantity || 1
        };
        
        cart.push(newItem);
        showToast(`Added to Bag: ${options.title}${variantDisplay}`, 'success');
    }
    
    saveCart();
    renderCartItems();
};

// ============================================================================
// REMOVE FROM CART - With Confirmation
// ============================================================================
window.removeFromCart = function(idx) {
    const item = cart[idx];
    if (!item) return;
    
    let itemName = item.title;
    if (item.color_name) itemName += ` (${item.color_name})`;
    if (item.size_name) itemName += ` ${item.size_name}`;
    
    if (cart.length === 1 || window.confirm(`Remove "${itemName}" from bag?`)) {
        cart.splice(idx, 1);
        saveCart();
        renderCartItems();
        showToast('Removed from Bag', 'info');
    }
};

// ============================================================================
// UPDATE QUANTITY
// ============================================================================
window.updateCartQuantity = function(idx, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(idx);
        return;
    }
    cart[idx].quantity = newQuantity;
    saveCart();
    renderCartItems();
};

// ============================================================================
// RENDER CART ITEMS - ULTRA PREMIUM with ALL Details
// ============================================================================
function renderCartItems() {
    const container = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const itemCountEl = document.getElementById('cart-item-count');
    if (!container) return;
    
    if (!cart.length) {
        container.innerHTML = `
            <div class="cart-empty-state">
                <i class="fa-regular fa-bag-shopping"></i>
                <h3>Your Vault is Empty</h3>
                <p>Start shopping to fill your collection</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.innerText = '৳ 0.00';
        if (totalEl) totalEl.innerText = '৳ 0.00';
        if (itemCountEl) itemCountEl.innerText = '0';
        updateCounts();
        return;
    }
    
    let sub = 0;
    let totalItems = 0;
    
    container.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * (item.quantity || 1);
        sub += itemTotal;
        totalItems += (item.quantity || 1);
        
        // Build variant details
        let variantBadges = [];
        
        // Color with dot
        if (item.color_name) {
            const colorDot = item.color_code ? 
                `<span class="color-dot" style="background:${item.color_code};"></span>` : '';
            variantBadges.push(`
                <span class="cart-item-variant-badge">
                    ${colorDot}
                    ${item.color_name}
                </span>
            `);
        }
        
        // Size
        if (item.size_name) {
            variantBadges.push(`
                <span class="cart-item-variant-badge">
                    ${item.size_name}
                </span>
            `);
        }
        
        // SKU
        if (item.sku) {
            variantBadges.push(`
                <span class="cart-item-sku-badge">SKU: ${item.sku}</span>
            `);
        }
        
        // Build barcode line
        let barcodeParts = [];
        if (item.main_barcode) barcodeParts.push(`Main: ${item.main_barcode}`);
        if (item.variant_barcode) barcodeParts.push(`Var: ${item.variant_barcode}`);
        const barcodeText = barcodeParts.length ? barcodeParts.join(' | ') : '';
        
        // Build extra details
        let extraDetails = [];
        if (item.fabric_type) extraDetails.push(`Fabric: ${item.fabric_type}`);
        if (item.fit_type) extraDetails.push(`Fit: ${item.fit_type}`);
        if (item.gsm_type) extraDetails.push(`GSM: ${item.gsm_type}`);
        if (item.weight) extraDetails.push(`Weight: ${item.weight}g`);
        if (item.gender) extraDetails.push(`Gender: ${item.gender}`);
        if (item.print_type) extraDetails.push(`Print: ${item.print_type}`);
        const extraText = extraDetails.length ? extraDetails.join(' • ') : '';
        
        // Category
        let categoryText = '';
        if (item.category) {
            categoryText = item.category;
            if (item.subcategory) categoryText += ` / ${item.subcategory}`;
        }
        
        return `
        <div class="cart-item-card">
            <div class="flex gap-4">
                <!-- Product Image -->
                <img src="${item.img}" class="cart-item-image" alt="${item.title}" onerror="this.src='/logo.png'">
                
                <!-- Product Info -->
                <div class="flex-grow min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <h4 class="cart-item-title">${item.title}</h4>
                    </div>
                    
                    <!-- Variant Badges -->
                    <div class="cart-item-variant">
                        ${variantBadges.join('')}
                    </div>
                    
                    <!-- Barcode -->
                    ${barcodeText ? `
                        <div class="cart-item-barcode">${barcodeText}</div>
                    ` : ''}
                    
                    <!-- Extra Details -->
                    ${extraText ? `
                        <div class="cart-item-extra-details">
                            ${extraDetails.map(d => `<span>${d}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <!-- Category -->
                    ${categoryText ? `
                        <div class="cart-item-category-tag">${categoryText}</div>
                    ` : ''}
                    
                    <!-- Price & Quantity -->
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center gap-2">
                            <span class="cart-item-price">৳${itemTotal.toFixed(2)}</span>
                            ${item.old_price ? `
                                <span class="cart-item-old-price">৳${(item.old_price * item.quantity).toFixed(2)}</span>
                            ` : ''}
                        </div>
                        
                        <!-- Quantity Controls -->
                        <div class="cart-item-quantity-control">
                            <button onclick="updateCartQuantity(${idx}, ${(item.quantity || 1) - 1})" aria-label="Decrease quantity">−</button>
                            <span class="qty-num">${item.quantity || 1}</span>
                            <button onclick="updateCartQuantity(${idx}, ${(item.quantity || 1) + 1})" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                </div>
                
                <!-- Remove Button -->
                <button onclick="removeFromCart(${idx})" class="cart-item-remove-btn" aria-label="Remove item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>`;
    }).join('');
    
    if (subtotalEl) subtotalEl.innerText = `৳${sub.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `৳${sub.toFixed(2)}`;
    if (itemCountEl) itemCountEl.innerText = totalItems;
    updateCounts();
}

// ============================================================================
// CART UTILITY FUNCTIONS
// ============================================================================
window.getCartItemDetails = function(productId, variantId = null) {
    const item = cart.find(item => {
        if (item.product_id !== productId) return false;
        if (variantId && item.variant_id !== variantId) return false;
        return true;
    });
    return item || null;
};

window.isVariantInCart = function(productId, colorId, sizeId) {
    return cart.some(item => {
        if (item.product_id !== productId) return false;
        if (colorId && item.color_id !== colorId) return false;
        if (sizeId && item.size_id !== sizeId) return false;
        return true;
    });
};

window.getProductQuantityInCart = function(productId) {
    return cart.filter(item => item.product_id === productId)
               .reduce((total, item) => total + (item.quantity || 0), 0);
};

window.getVariantQuantityInCart = function(productId, variantId) {
    const item = cart.find(item => item.product_id === productId && item.variant_id === variantId);
    return item ? item.quantity : 0;
};

window.clearCart = function() {
    if (cart.length === 0) return;
    if (window.confirm('Clear all items from your bag?')) {
        cart = [];
        saveCart();
        renderCartItems();
        showToast('Bag Cleared', 'info');
    }
};

window.getCartSummary = function() {
    const summary = {
        items: cart.map(item => ({
            id: item.id,
            product_id: item.product_id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            variant: {
                color: item.color_name,
                color_code: item.color_code,
                color_image: item.color_image,
                size: item.size_name,
                sku: item.sku,
                main_barcode: item.main_barcode,
                variant_barcode: item.variant_barcode
            },
            extra: {
                fabric: item.fabric_type,
                fit: item.fit_type,
                gsm: item.gsm_type,
                weight: item.weight,
                gender: item.gender,
                print: item.print_type
            },
            total: item.price * item.quantity
        })),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        total_items: cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
        item_count: cart.length
    };
    return summary;
};

// ============================================================================
// UPDATE COUNTS - With Animation
// ============================================================================
function updateCounts() {
    const cartCount = document.getElementById('cart-count');
    const wishCount = document.getElementById('wish-count');
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    if (cartCount) {
        cartCount.innerText = totalItems;
        cartCount.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cartCount.style.transform = 'scale(1.4)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 150);
    }
    if (wishCount) wishCount.innerText = wishlist.length;
}

function saveCart() {
    localStorage.setItem('jabiyen_cart', JSON.stringify(cart));
    updateCounts();
}

// ============================================================================
// WISHLIST CONTROLLER
// ============================================================================
function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
        showToast('Purged from Registry', 'info');
    } else {
        wishlist.push(id);
        showToast('Saved to Vault Collection ❤️', 'success');
    }
    localStorage.setItem('jabiyen_wish', JSON.stringify(wishlist));
    updateCounts();
}

function toggleDrawerSubmenu(submenuId, element) {
    const submenu = document.getElementById(submenuId);
    if (!submenu) return;
    const isOpen = submenu.classList.contains('open');
    if (isOpen) {
        submenu.classList.remove('open');
    } else {
        submenu.classList.add('open');
    }
}

// ============================================================================
// SCROLL DETECTOR
// ============================================================================
function handleNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    
    const isBarDismissed = localStorage.getItem('jabiyen_announcement_hidden') === 'true';
    
    if (window.scrollY > 20) {
        nav.classList.add('nav-scrolled');
        nav.style.top = '0px';
    } else {
        nav.classList.remove('nav-scrolled');
        nav.style.top = isBarDismissed ? '0px' : '36px';
    }
}

// ============================================================================
// APIS & INITIALIZATION
// ============================================================================
window.showToast = showToast;
window.hideToast = hideToast;
window.toggleWishlist = toggleWishlist;
window.addToCart = addToCart;
window.toggleCart = toggleCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
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

async function initSharedComponents() {
    if (window.JABIYEN_COMPONENTS_INITIALIZED) return;
    window.JABIYEN_COMPONENTS_INITIALIZED = true;

    loadFontsConfiguration();
    injectSharedStyles();
    await renderHeader();
    renderFooter();
    updateCounts();
    
    window.removeEventListener('scroll', handleNavScroll);
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll(); 

    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
    setTimeout(initSharedComponents, 60);
}
