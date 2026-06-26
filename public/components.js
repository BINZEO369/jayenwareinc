// ============================================================================
// components.js - Shared Header, Footer, Common Functions & Glassmorphism UI
// Version: 4.5 (Apple Liquid Glass System + Full Monochrome Integration)
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
        script.onload = () => {
            applyFontVariables();
        };
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
    
    // Core font override
    root.style.setProperty('--font-heading', fonts.families.heading || 'Manrope, sans-serif');
    root.style.setProperty('--font-subtitle', fonts.families.subtitle || 'Sora, sans-serif');
    root.style.setProperty('--font-body', fonts.families.body || 'Inter, sans-serif');
    root.style.setProperty('--font-accent', fonts.families.body || 'Inter, sans-serif');
}

// ============================================================================
// SHARED CSS STYLES (Ultra Liquid Glass & Monochrome Design)
// ============================================================================
function injectSharedStyles() {
    const styles = `
    <style id="shared-components-style">
        :root {
            /* পিওর ব্ল্যাক ও হোয়াইটের লাক্সারি ভেরিয়েবল */
            --primary: #000000;
            --accent: #ffffff;
            
            /* লিকুইড কাঁচের ফ্রস্টেড আল্ট্রা-স্বচ্ছ ব্যাকগ্রাউন্ড */
            --glass-white: rgba(255, 255, 255, 0.55);
            --glass-white-thick: rgba(255, 255, 255, 0.75);
            --glass-black: rgba(0, 0, 0, 0.65);
            --glass-black-thick: rgba(0, 0, 0, 0.82);
            
            /* প্রিমিয়াম ৩ডি কাঁচের বর্ডার রিফ্লেকশন */
            --glass-border-light: rgba(255, 255, 255, 0.45);
            --glass-border-dark: rgba(0, 0, 0, 0.08);
            --glass-border-inline: rgba(255, 255, 255, 0.15);
            
            /* অ্যাপল স্ট্যান্ডার্ড আল্ট্রা-স্যাচুরেশন ব্লার ফিল্টার */
            --glass-blur: blur(40px) saturate(240%);
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
        .text-body-xs { font-family: var(--font-body); font-size: 0.75rem; line-height: 1.5; font-weight: 400; color: #3a3a3c; }
        
        .text-caption { font-family: var(--font-accent); font-size: 0.75rem; line-height: 1.4; font-weight: 500; color: var(--primary); }
        .text-overline { font-family: var(--font-accent); font-size: 0.625rem; line-height: 1.4; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--primary); }
        
        /* ==================== LIQUID GLASS NAVIGATION ==================== */
        .glass-nav {
            background: var(--glass-white);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border-bottom: 1px solid var(--glass-border-light);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.02);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .nav-link {
            position: relative;
            font-family: var(--font-heading);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            padding: 8px 0;
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            color: var(--primary);
            text-decoration: none;
        }
        .nav-link:hover { opacity: 0.5; }
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0; left: 50%;
            width: 0; height: 2px;
            background: var(--primary);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            transform: translateX(-50%);
        }
        .nav-link:hover::after { width: 100%; }
        
        /* Desktop Menu (Liquid White Glass) */
        .desktop-dropdown { position: relative; }
        .desktop-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(15px);
            background: var(--glass-white-thick);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border-light);
            border-radius: 20px;
            box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            min-width: 260px;
            padding: 12px 0;
            z-index: 100;
        }
        .desktop-dropdown:hover .desktop-dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(5px);
        }
        
        .desktop-dropdown-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 24px;
            font-family: var(--font-subtitle);
            font-size: 13px;
            font-weight: 600;
            color: var(--primary);
            text-decoration: none;
            transition: all 0.25s ease;
            letter-spacing: 0.02em;
        }
        .desktop-dropdown-item:hover {
            background: rgba(0, 0, 0, 0.04);
            padding-left: 28px;
            color: var(--primary);
        }
        
        .desktop-sub-dropdown {
            position: absolute;
            left: 100%;
            top: -12px;
            background: var(--glass-white-thick);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border-light);
            border-radius: 20px;
            box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
            opacity: 0;
            visibility: hidden;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            min-width: 240px;
            padding: 12px 0;
            transform: translateX(12px);
        }
        .desktop-dropdown-item.has-children:hover .desktop-sub-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateX(0);
        }
        
        /* ==================== MOBILE DRAWER (Transparent Glass) ==================== */
        .mobile-menu-overlay {
            position: fixed; inset: 0;
            background: rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 199; opacity: 0; visibility: hidden;
            transition: all 0.4s ease;
        }
        .mobile-menu-overlay.active { opacity: 1; visibility: visible; }
        
        .mobile-menu-drawer {
            position: fixed; top: 0; left: 0;
            width: 86%; max-width: 380px;
            height: 100vh; height: 100dvh;
            background: var(--glass-white);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border-right: 1px solid var(--glass-border-light);
            z-index: 200;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex; flex-direction: column;
        }
        .mobile-menu-drawer.open { transform: translateX(0); }
        
        .mobile-menu-drawer .mobile-menu-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 20px 24px; 
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        .mobile-menu-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 4px; border-bottom: 1px solid rgba(0, 0, 0, 0.04);
            font-family: var(--font-heading);
            font-size: 14px; font-weight: 700; letter-spacing: 0.03em;
            color: var(--primary); text-decoration: none;
            transition: all 0.3s ease;
        }
        .mobile-menu-item:hover { padding-left: 6px; }
        
        .mobile-submenu {
            display: none;
            padding-left: 14px;
            border-left: 2px solid var(--primary);
            margin: 4px 0 6px 6px;
        }
        .mobile-submenu.open { display: block; }
        
        .mobile-sub-item {
            display: block;
            padding: 11px 12px;
            font-family: var(--font-subtitle);
            font-size: 13px; font-weight: 600;
            color: #3a3a3c; text-decoration: none;
            transition: color 0.2s ease;
        }
        .mobile-sub-item:hover { color: var(--primary); }
        
        .mobile-footer {
            padding: 24px; border-top: 1px solid rgba(0, 0, 0, 0.06);
            background: rgba(255, 255, 255, 0.3); flex-shrink: 0;
        }
        
        /* ==================== CART DRAWER (Liquid Black Glass) ==================== */
        #cart-drawer {
            background: var(--glass-black-thick) !important;
            backdrop-filter: var(--glass-blur) !important;
            -webkit-backdrop-filter: var(--glass-blur) !important;
            border-left: 1px solid var(--glass-border-inline);
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
            will-change: transform;
            color: var(--accent) !important;
        }
        #cart-drawer h2, #cart-drawer span, #cart-drawer p, #cart-drawer h4, #cart-drawer div {
            color: var(--accent);
        }
        #cart-drawer .bg-soft {
            background: rgba(255, 255, 255, 0.08) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }
        #cart-items > div {
            background: rgba(255, 255, 255, 0.06) !important;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            border-radius: 20px;
        }
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.25); border-radius: 10px; }
        
        /* ==================== TOAST NOTIFICATION (Liquid Clean) ==================== */
        #toast > div {
            background: rgba(255, 255, 255, 0.82) !important;
            backdrop-filter: var(--glass-blur) !important;
            -webkit-backdrop-filter: var(--glass-blur) !important;
            border: 1px solid var(--glass-border-light) !important;
            box-shadow: 0 30px 60px rgba(0,0,0,0.18) !important;
            border-radius: 24px !important;
            color: var(--primary) !important;
        }
        #toast-icon {
            background: var(--primary) !important;
            color: var(--accent) !important;
        }
        
        /* ==================== FOOTER (Pure Monochrome) ==================== */
        #main-footer {
            background: #000000;
            color: #8e8e93;
            border-top: 1px solid #1c1c1e;
        }
        #main-footer h4, #main-footer h5, #main-footer a {
            color: var(--accent) !important;
            transition: opacity 0.25s ease;
        }
        #main-footer a:hover { opacity: 0.5; }
        
        /* ==================== GLOBAL & MONO BUTTONS ==================== */
        body { 
            padding-top: 56px; 
            font-family: var(--font-body);
            background-color: #ffffff;
            color: var(--primary);
        }
        @media (min-width: 640px) { body { padding-top: 64px; } }
        @media (min-width: 1024px) { body { padding-top: 80px; } }
        
        .btn-primary {
            font-family: var(--font-body);
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            background: var(--primary) !important;
            color: var(--accent) !important;
            border-radius: 14px !important;
            border: 1px solid transparent;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .btn-primary:hover {
            background: #1c1c1e !important;
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        #wish-count, #cart-count {
            background: var(--primary) !important;
            color: var(--accent) !important;
            font-size: 9px !important;
            font-weight: 700;
            border: 1px solid var(--glass-border-light);
        }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================================================
// CORE DATA INTERFACES & UTILITIES
// ============================================================================
function createSlug(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function fetchMenuItems() {
    try {
        const response = await fetch('/api/menu-items');
        if (!response.ok) throw new Error('Failed to fetch menu pipeline');
        allMenuItems = await response.json();
        return allMenuItems;
    } catch (error) {
        console.error('Menu dynamic architecture error:', error);
        allMenuItems = [];
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
        console.error('Category framework loading error:', error);
        allCategories = [];
        return [];
    }
}

async function fetchSubcategories(categorySlug = null) {
    try {
        let url = '/api/subcategories';
        if (categorySlug) url += `?category_slug=${categorySlug}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch structural subcategories');
        const data = await response.json();
        if (!categorySlug) allSubcategories = data;
        return data;
    } catch (error) {
        console.error('Subcategory architecture routing error:', error);
        return [];
    }
}

