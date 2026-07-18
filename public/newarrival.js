// newarrival.js - Homepage New Arrivals Section
// Fetches products marked as is_new_arrival from Supabase
// Renders a responsive grid/slider section on the homepage

(function() {
    'use strict';

    const NEW_ARRIVAL_API_URL = '/api/products/new-arrivals';
    const SECTION_ID = 'new-arrivals-section';

    // Wait for DOM and shared components
    async function init() {
        // Wait for shared components to initialize
        if (typeof window.initSharedComponents === 'function') {
            await window.initSharedComponents();
        }

        // Fetch new arrival products
        const products = await fetchNewArrivals();
        
        if (products && products.length > 0) {
            renderSection(products);
        } else {
            // Hide the section if no products found
            const section = document.getElementById(SECTION_ID);
            if (section) section.style.display = 'none';
        }
    }

    // Fetch new arrival products from API
    async function fetchNewArrivals() {
        try {
            const response = await fetch(NEW_ARRIVAL_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error('[NewArrival] Failed to fetch new arrivals:', error.message);
            return [];
        }
    }

    // Generate product card HTML (consistent with product details page style)
    function createProductCard(product) {
        const slug = product.slug || product.title.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const imageUrl = product.img || '/logo.png';
        const categoryName = product.category || product.category_code || '';
        const title = product.title || 'Untitled Product';
        const price = product.price || 0;
        const oldPrice = product.old_price || null;

        return `
        <a href="/product/${slug}" class="new-arrival-card">
            <div class="na-card-inner">
                <!-- Image Container -->
                <div class="na-image-wrapper">
                    <img 
                        src="${imageUrl}" 
                        alt="${title}" 
                        class="na-product-image" 
                        loading="lazy" 
                        onerror="this.src='/logo.png'"
                    >
                    ${product.is_new_arrival ? '<span class="na-badge">NEW</span>' : ''}
                </div>
                
                <!-- Product Info -->
                <div class="na-card-info">
                    ${categoryName ? `<p class="na-category">${categoryName}</p>` : ''}
                    <h3 class="na-title" title="${title}">${title}</h3>
                    <div class="na-price-row">
                        <span class="na-price">৳ ${Number(price).toLocaleString()}</span>
                        ${oldPrice ? `<span class="na-old-price">৳ ${Number(oldPrice).toLocaleString()}</span>` : ''}
                    </div>
                </div>
            </div>
        </a>`;
    }

    // Render the complete new arrivals section
    function renderSection(products) {
        // Find or create the section
        let section = document.getElementById(SECTION_ID);
        
        if (!section) {
            // Create section if it doesn't exist
            section = document.createElement('section');
            section.id = SECTION_ID;
            section.className = 'new-arrivals-section';
            
            // Insert after hero/secondary hero section, or at the beginning of main content
            const mainContent = document.querySelector('main') || document.getElementById('main-content') || document.body;
            const heroSection = document.querySelector('.hero-section, #hero-section, [id*="hero"]');
            
            if (heroSection && heroSection.nextElementSibling) {
                heroSection.parentNode.insertBefore(section, heroSection.nextElementSibling);
            } else if (heroSection) {
                heroSection.parentNode.appendChild(section);
            } else {
                mainContent.insertBefore(section, mainContent.firstChild);
            }
        }

        // Generate cards HTML
        const cardsHTML = products.map(product => createProductCard(product)).join('');

        // Build complete section HTML
        section.innerHTML = `
            <div class="na-container">
                <!-- Section Header -->
                <div class="na-header">
                    <div class="na-header-left">
                        <span class="na-label">New Arrivals</span>
                        <h2 class="na-heading">Fresh Drops Just Landed</h2>
                        <p class="na-subtitle">Be the first to wear our latest designs. Limited stock, maximum style.</p>
                    </div>
                    <a href="/products?filter=new-arrivals" class="na-view-all">
                        View All
                        <i class="fa-solid fa-arrow-right" style="font-size:12px; margin-left:6px;"></i>
                    </a>
                </div>

                <!-- Products Grid -->
                <div class="na-grid">
                    ${cardsHTML}
                </div>

                <!-- Mobile View All Button -->
                <div class="na-mobile-view-all">
                    <a href="/products?filter=new-arrivals" class="na-view-all-btn">
                        View All New Arrivals
                        <i class="fa-solid fa-arrow-right" style="margin-left:8px;"></i>
                    </a>
                </div>
            </div>
        `;

        // Add CSS if not already added
        if (!document.getElementById('na-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'na-styles';
            styleEl.textContent = getStyles();
            document.head.appendChild(styleEl);
        }

        // Add fade-in animation
        const cards = section.querySelectorAll('.new-arrival-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.05}s`;
            card.classList.add('na-fade-in');
        });
    }

    // CSS Styles for the section
    function getStyles() {
        return `
        /* === New Arrivals Section === */
        .new-arrivals-section {
            padding: 60px 0 40px;
            background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
            overflow: hidden;
        }

        .na-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header */
        .na-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 36px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .na-header-left {
            flex: 1;
        }

        .na-label {
            display: inline-block;
            font-family: var(--font-accent, 'Sora', sans-serif);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #007aff;
            background: rgba(0, 122, 255, 0.08);
            padding: 6px 14px;
            border-radius: 20px;
            margin-bottom: 12px;
        }

        .na-heading {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: clamp(24px, 4vw, 36px);
            font-weight: 800;
            color: #1d1d1f;
            margin: 0 0 8px;
            line-height: 1.2;
            letter-spacing: -0.5px;
        }

        .na-subtitle {
            font-family: var(--font-body, 'Inter', sans-serif);
            font-size: 14px;
            color: #86868b;
            margin: 0;
            line-height: 1.5;
        }

        .na-view-all {
            display: inline-flex;
            align-items: center;
            font-family: var(--font-accent, 'Sora', sans-serif);
            font-size: 13px;
            font-weight: 600;
            color: #1d1d1f;
            text-decoration: none;
            padding: 12px 24px;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 9999px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
        }

        .na-view-all:hover {
            background: #1d1d1f;
            color: #ffffff;
            border-color: #1d1d1f;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        /* Grid */
        .na-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
        }

        @media (min-width: 640px) {
            .na-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
            }
        }

        @media (min-width: 900px) {
            .na-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
            }
        }

        @media (min-width: 1200px) {
            .na-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 24px;
            }
            .na-container {
                padding: 0 40px;
            }
        }

        /* Product Card */
        .new-arrival-card {
            text-decoration: none;
            color: inherit;
            display: block;
            transition: transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
            opacity: 0;
        }

        .new-arrival-card.na-fade-in {
            animation: naFadeInUp 0.5s ease-out forwards;
        }

        @keyframes naFadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .new-arrival-card:hover {
            transform: translateY(-6px);
        }

        .na-card-inner {
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.06);
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
            transition: all 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
            height: 100%;
        }

        .new-arrival-card:hover .na-card-inner {
            box-shadow: 0 12px 40px rgba(0,0,0,0.1);
            border-color: rgba(0,0,0,0.1);
        }

        /* Image Wrapper */
        .na-image-wrapper {
            position: relative;
            aspect-ratio: 3/4;
            overflow: hidden;
            background: #f5f5f7;
        }

        .na-product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .new-arrival-card:hover .na-product-image {
            transform: scale(1.06);
        }

        /* NEW Badge */
        .na-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            background: #1d1d1f;
            color: #ffffff;
            font-family: var(--font-accent, 'Sora', sans-serif);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
            padding: 6px 12px;
            border-radius: 20px;
            text-transform: uppercase;
            z-index: 2;
        }

        /* Card Info */
        .na-card-info {
            padding: 14px 16px 16px;
        }

        .na-category {
            font-family: var(--font-accent, 'Sora', sans-serif);
            font-size: 10px;
            font-weight: 700;
            color: #86868b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 6px;
        }

        .na-title {
            font-family: var(--font-subtitle, 'Inter', sans-serif);
            font-size: 13px;
            font-weight: 600;
            color: #1d1d1f;
            margin: 0 0 8px;
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        @media (min-width: 768px) {
            .na-title {
                font-size: 14px;
            }
        }

        .na-price-row {
            display: flex;
            align-items: baseline;
            gap: 8px;
            flex-wrap: wrap;
        }

        .na-price {
            font-family: var(--font-body, 'Inter', sans-serif);
            font-size: 16px;
            font-weight: 900;
            color: #1d1d1f;
        }

        .na-old-price {
            font-family: var(--font-body, 'Inter', sans-serif);
            font-size: 12px;
            color: #86868b;
            text-decoration: line-through;
        }

        /* Mobile View All */
        .na-mobile-view-all {
            display: block;
            text-align: center;
            margin-top: 28px;
        }

        @media (min-width: 768px) {
            .na-mobile-view-all {
                display: none;
            }
        }

        .na-view-all-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-body, 'Inter', sans-serif);
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
            background: #1d1d1f;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 14px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            width: 100%;
            max-width: 400px;
        }

        .na-view-all-btn:hover {
            background: #333;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 480px) {
            .new-arrivals-section {
                padding: 40px 0 30px;
            }
            .na-header {
                margin-bottom: 24px;
            }
            .na-grid {
                gap: 10px;
            }
            .na-card-info {
                padding: 12px 12px 14px;
            }
            .na-price {
                font-size: 14px;
            }
        }
        `;
    }

    // Start on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
