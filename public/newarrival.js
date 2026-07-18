// newarrival.js - New Arrival Products for Homepage
// ============================================

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = '/api';
    const NEW_ARRIVAL_CONTAINER_ID = 'new-arrival-products';
    const PRODUCTS_PER_LOAD = 12;

    // State
    let currentPage = 1;
    let isLoading = false;
    let hasMore = true;

    // ============================================
    // DOM Ready
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initNewArrivalSection();
    });

    // ============================================
    // Initialize New Arrival Section
    // ============================================
    function initNewArrivalSection() {
        // Find or create container
        let container = document.getElementById(NEW_ARRIVAL_CONTAINER_ID);
        
        if (!container) {
            // Create section if not exists
            const section = createSectionHTML();
            const mainContent = document.querySelector('main') || document.body;
            mainContent.insertAdjacentHTML('beforeend', section);
            container = document.getElementById(NEW_ARRIVAL_CONTAINER_ID);
        }

        if (container) {
            fetchNewArrivals();
            setupInfiniteScroll();
        }
    }

    // ============================================
    // Create Section HTML
    // ============================================
    function createSectionHTML() {
        return `
            <section class="new-arrival-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">New Arrivals</h2>
                        <p class="section-subtitle">Discover our latest collection</p>
                        <div class="section-divider"></div>
                    </div>
                    <div id="${NEW_ARRIVAL_CONTAINER_ID}" class="products-grid">
                        <!-- Products will be loaded here -->
                    </div>
                    <div id="new-arrival-loader" class="loader" style="display: none;">
                        <div class="spinner"></div>
                    </div>
                    <div id="new-arrival-no-more" class="no-more-products" style="display: none;">
                        <p>You've seen all new arrivals</p>
                    </div>
                </div>
            </section>
        `;
    }

    // ============================================
    // Fetch New Arrivals from API
    // ============================================
    async function fetchNewArrivals() {
        if (isLoading || !hasMore) return;

        isLoading = true;
        showLoader(true);

        try {
            // Fetch all products and filter new arrivals
            const response = await fetch(`${API_BASE_URL}/products`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const products = await response.json();
            
            // Filter only new arrival products
            const newArrivals = products.filter(product => product.is_new_arrival === true);
            
            // Sort by created_at (newest first)
            newArrivals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            if (newArrivals.length === 0) {
                hasMore = false;
                showNoMoreMessage(true);
                return;
            }

            // Display all new arrivals
            displayProducts(newArrivals);
            hasMore = false;
            showNoMoreMessage(true);

        } catch (error) {
            console.error('Error fetching new arrivals:', error);
            showErrorMessage();
        } finally {
            isLoading = false;
            showLoader(false);
        }
    }

    // ============================================
    // Display Products in Grid
    // ============================================
    function displayProducts(products) {
        const container = document.getElementById(NEW_ARRIVAL_CONTAINER_ID);
        if (!container) return;

        const productsHTML = products.map(product => createProductCard(product)).join('');
        container.innerHTML += productsHTML;

        // Add click events
        addProductClickEvents();
    }

    // ============================================
    // Create Product Card HTML
    // ============================================
    function createProductCard(product) {
        const productSlug = product.slug || createSlug(product.title);
        const productUrl = `/product/${productSlug}`;
        const imageUrl = product.img || product.images?.[0] || '/images/placeholder.jpg';
        const title = product.title || 'Untitled Product';
        const price = parseFloat(product.price) || 0;
        const oldPrice = product.old_price ? parseFloat(product.old_price) : null;
        const category = product.category || product.categories?.name || '';
        const subcategory = product.subcategory || product.subcategories?.name || '';

        // Calculate discount percentage
        let discountBadge = '';
        if (oldPrice && oldPrice > price) {
            const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
            discountBadge = `<span class="discount-badge">-${discount}%</span>`;
        }

        // Badges
        let badgesHTML = '';
        if (product.is_new_arrival) {
            badgesHTML += '<span class="badge badge-new">New</span>';
        }
        if (product.is_limited_edition) {
            badgesHTML += '<span class="badge badge-limited">Limited</span>';
        }
        if (product.is_on_sale || (oldPrice && oldPrice > price)) {
            badgesHTML += '<span class="badge badge-sale">Sale</span>';
        }

        return `
            <div class="product-card" data-product-url="${productUrl}">
                <div class="product-image-wrapper">
                    <img 
                        src="${imageUrl}" 
                        alt="${title}" 
                        class="product-image"
                        loading="lazy"
                        onerror="this.src='/images/placeholder.jpg'"
                    >
                    ${discountBadge}
                    <div class="product-badges">${badgesHTML}</div>
                    <div class="product-actions">
                        <button class="action-btn quick-view-btn" data-product-url="${productUrl}" title="Quick View">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    ${category ? `<span class="product-category">${category}${subcategory ? ' / ' + subcategory : ''}</span>` : ''}
                    <h3 class="product-title">
                        <a href="${productUrl}">${truncateText(title, 50)}</a>
                    </h3>
                    <div class="product-price-wrapper">
                        <span class="product-price">${formatPrice(price)}</span>
                        ${oldPrice ? `<span class="product-old-price">${formatPrice(oldPrice)}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // ============================================
    // Add Click Events to Product Cards
    // ============================================
    function addProductClickEvents() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't navigate if clicking on a button
                if (e.target.closest('button')) return;
                
                const url = this.getAttribute('data-product-url');
                if (url) {
                    window.location.href = url;
                }
            });
        });

        // Quick view buttons
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const url = this.getAttribute('data-product-url');
                if (url) {
                    window.location.href = url;
                }
            });
        });
    }

    // ============================================
    // Infinite Scroll Setup
    // ============================================
    function setupInfiniteScroll() {
        let scrollTimeout;
        
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(function() {
                const section = document.querySelector('.new-arrival-section');
                if (!section) return;

                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Load more when section is near viewport bottom
                if (rect.bottom <= windowHeight + 300 && hasMore && !isLoading) {
                    fetchNewArrivals();
                }
            }, 200);
        });
    }

    // ============================================
    // Utility Functions
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

    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    function formatPrice(price) {
        return '৳' + parseFloat(price).toLocaleString('en-BD', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function showLoader(show) {
        const loader = document.getElementById('new-arrival-loader');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    function showNoMoreMessage(show) {
        const message = document.getElementById('new-arrival-no-more');
        if (message) {
            message.style.display = show ? 'block' : 'none';
        }
    }

    function showErrorMessage() {
        const container = document.getElementById(NEW_ARRIVAL_CONTAINER_ID);
        if (container) {
            container.innerHTML += `
                <div class="error-message">
                    <p>Sorry, couldn't load new arrivals. Please try again later.</p>
                </div>
            `;
        }
    }

    // ============================================
    // Inject CSS Styles
    // ============================================
    const styles = `
        <style>
            /* New Arrival Section */
            .new-arrival-section {
                padding: 60px 0;
                background-color: #ffffff;
            }

            .new-arrival-section .container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 20px;
            }

            /* Section Header */
            .section-header {
                text-align: center;
                margin-bottom: 40px;
            }

            .section-title {
                font-size: 2rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 8px;
                letter-spacing: 1px;
                text-transform: uppercase;
            }

            .section-subtitle {
                font-size: 1rem;
                color: #666;
                margin-bottom: 16px;
            }

            .section-divider {
                width: 60px;
                height: 3px;
                background: linear-gradient(to right, #e74c3c, #f39c12);
                margin: 0 auto;
                border-radius: 2px;
            }

            /* Products Grid */
            .products-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 24px;
            }

            /* Product Card */
            .product-card {
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 1px solid #e5e5e5;
            }

            .product-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }

            /* Product Image Wrapper */
            .product-image-wrapper {
                position: relative;
                width: 100%;
                padding-top: 120%;
                overflow: hidden;
                background-color: #f5f5f5;
            }

            .product-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
            }

            .product-card:hover .product-image {
                transform: scale(1.05);
            }

            /* Discount Badge */
            .discount-badge {
                position: absolute;
                top: 12px;
                left: 12px;
                background-color: #e74c3c;
                color: white;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 600;
                z-index: 2;
            }

            /* Product Badges */
            .product-badges {
                position: absolute;
                top: 12px;
                right: 12px;
                display: flex;
                flex-direction: column;
                gap: 4px;
                z-index: 2;
            }

            .badge {
                padding: 3px 8px;
                border-radius: 3px;
                font-size: 0.7rem;
                font-weight: 600;
                text-transform: uppercase;
            }

            .badge-new {
                background-color: #2ecc71;
                color: white;
            }

            .badge-sale {
                background-color: #e74c3c;
                color: white;
            }

            .badge-limited {
                background-color: #f39c12;
                color: white;
            }

            /* Product Actions */
            .product-actions {
                position: absolute;
                bottom: 12px;
                right: 12px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                opacity: 0;
                transform: translateX(10px);
                transition: all 0.3s ease;
                z-index: 2;
            }

            .product-card:hover .product-actions {
                opacity: 1;
                transform: translateX(0);
            }

            .action-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background-color: white;
                color: #333;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                transition: all 0.2s ease;
            }

            .action-btn:hover {
                background-color: #1a1a1a;
                color: white;
            }

            /* Product Info */
            .product-info {
                padding: 16px;
            }

            .product-category {
                font-size: 0.75rem;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .product-title {
                margin: 6px 0;
                font-size: 0.95rem;
                font-weight: 500;
                line-height: 1.4;
            }

            .product-title a {
                color: #1a1a1a;
                text-decoration: none;
                transition: color 0.2s ease;
            }

            .product-title a:hover {
                color: #e74c3c;
            }

            /* Product Price */
            .product-price-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 8px;
            }

            .product-price {
                font-size: 1.1rem;
                font-weight: 700;
                color: #1a1a1a;
            }

            .product-old-price {
                font-size: 0.85rem;
                color: #999;
                text-decoration: line-through;
            }

            /* Loader */
            .loader {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 40px 0;
            }

            .spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #e5e5e5;
                border-top: 3px solid #e74c3c;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            /* No More Products */
            .no-more-products {
                text-align: center;
                padding: 40px 0;
                color: #888;
            }

            /* Error Message */
            .error-message {
                text-align: center;
                padding: 20px;
                color: #e74c3c;
                background-color: #fdf0ed;
                border-radius: 8px;
                margin: 20px 0;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .new-arrival-section {
                    padding: 40px 0;
                }

                .section-title {
                    font-size: 1.5rem;
                }

                .products-grid {
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 16px;
                }
            }

            @media (max-width: 480px) {
                .products-grid {
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 12px;
                }

                .product-info {
                    padding: 12px;
                }

                .product-title {
                    font-size: 0.85rem;
                }

                .product-price {
                    font-size: 1rem;
                }

                .new-arrival-section .container {
                    padding: 0 12px;
                }
            }
        </style>
    `;

    // Inject styles into head
    document.head.insertAdjacentHTML('beforeend', styles);

})();
