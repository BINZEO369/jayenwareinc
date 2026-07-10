// ============================================================================
// components.js - Unified Shared Header, Premium Glassmorphism UI & Core Logic
// Brand: JABIYEN (Premium Apparel)
// Precision Engineering & Ultra-Luxury Responsive Interfaces
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
// SHARED PREMIUM CSS STYLES (Dynamic Luxury Layering)
// ============================================================================
function injectSharedStyles() {
    if (document.getElementById("shared-components-style")) return;

    const styles = `
    <style id="shared-components-style">
        :root {
            --primary: #000000;
            --accent: #ffffff;
            --glass-white: rgba(255, 255, 255, 0.45);
            --glass-white-thick: rgba(255, 255, 255, 0.85);
            --glass-black: rgba(10, 10, 10, 0.75);
            --glass-black-thick: rgba(0, 0, 0, 0.93);
            --glass-border-light: rgba(255, 255, 255, 0.3);
            --glass-border-dark: rgba(0, 0, 0, 0.04);
            --glass-border-inline: rgba(255, 255, 255, 0.09);
            --luxury-blur: blur(35px) saturate(210%);
            --bar-height: 40px;
            --nav-height-desktop: 76px;
            --nav-height-mobile: 64px;
            --spring-transition: all 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        html, body {
            overflow-x: hidden !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important; 
            padding: 0 !important;
            box-sizing: border-box;
            background-color: #ffffff;
            color: var(--primary);
            font-family: var(--font-body);
            -webkit-font-smoothing: antialiased;
        }
        
        *, *:before, *:after { box-sizing: inherit; }
        
        /* Typography System */
        .text-heading-hero { font-family: var(--font-heading); font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1.05; font-weight: 800; letter-spacing: -0.03em; color: var(--primary); }
        .text-heading-xl { font-family: var(--font-heading); font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; color: var(--primary); }
        .text-heading-lg { font-family: var(--font-heading); font-size: clamp(1.5rem, 4vw, 2.5rem); line-height: 1.15; font-weight: 700; letter-spacing: -0.015em; color: var(--primary); }
        .text-heading-md { font-family: var(--font-heading); font-size: clamp(1.25rem, 3vw, 2rem); line-height: 1.2; font-weight: 600; color: var(--primary); }
        .text-heading-sm { font-family: var(--font-heading); font-size: clamp(1rem, 2.5vw, 1.5rem); line-height: 1.25; font-weight: 600; color: var(--primary); }
        .text-body-sm { font-family: var(--font-body); font-size: 0.875rem; line-height: 1.55; font-weight: 400; color: #1c1c1e; }
        .text-body-xs { font-family: var(--font-body); font-size: 0.75rem; line-height: 1.5; font-weight: 400; color: #2c2c2e; }
        
        /* Layout Fixes to prevent dynamic layout shifts */
        body {
            padding-top: calc(var(--bar-height) + var(--nav-height-mobile)) !important;
            transition: padding-top 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (min-width: 1024px) {
            body { padding-top: calc(var(--bar-height) + var(--nav-height-desktop)) !important; }
        }
        body.announcement-dismissed {
            padding-top: var(--nav-height-mobile) !important;
        }
        @media (min-width: 1024px) {
            body.announcement-dismissed { padding-top: var(--nav-height-desktop) !important; }
        }

        /* Unique & High-End Announcement Bar */
        .top-announcement-bar {
            background: var(--primary) !important;
            color: var(--accent) !important;
            font-family: var(--font-body);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            height: var(--bar-height);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100% !important;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            padding: 0 48px 0 24px;
            text-align: center;
            overflow: hidden;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
        .top-announcement-bar.bar-hidden {
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
        }
        .top-announcement-bar a {
            color: var(--accent);
            text-decoration: none;
            border-bottom: 1.5px solid var(--accent);
            font-weight: 700;
            margin-left: 8px;
            transition: opacity 0.2s ease;
        }
        .top-announcement-bar a:hover { opacity: 0.7; }
        .announcement-close-btn {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--accent);
            opacity: 0.6;
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .announcement-close-btn:hover { opacity: 1; transform: translateY(-50%) rotate(90deg); }

        /* Stable Luxury Glass Navigation */
        .glass-nav {
            position: fixed;
            top: var(--bar-height); 
            left: 0; 
            right: 0;
            width: 100% !important; 
            height: var(--nav-height-mobile);
            background: rgba(255, 255, 255, 0.7) !important;
            backdrop-filter: var(--luxury-blur);
            -webkit-backdrop-filter: var(--luxury-blur);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            box-shadow: 0 4px 30px rgba(0,0,0,0.01);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, border-color 0.4s ease, top 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 90;
        }
        @media (min-width: 1024px) {
            .glass-nav { height: var(--nav-height-desktop); }
        }
        .glass-nav.nav-scrolled {
            top: 0 !important; 
            background: rgba(255,255,255,0.85) !important;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            box-shadow: 0 10px 40px rgba(0,0,0,0.04);
            height: 64px;
        }
        body.announcement-dismissed .glass-nav { top: 0 !important; }
        
        .glass-nav > div {
            padding-left: 24px !important;
            padding-right: 24px !important;
            max-width: 100% !important;
            width: 100% !important;
            height: 100%;
            margin: 0 !important;
        }
        @media (min-width: 1024px) {
            .glass-nav > div {
                padding-left: 60px !important;
                padding-right: 60px !important;
            }
        }

        /* Micro-interactions & Icons */
        .header-icon-btn {
            background: none;
            border: none;
            padding: 8px;
            margin: 0 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--primary);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
            position: relative;
        }
        .header-icon-btn:hover { opacity: 0.6; transform: scale(1.05); }
        .header-icon-btn:active { transform: scale(0.95); }
        
        #wish-count, #cart-count {
            background: var(--primary) !important;
            color: var(--accent) !important;
            font-size: 8px !important; 
            font-weight: 800; 
            border: 1.5px solid #ffffff;
            top: 0px !important; 
            right: 0px !important;
            min-width: 18px !important;
            height: 18px !important;
            padding: 0 4px !important;
            border-radius: 99px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        /* Advanced Blurred Overlays */
        .side-menu-overlay {
            position: fixed; inset: 0;
            background: rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            z-index: 199; opacity: 0; visibility: hidden;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        .side-menu-overlay.active { opacity: 1; visibility: visible; }

        /* Architectural Side Menu Drawer */
        .side-menu-drawer {
            position: fixed; top: 0; right: 0;
            width: 100%; max-width: 440px;
            height: 100vh; height: 100dvh;
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(40px) saturate(220%);
            -webkit-backdrop-filter: blur(40px) saturate(220%);
            border-left: 1px solid rgba(255,255,255,0.4);
            z-index: 200;
            transform: translateX(100%); 
            visibility: hidden; 
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex; flex-direction: column;
            box-shadow: -30px 0 70px rgba(0,0,0,0.05);
        }
        .side-menu-drawer.open { transform: translateX(0); visibility: visible; }
        .side-menu-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 24px 32px; border-bottom: 1px solid rgba(0,0,0,0.04);
        }
        .side-menu-scroll { flex-grow: 1; overflow-y: auto; padding: 24px 32px; }
        
        /* Premium Menu Nodes */
        .menu-node-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 18px 4px; border-bottom: 1px solid rgba(0,0,0,0.03);
            font-family: var(--font-heading);
            font-size: 15px; font-weight: 700; letter-spacing: 0.04em;
            color: var(--primary); text-decoration: none; cursor: pointer;
            transition: var(--spring-transition);
        }
        .menu-node-item:hover { padding-left: 12px; color: rgba(0,0,0,0.5); }
        .menu-node-submenu { 
            max-height: 0; overflow: hidden; visibility: hidden;
            padding-left: 18px; border-left: 1.5px solid var(--primary); 
            margin: 0 0 0 4px; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s;
        }
        .menu-node-submenu.open { max-height: 1200px; visibility: visible; padding-top: 6px; padding-bottom: 10px; }
        .menu-node-sub-item {
            display: block; padding: 12px 14px; font-family: var(--font-subtitle); font-size: 13px; font-weight: 600;
            color: #3a3a3c; text-decoration: none; transition: var(--spring-transition);
        }
        .menu-node-sub-item:hover { color: var(--primary); transform: translateX(6px); }
        .side-drawer-footer { padding: 32px; border-top: 1px solid rgba(0,0,0,0.04); background: rgba(255,255,255,0.15); flex-shrink: 0; }

        /* Luxury Deep-Black Cart Drawer */
        #cart-drawer {
            position: fixed; top: 0; right: 0; width: 100%; max-width: 450px; height: 100vh; height: 100dvh;
            background: var(--glass-black-thick) !important; backdrop-filter: blur(40px) saturate(190%) !important;
            -webkit-backdrop-filter: blur(40px) saturate(190%) !important; border-left: 1px solid var(--glass-border-inline); z-index: 210;
            transform: translateX(100%) !important; visibility: hidden;
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important, visibility 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
            will-change: transform; color: var(--accent) !important; display: flex; flex-direction: column;
            box-shadow: -40px 0 80px rgba(0,0,0,0.3);
        }
        #cart-drawer.open { transform: translateX(0) !important; visibility: visible !important; }
        #cart-drawer h2, #cart-drawer span, #cart-drawer p, #cart-drawer h4, #cart-drawer div { color: var(--accent); }
        #cart-drawer .bg-soft { background: rgba(255,255,255,0.04) !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
        
        /* Exquisite Cart Cards */
        .cart-item-card {
            background: rgba(255,255,255,0.03) !important;
            border: 1px solid rgba(255,255,255,0.05) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border-radius: 20px !important;
            padding: 16px !important;
            transition: var(--spring-transition) !important;
            position: relative;
        }
        .cart-item-card:hover {
            background: rgba(255,255,255,0.06) !important;
            border-color: rgba(255,255,255,0.1) !important;
            transform: translateY(-2px);
        }
        
        .cart-item-image {
            width: 76px; height: 76px; object-fit: cover; border-radius: 14px;
            border: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; background: rgba(255,255,255,0.02);
        }
        .cart-item-title { font-family: var(--font-heading); font-weight: 700; font-size: 13px; color: #ffffff; line-height: 1.4; }
        .cart-item-variant { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
        
        .cart-item-variant-badge {
            display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.07);
            padding: 3px 12px; border-radius: 20px; font-size: 8px; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); font-family: var(--font-subtitle);
        }
        .cart-item-variant-badge .color-dot { width: 9px; height: 9px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }
        .cart-item-price { font-family: var(--font-body); font-weight: 800; font-size: 15px; color: #ffffff; }
        .cart-item-old-price { font-family: var(--font-body); font-size: 11px; text-decoration: line-through; color: rgba(255,255,255,0.3); }
        
        /* Modernized Interactive Quantity Controller */
        .cart-item-quantity-control {
            display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.07);
            border-radius: 12px; padding: 2px; border: 1px solid rgba(255,255,255,0.05);
        }
        .cart-item-quantity-control button {
            background: none; border: none; color: rgba(255,255,255,0.6); cursor: pointer;
            padding: 4px 10px; font-size: 14px; font-weight: 600; transition: all 0.2s;
            border-radius: 10px; display: flex; align-items: center; justify-content: center;
        }
        .cart-item-quantity-control button:hover { color: #ffffff; background: rgba(255,255,255,0.08); }
        .cart-item-quantity-control .qty-num { font-size: 12px; font-weight: 700; min-width: 24px; text-align: center; color: #ffffff; }
        
        /* Extra Details Toggle Dropdown */
        .cart-item-details-toggle {
            background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer;
            padding: 4px 0; font-size: 8px; font-weight: 600; text-transform: uppercase;
            letter-spacing: 0.08em; transition: color 0.2s; font-family: var(--font-subtitle);
            display: inline-flex; align-items: center; gap: 4px; margin-top: 6px;
        }
        .cart-item-details-toggle:hover { color: rgba(255,255,255,0.7); }
        .cart-item-details-toggle .toggle-icon { transition: transform 0.3s ease; font-size: 7px; }
        .cart-item-details-toggle .toggle-icon.open { transform: rotate(180deg); }
        
        .cart-item-extra-details { max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s; }
        .cart-item-extra-details.open { max-height: 250px; opacity: 1; margin-top: 8px; }
        .cart-item-extra-details-inner {
            display: flex; flex-direction: column; gap: 4px; padding: 10px 12px;
            background: rgba(255,255,255,0.02); border-radius: 10px; border: 1px solid rgba(255,255,255,0.03);
        }
        .cart-item-extra-details-inner span { font-size: 8px; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.4); font-family: var(--font-subtitle); }

        /* Cinematic Premium Toast */
        #toast > div {
            background: rgba(255,255,255,0.85) !important; backdrop-filter: blur(30px) saturate(210%) !important;
            -webkit-backdrop-filter: blur(30px) saturate(210%) !important; border: 1px solid rgba(255,255,255,0.4) !important;
            box-shadow: 0 30px 70px rgba(0,0,0,0.08) !important; border-radius: 24px !important; color: var(--primary) !important;
        }
        #toast-icon { background: var(--primary) !important; color: var(--accent) !important; }

        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 10px; }
        .cart-summary-row { display: flex; justify-content: space-between; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; padding: 6px 0; }
        .cart-summary-row .label { color: rgba(255,255,255,0.4); }
        .cart-summary-row .value { font-weight: 700; color: rgba(255,255,255,0.9); }
        .cart-summary-total { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; margin-top: 8px; }
        .cart-summary-total .label { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.6); }
        .cart-summary-total .value { font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em; }
        
        .btn-primary {
            font-family: var(--font-body); font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
            background: var(--primary) !important; color: var(--accent) !important; border-radius: 14px !important;
            transition: var(--spring-transition) !important;
        }
        .btn-primary:hover { background: #1c1c1e !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
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
        const hasChildren = (item.children && item.children.length > 0) || (item.menu_type === 'category' && item.show_categories_from_db);
        const linkUrl = getMenuLinkUrl(item);
        const uniqueId = `drawer-node-${index}-${Date.now()}`;
        
        if (hasChildren) {
            html += `
            <div>
                <div class="menu-node-item" onclick="toggleDrawerSubmenu('${uniqueId}', this)">
                    <span>${item.title || item.name || ''}</span>
                    <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-50 transition-transform duration-300 transform"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="menu-node-submenu" id="${uniqueId}">
                    ${renderDrawerSubItems(item, uniqueId)}
                </div>
            </div>`;
        } else {
            html += `
            <a href="${linkUrl}" class="menu-node-item no-underline">
                <span>${item.title || item.name || ''}</span>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-40"><path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>`;
        }
    });
    return html;
}

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
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-50"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-50"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
// HEADER ARCHITECTURE INJECTOR
// ============================================================================
async function renderHeader() {
    if (document.getElementById('main-nav') || document.getElementById('top-announcement-bar')) {
        return;
    }

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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        `;
    } else {
        document.body.classList.add('announcement-dismissed');
        announcementHTML = `<div class="top-announcement-bar bar-hidden" id="top-announcement-bar"><span id="announcement-text"></span></div>`;
    }

    const headerHTML = `
    ${announcementHTML}

    <div class="side-menu-overlay" id="sideMenuOverlay" onclick="closeSideMenu()"></div>
    
    <div class="side-menu-drawer" id="sideMenuDrawer">
        <div class="side-menu-header">
            <a href="/" class="flex items-center gap-3 no-underline">
                <img src="/logo.png" class="w-10 h-10 rounded-md border border-black/10 shadow-sm object-cover" alt="Logo">
                <span class="font-black text-base sm:text-lg tracking-widest" style="font-family: var(--font-heading); color: var(--primary);">JABIYEN</span>
            </a>
            <button onclick="closeSideMenu()" class="drawer-close-btn" style="background:none; border:none; cursor:pointer;" aria-label="Close menu">
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
        <div class="flex justify-between items-center">
            <a href="/" class="flex items-center gap-3 shrink-0 no-underline">
                <img src="/logo.png" class="w-10 h-10 lg:w-11 lg:h-11 rounded-md object-cover border border-black/5" alt="JABIYEN Logo">
                <span class="text-base sm:text-lg lg:text-xl font-black tracking-widest" style="font-family: var(--font-heading); color: var(--primary);">JABIYEN</span>
            </a>
            
            <div class="flex items-center shrink-0 gap-1">
                <a href="/wishlist" class="header-icon-btn" aria-label="Wishlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span id="wish-count" class="absolute">0</span>
                </a>
                
                <a href="/cart" onclick="toggleCart();return false;" class="header-icon-btn" aria-label="Cart">
                    <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 6H18V18C18 19.1046 17.1046 20 16 20H3C1.89543 20 1 19.1046 1 18V6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                        <path d="M5 6C5 3.5 6.5 1 9.5 1C12.5 1 14 3.5 14 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                    <span id="cart-count" class="absolute">0</span>
                </a>
                
                <button onclick="openSideMenu()" class="header-icon-btn" aria-label="Open Navigation Menu">
                    <svg width="22" height="14" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1H21M1 7.5H21M1 14H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        </div>
    </nav>
    
    <div id="cart-drawer">
        <div class="p-5 border-b flex justify-between items-center bg-soft">
            <h2 class="text-[11px] font-black uppercase tracking-widest text-white">Shopping Vault</h2>
            <button onclick="toggleCart()" class="drawer-close-btn text-gray-400 hover:text-white" style="background:none; border:none; cursor:pointer;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
        <div id="cart-items" class="flex-grow overflow-y-auto p-5 space-y-4 custom-scroll"></div>
        <div class="p-5 border-t bg-soft">
            <div class="space-y-1 mb-5">
                <div class="cart-summary-row">
                    <span class="label">Subtotal</span>
                    <span class="value" id="cart-subtotal">৳ 0.00</span>
                </div>
                <div class="cart-summary-row">
                    <span class="label">Items Subtotal</span>
                    <span class="value" id="cart-item-count">0</span>
                </div>
                <div class="cart-summary-row cart-summary-total">
                    <span class="label">Total Amount</span>
                    <span class="value" id="cart-total">৳ 0.00</span>
                </div>
            </div>
            <a href="/checkout" class="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[11px] transition text-center block hover:bg-neutral-100 no-underline shadow-lg cart-checkout-btn">Execute Checkout</a>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// ============================================================================
// LOGICAL RE-ENGINEERING (Interactions & UI States)
// ============================================================================
function dismissAnnouncementBar() {
    const bar = document.getElementById('top-announcement-bar');
    if (bar) bar.classList.add('bar-hidden');
    localStorage.setItem('jabiyen_announcement_hidden', 'true');
    document.body.classList.add('announcement-dismissed');
    handleNavScroll();
}

function showToast(text, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed bottom-6 right-6 z-[300] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) translate-x-[150%]';
        toast.innerHTML = `
            <div class="shadow-2xl p-4 flex items-center gap-3 min-w-[280px]">
                <span id="toast-icon" class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"></span>
                <p id="toast-text" class="text-[11px] font-bold flex-grow tracking-wide" style="font-family: var(--font-body); margin:0;"></p>
                <button onclick="hideToast()" class="drawer-close-btn text-gray-400 hover:text-black shrink-0" style="background:none; border:none; cursor:pointer;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
            </div>
        `;
        document.body.appendChild(toast);
    }
    document.getElementById('toast-text').innerText = text;
    const iconEl = document.getElementById('toast-icon');
    iconEl.innerHTML = type === 'success' ? '✓' : '!';
    
    // Smooth insertion trigger
    setTimeout(() => { toast.style.transform = 'translateX(0)'; }, 50);
    
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { hideToast(); }, 4000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.style.transform = 'translateX(150%)';
}

