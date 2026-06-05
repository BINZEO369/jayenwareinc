// ============================================
// components.js - Shared Header, Footer & Common Functions
// Version: 3.3 (Font System Integration + Dynamic from Database)
// Fixed: url→link, type→menu_type (Database consistency)
// ============================================

let cart = JSON.parse(localStorage.getItem('jayen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jayen_wish') || '[]');
let userSession = null;
let allMenuItems = [];
let allCategories = [];
let allSubcategories = [];

// ============================================
// SHARED CSS STYLES (Font System Integration)
// ============================================
function injectSharedStyles() {
    const styles = `
    <style id="shared-components-style">
        :root {
            --font-heading: 'Playfair Display', serif;
            --font-body: 'Inter', sans-serif;
            --primary: #1d1d1f;
            --accent: #86868b;
            --soft: #f5f5f7;
            --blue: #007aff;
        }
        
        /* Font Utility Classes */
        .text-title-xl { 
            font-family: var(--font-heading); 
            font-size: clamp(2rem, 5vw, 3.5rem); 
            line-height: 1.1; 
            font-weight: 900; 
        }
        .text-title-lg { 
            font-family: var(--font-heading); 
            font-size: clamp(1.5rem, 4vw, 2.5rem); 
            line-height: 1.2; 
            font-weight: 700; 
        }
        .text-title-md { 
            font-family: var(--font-heading); 
            font-size: clamp(1.25rem, 3vw, 2rem); 
            line-height: 1.2; 
            font-weight: 700; 
        }
        .text-title-sm { 
            font-family: var(--font-heading); 
            font-size: clamp(1rem, 2.5vw, 1.5rem); 
            line-height: 1.3; 
            font-weight: 600; 
        }
        
        .text-subtitle-lg { 
            font-family: var(--font-body); 
            font-size: clamp(1.125rem, 2vw, 1.25rem); 
            line-height: 1.4; 
            font-weight: 500; 
        }
        .text-subtitle-md { 
            font-family: var(--font-body); 
            font-size: clamp(1rem, 1.5vw, 1.125rem); 
            line-height: 1.4; 
            font-weight: 500; 
        }
        .text-subtitle-sm { 
            font-family: var(--font-body); 
            font-size: 0.875rem; 
            line-height: 1.5; 
            font-weight: 500; 
        }
        
        .text-body-lg { 
            font-family: var(--font-body); 
            font-size: 1.125rem; 
            line-height: 1.6; 
            font-weight: 400; 
        }
        .text-body-md { 
            font-family: var(--font-body); 
            font-size: 1rem; 
            line-height: 1.6; 
            font-weight: 400; 
        }
        .text-body-sm { 
            font-family: var(--font-body); 
            font-size: 0.875rem; 
            line-height: 1.5; 
            font-weight: 400; 
        }
        .text-body-xs { 
            font-family: var(--font-body); 
            font-size: 0.75rem; 
            line-height: 1.5; 
            font-weight: 400; 
        }
        
        .text-caption { 
            font-family: var(--font-body); 
            font-size: 0.75rem; 
            line-height: 1.4; 
            font-weight: 500; 
        }
        .text-overline { 
            font-family: var(--font-body); 
            font-size: 0.625rem; 
            line-height: 1.4; 
            font-weight: 600; 
            letter-spacing: 0.1em; 
            text-transform: uppercase; 
        }
        
        .glass-nav {
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(50px) saturate(180%);
            -webkit-backdrop-filter: blur(50px) saturate(180%);
            border-bottom: 1px solid rgba(0,0,0,0.06);
            transition: all 0.3s ease;
        }
        .nav-link {
            position: relative;
            font-family: var(--font-body);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            padding: 8px 0;
            transition: color 0.3s ease;
            color: #1d1d1f;
            text-decoration: none;
        }
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0;
            width: 0; height: 1.5px;
            background: #1d1d1f;
            transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
        
        /* Desktop Dropdown */
        .desktop-dropdown {
            position: relative;
        }
        .desktop-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(8px);
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-width: 240px;
            max-width: 320px;
            padding: 8px 0;
            z-index: 100;
        }
        .desktop-dropdown:hover .desktop-dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
        .desktop-dropdown-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            font-family: var(--font-body);
            font-size: 12px;
            font-weight: 500;
            color: #1d1d1f;
            text-decoration: none;
            transition: all 0.2s ease;
            letter-spacing: 0.03em;
            white-space: nowrap;
            cursor: pointer;
        }
        .desktop-dropdown-item:hover {
            background: #f5f5f7;
            color: #007aff;
        }
        .desktop-dropdown-item.has-children {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .desktop-sub-dropdown {
            position: absolute;
            left: 100%;
            top: 0;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            min-width: 220px;
            max-width: 300px;
            padding: 8px 0;
        }
        .desktop-dropdown-item.has-children:hover .desktop-sub-dropdown {
            opacity: 1;
            visibility: visible;
        }
        
        /* Mobile Menu */
        .mobile-menu-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 199; opacity: 0; visibility: hidden;
            transition: all 0.3s ease;
        }
        .mobile-menu-overlay.active { opacity: 1; visibility: visible; }
        .mobile-menu-drawer {
            position: fixed; top: 0; left: 0;
            width: 85%; max-width: 380px;
            height: 100vh; height: 100dvh;
            background: white; z-index: 200;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex; flex-direction: column;
        }
        .mobile-menu-drawer.open { transform: translateX(0); }
        .mobile-menu-drawer .mobile-menu-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 18px 20px; border-bottom: 1px solid #f0f0f0;
            background: white; flex-shrink: 0;
        }
        .mobile-menu-drawer .mobile-menu-header span {
            font-family: var(--font-heading);
        }
        .mobile-menu-drawer .mobile-menu-scroll {
            flex: 1; overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding: 12px 20px;
        }
        .mobile-menu-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 14px 0; border-bottom: 1px solid #f5f5f5;
            font-family: var(--font-body);
            font-size: 14px; font-weight: 600; letter-spacing: 0.05em;
            cursor: pointer; color: #1d1d1f; text-decoration: none;
            transition: color 0.2s ease;
        }
        .mobile-menu-item i.fa-chevron-right { 
            font-size: 11px; color: #c0c0c0; transition: transform 0.3s ease; 
        }
        .mobile-menu-item.expanded i.fa-chevron-right { 
            transform: rotate(90deg); 
        }
        .mobile-submenu {
            display: none;
            padding-left: 16px;
            border-left: 2px solid #f0f0f0;
            margin: 4px 0 4px 8px;
        }
        .mobile-submenu.open { display: block; }
        .mobile-sub-item {
            display: block;
            padding: 11px 12px;
            font-family: var(--font-body);
            font-size: 13px;
            color: #86868b;
            text-decoration: none;
            transition: color 0.2s ease;
            font-weight: 500;
            cursor: pointer;
        }
        .mobile-sub-item:hover { color: #007aff; }
        .mobile-sub-item::before {
            content: '•';
            margin-right: 8px;
            color: #007aff;
        }
        .mobile-sub-item.has-children {
            font-weight: 600;
            color: #1d1d1f;
        }
        .mobile-footer {
            padding: 20px; border-top: 1px solid #f0f0f0;
            background: #f5f5f7; flex-shrink: 0;
        }
        .mobile-footer a {
            font-family: var(--font-body);
        }
        
        /* Cart Drawer */
        #cart-drawer {
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
            transform: translateX(100%);
        }
        #cart-drawer.open { transform: translateX(0) !important; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #d2d2d7; border-radius: 10px; }
        
        /* Toast */
        #toast {
            position: fixed; top: 16px; right: 16px; z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
            max-width: calc(100vw - 32px);
        }
        #toast p {
            font-family: var(--font-body);
        }
        
        body { 
            padding-top: 56px; 
            font-family: var(--font-body);
        }
        @media (min-width: 640px) { body { padding-top: 64px; } }
        @media (min-width: 1024px) { body { padding-top: 80px; } }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================
// LOAD FONTS CONFIGURATION
// ============================================
function loadFontsConfiguration() {
    // Check if fonts.js is already loaded
    if (!window.JAYENWARE_FONTS) {
        const script = document.createElement('script');
        script.src = '/fonts.js';
        script.async = false;
        document.head.appendChild(script);
    }
}

// ============================================
// SLUG HELPER
// ============================================
function createSlug(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ============================================
// API HELPERS: Fetch data from server
// ============================================
async function fetchMenuItems() {
    try {
        const response = await fetch('/api/menu-items');
        if (!response.ok) throw new Error('Failed to fetch menu items');
        const data = await response.json();
        allMenuItems = data;
        return data;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        allMenuItems = [];
        return [];
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        allCategories = data;
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        allCategories = [];
        return [];
    }
}

async function fetchSubcategories(categorySlug = null) {
    try {
        let url = '/api/subcategories';
        if (categorySlug) {
            url += `?category_slug=${categorySlug}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch subcategories');
        const data = await response.json();
        
        if (!categorySlug) {
            allSubcategories = data;
        }
        return data;
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return [];
    }
}

