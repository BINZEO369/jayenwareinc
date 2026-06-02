// ============================================
// components.js - Shared Header, Footer & Common Functions
// Version: 3.0 (Dynamic Menu & Category System)
// ============================================

let cart = JSON.parse(localStorage.getItem('jayen_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('jayen_wish') || '[]');
let userSession = null;
let allCategories = [];
let allMenuItems = [];

// API Configuration
const API_BASE = '/api';

// ============================================
// API FUNCTIONS
// ============================================
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        return null;
    }
}

async function loadSiteStructure() {
    try {
        const data = await fetchAPI('/site-structure');
        if (data) {
            allMenuItems = data.menu || [];
            allCategories = data.categories || [];
            return data;
        }
    } catch (error) {
        console.error('Failed to load site structure:', error);
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
        
        /* Dropdown Menu Styles */
        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            padding: 24px;
            min-width: 600px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 100;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
        }
        .dropdown-trigger:hover .dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
        .dropdown-category {
            margin-bottom: 16px;
        }
        .dropdown-category-title {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #1d1d1f;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #007aff;
        }
        .dropdown-subcategory {
            display: block;
            padding: 6px 0;
            font-size: 13px;
            color: #86868b;
            text-decoration: none;
            transition: color 0.2s ease;
            cursor: pointer;
        }
        .dropdown-subcategory:hover {
            color: #007aff;
        }
        
        /* Mobile Menu Styles */
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
        
        /* Cart Drawer */
        #cart-drawer {
            transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: transform;
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
        
        body { padding-top: 56px; }
        @media (min-width: 640px) { body { padding-top: 64px; } }
        @media (min-width: 1024px) { body { padding-top: 80px; } }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
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
            <!-- Dynamic content loaded here -->
        </div>
        <div class="mobile-footer" id="mobileMenuFooter"></div>
    </div>
    
    <nav class="glass-nav fixed w-full top-0 z-50" id="main-nav">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 lg:h-20 flex justify-between items-center">
            <a href="/" class="flex items-center gap-2 sm:gap-3 shrink-0 no-underline" aria-label="JAYENWARE Home">
                <img src="/logo.png" class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg" alt="JAYENWARE Logo" loading="eager" width="40" height="40">
                <span class="text-lg sm:text-xl lg:text-2xl font-black tracking-tight font-serif text-primary">JAYENWARE</span>
            </a>
            
            <!-- Desktop Menu -->
            <div class="hidden lg:flex items-center gap-0" id="desktopMenu">
                <!-- Dynamic menu loaded here -->
            </div>
            
            <!-- Action Icons -->
            <div class="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
                <button onclick="openCartDrawer()" class="relative p-1.5 no-underline text-primary hover:text-blue transition" aria-label="Shopping Cart">
                    <i class="fa-solid fa-bag-shopping text-lg lg:text-xl"></i>
                    <span id="cart-count" class="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] sm:text-[9px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">0</span>
                </button>
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
            <button onclick="closeCartDrawer()" class="text-gray-400 hover:text-primary text-lg sm:text-xl transition p-1">
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
    
    // Insert header at the beginning of body
    const existingHeader = document.getElementById('main-nav');
    if (!existingHeader) {
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }
}

// ============================================
// RENDER DYNAMIC MENUS
// ============================================
function renderDesktopMenu() {
    const desktopMenu = document.getElementById('desktopMenu');
    if (!desktopMenu) return;

    let menuHTML = '';
    
    // Add menu items from database
    allMenuItems.forEach(item => {
        if (item.children && item.children.length > 0) {
            // Menu with dropdown
            menuHTML += `
            <div class="dropdown-trigger relative px-3">
                <span class="nav-link px-2">${item.title}</span>
                <div class="dropdown-menu">
            `;
            
            item.children.forEach(child => {
                menuHTML += `
                <div class="dropdown-category">
                    <div class="dropdown-category-title">${child.title}</div>
                    <a href="/${child.link || '#'}" class="dropdown-subcategory">View All</a>
                </div>
                `;
            });
            
            menuHTML += `</div></div>`;
        } else {
            // Simple link
            const link = item.link || '#';
            menuHTML += `<a href="/${link}" class="nav-link px-5">${item.title}</a>`;
        }
    });
    
    // Always show categories dropdown
    menuHTML += `
    <div class="dropdown-trigger relative px-3">
        <span class="nav-link px-2">Categories</span>
        <div class="dropdown-menu" id="categoriesDropdown">
    `;
    
    allCategories.forEach(cat => {
        const catSlug = cat.slug || getSlug(cat.name);
        menuHTML += `
        <div class="dropdown-category">
            <a href="/category/${catSlug}" class="dropdown-category-title" style="text-decoration: none;">${cat.name}</a>
        `;
        
        if (cat.subcategories && cat.subcategories.length > 0) {
            cat.subcategories.forEach(sub => {
                const subSlug = sub.slug || getSlug(sub.name);
                menuHTML += `<a href="/category/${catSlug}/${subSlug}" class="dropdown-subcategory">${sub.name}</a>`;
            });
        }
        
        menuHTML += `</div>`;
    });
    
    menuHTML += `</div></div>`;
    
    desktopMenu.innerHTML = menuHTML;
}

