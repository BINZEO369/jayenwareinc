// ============================================================================
// components.js - Shared Header, Footer, Common Functions & Glassmorphism UI
// Version: 10.0 (Pure DB Footer - Clean Architecture, No Hardcoded Fallbacks)
// Brand: JABIYEN (Premium Apparel)
// ============================================================================

let cart = JSON.parse(localStorage.getItem('jabiyen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jabiyen_wish') || '[]');
let userSession = null;
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
// ANNOUNCEMENT API FETCH
// ============================================================================
async function fetchAnnouncement() {
    try {
        const response = await fetch('/api/announcement');
        if (!response.ok) throw new Error('Failed to fetch announcement');
        const data = await response.json();
        announcementData = data;
        return data;
    } catch (error) {
        console.error('Announcement fetch error:', error);
        return null;
    }
}

// ============================================================================
// FOOTER DATA API FETCH
// ============================================================================
async function fetchFooterData() {
    try {
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error('Failed to fetch footer data');
        const data = await response.json();
        footerData = data;
        return data;
    } catch (error) {
        console.error('Footer data fetch error:', error);
        return null;
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

        /* ==================== FOOTER v10 - CLEAN ARCHITECTURE ==================== */
        #main-footer {
            background: #0a0a0a;
            color: #a1a1a6;
            border-top: 1px solid #1a1a1a;
            width: 100% !important;
            position: relative;
            clear: both;
            font-family: var(--font-body);
        }
        #main-footer a {
            color: #cccccc !important;
            transition: color 0.3s ease, opacity 0.3s ease;
            text-decoration: none;
        }
        #main-footer a:hover { color: #ffffff !important; opacity: 1; }
        
        /* Footer Grid */
        .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
        }
        @media (min-width: 640px) { .footer-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .footer-grid { grid-template-columns: 1.5fr 1fr 1fr 1.2fr; } }
        
        /* Brand Section */
        .footer-brand-logo { width: 36px; height: 36px; border-radius: 10px; object-fit: cover; }
        .footer-brand-title { font-family: var(--font-heading); font-size: 15px; font-weight: 800; letter-spacing: 0.06em; color: #ffffff; }
        .footer-brand-desc { font-size: 11px; line-height: 1.6; color: #6a6a6e; margin-top: 6px; }
        
        /* Section Title */
        .footer-section-title {
            font-family: var(--font-subtitle);
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #4a4a4e;
            margin-bottom: 14px;
            position: relative;
        }
        
        /* Social Icons - Clean Style */
        .footer-social-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 14px;
        }
        .footer-social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 10px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.35);
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }
        .footer-social-link:hover {
            background: rgba(255,255,255,0.08);
            border-color: rgba(255,255,255,0.12);
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        .footer-social-link svg { width: 14px; height: 14px; }
        
        /* Link Lists */
        .footer-link-list { list-style: none; padding: 0; margin: 0; }
        .footer-link-list li { margin-bottom: 6px; }
        .footer-link-list a {
            font-size: 11px;
            color: #77777a !important;
            transition: all 0.25s ease;
            display: inline-block;
        }
        .footer-link-list a:hover { color: #ffffff !important; transform: translateX(3px); }
        .footer-link-subtitle {
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #3a3a3e;
            margin: 12px 0 6px;
        }
        
        /* Contact Info */
        .footer-contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 10px;
            color: #77777a;
            margin-bottom: 8px;
        }
        .footer-contact-item svg { color: #3a3a3e; flex-shrink: 0; }
        .footer-contact-item a { color: #999 !important; }
        .footer-contact-item a:hover { color: #fff !important; }
        
        /* Payment / Shipping / Cert Badges */
        .footer-badge-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
        }
        .footer-badge-row img {
            height: 18px;
            width: auto;
            opacity: 0.4;
            filter: grayscale(100%) brightness(200%);
            transition: all 0.3s ease;
            border-radius: 3px;
        }
        .footer-badge-row img:hover { opacity: 0.9; filter: grayscale(0%) brightness(100%); transform: scale(1.08); }
        .footer-badge-text {
            font-size: 9px;
            font-weight: 500;
            color: #5a5a5e;
            background: rgba(255,255,255,0.03);
            padding: 3px 10px;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.04);
        }
        
        /* Country Select */
        .footer-country-select {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            color: #999;
            border-radius: 8px;
            padding: 7px 28px 7px 10px;
            font-size: 10px;
            font-family: var(--font-body);
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%23666' stroke-width='1.2' fill='none'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
        }
        .footer-country-select:hover { border-color: rgba(255,255,255,0.15); }
        .footer-country-select:focus { border-color: rgba(255,255,255,0.2); }
        
        /* App Buttons */
        .footer-app-btn {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 10px;
            padding: 7px 14px;
            transition: all 0.3s ease;
            color: #999 !important;
        }
        .footer-app-btn:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); color: #fff !important; }
        .footer-app-btn img { width: 16px; height: 16px; opacity: 0.5; }
        
        /* Trust Badges */
        .footer-trust-grid {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 20px;
            padding: 16px 0;
            border-top: 1px solid rgba(255,255,255,0.04);
            border-bottom: 1px solid rgba(255,255,255,0.04);
            margin: 20px 0;
        }
        .footer-trust-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            transition: all 0.3s ease;
        }
        .footer-trust-item:hover { transform: translateY(-2px); }
        .footer-trust-item img {
            height: 22px;
            width: auto;
            opacity: 0.4;
            filter: grayscale(100%) brightness(150%);
            transition: all 0.3s ease;
        }
        .footer-trust-item:hover img { opacity: 0.8; filter: grayscale(0%) brightness(100%); }
        .footer-trust-label {
            font-size: 7px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #4a4a4e;
        }
        
        /* Bottom Bar */
        .footer-bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding-top: 16px;
            font-size: 9px;
            color: #4a4a4e;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }
        @media (min-width: 768px) { .footer-bottom { flex-direction: row; justify-content: space-between; } }
        .footer-bottom a { color: #666 !important; font-weight: 600; }
        .footer-bottom a:hover { color: #fff !important; }
        
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
// DATA CONTROLLER & UTILITIES
// ============================================================================
function createSlug(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

async function fetchMenuItems() {
    try { const r = await fetch('/api/menu-items'); if (!r.ok) throw new Error('Failed'); allMenuItems = await r.json(); return allMenuItems; }
    catch (e) { console.error('Menu error:', e); return []; }
}
async function fetchCategories() {
    try { const r = await fetch('/api/categories'); if (!r.ok) throw new Error('Failed'); allCategories = await r.json(); return allCategories; }
    catch (e) { console.error('Category error:', e); return []; }
}
async function fetchSubcategories() {
    try { const r = await fetch('/api/subcategories'); if (!r.ok) throw new Error('Failed'); allSubcategories = await r.json(); return allSubcategories; }
    catch (e) { console.error('Subcategory error:', e); return []; }
}

function buildMenuTree(items, parentId = null) {
    return items.filter(i => (i.parent_id || null) === (parentId || null)).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(i => ({ ...i, children: buildMenuTree(items, i.id) }));
}
function getMenuLinkUrl(item) {
    if (item.link && item.link.trim() !== '') return item.link;
    const slug = item.slug || '';
    switch (item.menu_type) {
        case 'home': return '/'; case 'products': return '/products';
        case 'category': return item.category_slug ? `/category/${item.category_slug}` : '#';
        case 'subcategory': return (item.category_slug && item.subcategory_slug) ? `/category/${item.category_slug}/${item.subcategory_slug}` : '#';
        case 'contact': return '/contact'; case 'about': return '/about'; case 'journal': return '/journal';
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
            html += `<div><div class="menu-node-item" onclick="toggleDrawerSubmenu('${uniqueId}', this)"><span>${item.title || item.name || ''}</span><svg width="10" height="6" viewBox="0 0 10 6" fill="none" class="opacity-40"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="menu-node-submenu" id="${uniqueId}">${renderDrawerSubItems(item, uniqueId)}</div></div>`;
        } else {
            html += `<a href="${linkUrl}" class="menu-node-item no-underline"><span>${item.title || item.name || ''}</span><svg width="14" height="10" viewBox="0 0 14 10" fill="none" class="opacity-30"><path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;
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
            if (hasGrandChildren) html += `<div><div class="menu-node-sub-item flex justify-between items-center cursor-pointer font-bold" onclick="toggleDrawerSubmenu('${uniqueId}', this)"><span>${child.title || child.name || ''}</span><svg width="8" height="5" viewBox="0 0 10 6" fill="none" class="opacity-40"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="menu-node-submenu" id="${uniqueId}">${child.children.map(gc => `<a href="${getMenuLinkUrl(gc)}" class="menu-node-sub-item">${gc.title || gc.name || ''}</a>`).join('')}</div></div>`;
            else html += `<a href="${linkUrl}" class="menu-node-sub-item">${child.title || child.name || ''}</a>`;
        });
        return html;
    }
    return renderDatabaseCategoriesToDrawer(parentId);
}
function renderDatabaseCategoriesToDrawer(parentId) {
    if (!allCategories || !allCategories.length) return '<div class="menu-node-sub-item opacity-40">No categories</div>';
    return allCategories.map((cat, idx) => {
        const catSlug = cat.slug || createSlug(cat.name);
        const catUrl = `/category/${catSlug}`;
        const uniqueId = `${parentId}-cat-${idx}`;
        const subs = allSubcategories.filter(s => s.category_id === cat.id);
        if (subs.length) return `<div><div class="menu-node-sub-item flex justify-between items-center cursor-pointer font-bold text-black" onclick="toggleDrawerSubmenu('${uniqueId}', this)"><span>${cat.name}</span><svg width="8" height="5" viewBox="0 0 10 6" fill="none" class="opacity-40"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="menu-node-submenu" id="${uniqueId}"><a href="${catUrl}" class="menu-node-sub-item font-black underline decoration-black/10">All ${cat.name}</a>${subs.map(sub => `<a href="/category/${catSlug}/${sub.slug || createSlug(sub.name)}" class="menu-node-sub-item">${sub.name}</a>`).join('')}</div></div>`;
        return `<a href="${catUrl}" class="menu-node-sub-item">${cat.name}</a>`;
    }).join('');
}

// ============================================================================
// HEADER SYSTEM
// ============================================================================
async function renderHeader() {
    if (document.getElementById('main-nav') || document.getElementById('top-announcement-bar')) return;
    const [menuItems, categories, subcategories, announcement] = await Promise.all([fetchMenuItems(), fetchCategories(), fetchSubcategories(), fetchAnnouncement()]);
    allCategories = categories; allSubcategories = subcategories; announcementData = announcement;
    const menuTree = buildMenuTree(menuItems);
    const isBarDismissed = localStorage.getItem('jabiyen_announcement_hidden') === 'true';
    const hasAnnouncement = announcementData && announcementData.message;
    const shouldShowBar = hasAnnouncement && !isBarDismissed;
    if (isBarDismissed) document.body.classList.add('announcement-dismissed');
    let announcementHTML = '';
    if (hasAnnouncement) {
        const bg = announcementData.bg_color || '#000', tc = announcementData.text_color || '#fff', msg = announcementData.message || '', lu = announcementData.link_url || '', lt = announcementData.link_title || '';
        announcementHTML = `<div class="top-announcement-bar ${shouldShowBar ? '' : 'bar-hidden'}" id="top-announcement-bar" style="background:${bg}!important;color:${tc}!important;"><span id="announcement-text">${msg} ${lu&&lt?`<a href="${lu}" target="_blank" rel="noopener">${lt}</a>`:''}</span><button class="announcement-close-btn" onclick="dismissAnnouncementBar()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`;
    } else { document.body.classList.add('announcement-dismissed'); announcementHTML = `<div class="top-announcement-bar bar-hidden" id="top-announcement-bar"></div>`; }
    document.body.insertAdjacentHTML('afterbegin', `${announcementHTML}<div class="side-menu-overlay" id="sideMenuOverlay" onclick="closeSideMenu()"></div><div class="side-menu-drawer" id="sideMenuDrawer"><div class="side-menu-header"><a href="/" class="flex items-center gap-3 no-underline"><img src="/logo.png" class="w-8 h-8 rounded-xl border border-white/20 shadow-sm" alt="Logo"><span class="font-black text-base sm:text-lg tracking-widest" style="font-family:var(--font-heading);color:var(--primary);">JABIYEN</span></a><button onclick="closeSideMenu()" class="drawer-close-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="side-menu-scroll" id="sideMenuContent">${renderUnifiedDrawerMenu(menuTree)}</div><div class="side-drawer-footer"><a href="/login" class="block w-full py-3.5 bg-black text-white rounded-xl text-center font-bold uppercase tracking-widest text-[9px] no-underline transition hover:bg-neutral-900">Account Architecture</a></div></div><nav class="glass-nav" id="main-nav"><div class="h-14 lg:h-16 flex justify-between items-center"><a href="/" class="flex items-center gap-2.5 shrink-0 no-underline"><img src="/logo.png" class="w-7 h-7 lg:w-9 lg:h-9 rounded-xl" alt="Logo"><span class="text-base sm:text-lg lg:text-xl font-black tracking-widest" style="font-family:var(--font-heading);color:var(--primary);">JABIYEN</span></a><div class="flex items-center shrink-0 gap-0.5"><a href="/wishlist" class="header-icon-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span id="wish-count" class="absolute text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span></a><a href="/cart" onclick="toggleCart();return false;" class="header-icon-btn"><svg width="17" height="19" viewBox="0 0 19 21" fill="none"><path d="M1 6H18V18C18 19.1046 17.1046 20 16 20H3C1.89543 20 1 19.1046 1 18V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 6C5 3.5 6.5 1 9.5 1C12.5 1 14 3.5 14 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span id="cart-count" class="absolute text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span></a><button onclick="openSideMenu()" class="header-icon-btn"><svg width="20" height="13" viewBox="0 0 22 15" fill="none"><path d="M1 1H21M1 7.5H21M1 14H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div></div></nav><div id="cart-drawer" class="shadow-2xl"><div class="p-4 border-b flex justify-between items-center bg-soft"><h2 class="text-[10px] font-black uppercase tracking-widest">Shopping Vault</h2><button onclick="toggleCart()" class="drawer-close-btn text-gray-400 hover:text-white"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div id="cart-items" class="flex-grow overflow-y-auto p-4 space-y-3 custom-scroll"></div><div class="p-4 border-t bg-soft"><div class="space-y-1 mb-4"><div class="cart-summary-row"><span class="label">Subtotal</span><span class="value" id="cart-subtotal">৳ 0.00</span></div><div class="cart-summary-row"><span class="label">Items</span><span class="value" id="cart-item-count">0</span></div><div class="cart-summary-row cart-summary-total"><span class="label">Total</span><span class="value" id="cart-total">৳ 0.00</span></div></div><a href="/checkout" class="w-full py-3.5 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] transition text-center block hover:bg-neutral-100 no-underline shadow-lg cart-checkout-btn">Execute Checkout</a></div></div>`);
}

function dismissAnnouncementBar() {
    const bar = document.getElementById('top-announcement-bar'), nav = document.getElementById('main-nav');
    if (bar) bar.classList.add('bar-hidden');
    localStorage.setItem('jabiyen_announcement_hidden', 'true');
    document.body.classList.add('announcement-dismissed');
    if (nav && !nav.classList.contains('nav-scrolled')) nav.style.top = '0px';
}

// ============================================================================
// SOCIAL ICONS
// ============================================================================
function getSocialIconHTML(platform, link) {
    const icons = {
        'facebook': `<svg viewBox="0 0 24 24" fill="none"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'instagram': `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`,
        'youtube': `<svg viewBox="0 0 24 24" fill="none"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-1.94C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 001.46 6.4C1.15 8.17 1 9.92 1 11.68s.15 3.51.46 5.23a2.78 2.78 0 001.94 1.94c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.94c.31-1.72.46-3.47.46-5.23s-.15-3.51-.46-5.23z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.75 15.02L15.5 11.68 9.75 8.34v6.68z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'tiktok': `<svg viewBox="0 0 24 24" fill="none"><path d="M9 12V8.5C9 6.01 11.01 4 13.5 4H16M9 20a3 3 0 01-3-3 3 3 0 013-3 3 3 0 013 3v-7M20 8v4a4 4 0 01-3-3V8h3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'x': `<svg viewBox="0 0 24 24" fill="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/></svg>`,
        'pinterest': `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 16s-2-6-2-8c0-4 3-6 6-6 4 0 6 3 6 6 0 4-2 8-5 8-2 0-3-2-3-2l-2 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'threads': `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M16.5 10.5s-1-2.5-4.5-2.5S7.5 10.5 7.5 12.5s1 4 4.5 4c2.5 0 3.5-2 3.5-3 0-1-.5-1.5-2-1.5s-2.5.5-2.5 1.5c0 1 1 1.5 1.5 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        'whatsapp': `<svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5a9.5 9.5 0 01-9.5 9.5 9.45 9.45 0 01-5.63-1.87L2 20l.87-3.87A9.45 9.45 0 011 10.5 9.5 9.5 0 0110.5 1 9.5 9.5 0 0120 10.5v1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8.5s.5-1 1.5-1S11 8 11.5 9s.5 1.5 1 2 .5 1 1 1.5 1 1 1.5 2 .5 1.5.5 1.5l-1 .5s-1-.5-1.5-1-2-2-2.5-2.5-1-1-1.5-1.5-1-.5-1.5-1.5S8 8.5 8 8.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
        'linkedin': `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="9" width="4" height="12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 12v9h-4v-9c0-1.5-.5-3-2-3s-2 1.5-2 3v9h-4V9h4v2s.5-1.5 2.5-1.5S22 10.5 22 12z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`,
        'email': `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'google': `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/></svg>`,
        'maps': `<svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-6 8-12a8 8 0 00-16 0c0 6 8 12 8 12z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/></svg>`,
        'linktree': `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2v12m0 0l-4-4m4 4l4-4M12 22v-4m-4 0l4-4m4 4l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'messenger': `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 00-7.8 16.7L3.5 21.5l2.9-1.3A9.95 9.95 0 0012 22a10 10 0 000-20z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 13l3-3.5L14 12.5 17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };
    if (!icons[platform]) return null;
    return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="footer-social-link" aria-label="${platform}">${icons[platform]}</a>`;
}

// ============================================================================
// FOOTER v10 - PURE DATABASE, CLEAN ARCHITECTURE
// ============================================================================
async function renderFooter() {
    if (document.getElementById('main-footer')) return;
    await fetchFooterData();
    const d = footerData;
    const s = d?.settings || {};
    const bc = d?.footer_content?.find(c => c.section_name === 'brand') || {};
    const cc = d?.footer_content?.find(c => c.section_name === 'contact') || {};

    // Social Links
    let socialHTML = '';
    if (d?.social_links?.length) {
        socialHTML = d.social_links.map(sl => {
            if (sl.platform_icon?.trim()?.startsWith('<svg')) return `<a href="${sl.link_url}" target="_blank" rel="noopener" class="footer-social-link" aria-label="${sl.platform_name}">${sl.platform_icon}</a>`;
            return getSocialIconHTML(sl.platform_name.toLowerCase().replace(/\s+/g, ''), sl.link_url) || '';
        }).filter(Boolean).join('');
    }

    // Quick Links Tree
    let linksCol1 = '', linksCol2 = '';
    if (d?.quick_links_tree?.length) {
        const mid = Math.ceil(d.quick_links_tree.length / 2);
        const renderQL = items => items.map(q => {
            if (q.children?.length) return `<div class="mb-3"><h5 class="footer-link-subtitle">${q.title}</h5><ul class="footer-link-list">${q.children.map(c => `<li><a href="${c.link_url}">${c.title}</a></li>`).join('')}</ul></div>`;
            return `<div class="mb-2"><a href="${q.link_url}" class="text-[10px] uppercase tracking-widest" style="color:#4a4a4e!important;">${q.title}</a></div>`;
        }).join('');
        linksCol1 = renderQL(d.quick_links_tree.slice(0, mid));
        linksCol2 = renderQL(d.quick_links_tree.slice(mid));
    }

    // Badge Rows
    const badgeRow = (title, items, cls) => items?.length ? `<div class="mt-4"><h5 class="footer-link-subtitle">${title}</h5><div class="footer-badge-row ${cls||''}">${items.map(i => i.icon_url ? `<img src="${i.icon_url}" alt="${i.name}" title="${i.name}" loading="lazy">` : `<span class="footer-badge-text">${i.name}</span>`).join('')}</div></div>` : '';
    
    // Certifications
    let certHTML = '';
    if (d?.certifications?.length) {
        certHTML = `<div class="mt-4"><h5 class="footer-link-subtitle">Certifications</h5><div class="footer-badge-row">${d.certifications.map(c => { const bc = c.badge_url ? `<img src="${c.badge_url}" alt="${c.name}" loading="lazy">` : `<span class="footer-badge-text">${c.name}</span>`; return c.link_url ? `<a href="${c.link_url}" target="_blank" rel="noopener">${bc}</a>` : bc; }).join('')}</div></div>`;
    }

    // Country Selector
    let countryHTML = '';
    if (d?.countries?.length) {
        countryHTML = `<div class="mt-4"><h5 class="footer-link-subtitle">Country & Language</h5><select class="footer-country-select" onchange="handleCountryChange(this)">${d.countries.map(c => `<option value="${c.country_code}" data-currency="${c.currency_code||'BDT'}" data-symbol="${c.currency_symbol||'৳'}" data-language="${c.language_code||'en'}" ${c.is_default?'selected':''}>${c.flag_url||''} ${c.country_name} (${c.language_name||c.language_code||'EN'})</option>`).join('')}</select></div>`;
    }

    // App Links
    let appHTML = '';
    if (d?.app_links?.length) {
        const btns = d.app_links.map(a => {
            let h = '';
            if (a.app_store_url) h += `<a href="${a.app_store_url}" target="_blank" rel="noopener" class="footer-app-btn">${a.icon_url?`<img src="${a.icon_url}" alt="">`:''}<span class="text-[9px] font-semibold">App Store</span></a>`;
            if (a.play_store_url) h += `<a href="${a.play_store_url}" target="_blank" rel="noopener" class="footer-app-btn">${a.icon_url?`<img src="${a.icon_url}" alt="">`:''}<span class="text-[9px] font-semibold">Google Play</span></a>`;
            return h;
        }).join('');
        if (btns) appHTML = `<div class="mt-4"><h5 class="footer-link-subtitle">Get Our App</h5><div class="flex flex-wrap gap-2">${btns}</div></div>`;
    }

    // Trust Badges
    let trustHTML = '';
    if (d?.trust_badges?.length) {
        trustHTML = `<div class="footer-trust-grid">${d.trust_badges.map(b => b.badge_url ? `<div class="footer-trust-item"><img src="${b.badge_url}" alt="${b.title}" loading="lazy"><span class="footer-trust-label">${b.subtitle||b.title}</span></div>` : `<div class="footer-trust-item"><span class="text-[9px] font-bold" style="color:#666;">${b.title}</span>${b.subtitle?`<span class="footer-trust-label">${b.subtitle}</span>`:''}</div>`).join('')}</div>`;
    }

    // Build Footer
    const footerHTML = `
    <footer id="main-footer">
        <div class="w-full px-5 lg:px-10 py-12">
            ${trustHTML}
            <div class="footer-grid">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        ${bc.logo_url ? `<img src="${bc.logo_url}" class="footer-brand-logo" alt="${bc.title||'Brand'}">` : ''}
                        <span class="footer-brand-title">${bc.title || 'JABIYEN'}</span>
                    </div>
                    <p class="footer-brand-desc">${bc.description || ''}</p>
                    ${socialHTML ? `<div class="footer-social-grid">${socialHTML}</div>` : ''}
                    ${badgeRow('Payment Methods', d?.payment_methods)}
                    ${badgeRow('Shipping Partners', d?.shipping_partners)}
                    ${certHTML}
                    ${countryHTML}
                    ${appHTML}
                </div>
                <div>${linksCol1}</div>
                <div>${linksCol2}</div>
                <div>
                    <h5 class="footer-section-title">${cc.title || 'Contact'}</h5>
                    <div class="footer-contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.5"/></svg><a href="mailto:${s.contact_email || cc.description || ''}">${s.contact_email || cc.description || ''}</a></div>
                    ${s.contact_phone ? `<div class="footer-contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="1.5"/></svg><span>${s.contact_phone}</span></div>` : ''}
                    ${s.contact_address ? `<div class="footer-contact-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-6 8-12a8 8 0 00-16 0c0 6 8 12 8 12z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="1.5"/></svg><span>${s.contact_address}</span></div>` : ''}
                </div>
            </div>
            <div class="footer-bottom">
                <span>&copy; <b id="display-year"></b> ${s.copyright_text || ''}</span>
                <span><a href="${s.powered_by_link || '#'}" target="_blank" rel="noopener">${s.powered_by_text || ''}</a></span>
            </div>
        </div>
    </footer>`;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    const ye = document.getElementById('display-year');
    if (ye) ye.innerText = new Date().getFullYear();
}

// ============================================================================
// COUNTRY CHANGE HANDLER
// ============================================================================
window.handleCountryChange = function(sel) {
    const o = sel.options[sel.selectedIndex];
    const cur = o.getAttribute('data-currency') || 'BDT', sym = o.getAttribute('data-symbol') || '৳', lang = o.getAttribute('data-language') || 'en';
    localStorage.setItem('jabiyen_country', sel.value); localStorage.setItem('jabiyen_currency', cur); localStorage.setItem('jabiyen_currency_symbol', sym); localStorage.setItem('jabiyen_language', lang);
    window.dispatchEvent(new CustomEvent('countryChanged', { detail: { countryCode: sel.value, currency: cur, symbol: sym, language: lang } }));
    showToast(`Region: ${o.textContent.trim().split(' ')[0]} (${sym})`, 'success');
};

// ============================================================================
// TOAST SYSTEM
// ============================================================================
function showToast(text, type = 'success') {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'fixed bottom-5 right-5 z-[100] transition-transform duration-300 translate-x-[120%]'; t.innerHTML = `<div class="shadow-xl p-3.5 flex items-center gap-3 min-w-[240px]"><span id="toast-icon" class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0"></span><p id="toast-text" class="text-[10px] font-bold flex-grow tracking-wide" style="font-family:var(--font-body);"></p><button onclick="hideToast()" class="drawer-close-btn text-gray-400 hover:text-black shrink-0"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`; document.body.appendChild(t); }
    document.getElementById('toast-text').innerText = text;
    const ic = document.getElementById('toast-icon');
    ic.innerHTML = type === 'success' ? '✓' : '!'; ic.style.background = type === 'success' ? '#000' : '#ef4444'; ic.style.color = '#fff';
    t.style.transform = 'translateX(0)'; clearTimeout(t._timeout); t._timeout = setTimeout(() => { t.style.transform = 'translateX(120%)'; }, 3000);
}
function hideToast() { const t = document.getElementById('toast'); if (t) t.style.transform = 'translateX(120%)'; }

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
window.addToCart = function(pid, opts = {}) {
    if (!pid || !opts.title) return;
    const ex = cart.findIndex(i => i.product_id === pid && (opts.variant_id ? i.variant_id === opts.variant_id : (!i.variant_id && i.color_id === (opts.color_id||null) && i.size_id === (opts.size_id||null))));
    if (ex > -1) { cart[ex].quantity += (opts.quantity || 1); showToast(`Updated: ${cart[ex].title} × ${cart[ex].quantity}`, 'success'); }
    else { cart.push({ id: Date.now(), product_id: pid, title: opts.title, price: opts.price||0, old_price: opts.old_price||null, img: opts.color_image||opts.img||'/logo.png', variant_id: opts.variant_id||null, variant_name: opts.variant_name||null, color_id: opts.color_id||null, color_name: opts.color_name||null, color_code: opts.color_code||null, color_image: opts.color_image||null, size_id: opts.size_id||null, size_name: opts.size_name||null, main_barcode: opts.main_barcode||opts.barcode||null, variant_barcode: opts.variant_barcode||null, sku: opts.sku||null, category: opts.category||null, subcategory: opts.subcategory||null, stock: opts.stock||null, weight: opts.weight||null, fabric_type: opts.fabric_type||null, gsm_type: opts.gsm_type||null, fit_type: opts.fit_type||null, gender: opts.gender||null, print_type: opts.print_type||null, quantity: opts.quantity||1 }); showToast(`Added: ${opts.title}`, 'success'); }
    saveCart(); renderCartItems();
};
window.removeFromCart = function(idx) { const i = cart[idx]; if (!i) return; if (cart.length === 1 || confirm(`Remove "${i.title}"?`)) { cart.splice(idx, 1); saveCart(); renderCartItems(); showToast('Removed', 'info'); } };
window.updateCartQuantity = function(idx, qty) { if (qty < 1) { removeFromCart(idx); return; } cart[idx].quantity = qty; saveCart(); renderCartItems(); };

function renderCartItems() {
    const c = document.getElementById('cart-items'), st = document.getElementById('cart-subtotal'), tt = document.getElementById('cart-total'), ic = document.getElementById('cart-item-count');
    if (!c) return;
    if (!cart.length) { c.innerHTML = `<div class="cart-empty-state"><i class="fa-regular fa-bag-shopping"></i><h3>Your Vault is Empty</h3><p>Start shopping</p></div>`; if(st)st.innerText='৳ 0.00'; if(tt)tt.innerText='৳ 0.00'; if(ic)ic.innerText='0'; updateCounts(); return; }
    let sub = 0, ti = 0;
    c.innerHTML = cart.map((item, idx) => {
        const it = item.price * (item.quantity || 1); sub += it; ti += (item.quantity || 1);
        let vb = []; if (item.color_name) vb.push(`<span class="cart-item-variant-badge">${item.color_code?`<span class="color-dot" style="background:${item.color_code};"></span>`:''}${item.color_name}</span>`); if (item.size_name) vb.push(`<span class="cart-item-variant-badge">${item.size_name}</span>`); if (item.sku) vb.push(`<span class="cart-item-sku-badge">SKU:${item.sku}</span>`);
        let bp = [], ed = []; if (item.main_barcode) bp.push(`Main:${item.main_barcode}`); if (item.variant_barcode) bp.push(`Var:${item.variant_barcode}`);
        if (item.fabric_type) ed.push(`Fabric:${item.fabric_type}`); if (item.fit_type) ed.push(`Fit:${item.fit_type}`); if (item.gsm_type) ed.push(`GSM:${item.gsm_type}`); if (item.weight) ed.push(`Weight:${item.weight}g`); if (item.gender) ed.push(`Gender:${item.gender}`); if (item.print_type) ed.push(`Print:${item.print_type}`);
        let ct = ''; if (item.category) { ct = item.category; if (item.subcategory) ct += ' / ' + item.subcategory; }
        const hasEx = ed.length > 0 || ct || bp.length;
        return `<div class="cart-item-card"><div class="flex gap-3"><img src="${item.img}" class="cart-item-image" alt="${item.title}" onerror="this.src='/logo.png'"><div class="flex-grow min-w-0"><h4 class="cart-item-title">${item.title}</h4><div class="cart-item-variant">${vb.join('')}</div><div class="cart-item-bottom-row"><div class="flex items-center gap-2"><span class="cart-item-price">৳${it.toFixed(2)}</span>${item.old_price?`<span class="cart-item-old-price">৳${(item.old_price*item.quantity).toFixed(2)}</span>`:''}</div><div class="cart-item-quantity-control"><button onclick="updateCartQuantity(${idx},${(item.quantity||1)-1})">−</button><span class="qty-num">${item.quantity||1}</span><button onclick="updateCartQuantity(${idx},${(item.quantity||1)+1})">+</button></div></div>${hasEx?`<button class="cart-item-details-toggle" onclick="toggleCartItemDetails(${idx})">Details <span class="toggle-icon" id="cart-toggle-icon-${idx}">▼</span></button>`:''}<div class="cart-item-extra-details" id="cart-details-${idx}"><div class="cart-item-extra-details-inner">${ct?`<span>📁${ct}</span>`:''}${bp.length?`<span>🔲${bp.join('|')}</span>`:''}${ed.map(d=>`<span>${d}</span>`).join('')}</div></div></div><button onclick="removeFromCart(${idx})" class="cart-item-remove-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>`;
    }).join('');
    if (st) st.innerText = `৳${sub.toFixed(2)}`; if (tt) tt.innerText = `৳${sub.toFixed(2)}`; if (ic) ic.innerText = ti; updateCounts();
}

// ============================================================================
// CART UTILS
// ============================================================================
window.getCartItemDetails = (pid, vid = null) => cart.find(i => i.product_id === pid && (!vid || i.variant_id === vid)) || null;
window.isVariantInCart = (pid, cid, sid) => cart.some(i => i.product_id === pid && (!cid || i.color_id === cid) && (!sid || i.size_id === sid));
window.getProductQuantityInCart = pid => cart.filter(i => i.product_id === pid).reduce((t, i) => t + (i.quantity || 0), 0);
window.getVariantQuantityInCart = (pid, vid) => { const i = cart.find(i => i.product_id === pid && i.variant_id === vid); return i ? i.quantity : 0; };
window.clearCart = () => { if (!cart.length) return; if (confirm('Clear all?')) { cart = []; saveCart(); renderCartItems(); showToast('Cleared', 'info'); } };
window.getCartSummary = () => ({ items: cart.map(i => ({ id: i.id, product_id: i.product_id, title: i.title, price: i.price, quantity: i.quantity, variant: { color: i.color_name, color_code: i.color_code, color_image: i.color_image, size: i.size_name, sku: i.sku, main_barcode: i.main_barcode, variant_barcode: i.variant_barcode }, extra: { fabric: i.fabric_type, fit: i.fit_type, gsm: i.gsm_type, weight: i.weight, gender: i.gender, print: i.print_type }, total: i.price * i.quantity })), subtotal: cart.reduce((s, i) => s + (i.price * i.quantity), 0), total_items: cart.reduce((s, i) => s + (i.quantity || 0), 0), item_count: cart.length });

// ============================================================================
// WISHLIST & COUNTS
// ============================================================================
function toggleWishlist(id) { if (wishlist.includes(id)) { wishlist = wishlist.filter(x => x !== id); showToast('Removed', 'info'); } else { wishlist.push(id); showToast('Saved ❤️', 'success'); } localStorage.setItem('jabiyen_wish', JSON.stringify(wishlist)); updateCounts(); }
function updateCounts() { const cc = document.getElementById('cart-count'), wc = document.getElementById('wish-count'); const ti = cart.reduce((s, i) => s + (i.quantity || 0), 0); if (cc) { cc.innerText = ti; cc.style.transform = 'scale(1.4)'; setTimeout(() => { cc.style.transform = 'scale(1)'; }, 150); } if (wc) wc.innerText = wishlist.length; }
function saveCart() { localStorage.setItem('jabiyen_cart', JSON.stringify(cart)); updateCounts(); }

// ============================================================================
// SCROLL DETECTOR
// ============================================================================
function handleNavScroll() {
    const nav = document.getElementById('main-nav'); if (!nav) return;
    const isBarDismissed = localStorage.getItem('jabiyen_announcement_hidden') === 'true';
    const hasAnnouncement = announcementData && announcementData.message;
    const barHeight = (hasAnnouncement && !isBarDismissed) ? '36px' : '0px';
    if (window.scrollY > 20) { nav.classList.add('nav-scrolled'); nav.style.top = '0px'; } else { nav.classList.remove('nav-scrolled'); nav.style.top = barHeight; }
}

// ============================================================================
// EXPORT ALL GLOBALS
// ============================================================================
window.showToast = showToast; window.hideToast = hideToast; window.toggleWishlist = toggleWishlist;
window.addToCart = addToCart; window.toggleCart = toggleCart; window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity; window.toggleCartItemDetails = toggleCartItemDetails;
window.getCartItemDetails = getCartItemDetails; window.isVariantInCart = isVariantInCart;
window.getProductQuantityInCart = getProductQuantityInCart; window.getVariantQuantityInCart = getVariantQuantityInCart;
window.clearCart = clearCart; window.getCartSummary = getCartSummary;
window.openSideMenu = openSideMenu; window.closeSideMenu = closeSideMenu; window.toggleDrawerSubmenu = toggleDrawerSubmenu;
window.saveCart = saveCart; window.renderCartItems = renderCartItems; window.updateCounts = updateCounts;
window.dismissAnnouncementBar = dismissAnnouncementBar; window.fetchAnnouncement = fetchAnnouncement;
window.fetchFooterData = fetchFooterData; window.handleCountryChange = handleCountryChange;

// ============================================================================
// INITIALIZATION
// ============================================================================
async function initSharedComponents() {
    if (window.JABIYEN_COMPONENTS_INITIALIZED) return;
    window.JABIYEN_COMPONENTS_INITIALIZED = true;
    loadFontsConfiguration(); injectSharedStyles();
    await renderHeader(); await renderFooter(); updateCounts();
    window.removeEventListener('scroll', handleNavScroll); window.addEventListener('scroll', handleNavScroll); handleNavScroll();
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initSharedComponents); }
else { setTimeout(initSharedComponents, 60); }