// ============================================
// BUILD MENU TREE FROM FLAT DATA
// ============================================
function buildMenuTree(items, parentId = null) {
    return items
        .filter(item => {
            const itemParentId = item.parent_id || null;
            const targetParentId = parentId || null;
            return itemParentId === targetParentId;
        })
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(item => ({
            ...item,
            children: buildMenuTree(items, item.id)
        }));
}

// ============================================
// GET LINK URL FOR MENU ITEM (Fixed: url→link, type→menu_type)
// ============================================
function getMenuLinkUrl(item) {
    // ✅ সরাসরি ডাটাবেজের link কলাম ব্যবহার
    if (item.link && item.link.trim() !== '') {
        return item.link;
    }
    
    const slug = item.slug || '';
    
    // ✅ ডাটাবেজের menu_type কলাম ব্যবহার
    switch (item.menu_type) {
        case 'home':
            return '/';
        case 'products':
            return '/products';
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
        case 'page':
            return slug ? `/${slug}` : '#';
        case 'custom':
            return item.link || '#';
        case 'contact':
            return '/contact';
        case 'about':
            return '/about';
        case 'journal':
            return '/journal';
        default:
            return slug ? `/${slug}` : '#';
    }
}

// ============================================
// GET CATEGORY/SUBCATEGORY URL
// ============================================
function getCategoryUrl(category, subcategory = null) {
    const catSlug = category.slug || createSlug(category.name);
    if (subcategory) {
        const subSlug = subcategory.slug || createSlug(subcategory.name);
        return `/category/${catSlug}/${subSlug}`;
    }
    return `/category/${catSlug}`;
}