function renderMobileMenu() {
    const mobileContent = document.getElementById('mobileMenuContent');
    if (!mobileContent) return;
    
    let menuHTML = `
        <a href="/" class="mobile-cat-item">
            <span><i class="fa-solid fa-house mr-3 text-gray-300"></i> Home</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
        <a href="/products" class="mobile-cat-item">
            <span><i class="fa-solid fa-bag-shopping mr-3 text-gray-300"></i> All Products</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>
    `;
    
    // Add menu items
    allMenuItems.forEach(item => {
        const link = item.link || getSlug(item.title);
        menuHTML += `<a href="/${link}" class="mobile-cat-item">
            <span>${item.title}</span>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
        </a>`;
    });
    
    // Categories section
    allCategories.forEach(cat => {
        const catSlug = cat.slug || getSlug(cat.name);
        menuHTML += `
        <div class="mobile-cat-item" onclick="toggleMobileCategory('cat-${cat.id}')">
            <span>${cat.name}</span>
            <i class="fa-solid fa-chevron-down text-xs text-gray-300 transition-transform duration-300" id="arrow-cat-${cat.id}"></i>
        </div>
        <div id="cat-${cat.id}" style="display: none;">
            <a href="/category/${catSlug}" class="mobile-sub-cat">All ${cat.name}</a>
        `;
        
        if (cat.subcategories && cat.subcategories.length > 0) {
            cat.subcategories.forEach(sub => {
                const subSlug = sub.slug || getSlug(sub.name);
                menuHTML += `<a href="/category/${catSlug}/${subSlug}" class="mobile-sub-cat">${sub.name}</a>`;
            });
        }
        
        menuHTML += `</div>`;
    });
    
    mobileContent.innerHTML = menuHTML;
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
                    <h5 class="text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-3 sm:mb-4">Categories</h5>
                    <ul class="space-y-2 text-[10px] sm:text-xs list-none p-0" id="footerCategories">
                        <!-- Dynamic categories loaded here -->
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
    
    const existingFooter = document.getElementById('main-footer');
    if (!existingFooter) {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}

function renderFooterCategories() {
    const footerCats = document.getElementById('footerCategories');
    if (!footerCats || !allCategories.length) return;
    
    footerCats.innerHTML = allCategories.slice(0, 5).map(cat => {
        const catSlug = cat.slug || getSlug(cat.name);
        return `<li><a href="/category/${catSlug}" class="hover:text-white transition no-underline">${cat.name}</a></li>`;
    }).join('');
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
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.add('open');
        renderCartItems();
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
        drawer.classList.remove('open');
    }
}

function addToCart(productId, productData) {
    if (!productData) { showToast('Product data missing', 'error'); return; }
    if (productData.stock <= 0) return showToast('Out of stock', 'error');
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.product_id === productData.id);
    if (existingItem) {
        existingItem.quantity += 1;
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
        container.innerHTML = '<p class="text-center text-gray-400 py-10 text-sm">Your bag is empty</p>';
        if (subtotalEl) subtotalEl.innerText = '৳ 0.00';
        if (totalEl) totalEl.innerText = '৳ 0.00';
        return;
    }
    
    let sub = 0;
    container.innerHTML = cart.map((item, idx) => {
        const itemTotal = item.price * item.quantity;
        sub += itemTotal;
        return `<div class="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-soft rounded-2xl">
            <img src="${item.img}" class="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl shrink-0" alt="${item.title}">
            <div class="flex-grow min-w-0">
                <h4 class="text-xs sm:text-sm font-bold truncate">${item.title}</h4>
                <p class="text-xs sm:text-sm font-black">৳${item.price} x ${item.quantity}</p>
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
    if (cartCount) cartCount.innerText = cart.length;
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
    
    // Close all category submenus
    document.querySelectorAll('[id^="cat-"]').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('[id^="arrow-cat-"]').forEach(el => {
        el.style.transform = '';
    });
}

function toggleMobileCategory(catId) {
    const submenu = document.getElementById(catId);
    const arrow = document.getElementById(`arrow-${catId}`);
    if (!submenu) return;
    
    if (submenu.style.display === 'none' || !submenu.style.display) {
        submenu.style.display = 'block';
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        submenu.style.display = 'none';
        if (arrow) arrow.style.transform = '';
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getSlug(text) {
    if (!text) return '';
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 80);
}

function getCategoryUrl(category, subcategory = null) {
    const catSlug = category.slug || getSlug(category.name);
    if (subcategory) {
        const subSlug = subcategory.slug || getSlug(subcategory.name);
        return `/category/${catSlug}/${subSlug}`;
    }
    return `/category/${catSlug}`;
}

// ============================================
// GLOBAL EXPOSURE
// ============================================
window.showToast = showToast;
window.hideToast = hideToast;
window.addToCart = addToCart;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.removeFromCart = removeFromCart;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleMobileCategory = toggleMobileCategory;
window.getSlug = getSlug;
window.getCategoryUrl = getCategoryUrl;
window.saveCart = saveCart;
window.renderCartItems = renderCartItems;
window.updateCounts = updateCounts;
window.cart = cart;
window.allCategories = allCategories;
window.allMenuItems = allMenuItems;

// ============================================
// INITIALIZATION
// ============================================
async function initSharedComponents() {
    injectSharedStyles();
    renderHeader();
    renderFooter();
    
    // Load site structure from API
    const siteData = await loadSiteStructure();
    
    if (siteData) {
        // Render dynamic menus
        renderDesktopMenu();
        renderMobileMenu();
        renderFooterCategories();
    }
    
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
