// ============================================
// components.js - Shared Header, Footer & Common Functions
// Version: 3.0 (Dynamic Menu with API Integration)
// ============================================

let cart = JSON.parse(localStorage.getItem('jayen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jayen_wish') || '[]');
let userSession = null;
let allCategories = [];
let menuData = null;
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
        .mega-menu-trigger {
            cursor: pointer;
        }
        .mega-menu-dropdown {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(50px) saturate(180%);
            -webkit-backdrop-filter: blur(50px) saturate(180%);
            border: 1px solid rgba(0,0,0,0.06);
            border-radius: 18px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            padding: 24px;
            min-width: 600px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 100;
            pointer-events: none;
        }
        .mega-menu-container:hover .mega-menu-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
            pointer-events: all;
        }
        .mega-menu-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 32px;
        }
        .mega-menu-column h4 {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #86868b;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #f0f0f0;
        }
        .mega-menu-column ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .mega-menu-column ul li {
            margin-bottom: 8px;
        }
        .mega-menu-column ul li a {
            font-size: 13px;
            color: #1d1d1f;
            text-decoration: none;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 0;
        }
        .mega-menu-column ul li a:hover {
            color: #007aff;
            padding-left: 4px;
        }
        .mega-menu-column ul li a i {
            font-size: 8px;
            color: #007aff;
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
        .mobile-menu-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 0; border-bottom: 1px solid #f5f5f5;
            font-size: 14px; font-weight: 600; letter-spacing: 0.05em;
            cursor: pointer; color: #1d1d1f; text-decoration: none;
            transition: color 0.2s ease;
        }
        .mobile-menu-item:hover { color: #007aff; }
        .mobile-menu-item.has-children {
            cursor: pointer;
        }
        .mobile-submenu {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background: #fafafa;
            border-radius: 8px;
            margin: 4px 0;
        }
        .mobile-submenu.expanded {
            max-height: 1000px;
        }
        .mobile-sub-item {
            padding: 12px 16px 12px 32px;
            font-size: 13px; color: #86868b; cursor: pointer;
            display: flex; align-items: center; gap: 8px;
            text-decoration: none; transition: all 0.2s ease;
            border-bottom: 1px solid #f0f0f0;
        }
        .mobile-sub-item:hover {
            color: #007aff;
            background: white;
            padding-left: 36px;
        }
        .mobile-sub-item::before {
            content: ''; width: 5px; height: 5px;
            background: #007aff; border-radius: 50%; flex-shrink: 0;
        }
        .mobile-menu-arrow {
            transition: transform 0.3s ease;
            font-size: 12px;
            color: #86868b;
        }
        .mobile-menu-arrow.rotated {
            transform: rotate(180deg);
        }
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
        
        /* Loading skeleton */
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s ease-in-out infinite;
            border-radius: 4px;
        }
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        body { padding-top: 56px; }
        @media (min-width: 640px) { body { padding-top: 64px; } }
        @media (min-width: 1024px) { body { padding-top: 80px; } }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================