// ============================================
// RENDER DESKTOP NAVIGATION
// ============================================
function renderDesktopNav(rootItems) {
    let html = '';
    
    rootItems.forEach(item => {
        const hasChildren = item.children && item.children.length > 0;
        const linkUrl = getMenuLinkUrl(item);
        
        if (hasChildren) {
            html += `
            <div class="desktop-dropdown">
                <a href="${linkUrl}" class="nav-link px-5" style="display:inline-flex;align-items:center;gap:4px;">
                    ${item.title || item.name || ''}
                    <i class="fa-solid fa-chevron-down" style="font-size:8px;"></i>
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
    // ✅ menu_type চেক (ডাটাবেজ কনসিস্টেন্ট)
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
                        ${child.title || child.name || ''}
                        <i class="fa-solid fa-chevron-right" style="font-size:9px;"></i>
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
        return '<div class="desktop-dropdown-item" style="color:#86868b;">No categories found</div>';
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
                    ${cat.name}
                    <i class="fa-solid fa-chevron-right" style="font-size:9px;"></i>
                </a>
                <div class="desktop-sub-dropdown">
                    ${subcategories.map(sub => {
                        const subSlug = sub.slug || createSlug(sub.name);
                        const subUrl = `/category/${catSlug}/${subSlug}`;
                        return `<a href="${subUrl}" class="desktop-dropdown-item">${sub.name}</a>`;
                    }).join('')}
                </div>
            </div>`;
        } else {
            html += `<a href="${catUrl}" class="desktop-dropdown-item">${cat.name}</a>`;
        }
    });
    
    return html;
}

