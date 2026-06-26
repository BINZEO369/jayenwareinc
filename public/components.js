// ============================================================================
// components.js - Shared Header, Footer, Common Functions & Glassmorphism UI
// Version: 5.0 (Ultra-Dynamic Desktop Viewport Optimization - Anti-Glitch Line)
// Brand: JAYENWARE (Premium Apparel)
// ============================================================================

let cart = JSON.parse(localStorage.getItem('jayen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jayen_wish') || '[]');
let userSession = null;
let allMenuItems = [];
let allCategories = [];
let allSubcategories = [];

// ============================================================================
// FONT CONFIGURATION LOADER
// ============================================================================
function loadFontsConfiguration() {
    if (!window.JAYENWARE_FONTS) {
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
    const fonts = window.JAYENWARE_FONTS;
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
// SHARED CSS STYLES (Ultra Liquid Glass & Monochrome Design)
// ============================================================================
function injectSharedStyles() {
    const styles = `
    <style id="shared-components-style">
        /* DYNAMIC BOX MODEL RESET - ডানপাশের বর্ডার পিক্সেল গ্লিচ দূর করার জন্য */
        *, *::before, *::after {
            box-sizing: border-box !important;
        }

        :root {
            --primary: #000000;
            --accent: #ffffff;
            
            /* লিকুইড কাঁচের ফ্রস্টেড আল্ট্রা-স্বচ্ছ ব্যাকগ্রাউন্ড ফিল্টার */
            --glass-white: rgba(255, 255, 255, 0.45);
            --glass-white-thick: rgba(255, 255, 255, 0.7);
            --glass-black: rgba(0, 0, 0, 0.6);
            --glass-black-thick: rgba(0, 0, 0, 0.82);
            
            /* লিকুইড গ্লাস বর্ডার সিস্টেম */
            --glass-border-light: rgba(255, 255, 255, 0.55);
            --glass-border-dark: rgba(0, 0, 0, 0.06);
            --glass-border-inline: rgba(255, 255, 255, 0.15);
            
            /* অ্যাপল স্ট্যান্ডার্ড স্যাচুরেশন ফিল্টার */
            --glass-blur: blur(40px) saturate(250%);
        }
        
        /* DYNAMIC VIEWPORT LOCK - ডেক্সটপ স্ক্রিন ফ্লুইড রাখার জন্য ফিক্স */
        html {
            width: 100%25;
            max-width: 100%25;
            overflow-x: hidden !important;
            margin: 0;
            padding: 0;
        }
        
        body { 
            width: 100%25;
            max-width: 100%25;
            overflow-x: hidden !important;
            margin: 0;
            padding: 0;
            padding-top: 64px; 
            font-family: var(--font-body);
            background-color: #ffffff;
            color: var(--primary);
        }
        @media (min-width: 1024px) { body { padding-top: 80px; } }
        
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
        
        /* ==================== LIQUID GLASS NAVIGATION HEADER ==================== */
        .glass-nav {
            left: 0;
            right: 0;
            width: 100%25;
            background: var(--glass-white);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border-bottom: 1px solid var(--glass-border-light);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.01);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* ==================== UNIFIED GLASS SIDE DRAWER ==================== */
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
            width: 100%25; max-width: 440px;
            height: 100vh; height: 100dvh;
            background: var(--glass-white);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border-left: 1px solid var(--glass-border-light);
            z-index: 200;
            transform: translateX(105%25); /* ১০০% এর জায়গায় ১০৫% অফসেট নিশ্চিত করে যে ডেক্সটপে কোনো কালো বর্ডার দেখা যাবে না */
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex; flex-direction: column;
            box-shadow: -20px 0 60px rgba(0,0,0,0.05);
        }
        .side-menu-drawer.open { transform: translateX(0) !important; }
        
        .side-menu-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 24px 32px; 
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .side-menu-scroll {
            flex-grow: 1;
            overflow-y: auto;
            padding: 24px 32px;
        }
        
        /* Drawer Navigation Elements */
        .menu-node-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 18px 4px; border-bottom: 1px solid rgba(0, 0, 0, 0.04);
            font-family: var(--font-heading);
            font-size: 15px; font-weight: 700; letter-spacing: 0.03em;
            color: var(--primary); text-decoration: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .menu-node-item:hover { padding-left: 10px; opacity: 0.7; }
        
        .menu-node-submenu {
            display: none;
            padding-left: 18px;
            border-left: 1.5px solid var(--primary);
            margin: 4px 0 8px 4px;
        }
        .menu-node-submenu.open { display: block; }
        
        .menu-node-sub-item {
            display: block;
            padding: 12px 14px;
            font-family: var(--font-subtitle);
            font-size: 13px; font-weight: 600;
            color: #3a3a3c; text-decoration: none;
            transition: all 0.2s ease;
        }
        .menu-node-sub-item:hover { color: var(--primary); padding-left: 4px; }
        
        .side-drawer-footer {
            padding: 32px; border-top: 1px solid rgba(0, 0, 0, 0.05);
            background: rgba(255, 255, 255, 0.2); flex-shrink: 0;
        }
        
        /* ==================== CART DRAWER (Liquid Black Glass) ==================== */
        #cart-drawer {
            background: var(--glass-black-thick) !important;
            backdrop-filter: var(--glass-blur) !important;
            -webkit-backdrop-filter: var(--glass-blur) !important;
            border-left: 1px solid var(--glass-border-inline);
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
            will-change: transform;
            transform: translateX(105%25) !important; /* সম্পূর্ণ অফ-ভিউ ট্র্যাকিং */
            color: var(--accent) !important;
        }
        #cart-drawer.open { transform: translateX(0) !important; }
        #cart-drawer h2, #cart-drawer span, #cart-drawer p, #cart-drawer h4, #cart-drawer div { color: var(--accent); }
        #cart-drawer .bg-soft {
            background: rgba(255, 255, 255, 0.06) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        #cart-items > div {
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(15px);
            border-radius: 20px;
        }
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        
        /* ==================== TOAST NOTIFICATION ==================== */
        #toast > div {
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: var(--glass-blur) !important;
            -webkit-backdrop-filter: var(--glass-blur) !important;
            border: 1px solid var(--glass-border-light) !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important;
            border-radius: 24px !important;
            color: var(--primary) !important;
        }
        #toast-icon { background: var(--primary) !important; color: var(--accent) !important; }
        
        /* ==================== DYNAMIC FOOTER EDGE ADJUSTMENT ==================== */
        #main-footer { 
            background: #000000; 
            color: #8e8e93; 
            border-top: 1px solid #1c1c1e;
            width: 100%25;
            max-width: 100%25;
            margin: 0;
        }
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
            font-size: 9px !important; font-weight: 700; border: 1px solid var(--glass-border-light);
        }
        
        .desktop-menu-trigger {
            display: flex; align-items: center; gap: 10px;
            font-family: var(--font-heading); font-size: 11px; font-weight: 800;
            letter-spacing: 0.12em; text-transform: uppercase;
            padding: 10px 18px; border-radius: 12px;
            border: 1px solid rgba(0, 0, 0, 0.06);
            background: rgba(255, 255, 255, 0.4);
            cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .desktop-menu-trigger:hover {
            background: var(--primary); color: var(--accent);
            border-color: var(--primary); box-shadow: 0 10px 25px rgba(0,0,0,0.08);
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
// RENDER UNIFIED DRAWER ENGINE (Universal Responsive Architecture)
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
                    <span><i class="fa-solid fa-folder-open mr-3 opacity-30" style="font-size:11px;"></i> ${item.title || item.name || ''}</span>
                    <i class="fa-solid fa-chevron-down opacity-40" style="font-size:9px;"></i>
                </div>
                <div class="menu-node-submenu" id="${uniqueId}">
                    ${renderDrawerSubItems(item, uniqueId)}
                </div>
            </div>`;
        } else {
            let icon = 'fa-circle-notch';
            switch (item.menu_type) {
                case 'home': icon = 'fa-house'; break;
                case 'products': icon = 'fa-bag-shopping'; break;
                case 'contact': icon = 'fa-envelope'; break;
                case 'about': icon = 'fa-circle-info'; break;
                case 'journal': icon = 'fa-newspaper'; break;
            }
            html += `
            <a href="${linkUrl}" class="menu-node-item no-underline">
                <span><i class="fa-solid ${icon} mr-3 opacity-30" style="font-size:11px;"></i> ${item.title || item.name || ''}</span>
                <i class="fa-solid fa-arrow-right-long opacity-20" style="font-size:11px;"></i>
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
                        <i class="fa-solid fa-chevron-down opacity-40" style="font-size:8px;"></i>
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
                    <i class="fa-solid fa-chevron-down opacity-40" style="font-size:8px;"></i>
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
// HEADER SYSTEM (Liquid Translucent Engine - A to Z Navigation)
// ============================================================================
async function renderHeader() {
    const [menuItems, categories, subcategories] = await Promise.all([
        fetchMenuItems(),
        fetchCategories(),
        fetchSubcategories()
    ]);
    
    allCategories = categories;
    allSubcategories = subcategories;
    const menuTree = buildMenuTree(menuItems);
    
    const headerHTML = `
    <div class="side-menu-overlay" id="sideMenuOverlay" onclick="closeSideMenu()"></div>
    <div class="side-menu-drawer" id="sideMenuDrawer">
        <div class="side-menu-header">
            <a href="/" class="flex items-center gap-3 no-underline">
                <img src="/logo.png" class="w-9 h-9 rounded-xl border border-white/20 shadow-sm" alt="Logo">
                <span class="font-black text-base tracking-widest" style="font-family: var(--font-heading); color: var(--primary);">JAYENWARE</span>
            </a>
            <button onclick="closeSideMenu()" class="text-xl text-neutral-400 hover:text-black transition p-2" aria-label="Close menu">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="side-menu-scroll" id="sideMenuContent">
            ${renderUnifiedDrawerMenu(menuTree)}
        </div>
        <div class="side-drawer-footer">
            <a href="/login" class="block w-full py-4 bg-black text-white rounded-xl text-center font-bold uppercase tracking-widest text-[10px] no-underline transition hover:bg-neutral-900">Account Architecture</a>
        </div>
    </div>
    
    <nav class="glass-nav fixed top-0 z-50" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex justify-between items-center">
            <a href="/" class="flex items-center gap-3 shrink-0 no-underline">
                <img src="/logo.png" class="w-9 h-9 lg:w-10 lg:h-10 rounded-xl" alt="JAYENWARE Logo">
                <span class="text-base sm:text-lg lg:text-xl font-black tracking-widest" style="font-family: var(--font-heading); color: var(--primary);">JAYENWARE</span>
            </a>
            
            <div class="flex items-center gap-2 sm:gap-4 shrink-0">
                <a href="/wishlist" class="relative p-2 no-underline text-black transition hover:opacity-50">
                    <i class="fa-regular fa-heart text-lg"></i>
                    <span id="wish-count" class="absolute top-0.5 right-0.5 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                <a href="/cart" onclick="toggleCart();return false;" class="relative p-2 no-underline text-black transition hover:opacity-50">
                    <i class="fa-solid fa-bag-shopping text-lg"></i>
                    <span id="cart-count" class="absolute top-0.5 right-0.5 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                
                <button onclick="openSideMenu()" class="desktop-menu-trigger">
                    <i class="fa-solid fa-bars-staggered text-sm"></i>
                    <span>Menu</span>
                </button>
            </div>
        </div>
    </nav>
    
    <div id="cart-drawer" class="fixed top-0 right-0 w-full max-w-sm sm:max-w-md h-full z-[60] shadow-2xl flex flex-col">
        <div class="p-6 border-b flex justify-between items-center bg-soft">
            <h2 class="text-xs font-black uppercase tracking-widest">Shopping Vault</h2>
            <button onclick="toggleCart()" class="text-gray-400 hover:text-white text-lg transition p-1">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div id="cart-items" class="flex-grow overflow-y-auto p-6 space-y-4 custom-scroll"></div>
        <div class="p-6 border-t bg-soft">
            <div class="space-y-2 mb-6 text-[11px] uppercase tracking-wider">
                <div class="flex justify-between opacity-50"><span>Subtotal Ledger</span><span id="cart-subtotal">৳ 0.00</span></div>
                <div class="flex justify-between border-t border-white/10 pt-4">
                    <span class="font-bold">Total Valuation</span>
                    <span id="cart-total" class="text-base font-black">৳ 0.00</span>
                </div>
            </div>
            <a href="/checkout" class="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[11px] transition text-center block hover:bg-neutral-100 no-underline shadow-lg">Execute Checkout</a>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// ============================================================================
// FOOTER & TOAST CORE SYSTEMS
// ============================================================================
function renderFooter() {
    const footerHTML = `
    <footer class="pt-16 pb-8" id="main-footer">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div class="col-span-2 md:col-span-1">
                    <h4 class="text-sm font-bold tracking-widest mb-4">JAYENWARE</h4>
                    <p class="text-[11px] leading-relaxed mb-4 opacity-50">Premium lifestyle apparel architecture calibrated for modern aesthetics. Built on <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="font-bold underline text-white">BINZEO</a>.</p>
                    <div class="flex gap-4 text-base">
                        <a href="#" class="hover:opacity-50"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#" class="hover:opacity-50"><i class="fa-brands fa-instagram"></i></a>
                    </div>
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
                <p class="text-[9px] uppercase tracking-widest">&copy; <span id="display-year"></span> JAYENWARE Engine.</p>
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
                <button onclick="hideToast()" class="text-gray-400 hover:text-black shrink-0 transition"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
        document.body.appendChild(toast);
    }
    document.getElementById('toast-text').innerText = text;
    const iconEl = document.getElementById('toast-icon');
    iconEl.innerHTML = type === 'success' ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-exclamation"></i>';
    
    toast.style.transform = 'translateX(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.transform = 'translateX(120%)'; }, 3200);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.style.transform = 'translateX(120%)';
}

// ============================================================================
// SIDE DRAWER CONTROLLER LOGIC
// ============================================================================
function openSideMenu() {
    document.getElementById('sideMenuDrawer').classList.add('open');
    document.getElementById('sideMenuOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
    document.getElementById('sideMenuDrawer').classList.remove('open');
    document.getElementById('sideMenuOverlay').classList.remove('active');
    document.body.style.overflow = '';
    document.querySelectorAll('.menu-node-submenu.open').forEach(sub => sub.classList.remove('open'));
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
// CART CONTROLLER & STORAGE BINDING
// ============================================================================
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) renderCartItems();
    }
}

function addToCart(productId, productData) {
    if (!productData) return;
    const existingIndex = cart.findIndex(item => item.product_id === productData.id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ id: Date.now(), product_id: productData.id, title: productData.title, price: productData.price, img: productData.img, quantity: 1 });
    }
    saveCart();
    showToast('Manifested in Shopping Bag! 🎉', 'success');
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    renderCartItems();
}

function saveCart() {
    localStorage.setItem('jayen_cart', JSON.stringify(cart));
    updateCounts();
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    if (!container) return;
    
    if (!cart.length) {
        container.innerHTML = '<p class="text-center opacity-40 py-12 text-xs tracking-wider uppercase">Bag Configuration Void</p>';
        if (subtotalEl) subtotalEl.innerText = '৳ 0.00';
        if (totalEl) totalEl.innerText = '৳ 0.00';
        return;
    }
    let sub = 0;
    container.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * (item.quantity || 1);
        sub += itemTotal;
        return `<div class="flex gap-4 p-4 items-center">
            <img src="${item.img}" class="w-14 h-14 object-cover rounded-xl shrink-0 border border-white/10" alt="${item.title}">
            <div class="flex-grow min-w-0">
                <h4 class="text-xs font-bold truncate tracking-wide">${item.title}</h4>
                <div class="flex items-center gap-3 mt-1">
                    <p class="text-xs font-black">৳${itemTotal.toFixed(2)}</p>
                    <span class="text-[10px] opacity-40">Qty: ${item.quantity || 1}</span>
                </div>
            </div>
            <button onclick="removeFromCart(${idx})" class="text-neutral-400 hover:text-white transition p-2 shrink-0"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </div>`;
    }).join('');
    if (subtotalEl) subtotalEl.innerText = `৳${sub.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `৳${sub.toFixed(2)}`;
}

function updateCounts() {
    const cartCount = document.getElementById('cart-count');
    const wishCount = document.getElementById('wish-count');
    if (cartCount) cartCount.innerText = cart.length;
    if (wishCount) wishCount.innerText = wishlist.length;
}

function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
        showToast('Purged from Registry', 'info');
    } else {
        wishlist.push(id);
        showToast('Saved to Vault Collection ❤️', 'success');
    }
    localStorage.setItem('jayen_wish', JSON.stringify(wishlist));
    updateCounts();
}

// ============================================================================
// APIS & INITIALIZATION
// ============================================================================
window.showToast = showToast; window.hideToast = hideToast; window.toggleWishlist = toggleWishlist;
window.addToCart = addToCart; window.toggleCart = toggleCart; window.removeFromCart = removeFromCart;
window.openSideMenu = openSideMenu; window.closeSideMenu = closeSideMenu; window.toggleDrawerSubmenu = toggleDrawerSubmenu;
window.saveCart = saveCart; window.renderCartItems = renderCartItems; window.updateCounts = updateCounts;

async function initSharedComponents() {
    loadFontsConfiguration();
    injectSharedStyles();
    await renderHeader();
    renderFooter();
    updateCounts();
    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
    setTimeout(initSharedComponents, 60);
}
