// ============================================
// components.js - Shared Header, Footer & Common Functions
// Version: 3.1 (Improved Desktop Navigation)
// ============================================

let cart = JSON.parse(localStorage.getItem('jayen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jayen_wish') || '[]');
let userSession = null;
let allCategories = [];
let allSubcategories = [];

// API Base URL
const API_BASE = '';

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
        
        /* ============ NAVIGATION ============ */
        .glass-nav {
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(50px) saturate(180%);
            -webkit-backdrop-filter: blur(50px) saturate(180%);
            border-bottom: 1px solid rgba(0,0,0,0.06);
            transition: all 0.3s ease;
        }
        
        /* Desktop Nav Links */
        .nav-link {
            position: relative;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            padding: 10px 18px;
            transition: color 0.3s ease;
            color: #1d1d1f;
            text-decoration: none;
            cursor: pointer;
            white-space: nowrap;
        }
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 4px; 
            left: 18px;
            right: 18px;
            width: 0; 
            height: 1.5px;
            background: #1d1d1f;
            transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: calc(100% - 36px); }
        .nav-link:hover { color: #007aff; }
        
        /* Desktop Dropdown Container */
        .desktop-dropdown {
            position: relative;
        }
        .desktop-dropdown-trigger {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .desktop-dropdown-trigger i {
            font-size: 8px;
            transition: transform 0.3s ease;
            color: #86868b;
        }
        .desktop-dropdown:hover .desktop-dropdown-trigger i {
            transform: rotate(180deg);
        }
        
        /* Dropdown Card */
        .desktop-dropdown-card {
            position: absolute;
            top: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%) translateY(12px);
            background: white;
            border-radius: 20px;
            box-shadow: 
                0 4px 6px rgba(0,0,0,0.04),
                0 12px 40px rgba(0,0,0,0.1),
                0 0 0 1px rgba(0,0,0,0.04);
            padding: 8px;
            min-width: 260px;
            max-width: 320px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 55;
            pointer-events: none;
        }
        .desktop-dropdown:hover .desktop-dropdown-card {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
            pointer-events: auto;
        }
        
        /* Category Item in Dropdown */
        .dropdown-category-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            color: #1d1d1f;
            text-decoration: none;
            transition: all 0.2s ease;
            cursor: pointer;
            white-space: nowrap;
            letter-spacing: 0.02em;
        }
        .dropdown-category-item:hover {
            background: #f5f5f7;
            color: #007aff;
        }
        .dropdown-category-item .cat-name {
            flex: 1;
        }
        .dropdown-category-item .cat-arrow {
            font-size: 9px;
            color: #86868b;
            transition: all 0.2s ease;
            margin-left: 12px;
        }
        .dropdown-category-item:hover .cat-arrow {
            color: #007aff;
            transform: translateX(2px);
        }
        
        /* Subcategory List inside Dropdown */
        .dropdown-sub-list {
            padding: 4px 0 4px 20px;
            border-left: 2px solid #f0f0f0;
            margin: 2px 8px 6px 16px;
        }
        .dropdown-sub-item {
            display: block;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            color: #86868b;
            text-decoration: none;
            transition: all 0.2s ease;
            letter-spacing: 0.01em;
        }
        .dropdown-sub-item:hover {
            background: #f5f5f7;
            color: #007aff;
        }
        
        /* View All Link */
        .dropdown-view-all {
            display: block;
            padding: 10px 16px;
            margin-top: 4px;
            border-top: 1px solid #f0f0f0;
            font-size: 11px;
            font-weight: 700;
            color: #007aff;
            text-decoration: none;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            border-radius: 10px;
            transition: all 0.2s ease;
        }
        .dropdown-view-all:hover {
            background: #f0f7ff;
            color: #0056cc;
        }
        
        /* Loading State */
        .dropdown-loading {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #86868b;
        }
        .dropdown-empty {
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #86868b;
        }
        
        /* ============ MOBILE MENU ============ */
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
        .mobile-cat-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 0; border-bottom: 1px solid #f5f5f5;
            font-size: 14px; font-weight: 600; letter-spacing: 0.05em;
            cursor: pointer; color: #1d1d1f; text-decoration: none;
            transition: color 0.2s ease; width: 100%; 
            background: none; border-left: none; border-right: none; 
            border-top: none; text-align: left;
        }
        .mobile-cat-item .cat-arrow {
            font-size: 10px;
            color: #86868b;
            transition: transform 0.3s ease;
        }
        .mobile-cat-item .cat-arrow.open {
            transform: rotate(180deg);
        }
        .mobile-subcat-container {
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.35s ease;
        }
        .mobile-subcat-container.expanded {
            max-height: 600px;
        }
        .mobile-sub-cat {
            padding: 12px 0 12px 28px;
            border-bottom: 1px solid #fafafa;
            font-size: 13px; color: #86868b; cursor: pointer;
            display: flex; align-items: center; gap: 8px;
            text-decoration: none; transition: color 0.2s ease;
        }
        .mobile-sub-cat::before {
            content: ''; 
            width: 5px; height: 5px;
            background: #007aff; 
            border-radius: 50%; 
            flex-shrink: 0;
        }
        .mobile-sub-cat:hover { color: #007aff; }
        .mobile-footer {
            padding: 20px; border-top: 1px solid #f0f0f0;
            background: #f5f5f7; flex-shrink: 0;
        }
        
        /* ============ CART DRAWER ============ */
        #cart-drawer {
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
        }
        #cart-drawer.open { transform: translateX(0) !important; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #d2d2d7; border-radius: 10px; }
        
        /* ============ TOAST ============ */
        #toast {
            position: fixed; top: 16px; right: 16px; z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
            max-width: calc(100vw - 32px);
        }
        
        /* ============ BODY OFFSET ============ */
        body { padding-top: 56px; }
        @media (min-width: 640px) { body { padding-top: 64px; } }
        @media (min-width: 1024px) { body { padding-top: 84px; } }
    </style>
    `;
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
// HEADER COMPONENT
// ============================================
function renderHeader() {
    const headerHTML = `
    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="closeMobileMenu()"></div>
    
    <!-- Mobile Menu Drawer -->
    <div class="mobile-menu-drawer" id="mobileMenuDrawer">
        <div class="mobile-menu-header">
            <a href="/" class="flex items-center gap-3 no-underline">
                <img src="/logo.png" class="w-9 h-9 rounded-lg" alt="Logo">
                <span class="font-black font-serif text-lg text-primary">JAYENWARE</span>
            </a>
            <button onclick="closeMobileMenu()" class="text-2xl text-gray-400 hover:text-primary transition p-2" aria-label="Close menu">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="mobile-menu-scroll" id="mobileMenuContent">
            <div class="flex items-center justify-center py-12">
                <div class="animate-pulse text-gray-300 text-sm">Loading menu...</div>
            </div>
        </div>
        <div class="mobile-footer" id="mobileMenuFooter">
            <a href="/login" class="w-full py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-blue transition no-underline text-center block">Sign In</a>
        </div>
    </div>
    
    <!-- Main Navigation -->
    <nav class="glass-nav fixed w-full top-0 z-50" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-[84px] flex justify-between items-center">
            <!-- Logo -->
            <a href="/" class="flex items-center gap-2 sm:gap-3 shrink-0 no-underline" aria-label="JAYENWARE Home">
                <img src="/logo.png" class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg" alt="JAYENWARE Logo" loading="eager" width="40" height="40">
                <span class="text-lg sm:text-xl lg:text-2xl font-black tracking-tight font-serif text-primary">JAYENWARE</span>
            </a>
            
            <!-- Desktop Nav Links - Centered with proper spacing -->
            <div class="hidden lg:flex items-center gap-2 xl:gap-4" id="desktop-nav-links">
                <a href="/" class="nav-link">Home</a>
                <a href="/products" class="nav-link">Shop</a>
                
                <!-- Categories Dropdown -->
                <div class="desktop-dropdown" id="desktop-categories-dropdown">
                    <span class="nav-link desktop-dropdown-trigger">
                        Categories
                        <i class="fa-solid fa-chevron-down"></i>
                    </span>
                    <div class="desktop-dropdown-card" id="desktop-categories-menu">
                        <div class="dropdown-loading">
                            <div class="animate-pulse">Loading categories...</div>
                        </div>
                    </div>
                </div>
                
                <a href="/journal" class="nav-link">Journal</a>
                <a href="/about" class="nav-link">About</a>
            </div>
            
            <!-- Right Side Icons -->
            <div class="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
                <!-- Wishlist -->
                <a href="/wishlist" class="relative p-1.5 no-underline text-primary hover:text-blue transition" aria-label="Wishlist">
                    <i class="fa-regular fa-heart text-lg lg:text-xl"></i>
                    <span id="wish-count" class="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                
                <!-- Cart -->
                <a href="/cart" onclick="toggleCart();return false;" class="relative p-1.5 no-underline text-primary hover:text-blue transition" aria-label="Shopping Cart">
                    <i class="fa-solid fa-bag-shopping text-lg lg:text-xl"></i>
                    <span id="cart-count" class="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </a>
                
                <!-- Auth -->
                <div id="auth-nav-area" class="hidden lg:block">
                    <a href="/login" class="px-6 py-3 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-blue transition-all no-underline inline-block shadow-sm hover:shadow-md">Sign In</a>
                </div>
                
                <!-- Mobile Menu Toggle -->
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
// BUILD DYNAMIC NAVIGATION
// ============================================