// ============================================
// RENDER MOBILE NAVIGATION
// ============================================
function renderMobileNav(rootItems) {
    let html = '';
    
    rootItems.forEach((item, index) => {
        const hasChildren = item.children && item.children.length > 0;
        const linkUrl = getMenuLinkUrl(item);
        const uniqueId = `mobile-sub-${index}-${Date.now()}`;
        
        if (hasChildren) {
            html += `
            <div>
                <div class="mobile-menu-item" onclick="toggleMobileSubmenu('${uniqueId}', this)" style="cursor:pointer;">
                    <span><i class="fa-solid fa-folder mr-3 text-gray-300" style="font-size:12px;"></i> ${item.title || item.name || ''}</span>
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
                <div class="mobile-submenu" id="${uniqueId}">
                    ${renderMobileSubItems(item, uniqueId)}
                </div>
            </div>`;
        } else {
            // ✅ menu_type দিয়ে আইকন নির্ধারণ (ডাটাবেজ কনসিস্টেন্ট)
            let icon = 'fa-circle';
            switch (item.menu_type) {
                case 'home': icon = 'fa-house'; break;
                case 'products': icon = 'fa-bag-shopping'; break;
                case 'contact': icon = 'fa-envelope'; break;
                case 'about': icon = 'fa-circle-info'; break;
                case 'journal': icon = 'fa-newspaper'; break;
                case 'page': icon = 'fa-file'; break;
                default: icon = 'fa-circle'; break;
            }
            html += `
            <a href="${linkUrl}" class="mobile-menu-item no-underline">
                <span><i class="fa-solid ${icon} mr-3 text-gray-300" style="font-size:12px;"></i> ${item.title || item.name || ''}</span>
                <i class="fa-solid fa-chevron-right" style="font-size:11px;color:#c0c0c0;"></i>
            </a>`;
        }
    });
    
    return html;
}

