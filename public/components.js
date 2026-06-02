// ============================================
// components.js - Shared Header, Footer & Common Functions
// Version: 4.0 (Luxury Fashion Brand Navigation)
// ============================================

let cart = JSON.parse(localStorage.getItem('jayen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jayen_wish') || '[]');
let userSession = null;
let allCategories = [];
let allSubcategories = [];

// API Base URL
const API_BASE = '';

// ============================================
// SHARED CSS STYLES - Luxury Brand Inspired
// ============================================
function injectSharedStyles() {
    const styles = `
    <style id="shared-components-style">
        :root {
            --primary: #1a1a1a;
            --accent: #666;
            --soft: #f8f8f8;
            --blue: #007aff;
            --gold: #c9a96e;
        }
        
        /* Main Navigation - Minimalist Luxury */
        .glass-nav {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(0,0,0,0.04);
            transition: all 0.3s ease;
        }
        
        /* Desktop Navigation Links */
        .nav-link {
            position: relative;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 28px 0;
            margin: 0 18px;
            transition: all 0.3s ease;
            color: #1a1a1a;
            text-decoration: none;
            cursor: pointer;
            white-space: nowrap;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 22px;
            left: 0;
            width: 0;
            height: 1.5px;
            background: #1a1a1a;
            transition: width 0.35s cubic-bezier(0.25, 0.8, 0.25, 1.2);
        }
        .nav-link:hover {
            color: #000;
        }
        .nav-link:hover::after {
            width: 100%;
        }
        
        /* Desktop Mega Menu Dropdown */
        .desktop-mega-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            box-shadow: 0 25px 60px -20px rgba(0,0,0,0.15);
            padding: 40px 0;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 45;
        }
        .desktop-mega-menu.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .mega-menu-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.2);
            z-index: 44;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .mega-menu-backdrop.active {
            opacity: 1;
            visibility: visible;
        }
        .mega-menu-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 40px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
        }
        .mega-menu-column h4 {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #1a1a1a;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f0f0f0;
        }
        .mega-menu-column h4 a {
            color: inherit;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        .mega-menu-column h4 a:hover {
            color: var(--gold);
        }
        .mega-menu-sub-item {
            display: block;
            padding: 6px 0;
            font-size: 13px;
            color: #666;
            text-decoration: none;
            transition: all 0.25s ease;
            font-weight: 400;
        }
        .mega-menu-sub-item:hover {
            color: #1a1a1a;
            padding-left: 8px;
        }
        .mega-menu-featured {
            grid-column: span 2;
            background: #fafafa;
            padding: 30px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        .mega-menu-featured img {
            max-width: 100%;
            height: auto;
            margin-bottom: 20px;
        }
        .mega-menu-featured h5 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
        }
        .mega-menu-featured p {
            font-size: 12px;
            color: #999;
            margin-bottom: 16px;
        }
        .mega-menu-featured .btn-link {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #1a1a1a;
            text-decoration: none;
            border-bottom: 2px solid #1a1a1a;
            padding-bottom: 4px;
            transition: all 0.3s ease;
        }
        .mega-menu-featured .btn-link:hover {
            color: var(--gold);
            border-color: var(--gold);
        }
        
        /* Mobile Menu */
        .mobile-menu-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 199;
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s ease;
        }
        .mobile-menu-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .mobile-menu-drawer {
            position: fixed;
            top: 0;
            left: 0;
            width: 85%;
            max-width: 400px;
            height: 100vh;
            height: 100dvh;
            background: white;
            z-index: 200;
            transform: translateX(-100%);
            transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
        }
        .mobile-menu-drawer.open {
            transform: translateX(0);
        }
        .mobile-menu-drawer .mobile-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #f0f0f0;
            background: white;
            flex-shrink: 0;
        }
        .mobile-menu-drawer .mobile-menu-scroll {
            flex: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding: 8px 24px;
        }
        .mobile-menu-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 0;
            border-bottom: 1px solid #f5f5f5;
            font-size: 15px;
            font-weight: 500;
            letter-spacing: 0.03em;
            cursor: pointer;
            color: #1a1a1a;
            text-decoration: none;
            transition: all 0.2s ease;
            width: 100%;
            background: none;
            border-left: none;
            border-right: none;
            border-top: none;
            text-align: left;
        }
        .mobile-menu-item:hover {
            color: #000;
            padding-left: 4px;
        }
        .mobile-menu-item .cat-arrow {
            font-size: 11px;
            color: #999;
            transition: transform 0.35s ease;
            flex-shrink: 0;
            margin-left: 12px;
        }
        .mobile-menu-item .cat-arrow.open {
            transform: rotate(180deg);
        }
        .mobile-subcat-container {
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: #fafafa;
            margin: 0 -24px;
            padding: 0 24px;
        }
        .mobile-subcat-container.expanded {
            max-height: 800px;
        }
        .mobile-subcat-link {
            display: block;
            padding: 14px 0 14px 20px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 14px;
            color: #666;
            text-decoration: none;
            transition: all 0.2s ease;
        }
        .mobile-subcat-link:last-child {
            border-bottom: none;
            padding-bottom: 20px;
        }
        .mobile-subcat-link:hover {
            color: #1a1a1a;
            padding-left: 28px;
        }
        .mobile-menu-footer {
            padding: 20px 24px;
            border-top: 1px solid #f0f0f0;
            background: #f8f8f8;
            flex-shrink: 0;
        }
        .mobile-menu-footer a {
            display: block;
            width: 100%;
            padding: 14px;
            background: #1a1a1a;
            color: white;
            text-align: center;
            border-radius: 0;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        .mobile-menu-footer a:hover {
            background: #333;
        }
        
        /* Cart Drawer */
        #cart-drawer {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
            transform: translateX(100%);
        }
        #cart-drawer.open {
            transform: translateX(0) !important;
        }
        .custom-scroll::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: #d2d2d7;
            border-radius: 10px;
        }
        
        /* Toast */
        #toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: calc(100vw - 40px);
        }
        
        /* Body padding for fixed nav */
        body {
            padding-top: 60px;
        }
        @media (min-width: 640px) {
            body {
                padding-top: 68px;
            }
        }
        @media (min-width: 1024px) {
            body {
                padding-top: 72px;
            }
        }
        
        /* Active nav link indicator */
        .nav-link.active::after {
            width: 100%;
        }
        
        /* Search icon */
        .search-trigger {
            cursor: pointer;
            padding: 8px;
            color: #1a1a1a;
            transition: all 0.3s ease;
        }
        .search-trigger:hover {
            color: var(--gold);
        }
    </style>
    `;
    // Remove existing style if present
    const existing = document.getElementById('shared-components-style');
    if (existing) existing.remove();
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================
// DATA FETCHING
// ============================================
async function fetchCategories() {
    try {
        const res = await fetch(`${API_BASE}/api/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        allCategories = await res.json();
        return allCategories;
    } catch (err) {
        console.error('Error fetching categories:', err);
        allCategories = [];
        return [];
    }
}

async function fetchSubcategories(categorySlug = null) {
    try {
        let url = `${API_BASE}/api/subcategories`;
        if (categorySlug) url += `?category_slug=${categorySlug}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch subcategories');
        const data = await res.json();
        if (categorySlug) return data;
        allSubcategories = data;
        return data;
    } catch (err) {
        console.error('Error fetching subcategories:', err);
        return [];
    }
}

// ============================================
// HEADER COMPONENT - Luxury Brand Style
// ============================================
function renderHeader() {
    const headerHTML = `
    <!-- Mega Menu Backdrop -->
    <div class="mega-menu-backdrop" id="megaMenuBackdrop" onclick="closeMegaMenu()"></div>
    
    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="closeMobileMenu()"></div>
    
    <!-- Mobile Menu Drawer -->
    <div class="mobile-menu-drawer" id="mobileMenuDrawer">
        <div class="mobile-menu-header">
            <a href="/" class="flex items-center gap-3 no-underline">
                <img src="/logo.png" class="w-9 h-9 rounded-lg" alt="JAYENWARE Logo">
                <span class="font-black font-serif text-lg text-primary">JAYENWARE</span>
            </a>
            <button onclick="closeMobileMenu()" class="text-2xl text-gray-400 hover:text-primary transition p-2" aria-label="Close menu">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="mobile-menu-scroll" id="mobileMenuContent">
            <div class="flex items-center justify-center py-16">
                <div class="text-gray-300 text-sm">Loading...</div>
            </div>
        </div>
        <div class="mobile-menu-footer">
            <a href="/login">Sign In / Register</a>
        </div>
    </div>
    
    <!-- Main Navigation -->
    <nav class="glass-nav fixed w-full top-0 z-50" id="main-nav">
        <div class="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 h-[60px] sm:h-[68px] lg:h-[72px] flex justify-between items-center">
            
            <!-- Left: Mobile Menu Toggle (visible only on mobile) -->
            <button onclick="openMobileMenu()" class="lg:hidden text-xl p-2 text-primary hover:text-gray-600 transition -ml-2" aria-label="Menu">
                <i class="fa-solid fa-bars"></i>
            </button>
            
            <!-- Center-Left: Logo -->
            <a href="/" class="flex items-center gap-2 sm:gap-3 no-underline lg:absolute lg:left-1/2 lg:-translate-x-1/2" aria-label="JAYENWARE Home">
                <img src="/logo.png" class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg" alt="JAYENWARE Logo" loading="eager" width="40" height="40">
                <span class="text-lg sm:text-xl lg:text-2xl font-black tracking-tighter font-serif text-primary">JAYENWARE</span>
            </a>
            
            <!-- Desktop: Left Navigation Links -->
            <div class="hidden lg:flex items-center gap-0" id="desktop-nav-left">
                <a href="/" class="nav-link">Home</a>
                <a href="/products" class="nav-link">Shop</a>
                <span class="nav-link" onclick="toggleMegaMenu(event)" id="categoriesNavLink">
                    Categories
                    <i class="fa-solid fa-chevron-down text-[9px] ml-1.5"></i>
                </span>
            </div>
            
            <!-- Desktop: Right Navigation Icons -->
            <div class="flex items-center gap-1 sm:gap-2 lg:gap-3">
                <!-- Search (Desktop only) -->
                <button class="search-trigger hidden lg:block" aria-label="Search">
                    <i class="fa-solid fa-magnifying-glass text-lg"></i>
                </button>
                
                <!-- Wishlist -->
                <a href="/wishlist" class="relative p-2 no-underline text-primary hover:text-gray-600 transition" aria-label="Wishlist">
                    <i class="fa-regular fa-heart text-lg lg:text-xl"></i>
                    <span id="wish-count" class="absolute top-0 right-0 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                
                <!-- Cart -->
                <a href="/cart" onclick="toggleCart();return false;" class="relative p-2 no-underline text-primary hover:text-gray-600 transition" aria-label="Shopping Cart">
                    <i class="fa-solid fa-bag-shopping text-lg lg:text-xl"></i>
                    <span id="cart-count" class="absolute top-0 right-0 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                
                <!-- Auth (Desktop only) -->
                <div id="auth-nav-area" class="hidden lg:block ml-2">
                    <a href="/login" class="px-5 py-2.5 bg-primary text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-gray-800 transition-all no-underline inline-block">Sign In</a>
                </div>
            </div>
        </div>
        
        <!-- Desktop Mega Menu Dropdown -->
        <div class="desktop-mega-menu" id="desktopMegaMenu">
            <div class="mega-menu-content" id="megaMenuContent">
                <div class="flex items-center justify-center py-12 col-span-full">
                    <div class="text-gray-300 text-sm">Loading categories...</div>
                </div>
            </div>
        </div>
    </nav>
    
    <!-- Cart Drawer -->
    <div id="cart-drawer" class="fixed top-0 right-0 w-full max-w-sm sm:max-w-md h-full bg-white z-[60] shadow-2xl flex flex-col">
        <div class="p-5 sm:p-6 border-b flex justify-between items-center bg-soft">
            <h2 class="text-base sm:text-lg font-bold uppercase tracking-tight">Shopping Bag</h2>
            <button onclick="toggleCart()" class="text-gray-400 hover:text-primary text-xl transition p-1" aria-label="Close cart">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div id="cart-items" class="flex-grow overflow-y-auto p-5 sm:p-6 space-y-4 custom-scroll"></div>
        <div class="p-5 sm:p-6 border-t bg-soft">
            <div class="space-y-2 mb-5 text-xs">
                <div class="flex justify-between text-gray-500"><span>Subtotal</span><span id="cart-subtotal">৳ 0.00</span></div>
                <div class="flex justify-between border-t pt-3">
                    <span class="font-bold uppercase text-sm">Total</span>
                    <span id="cart-total" class="text-lg sm:text-xl font-black">৳ 0.00</span>
                </div>
            </div>
            <a href="/checkout" class="w-full py-3.5 bg-primary text-white font-semibold uppercase tracking-wider text-xs hover:bg-gray-800 transition no-underline text-center block">Checkout</a>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// ============================================
// MEGA MENU FUNCTIONS
// ============================================
let isMegaMenuOpen = false;
let megaMenuTimeout = null;

function toggleMegaMenu(event) {
    if (event) event.stopPropagation();
    
    const megaMenu = document.getElementById('desktopMegaMenu');
    const backdrop = document.getElementById('megaMenuBackdrop');
    const navLink = document.getElementById('categoriesNavLink');
    
    if (!megaMenu) return;
    
    if (isMegaMenuOpen) {
        closeMegaMenu();
    } else {
        // Build menu if needed
        buildMegaMenuContent();
        
        megaMenu.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
        if (navLink) navLink.classList.add('active');
        isMegaMenuOpen = true;
        document.body.style.overflow = 'hidden';
    }
}

function closeMegaMenu() {
    const megaMenu = document.getElementById('desktopMegaMenu');
    const backdrop = document.getElementById('megaMenuBackdrop');
    const navLink = document.getElementById('categoriesNavLink');
    
    if (megaMenu) megaMenu.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    if (navLink) navLink.classList.remove('active');
    
    isMegaMenuOpen = false;
    document.body.style.overflow = '';
    
    if (megaMenuTimeout) clearTimeout(megaMenuTimeout);
}

async function buildMegaMenuContent() {
    const container = document.getElementById('megaMenuContent');
    if (!container) return;
    
    if (!allCategories.length) {
        await fetchCategories();
        await fetchSubcategories();
    }
    
    if (!allCategories.length) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-400 text-sm col-span-full">
                No categories available
            </div>
        `;
        return;
    }
    
    // Group subcategories by category
    let html = '';
    
    allCategories.forEach(cat => {
        const catSubs = allSubcategories.filter(sub => 
            sub.category_slug === cat.slug || sub.category_id === cat.id
        );
        
        if (catSubs.length > 0) {
            // Category with subcategories
            html += `
                <div class="mega-menu-column">
                    <h4><a href="/category/${cat.slug}">${cat.name}</a></h4>
                    ${catSubs.map(sub => `
                        <a href="/category/${cat.slug}/${sub.slug}" class="mega-menu-sub-item">${sub.name}</a>
                    `).join('')}
                    <a href="/category/${cat.slug}" class="mega-menu-sub-item" style="color: #c9a96e; font-weight: 600; margin-top: 8px;">
                        View All →
                    </a>
                </div>
            `;
        } else {
            // Category without subcategories - still show it
            html += `
                <div class="mega-menu-column">
                    <h4><a href="/category/${cat.slug}">${cat.name}</a></h4>
                    <a href="/category/${cat.slug}" class="mega-menu-sub-item">Explore Collection</a>
                </div>
            `;
        }
    });
    
    // Add featured section
    html += `
        <div class="mega-menu-featured">
            <h5>New Arrivals</h5>
            <p>Discover our latest collection of premium products</p>
            <a href="/products" class="btn-link">Shop Now</a>
        </div>
    `;
    
    container.innerHTML = html;
}

// ============================================
// MOBILE MENU - Build Dynamic Content
// ============================================
async function buildMobileMenuContent() {
    const container = document.getElementById('mobileMenuContent');
    if (!container) return;
    
    if (!allCategories.length) {
        await fetchCategories();
        await fetchSubcategories();
    }
    
    if (!allCategories.length) {
        container.innerHTML = `
            <a href="/" class="mobile-menu-item">
                <span>Home</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
            <a href="/products" class="mobile-menu-item">
                <span>All Products</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
            <a href="/wishlist" class="mobile-menu-item">
                <span>Wishlist</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
        `;
        return;
    }
    
    let html = '';
    
    // Home
    html += `
        <a href="/" class="mobile-menu-item">
            <span>Home</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;
    
    // Shop All
    html += `
        <a href="/products" class="mobile-menu-item">
            <span>Shop All</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;
    
    // Dynamic Categories
    allCategories.forEach((cat, index) => {
        const catSubs = allSubcategories.filter(sub => 
            sub.category_slug === cat.slug || sub.category_id === cat.id
        );
        const catId = `mobile-cat-${index}`;
        
        if (catSubs.length > 0) {
            html += `
                <button class="mobile-menu-item" onclick="toggleMobileCategory('${catId}')" aria-expanded="false">
                    <span>${cat.name}</span>
                    <i class="fa-solid fa-chevron-down cat-arrow text-xs" id="${catId}-arrow"></i>
                </button>
                <div class="mobile-subcat-container" id="${catId}-container">
                    ${catSubs.map(sub => `
                        <a href="/category/${cat.slug}/${sub.slug}" class="mobile-subcat-link">${sub.name}</a>
                    `).join('')}
                    <a href="/category/${cat.slug}" class="mobile-subcat-link" style="color: #c9a96e; font-weight: 600;">
                        All ${cat.name} →
                    </a>
                </div>
            `;
        } else {
            html += `
                <a href="/category/${cat.slug}" class="mobile-menu-item">
                    <span>${cat.name}</span>
                    <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                </a>
            `;
        }
    });
    
    // Wishlist
    html += `
        <a href="/wishlist" class="mobile-menu-item">
            <span>Wishlist</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;
    
    container.innerHTML = html;
}

function toggleMobileCategory(catId) {
    const container = document.getElementById(`${catId}-container`);
    const arrow = document.getElementById(`${catId}-arrow`);
    const button = document.querySelector(`[onclick="toggleMobileCategory('${catId}')"]`);
    
    if (!container || !arrow) return;
    
    const isExpanded = container.classList.contains('expanded');
    
    // Close all others
    document.querySelectorAll('.mobile-subcat-container.expanded').forEach(el => {
        if (el !== container) el.classList.remove('expanded');
    });
    document.querySelectorAll('.cat-arrow.open').forEach(el => {
        if (el !== arrow) el.classList.remove('open');
    });
    
    if (!isExpanded) {
        container.classList.add('expanded');
        arrow.classList.add('open');
        if (button) button.setAttribute('aria-expanded', 'true');
    } else {
        container.classList.remove('expanded');
        arrow.classList.remove('open');
        if (button) button.setAttribute('aria-expanded', 'false');
    }
}

// ============================================
// MOBILE MENU OPEN/CLOSE
// ============================================
function openMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Build mobile menu content
    buildMobileMenuContent();
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Collapse all
    document.querySelectorAll('.mobile-subcat-container.expanded').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.cat-arrow.open').forEach(el => {
        el.classList.remove('open');
    });
}

// Legacy support
function toggleMobileSubCategories() {
    const firstContainer = document.querySelector('.mobile-subcat-container');
    if (firstContainer) {
        const catId = firstContainer.id.replace('-container', '');
        toggleMobileCategory(catId);
    }
}

// ============================================
// FOOTER COMPONENT
// ============================================
function renderFooter() {
    const footerHTML = `
    <footer class="bg-[#1a1a1a] text-gray-400 pt-16 sm:pt-20 pb-8 sm:pb-10" id="main-footer">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                <div class="col-span-2 md:col-span-1">
                    <h4 class="text-white font-black font-serif text-lg mb-4">JAYENWARE</h4>
                    <p class="text-xs leading-relaxed mb-5">Premium lifestyle products designed for modern living. A subsidiary of <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="text-white/70 hover:text-white transition underline underline-offset-4">BINZEO</a>.</p>
                    <div class="flex gap-4 text-lg">
                        <a href="https://www.facebook.com/jayenware" target="_blank" rel="noopener noreferrer" class="hover:text-white transition"><i class="fa-brands fa-facebook"></i></a>
                        <a href="https://www.instagram.com/jayenware" target="_blank" rel="noopener noreferrer" class="hover:text-white transition"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://youtube.com/@jayenware" target="_blank" rel="noopener noreferrer" class="hover:text-white transition"><i class="fa-brands fa-youtube"></i></a>
                    </div>
                </div>
                <div>
                    <h5 class="text-white font-semibold text-xs uppercase tracking-wider mb-4">Quick Links</h5>
                    <ul class="space-y-2.5 text-xs list-none p-0">
                        <li><a href="/about" class="hover:text-white transition no-underline">About</a></li>
                        <li><a href="/shipping" class="hover:text-white transition no-underline">Shipping</a></li>
                        <li><a href="/returns" class="hover:text-white transition no-underline">Returns</a></li>
                        <li><a href="/contact" class="hover:text-white transition no-underline">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white font-semibold text-xs uppercase tracking-wider mb-4">Legal</h5>
                    <ul class="space-y-2.5 text-xs list-none p-0">
                        <li><a href="/privacy-policy" class="hover:text-white transition no-underline">Privacy Policy</a></li>
                        <li><a href="/terms-and-conditions" class="hover:text-white transition no-underline">Terms & Conditions</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white font-semibold text-xs uppercase tracking-wider mb-4">Contact</h5>
                    <p class="text-xs text-gray-500"><i class="fa-regular fa-envelope mr-2"></i>binzeo369@outlook.com</p>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-[10px] uppercase tracking-wider text-gray-500">Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" class="text-white/70 hover:text-white transition no-underline font-semibold">BINZEO</a></p>
                <p class="text-[9px]">&copy; <span id="display-year"></span> JAYENWARE. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
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
            <div class="bg-white shadow-2xl rounded-none p-4 flex items-center gap-3 min-w-[280px] border border-gray-100">
                <span id="toast-icon" class="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"></span>
                <p id="toast-text" class="text-xs font-semibold flex-grow"></p>
                <button onclick="hideToast()" class="text-gray-300 hover:text-gray-600 shrink-0 ml-2"><i class="fa-solid fa-xmark"></i></button>
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
    
    const existing = cart.find(item => item.product_id === productData.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            product_id: productData.id,
            title: productData.title,
            price: productData.price,
            img: productData.img || productData.images?.[0] || '/placeholder.png',
            quantity: 1
        });
    }
    saveCart();
    showToast('Added to Bag', 'success');
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
        container.innerHTML = '<p class="text-center text-gray-400 py-16 text-sm">Your bag is empty</p>';
        if (subtotalEl) subtotalEl.innerText = '৳ 0.00';
        if (totalEl) totalEl.innerText = '৳ 0.00';
        return;
    }
    
    let sub = 0;
    container.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * (item.quantity || 1);
        sub += itemTotal;
        return `
        <div class="flex gap-4 p-4 bg-soft">
            <img src="${item.img}" class="w-16 h-16 object-cover shrink-0" alt="${item.title}" onerror="this.src='/placeholder.png'">
            <div class="flex-grow min-w-0">
                <h4 class="text-sm font-semibold truncate">${item.title}</h4>
                <p class="text-sm font-bold mt-1">৳${item.price.toFixed(2)}</p>
                <p class="text-xs text-gray-500">Qty: ${item.quantity || 1}</p>
            </div>
            <button onclick="removeFromCart(${idx})" class="text-red-400 hover:text-red-600 p-2 shrink-0 self-start" aria-label="Remove item">
                <i class="fa-solid fa-trash text-sm"></i>
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
    }
    if (wishCount) wishCount.innerText = wishlist.length;
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
        showToast('Added to wishlist', 'success');
    }
    localStorage.setItem('jayen_wish', JSON.stringify(wishlist));
    updateCounts();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getProductSlug(product) {
    if (!product) return '';
    if (product.slug) return product.slug;
    if (!product.title) return '';
    return product.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 80);
}

// ============================================
// CLOSE MEGA MENU ON ESC KEY
// ============================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMegaMenu();
        closeMobileMenu();
    }
});

// Close mega menu on window resize (if switching to mobile)
window.addEventListener('resize', function() {
    if (window.innerWidth < 1024 && isMegaMenuOpen) {
        closeMegaMenu();
    }
});

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
window.toggleMobileSubCategories = toggleMobileSubCategories;
window.toggleMobileCategory = toggleMobileCategory;
window.toggleMegaMenu = toggleMegaMenu;
window.closeMegaMenu = closeMegaMenu;
window.getProductSlug = getProductSlug;
window.saveCart = saveCart;
window.renderCartItems = renderCartItems;
window.updateCounts = updateCounts;
window.buildMegaMenuContent = buildMegaMenuContent;
window.buildMobileMenuContent = buildMobileMenuContent;
window.cart = cart;
window.wishlist = wishlist;
window.allCategories = allCategories;
window.allSubcategories = allSubcategories;

// ============================================
// INITIALIZATION
// ============================================
async function initSharedComponents() {
    injectSharedStyles();
    renderHeader();
    renderFooter();
    
    // Fetch data
    await fetchCategories();
    await fetchSubcategories();
    
    // Build navigations
    buildMegaMenuContent();
    buildMobileMenuContent();
    
    updateCounts();
    
    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
    
    console.log(`✅ JAYENWARE initialized with ${allCategories.length} categories & ${allSubcategories.length} subcategories`);
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
    setTimeout(initSharedComponents, 100);
}

window.initSharedComponents = initSharedComponents;