// Build Desktop Categories Dropdown Card
async function buildDesktopCategoriesMenu() {
    const menuContainer = document.getElementById('desktop-categories-menu');
    if (!menuContainer) return;
    
    if (!allCategories.length) {
        await fetchCategories();
        await fetchSubcategories();
    }
    
    if (!allCategories.length) {
        menuContainer.innerHTML = `
            <div class="dropdown-empty">
                <i class="fa-solid fa-folder-open text-2xl mb-2 block text-gray-300"></i>
                No categories available
            </div>
        `;
        return;
    }
    
    // Build dropdown card with categories and their subcategories
    let html = '';
    allCategories.forEach((cat, index) => {
        const catSubs = allSubcategories.filter(sub => 
            sub.category_slug === cat.slug || sub.category_id === cat.id
        );
        
        if (catSubs.length > 0) {
            // Category with subcategories
            html += `
                <a href="/category/${cat.slug}" class="dropdown-category-item">
                    <span class="cat-name">${cat.name}</span>
                    <i class="fa-solid fa-chevron-right cat-arrow"></i>
                </a>
                <div class="dropdown-sub-list">
                    ${catSubs.map(sub => `
                        <a href="/category/${cat.slug}/${sub.slug}" class="dropdown-sub-item">${sub.name}</a>
                    `).join('')}
                </div>
            `;
        } else {
            // Category without subcategories
            html += `
                <a href="/category/${cat.slug}" class="dropdown-category-item">
                    <span class="cat-name">${cat.name}</span>
                </a>
            `;
        }
    });
    
    // View All Products link at bottom
    html += `
        <a href="/products" class="dropdown-view-all">
            View All Products <i class="fa-solid fa-arrow-right ml-1" style="font-size: 9px;"></i>
        </a>
    `;
    
    menuContainer.innerHTML = html;
}

