// ============================================
// components.js - Shared Header, Footer & Common Functions
// Version: 4.0 (Complete Dynamic Menu from Database)
// ============================================

let cart = JSON.parse(localStorage.getItem('jayen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jayen_wish') || '[]');
let userSession = null;
let allCategories = [];
let allSubcategories = [];
let allMenuItems = [];

// ============================================
// SUPABASE CLIENT INITIALIZATION
// ============================================
function getSupabase() {
    if (typeof supabase !== 'undefined' && typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
        return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return null;
}

// ============================================
// API FETCH FUNCTIONS
// ============================================
async function fetchCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        allCategories = await response.json();
        return allCategories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function fetchSubcategories(categorySlug = null) {
    try {
        let url = '/api/subcategories';
        if (categorySlug) url += `?category_slug=${categorySlug}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch subcategories');
        allSubcategories = await response.json();
        return allSubcategories;
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return [];
    }
}

async function fetchMenuItems() {
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) throw new Error('Failed to fetch menu items');
        allMenuItems = await response.json();
        return allMenuItems;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

// ============================================
// SHARED CSS STYLES
// ============================================
function injectSharedStyles() {
    const styles = `
    <style id="shared-components-style">
        :root {
            --primary: #1d1d1f;
            --accent: #86868b;
            --soft: #f5f5f7;
            --blue: #007aff;
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
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            padding: 8px 0;
            transition: color 0.3s ease;
            color: #1d1d1f;
            text-decoration: none;
            cursor: pointer;
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
        .nav-dropdown {
            position: relative;
        }
        .nav-dropdown-content {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(50px) saturate(180%);
            -webkit-backdrop-filter: blur(50px) saturate(180%);
            border: 1px solid rgba(0,0,0,0.06);
            border-radius: 16px;
            padding: 8px 0;
            min-width: 240px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            z-index: 51;
            max-height: 70vh;
            overflow-y: auto;
        }
        .nav-dropdown:hover .nav-dropdown-content {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(5px);
        }
        .nav-dropdown-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            font-size: 12px;
            font-weight: 500;
            color: #1d1d1f;
            text-decoration: none;
            transition: all 0.2s ease;
            letter-spacing: 0.05em;
            white-space: nowrap;
        }
        .nav-dropdown-item:hover {
            background: #f5f5f7;
            color: #007aff;
        }
        .nav-dropdown-item.has-children {
            position: relative;
        }
        .nav-dropdown-item.has-children::after {
            content: '›';
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 18px;
            color: #86868b;
            transition: transform 0.2s ease;
        }
        .nav-dropdown-item.has-children:hover::after {
            transform: translateY(-50%) translateX(3px);
            color: #007aff;
        }
        
        /* Sub-dropdown */
        .nav-sub-dropdown {
            position: absolute;
            left: 100%;
            top: -8px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(50px) saturate(180%);
            -webkit-backdrop-filter: blur(50px) saturate(180%);
            border: 1px solid rgba(0,0,0,0.06);
            border-radius: 12px;
            padding: 8px 0;
            min-width: 220px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            pointer-events: none;
        }
        .nav-dropdown-item.has-children:hover .nav-sub-dropdown {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
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
        .mobile-menu-drawer .mobile-menu-scroll {
            flex: 1; overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding: 12px 20px;
        }
        .mobile-menu-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 0; border-bottom: 1px solid #f5f5f5;
            font-size: 14px; font-weight: 600; letter-spacing: 0.05em;
            cursor: pointer; color: #1d1d1f; text-decoration: none;
            transition: color 0.2s ease;
            width: 100%;
            background: none;
            border-left: none;
            border-right: none;
            border-top: none;
            text-align: left;
        }
        .mobile-menu-item:hover { color: #007aff; }
        .mobile-sub-item {
            padding: 12px 0 12px 20px;
            border-bottom: 1px solid #fafafa;
            font-size: 13px; color: #86868b; cursor: pointer;
            display: flex; align-items: center; gap: 8px;
            text-decoration: none; transition: color 0.2s ease;
        }
        .mobile-sub-item:hover { color: #007aff; }
        .mobile-sub-item::before {
            content: ''; width: 5px; height: 5px;
            background: #007aff; border-radius: 50%; flex-shrink: 0;
        }
        .mobile-sub-sub-item {
            padding: 10px 0 10px 40px;
            border-bottom: 1px solid #fafafa;
            font-size: 12px; color: #a0a0a5; cursor: pointer;
            display: flex; align-items: center; gap: 8px;
            text-decoration: none; transition: color 0.2s ease;
        }
        .mobile-sub-sub-item:hover { color: #007aff; }
        .mobile-submenu-container {
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        .mobile-footer {
            padding: 20px; border-top: 1px solid #f0f0f0;
            background: #f5f5f7; flex-shrink: 0;
        }
        
        /* Cart Drawer */
        #cart-drawer {
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
        }
        #cart-drawer.open { transform: translateX(0) !important; }
        
        /* Utility Classes */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #d2d2d7; border-radius: 10px; }
        
        #toast {
            position: fixed; top: 16px; right: 16px; z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
            max-width: calc(100vw - 32px);
        }
        
        body { padding-top: 56px; }
        @media (min-width: 640px) { body { padding-top: 64px; } }
        @media (min-width: 1024px) { body { padding-top: 80px; } }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================
// DYNAMIC DESKTOP MENU RENDERER
// ============================================
function renderDynamicDesktopMenu() {
    const menuContainer = document.getElementById('dynamic-desktop-menu');
    if (!menuContainer) return;
    
    // If no menu items from database, show default menu
    if (!allMenuItems || !allMenuItems.length) {
        menuContainer.innerHTML = getDefaultDesktopMenu();
        return;
    }

    let menuHTML = '';
    
    // Render menu items based on hierarchy
    allMenuItems.forEach(item => {
        if (!item.parent_id) {
            if (item.children && item.children.length > 0) {
                menuHTML += renderDesktopDropdown(item);
            } else {
                menuHTML += renderDesktopSimpleLink(item);
            }
        }
    });
    
    menuContainer.innerHTML = menuHTML || getDefaultDesktopMenu();
}

function renderDesktopDropdown(item) {
    const link = getMenuLink(item);
    let html = `<div class="nav-dropdown">`;
    html += `<a href="${link}" class="nav-link px-5">${item.title}</a>`;
    html += `<div class="nav-dropdown-content custom-scroll">`;
    
    item.children.forEach(child => {
        const childLink = getMenuLink(child);
        if (child.children && child.children.length > 0) {
            // Has sub-children
            html += `<div class="nav-dropdown-item has-children">`;
            html += `<span>${child.title}</span>`;
            html += `<div class="nav-sub-dropdown custom-scroll">`;
            child.children.forEach(subChild => {
                const subLink = getMenuLink(subChild);
                html += `<a href="${subLink}" class="nav-dropdown-item">${subChild.title}</a>`;
            });
            html += `</div></div>`;
        } else {
            html += `<a href="${childLink}" class="nav-dropdown-item">${child.title}</a>`;
        }
    });
    
    html += `</div></div>`;
    return html;
}

function renderDesktopSimpleLink(item) {
    const link = getMenuLink(item);
    return `<a href="${link}" class="nav-link px-5">${item.title}</a>`;
}

function getDefaultDesktopMenu() {
    // Fallback if no menu items in database
    let html = '';
    if (allCategories && allCategories.length) {
        html += `<div class="nav-dropdown">`;
        html += `<span class="nav-link px-5">Categories</span>`;
        html += `<div class="nav-dropdown-content custom-scroll">`;
        allCategories.forEach(cat => {
            html += `<a href="/categories/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}" class="nav-dropdown-item">${cat.name}</a>`;
        });
        html += `</div></div>`;
    }
    html += `<a href="/products" class="nav-link px-5">All Products</a>`;
    html += `<a href="/contact" class="nav-link px-5">Contact</a>`;
    return html;
}

function getMenuLink(item) {
    if (item.menu_type === 'category' && item.category_slug) {
        return `/categories/${item.category_slug}`;
    } else if (item.menu_type === 'subcategory' && item.subcategory_slug && item.category_slug) {
        return `/categories/${item.category_slug}/${item.subcategory_slug}`;
    } else if (item.menu_type === 'external') {
        return item.link;
    } else {
        return item.link || '#';
    }
}

// ============================================
// DYNAMIC MOBILE MENU RENDERER
// ============================================
function renderDynamicMobileMenu() {
    const mobileSubCategories = document.getElementById('mobileSubCategories');
    if (!mobileSubCategories) return;

    let mobileHTML = '';
    
    // If we have menu items from database, use them
    if (allMenuItems && allMenuItems.length) {
        allMenuItems.forEach(item => {
            if (!item.parent_id) {
                if (item.children && item.children.length > 0) {
                    mobileHTML += renderMobileDropdown(item);
                } else {
                    mobileHTML += renderMobileSimpleLink(item);
                }
            }
        });
    }
    
    // If no menu items, use categories from database
    if (!mobileHTML && allCategories && allCategories.length) {
        mobileHTML += `<button class="mobile-menu-item" onclick="toggleMobileSubMenu(this)">
            <span><i class="fa-solid fa-grid-2 mr-3 text-gray-300"></i> Categories</span>
            <i class="fa-solid fa-chevron-down text-xs text-gray-400 transition-transform duration-300"></i>
        </button>`;
        mobileHTML += `<div class="mobile-submenu-container" style="max-height: 0;">`;
        allCategories.forEach(cat => {
            mobileHTML += `<a href="/categories/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}" class="mobile-sub-item">${cat.name}</a>`;
        });
        mobileHTML += `</div>`;
    }
    
    mobileSubCategories.innerHTML = mobileHTML || '<p class="text-gray-400 text-sm py-4">No categories available</p>';
}

function renderMobileDropdown(item) {
    const link = getMenuLink(item);
    let html = `<button class="mobile-menu-item" onclick="toggleMobileSubMenu(this)">
        <span>${item.title}</span>
        <i class="fa-solid fa-chevron-down text-xs text-gray-400 transition-transform duration-300"></i>
    </button>`;
    html += `<div class="mobile-submenu-container" style="max-height: 0;">`;
    
    item.children.forEach(child => {
        const childLink = getMenuLink(child);
        if (child.children && child.children.length > 0) {
            html += `<a href="${childLink}" class="mobile-sub-item" onclick="event.stopPropagation();">${child.title} ›</a>`;
            child.children.forEach(subChild => {
                const subLink = getMenuLink(subChild);
                html += `<a href="${subLink}" class="mobile-sub-sub-item">${subChild.title}</a>`;
            });
        } else {
            html += `<a href="${childLink}" class="mobile-sub-item">${child.title}</a>`;
        }
    });
    
    html += `</div>`;
    return html;
}

function renderMobileSimpleLink(item) {
    const link = getMenuLink(item);
    return `<a href="${link}" class="mobile-menu-item">
        <span>${item.title}</span>
        <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
    </a>`;
}

function toggleMobileSubMenu(element) {
    const submenu = element.nextElementSibling;
    const arrow = element.querySelector('.fa-chevron-down');
    
    if (submenu && submenu.classList.contains('mobile-submenu-container')) {
        if (submenu.style.maxHeight === '0px' || !submenu.style.maxHeight) {
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
            if (arrow) arrow.style.transform = 'rotate(180deg)';
        } else {
            submenu.style.maxHeight = '0px';
            if (arrow) arrow.style.transform = '';
        }
    }
}

// ============================================
// HEADER COMPONENT
// ============================================
function renderHeader() {
    const headerHTML = `
    <div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="closeMobileMenu()"></div>
    <div class="mobile-menu-drawer" id="mobileMenuDrawer">
        <div class="mobile-menu-header">
            <a href="/" class="flex items-center gap-3 no-underline">
                <img src="/logo.png" class="w-9 h-9 rounded-lg" alt="Logo" onerror="this.src='/placeholder-logo.png'">
                <span class="font-black font-serif text-lg text-primary">JAYENWARE</span>
            </a>
            <button onclick="closeMobileMenu()" class="text-2xl text-gray-400 hover:text-primary transition p-2" aria-label="Close menu">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="mobile-menu-scroll">
            <a href="/" class="mobile-menu-item">
                <span><i class="fa-solid fa-house mr-3 text-gray-300"></i> Home</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
            <a href="/products" class="mobile-menu-item">
                <span><i class="fa-solid fa-bag-shopping mr-3 text-gray-300"></i> All Products</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
            <div id="mobileSubCategories" style="display: none;"></div>
            <a href="/wishlist" class="mobile-menu-item">
                <span><i class="fa-regular fa-heart mr-3 text-gray-300"></i> Wishlist</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
            <a href="/about" class="mobile-menu-item">
                <span><i class="fa-solid fa-circle-info mr-3 text-gray-300"></i> About</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
            <a href="/contact" class="mobile-menu-item">
                <span><i class="fa-solid fa-envelope mr-3 text-gray-300"></i> Contact</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
        </div>
        <div class="mobile-footer" id="mobileMenuFooter">
            <a href="/login" class="w-full py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-blue transition no-underline text-center block">Sign In / Register</a>
        </div>
    </div>
    
    <nav class="glass-nav fixed w-full top-0 z-50" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex justify-between items-center">
            <a href="/" class="flex items-center gap-2 sm:gap-3 shrink-0 no-underline" aria-label="JAYENWARE Home">
                <img src="/logo.png" class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg" alt="JAYENWARE Logo" loading="eager" width="40" height="40" onerror="this.src='/placeholder-logo.png'">
                <span class="text-lg sm:text-xl lg:text-2xl font-black tracking-tight font-serif text-primary">JAYENWARE</span>
            </a>
            
            <!-- Desktop Menu - Dynamic -->
            <div class="hidden lg:flex items-center gap-0" id="dynamic-desktop-menu">
                <!-- Menu items will be injected here dynamically -->
            </div>
            
            <div class="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
                <a href="/wishlist" class="relative p-1.5 no-underline text-primary hover:text-blue transition" aria-label="Wishlist">
                    <i class="fa-regular fa-heart text-lg lg:text-xl"></i>
                    <span id="wish-count" class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                <a href="/cart" onclick="toggleCart();return false;" class="relative p-1.5 no-underline text-primary hover:text-blue transition" aria-label="Shopping Cart">
                    <i class="fa-solid fa-bag-shopping text-lg lg:text-xl"></i>
                    <span id="cart-count" class="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                <div id="auth-nav-area" class="hidden lg:block">
                    <a href="/login" class="px-5 py-2.5 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-blue transition-all no-underline inline-block">Sign In</a>
                </div>
                <button onclick="openMobileMenu()" class="lg:hidden text-xl p-1.5 text-primary hover:text-blue transition" aria-label="Menu">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
    </nav>
    
    <!-- Cart Drawer -->
    <div id="cart-drawer" class="fixed top-0 right-0 w-full max-w-sm sm:max-w-md h-full bg-white z-[60] shadow-2xl flex flex-col" style="transform: translateX(100%);">
        <div class="p-4 sm:p-6 border-b flex justify-between items-center bg-soft">
            <h2 class="text-base sm:text-lg font-black uppercase tracking-tighter">Shopping Bag</h2>
            <button onclick="toggleCart()" class="text-gray-400 hover:text-primary text-lg sm:text-xl transition p-1" aria-label="Close cart">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div id="cart-items" class="flex-grow overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 custom-scroll"></div>
        <div class="p-4 sm:p-6 border-t bg-soft">
            <div class="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 text-[10px] sm:text-xs">
                <div class="flex justify-between text-gray-500"><span>Subtotal</span><span id="cart-subtotal">৳ 0.00</span></div>
                <div class="flex justify-between border-t pt-2 sm:pt-3">
                    <span class="font-bold uppercase">Total</span>
                    <span id="cart-total" class="text-lg sm:text-xl font-black">৳ 0.00</span>
                </div>
            </div>
            <a href="/checkout" class="w-full py-3 sm:py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-wider text-[10px] sm:text-xs hover:bg-blue transition shadow-lg no-underline text-center block">Checkout</a>
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
    <footer class="bg-primary text-gray-400 pt-12 sm:pt-16 pb-6 sm:pb-8" id="main-footer">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 sm:mb-12">
                <div class="col-span-2 md:col-span-1">
                    <h4 class="text-white font-black font-serif text-base sm:text-lg mb-3 sm:mb-4">JAYENWARE</h4>
                    <p class="text-[10px] sm:text-xs leading-relaxed mb-4">Premium lifestyle products designed for modern living. A subsidiary of <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="text-blue font-bold hover:text-white transition">BINZEO</a>.</p>
                    <div class="flex gap-3 text-base sm:text-lg">
                        <a href="https://www.facebook.com/jayenware" target="_blank" rel="noopener noreferrer" class="hover:text-blue transition"><i class="fa-brands fa-facebook"></i></a>
                        <a href="https://www.instagram.com/jayenware" target="_blank" rel="noopener noreferrer" class="hover:text-blue transition"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://youtube.com/@jayenware" target="_blank" rel="noopener noreferrer" class="hover:text-blue transition"><i class="fa-brands fa-youtube"></i></a>
                    </div>
                </div>
                <div>
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4">Quick Links</h5>
                    <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0">
                        <li><a href="/about" class="hover:text-white transition no-underline">About</a></li>
                        <li><a href="/shipping" class="hover:text-white transition no-underline">Shipping</a></li>
                        <li><a href="/returns" class="hover:text-white transition no-underline">Returns</a></li>
                        <li><a href="/contact" class="hover:text-white transition no-underline">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4">Legal</h5>
                    <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0">
                        <li><a href="/privacy-policy" class="hover:text-white transition no-underline">Privacy Policy</a></li>
                        <li><a href="/terms-and-conditions" class="hover:text-white transition no-underline">Terms & Conditions</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4">Contact</h5>
                    <p class="text-[9px] text-gray-500"><i class="fa-regular fa-envelope"></i> binzeo369@outlook.com</p>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500">Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="text-blue font-bold hover:text-white transition no-underline">BINZEO</a></p>
                <p class="text-[8px] sm:text-[9px]">&copy; <span id="display-year"></span> JAYENWARE. All rights reserved.</p>
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
                <p id="toast-text" class="text-xs font-bold flex-grow"></p>
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
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.product_id === productData.id);
    if (existingItem) {
        existingItem.quantity += 1;
        showToast('Quantity updated! 📦', 'success');
    } else {
        cart.push({
            id: Date.now(),
            product_id: productData.id,
            title: productData.title,
            price: productData.price,
            img: productData.img || productData.image_url,
            quantity: 1
        });
        showToast('Added to Bag! 🎉', 'success');
    }
    saveCart();
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
        container.innerHTML = '<p class="text-center text-gray-400 py-10 text-sm">Your bag is empty</p>';
        if (subtotalEl) subtotalEl.innerText = '৳ 0.00';
        if (totalEl) totalEl.innerText = '৳ 0.00';
        return;
    }
    let sub = 0;
    container.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * (item.quantity || 1);
        sub += itemTotal;
        return `<div class="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-soft rounded-2xl">
            <img src="${item.img}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl shrink-0" alt="${item.title}" onerror="this.src='/placeholder-product.png'">
            <div class="flex-grow min-w-0">
                <h4 class="text-xs sm:text-sm font-bold truncate">${item.title}</h4>
                <p class="text-xs sm:text-sm font-black">৳${item.price.toFixed(2)}</p>
                <p class="text-[10px] text-gray-400">Qty: ${item.quantity || 1}</p>
            </div>
            <button onclick="removeFromCart(${idx})" class="text-red-400 hover:text-red-600 p-1.5 shrink-0" aria-label="Remove item">
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
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.innerText = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    if (wishCount) {
        wishCount.innerText = wishlist.length;
        wishCount.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// ============================================
// WISHLIST FUNCTIONS
// ============================================
function toggleWishlist(id) {
    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(x => x !== id);
        showToast('Removed from wishlist', 'info');
    } else {
        wishlist.push(id);
        showToast('Added to wishlist! ❤️', 'success');
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
    
    // Show mobile subcategories container when menu opens
    const mobileSubCats = document.getElementById('mobileSubCategories');
    if (mobileSubCats) mobileSubCats.style.display = 'block';
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset all submenus
    document.querySelectorAll('.mobile-submenu-container').forEach(sub => {
        sub.style.maxHeight = '0px';
    });
    document.querySelectorAll('.mobile-menu-item .fa-chevron-down').forEach(arrow => {
        arrow.style.transform = '';
    });
    
    // Hide mobile subcategories
    const mobileSubCats = document.getElementById('mobileSubCategories');
    if (mobileSubCats) mobileSubCats.style.display = 'none';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getProductSlug(product) {
    if (!product || !product.title) return '';
    return product.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 80);
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
window.toggleMobileSubMenu = toggleMobileSubMenu;
window.getProductSlug = getProductSlug;
window.saveCart = saveCart;
window.renderCartItems = renderCartItems;
window.updateCounts = updateCounts;
window.cart = cart;
window.wishlist = wishlist;
window.allCategories = allCategories;
window.allSubcategories = allSubcategories;
window.allMenuItems = allMenuItems;

// ============================================
// INITIALIZATION
// ============================================
async function initSharedComponents() {
    injectSharedStyles();
    renderHeader();
    renderFooter();
    updateCounts();
    
    // Fetch dynamic menu data from database
    try {
        // Fetch all data in parallel
        const [menuData, catData] = await Promise.all([
            fetchMenuItems(),
            fetchCategories()
        ]);
        
        allMenuItems = menuData;
        allCategories = catData;
        
        // Render dynamic menus after data is loaded
        renderDynamicDesktopMenu();
        renderDynamicMobileMenu();
        
        console.log('Dynamic menus loaded successfully');
    } catch (error) {
        console.error('Error initializing dynamic menus:', error);
        // Show fallback menus
        renderDynamicDesktopMenu();
        renderDynamicMobileMenu();
    }
    
    // Set copyright year
    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
    setTimeout(initSharedComponents, 100);
}