function renderMobileSubItems(item, parentId) {
    // ✅ menu_type চেক (ডাটাবেজ কনসিস্টেন্ট)
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
                    <div class="mobile-sub-item has-children" onclick="toggleMobileSubmenu('${uniqueId}', this)" style="cursor:pointer;">
                        ${child.title || child.name || ''}
                        <i class="fa-solid fa-chevron-right" style="font-size:10px;margin-left:6px;"></i>
                    </div>
                    <div class="mobile-submenu" id="${uniqueId}" style="padding-left:12px;border-left-color:#e0e0e0;">
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
        return '<div class="mobile-sub-item" style="color:#86868b;">No categories</div>';
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
                <div class="mobile-sub-item has-children" onclick="toggleMobileSubmenu('${uniqueId}', this)" style="cursor:pointer;">
                    ${cat.name}
                    <i class="fa-solid fa-chevron-right" style="font-size:10px;margin-left:6px;"></i>
                </div>
                <div class="mobile-submenu" id="${uniqueId}" style="padding-left:12px;border-left-color:#e0e0e0;">
                    <a href="${catUrl}" class="mobile-sub-item" style="font-weight:600;">All ${cat.name}</a>
                    ${subcategories.map(sub => {
                        const subSlug = sub.slug || createSlug(sub.name);
                        const subUrl = `/category/${catSlug}/${subSlug}`;
                        return `<a href="${subUrl}" class="mobile-sub-item">${sub.name}</a>`;
                    }).join('')}
                </div>
            </div>`;
        } else {
            html += `<a href="${catUrl}" class="mobile-sub-item">${cat.name}</a>`;
        }
    });
    
    return html;
}

// ============================================
// HEADER COMPONENT
// ============================================
async function renderHeader() {
    const [menuItems, categories, subcategories] = await Promise.all([
        fetchMenuItems(),
        fetchCategories(),
        fetchSubcategories()
    ]);
    
    allCategories = categories;
    allSubcategories = subcategories;
    
    const menuTree = buildMenuTree(menuItems);
    const rootItems = menuTree;
    
    const headerHTML = `
    <div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="closeMobileMenu()"></div>
    <div class="mobile-menu-drawer" id="mobileMenuDrawer">
        <div class="mobile-menu-header">
            <a href="/" class="flex items-center gap-3 no-underline">
                <img src="/logo.png" class="w-9 h-9 rounded-lg" alt="Logo">
                <span class="font-black text-lg" style="font-family: var(--font-heading); color: var(--primary);">JAYENWARE</span>
            </a>
            <button onclick="closeMobileMenu()" class="text-2xl text-gray-400 hover:text-primary transition p-2" aria-label="Close menu">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="mobile-menu-scroll" id="mobileMenuContent">
            ${renderMobileNav(rootItems)}
        </div>
        <div class="mobile-footer" id="mobileMenuFooter">
            <a href="/login" class="block w-full py-3 bg-primary text-white rounded-xl text-center font-bold uppercase tracking-wider text-xs no-underline" style="font-family: var(--font-body);">Sign In</a>
        </div>
    </div>
    <nav class="glass-nav fixed w-full top-0 z-50" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex justify-between items-center">
            <a href="/" class="flex items-center gap-2 sm:gap-3 shrink-0 no-underline" aria-label="JAYENWARE Home">
                <img src="/logo.png" class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg" alt="JAYENWARE Logo" loading="eager" width="40" height="40">
                <span class="text-lg sm:text-xl lg:text-2xl font-black tracking-tight" style="font-family: var(--font-heading); color: var(--primary);">JAYENWARE</span>
            </a>
            <div class="hidden lg:flex items-center gap-0" id="desktopNavLinks">
                ${renderDesktopNav(rootItems)}
            </div>
            <div class="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
                <a href="/wishlist" class="relative p-1.5 no-underline text-primary hover:text-blue transition" aria-label="Wishlist">
                    <i class="fa-regular fa-heart text-lg lg:text-xl"></i>
                    <span id="wish-count" class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold" style="font-family: var(--font-body);">0</span>
                </a>
                <a href="/cart" onclick="toggleCart();return false;" class="relative p-1.5 no-underline text-primary hover:text-blue transition" aria-label="Shopping Cart">
                    <i class="fa-solid fa-bag-shopping text-lg lg:text-xl"></i>
                    <span id="cart-count" class="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold" style="font-family: var(--font-body);">0</span>
                </a>
                <div id="auth-nav-area" class="hidden lg:block">
                    <a href="/login" class="px-5 py-2.5 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-blue transition-all no-underline inline-block" style="font-family: var(--font-body);">Sign In</a>
                </div>
                <button onclick="openMobileMenu()" class="lg:hidden text-xl p-1.5 text-primary hover:text-blue transition" aria-label="Menu">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
    </nav>
    <div id="cart-drawer" class="fixed top-0 right-0 w-full max-w-sm sm:max-w-md h-full bg-white z-[60] shadow-2xl flex flex-col" style="transform: translateX(100%);">
        <div class="p-4 sm:p-6 border-b flex justify-between items-center bg-soft">
            <h2 class="text-base sm:text-lg font-black uppercase tracking-tighter" style="font-family: var(--font-heading);">Shopping Bag</h2>
            <button onclick="toggleCart()" class="text-gray-400 hover:text-primary text-lg sm:text-xl transition p-1">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div id="cart-items" class="flex-grow overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 custom-scroll"></div>
        <div class="p-4 sm:p-6 border-t bg-soft">
            <div class="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 text-[10px] sm:text-xs" style="font-family: var(--font-body);">
                <div class="flex justify-between text-gray-500"><span>Subtotal</span><span id="cart-subtotal">৳ 0.00</span></div>
                <div class="flex justify-between border-t pt-2 sm:pt-3">
                    <span class="font-bold uppercase">Total</span>
                    <span id="cart-total" class="text-lg sm:text-xl font-black">৳ 0.00</span>
                </div>
            </div>
            <a href="/checkout" class="w-full py-3 sm:py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-wider text-[10px] sm:text-xs hover:bg-blue transition shadow-lg no-underline text-center block" style="font-family: var(--font-body);">Checkout</a>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// ============================================
// FOOTER COMPONENT
// ============================================
function renderFooter() {
    const footerHTML = `
    <footer class="bg-primary text-gray-400 pt-12 sm:pt-16 pb-6 sm:pb-8" id="main-footer" style="font-family: var(--font-body);">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 sm:mb-12">
                <div class="col-span-2 md:col-span-1">
                    <h4 class="text-white font-black text-base sm:text-lg mb-3 sm:mb-4" style="font-family: var(--font-heading);">JAYENWARE</h4>
                    <p class="text-[10px] sm:text-xs leading-relaxed mb-4" style="font-family: var(--font-body);">Premium lifestyle products designed for modern living. A subsidiary of <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="text-blue font-bold hover:text-white transition">BINZEO</a>.</p>
                    <div class="flex gap-3 text-base sm:text-lg">
                        <a href="https://www.facebook.com/jayenware" target="_blank" rel="noopener noreferrer" class="hover:text-blue transition"><i class="fa-brands fa-facebook"></i></a>
                        <a href="https://www.instagram.com/jayenware" target="_blank" rel="noopener noreferrer" class="hover:text-blue transition"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://youtube.com/@jayenware" target="_blank" rel="noopener noreferrer" class="hover:text-blue transition"><i class="fa-brands fa-youtube"></i></a>
                    </div>
                </div>
                <div>
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4" style="font-family: var(--font-body);">Quick Links</h5>
                    <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0" style="font-family: var(--font-body);">
                        <li><a href="/about" class="hover:text-white transition no-underline">About</a></li>
                        <li><a href="/shipping" class="hover:text-white transition no-underline">Shipping</a></li>
                        <li><a href="/returns" class="hover:text-white transition no-underline">Returns</a></li>
                        <li><a href="/contact" class="hover:text-white transition no-underline">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4" style="font-family: var(--font-body);">Legal</h5>
                    <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0" style="font-family: var(--font-body);">
                        <li><a href="/privacy-policy" class="hover:text-white transition no-underline">Privacy Policy</a></li>
                        <li><a href="/terms-and-conditions" class="hover:text-white transition no-underline">Terms & Conditions</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4" style="font-family: var(--font-body);">Contact</h5>
                    <p class="text-[9px] text-gray-500" style="font-family: var(--font-body);"><i class="fa-regular fa-envelope"></i> binzeo369@outlook.com</p>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500" style="font-family: var(--font-body);">Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="text-blue font-bold hover:text-white transition no-underline">BINZEO</a></p>
                <p class="text-[8px] sm:text-[9px]" style="font-family: var(--font-body);">&copy; <span id="display-year"></span> JAYENWARE. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(text, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.innerHTML = `
            <div class="bg-white shadow-2xl rounded-2xl p-3 flex items-center gap-3 min-w-[260px] border border-gray-100">
                <span id="toast-icon" class="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"></span>
                <p id="toast-text" class="text-xs font-bold flex-grow" style="font-family: var(--font-body);"></p>
                <button onclick="hideToast()" class="text-gray-300 hover:text-gray-600 shrink-0"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;
        document.body.appendChild(toast);
    }
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');
    if (toastText) toastText.innerText = text;
    if (toastIcon) {
        if (type === 'success') {
            toastIcon.className = 'w-8 h-8 rounded-full flex items-center justify-center text-sm bg-green-100 text-green-600 shrink-0';
            toastIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (type === 'error') {
            toastIcon.className = 'w-8 h-8 rounded-full flex items-center justify-center text-sm bg-red-100 text-red-600 shrink-0';
            toastIcon.innerHTML = '<i class="fa-solid fa-exclamation"></i>';
        } else {
            toastIcon.className = 'w-8 h-8 rounded-full flex items-center justify-center text-sm bg-blue-100 text-blue-600 shrink-0';
            toastIcon.innerHTML = '<i class="fa-solid fa-info"></i>';
        }
    }
    toast.style.transform = 'translateX(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.style.transform = 'translateX(120%)'; }, 3000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.style.transform = 'translateX(120%)';
}

// ============================================
// CART FUNCTIONS
// ============================================
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) renderCartItems();
    }
}

