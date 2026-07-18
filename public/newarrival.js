// ============================================================
// JAYENWARE – NEW ARRIVALS SECTION (2x2 Grid Layout)
// INTEGRATED: JABIYEN Fonts configuration
// FIXED: stock → is_out_of_stock, image loading, lazy load
// UPDATED: Title only (no price/category), larger font, 2px gap
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // JABIYEN FONTS CONFIGURATION (Embedded)
    // ============================================================
    const JABIYEN_FONTS = {
        families: {
            heading: "'Manrope', sans-serif",
            subtitle: "'Sora', sans-serif",
            body: "'Inter', sans-serif"
        },
        weights: {
            heading: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
            subtitle: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 },
            body: { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 }
        },
        cssVariables: {
            '--font-heading': "'Manrope', sans-serif",
            '--font-subtitle': "'Sora', sans-serif",
            '--font-body': "'Inter', sans-serif",
            '--font-accent': "'Inter', sans-serif",
            '--text-xs': '0.75rem',
            '--text-sm': '0.875rem',
            '--text-base': '1rem',
            '--text-lg': '1.125rem',
            '--text-xl': '1.25rem',
            '--text-2xl': '1.5rem',
            '--text-3xl': '1.875rem',
            '--text-4xl': '2.25rem',
            '--text-5xl': '3rem',
            '--tracking-tight': '-0.5px',
            '--tracking-normal': '0',
            '--tracking-wide': '0.5px',
            '--tracking-wider': '1px',
            '--tracking-widest': '1.5px'
        },
        styles: {
            cardTitle: {
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '13px',
                letterSpacing: 'var(--tracking-normal)'
            },
            sectionTitle: {
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 'var(--text-3xl)',
                letterSpacing: 'var(--tracking-tight)'
            },
            badge: {
                fontFamily: 'var(--font-subtitle)',
                fontWeight: 600,
                fontSize: '0.625rem',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase'
            },
            button: {
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
                letterSpacing: 'var(--tracking-wider)',
                textTransform: 'uppercase'
            }
        }
    };

    // Apply fonts CSS variables to :root
    function applyFontsVariables() {
        const root = document.documentElement;
        const vars = JABIYEN_FONTS.cssVariables;
        for (const [key, value] of Object.entries(vars)) {
            root.style.setProperty(key, value);
        }
        console.log('✅ [NewArrivals] JABIYEN Fonts applied');
    }

    // ============================================================
    // API ENDPOINT CONFIGURATION
    // ============================================================
    const API_CONFIG = {
        baseURL: window.location.origin,
        endpoints: {
            newArrivals: '/api/products?filter=new_arrival&limit=8',
            products: '/api/products',
            addToCart: '/api/cart/add',
            wishlist: '/api/wishlist'
        },
        timeout: 10000,
        retryAttempts: 2
    };

    // ============================================================
    // SECTION CONFIGURATION
    // ============================================================
    const CONFIG = {
        containerId: 'new-arrivals-container',
        skeletonId: 'new-arrivals-skeleton',
        sectionClass: 'new-arrivals-grid-section',
        gridClass: 'new-arrivals-grid',
        title: 'New Arrivals',
        viewAllLink: '/products?filter=new_arrival',
        maxProducts: 8,
        columns: {
            mobile: 2,
            tablet: 3,
            desktop: 4
        },
        cardAspectRatio: '4/5',
        animationDuration: 400
    };

    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================
    function getImageUrl(product) {
        if (product.img && product.img.trim() !== '') return product.img;
        if (product.image && product.image.trim() !== '') return product.image;
        if (product.image_url && product.image_url.trim() !== '') return product.image_url;
        if (product.images && product.images.trim() !== '') {
            const imagesArray = product.images.split(',');
            if (imagesArray[0] && imagesArray[0].trim() !== '') return imagesArray[0].trim();
        }
        return '/placeholder.png';
    }

    function handleImageLoad(img) {
        if (img && img.classList) {
            img.classList.add('loaded');
            img.style.opacity = '1';
        }
    }

    function handleImageError(img) {
        if (img && img.classList) {
            img.style.display = 'none';
            const wrapper = img.closest('.new-arrival-card-image-wrapper');
            if (wrapper) {
                wrapper.style.background = '#f5f5f7';
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ccc;
                    font-size: 40px;
                `;
                placeholder.innerHTML = '📷';
                wrapper.appendChild(placeholder);
            }
        }
    }

    window.handleNewArrivalImageLoad = handleImageLoad;
    window.handleNewArrivalImageError = handleImageError;

    // ============================================================
    // PRODUCT CARD
    // ============================================================
    function createProductCard(product) {
        const isOutOfStock = product.is_out_of_stock === true || 
                             product.is_out_of_stock === 1 ||
                             product.stock === 0 ||
                             product.stock === '0';
        
        const slug = product.slug || 
                     (product.title || 'product')
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/[\s_]+/g, '-')
                        .replace(/^-+|-+$/g, '');

        const imageUrl = getImageUrl(product);
        
        // Badge using JABIYEN_FONTS styles
        let badgeHTML = '';
        if (!isOutOfStock) {
            if (product.is_new_arrival === true || product.is_new_arrival === 1) {
                badgeHTML = '<span class="new-arrival-badge">New</span>';
            } else if (product.is_on_sale === true || product.is_on_sale === 1) {
                badgeHTML = '<span class="new-arrival-badge new-arrival-badge-sale">Sale</span>';
            }
        }

        const card = document.createElement('div');
        card.className = 'new-arrival-card';
        card.setAttribute('data-product-id', product.id);

        // Title only card - using JABIYEN_FONTS body font
        card.innerHTML = `
            <a href="/product/${slug}" class="new-arrival-card-link" onclick="event.preventDefault();if(window.navigate)window.navigate('product-details',{id:${product.id},slug:'${slug}'})">
                <div class="new-arrival-card-image-wrapper">
                    <img 
                        src="${imageUrl}" 
                        alt="${product.title || 'Product'}" 
                        class="new-arrival-card-image"
                        loading="lazy"
                        onload="window.handleNewArrivalImageLoad && window.handleNewArrivalImageLoad(this)"
                        onerror="window.handleNewArrivalImageError && window.handleNewArrivalImageError(this)"
                    >
                    ${badgeHTML}
                    ${isOutOfStock ? '<div class="new-arrival-soldout-overlay"><span>Sold Out</span></div>' : ''}
                </div>
                <div class="new-arrival-card-body">
                    <h3 class="new-arrival-card-title">${product.title || 'Untitled'}</h3>
                </div>
            </a>
        `;

        return card;
    }

    // ============================================================
    // EMPTY STATE
    // ============================================================
    function createEmptyState() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'new-arrival-empty';
        emptyDiv.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <p>No new arrivals at the moment</p>
            <p class="new-arrival-empty-sub">Check back soon for fresh styles</p>
        `;
        return emptyDiv;
    }

    // ============================================================
    // SKELETON CARD
    // ============================================================
    function createSkeletonCard() {
        const card = document.createElement('div');
        card.className = 'new-arrival-card new-arrival-skeleton-card';
        card.innerHTML = `
            <div class="new-arrival-card-image-wrapper">
                <div class="skeleton-pulse" style="width:100%;aspect-ratio:${CONFIG.cardAspectRatio};"></div>
            </div>
            <div class="new-arrival-card-body">
                <div class="skeleton-pulse skeleton-text" style="width:85%;"></div>
                <div class="skeleton-pulse skeleton-text" style="width:55%;"></div>
            </div>
        `;
        return card;
    }

    // ============================================================
    // API FETCH WITH RETRY
    // ============================================================
    async function fetchWithRetry(url, options = {}, retries = API_CONFIG.retryAttempts) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            
            const data = await response.json();
            
            if (data && data.data && Array.isArray(data.data)) return data.data;
            if (data && data.products && Array.isArray(data.products)) return data.products;
            if (Array.isArray(data)) return data;
            
            console.warn('[NewArrivals] Unexpected API response structure:', data);
            return [];
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (retries > 0 && error.name !== 'AbortError') {
                console.warn(`[NewArrivals] Retrying fetch... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return fetchWithRetry(url, options, retries - 1);
            }
            
            throw error;
        }
    }

    // ============================================================
    // FETCH NEW ARRIVALS
    // ============================================================
    async function fetchNewArrivals() {
        try {
            const data = await fetchWithRetry(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.newArrivals}`);
            
            if (Array.isArray(data) && data.length > 0) {
                return data.filter(p => 
                    p.is_new_arrival === true || 
                    p.is_new_arrival === 1 || 
                    p.is_new_arrival === 'true'
                );
            }
            
            const allProducts = await fetchWithRetry(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}`);
            if (Array.isArray(allProducts) && allProducts.length > 0) {
                return allProducts
                    .filter(p => 
                        p.is_new_arrival === true || 
                        p.is_new_arrival === 1 || 
                        p.is_new_arrival === 'true'
                    )
                    .sort((a, b) => {
                        const dateA = new Date(b.created_at || b.date || 0);
                        const dateB = new Date(a.created_at || a.date || 0);
                        return dateA - dateB;
                    })
                    .slice(0, CONFIG.maxProducts);
            }
            
            return [];
        } catch (error) {
            console.error('[NewArrivals] Failed to fetch products:', error);
            return [];
        }
    }

    // ============================================================
    // SECTION HEADER
    // ============================================================
    function createSectionHeader() {
        const header = document.createElement('div');
        header.className = 'new-arrival-header';
        header.innerHTML = `
            <h2 class="new-arrival-title">${CONFIG.title}</h2>
            <a href="${CONFIG.viewAllLink}" class="new-arrival-view-all" onclick="event.preventDefault();window.navigate && window.navigate('products', {filter: 'new_arrival'})">
                View All
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        `;
        return header;
    }

    function createGridContainer() {
        const grid = document.createElement('div');
        grid.className = CONFIG.gridClass;
        return grid;
    }

    // ============================================================
    // LAZY LOADING
    // ============================================================
    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.tagName === 'IMG') {
                        if (img.src && img.src !== window.location.href) {
                            img.style.opacity = '1';
                            observer.unobserve(img);
                        }
                    }
                }
            });
        }, {
            rootMargin: '200px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('.new-arrival-card-image').forEach(img => {
            observer.observe(img);
        });
    }

    // ============================================================
    // RENDER NEW ARRIVALS
    // ============================================================
    async function renderNewArrivals(products) {
        const container = document.getElementById(CONFIG.containerId);
        const skeleton = document.getElementById(CONFIG.skeletonId);
        
        if (!container) {
            console.warn('[NewArrivals] Container not found:', CONFIG.containerId);
            return;
        }

        if (skeleton) skeleton.style.display = 'block';

        try {
            let arrivals;
            if (Array.isArray(products) && products.length > 0) {
                arrivals = products.filter(p => 
                    p.is_new_arrival === true || 
                    p.is_new_arrival === 1 || 
                    p.is_new_arrival === 'true'
                );
            } else {
                arrivals = await fetchNewArrivals();
            }

            container.innerHTML = '';

            const section = document.createElement('section');
            section.className = CONFIG.sectionClass;
            section.appendChild(createSectionHeader());

            const grid = createGridContainer();

            if (arrivals && arrivals.length > 0) {
                const displayProducts = arrivals.slice(0, CONFIG.maxProducts);
                displayProducts.forEach(product => {
                    grid.appendChild(createProductCard(product));
                });
                console.log(`[NewArrivals] Rendered ${displayProducts.length} products`);
            } else {
                section.classList.add('new-arrival-empty-section');
                grid.appendChild(createEmptyState());
                console.log('[NewArrivals] No products to display');
            }

            section.appendChild(grid);
            container.appendChild(section);

            setTimeout(initLazyLoading, 100);

        } catch (error) {
            console.error('[NewArrivals] Render error:', error);
            container.innerHTML = `
                <div class="new-arrival-error">
                    <p>Unable to load new arrivals</p>
                    <button onclick="window.renderNewArrival && window.renderNewArrival()" class="new-arrival-retry-btn">
                        Try Again
                    </button>
                </div>
            `;
        } finally {
            if (skeleton) skeleton.style.display = 'none';
        }
    }

    window.renderNewArrival = renderNewArrivals;

    // ============================================================
    // INJECT STYLES WITH JABIYEN FONTS INTEGRATION
    // ============================================================
    function injectStyles() {
        const styleId = 'new-arrival-dynamic-styles';
        if (document.getElementById(styleId)) return;

        const styles = `
            <style id="${styleId}">
                /* ==================== NEW ARRIVAL SECTION - EDGE TO EDGE ==================== */
                
                .new-arrivals-grid-section {
                    padding: 32px 0;
                    max-width: 100%;
                    margin: 0 auto;
                    background: #ffffff;
                }

                @media (max-width: 767px) {
                    .new-arrivals-grid-section {
                        padding: 20px 0;
                    }
                }

                @media (min-width: 768px) and (max-width: 1023px) {
                    .new-arrivals-grid-section {
                        padding: 28px 16px;
                    }
                }

                @media (min-width: 1024px) {
                    .new-arrivals-grid-section {
                        padding: 40px 36px;
                        max-width: 1400px;
                    }
                }

                /* Section Header - Using JABIYEN_FONTS heading */
                .new-arrival-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    padding: 0 8px;
                }

                @media (min-width: 768px) {
                    .new-arrival-header {
                        margin-bottom: 20px;
                        padding: 0 2px;
                    }
                }

                @media (min-width: 1024px) {
                    .new-arrival-header {
                        margin-bottom: 24px;
                    }
                }

                .new-arrival-title {
                    font-family: ${JABIYEN_FONTS.families.heading};
                    font-weight: ${JABIYEN_FONTS.weights.heading.bold};
                    font-size: 20px;
                    color: #1d1d1f;
                    letter-spacing: -0.3px;
                }

                @media (min-width: 768px) {
                    .new-arrival-title { font-size: 26px; }
                }

                @media (min-width: 1024px) {
                    .new-arrival-title { font-size: 30px; }
                }

                .new-arrival-view-all {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-family: ${JABIYEN_FONTS.families.body};
                    font-weight: ${JABIYEN_FONTS.weights.body.semibold};
                    font-size: 12px;
                    color: #007aff;
                    text-decoration: none;
                    transition: gap 0.25s ease;
                }

                .new-arrival-view-all:hover { gap: 8px; }

                .new-arrival-view-all svg {
                    transition: transform 0.25s ease;
                }

                .new-arrival-view-all:hover svg {
                    transform: translateX(2px);
                }

                /* Grid: 2px gap */
                .new-arrivals-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2px;
                    width: 100%;
                }

                @media (min-width: 768px) {
                    .new-arrivals-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 2px;
                    }
                }

                @media (min-width: 1024px) {
                    .new-arrivals-grid {
                        grid-template-columns: repeat(4, 1fr);
                        gap: 2px;
                    }
                }

                /* Product Card */
                .new-arrival-card {
                    position: relative;
                    background: #fff;
                    transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                    cursor: pointer;
                }

                .new-arrival-card:active {
                    transform: scale(0.98);
                    transition: transform 0.1s ease;
                }

                @media (hover: hover) {
                    .new-arrival-card:hover {
                        transform: translateY(-2px);
                        z-index: 2;
                        box-shadow: 0 8px 25px rgba(0,0,0,0.12);
                    }
                }

                .new-arrival-card-link {
                    text-decoration: none;
                    color: inherit;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                /* Card Image - Tall (4:5) */
                .new-arrival-card-image-wrapper {
                    position: relative;
                    aspect-ratio: 4 / 5;
                    background: #f5f5f7;
                    overflow: hidden;
                    margin-bottom: 6px;
                    border-radius: 0;
                    min-height: 0;
                    width: 100%;
                }

                .new-arrival-card-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
                    opacity: 1;
                    display: block;
                    color: transparent;
                }

                @media (hover: hover) {
                    .new-arrival-card:hover .new-arrival-card-image {
                        transform: scale(1.05);
                    }
                }

                /* Badge - Using JABIYEN_FONTS subtitle */
                .new-arrival-badge {
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    z-index: 2;
                    padding: 2px 7px;
                    font-family: ${JABIYEN_FONTS.families.subtitle};
                    font-weight: ${JABIYEN_FONTS.weights.subtitle.semibold};
                    font-size: 8px;
                    text-transform: uppercase;
                    background: #ffffff;
                    color: #1d1d1f;
                    letter-spacing: 0.5px;
                    border-radius: 1px;
                    pointer-events: none;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                }

                @media (min-width: 768px) {
                    .new-arrival-badge {
                        top: 6px;
                        left: 6px;
                        padding: 2px 8px;
                        font-size: 9px;
                    }
                }

                .new-arrival-badge-sale {
                    color: #d70015 !important;
                }

                /* Sold Out Overlay */
                .new-arrival-soldout-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(255, 255, 255, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 5;
                    pointer-events: none;
                }

                .new-arrival-soldout-overlay span {
                    background: #1d1d1f;
                    color: #ffffff;
                    font-family: ${JABIYEN_FONTS.families.body};
                    font-weight: ${JABIYEN_FONTS.weights.body.bold};
                    font-size: 9px;
                    text-transform: uppercase;
                    padding: 5px 14px;
                    letter-spacing: 1px;
                    border-radius: 1px;
                }

                @media (min-width: 768px) {
                    .new-arrival-soldout-overlay span {
                        font-size: 10px;
                        padding: 6px 18px;
                    }
                }

                /* Card Body - Title Only */
                .new-arrival-card-body {
                    padding: 4px 6px 6px;
                    display: flex;
                    flex-direction: column;
                }

                @media (min-width: 768px) {
                    .new-arrival-card-body {
                        padding: 6px 8px 8px;
                    }
                }

                /* Title - Using JABIYEN_FONTS body font */
                .new-arrival-card-title {
                    font-family: ${JABIYEN_FONTS.families.body};
                    font-weight: ${JABIYEN_FONTS.weights.body.medium};
                    font-size: 13px;
                    color: #1d1d1f;
                    line-height: 1.35;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    margin: 0;
                    text-align: center;
                }

                @media (min-width: 768px) {
                    .new-arrival-card-title {
                        font-size: 15px;
                        line-height: 1.4;
                    }
                }

                /* Empty State */
                .new-arrival-empty-section .new-arrivals-grid {
                    display: flex;
                    justify-content: center;
                }

                .new-arrival-empty {
                    text-align: center;
                    padding: 60px 20px;
                    max-width: 400px;
                }

                .new-arrival-empty svg {
                    margin: 0 auto 16px;
                    opacity: 0.4;
                }

                .new-arrival-empty p {
                    font-family: ${JABIYEN_FONTS.families.body};
                    font-weight: ${JABIYEN_FONTS.weights.body.medium};
                    font-size: 15px;
                    color: #86868b;
                    margin: 0;
                }

                .new-arrival-empty-sub {
                    font-family: ${JABIYEN_FONTS.families.body};
                    font-weight: ${JABIYEN_FONTS.weights.body.regular};
                    font-size: 12px !important;
                    color: #b0b0b5 !important;
                    margin-top: 6px !important;
                }

                /* Error State */
                .new-arrival-error {
                    text-align: center;
                    padding: 48px 20px;
                }

                .new-arrival-error p {
                    font-family: ${JABIYEN_FONTS.families.body};
                    font-weight: ${JABIYEN_FONTS.weights.body.regular};
                    font-size: 14px;
                    color: #86868b;
                    margin-bottom: 16px;
                }

                .new-arrival-retry-btn {
                    padding: 10px 24px;
                    background: #1d1d1f;
                    color: #ffffff;
                    border: none;
                    border-radius: 50px;
                    font-family: ${JABIYEN_FONTS.families.body};
                    font-weight: ${JABIYEN_FONTS.weights.body.semibold};
                    font-size: 12px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .new-arrival-retry-btn:hover {
                    background: #007aff;
                }

                /* Skeleton */
                .new-arrival-skeleton-card {
                    pointer-events: none;
                }

                .skeleton-pulse {
                    background: linear-gradient(90deg, #e5e5ea 0%, #f0f0f5 40%, #e5e5ea 80%);
                    background-size: 800px 100%;
                    animation: skeletonShimmer 1.8s infinite linear;
                    border-radius: 0;
                }

                .skeleton-text {
                    height: 13px;
                    margin-bottom: 5px;
                }

                @keyframes skeletonShimmer {
                    0% { background-position: -468px 0; }
                    100% { background-position: 468px 0; }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================
    function init() {
        // Apply JABIYEN fonts CSS variables first
        applyFontsVariables();
        
        // Inject dynamic styles
        injectStyles();
        
        console.log('[NewArrivals] Module initializing with JABIYEN Fonts...');
        console.log('  📝 Headings:', JABIYEN_FONTS.families.heading);
        console.log('  📝 Subtitles:', JABIYEN_FONTS.families.subtitle);
        console.log('  📝 Body:', JABIYEN_FONTS.families.body);

        // Listen for data loaded event
        window.addEventListener('jayenware:dataLoaded', (event) => {
            const detail = event.detail || {};
            
            if (detail.products && Array.isArray(detail.products)) {
                const newArrivals = detail.products.filter(
                    p => p.is_new_arrival === true || p.is_new_arrival === 1
                );
                if (newArrivals.length > 0) {
                    console.log(`[NewArrivals] Auto-rendering ${newArrivals.length} products from event`);
                    renderNewArrivals(newArrivals);
                }
            }
        });

        // Check if data already exists
        if (window.currentData?.products && Array.isArray(window.currentData.products)) {
            const newArrivals = window.currentData.products.filter(
                p => p.is_new_arrival === true || p.is_new_arrival === 1
            );
            if (newArrivals.length > 0) {
                console.log(`[NewArrivals] Auto-rendering ${newArrivals.length} products from window.currentData`);
                setTimeout(() => renderNewArrivals(newArrivals), 50);
            }
        }

        console.log('[NewArrivals] Module initialized');
    }

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
