// newarrival.js - New Arrivals Section for Homepage
// Fetches products marked as new arrivals and displays them in a beautiful slider
// ============================================

(function() {
    'use strict';

    // Configuration
    const API_BASE = '/api';
    const SECTION_ID = 'new-arrivals-section';
    const CONTAINER_ID = 'new-arrivals-container';
    
    // SVG Icons for navigation
    const LEFT_ARROW_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    const RIGHT_ARROW_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    const SPARKLE_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.5 5.5L18 9l-4.5 1.5L12 16l-1.5-5.5L6 9l4.5-1.5z"/><path d="M2 20l1.5-2L5 19.5 3.5 22z"/><path d="M20 4l1.5 2L20 7.5 18.5 6z"/></svg>`;
    const TAG_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`;

    // State
    let allNewArrivals = [];
    let autoScrollInterval = null;
    let isUserInteracting = false;

    // ============================================
    // API Functions - FIXED: Better error handling
    // ============================================
    
    async function apiFetch(endpoint) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`);
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`API Error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (e) {
            console.error('NewArrival API Error:', e);
            return null;
        }
    }

    /**
     * Fetch all products and filter new arrivals
     * FIXED: Better null checking and data validation
     */
    async function fetchNewArrivals() {
        try {
            // Fetch all products from API
            const products = await apiFetch('/products');
            
            if (!products || !Array.isArray(products)) {
                console.warn('No products found for new arrivals');
                return [];
            }

            console.log(`Total products fetched: ${products.length}`); // Debug log

            // FIXED: Filter products where is_new_arrival is true (handle all possible values)
            const newArrivals = products.filter(product => {
                const isNew = product.is_new_arrival;
                return isNew === true || 
                       isNew === 'true' || 
                       isNew === 1 || 
                       isNew === '1' ||
                       isNew === 'TRUE';
            });

            console.log(`New arrivals found: ${newArrivals.length}`); // Debug log

            // Sort by created_at descending (newest first)
            newArrivals.sort((a, b) => {
                const dateA = new Date(a.created_at || 0);
                const dateB = new Date(b.created_at || 0);
                return dateB - dateA;
            });

            return newArrivals;
        } catch (error) {
            console.error('Error fetching new arrivals:', error);
            return [];
        }
    }

    // ============================================
    // FIXED: Product Card HTML Generator with proper image handling
    // ============================================
    
    function generateProductCard(product) {
        if (!product) return '';
        
        const slug = product.slug || generateSlug(product.title);
        
        // FIXED: Better image URL handling with fallback
        let imageUrl = '/logo.png'; // Default fallback
        if (product.img && product.img.trim() !== '') {
            imageUrl = product.img;
        } else if (product.images) {
            // If images field has multiple images, take the first one
            const imageArray = product.images.split(',').filter(img => img.trim() !== '');
            if (imageArray.length > 0) {
                imageUrl = imageArray[0].trim();
            }
        }
        
        // FIXED: Get category name properly
        const categoryName = product.category || 
                            (product.categories && product.categories.name) || 
                            '';
        
        const productTitle = product.title || 'Untitled Product';
        
        // FIXED: Proper price handling with number conversion
        const price = Number(product.price) || 0;
        const oldPrice = product.old_price ? Number(product.old_price) : null;
        
        // Calculate discount percentage
        let discountBadge = '';
        if (oldPrice && oldPrice > price && price > 0) {
            const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
            if (discountPercent > 0 && discountPercent <= 99) {
                discountBadge = `<div class="na-discount-badge">-${discountPercent}%</div>`;
            }
        }
        
        // New arrival tag
        const newTag = `
            <div class="na-new-tag">
                ${TAG_SVG}
                <span>New</span>
            </div>
        `;
        
        // FIXED: Format price with proper Bangladeshi number formatting
        const formattedPrice = formatPrice(price);
        const formattedOldPrice = oldPrice ? formatPrice(oldPrice) : '';
        
        return `
            <a href="/product/${slug}" class="na-product-card" data-product-id="${product.id}">
                <div class="na-product-image-wrapper">
                    <img 
                        src="${imageUrl}" 
                        alt="${productTitle}" 
                        class="na-product-image" 
                        loading="lazy"
                        onerror="this.onerror=null; this.src='/logo.png'; this.style.padding='20px'; this.style.objectFit='contain';"
                    >
                    ${discountBadge}
                    ${newTag}
                </div>
                <div class="na-product-info">
                    ${categoryName ? `<p class="na-product-category">${categoryName}</p>` : ''}
                    <h3 class="na-product-title" title="${productTitle}">${productTitle}</h3>
                    <div class="na-product-price-row">
                        <span class="na-product-price">${formattedPrice}</span>
                        ${formattedOldPrice ? `<span class="na-product-old-price">${formattedOldPrice}</span>` : ''}
                    </div>
                </div>
            </a>
        `;
    }

    // FIXED: Proper price formatting function for Bangladeshi Taka
    function formatPrice(price) {
        if (!price || isNaN(price)) return '৳ 0';
        
        // Convert to number and format
        const numPrice = Number(price);
        
        // For prices without decimals (whole numbers)
        if (Number.isInteger(numPrice)) {
            return '৳ ' + numPrice.toLocaleString('en-IN');
        }
        
        // For prices with decimals
        return '৳ ' + numPrice.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    function generateSlug(title) {
        if (!title) return 'product';
        return title
            .toLowerCase()
            .replace(/[^\w\u0980-\u09FF\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // ============================================
    // Skeleton Loading Cards
    // ============================================
    
    function generateSkeletonCards(count = 8) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="na-product-card na-skeleton-card">
                    <div class="na-product-image-wrapper">
                        <div class="na-skeleton na-skeleton-image"></div>
                    </div>
                    <div class="na-product-info">
                        <div class="na-skeleton na-skeleton-category"></div>
                        <div class="na-skeleton na-skeleton-title"></div>
                        <div class="na-skeleton na-skeleton-price"></div>
                    </div>
                </div>
            `;
        }
        return html;
    }

    // ============================================
    // Section HTML Generator
    // ============================================
    
    function generateSectionHTML() {
        return `
            <section id="${SECTION_ID}" class="new-arrivals-section" aria-label="New Arrivals">
                <!-- Section Header -->
                <div class="na-section-header">
                    <div class="na-header-left">
                        <div class="na-header-icon">
                            ${SPARKLE_SVG}
                        </div>
                        <div class="na-header-text">
                            <h2 class="na-section-title">New Arrivals</h2>
                            <p class="na-section-subtitle">Fresh drops just landed</p>
                        </div>
                    </div>
                    <div class="na-header-right">
                        <a href="/products?filter=new-arrivals" class="na-view-all-link">
                            View All
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Slider Container -->
                <div class="na-slider-wrapper">
                    <!-- Left Arrow -->
                    <button class="na-slider-arrow na-arrow-left" aria-label="Previous products" tabindex="0">
                        ${LEFT_ARROW_SVG}
                    </button>
                    
                    <!-- Products Container -->
                    <div id="${CONTAINER_ID}" class="na-products-container">
                        ${generateSkeletonCards(8)}
                    </div>
                    
                    <!-- Right Arrow -->
                    <button class="na-slider-arrow na-arrow-right" aria-label="Next products" tabindex="0">
                        ${RIGHT_ARROW_SVG}
                    </button>
                </div>

                <!-- Mobile View All Button -->
                <div class="na-mobile-view-all">
                    <a href="/products?filter=new-arrivals" class="na-mobile-view-all-btn">
                        View All New Arrivals
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </section>
        `;
    }

    // ============================================
    // Render Functions
    // ============================================
    
    function renderProducts(products) {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) {
            console.warn('Container not found: ' + CONTAINER_ID);
            return;
        }

        if (!products || products.length === 0) {
            console.log('No new arrivals to display'); // Debug log
            container.innerHTML = `
                <div class="na-empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#86868b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <p>No new arrivals yet</p>
                    <span>Check back soon for fresh drops!</span>
                </div>
            `;
            return;
        }

        console.log(`Rendering ${products.length} new arrival products`); // Debug log
        
        const productsHTML = products.map(product => generateProductCard(product)).join('');
        container.innerHTML = productsHTML;
        
        // Reset scroll position
        container.scrollLeft = 0;
        updateArrowVisibility();
        
        // FIXED: Add error handling for images after render
        setTimeout(() => {
            const images = container.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('error', function() {
                    console.warn('Image failed to load:', this.src);
                    this.onerror = null;
                    this.src = '/logo.png';
                    this.style.padding = '20px';
                    this.style.objectFit = 'contain';
                });
            });
        }, 100);
    }

    function updateArrowVisibility() {
        const container = document.getElementById(CONTAINER_ID);
        const leftArrow = document.querySelector('.na-arrow-left');
        const rightArrow = document.querySelector('.na-arrow-right');
        
        if (!container || !leftArrow || !rightArrow) return;
        
        // Show/hide left arrow
        if (container.scrollLeft <= 5) {
            leftArrow.classList.add('na-arrow-hidden');
        } else {
            leftArrow.classList.remove('na-arrow-hidden');
        }
        
        // Show/hide right arrow
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 5) {
            rightArrow.classList.add('na-arrow-hidden');
        } else {
            rightArrow.classList.remove('na-arrow-hidden');
        }
    }

    // ============================================
    // Slider Navigation
    // ============================================
    
    function slideProducts(direction) {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) return;
        
        const cardWidth = container.querySelector('.na-product-card')?.offsetWidth || 280;
        const gap = 20; // matches CSS gap
        const scrollAmount = (cardWidth + gap) * 2; // Scroll 2 cards at a time
        
        if (direction === 'left') {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Update arrow visibility after scroll animation
        setTimeout(updateArrowVisibility, 400);
    }

    // ============================================
    // Auto-scroll Functionality
    // ============================================
    
    function startAutoScroll() {
        stopAutoScroll();
        if (allNewArrivals.length <= 3) return;
        
        autoScrollInterval = setInterval(() => {
            if (!isUserInteracting && allNewArrivals.length > 3) {
                const container = document.getElementById(CONTAINER_ID);
                if (container) {
                    const maxScroll = container.scrollWidth - container.clientWidth;
                    
                    // If at end, scroll back to start
                    if (container.scrollLeft >= maxScroll - 5) {
                        container.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        slideProducts('right');
                    }
                }
            }
        }, 4000); // Auto-scroll every 4 seconds
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }

    function pauseAutoScroll() {
        isUserInteracting = true;
        setTimeout(() => {
            isUserInteracting = false;
        }, 3000); // Resume auto-scroll after 3 seconds of inactivity
    }

    // ============================================
    // Event Listeners
    // ============================================
    
    function attachEventListeners() {
        // Arrow buttons
        const leftArrow = document.querySelector('.na-arrow-left');
        const rightArrow = document.querySelector('.na-arrow-right');
        
        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                slideProducts('left');
                pauseAutoScroll();
            });
        }
        
        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                slideProducts('right');
                pauseAutoScroll();
            });
        }

        // Scroll event on container
        const container = document.getElementById(CONTAINER_ID);
        if (container) {
            container.addEventListener('scroll', () => {
                updateArrowVisibility();
                pauseAutoScroll();
            }, { passive: true });
            
            // Touch events for mobile
            container.addEventListener('touchstart', () => {
                stopAutoScroll();
            }, { passive: true });
            
            container.addEventListener('touchend', () => {
                setTimeout(() => {
                    updateArrowVisibility();
                    startAutoScroll();
                }, 1500);
            }, { passive: true });
            
            // Mouse events for desktop
            container.addEventListener('mouseenter', () => {
                stopAutoScroll();
            });
            
            container.addEventListener('mouseleave', () => {
                updateArrowVisibility();
                if (allNewArrivals.length > 3) {
                    startAutoScroll();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const section = document.getElementById(SECTION_ID);
            if (!section) return;
            
            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    slideProducts('left');
                    pauseAutoScroll();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    slideProducts('right');
                    pauseAutoScroll();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            updateArrowVisibility();
        });
    }

    // ============================================
    // FIXED: Initialize Section with better error handling
    // ============================================
    
    async function initNewArrivalsSection() {
        // Check if section already exists
        if (document.getElementById(SECTION_ID)) {
            console.log('New Arrivals section already exists');
            return;
        }

        // Determine where to insert the section
        let insertAfterElement = document.querySelector('main > section:last-of-type');
        if (!insertAfterElement) {
            insertAfterElement = document.querySelector('main');
        }
        if (!insertAfterElement) {
            insertAfterElement = document.querySelector('#home-page-content');
        }
        if (!insertAfterElement) {
            // FIXED: Fallback - insert after the first section or at the beginning of body
            insertAfterElement = document.querySelector('section') || document.body;
            console.warn('Using fallback insertion point for New Arrivals section');
        }

        // Create section wrapper
        const sectionWrapper = document.createElement('div');
        sectionWrapper.innerHTML = generateSectionHTML();
        const sectionElement = sectionWrapper.firstElementChild;

        // FIXED: Insert into DOM with better fallback
        if (insertAfterElement.tagName === 'MAIN') {
            insertAfterElement.appendChild(sectionElement);
        } else if (insertAfterElement === document.body) {
            // Insert after header if body is the only option
            const header = document.querySelector('header');
            if (header) {
                header.insertAdjacentElement('afterend', sectionElement);
            } else {
                document.body.prepend(sectionElement);
            }
        } else {
            insertAfterElement.insertAdjacentElement('afterend', sectionElement);
        }

        // Attach event listeners
        attachEventListeners();

        // FIXED: Fetch and render products with better error handling
        try {
            console.log('Fetching new arrivals...');
            const newArrivals = await fetchNewArrivals();
            allNewArrivals = newArrivals;
            
            console.log(`Rendering ${newArrivals.length} new arrivals`);
            renderProducts(newArrivals);
            
            // Start auto-scroll if we have enough products
            if (newArrivals.length > 3) {
                setTimeout(startAutoScroll, 1000);
            }
        } catch (error) {
            console.error('Failed to load new arrivals:', error);
            renderProducts([]);
        }
    }

    // ============================================
    // Public API
    // ============================================
    
    window.NewArrivals = {
        init: initNewArrivalsSection,
        refresh: async function() {
            const container = document.getElementById(CONTAINER_ID);
            if (container) {
                container.innerHTML = generateSkeletonCards(8);
            }
            const newArrivals = await fetchNewArrivals();
            allNewArrivals = newArrivals;
            renderProducts(newArrivals);
            if (newArrivals.length > 3) {
                startAutoScroll();
            }
        },
        slideLeft: () => slideProducts('left'),
        slideRight: () => slideProducts('right'),
        getProducts: () => allNewArrivals,
        pause: stopAutoScroll,
        resume: () => {
            if (allNewArrivals.length > 3) {
                startAutoScroll();
            }
        }
    };

    // ============================================
    // Auto-initialize when DOM is ready
    // ============================================
    
    function autoInit() {
        // Check if we're on the homepage
        const path = window.location.pathname;
        const isHomePage = path === '/' || path === '/index.html' || path === '/home' || path === '';
        
        if (isHomePage) {
            console.log('Homepage detected, initializing New Arrivals section...');
            // Wait for components to load first
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(initNewArrivalsSection, 800);
                });
            } else {
                setTimeout(initNewArrivalsSection, 800);
            }
        }
    }

    // Check if we should auto-init
    autoInit();

    // Also expose a manual init for dynamic page loads
    window.initNewArrivals = initNewArrivalsSection;

})();