function buildMenuTree(items, parentId = null) {
    return items
        .filter(item => (item.parent_id || null) === (parentId || null))
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(item => ({
            ...item,
            children: buildMenuTree(items, item.id)
        }));
}

function getMenuLinkUrl(item) {
    if (item.link && item.link.trim() !== '') return item.link;
    const slug = item.slug || '';
    
    switch (item.menu_type) {
        case 'home': return '/';
        case 'products': return '/products';
        case 'category':
            if (item.category_slug && item.subcategory_slug) {
                return `/category/${item.category_slug}/${item.subcategory_slug}`;
            }
            return item.category_slug ? `/category/${item.category_slug}` : '#';
        case 'subcategory':
            if (item.category_slug && item.subcategory_slug) {
                return `/category/${item.category_slug}/${item.subcategory_slug}`;
            }
            return item.subcategory_slug ? `/subcategory/${item.subcategory_slug}` : '#';
        case 'page': return slug ? `/${slug}` : '#';
        case 'custom': return item.link || '#';
        case 'contact': return '/contact';
        case 'about': return '/about';
        case 'journal': return '/journal';
        default: return slug ? `/${slug}` : '#';
    }
}

function getCategoryUrl(category, subcategory = null) {
    const catSlug = category.slug || createSlug(category.name);
    if (subcategory) {
        const subSlug = subcategory.slug || createSlug(subcategory.name);
        return `/category/${catSlug}/${subSlug}`;
    }
    return `/category/${catSlug}`;
}