function addToCart(productId, productData) {
    if (!productData) { showToast('Product data missing', 'error'); return; }
    if (productData.stock <= 0) return showToast('Out of stock', 'error');
    
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
    showToast('Added to Bag! 🎉', 'success');
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
        container.innerHTML = '<p class="text-center text-gray-400 py-10 text-sm" style="font-family: var(--font-body);">Your bag is empty</p>';
        if (subtotalEl) subtotalEl.innerText = '৳ 0.00';
        if (totalEl) totalEl.innerText = '৳ 0.00';
        return;
    }
    let sub = 0;
    container.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * (item.quantity || 1);
        sub += itemTotal;
        return `<div class="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-soft rounded-2xl">
            <img src="${item.img}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl shrink-0" alt="${item.title}">
            <div class="flex-grow min-w-0" style="font-family: var(--font-body);">
                <h4 class="text-xs sm:text-sm font-bold truncate">${item.title}</h4>
                <div class="flex items-center gap-2 mt-1">
                    <p class="text-xs sm:text-sm font-black">৳${itemTotal.toFixed(2)}</p>
                    <span class="text-[10px] text-gray-400">Qty: ${item.quantity || 1}</span>
                </div>
            </div>
            <button onclick="removeFromCart(${idx})" class="text-red-400 hover:text-red-600 p-1.5 shrink-0">
                <i class="fa-solid fa-trash text-xs sm:text-sm"></i>
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

// ============================================
// WISHLIST FUNCTIONS
// ============================================
function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
        showToast('Removed from Wishlist', 'info');
    } else {
        wishlist.push(id);
        showToast('Added to Wishlist ❤️', 'success');
    }
    localStorage.setItem('jayen_wish', JSON.stringify(wishlist));
    updateCounts();
}

// ============================================
// MOBILE MENU FUNCTIONS
// ============================================
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

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getProductSlug(product) {
    if (!product || !product.title) return '';
    return product.title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 80);
}

// ============================================
// GLOBAL EXPOSURE
// ============================================
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
window.cart = cart;
window.wishlist = wishlist;
window.allMenuItems = allMenuItems;
window.allCategories = allCategories;
window.allSubcategories = allSubcategories;

// ============================================
// INITIALIZATION
// ============================================
async function initSharedComponents() {
    loadFontsConfiguration();
    injectSharedStyles();
    await renderHeader();
    renderFooter();
    updateCounts();
    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
    setTimeout(initSharedComponents, 100);
}
