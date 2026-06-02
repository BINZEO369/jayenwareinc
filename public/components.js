// ============================================
// components.js - Shared Header, Footer & Common Functions
// Version: 3.0 (Dynamic Menu & Categories)
// ============================================

let cart = JSON.parse(localStorage.getItem('jayen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jayen_wish') || '[]');
let userSession = null;
let allCategories = [];
let allMenuItems = [];
let siteStructure = null;

// API Base URL
const API_BASE = window.location.origin;

// Wait for SUPABASE to be ready
function getSupabase() {
    if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined') {
        return supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return null;
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
        
        /* Mega Menu Styles */
        .mega-menu-container {
            position: relative;
        }
        .mega-menu-dropdown {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            padding: 24px 32px;
            min-width: 600px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 55;
            border: 1px solid rgba(0,0,0,0.06);
        }
        .mega-menu-container:hover .mega-menu-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
        .mega-menu-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 24px;
        }
        .mega-menu-column h4 {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #1d1d1f;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #007aff;
        }
        .mega-menu-column a {
            display: block;
            font-size: 12px;
            color: #86868b;
            text-decoration: none;
            padding: 6px 0;
            transition: all 0.2s ease;
            font-weight: 500;
        }
        .mega-menu-column a:hover {
            color: #007aff;
            padding-left: 8px;
        }
        
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
            transition: color 0.2s ease;
        }
        .mobile-sub-cat {
            padding: 12px 0 12px 20px;
            border-bottom: 1px solid #fafafa;
            font-size: 13px; color: #86868b; cursor: pointer;
            display: flex; align-items: center; gap: 8px;
            text-decoration: none; transition: color 0.2s ease;
        }
        .mobile-sub-cat::before {
            content: ''; width: 5px; height: 5px;
            background: #007aff; border-radius: 50%; flex-shrink: 0;
        }
        .mobile-sub-cat:hover { color: #007aff; }
        .mobile-footer {
            padding: 20px; border-top: 1px solid #f0f0f0;
            background: #f5f5f7; flex-shrink: 0;
        }
        #cart-drawer {
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
        }
        #cart-drawer.open { transform: translateX(0) !important; }
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
// FETCH DATA FROM API
// ============================================
async function fetchSiteStructure() {
    try {
        const response = await fetch(`${API_BASE}/api/site-structure`);
        if (!response.ok) throw new Error('Failed to fetch site structure');
        siteStructure = await response.json();
        allMenuItems = siteStructure.menu || [];
        allCategories = siteStructure.categories || [];
        return siteStructure;
    } catch (error) {
        console.error('Error fetching site structure:', error);
        // Fallback: fetch categories separately
        try {
            const catResponse = await fetch(`${API_BASE}/api/categories`);
            allCategories = await catResponse.json();
        } catch (e) {
            console.error('Error fetching categories:', e);
        }
        return null;
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
                <img src="/logo.png" class="w-9 h-9 rounded-lg" alt="Logo">
                <span class="font-black font-serif text-lg text-primary">JAYENWARE</span>
            </a>
            <button onclick="closeMobileMenu()" class="text-2xl text-gray-400 hover:text-primary transition p-2">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="mobile-menu-scroll" id="mobileMenuContent">
            <!-- Dynamic content will be loaded here -->
        </div>
        <div class="mobile-footer" id="mobileMenuFooter"></div>
    </div>
    <nav class="glass-nav fixed w-full top-0 z-50" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex justify-between items-center">
            <a href="/" class="flex items-center gap-2 sm:gap-3 shrink-0 no-underline" aria-label="JAYENWARE Home">
                <img src="/logo.png" class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg" alt="JAYENWARE Logo" loading="eager" width="40" height="40">
                <span class="text-lg sm:text-xl lg:text-2xl font-black tracking-tight font-serif text-primary">JAYENWARE</span>
            </a>
            <div class="hidden lg:flex items-center gap-0" id="desktopNav">
                <!-- Dynamic menu will be loaded here -->
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
    <div id="cart-drawer" class="fixed top-0 right-0 w-full max-w-sm sm:max-w-md h-full bg-white z-[60] shadow-2xl flex flex-col" style="transform: translateX(100%);">
        <div class="p-4 sm:p-6 border-b flex justify-between items-center bg-soft">
            <h2 class="text-base sm:text-lg font-black uppercase tracking-tighter">Shopping Bag</h2>
            <button onclick="toggleCart()" class="text-gray-400 hover:text-primary text-lg sm:text-xl transition p-1">
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
// RENDER DYNAMIC DESKTOP MENU
// ============================================
function renderDesktopMenu() {
    const desktopNav = document.getElementById('desktopNav');
    if (!desktopNav) return;

    let menuHTML = '';

    // Render menu items from API
    if (allMenuItems && allMenuItems.length > 0) {
        allMenuItems.forEach(item => {
            if (item.children && item.children.length > 0) {
                // Mega menu for items with children
                menuHTML += `
                <div class="mega-menu-container px-3">
                    <a href="${item.link || '/category/' + item.slug}" class="nav-link">${item.title}</a>
                    <div class="mega-menu-dropdown">
                        <div class="mega-menu-grid">
                            ${renderMegaMenuChildren(item.children)}
                        </div>
                    </div>
                </div>`;
            } else {
                // Simple link
                const link = item.menu_type === 'category' && item.category_id 
                    ? `/category/${item.slug}` 
                    : item.menu_type === 'external' 
                        ? item.link 
                        : item.link || '#';
                
                menuHTML += `<a href="${link}" class="nav-link px-5">${item.title}</a>`;
            }
        });
    } else {
        // Fallback static menu
        menuHTML = `
            <a href="/" class="nav-link px-5">Home</a>
            <a href="/products" class="nav-link px-5">Shop</a>
            <a href="/journal" class="nav-link px-5">Journal</a>
        `;
    }

    // Always add category mega menu if categories exist
    if (allCategories && allCategories.length > 0) {
        menuHTML += `
        <div class="mega-menu-container px-3">
            <span class="nav-link">Categories</span>
            <div class="mega-menu-dropdown">
                <div class="mega-menu-grid">
                    ${allCategories.map(cat => `
                        <div class="mega-menu-column">
                            <h4><a href="/category/${cat.slug}" class="text-primary no-underline hover:text-blue">${cat.name}</a></h4>
                            ${cat.subcategories && cat.subcategories.length > 0 
                                ? cat.subcategories.slice(0, 5).map(sub => 
                                    `<a href="/category/${cat.slug}/${sub.slug}">${sub.name}</a>`
                                ).join('')
                                : '<a href="/category/' + cat.slug + '" class="text-gray-400 text-xs">View All</a>'
                            }
                            ${cat.subcategories && cat.subcategories.length > 5 
                                ? `<a href="/category/${cat.slug}" class="text-blue font-bold">+ More</a>` 
                                : ''
                            }
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
    }

    desktopNav.innerHTML = menuHTML;
}

function renderMegaMenuChildren(children) {
    let html = '';
    
    // Group children if they have subcategories
    const groupedChildren = {};
    
    children.forEach(child => {
        if (child.category_id && allCategories) {
            const category = allCategories.find(c => c.id === child.category_id);
            if (category) {
                if (!groupedChildren[category.name]) {
                    groupedChildren[category.name] = {
                        title: category.name,
                        slug: category.slug,
                        items: []
                    };
                }
                groupedChildren[category.name].items.push(child);
            }
        }
    });

    if (Object.keys(groupedChildren).length > 0) {
        Object.values(groupedChildren).forEach(group => {
            html += `
            <div class="mega-menu-column">
                <h4><a href="/category/${group.slug}" class="text-primary no-underline hover:text-blue">${group.title}</a></h4>
                ${group.items.map(item => 
                    `<a href="${item.link || '/category/' + group.slug + '/' + item.slug}">${item.title}</a>`
                ).join('')}
            </div>`;
        });
    } else {
        // Just render as list
        html += `<div class="mega-menu-column">
            <h4>Quick Links</h4>
            ${children.map(child => 
                `<a href="${child.link || '#'}">${child.title}</a>`
            ).join('')}
        </div>`;
    }

    return html;
}

// ============================================
// RENDER DYNAMIC MOBILE MENU
// ============================================
function renderMobileMenu() {
    const mobileContent = document.getElementById('mobileMenuContent');
    if (!mobileContent) return;

    let mobileHTML = `
        <a href="/" class="mobile-cat-item">
            <span><i class="fa-solid fa-house mr-3 text-gray-300"></i> Home</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="/products" class="mobile-cat-item">
            <span><i class="fa-solid fa-bag-shopping mr-3 text-gray-300"></i> All Products</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;

    // Dynamic menu items
    if (allMenuItems && allMenuItems.length > 0) {
        allMenuItems.forEach(item => {
            if (item.children && item.children.length > 0) {
                mobileHTML += `
                <div class="mobile-cat-item" onclick="toggleMobileSubmenu('submenu-${item.id}')">
                    <span><i class="fa-solid fa-folder mr-3 text-gray-300"></i> ${item.title}</span>
                    <i class="fa-solid fa-chevron-down text-xs text-gray-300 transition-transform duration-300" id="arrow-${item.id}"></i>
                </div>
                <div id="submenu-${item.id}" style="display: none;">
                    ${item.children.map(child => 
                        `<a href="${child.link || '/category/' + child.slug}" class="mobile-sub-cat">${child.title}</a>`
                    ).join('')}
                </div>`;
            } else {
                const link = item.menu_type === 'external' ? item.link : item.link || '#';
                mobileHTML += `
                <a href="${link}" class="mobile-cat-item">
                    <span><i class="fa-solid fa-link mr-3 text-gray-300"></i> ${item.title}</span>
                    <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
                </a>`;
            }
        });
    }

    // Categories section
    if (allCategories && allCategories.length > 0) {
        mobileHTML += `
        <div class="mobile-cat-item" onclick="toggleMobileSubmenu('mobile-categories')">
            <span><i class="fa-solid fa-grid-2 mr-3 text-gray-300"></i> Categories</span>
            <i class="fa-solid fa-chevron-down text-xs text-gray-300 transition-transform duration-300" id="arrow-mobile-categories"></i>
        </div>
        <div id="mobile-categories" style="display: none;">
            ${allCategories.map(cat => `
                <a href="/category/${cat.slug}" class="mobile-sub-cat font-bold">${cat.name}</a>
                ${cat.subcategories && cat.subcategories.length > 0 
                    ? cat.subcategories.map(sub => 
                        `<a href="/category/${cat.slug}/${sub.slug}" class="mobile-sub-cat" style="padding-left: 40px;">${sub.name}</a>`
                    ).join('')
                    : ''
                }
            `).join('')}
        </div>`;
    }

    // Static links
    mobileHTML += `
        <a href="/wishlist" class="mobile-cat-item">
            <span><i class="fa-regular fa-heart mr-3 text-gray-300"></i> Wishlist</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="/about" class="mobile-cat-item">
            <span><i class="fa-solid fa-info-circle mr-3 text-gray-300"></i> About</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="/contact" class="mobile-cat-item">
            <span><i class="fa-solid fa-envelope mr-3 text-gray-300"></i> Contact</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;

    mobileContent.innerHTML = mobileHTML;
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
                    <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0" id="footer-quick-links">
                        <li><a href="/about" class="hover:text-white transition no-underline">About</a></li>
                        <li><a href="/shipping" class="hover:text-white transition no-underline">Shipping</a></li>
                        <li><a href="/returns" class="hover:text-white transition no-underline">Returns</a></li>
                        <li><a href="/contact" class="hover:text-white transition no-underline">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4">Categories</h5>
                    <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0" id="footer-categories">
                        <!-- Dynamic categories will be loaded -->
                    </ul>
                </div>
                <div>
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4">Legal</h5>
                    <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0">
                        <li><a href="/privacy-policy" class="hover:text-white transition no-underline">Privacy Policy</a></li>
                        <li><a href="/terms-and-conditions" class="hover:text-white transition no-underline">Terms & Conditions</a></li>
                    </ul>
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
    
    // Populate footer categories
    updateFooterCategories();
}

function updateFooterCategories() {
    const footerCats = document.getElementById('footer-categories');
    if (!footerCats || !allCategories || allCategories.length === 0) return;
    
    footerCats.innerHTML = allCategories.slice(0, 6).map(cat => 
        `<li><a href="/category/${cat.slug}" class="hover:text-white transition no-underline">${cat.name}</a></li>`
    ).join('');
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
    cart.push({
        id: Date.now(),
        product_id: productData.id,
        title: productData.title,
        price: productData.price,
        img: productData.img,
        quantity: 1
    });
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
        sub += item.price;
        return `<div class="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-soft rounded-2xl">
            <img src="${item.img}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl shrink-0" alt="${item.title}">
            <div class="flex-grow min-w-0">
                <h4 class="text-xs sm:text-sm font-bold truncate">${item.title}</h4>
                <p class="text-xs sm:text-sm font-black">৳${item.price}</p>
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
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = '';
    
    // Close all submenus
    document.querySelectorAll('[id^="submenu-"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[id^="arrow-"]').forEach(el => el.style.transform = '');
}

function toggleMobileSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    if (!submenu) return;
    
    const arrowId = submenuId.replace('submenu-', 'arrow-');
    const arrow = document.getElementById(arrowId);
    
    if (submenu.style.display === 'none' || !submenu.style.display) {
        submenu.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        submenu.style.display = 'none';
        if (arrow) arrow.style.transform = '';
    }
}

// Legacy support for old function name
function toggleMobileSubCategories() {
    toggleMobileSubmenu('mobile-categories');
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
window.toggleMobileSubCategories = toggleMobileSubCategories;
window.toggleMobileSubmenu = toggleMobileSubmenu;
window.getProductSlug = getProductSlug;
window.saveCart = saveCart;
window.renderCartItems = renderCartItems;
window.updateCounts = updateCounts;
window.cart = cart;
window.wishlist = wishlist;
window.allCategories = allCategories;
window.fetchSiteStructure = fetchSiteStructure;

// ============================================
// INITIALIZATION
// ============================================
async function initSharedComponents() {
    injectSharedStyles();
    renderHeader();
    renderFooter();
    
    // Fetch dynamic data
    await fetchSiteStructure();
    
    // Render dynamic menus
    renderDesktopMenu();
    renderMobileMenu();
    updateFooterCategories();
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