// ============================================================================
// DYNAMIC NAVIGATION ENGINE (REDUX/RENDER)
// ============================================================================
function renderDesktopNav(rootItems) {
    let html = '';
    rootItems.forEach(item => {
        const hasChildren = item.children && item.children.length > 0;
        const linkUrl = getMenuLinkUrl(item);
        
        if (hasChildren) {
            html += `
            <div class="desktop-dropdown">
                <a href="${linkUrl}" class="nav-link px-5 flex items-center gap-1.5">
                    <span>${item.title || item.name || ''}</span>
                    <i class="fa-solid fa-chevron-down opacity-60" style="font-size:7px;"></i>
                </a>
                <div class="desktop-dropdown-menu">
                    ${renderDesktopDropdownChildren(item)}
                </div>
            </div>`;
        } else {
            html += `<a href="${linkUrl}" class="nav-link px-5">${item.title || item.name || ''}</a>`;
        }
    });
    return html;
}

function renderDesktopDropdownChildren(item) {
    if (item.menu_type === 'category' && item.show_categories_from_db) {
        return renderCategoriesDropdown();
    }
    if (item.children && item.children.length > 0) {
        let html = '';
        item.children.forEach(child => {
            const hasGrandChildren = child.children && child.children.length > 0;
            const linkUrl = getMenuLinkUrl(child);
            
            if (hasGrandChildren) {
                html += `
                <div style="position:relative;">
                    <a href="${linkUrl}" class="desktop-dropdown-item has-children">
                        <span>${child.title || child.name || ''}</span>
                        <i class="fa-solid fa-chevron-right" style="font-size:8px;"></i>
                    </a>
                    <div class="desktop-sub-dropdown">
                        ${child.children.map(gc => `
                            <a href="${getMenuLinkUrl(gc)}" class="desktop-dropdown-item">${gc.title || gc.name || ''}</a>
                        `).join('')}
                    </div>
                </div>`;
            } else {
                html += `<a href="${linkUrl}" class="desktop-dropdown-item">${child.title || child.name || ''}</a>`;
            }
        });
        return html;
    }
    return renderCategoriesDropdown();
}

