// ============================================================================
// components.js - Shared Header, Footer, Common Functions & Glassmorphism UI
// Version: 9.1 (Complete Database-Driven Footer - All Columns from 11 Tables - Fixed Content Merge)
// Brand: JABIYEN (Premium Apparel)
// ============================================================================

let cart = JSON.parse(localStorage.getItem('jabiyen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jabiyen_wish') || '[]');
let userSession = null;
let allMenuItems = [];
let allCategories = [];
let allSubcategories = [];
let announcementData = null;

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
        
        /* ==================== TOP ANNOUNCEMENT BAR - DYNAMIC ==================== */
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
            position: absolute;
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
        .top-announcement-bar a:hover {
            color: #ffffff;
        }
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

        /* ==================== CART DRAWER - MOBILE OPTIMIZED ==================== */
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

        /* ==================== CART ITEM - MOBILE FRIENDLY ==================== */
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
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
            pointer-events: none;
        }
        .cart-item-card:hover {
            background: rgba(255,255,255,0.07) !important;
            border-color: rgba(255,255,255,0.12) !important;
        }
        
        .cart-item-image {
            width: 64px;
            height: 64px;
            object-fit: cover;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.06);
            flex-shrink: 0;
            background: rgba(255,255,255,0.03);
        }
        
        .cart-item-title {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 12px;
            color: #ffffff;
            line-height: 1.3;
            letter-spacing: -0.01em;
        }
        
        .cart-item-variant {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 2px;
        }
        
        .cart-item-variant-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(255,255,255,0.06);
            padding: 1px 10px 1px 6px;
            border-radius: 14px;
            font-size: 7px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: rgba(255,255,255,0.65);
            font-family: var(--font-subtitle);
            border: 1px solid rgba(255,255,255,0.03);
        }
        .cart-item-variant-badge .color-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.12);
            flex-shrink: 0;
        }
        
        .cart-item-barcode {
            font-family: 'Courier New', monospace;
            font-size: 6px;
            letter-spacing: 0.06em;
            color: rgba(255,255,255,0.2);
            margin-top: 1px;
            background: rgba(255,255,255,0.02);
            padding: 1px 8px;
            border-radius: 6px;
            display: inline-block;
            border: 1px solid rgba(255,255,255,0.02);
        }
        
        .cart-item-price {
            font-family: var(--font-body);
            font-weight: 900;
            font-size: 14px;
            color: #ffffff;
            letter-spacing: -0.01em;
        }
        .cart-item-old-price {
            font-family: var(--font-body);
            font-size: 9px;
            text-decoration: line-through;
            color: rgba(255,255,255,0.25);
        }
        
        /* ==================== QUANTITY CONTROLS - MOBILE OPTIMIZED ==================== */
        .cart-item-quantity-control {
            display: flex;
            align-items: center;
            gap: 2px;
            background: rgba(255,255,255,0.06);
            border-radius: 10px;
            padding: 1px 2px;
            border: 1px solid rgba(255,255,255,0.04);
        }
        .cart-item-quantity-control button {
            background: none;
            border: none;
            color: rgba(255,255,255,0.5);
            cursor: pointer;
            padding: 2px 8px;
            font-size: 13px;
            font-weight: 700;
            transition: all 0.2s ease;
            border-radius: 8px;
            min-width: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            touch-action: manipulation;
        }
        .cart-item-quantity-control button:active {
            transform: scale(0.85);
            background: rgba(255,255,255,0.1);
        }
        .cart-item-quantity-control button:hover {
            color: #ffffff;
            background: rgba(255,255,255,0.06);
        }
        .cart-item-quantity-control .qty-num {
            font-size: 11px;
            font-weight: 700;
            min-width: 20px;
            text-align: center;
            color: rgba(255,255,255,0.9);
            font-family: var(--font-body);
            user-select: none;
        }
        
        .cart-item-remove-btn {
            background: none;
            border: none;
            color: rgba(255,255,255,0.12);
            cursor: pointer;
            padding: 4px;
            transition: all 0.3s ease;
            border-radius: 8px;
            line-height: 1;
            touch-action: manipulation;
        }
        .cart-item-remove-btn:active { transform: scale(0.85); }
        .cart-item-remove-btn:hover {
            color: #ef4444;
            background: rgba(239,68,68,0.08);
        }
        
        .cart-item-sku-badge {
            font-family: var(--font-subtitle);
            font-size: 7px;
            font-weight: 600;
            color: rgba(255,255,255,0.2);
            letter-spacing: 0.04em;
            text-transform: uppercase;
            background: rgba(255,255,255,0.02);
            padding: 1px 8px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.02);
        }
        
        /* ==================== DETAILS TOGGLE - MOBILE FRIENDLY ==================== */
        .cart-item-details-toggle {
            background: none;
            border: none;
            color: rgba(255,255,255,0.2);
            cursor: pointer;
            padding: 2px 6px;
            font-size: 7px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            transition: all 0.3s ease;
            font-family: var(--font-subtitle);
            touch-action: manipulation;
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .cart-item-details-toggle:active { transform: scale(0.9); }
        .cart-item-details-toggle:hover {
            color: rgba(255,255,255,0.5);
            background: rgba(255,255,255,0.04);
        }
        .cart-item-details-toggle .toggle-icon {
            transition: transform 0.3s ease;
            font-size: 6px;
        }
        .cart-item-details-toggle .toggle-icon.open {
            transform: rotate(180deg);
        }
        
        .cart-item-extra-details {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, margin 0.3s ease;
            opacity: 0;
            margin-top: 0;
        }
        .cart-item-extra-details.open {
            max-height: 200px;
            opacity: 1;
            margin-top: 6px;
        }
        .cart-item-extra-details-inner {
            display: flex;
            flex-wrap: wrap;
            gap: 3px 8px;
            padding: 6px 8px;
            background: rgba(255,255,255,0.03);
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.03);
        }
        .cart-item-extra-details-inner span {
            font-size: 6px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(255,255,255,0.3);
            font-family: var(--font-subtitle);
            font-weight: 500;
        }
        .cart-item-extra-details-inner span::before {
            content: '•';
            margin-right: 4px;
            color: rgba(255,255,255,0.08);
        }
        .cart-item-extra-details-inner span:first-child::before { display: none; }
        
        .cart-item-category-tag {
            font-size: 6px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(255,255,255,0.12);
            font-family: var(--font-body);
            font-weight: 500;
            background: rgba(255,255,255,0.02);
            padding: 1px 8px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.02);
            display: inline-block;
        }
        
        .cart-item-bottom-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 4px;
            flex-wrap: wrap;
            gap: 4px;
        }

        /* ==================== TOAST ==================== */
        #toast > div {
            background: rgba(255,255,255,0.85) !important; backdrop-filter: blur(40px) saturate(250%) !important;
            -webkit-backdrop-filter: blur(40px) saturate(250%) !important; border: 1px solid rgba(255,255,255,0.55) !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important; border-radius: 20px !important; color: var(--primary) !important;
        }
        #toast-icon { background: var(--primary) !important; color: var(--accent) !important; }

        /* ==================== FOOTER - COMPLETE DYNAMIC SYSTEM ==================== */
        #main-footer {
            width: 100% !important;
            position: relative;
            clear: both;
            font-family: var(--font-body);
        }
        #main-footer h4, #main-footer h5 { color: inherit; transition: opacity 0.25s ease; }
        #main-footer a { color: inherit; transition: opacity 0.25s ease; }
        #main-footer a:hover { opacity: 0.5; }
        
        /* Social Icons - Premium Monochrome */
        .social-icon-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.06);
            color: rgba(255,255,255,0.5);
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
            position: relative;
            overflow: hidden;
        }
        .social-icon-link::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.35s ease;
        }
        .social-icon-link:hover {
            transform: translateY(-3px) scale(1.05);
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.15);
            color: #ffffff;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        .social-icon-link:hover::before { opacity: 1; }
        .social-icon-link svg {
            width: 16px;
            height: 16px;
            position: relative;
            z-index: 1;
            transition: transform 0.3s ease;
        }
        .social-icon-link:hover svg { transform: scale(1.1); }
        
        .social-icons-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: flex-start;
        }
        
        @media (max-width: 640px) {
            .social-icon-link {
                width: 34px;
                height: 34px;
            }
            .social-icon-link svg {
                width: 14px;
                height: 14px;
            }
            .social-icons-grid {
                gap: 6px;
            }
        }
        
        /* Footer Select Styling */
        #main-footer select {
            font-family: var(--font-body);
            font-size: 10px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: inherit;
            border-radius: 8px;
            padding: 6px 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
            opacity: 0.7;
        }
        #main-footer select:hover {
            background: rgba(255,255,255,0.08);
            border-color: rgba(255,255,255,0.2);
            opacity: 0.9;
        }
        #main-footer select:focus {
            border-color: rgba(255,255,255,0.3);
        }
        #main-footer select option {
            background: #1a1a1a;
            color: #ffffff;
        }
        
        /* Footer App Buttons */
        .footer-app-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.06);
            color: inherit;
            padding: 6px 12px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s ease;
            font-family: var(--font-subtitle);
            letter-spacing: 0.03em;
            opacity: 0.7;
        }
        .footer-app-btn:hover {
            background: rgba(255,255,255,0.15);
            border-color: rgba(255,255,255,0.15);
            opacity: 1;
            transform: translateY(-1px);
        }
        
        /* Footer Bottom Bar */
        .footer-bottom-bar {
            border-top: 1px solid rgba(255,255,255,0.06);
            padding-top: 20px;
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            opacity: 0.4;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }
        @media (min-width: 768px) {
            .footer-bottom-bar {
                flex-direction: row;
            }
        }
        .footer-bottom-bar a {
            font-weight: 700;
            transition: color 0.3s ease;
        }
        .footer-bottom-bar a:hover { opacity: 1; }
        
        /* Footer Payment QR Code */
        .footer-qr-code {
            width: 60px;
            height: 60px;
            object-fit: contain;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.06);
            background: #ffffff;
            padding: 4px;
            transition: transform 0.3s ease;
            cursor: pointer;
        }
        .footer-qr-code:hover {
            transform: scale(1.1);
        }
        
        /* Footer Account Number */
        .footer-account-number {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            letter-spacing: 0.05em;
            opacity: 0.4;
            background: rgba(255,255,255,0.03);
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
            margin-top: 2px;
        }
        
        /* Footer Cert Badge */
        .footer-cert-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 8px;
            padding: 6px 10px;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        .footer-cert-badge:hover {
            background: rgba(255,255,255,0.06);
            border-color: rgba(255,255,255,0.1);
        }
        
        /* Footer RTL Support */
        [dir="rtl"] #main-footer {
            direction: rtl;
            text-align: right;
        }
        [dir="rtl"] .footer-bottom-bar {
            direction: rtl;
        }
        
        /* Layout Styles */
        .footer-layout-centered {
            text-align: center;
        }
        .footer-layout-centered .social-icons-grid {
            justify-content: center;
        }
        .footer-layout-minimal {
            padding: 20px 0;
        }
        .footer-layout-expanded {
            padding: 40px 0;
        }
        
        /* Footer contact icon */
        .footer-contact-icon {
            display: inline-block;
            width: 10px;
            text-align: center;
            margin-right: 4px;
            opacity: 0.4;
        }
        
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
            min-width: 16px !important;
            height: 16px !important;
            padding: 0 4px !important;
        }

        /* ==================== CART EMPTY STATE ==================== */
        .cart-empty-state {
            text-align: center;
            padding: 40px 20px;
        }
        .cart-empty-state i {
            font-size: 44px;
            color: rgba(255,255,255,0.05);
            margin-bottom: 16px;
        }
        .cart-empty-state h3 {
            font-family: var(--font-heading);
            font-size: 16px;
            font-weight: 700;
            color: rgba(255,255,255,0.4);
            margin-bottom: 4px;
        }
        .cart-empty-state p {
            font-family: var(--font-body);
            font-size: 11px;
            color: rgba(255,255,255,0.15);
        }

        /* ==================== CART CHECKOUT SUMMARY ==================== */
        .cart-summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 4px 0;
        }
        .cart-summary-row .label { color: rgba(255,255,255,0.35); }
        .cart-summary-row .value { font-weight: 700; color: rgba(255,255,255,0.85); }
        .cart-summary-total {
            border-top: 1px solid rgba(255,255,255,0.06);
            padding-top: 10px;
            margin-top: 4px;
        }
        .cart-summary-total .label {
            font-size: 11px;
            font-weight: 700;
            color: rgba(255,255,255,0.5);
        }
        .cart-summary-total .value {
            font-size: 18px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: -0.01em;
        }
        .cart-checkout-btn {
            padding: 14px !important;
            font-size: 10px !important;
            border-radius: 14px !important;
            letter-spacing: 0.08em !important;
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

    // Fetch all data including announcement
    const [menuItems, categories, subcategories, announcement] = await Promise.all([
        fetchMenuItems(),
        fetchCategories(),
        fetchSubcategories(),
        fetchAnnouncement()
    ]);
    
    allCategories = categories;
    allSubcategories = subcategories;
    announcementData = announcement;
    const menuTree = buildMenuTree(menuItems);
    
    const isBarDismissed = localStorage.getItem('jabiyen_announcement_hidden') === 'true';
    const hasAnnouncement = announcementData && announcementData.message;
    const shouldShowBar = hasAnnouncement && !isBarDismissed;
    
    if (isBarDismissed) {
        document.body.classList.add('announcement-dismissed');
    }

    // Build announcement bar HTML dynamically from DB
    let announcementHTML = '';
    if (hasAnnouncement) {
        const bgColor = announcementData.bg_color || '#000000';
        const textColor = announcementData.text_color || '#ffffff';
        const message = announcementData.message || '';
        const linkUrl = announcementData.link_url || '';
        const linkTitle = announcementData.link_title || '';
        
        let linkHTML = '';
        if (linkUrl && linkTitle) {
            linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkTitle}</a>`;
        }
        
        announcementHTML = `
        <div class="top-announcement-bar ${shouldShowBar ? '' : 'bar-hidden'}" 
             id="top-announcement-bar" 
             style="background: ${bgColor} !important; color: ${textColor} !important;">
            <span id="announcement-text">${message} ${linkHTML}</span>
            <button class="announcement-close-btn" onclick="dismissAnnouncementBar()" aria-label="Close Announcement">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        `;
    } else {
        document.body.classList.add('announcement-dismissed');
        announcementHTML = `
        <div class="top-announcement-bar bar-hidden" id="top-announcement-bar">
            <span id="announcement-text"></span>
        </div>
        `;
    }

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
        <div class="side-menu-scroll" id="sideMenuContent">
            ${renderUnifiedDrawerMenu(menuTree)}
        </div>
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span id="wish-count" class="absolute text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                
                <a href="/cart" onclick="toggleCart();return false;" class="header-icon-btn" aria-label="Cart">
                    <svg width="17" height="19" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6H18V18C18 19.1046 17.1046 20 16 20H3C1.89543 20 1 19.1046 1 18V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                        <path d="M5 6C5 3.5 6.5 1 9.5 1C12.5 1 14 3.5 14 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                    <span id="cart-count" class="absolute text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                
                <button onclick="openSideMenu()" class="header-icon-btn" aria-label="Open Navigation Menu">
                    <svg width="20" height="13" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1H21M1 7.5H21M1 14H21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
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
            <a href="/checkout" class="w-full py-3.5 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] transition text-center block hover:bg-neutral-100 no-underline shadow-lg cart-checkout-btn">Execute Checkout</a>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// ============================================================================
// ANNOUNCEMENT LOGIC - Updated to handle DB data
// ============================================================================
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
function getSocialIconHTML(platform, link) {
    const icons = {
        'facebook': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        'instagram': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.908 12.2384 16.0396 11.4077 15.9059C10.5771 15.7722 9.80971 15.3801 9.21479 14.7851C8.61987 14.1902 8.2278 13.4228 8.09412 12.5922C7.96044 11.7615 8.092 10.9098 8.47026 10.1583C8.84852 9.40678 9.45418 8.7937 10.2009 8.4062C10.9477 8.0187 11.7978 7.87652 12.63 8C13.4789 8.12583 14.2648 8.52151 14.8716 9.12836C15.4785 9.73521 15.8742 10.5211 16 11.37Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`
        },
        'youtube': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8387 5.15941C21.4982 4.80824 21.0708 4.55518 20.6 4.43C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92916 4.58518 2.50178 4.83824 2.16132 5.18941C1.82085 5.54057 1.57882 5.97541 1.46 6.45C1.14521 8.17418 0.991095 9.92534 1 11.68C0.991095 13.4347 1.14521 15.1858 1.46 16.91C1.57882 17.3846 1.82085 17.8194 2.16132 18.1706C2.50178 18.5218 2.92916 18.7748 3.4 18.9C5.12 19.36 12 19.36 12 19.36C12 19.36 18.88 19.36 20.6 18.9C21.0708 18.7748 21.4982 18.5218 21.8387 18.1706C22.1792 17.8194 22.4212 17.3846 22.54 16.91C22.8548 15.1858 23.0089 13.4347 23 11.68C23.0089 9.92534 22.8548 8.17418 22.54 6.42Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.75 15.02L15.5 11.68L9.75 8.34V15.02Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        'tiktok': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12V8.5C9 6.01472 11.0147 4 13.5 4H16M9 20C7.34315 20 6 18.6569 6 17C6 15.3431 7.34315 14 9 14C10.6569 14 12 15.3431 12 17V4M20 8V12C18.3431 12 17 10.6569 17 9V8H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        'x': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor"/></svg>`
        },
        'pinterest': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16C8 16 6 10 6 8C6 4 9 2 12 2C16 2 18 5 18 8C18 12 16 16 13 16C11 16 10 14 10 14M10 14L8 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg>`
        },
        'threads': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M16.5 10.5C16.5 10.5 15.5 8 12 8C8.5 8 7.5 10.5 7.5 12.5C7.5 14.5 8.5 16.5 12 16.5C14.5 16.5 15.5 14.5 15.5 13.5C15.5 12.5 14.5 12 13 12C11.5 12 10.5 12.5 10.5 13.5C10.5 14.5 11.5 15 12 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
        },
        'whatsapp': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C9.38318 21 7.42019 20.3098 5.86667 19.1333L2 20L2.86667 16.1333C1.69019 14.5798 1 12.6168 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8.5C8 8.5 8.5 7.5 9.5 7.5C10.5 7.5 11 8 11.5 9C12 10 12.5 10.5 13 11C13.5 11.5 14 12 14.5 12.5C15 13 15.5 13.5 16 14.5C16.5 15.5 16 16 16 16L15 16.5C14.5 16.5 13.5 16 13 15.5C12.5 15 11 13.5 10.5 13C10 12.5 9.5 12 9 11.5C8.5 11 8 10.5 8 9.5C8 8.5 8 8.5 8 8.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`
        },
        'linkedin': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 12V21H18V12C18 10.5 17.5 9 16 9C14.5 9 14 10.5 14 12V21H10V9H14V11C14 11 14.5 9.5 16.5 9.5C18.5 9.5 22 10.5 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`
        },
        'email': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        'google': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M12 6V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/></svg>`
        },
        'maps': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C12 22 20 16 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 16 12 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/></svg>`
        },
        'linktree': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2V14M12 14L8 10M12 14L16 10M12 22V18M8 18L12 14M16 18L12 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="6" r="2" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="14" r="1" fill="currentColor"/></svg>`
        },
        'messenger': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 14.5 2.8 16.8 4.2 18.7L3.5 21.5L6.4 20.2C8.1 21.3 10.1 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 13L10 9.5L14 12.5L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        }
    };
    
    const iconData = icons[platform];
    if (!iconData) return null;
    
    return `
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${platform.charAt(0).toUpperCase() + platform.slice(1)}">
            ${iconData.svg}
        </a>
    `;
}

