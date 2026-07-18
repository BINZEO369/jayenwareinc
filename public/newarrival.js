// ============================================================
// JAYENWARE – NEW ARRIVALS SECTION (2x2 Grid Layout)
// ENHANCED: Smooth slide animation, black tiny dots, premium feel
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
        }
    };

    function applyFontsVariables() {
        const root = document.documentElement;
        const vars = JABIYEN_FONTS.cssVariables;
        for (const [key, value] of Object.entries(vars)) {
            root.style.setProperty(key, value);
        }
    }

    // ============================================================
    // API ENDPOINT CONFIGURATION
    // ============================================================
    const API_CONFIG = {
        baseURL: window.location.origin,
        endpoints: {
            newArrivals: '/api/products?filter=new_arrival&limit=8',
            products: '/api/products',
            productColors: '/api/product-colors',
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
        cardAspectRatio: '4/5'
    };

    let productColorsCache = {};

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

    function getProductSlug(product) {
        return (product.slug || product.title || 'product')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
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
    // FETCH PRODUCT COLORS
    // ============================================================
    async function fetchProductColors(slug) {
        if (productColorsCache[slug]) return productColorsCache[slug];
        try {
            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.productColors}?slug=${encodeURIComponent(slug)}`);
            if (!response.ok) return [];
            const data = await response.json();
            productColorsCache[slug] = data || [];
            return data || [];
        } catch (error) {
            console.warn('[NewArrivals] Failed to fetch colors for:', slug, error);
            return [];
        }
    }

    // ============================================================
    // GET ALL IMAGES FOR SLIDER
    // ============================================================
    function getAllImagesForSlider(product, colors) {
        const images = [];
        const mainImage = getImageUrl(product);
        if (mainImage && mainImage !== '/placeholder.png') {
            images.push(mainImage);
        }
        if (colors && colors.length > 0) {
            colors.forEach(color => {
                if (color.color_image && color.color_image.trim() !== '' && !images.includes(color.color_image)) {
                    images.push(color.color_image);
                }
            });
        }
        return images;
    }

    // ============================================================
    // PRODUCT CARD WITH ENHANCED SLIDER
    // ============================================================
    function createProductCard(product) {
        const isOutOfStock = product.is_out_of_stock === true || 
                             product.is_out_of_stock === 1 ||
                             product.stock === 0 ||
                             product.stock === '0';
        
        const slug = getProductSlug(product);
        const imageUrl = getImageUrl(product);
        
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
        card.setAttribute('data-product-slug', slug);

        card.innerHTML = `
            <a href="/product/${slug}" class="new-arrival-card-link">
                <div class="new-arrival-card-image-wrapper">
                    <div class="new-arrival-image-slider" data-slug="${slug}">
                        <img 
                            src="${imageUrl}" 
                            alt="${product.title || 'Product'}" 
                            class="new-arrival-card-image new-arrival-slider-image active"
                            data-index="0"
                            loading="lazy"
                            onload="window.handleNewArrivalImageLoad && window.handleNewArrivalImageLoad(this)"
                            onerror="window.handleNewArrivalImageError && window.handleNewArrivalImageError(this)"
                        >
                    </div>
                    ${badgeHTML}
                    ${isOutOfStock ? '<div class="new-arrival-soldout-overlay"><span>Sold Out</span></div>' : ''}
                    <div class="new-arrival-image-dots" data-slug="${slug}" style="display:none;"></div>
                </div>
                <div class="new-arrival-card-body">
                    <h3 class="new-arrival-card-title">${product.title || 'Untitled'}</h3>
                    <div class="new-arrival-color-dots-below" data-slug="${slug}"></div>
                </div>
            </a>
        `;

        fetchProductColors(slug).then(colors => {
            setupCardWithSlider(card, product, colors, slug);
        });

        return card;
    }

    // Setup card with enhanced image slider
    function setupCardWithSlider(card, product, colors, slug) {
        const sliderContainer = card.querySelector('.new-arrival-image-slider');
        const imageDotsContainer = card.querySelector('.new-arrival-image-dots');
        const colorDotsBelow = card.querySelector('.new-arrival-color-dots-below');
        
        const allImages = getAllImagesForSlider(product, colors);
        
        if (allImages.length > 1) {
            setupEnhancedSlider(card, sliderContainer, imageDotsContainer, allImages);
        } else {
            if (imageDotsContainer) imageDotsContainer.style.display = 'none';
        }
        
        if (colors && colors.length > 0 && colorDotsBelow) {
            setupColorDotsBelow(colorDotsBelow, colors, slug);
        } else if (colorDotsBelow) {
            colorDotsBelow.style.display = 'none';
        }
    }

    // Enhanced smooth slider with slide animation
    function setupEnhancedSlider(card, sliderContainer, dotsContainer, images) {
        sliderContainer.innerHTML = '';
        dotsContainer.innerHTML = '';
        dotsContainer.style.display = 'flex';
        
        let currentIndex = 0;
        let isTransitioning = false;
        let touchStartX = 0;
        let touchCurrentX = 0;
        let isDragging = false;
        
        // Create image elements
        images.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Image ${index + 1}`;
            img.className = 'new-arrival-card-image new-arrival-slider-image';
            img.setAttribute('data-index', index);
            img.loading = 'lazy';
            img.style.cssText = `
                position: absolute;
                top: 0;
                left: ${index === 0 ? '0' : '100%'};
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: left 0.45s cubic-bezier(0.25, 0.1, 0.25, 1);
                opacity: 1;
                display: block;
                color: transparent;
                will-change: left;
            `;
            img.onload = function() { handleImageLoad(this); };
            img.onerror = function() { handleImageError(this); };
            sliderContainer.appendChild(img);
            
            // Create tiny black dot
            const dot = document.createElement('span');
            dot.className = 'new-arrival-image-dot';
            dot.setAttribute('data-index', index);
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!isTransitioning && index !== currentIndex) {
                    slideToImage(card, currentIndex, index);
                    currentIndex = index;
                }
            });
            dotsContainer.appendChild(dot);
        });
        
        // Set initial active dot
        const firstDot = dotsContainer.querySelector('[data-index="0"]');
        if (firstDot) firstDot.classList.add('active');
        
        // Slide function with smooth animation
        function slideToImage(card, fromIndex, toIndex) {
            if (isTransitioning || fromIndex === toIndex) return;
            isTransitioning = true;
            
            const allImages = card.querySelectorAll('.new-arrival-slider-image');
            const allDots = card.querySelectorAll('.new-arrival-image-dot');
            
            const direction = toIndex > fromIndex ? 1 : -1;
            
            allImages.forEach((img, i) => {
                if (i === toIndex) {
                    img.style.left = '0';
                } else if (i === fromIndex) {
                    img.style.left = direction > 0 ? '-100%' : '100%';
                } else if (direction > 0 && i < toIndex) {
                    img.style.left = '-100%';
                } else if (direction < 0 && i > toIndex) {
                    img.style.left = '100%';
                } else {
                    img.style.left = direction > 0 ? '100%' : '-100%';
                }
            });
            
            // Update active dot
            allDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === toIndex);
            });
            
            // Reset transition lock
            setTimeout(() => {
                isTransitioning = false;
            }, 450);
        }
        
        // Touch/Swipe support with live drag
        card.addEventListener('touchstart', (e) => {
            if (isTransitioning) return;
            touchStartX = e.touches[0].clientX;
            touchCurrentX = touchStartX;
            isDragging = true;
            
            const allImages = card.querySelectorAll('.new-arrival-slider-image');
            allImages.forEach(img => {
                img.style.transition = 'none';
            });
        }, { passive: true });
        
        card.addEventListener('touchmove', (e) => {
            if (!isDragging || isTransitioning) return;
            touchCurrentX = e.touches[0].clientX;
            const diff = touchCurrentX - touchStartX;
            
            const allImages = card.querySelectorAll('.new-arrival-slider-image');
            const currentImg = allImages[currentIndex];
            if (currentImg) {
                currentImg.style.left = diff + 'px';
            }
            
            // Show next/prev image
            if (diff < -30 && currentIndex < images.length - 1) {
                const nextImg = allImages[currentIndex + 1];
                if (nextImg) {
                    nextImg.style.left = (100 + (diff / card.offsetWidth * 100)) + '%';
                }
            } else if (diff > 30 && currentIndex > 0) {
                const prevImg = allImages[currentIndex - 1];
                if (prevImg) {
                    prevImg.style.left = (-100 + (diff / card.offsetWidth * 100)) + '%';
                }
            }
        }, { passive: true });
        
        card.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = touchCurrentX;
            const diff = touchStartX - endX;
            const threshold = card.offsetWidth * 0.2;
            
            const allImages = card.querySelectorAll('.new-arrival-slider-image');
            allImages.forEach(img => {
                img.style.transition = 'left 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)';
            });
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentIndex < images.length - 1) {
                    slideToImage(card, currentIndex, currentIndex + 1);
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    slideToImage(card, currentIndex, currentIndex - 1);
                    currentIndex--;
                } else {
                    // Snap back
                    resetImagePositions(card, currentIndex);
                }
            } else {
                // Snap back
                resetImagePositions(card, currentIndex);
            }
        });
        
        // Mouse drag support for desktop
        let mouseDown = false;
        let mouseStartX = 0;
        let mouseCurrentX = 0;
        
        card.addEventListener('mousedown', (e) => {
            if (isTransitioning) return;
            mouseDown = true;
            mouseStartX = e.clientX;
            mouseCurrentX = mouseStartX;
            
            const allImages = card.querySelectorAll('.new-arrival-slider-image');
            allImages.forEach(img => {
                img.style.transition = 'none';
            });
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!mouseDown || isTransitioning) return;
            mouseCurrentX = e.clientX;
            const diff = mouseCurrentX - mouseStartX;
            
            const allImages = card.querySelectorAll('.new-arrival-slider-image');
            const currentImg = allImages[currentIndex];
            if (currentImg) {
                currentImg.style.left = diff + 'px';
            }
            
            if (diff < -30 && currentIndex < images.length - 1) {
                const nextImg = allImages[currentIndex + 1];
                if (nextImg) {
                    nextImg.style.left = (100 + (diff / card.offsetWidth * 100)) + '%';
                }
            } else if (diff > 30 && currentIndex > 0) {
                const prevImg = allImages[currentIndex - 1];
                if (prevImg) {
                    prevImg.style.left = (-100 + (diff / card.offsetWidth * 100)) + '%';
                }
            }
        });
        
        window.addEventListener('mouseup', (e) => {
            if (!mouseDown) return;
            mouseDown = false;
            
            const endX = mouseCurrentX;
            const diff = mouseStartX - endX;
            const threshold = card.offsetWidth * 0.2;
            
            const allImages = card.querySelectorAll('.new-arrival-slider-image');
            allImages.forEach(img => {
                img.style.transition = 'left 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)';
            });
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && currentIndex < images.length - 1) {
                    slideToImage(card, currentIndex, currentIndex + 1);
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    slideToImage(card, currentIndex, currentIndex - 1);
                    currentIndex--;
                } else {
                    resetImagePositions(card, currentIndex);
                }
            } else {
                resetImagePositions(card, currentIndex);
            }
        });
    }
    
    function resetImagePositions(card, currentIndex) {
        const allImages = card.querySelectorAll('.new-arrival-slider-image');
        allImages.forEach((img, i) => {
            if (i === currentIndex) {
                img.style.left = '0';
            } else if (i < currentIndex) {
                img.style.left = '-100%';
            } else {
                img.style.left = '100%';
            }
        });
    }

    // Setup color dots below title
    function setupColorDotsBelow(container, colors, slug) {
        if (!colors || colors.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = colors.map((color, index) => {
            const colorCode = color.color_code || '#ccc';
            const colorName = color.color_name || '';
            return `
                <span 
                    class="new-arrival-color-dot ${index === 0 ? 'active' : ''}"
                    style="background-color: ${colorCode};"
                    data-color-name="${colorName}"
                    data-color-code="${colorCode}"
                    title="${colorName}"
                ></span>
            `;
        }).join('');
        
        container.querySelectorAll('.new-arrival-color-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                window.location.href = `/product/${slug}`;
            });
        });
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
            <a href="${CONFIG.viewAllLink}" class="new-arrival-view-all">
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
    // INJECT STYLES
    // ============================================================
    function injectStyles() {
        const styleId = 'new-arrival-dynamic-styles';
        if (document.getElementById(styleId)) return;

        const styles = `
            <style id="${styleId}">
                .new-arrivals-grid-section {
                    padding: 32px 0;
                    max-width: 100%;
                    margin: 0 auto;
                    background: #ffffff;
                }

                @media (max-width: 767px) { .new-arrivals-grid-section { padding: 20px 0; } }
                @media (min-width: 768px) and (max-width: 1023px) { .new-arrivals-grid-section { padding: 28px 16px; } }
                @media (min-width: 1024px) { .new-arrivals-grid-section { padding: 40px 36px; max-width: 1400px; } }

                .new-arrival-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    padding: 0 8px;
                }

                @media (min-width: 768px) { .new-arrival-header { margin-bottom: 20px; padding: 0 2px; } }
                @media (min-width: 1024px) { .new-arrival-header { margin-bottom: 24px; } }

                .new-arrival-title {
                    font-family: ${JABIYEN_FONTS.families.heading};
                    font-weight: ${JABIYEN_FONTS.weights.heading.bold};
                    font-size: 20px;
                    color: #1d1d1f;
                    letter-spacing: -0.3px;
                }

                @media (min-width: 768px) { .new-arrival-title { font-size: 26px; } }
                @media (min-width: 1024px) { .new-arrival-title { font-size: 30px; } }

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

                .new-arrivals-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1px;
                    width: 100%;
                }

                @media (min-width: 768px) { .new-arrivals-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (min-width: 1024px) { .new-arrivals-grid { grid-template-columns: repeat(4, 1fr); } }

                .new-arrival-card {
                    position: relative;
                    background: #fff;
                    transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                    cursor: pointer;
                    overflow: hidden;
                }

                .new-arrival-card:active { transform: scale(0.98); transition: transform 0.1s ease; }

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

                .new-arrival-image-slider {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .new-arrival-slider-image {
                    position: absolute;
                    top: 0;
                    left: 100%;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: left 0.45s cubic-bezier(0.25, 0.1, 0.25, 1);
                    opacity: 1;
                    display: block;
                    color: transparent;
                    will-change: left;
                }

                .new-arrival-slider-image:first-child {
                    left: 0;
                }

                /* Tiny black dots - premium look */
                .new-arrival-image-dots {
                    position: absolute;
                    bottom: 6px;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    gap: 3px;
                    z-index: 4;
                    pointer-events: auto;
                    padding: 2px 0;
                }

                .new-arrival-image-dot {
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.35);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                }

                .new-arrival-image-dot.active {
                    background: #000000;
                    width: 16px;
                    border-radius: 2px;
                }

                .new-arrival-image-dot:hover {
                    background: rgba(0, 0, 0, 0.7);
                }

                @media (min-width: 768px) {
                    .new-arrival-image-dot {
                        width: 4px;
                        height: 4px;
                    }
                    .new-arrival-image-dot.active {
                        width: 18px;
                    }
                }

                /* Badge */
                .new-arrival-badge {
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    z-index: 5;
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

                @media (min-width: 768px) { .new-arrival-badge { top: 6px; left: 6px; padding: 2px 8px; font-size: 9px; } }
                .new-arrival-badge-sale { color: #d70015 !important; }

                .new-arrival-soldout-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(255, 255, 255, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 6;
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

                @media (min-width: 768px) { .new-arrival-soldout-overlay span { font-size: 10px; padding: 6px 18px; } }

                .new-arrival-card-body {
                    padding: 4px 6px 6px;
                    display: flex;
                    flex-direction: column;
                }

                @media (min-width: 768px) { .new-arrival-card-body { padding: 6px 8px 8px; } }

                .new-arrival-card-title {
                    font-family: ${JABIYEN_FONTS.families.body};
                    font-weight: ${JABIYEN_FONTS.weights.body.semibold};
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

                @media (min-width: 768px) { .new-arrival-card-title { font-size: 15px; line-height: 1.4; } }

                .new-arrival-color-dots-below {
                    display: flex;
                    gap: 4px;
                    justify-content: center;
                    margin-top: 6px;
                    flex-wrap: wrap;
                }

                .new-arrival-color-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 1.5px solid rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    display: block;
                    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
                }

                .new-arrival-color-dot:hover {
                    transform: scale(1.3);
                    border-color: rgba(0,0,0,0.3);
                }

                .new-arrival-color-dot.active {
                    border-color: #1d1d1f !important;
                    transform: scale(1.2);
                    box-shadow: 0 0 0 2px rgba(29,29,31,0.1);
                }

                @media (min-width: 768px) { .new-arrival-color-dot { width: 14px; height: 14px; } }

                .new-arrival-empty { text-align: center; padding: 60px 20px; max-width: 400px; margin: 0 auto; }
                .new-arrival-empty svg { margin: 0 auto 16px; opacity: 0.4; }
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

                .new-arrival-error { text-align: center; padding: 48px 20px; }
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
                .new-arrival-retry-btn:hover { background: #007aff; }

                .new-arrival-skeleton-card { pointer-events: none; }
                .skeleton-pulse {
                    background: linear-gradient(90deg, #e5e5ea 0%, #f0f0f5 40%, #e5e5ea 80%);
                    background-size: 800px 100%;
                    animation: skeletonShimmer 1.8s infinite linear;
                    border-radius: 0;
                }
                .skeleton-text { height: 13px; margin-bottom: 5px; }

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
        applyFontsVariables();
        injectStyles();
        
        console.log('[NewArrivals] Module initializing...');

        window.addEventListener('jayenware:dataLoaded', (event) => {
            const detail = event.detail || {};
            if (detail.products && Array.isArray(detail.products)) {
                const newArrivals = detail.products.filter(
                    p => p.is_new_arrival === true || p.is_new_arrival === 1
                );
                if (newArrivals.length > 0) renderNewArrivals(newArrivals);
            }
        });

        if (window.currentData?.products && Array.isArray(window.currentData.products)) {
            const newArrivals = window.currentData.products.filter(
                p => p.is_new_arrival === true || p.is_new_arrival === 1
            );
            if (newArrivals.length > 0) setTimeout(() => renderNewArrivals(newArrivals), 50);
        }

        console.log('[NewArrivals] Module initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