function renderCategoriesDropdown() {
    if (!allCategories || allCategories.length === 0) {
        return '<div class="desktop-dropdown-item opacity-50">No categories found</div>';
    }
    let html = '';
    allCategories.forEach(cat => {
        const catSlug = cat.slug || createSlug(cat.name);
        const catUrl = `/category/${catSlug}`;
        const subcategories = allSubcategories.filter(sub => sub.category_id === cat.id);
        
        if (subcategories.length > 0) {
            html += `
            <div style="position:relative;">
                <a href="${catUrl}" class="desktop-dropdown-item has-children">
                    <span>${cat.name}</span>
                    <i class="fa-solid fa-chevron-right" style="font-size:8px;"></i>
                </a>
                <div class="desktop-sub-dropdown">
                    ${subcategories.map(sub => {
                        const subSlug = sub.slug || createSlug(sub.name);
                        return `<a href="/category/${catSlug}/${subSlug}" class="desktop-dropdown-item">${sub.name}</a>`;
                    }).join('')}
                </div>
            </div>`;
        } else {
            html += `<a href="${catUrl}" class="desktop-dropdown-item">${cat.name}</a>`;
        }
    });
    return html;
}

function renderMobileNav(rootItems) {
    let html = '';
    rootItems.forEach((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const linkUrl = getMenuLinkUrl(item);
        const uniqueId = `mobile-sub-${index}-${Date.now()}`;
        
        if (hasChildren) {
            html += `
            <div>
                <div class="mobile-menu-item" onclick="toggleMobileSubmenu('${uniqueId}', this)">
                    <span><i class="fa-solid fa-folder-open mr-3 opacity-30" style="font-size:11px;"></i> ${item.title || item.name || ''}</span>
                    <i class="fa-solid fa-chevron-right opacity-40" style="font-size:10px;"></i>
                </div>
                <div class="mobile-submenu" id="${uniqueId}">
                    ${renderMobileSubItems(item, uniqueId)}
                </div>
            </div>`;
        } else {
            let icon = 'fa-circle';
            switch (item.menu_type) {
                case 'home': icon = 'fa-house'; break;
                case 'products': icon = 'fa-bag-shopping'; break;
                case 'contact': icon = 'fa-envelope'; break;
                case 'about': icon = 'fa-circle-info'; break;
                case 'journal': icon = 'fa-newspaper'; break;
                case 'page': icon = 'fa-file'; break;
            }
            html += `
            <a href="${linkUrl}" class="mobile-menu-item no-underline">
                <span><i class="fa-solid ${icon} mr-3 opacity-30" style="font-size:11px;"></i> ${item.title || item.name || ''}</span>
                <i class="fa-solid fa-chevron-right opacity-30" style="font-size:10px;"></i>
            </a>`;
        }
    });
    return html;
}