// ============================================================================
// FOOTER - COMPLETE DATABASE-DRIVEN (ALL 11 TABLES - ALL COLUMNS - FIXED CONTENT MERGE)
// ============================================================================
async function renderFooter() {
    if (document.getElementById('main-footer')) return;
    
    try {
        // Fetch complete footer data from API
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error('Footer API failed');
        const footerData = await response.json();
        
        const { 
            content = [], 
            socialLinks = [], 
            menus = [], 
            paymentMethods = [], 
            shippingPartners = [], 
            certifications = [], 
            appLinks = [], 
            countries = [], 
            trustBadges = [], 
            settings = null 
        } = footerData;
        
        // =====================================================================
        // FOOTER SETTINGS (footer_settings table - ALL columns)
        // =====================================================================
        const bgColor = settings?.background_color || '#1a1a1a';
        const textColor = settings?.text_color || '#ffffff';
        const copyrightText = settings?.copyright_text || '© 2025 JayenWare. All Rights Reserved.';
        const layoutStyle = settings?.layout_style || 'standard';
        const theme = settings?.theme || 'dark';
        const version = settings?.version || '1.0';
        const showSocial = settings?.show_social_links !== false;
        const showPayment = settings?.show_payment_methods !== false;
        const showApp = settings?.show_app_links !== false;
        const showCountry = settings?.show_country_selector !== false;
        const customCSS = settings?.custom_css || '';
        
        // =====================================================================
        // FOOTER CONTENT - Merge ALL content rows (FIXED)
        // =====================================================================
        // Instead of just taking 'brand' and 'contact', we merge ALL content rows
        // This ensures no data is missed - any section_name with data will be used
        
        const mergedContent = {};
        content.forEach(c => {
            if (c.title) mergedContent.title = mergedContent.title || c.title;
            if (c.description) mergedContent.description = mergedContent.description || c.description;
            if (c.logo_url) mergedContent.logo_url = mergedContent.logo_url || c.logo_url;
            if (c.email) mergedContent.email = mergedContent.email || c.email;
            if (c.phone) mergedContent.phone = mergedContent.phone || c.phone;
            if (c.address) mergedContent.address = mergedContent.address || c.address;
            if (c.working_hours) mergedContent.working_hours = mergedContent.working_hours || c.working_hours;
            if (c.copyright_text) mergedContent.copyright_text = mergedContent.copyright_text || c.copyright_text;
            if (c.section_name) mergedContent.section_name = mergedContent.section_name || c.section_name;
        });
        
        // Also check individual sections for specific data
        const brandSection = content.find(c => c.section_name === 'brand') || {};
        const contactSection = content.find(c => c.section_name === 'contact') || {};
        const aboutSection = content.find(c => c.section_name === 'about') || {};
        const infoSection = content.find(c => c.section_name === 'info') || {};
        
        // Build final values with priority: specific section > merged > defaults
        const brandTitle = brandSection.title || mergedContent.title || 'JABIYEN';
        const brandDesc = brandSection.description || aboutSection.description || mergedContent.description || 'Premium lifestyle apparel architecture.';
        const brandLogo = brandSection.logo_url || mergedContent.logo_url || '/logo.png';
        const brandCopyright = brandSection.copyright_text || infoSection.copyright_text || mergedContent.copyright_text || copyrightText;
        
        // Contact info - check ALL sections for these values
        const contactEmail = contactSection.email || infoSection.email || brandSection.email || mergedContent.email || '';
        const contactPhone = contactSection.phone || infoSection.phone || brandSection.phone || mergedContent.phone || '';
        const contactAddress = contactSection.address || infoSection.address || brandSection.address || mergedContent.address || '';
        const contactHours = contactSection.working_hours || infoSection.working_hours || brandSection.working_hours || mergedContent.working_hours || '';
        
        // =====================================================================
        // SOCIAL LINKS (footer_social_links table - ALL columns)
        // =====================================================================
        let socialIconsHTML = '';
        if (showSocial && socialLinks.length > 0) {
            socialIconsHTML = socialLinks
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(link => {
                    const platform = (link.platform_name || '').toLowerCase().replace(/\s+/g, '');
                    const hoverTitle = link.hover_title || link.platform_name || '';
                    
                    // If platform_icon is provided as custom URL, use img instead of SVG
                    if (link.platform_icon && link.platform_icon.startsWith('http')) {
                        return `
                        <a href="${link.link_url || '#'}" target="_blank" rel="noopener noreferrer" 
                           class="social-icon-link" aria-label="${link.platform_name}" title="${hoverTitle}">
                            <img src="${link.platform_icon}" alt="${link.platform_name}" style="width:16px;height:16px;object-fit:contain;">
                        </a>`;
                    }
                    
                    const iconHTML = getSocialIconHTML(platform, link.link_url || '#');
                    if (!iconHTML) return '';
                    
                    return iconHTML.replace(
                        `aria-label="${platform.charAt(0).toUpperCase() + platform.slice(1)}"`, 
                        `aria-label="${link.platform_name}" title="${hoverTitle}"`
                    );
                }).filter(html => html !== '').join('');
        }
        
        // =====================================================================
        // PAYMENT METHODS (footer_payment_methods table - ALL columns)
        // =====================================================================
        let paymentHTML = '';
        if (showPayment && paymentMethods.length > 0) {
            const sortedPayments = [...paymentMethods].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            paymentHTML = `
            <div class="mt-4">
                <h5 class="text-[10px] uppercase tracking-widest mb-3" style="opacity:0.4;">Payment Methods</h5>
                <div class="flex flex-wrap gap-2 items-center">
                    ${sortedPayments.map(pm => {
                        let pmHTML = '';
                        if (pm.icon_url) {
                            pmHTML += `<img src="${pm.icon_url}" alt="${pm.name}" class="h-6 w-auto opacity-60 hover:opacity-100 transition-opacity" title="${pm.name}">`;
                        } else {
                            pmHTML += `<span class="text-[9px] opacity-50">${pm.name}</span>`;
                        }
                        if (pm.account_number) {
                            pmHTML += `<span class="footer-account-number">${pm.account_number}</span>`;
                        }
                        if (pm.qr_code_url) {
                            pmHTML += `<img src="${pm.qr_code_url}" alt="${pm.name} QR" class="footer-qr-code ml-1" title="Scan QR for ${pm.name}" onclick="window.open('${pm.qr_code_url}', '_blank')">`;
                        }
                        return `<div class="flex flex-col items-center gap-1">${pmHTML}</div>`;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // SHIPPING PARTNERS (footer_shipping_partners table - ALL columns)
        // =====================================================================
        let shippingHTML = '';
        if (shippingPartners.length > 0) {
            const sortedShipping = [...shippingPartners].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            shippingHTML = `
            <div class="mt-4">
                <h5 class="text-[10px] uppercase tracking-widest mb-3" style="opacity:0.4;">Shipping Partners</h5>
                <div class="flex flex-wrap gap-2 items-center">
                    ${sortedShipping.map(sp => {
                        return sp.icon_url 
                            ? `<img src="${sp.icon_url}" alt="${sp.name}" class="h-5 w-auto opacity-50 hover:opacity-80 transition-opacity" title="${sp.name}">`
                            : `<span class="text-[9px] opacity-40">${sp.name}</span>`;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // CERTIFICATIONS (footer_certifications table - ALL columns)
        // =====================================================================
        let certHTML = '';
        if (certifications.length > 0) {
            const sortedCerts = [...certifications].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            certHTML = `
            <div class="mt-4">
                <h5 class="text-[10px] uppercase tracking-widest mb-3" style="opacity:0.4;">Certifications</h5>
                <div class="flex flex-wrap gap-2 items-center">
                    ${sortedCerts.map(cert => {
                        const badgeContent = cert.badge_url 
                            ? `<img src="${cert.badge_url}" alt="${cert.name}" class="h-8 w-auto opacity-60 hover:opacity-90 transition-opacity">`
                            : `<span class="text-[9px] opacity-40">${cert.name}</span>`;
                        
                        if (cert.link_url) {
                            return `<a href="${cert.link_url}" target="_blank" rel="noopener noreferrer" class="footer-cert-badge" title="${cert.name}">${badgeContent}<span class="text-[8px] opacity-50">${cert.name}</span></a>`;
                        }
                        return `<div class="footer-cert-badge" title="${cert.name}">${badgeContent}<span class="text-[8px] opacity-50">${cert.name}</span></div>`;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // APP LINKS (footer_app_links table - ALL columns)
        // =====================================================================
        let appHTML = '';
        if (showApp && appLinks.length > 0) {
            const sortedApps = [...appLinks].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            appHTML = `
            <div class="mt-4">
                <h5 class="text-[10px] uppercase tracking-widest mb-3" style="opacity:0.4;">Download Our App</h5>
                <div class="flex flex-wrap gap-2">
                    ${sortedApps.map(app => {
                        let buttons = '';
                        const iconImg = app.icon_url ? `<img src="${app.icon_url}" alt="${app.platform_name}" class="w-4 h-4 object-contain">` : '';
                        
                        if (app.app_store_url) {
                            buttons += `<a href="${app.app_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn" title="Download on App Store">
                                ${iconImg || '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>'}
                                App Store
                            </a>`;
                        }
                        if (app.play_store_url) {
                            buttons += `<a href="${app.play_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn" title="Get it on Google Play">
                                ${iconImg || '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M14.94 11.5L17.5 8.94C17.66 8.78 17.66 8.53 17.5 8.37L16.14 7.01C15.98 6.85 15.73 6.85 15.57 7.01L13 9.58L10.43 7.01C10.27 6.85 10.02 6.85 9.86 7.01L8.5 8.37C8.34 8.53 8.34 8.78 8.5 8.94L11.06 11.5L8.5 14.06C8.34 14.22 8.34 14.47 8.5 14.63L9.86 15.99C10.02 16.15 10.27 16.15 10.43 15.99L13 13.42L15.57 15.99C15.73 16.15 15.98 16.15 16.14 15.99L17.5 14.63C17.66 14.47 17.66 14.22 17.5 14.06L14.94 11.5Z"/></svg>'}
                                Play Store
                            </a>`;
                        }
                        return buttons;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // COUNTRY SELECTOR (footer_country_selector table - ALL columns)
        // =====================================================================
        let countryHTML = '';
        if (showCountry && countries.length > 0) {
            const sortedCountries = [...countries].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            const defaultCountry = sortedCountries.find(c => c.is_default) || sortedCountries[0];
            
            countryHTML = `
            <div class="mt-4">
                <h5 class="text-[10px] uppercase tracking-widest mb-3" style="opacity:0.4;">Country & Language</h5>
                <select onchange="if(this.value) window.location.href=this.value" aria-label="Select country and language">
                    ${sortedCountries.map(country => {
                        const flagHTML = country.flag_url ? `<img src="${country.flag_url}" class="w-4 h-3 inline-block mr-1" alt="${country.country_code}">` : '';
                        const currencyDisplay = country.currency_symbol || (country.currency_code ? country.currency_code + ' ' : '');
                        const langDisplay = country.language_name || (country.language_code ? country.language_code.toUpperCase() : '');
                        const label = `${flagHTML}${country.country_name} ${currencyDisplay}${langDisplay ? '(' + langDisplay + ')' : ''}`;
                        const selected = country.is_default ? 'selected' : '';
                        return `<option value="?country=${country.country_code}&lang=${country.language_code || ''}" ${selected}>${label.trim()}</option>`;
                    }).join('')}
                </select>
                ${defaultCountry?.exchange_rate && defaultCountry.exchange_rate !== 1 ? 
                    `<p class="text-[7px] opacity-30 mt-1">Exchange Rate: 1 USD = ${defaultCountry.currency_symbol || ''}${defaultCountry.exchange_rate}</p>` : ''}
            </div>`;
        }
        
        // =====================================================================
        // TRUST BADGES (footer_trust_badges table - ALL columns)
        // =====================================================================
        let badgesHTML = '';
        if (trustBadges.length > 0) {
            const sortedBadges = [...trustBadges].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            badgesHTML = `
            <div class="mt-4">
                <h5 class="text-[10px] uppercase tracking-widest mb-3" style="opacity:0.4;">Trust & Security</h5>
                <div class="flex flex-wrap gap-2">
                    ${sortedBadges.map(badge => {
                        const badgeImg = badge.badge_url 
                            ? `<img src="${badge.badge_url}" alt="${badge.title}" class="h-7 w-auto opacity-60 hover:opacity-90 transition-opacity">`
                            : `<span class="text-[8px] opacity-40">${badge.title}</span>`;
                        return `
                        <div class="text-center" title="${badge.title}${badge.subtitle ? ': ' + badge.subtitle : ''}">
                            ${badgeImg}
                            ${badge.subtitle ? `<p class="text-[6px] opacity-30 mt-0.5">${badge.subtitle}</p>` : ''}
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // MENUS & QUICK LINKS (footer_menus + footer_quick_links - ALL columns)
        // =====================================================================
        let menuColumnsHTML = '';
        if (menus.length > 0) {
            const sortedMenus = [...menus].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            menuColumnsHTML = sortedMenus.map(menu => {
                const links = menu.links || [];
                const sortedLinks = [...links].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                
                const topLevelLinks = sortedLinks.filter(l => !l.parent_id);
                const childLinks = sortedLinks.filter(l => l.parent_id);
                
                return `
                <div>
                    <h5 class="text-[10px] uppercase tracking-widest mb-3" style="opacity:0.4;">${menu.title || 'Links'}</h5>
                    <ul class="space-y-1.5 text-[10px] list-none p-0" style="opacity:0.7;">
                        ${topLevelLinks.map(link => {
                            const target = link.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';
                            const iconHTML = link.icon_class ? `<i class="${link.icon_class} mr-1"></i>` : '';
                            const descHTML = link.description ? `<span class="block text-[8px]" style="opacity:0.4;">${link.description}</span>` : '';
                            
                            const children = childLinks.filter(cl => cl.parent_id === link.id);
                            let childrenHTML = '';
                            if (children.length > 0) {
                                childrenHTML = `
                                <ul class="list-none p-0 ml-3 mt-1 space-y-0.5">
                                    ${children.map(child => {
                                        const childTarget = child.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';
                                        const childIcon = child.icon_class ? `<i class="${child.icon_class} mr-1"></i>` : '';
                                        const childDesc = child.description ? `<span class="block text-[7px]" style="opacity:0.3;">${child.description}</span>` : '';
                                        return `<li><a href="${child.link_url || '#'}" class="no-underline" ${childTarget}>${childIcon}${child.title || ''}</a>${childDesc}</li>`;
                                    }).join('')}
                                </ul>`;
                            }
                            
                            return `<li><a href="${link.link_url || '#'}" class="no-underline" ${target}>${iconHTML}${link.title || ''}</a>${descHTML}${childrenHTML}</li>`;
                        }).join('')}
                    </ul>
                </div>`;
            }).join('');
        }
        
        // =====================================================================
        // LAYOUT CLASS
        // =====================================================================
        let layoutClass = '';
        switch(layoutStyle) {
            case 'centered': layoutClass = 'footer-layout-centered'; break;
            case 'minimal': layoutClass = 'footer-layout-minimal'; break;
            case 'expanded': layoutClass = 'footer-layout-expanded'; break;
            default: layoutClass = '';
        }
        
        // =====================================================================
        // BUILD COMPLETE FOOTER HTML
        // =====================================================================
        const footerHTML = `
        <footer class="pt-12 pb-6 ${layoutClass}" id="main-footer" style="background: ${bgColor} !important; color: ${textColor} !important;">
            ${customCSS ? `<style>${customCSS}</style>` : ''}
            <div class="w-full px-4 lg:px-12">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                    <!-- Brand Column -->
                    <div class="md:col-span-1">
                        ${brandLogo ? `<img src="${brandLogo}" alt="${brandTitle}" class="h-8 w-auto mb-3 opacity-80">` : ''}
                        <h4 class="text-sm font-bold tracking-widest mb-3">${brandTitle}</h4>
                        <p class="text-[10px] leading-relaxed mb-4" style="opacity:0.5;">${brandDesc}</p>
                        
                        ${showSocial && socialIconsHTML ? `
                        <div class="social-icons-grid mt-3">
                            ${socialIconsHTML}
                        </div>` : ''}
                        
                        ${appHTML}
                        ${countryHTML}
                    </div>
                    
                    <!-- Dynamic Menu Columns -->
                    ${menuColumnsHTML}
                    
                    <!-- Contact Column -->
                    <div>
                        <h5 class="text-[10px] uppercase tracking-widest mb-3" style="opacity:0.4;">Direct Contact</h5>
                        ${contactEmail ? `<p class="text-[10px]" style="opacity:0.6;"><span class="footer-contact-icon">✉</span>${contactEmail}</p>` : ''}
                        ${contactPhone ? `<p class="text-[10px] mt-1" style="opacity:0.4;"><span class="footer-contact-icon">☎</span>${contactPhone}</p>` : ''}
                        ${contactAddress ? `<p class="text-[10px] mt-1" style="opacity:0.4;"><span class="footer-contact-icon">📍</span>${contactAddress}</p>` : ''}
                        ${contactHours ? `<p class="text-[10px] mt-1" style="opacity:0.3;"><span class="footer-contact-icon">🕐</span>${contactHours}</p>` : ''}
                        
                        ${paymentHTML}
                        ${shippingHTML}
                        ${certHTML}
                        ${badgesHTML}
                    </div>
                </div>
                
                <!-- Bottom Bar -->
                <div class="footer-bottom-bar">
                    <p>Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer">BINZEO Infrastructure</a> ${version ? 'v' + version : ''}</p>
                    <p>${brandCopyright}</p>
                </div>
            </div>
        </footer>
        `;
        
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        
        // Apply RTL if default country has is_rtl
        if (countries.length > 0) {
            const defaultCountry = countries.find(c => c.is_default) || countries[0];
            if (defaultCountry?.is_rtl) {
                const footerEl = document.getElementById('main-footer');
                if (footerEl) footerEl.setAttribute('dir', 'rtl');
            }
        }
        
    } catch (error) {
        console.error('Footer render error:', error);
        // Fallback minimal footer
        const fallbackHTML = `
        <footer class="pt-12 pb-6" id="main-footer" style="background: #1a1a1a !important; color: #ffffff !important;">
            <div class="w-full px-4 lg:px-12 text-center">
                <p class="text-[10px] opacity-50">© ${new Date().getFullYear()} JayenWare. All Rights Reserved.</p>
                <p class="text-[8px] opacity-30 mt-1">Powered by BINZEO Infrastructure v1.0</p>
            </div>
        </footer>`;
        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
    }
}

// ============================================================================
// TOAST SYSTEM
// ============================================================================
function showToast(text, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed bottom-5 right-5 z-[100] transition-transform duration-300 translate-x-[120%]';
        toast.innerHTML = `
            <div class="shadow-xl p-3.5 flex items-center gap-3 min-w-[240px]">
                <span id="toast-icon" class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0"></span>
                <p id="toast-text" class="text-[10px] font-bold flex-grow tracking-wide" style="font-family: var(--font-body);"></p>
                <button onclick="hideToast()" class="drawer-close-btn text-gray-400 hover:text-black shrink-0"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            </div>
        `;
        document.body.appendChild(toast);
    }
    document.getElementById('toast-text').innerText = text;
    const iconEl = document.getElementById('toast-icon');
    iconEl.innerHTML = type === 'success' ? '✓' : '!';
    toast.style.transform = 'translateX(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.transform = 'translateX(120%)'; }, 3000);
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
// ============================================================================

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) renderCartItems();
    }
}

// ============================================================================
// TOGGLE DETAILS - Show/Hide Extra Product Details
// ============================================================================
window.toggleCartItemDetails = function(idx) {
    const details = document.getElementById(`cart-details-${idx}`);
    const icon = document.getElementById(`cart-toggle-icon-${idx}`);
    if (details) {
        details.classList.toggle('open');
        if (icon) icon.classList.toggle('open');
    }
};

// ============================================================================
// ADD TO CART
// ============================================================================
window.addToCart = function(productId, options = {}) {
    if (!productId || !options.title) {
        console.error('Product ID and Title are required');
        return;
    }
    
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
            variant_id: options.variant_id || null,
            variant_name: options.variant_name || null,
            color_id: options.color_id || null,
            color_name: options.color_name || null,
            color_code: options.color_code || null,
            color_image: options.color_image || null,
            size_id: options.size_id || null,
            size_name: options.size_name || null,
            main_barcode: options.main_barcode || options.barcode || null,
            variant_barcode: options.variant_barcode || null,
            sku: options.sku || null,
            category: options.category || null,
            subcategory: options.subcategory || null,
            stock: options.stock || null,
            weight: options.weight || null,
            fabric_type: options.fabric_type || null,
            gsm_type: options.gsm_type || null,
            fit_type: options.fit_type || null,
            gender: options.gender || null,
            print_type: options.print_type || null,
            quantity: options.quantity || 1
        };
        
        cart.push(newItem);
        showToast(`Added: ${options.title}${variantDisplay}`, 'success');
    }
    
    saveCart();
    renderCartItems();
};

// ============================================================================
// REMOVE FROM CART
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
// RENDER CART ITEMS - MOBILE OPTIMIZED WITH TOGGLE DETAILS
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
        
        let variantBadges = [];
        if (item.color_name) {
            const colorDot = item.color_code ? 
                `<span class="color-dot" style="background:${item.color_code};"></span>` : '';
            variantBadges.push(`<span class="cart-item-variant-badge">${colorDot}${item.color_name}</span>`);
        }
        if (item.size_name) {
            variantBadges.push(`<span class="cart-item-variant-badge">${item.size_name}</span>`);
        }
        if (item.sku) {
            variantBadges.push(`<span class="cart-item-sku-badge">SKU: ${item.sku}</span>`);
        }
        
        let barcodeParts = [];
        if (item.main_barcode) barcodeParts.push(`Main: ${item.main_barcode}`);
        if (item.variant_barcode) barcodeParts.push(`Var: ${item.variant_barcode}`);
        const barcodeText = barcodeParts.length ? barcodeParts.join(' | ') : '';
        
        let extraDetails = [];
        if (item.fabric_type) extraDetails.push(`Fabric: ${item.fabric_type}`);
        if (item.fit_type) extraDetails.push(`Fit: ${item.fit_type}`);
        if (item.gsm_type) extraDetails.push(`GSM: ${item.gsm_type}`);
        if (item.weight) extraDetails.push(`Weight: ${item.weight}g`);
        if (item.gender) extraDetails.push(`Gender: ${item.gender}`);
        if (item.print_type) extraDetails.push(`Print: ${item.print_type}`);
        
        let categoryText = '';
        if (item.category) {
            categoryText = item.category;
            if (item.subcategory) categoryText += ` / ${item.subcategory}`;
        }
        
        const hasExtraDetails = extraDetails.length > 0 || categoryText || barcodeText;
        
        return `
        <div class="cart-item-card">
            <div class="flex gap-3">
                <img src="${item.img}" class="cart-item-image" alt="${item.title}" onerror="this.src='/logo.png'">
                
                <div class="flex-grow min-w-0">
                    <div class="flex items-start justify-between gap-1">
                        <h4 class="cart-item-title">${item.title}</h4>
                    </div>
                    
                    <div class="cart-item-variant">${variantBadges.join('')}</div>
                    
                    <div class="cart-item-bottom-row">
                        <div class="flex items-center gap-2">
                            <span class="cart-item-price">৳${itemTotal.toFixed(2)}</span>
                            ${item.old_price ? `<span class="cart-item-old-price">৳${(item.old_price * item.quantity).toFixed(2)}</span>` : ''}
                        </div>
                        
                        <div class="cart-item-quantity-control">
                            <button onclick="updateCartQuantity(${idx}, ${(item.quantity || 1) - 1})" aria-label="Decrease">−</button>
                            <span class="qty-num">${item.quantity || 1}</span>
                            <button onclick="updateCartQuantity(${idx}, ${(item.quantity || 1) + 1})" aria-label="Increase">+</button>
                        </div>
                    </div>
                    
                    ${hasExtraDetails ? `
                        <button class="cart-item-details-toggle" onclick="toggleCartItemDetails(${idx})">
                            Details <span class="toggle-icon" id="cart-toggle-icon-${idx}">▼</span>
                        </button>
                    ` : ''}
                    
                    <div class="cart-item-extra-details" id="cart-details-${idx}">
                        <div class="cart-item-extra-details-inner">
                            ${categoryText ? `<span>📁 ${categoryText}</span>` : ''}
                            ${barcodeText ? `<span>🔲 ${barcodeText}</span>` : ''}
                            ${extraDetails.map(d => `<span>${d}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <button onclick="removeFromCart(${idx})" class="cart-item-remove-btn" aria-label="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    return cart.find(item => {
        if (item.product_id !== productId) return false;
        if (variantId && item.variant_id !== variantId) return false;
        return true;
    }) || null;
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
    return {
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
};

// ============================================================================
// UPDATE COUNTS
// ============================================================================
function updateCounts() {
    const cartCount = document.getElementById('cart-count');
    const wishCount = document.getElementById('wish-count');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    if (cartCount) {
        cartCount.innerText = totalItems;
        cartCount.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)';
        cartCount.style.transform = 'scale(1.4)';
        setTimeout(() => { cartCount.style.transform = 'scale(1)'; }, 150);
    }
    if (wishCount) wishCount.innerText = wishlist.length;
}

function saveCart() {
    localStorage.setItem('jabiyen_cart', JSON.stringify(cart));
    updateCounts();
}

// ============================================================================
// WISHLIST
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
    submenu.classList.toggle('open');
}

// ============================================================================
// SCROLL DETECTOR
// ============================================================================
function handleNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    const isBarDismissed = localStorage.getItem('jabiyen_announcement_hidden') === 'true';
    const hasAnnouncement = announcementData && announcementData.message;
    const barHeight = (hasAnnouncement && !isBarDismissed) ? '36px' : '0px';
    
    if (window.scrollY > 20) {
        nav.classList.add('nav-scrolled');
        nav.style.top = '0px';
    } else {
        nav.classList.remove('nav-scrolled');
        nav.style.top = barHeight;
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

    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
    setTimeout(initSharedComponents, 60);
}