// Build Mobile Menu Content
async function buildMobileMenuContent() {
    const container = document.getElementById('mobileMenuContent');
    if (!container) return;
    
    if (!allCategories.length) {
        await fetchCategories();
        await fetchSubcategories();
    }
    
    if (!allCategories.length) {
        container.innerHTML = `
            <a href="/" class="mobile-cat-item">
                <span><i class="fa-solid fa-house mr-3 text-gray-300"></i> Home</span>
            </a>
            <a href="/products" class="mobile-cat-item">
                <span><i class="fa-solid fa-bag-shopping mr-3 text-gray-300"></i> All Products</span>
            </a>
            <a href="/wishlist" class="mobile-cat-item">
                <span><i class="fa-regular fa-heart mr-3 text-gray-300"></i> Wishlist</span>
            </a>
            <p class="text-center text-gray-400 text-xs mt-6">No categories available</p>
        `;
        return;
    }
    
    let html = '';
    
    // Home link
    html += `
        <a href="/" class="mobile-cat-item">
            <span><i class="fa-solid fa-house mr-3 text-gray-300"></i> Home</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;
    
    // All Products
    html += `
        <a href="/products" class="mobile-cat-item">
            <span><i class="fa-solid fa-bag-shopping mr-3 text-gray-300"></i> All Products</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;
    
    // Dynamic Categories with expandable subcategories
    allCategories.forEach((cat, index) => {
        const catSubs = allSubcategories.filter(sub => 
            sub.category_slug === cat.slug || sub.category_id === cat.id
        );
        const catId = `mobile-cat-${index}`;
        
        if (catSubs.length > 0) {
            html += `
                <button class="mobile-cat-item" onclick="toggleMobileCategory('${catId}')" aria-expanded="false">
                    <span><i class="fa-solid fa-grid-2 mr-3 text-gray-300"></i> ${cat.name}</span>
                    <i class="fa-solid fa-chevron-down cat-arrow text-xs" id="${catId}-arrow"></i>
                </button>
                <div class="mobile-subcat-container" id="${catId}-container">
                    ${catSubs.map(sub => `
                        <a href="/category/${cat.slug}/${sub.slug}" class="mobile-sub-cat">${sub.name}</a>
                    `).join('')}
                    <a href="/category/${cat.slug}" class="mobile-sub-cat" style="color: #007aff; font-weight: 600;">
                        View All ${cat.name}
                    </a>
                </div>
            `;
        } else {
            html += `
                <a href="/category/${cat.slug}" class="mobile-cat-item">
                    <span><i class="fa-solid fa-grid-2 mr-3 text-gray-300"></i> ${cat.name}</span>
                    <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                </a>
            `;
        }
    });
    
    // Wishlist
    html += `
        <a href="/wishlist" class="mobile-cat-item">
            <span><i class="fa-regular fa-heart mr-3 text-gray-300"></i> Wishlist</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;
    
    container.innerHTML = html;
}

// Toggle mobile category expand/collapse
function toggleMobileCategory(catId) {
    const container = document.getElementById(`${catId}-container`);
    const arrow = document.getElementById(`${catId}-arrow`);
    
    if (!container || !arrow) return;
    
    const isExpanded = container.classList.contains('expanded');
    
    // Close all other open categories first
    document.querySelectorAll('.mobile-subcat-container.expanded').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.cat-arrow.open').forEach(el => {
        el.classList.remove('open');
    });
    
    if (!isExpanded) {
        container.classList.add('expanded');
        arrow.classList.add('open');
    }
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
        container.innerHTML = '<p class="text-center text-gray-400 py-10 text-sm">Your bag is empty</p>';
        if (subtotalEl) subtotalEl.innerText = '৳ 0.00';
        if (totalEl) totalEl.innerText = '৳ 0.00';
        return;
    }
    
    let sub = 0;
    container.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * (item.quantity || 1);
        sub += itemTotal;
        return `
        <div class="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-soft rounded-2xl">
            <img src="${item.img}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl shrink-0" alt="${item.title}" onerror="this.src='/placeholder.png'">
            <div class="flex-grow min-w-0">
                <h4 class="text-xs sm:text-sm font-bold truncate">${item.title}</h4>
                <p class="text-xs sm:text-sm font-black">৳${item.price.toFixed(2)} × ${item.quantity || 1}</p>
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
        showToast('Added to wishlist! ♥', 'success');
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
    
    const content = document.getElementById('mobileMenuContent');
    if (content && (content.querySelector('.animate-pulse') || !content.innerHTML.trim())) {
        buildMobileMenuContent();
    }
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    document.querySelectorAll('.mobile-subcat-container.expanded').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.cat-arrow.open').forEach(el => {
        el.classList.remove('open');
    });
}

function toggleMobileSubCategories() {
    const firstContainer = document.querySelector('.mobile-subcat-container');
    if (firstContainer) {
        const catId = firstContainer.id.replace('-container', '');
        toggleMobileCategory(catId);
    }
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
window.getProductSlug = getProductSlug;
window.saveCart = saveCart;
window.renderCartItems = renderCartItems;
window.updateCounts = updateCounts;
window.buildDesktopCategoriesMenu = buildDesktopCategoriesMenu;
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
    
    await fetchCategories();
    await fetchSubcategories();
    
    await buildDesktopCategoriesMenu();
    await buildMobileMenuContent();
    
    updateCounts();
    
    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
    
    console.log(`✅ Shared components initialized with ${allCategories.length} categories and ${allSubcategories.length} subcategories`);
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
    setTimeout(initSharedComponents, 100);
}

window.initSharedComponents = initSharedComponents;