function renderMobileSubItems(item, parentId) {
    if (item.menu_type === 'category' && item.show_categories_from_db) {
        return renderMobileCategoriesSubmenu(parentId);
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
                    <div class="mobile-sub-item has-children flex justify-between items-center" onclick="toggleMobileSubmenu('${uniqueId}', this)">
                        <span>${child.title || child.name || ''}</span>
                        <i class="fa-solid fa-chevron-right opacity-40" style="font-size:9px;"></i>
                    </div>
                    <div class="mobile-submenu" id="${uniqueId}" style="border-left-width: 1px; border-left-color: rgba(0,0,0,0.15);">
                        ${child.children.map(gc => `
                            <a href="${getMenuLinkUrl(gc)}" class="mobile-sub-item">${gc.title || gc.name || ''}</a>
                        `).join('')}
                    </div>
                </div>`;
            } else {
                html += `<a href="${linkUrl}" class="mobile-sub-item">${child.title || child.name || ''}</a>`;
            }
        });
        return html;
    }
    return renderMobileCategoriesSubmenu(parentId);
}

function renderMobileCategoriesSubmenu(parentId) {
    if (!allCategories || allCategories.length === 0) {
        return '<div class="mobile-sub-item opacity-50">No categories distributed</div>';
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
                <div class="mobile-sub-item has-children flex justify-between items-center" onclick="toggleMobileSubmenu('${uniqueId}', this)">
                    <span>${cat.name}</span>
                    <i class="fa-solid fa-chevron-right opacity-40" style="font-size:9px;"></i>
                </div>
                <div class="mobile-submenu" id="${uniqueId}" style="border-left-width: 1px; border-left-color: rgba(0,0,0,0.15);">
                    <a href="${catUrl}" class="mobile-sub-item font-bold" style="letter-spacing:0.02em;">All ${cat.name}</a>
                    ${subcategories.map(sub => {
                        const subSlug = sub.slug || createSlug(sub.name);
                        return `<a href="/category/${catSlug}/${subSlug}" class="mobile-sub-item">${sub.name}</a>`;
                    }).join('')}
                </div>
            </div>`;
        } else {
            html += `<a href="${catUrl}" class="mobile-sub-item">${cat.name}</a>`;
        }
    });
    return html;
}

// ============================================================================
// HEADER SYSTEM (Liquid Translucent Engine)
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
    <div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="closeMobileMenu()"></div>
    <div class="mobile-menu-drawer" id="mobileMenuDrawer">
        <div class="mobile-menu-header">
            <a href="/" class="flex items-center gap-3 no-underline">
                <img src="/logo.png" class="w-9 h-9 rounded-xl border border-white/20 shadow-sm" alt="Logo">
                <span class="font-black text-base tracking-wider" style="font-family: var(--font-heading); color: var(--primary);">JAYENWARE</span>
            </a>
            <button onclick="closeMobileMenu()" class="text-xl text-gray-500 hover:text-black transition p-2" aria-label="Close layout">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="mobile-menu-scroll px-5 py-3" id="mobileMenuContent">
            ${renderMobileNav(menuTree)}
        </div>
        <div class="mobile-footer" id="mobileMenuFooter">
            <a href="/login" class="block w-full py-3.5 bg-black text-white rounded-xl text-center font-bold uppercase tracking-widest text-[10px] no-underline">Account Access</a>
        </div>
    </div>
    
    <nav class="glass-nav fixed w-full top-0 z-50" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex justify-between items-center">
            <a href="/" class="flex items-center gap-2 sm:gap-3 shrink-0 no-underline">
                <img src="/logo.png" class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl" alt="JAYENWARE Logo" width="40" height="40">
                <span class="text-base sm:text-lg lg:text-xl font-black tracking-widest" style="font-family: var(--font-heading); color: var(--primary);">JAYENWARE</span>
            </a>
            <div class="hidden lg:flex items-center gap-0" id="desktopNavLinks">
                ${renderDesktopNav(menuTree)}
            </div>
            <div class="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
                <a href="/wishlist" class="relative p-2 no-underline text-black transition hover:opacity-60">
                    <i class="fa-regular fa-heart text-lg"></i>
                    <span id="wish-count" class="absolute top-0.5 right-0.5 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                <a href="/cart" onclick="toggleCart();return false;" class="relative p-2 no-underline text-black transition hover:opacity-60">
                    <i class="fa-solid fa-bag-shopping text-lg"></i>
                    <span id="cart-count" class="absolute top-0.5 right-0.5 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                <div id="auth-nav-area" class="hidden lg:block">
                    <a href="/login" class="px-5 py-2.5 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all no-underline inline-block">Sign In</a>
                </div>
                <button onclick="openMobileMenu()" class="lg:hidden text-lg p-2 text-black transition hover:opacity-60">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
    </nav>
    
    <div id="cart-drawer" class="fixed top-0 right-0 w-full max-w-sm sm:max-w-md h-full z-[60] shadow-2xl flex flex-col" style="transform: translateX(100%);">
        <div class="p-5 border-b flex justify-between items-center bg-soft">
            <h2 class="text-sm font-black uppercase tracking-widest">Shopping Bag Layout</h2>
            <button onclick="toggleCart()" class="text-gray-400 hover:text-white text-lg transition p-1">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div id="cart-items" class="flex-grow overflow-y-auto p-5 space-y-4 custom-scroll"></div>
        <div class="p-5 border-t bg-soft">
            <div class="space-y-2 mb-5 text-[11px] uppercase tracking-wider">
                <div class="flex justify-between opacity-60"><span>Subtotal Architecture</span><span id="cart-subtotal">৳ 0.00</span></div>
                <div class="flex justify-between border-t border-white/10 pt-3">
                    <span class="font-bold">Total Valuation</span>
                    <span id="cart-total" class="text-base font-black">৳ 0.00</span>
                </div>
            </div>
            <a href="/checkout" class="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[11px] transition shadow-lg no-underline text-center block hover:bg-neutral-100">Proceed to Checkout</a>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// ============================================================================