function openSideMenu() {
    const drawer = document.getElementById('sideMenuDrawer');
    const overlay = document.getElementById('sideMenuOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
    const drawer = document.getElementById('sideMenuDrawer');
    const overlay = document.getElementById('sideMenuOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('sideMenuOverlay');
    if (drawer) {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) {
            renderCartItems();
            if(overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            if(!document.getElementById('sideMenuDrawer').classList.contains('open')) {
                if(overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
}

window.toggleCartItemDetails = function(idx) {
    const details = document.getElementById(`cart-details-${idx}`);
    const icon = document.getElementById(`cart-toggle-icon-${idx}`);
    if (details) {
        details.classList.toggle('open');
        if (icon) icon.classList.toggle('open');
    }
};

window.addToCart = function(productId, options = {}) {
    if (!productId || !options.title) return;
    
    const existingIndex = cart.findIndex(item => {
        if (item.product_id !== productId) return false;
        if (options.variant_id && item.variant_id === options.variant_id) return true;
        if (!options.variant_id && !item.variant_id) {
            return item.color_id === (options.color_id || null) && item.size_id === (options.size_id || null);
        }
        return false;
    });
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += (options.quantity || 1);
        showToast(`Updated Collection Amount: × ${cart[existingIndex].quantity}`, 'success');
    } else {
        const newItem = {
            id: Date.now(),
            product_id: productId,
            title: options.title,
            price: options.price || 0,
            old_price: options.old_price || null,
            img: options.color_image || options.img || '/logo.png',
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
        showToast(`Added to Luxury Vault`, 'success');
    }
    saveCart();
    renderCartItems();
};

window.removeFromCart = function(idx) {
    const item = cart[idx];
    if (!item) return;
    if (cart.length === 1 || window.confirm(`Purge standard item "${item.title}"?`)) {
        cart.splice(idx, 1);
        saveCart();
        renderCartItems();
        showToast('Item Cleared', 'info');
    }
};

window.updateCartQuantity = function(idx, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(idx);
        return;
    }
    cart[idx].quantity = newQuantity;
    saveCart();
    renderCartItems();
};

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const itemCountEl = document.getElementById('cart-item-count');
    if (!container) return;
    
    if (!cart.length) {
        container.innerHTML = `
            <div style="text-align:center; padding: 60px 24px;">
                <h3 style="font-family: var(--font-heading); font-size:15px; font-weight:700; color:rgba(255,255,255,0.4); margin-bottom:6px;">Your Vault is Empty</h3>
                <p style="font-size:11px; color:rgba(255,255,255,0.2); margin:0;">Incorporate exclusive items to system pipeline.</p>
            </div>`;
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
        
        let badges = [];
        if (item.color_name) badges.push(`<span class="cart-item-variant-badge">${item.color_code ? `<span class="color-dot" style="background:${item.color_code}"></span>`:''}${item.color_name}</span>`);
        if (item.size_name) badges.push(`<span class="cart-item-variant-badge">${item.size_name}</span>`);
        if (item.sku) badges.push(`<span style="font-size:8px; opacity:0.3; background:rgba(255,255,255,0.03); padding:2px 8px; border-radius:10px;">SKU: ${item.sku}</span>`);
        
        let extras = [];
        if (item.fabric_type) extras.push(`Fabric: ${item.fabric_type}`);
        if (item.fit_type) extras.push(`Fit: ${item.fit_type}`);
        if (item.gsm_type) extras.push(`GSM: ${item.gsm_type}`);
        
        return `
        <div class="cart-item-card">
            <div class="flex gap-4">
                <img src="${item.img}" class="cart-item-image" onerror="this.src='/logo.png'">
                <div class="flex-grow min-w-0">
                    <h4 class="cart-item-title m-0 truncate">${item.title}</h4>
                    <div class="cart-item-variant">${badges.join('')}</div>
                    
                    <div class="flex items-center justify-between mt-3 gap-2">
                        <div class="flex items-center gap-2">
                            <span class="cart-item-price">৳${itemTotal.toFixed(2)}</span>
                        </div>
                        <div class="cart-item-quantity-control">
                            <button onclick="updateCartQuantity(${idx}, ${(item.quantity || 1) - 1})">−</button>
                            <span class="qty-num">${item.quantity || 1}</span>
                            <button onclick="updateCartQuantity(${idx}, ${(item.quantity || 1) + 1})">+</button>
                        </div>
                    </div>
                    
                    ${extras.length ? `
                        <button class="cart-item-details-toggle" onclick="toggleCartItemDetails(${idx})">
                            Specifications <span class="toggle-icon" id="cart-toggle-icon-${idx}">▼</span>
                        </button>
                        <div class="cart-item-extra-details" id="cart-details-${idx}">
                            <div class="cart-item-extra-details-inner">
                                ${extras.map(e => `<span>${e}</span>`).join('')}
                            </div>
                        </div>
                    `:''}
                </div>
                <button onclick="removeFromCart(${idx})" style="background:none; border:none; color:rgba(255,255,255,0.3); cursor:pointer;" class="hover:text-red-400 self-start pt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
        </div>`;
    }).join('');
    
    if (subtotalEl) subtotalEl.innerText = `৳${sub.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `৳${sub.toFixed(2)}`;
    if (itemCountEl) itemCountEl.innerText = totalItems;
    updateCounts();
}

window.getCartItemDetails = (productId, variantId = null) => cart.find(i => i.product_id === productId && (!variantId || i.variant_id === variantId)) || null;
window.isVariantInCart = (productId, colorId, sizeId) => cart.some(i => i.product_id === productId && (!colorId || i.color_id === colorId) && (!sizeId || i.size_id === sizeId));
window.getProductQuantityInCart = (productId) => cart.filter(i => i.product_id === productId).reduce((t, i) => t + (i.quantity || 0), 0);
window.getVariantQuantityInCart = (productId, variantId) => { const i = cart.find(x => x.product_id === productId && x.variant_id === variantId); return i ? i.quantity : 0; };

window.clearCart = function() {
    if (!cart.length) return;
    if (window.confirm('Purge structural pipeline components?')) {
        cart = [];
        saveCart();
        renderCartItems();
        showToast('Vault Cleared', 'info');
    }
};

window.getCartSummary = function() {
    return {
        items: cart,
        subtotal: cart.reduce((s, i) => s + (i.price * i.quantity), 0),
        total_items: cart.reduce((s, i) => s + (i.quantity || 0), 0)
    };
};

function updateCounts() {
    const cCount = document.getElementById('cart-count');
    const wCount = document.getElementById('wish-count');
    const total = cart.reduce((s, i) => s + (i.quantity || 0), 0);
    
    if (cCount) {
        cCount.innerText = total;
        cCount.style.transform = 'scale(1.3)';
        setTimeout(() => { cCount.style.transform = 'scale(1)'; }, 140);
    }
    if (wCount) wCount.innerText = wishlist.length;
}

function saveCart() {
    localStorage.setItem('jabiyen_cart', JSON.stringify(cart));
    updateCounts();
}

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
    const svg = element.querySelector('svg');
    if(svg) svg.classList.toggle('rotate-180');
}

function handleNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    const isBarDismissed = localStorage.getItem('jabiyen_announcement_hidden') === 'true';
    const hasAnnouncement = announcementData && announcementData.message;
    const barHeight = (hasAnnouncement && !isBarDismissed) ? '40px' : '0px';
    
    if (window.scrollY > 15) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
        nav.style.top = barHeight;
    }
}

// ============================================================================
// SYSTEM INITIALIZATION LOGIC
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
    setTimeout(initSharedComponents, 30);
}