// ============================================
// Inline Styles (appended to document head)
// ============================================

(function addStyles() {
    const styles = `
        /* ============================================ */
        /* NEW ARRIVALS SECTION STYLES                  */
        /* ============================================ */
        
        .new-arrivals-section {
            width: 100%;
            max-width: 1400px;
            margin: 60px auto 80px;
            padding: 0 20px;
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
        }
        
        /* Section Header */
        .na-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
            flex-wrap: wrap;
            gap: 16px;
        }
        
        .na-header-left {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        
        .na-header-icon {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d97706;
            flex-shrink: 0;
            box-shadow: 0 2px 12px rgba(251, 191, 36, 0.2);
        }
        
        .na-header-icon svg {
            width: 22px;
            height: 22px;
        }
        
        .na-header-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        
        .na-section-title {
            font-size: 26px;
            font-weight: 700;
            color: #1d1d1f;
            margin: 0;
            line-height: 1.2;
            letter-spacing: -0.5px;
        }
        
        .na-section-subtitle {
            font-size: 14px;
            color: #86868b;
            margin: 0;
            font-weight: 400;
        }
        
        .na-header-right {
            flex-shrink: 0;
        }
        
        .na-view-all-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 20px;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            color: #1d1d1f;
            text-decoration: none;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 0, 0, 0.08);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            letter-spacing: 0.3px;
            white-space: nowrap;
        }
        
        .na-view-all-link:hover {
            background: rgba(29, 29, 31, 0.05);
            border-color: rgba(0, 0, 0, 0.15);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }
        
        .na-view-all-link svg {
            transition: transform 0.3s ease;
        }
        
        .na-view-all-link:hover svg {
            transform: translateX(3px);
        }
        
        /* Slider Wrapper */
        .na-slider-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0;
        }
        
        /* Products Container */
        .na-products-container {
            display: flex;
            gap: 20px;
            overflow-x: auto;
            scroll-behavior: smooth;
            scroll-snap-type: x mandatory;
            padding: 8px 4px 20px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            flex: 1;
            min-width: 0;
        }
        
        .na-products-container::-webkit-scrollbar {
            display: none;
        }
        
        /* FIXED: Product Card styles with better image handling */
        .na-product-card {
            flex: 0 0 auto;
            width: 260px;
            scroll-snap-align: start;
            text-decoration: none;
            color: inherit;
            display: block;
            transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
            cursor: pointer;
            border-radius: 18px;
        }
        
        .na-product-card:hover {
            transform: translateY(-6px);
        }
        
        .na-product-card:focus-visible {
            outline: 2px solid #007aff;
            outline-offset: 4px;
            border-radius: 18px;
        }
        
        /* Product Image Wrapper */
        .na-product-image-wrapper {
            position: relative;
            width: 100%;
            aspect-ratio: 3/4;
            border-radius: 18px;
            overflow: hidden;
            background: #f5f5f7;
            margin-bottom: 14px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
            transition: box-shadow 0.4s ease;
        }
        
        .na-product-card:hover .na-product-image-wrapper {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        
        /* FIXED: Better image styling */
        .na-product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
            background: #f5f5f7;
        }
        
        .na-product-card:hover .na-product-image {
            transform: scale(1.06);
        }
        
        /* Discount Badge */
        .na-discount-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            background: #ef4444;
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 5px 10px;
            border-radius: 8px;
            letter-spacing: 0.5px;
            z-index: 2;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }
        
        /* New Tag */
        .na-new-tag {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(29, 29, 31, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: white;
            font-size: 10px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            gap: 5px;
            letter-spacing: 0.5px;
            z-index: 2;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            text-transform: uppercase;
        }
        
        .na-new-tag svg {
            width: 13px;
            height: 13px;
        }
        
        /* Product Info */
        .na-product-info {
            padding: 0 4px;
        }
        
        .na-product-category {
            font-size: 10px;
            font-weight: 700;
            color: #86868b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 6px;
            line-height: 1;
        }
        
        .na-product-title {
            font-size: 15px;
            font-weight: 600;
            color: #1d1d1f;
            margin: 0 0 8px;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        /* FIXED: Better price styling */
        .na-product-price-row {
            display: flex;
            align-items: baseline;
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .na-product-price {
            font-size: 17px;
            font-weight: 700;
            color: #1d1d1f;
        }
        
        .na-product-old-price {
            font-size: 13px;
            font-weight: 500;
            color: #86868b;
            text-decoration: line-through;
        }
        
        /* Slider Arrows */
        .na-slider-arrow {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 0, 0, 0.1);
            color: #1d1d1f;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            flex-shrink: 0;
            z-index: 10;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }
        
        .na-slider-arrow:hover {
            background: rgba(29, 29, 31, 0.05);
            border-color: rgba(0, 0, 0, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transform: scale(1.05);
        }
        
        .na-slider-arrow:active {
            transform: scale(0.95);
        }
        
        .na-slider-arrow.na-arrow-hidden {
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
        }
        
        .na-arrow-left {
            margin-right: -8px;
        }
        
        .na-arrow-right {
            margin-left: -8px;
        }
        
        /* Mobile View All Button */
        .na-mobile-view-all {
            display: none;
            text-align: center;
            margin-top: 24px;
        }
        
        .na-mobile-view-all-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: #1d1d1f;
            color: white;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            letter-spacing: 0.3px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .na-mobile-view-all-btn:hover {
            background: #2d2d2f;
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }
        
        .na-mobile-view-all-btn svg {
            transition: transform 0.3s ease;
        }
        
        .na-mobile-view-all-btn:hover svg {
            transform: translateX(3px);
        }
        
        /* Empty State */
        .na-empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            width: 100%;
        }
        
        .na-empty-state svg {
            margin-bottom: 16px;
            opacity: 0.5;
        }
        
        .na-empty-state p {
            font-size: 18px;
            font-weight: 600;
            color: #86868b;
            margin: 0 0 4px;
        }
        
        .na-empty-state span {
            font-size: 13px;
            color: #a1a1a6;
        }
        
        /* Skeleton Loading */
        .na-skeleton-card {
            pointer-events: none;
        }
        
        .na-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: na-shimmer 1.5s infinite;
            border-radius: 8px;
        }
        
        @keyframes na-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        .na-skeleton-image {
            width: 100%;
            height: 100%;
            border-radius: 18px;
        }
        
        .na-skeleton-category {
            width: 60px;
            height: 10px;
            margin-bottom: 8px;
        }
        
        .na-skeleton-title {
            width: 80%;
            height: 16px;
            margin-bottom: 8px;
        }
        
        .na-skeleton-price {
            width: 50%;
            height: 18px;
        }
        
        /* ============================================ */
        /* RESPONSIVE STYLES                           */
        /* ============================================ */
        
        /* Tablet */
        @media (max-width: 1024px) {
            .new-arrivals-section {
                margin: 40px auto 60px;
                padding: 0 16px;
            }
            
            .na-section-title {
                font-size: 22px;
            }
            
            .na-product-card {
                width: 220px;
            }
            
            .na-slider-arrow {
                width: 38px;
                height: 38px;
            }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
            .new-arrivals-section {
                margin: 32px auto 48px;
                padding: 0 12px;
            }
            
            .na-section-header {
                margin-bottom: 20px;
            }
            
            .na-header-icon {
                width: 36px;
                height: 36px;
                border-radius: 12px;
            }
            
            .na-header-icon svg {
                width: 18px;
                height: 18px;
            }
            
            .na-section-title {
                font-size: 20px;
            }
            
            .na-section-subtitle {
                font-size: 12px;
            }
            
            .na-header-right {
                display: none;
            }
            
            .na-slider-arrow {
                display: none;
            }
            
            .na-product-card {
                width: 180px;
            }
            
            .na-products-container {
                gap: 14px;
                padding: 4px 2px 16px;
            }
            
            .na-product-title {
                font-size: 13px;
            }
            
            .na-product-price {
                font-size: 15px;
            }
            
            .na-product-old-price {
                font-size: 11px;
            }
            
            .na-product-image-wrapper {
                border-radius: 14px;
            }
            
            .na-discount-badge {
                top: 8px;
                left: 8px;
                font-size: 10px;
                padding: 4px 8px;
                border-radius: 6px;
            }
            
            .na-new-tag {
                top: 8px;
                right: 8px;
                font-size: 9px;
                padding: 4px 10px;
            }
            
            .na-mobile-view-all {
                display: block;
                margin-top: 20px;
            }
            
            .na-mobile-view-all-btn {
                width: 100%;
                justify-content: center;
                padding: 16px 24px;
                font-size: 14px;
            }
        }
        
        /* Small Mobile */
        @media (max-width: 480px) {
            .na-product-card {
                width: 160px;
            }
            
            .na-products-container {
                gap: 10px;
            }
            
            .na-product-title {
                font-size: 12px;
            }
            
            .na-product-price {
                font-size: 14px;
            }
            
            .na-section-title {
                font-size: 18px;
            }
            
            .na-new-tag {
                font-size: 8px;
                padding: 3px 8px;
                gap: 3px;
            }
            
            .na-new-tag svg {
                width: 10px;
                height: 10px;
            }
        }
        
        /* Large Desktop */
        @media (min-width: 1400px) {
            .new-arrivals-section {
                padding: 0;
            }
            
            .na-product-card {
                width: 280px;
            }
            
            .na-products-container {
                gap: 24px;
            }
        }
        
        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
            .na-products-container {
                scroll-behavior: auto;
            }
            
            .na-product-card,
            .na-product-image,
            .na-view-all-link svg,
            .na-mobile-view-all-btn svg {
                transition: none;
            }
            
            .na-skeleton {
                animation: none;
                background: #f0f0f0;
            }
        }
    `;

    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
})();