// FOOTER SYSTEM (Pure Minimalist Infrastructure)
// ============================================================================
function renderFooter() {
    const footerHTML = `
    <footer class="pt-16 pb-8" id="main-footer">
        <div class="max-w-7xl mx-auto px-4sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div class="col-span-2 md:col-span-1">
                    <h4 class="text-sm font-bold tracking-widest mb-4">JAYENWARE</h4>
                    <p class="text-[11px] leading-relaxed mb-4 opacity-50">Premium lifestyle apparel architecture calibrated for modern aesthetics. A tactical subsidiary of <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="font-bold underline decoration-white/20 text-white">BINZEO</a>.</p>
                    <div class="flex gap-4 text-base">
                        <a href="https://www.facebook.com/jayenware" target="_blank" rel="noopener noreferrer" class="hover:opacity-50"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/jayenware" target="_blank" rel="noopener noreferrer" class="hover:opacity-50"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://youtube.com/@jayenware" target="_blank" rel="noopener noreferrer" class="hover:opacity-50"><i class="fa-brands fa-youtube"></i></a>
                    </div>
                </div>
                <div>
                    <h5 class="text-xs uppercase tracking-widest mb-4 opacity-40">Pipeline Links</h5>
                    <ul class="space-y-2 text-[11px] list-none p-0 opacity-70">
                        <li><a href="/about" class="no-underline">About Corporate</a></li>
                        <li><a href="/shipping" class="no-underline">Shipping Diagnostics</a></li>
                        <li><a href="/returns" class="no-underline">Returns Execution</a></li>
                        <li><a href="/contact" class="no-underline">Contact Portal</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-xs uppercase tracking-widest mb-4 opacity-40">Governance</h5>
                    <ul class="space-y-2 text-[11px] list-none p-0 opacity-70">
                        <li><a href="/privacy-policy" class="no-underline">Privacy Core</a></li>
                        <li><a href="/terms-and-conditions" class="no-underline">Terms Framework</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-xs uppercase tracking-widest mb-4 opacity-40">Direct Contact</h5>
                    <p class="text-[11px] opacity-60"><i class="fa-regular fa-envelope mr-1"></i> binzeo369@outlook.com</p>
                </div>
            </div>
            <div class="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600">
                <p class="text-[9px] uppercase tracking-widest">Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="text-neutral-400 no-underline font-bold">BINZEO Infrastructure</a></p>
                <p class="text-[9px] uppercase tracking-widest">&copy; <span id="display-year"></span> JAYENWARE Engine. All parameters reserved.</p>
            </div>
        </div>
    </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// ============================================================================
// TOAST INTERFACE ARCHITECTURE
// ============================================================================
function showToast(text, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.innerHTML = `
            <div class="shadow-2xl p-4 flex items-center gap-3.5 min-w-[280px]">
                <span id="toast-icon" class="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"></span>
                <p id="toast-text" class="text-xs font-bold flex-grow tracking-wide" style="font-family: var(--font-body);"></p>
                <button onclick="hideToast()" class="text-gray-400 hover:text-black shrink-0 transition"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
        document.body.appendChild(toast);
    }
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');
    if (toastText) toastText.innerText = text;
    if (toastIcon) {
        toastIcon.className = 'w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0';
        if (type === 'success') {
            toastIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (type === 'error') {
            toastIcon.innerHTML = '<i class="fa-solid fa-exclamation"></i>';
        } else {
            toastIcon.innerHTML = '<i class="fa-solid fa-info"></i>';
        }
    }
    toast.style.transform = 'translateX(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.transform = 'translateX(120%)'; }, 3200);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.style.transform = 'translateX(120%)';
}