// API FUNCTIONS
// ============================================
async function fetchSiteStructure() {
    try {
        const response = await fetch(`${API_BASE}/api/site-structure`);
        if (!response.ok) throw new Error('Failed to fetch site structure');
        siteStructure = await response.json();
        return siteStructure;
    } catch (error) {
        console.error('Error fetching site structure:', error);
        return null;
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE}/api/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();
        allCategories = categories;
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
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
            <div class="text-center py-8 text-gray-400">
                <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
                <p class="text-xs mt-2">Loading menu...</p>
            </div>
        </div>
        <div class="mobile-footer" id="mobileMenuFooter">
            <a href="/login" class="w-full py-3 bg-primary text-white rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-blue transition shadow-lg no-underline text-center block">Sign In</a>
        </div>
    </div>
    <nav class="glass-nav fixed w-full top-0 z-50" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex justify-between items-center">
            <a href="/" class="flex items-center gap-2 sm:gap-3 shrink-0 no-underline" aria-label="JAYENWARE Home">
                <img src="/logo.png" class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg" alt="JAYENWARE Logo" loading="eager" width="40" height="40">
                <span class="text-lg sm:text-xl lg:text-2xl font-black tracking-tight font-serif text-primary">JAYENWARE</span>
            </a>
            <div class="hidden lg:flex items-center gap-0" id="desktop-menu">
                <!-- Dynamic desktop menu will be loaded here -->
                <div class="flex gap-1">
                    <div class="h-4 w-16 skeleton"></div>
                    <div class="h-4 w-16 skeleton"></div>
                    <div class="h-4 w-16 skeleton"></div>
                </div>
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
// RENDER DYNAMIC MENUS
// ============================================
function renderDesktopMenu(menuItems) {
    const desktopMenu = document.getElementById('desktop-menu');
    if (!desktopMenu) return;
    
    if (!menuItems || menuItems.length === 0) {
        // Fallback static menu
        desktopMenu.innerHTML = `
            <a href="/" class="nav-link px-5">Home</a>
            <a href="/products" class="nav-link px-5">Shop</a>
            <a href="/journal" class="nav-link px-5">Journal</a>
        `;
        return;
    }
    
    let menuHTML = '';
    
    menuItems.forEach(item => {
        if (item.children && item.children.length > 0) {
            // Mega menu for items with children
            menuHTML += `
            <div class="mega-menu-container px-5">
                <a href="${item.link || '/category/' + (item.slug || getProductSlug({title: item.title}))}" 
                   class="nav-link mega-menu-trigger">
                    ${item.title} <i class="fa-solid fa-chevron-down text-[8px] ml-1"></i>
                </a>
                <div class="mega-menu-dropdown">
                    <div class="mega-menu-grid">
                        ${renderMegaMenuColumns(item.children)}
                    </div>
                </div>
            </div>`;
        } else {
            // Simple link
            const link = item.link || 
                        (item.menu_type === 'category' ? `/category/${item.slug || getProductSlug({title: item.title})}` : 
                         item.menu_type === 'subcategory' ? `/subcategory/${item.slug || getProductSlug({title: item.title})}` : 
                         `/${item.slug || getProductSlug({title: item.title})}`);
            
            menuHTML += `<a href="${link}" class="nav-link px-5">${item.title}</a>`;
        }
    });
    
    desktopMenu.innerHTML = menuHTML;
}

function renderMegaMenuColumns(children) {
    // Split children into columns (max 6 items per column)
    const columns = [];
    const itemsPerColumn = Math.ceil(children.length / 3);
    
    for (let i = 0; i < children.length; i += itemsPerColumn) {
        columns.push(children.slice(i, i + itemsPerColumn));
    }
    
    return columns.map(column => `
        <div class="mega-menu-column">
            <ul>
                ${column.map(child => {
                    const link = child.link || 
                                (child.menu_type === 'category' ? `/category/${child.slug || getProductSlug({title: child.title})}` : 
                                 child.menu_type === 'subcategory' ? `/subcategory/${child.slug || getProductSlug({title: child.title})}` : 
                                 `/${child.slug || getProductSlug({title: child.title})}`);
                    
                    return `<li><a href="${link}"><i class="fa-solid fa-chevron-right"></i> ${child.title}</a></li>`;
                }).join('')}
            </ul>
        </div>
    `).join('');
}

function renderMobileMenu(menuItems) {
    const mobileMenuContent = document.getElementById('mobileMenuContent');
    if (!mobileMenuContent) return;
    
    if (!menuItems || menuItems.length === 0) {
        // Fallback static mobile menu
        mobileMenuContent.innerHTML = `
            <a href="/" class="mobile-menu-item">
                <span><i class="fa-solid fa-house mr-3 text-gray-300"></i> Home</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
            <a href="/products" class="mobile-menu-item">
                <span><i class="fa-solid fa-bag-shopping mr-3 text-gray-300"></i> All Products</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
            <a href="/wishlist" class="mobile-menu-item">
                <span><i class="fa-regular fa-heart mr-3 text-gray-300"></i> Wishlist</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>
        `;
        return;
    }
    
    let menuHTML = `
        <a href="/" class="mobile-menu-item">
            <span><i class="fa-solid fa-house mr-3 text-gray-300"></i> Home</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="/products" class="mobile-menu-item">
            <span><i class="fa-solid fa-bag-shopping mr-3 text-gray-300"></i> All Products</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;
    
    menuItems.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
            // Item with submenu
            menuHTML += `
            <div>
                <div class="mobile-menu-item has-children" onclick="toggleMobileSubmenu('submenu-${index}', this)">
                    <span><i class="fa-solid fa-folder mr-3 text-gray-300"></i> ${item.title}</span>
                    <i class="fa-solid fa-chevron-down mobile-menu-arrow text-xs" id="arrow-${index}"></i>
                </div>
                <div class="mobile-submenu" id="submenu-${index}">
                    ${item.children.map(child => {
                        const link = child.link || 
                                    (child.menu_type === 'category' ? `/category/${child.slug || getProductSlug({title: child.title})}` : 
                                     child.menu_type === 'subcategory' ? `/subcategory/${child.slug || getProductSlug({title: child.title})}` : 
                                     `/${child.slug || getProductSlug({title: child.title})}`);
                        
                        return `<a href="${link}" class="mobile-sub-item">${child.title}</a>`;
                    }).join('')}
                </div>
            </div>`;
        } else {
            // Simple link
            const link = item.link || 
                        (item.menu_type === 'category' ? `/category/${item.slug || getProductSlug({title: item.title})}` : 
                         item.menu_type === 'subcategory' ? `/subcategory/${item.slug || getProductSlug({title: item.title})}` : 
                         `/${item.slug || getProductSlug({title: item.title})}`);
            
            menuHTML += `
            <a href="${link}" class="mobile-menu-item">
                <span><i class="fa-solid fa-link mr-3 text-gray-300"></i> ${item.title}</span>
                <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
            </a>`;
        }
    });
    
    // Add Wishlist link at the bottom
    menuHTML += `
        <a href="/wishlist" class="mobile-menu-item">
            <span><i class="fa-regular fa-heart mr-3 text-gray-300"></i> Wishlist</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;
    
    mobileMenuContent.innerHTML = menuHTML;
}

function toggleMobileSubmenu(submenuId, triggerElement) {
    const submenu = document.getElementById(submenuId);
    const arrow = triggerElement.querySelector('.mobile-menu-arrow');
    
    if (!submenu) return;
    
    if (submenu.classList.contains('expanded')) {
        submenu.classList.remove('expanded');
        if (arrow) arrow.classList.remove('rotated');
    } else {
        // Close other open submenus
        document.querySelectorAll('.mobile-submenu.expanded').forEach(openSub => {
            if (openSub.id !== submenuId) {
                openSub.classList.remove('expanded');
                const otherArrow = document.getElementById('arrow-' + openSub.id.replace('submenu-', ''));
                if (otherArrow) otherArrow.classList.remove('rotated');
            }
        });
        
        submenu.classList.add('expanded');
        if (arrow) arrow.classList.add('rotated');
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
                <div id="footer-dynamic-links-1">
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4">Quick Links</h5>
                    <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0">
                        <li><a href="/about" class="hover:text-white transition no-underline">About</a></li>
                        <li><a href="/shipping" class="hover:text-white transition no-underline">Shipping</a></li>
                        <li><a href="/returns" class="hover:text-white transition no-underline">Returns</a></li>
                        <li><a href="/contact" class="hover:text-white transition no-underline">Contact</a></li>
                    </ul>
                </div>
                <div id="footer-dynamic-links-2">
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
    } else {
        wishlist.push(id);
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
    
    // Load mobile menu content if not already loaded
    if (siteStructure && siteStructure.menu) {
        renderMobileMenu(siteStructure.menu);
    }
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobileMenuDrawer');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Close all open submenus
    document.querySelectorAll('.mobile-submenu.expanded').forEach(sub => {
        sub.classList.remove('expanded');
    });
    document.querySelectorAll('.mobile-menu-arrow.rotated').forEach(arrow => {
        arrow.classList.remove('rotated');
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getProductSlug(product) {
    if (!product || !product.title) return '';
    return product.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 80);
}

// ============================================
// DYNAMIC FOOTER MENU LOADING
// ============================================
function loadDynamicFooterMenus(categories) {
    if (!categories || categories.length === 0) return;
    
    // Update Quick Links section with top categories
    const footerLinks1 = document.getElementById('footer-dynamic-links-1');
    if (footerLinks1) {
        const topCategories = categories.slice(0, 5);
        footerLinks1.innerHTML = `
            <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4">Categories</h5>
            <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0">
                ${topCategories.map(cat => 
                    `<li><a href="/category/${cat.slug || getProductSlug({title: cat.name})}" class="hover:text-white transition no-underline">${cat.name}</a></li>`
                ).join('')}
                <li><a href="/products" class="hover:text-white transition no-underline">All Products →</a></li>
            </ul>
        `;
    }
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
window.cart = cart;
window.wishlist = wishlist;

// ============================================
// INITIALIZATION
// ============================================
async function initSharedComponents() {
    injectSharedStyles();
    renderHeader();
    renderFooter();
    updateCounts();
    
    const yearEl = document.getElementById('display-year');
    if (yearEl) yearEl.innerText = new Date().getFullYear();
    
    // Fetch site structure and render dynamic menus
    try {
        const structure = await fetchSiteStructure();
        if (structure) {
            siteStructure = structure;
            
            // Render desktop menu
            if (structure.menu) {
                renderDesktopMenu(structure.menu);
            }
            
            // Pre-render mobile menu content
            if (structure.menu) {
                renderMobileMenu(structure.menu);
            }
            
            // Load dynamic footer categories
            if (structure.categories) {
                loadDynamicFooterMenus(structure.categories);
                allCategories = structure.categories;
            }
        } else {
            // Fallback - fetch categories only
            const categories = await fetchCategories();
            if (categories && categories.length > 0) {
                allCategories = categories;
                loadDynamicFooterMenus(categories);
            }
            
            // Set default menus
            renderDesktopMenu(null);
            renderMobileMenu(null);
        }
    } catch (error) {
        console.error('Error initializing menus:', error);
        // Set default menus as fallback
        renderDesktopMenu(null);
        renderMobileMenu(null);
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedComponents);
} else {
    setTimeout(initSharedComponents, 100);
}