// ============================================================================
// CART CONTROLLER & DATA BINDING
// ============================================================================
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) renderCartItems();
    }
}

function addToCart(productId, productData) {
    if (!productData) { showToast('Execution failed: Product configuration missing', 'error'); return; }
    if (productData.stock <= 0) return showToast('Inventory allocation depleted', 'error');
    
    const existingIndex = cart.findIndex(item => item.product_id === productData.id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            product_id: productData.id,
            title: productData.title,
            price: productData.price,
            img: productData.img,
            quantity: 1
        });
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
            <img src="${item.img}" class="w-14 h-14 object-cover rounded-xl shrink-0 bg-neutral-900 border border-white/10" alt="${item.title}">
            <div class="flex-grow min-w-0">
                <h4 class="text-xs font-bold truncate tracking-wide">${item.title}</h4>
                <div class="flex items-center gap-3 mt-1">
                    <p class="text-xs font-black">৳${itemTotal.toFixed(2)}</p>
                    <span class="text-[10px] opacity-50 tracking-wider">Allocation: ${item.quantity || 1}</span>
                </div>
            </div>
            <button onclick="removeFromCart(${idx})" class="text-neutral-400 hover:text-white transition p-2 shrink-0">
                <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
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

// ============================================================================
// WISHLIST CORE LOGIC
// ============================================================================
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
// MOBILE EXPANSION CONTROLLER
// ============================================================================
function openMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    document.querySelectorAll('.mobile-submenu.open').forEach(sub => sub.classList.remove('open'));
    document.querySelectorAll('.mobile-menu-item.expanded').forEach(item => item.classList.remove('expanded'));
}

function toggleMobileSubmenu(submenuId, element) {
    const submenu = document.getElementById(submenuId);
    if (!submenu) return;
    
    const isOpen = submenu.classList.contains('open');
    const parentContainer = submenu.parentElement.parentElement;
    if (parentContainer) {
        parentContainer.querySelectorAll('.mobile-submenu.open').forEach(sub => {
            if (sub.id !== submenuId) sub.classList.remove('open');
        });
        parentContainer.querySelectorAll('.mobile-menu-item.expanded').forEach(item => {
            if (item !== element) item.classList.remove('expanded');
        });
    }
    
    if (isOpen) {
        submenu.classList.remove('open');
        if (element) element.classList.remove('expanded');
    } else {
        submenu.classList.add('open');
        if (element) element.classList.add('expanded');
    }
}

function getProductSlug(product) {
    if (!product || !product.title) return '';
    return product.title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 80);
}

// ============================================================================
// WINDOWS TARGET BINDING API
// ============================================================================
window.showToast = showToast;
window.hideToast = hideToast;
window.toggleWishlist = toggleWishlist;
window.addToCart = addToCart;
window.toggleCart = toggleCart;
window.removeFromCart = removeFromCart;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleMobileSubmenu = toggleMobileSubmenu;
window.getProductSlug = getProductSlug;
window.saveCart = saveCart;
window.renderCartItems = renderCartItems;
window.updateCounts = updateCounts;
window.createSlug = createSlug;
window.getCategoryUrl = getCategoryUrl;

// Expose state pipelines
window.cart = cart;
window.wishlist = wishlist;
window.allMenuItems = allMenuItems;
window.allCategories = allCategories;
window.allSubcategories = allSubcategories;

// ============================================================================
// SYSTEM ARCHITECTURE INITIALIZATION
// ============================================================================
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
