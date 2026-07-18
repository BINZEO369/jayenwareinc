// ============================================
// HOT / TRENDING NOW SECTION
// Complete Client-Side Component
// Uses same API structure as New Arrivals
// ============================================

(function() {
    'use strict';

    // ============================================
    // JABIYEN FONTS CONFIGURATION
    // ============================================
    var JABIYEN_FONTS = {
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
        var root = document.documentElement;
        var vars = JABIYEN_FONTS.cssVariables;
        for (var key in vars) {
            if (vars.hasOwnProperty(key)) {
                root.style.setProperty(key, vars[key]);
            }
        }
    }

    // ============================================
    // API CONFIGURATION
    // ============================================
    var API_CONFIG = {
        baseURL: window.location.origin,
        endpoints: {
            trendingNow: '/api/products', // Uses same products endpoint with filtering
            products: '/api/products',
            productColors: '/api/product-colors',
            addToCart: '/api/cart/add',
            wishlist: '/api/wishlist'
        },
        timeout: 10000,
        retryAttempts: 2
    };

    // ============================================
    // SECTION CONFIGURATION
    // ============================================
    var CONFIG = {
        containerId: 'hot-trending-container',
        skeletonId: 'hot-trending-skeleton',
        sectionClass: 'hot-trending-grid-section',
        gridClass: 'hot-trending-grid',
        title: 'Hot / Trending Now',
        maxProducts: 8,
        cardAspectRatio: '4/5'
    };

    // ============================================
    // COLOR CACHE
    // ============================================
    var productColorsCache = {};

    // ============================================
    // DRAG / SWIPE GLOBALS
    // ============================================
    var globalMouseMoveHandler = null;
    var globalMouseUpHandler = null;
    var activeDragData = null;

    function ensureGlobalMouseHandlers() {
        if (globalMouseMoveHandler && globalMouseUpHandler) return;

        globalMouseMoveHandler = function(e) {
            if (!activeDragData) return;
            var d = activeDragData;
            if (d.transitioning) return;
            d.mcX = e.clientX;
            var diff = d.mcX - d.msX;
            var imgs = d.card.querySelectorAll('.hot-trending-slider-image');
            var cur = imgs[d.idx];
            if (cur) cur.style.left = diff + 'px';
            if (diff < -30 && d.idx < d.total - 1 && imgs[d.idx + 1]) {
                imgs[d.idx + 1].style.left = (100 + (diff / d.card.offsetWidth * 100)) + '%';
            } else if (diff > 30 && d.idx > 0 && imgs[d.idx - 1]) {
                imgs[d.idx - 1].style.left = (-100 + (diff / d.card.offsetWidth * 100)) + '%';
            }
        };

        globalMouseUpHandler = function() {
            if (!activeDragData) return;
            var d = activeDragData;
            activeDragData = null;
            d.md = false;
            var diff = d.msX - d.mcX;
            var th = d.card.offsetWidth * 0.2;
            var imgs = d.card.querySelectorAll('.hot-trending-slider-image');
            imgs.forEach(function(im) { im.style.transition = 'left 0.45s cubic-bezier(0.25,0.1,0.25,1)'; });
            if (Math.abs(diff) > th) {
                if (diff > 0 && d.idx < d.total - 1) d.slideTo(d.idx + 1);
                else if (diff < 0 && d.idx > 0) d.slideTo(d.idx - 1);
                else d.reset();
            } else {
                d.reset();
            }
        };

        window.addEventListener('mousemove', globalMouseMoveHandler);
        window.addEventListener('mouseup', globalMouseUpHandler);
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function getImageUrl(product) {
        if (product.img && product.img.trim() !== '') return product.img;
        if (product.image && product.image.trim() !== '') return product.image;
        if (product.image_url && product.image_url.trim() !== '') return product.image_url;
        if (product.images && product.images.trim() !== '') {
            var arr = product.images.split(',');
            if (arr[0] && arr[0].trim() !== '') return arr[0].trim();
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
            var wrapper = img.closest('.hot-trending-card-image-wrapper');
            if (wrapper) wrapper.style.background = '#f5f5f7';
        }
    }

    // Expose for inline onload/onerror if needed
    window.handleHotTrendingImageLoad = handleImageLoad;
    window.handleHotTrendingImageError = handleImageError;

    async function fetchProductColors(slug) {
        if (productColorsCache[slug]) return productColorsCache[slug];
        try {
            var res = await fetch(API_CONFIG.baseURL + API_CONFIG.endpoints.productColors + '?slug=' + encodeURIComponent(slug));
            if (!res.ok) return [];
            var data = await res.json();
            productColorsCache[slug] = data || [];
            return data || [];
        } catch (e) {
            return [];
        }
    }

    function getAllImagesForSlider(product, colors) {
        var images = [];
        var main = getImageUrl(product);
        if (main && main !== '/placeholder.png') images.push(main);
        if (colors) {
            colors.forEach(function(c) {
                if (c.color_image && c.color_image.trim() && images.indexOf(c.color_image) === -1) {
                    images.push(c.color_image);
                }
            });
        }
        return images;
    }

    // ============================================
    // CARD CREATION
    // ============================================

    function createProductCard(product) {
        var out = product.is_out_of_stock === true || 
                  product.is_out_of_stock === 1 || 
                  product.stock === 0 || 
                  product.stock === '0';
        var slug = getProductSlug(product);
        var img = getImageUrl(product);

        var card = document.createElement('div');
        card.className = 'hot-trending-card';
        card.setAttribute('data-product-id', product.id);
        card.setAttribute('data-product-slug', slug);

        var link = document.createElement('a');
        link.href = '/product/' + encodeURIComponent(slug);
        link.className = 'hot-trending-card-link';

        // Image wrapper
        var imageWrapper = document.createElement('div');
        imageWrapper.className = 'hot-trending-card-image-wrapper';

        // Image slider
        var slider = document.createElement('div');
        slider.className = 'hot-trending-image-slider';
        slider.setAttribute('data-slug', slug);

        var mainImg = document.createElement('img');
        mainImg.src = img;
        mainImg.alt = product.title || 'Product';
        mainImg.className = 'hot-trending-card-image hot-trending-slider-image active';
        mainImg.setAttribute('data-index', '0');
        mainImg.loading = 'lazy';
        mainImg.onload = function() { handleImageLoad(mainImg); };
        mainImg.onerror = function() { handleImageError(mainImg); };
        slider.appendChild(mainImg);

        imageWrapper.appendChild(slider);

        // Badge (Hot / Trending)
        if (!out) {
            var badgeText = '';
            if (product.is_hot === true || product.is_hot === 1 || 
                product.is_trending === true || product.is_trending === 1) {
                badgeText = 'Hot';
            } else if (product.is_on_sale === true || product.is_on_sale === 1) {
                badgeText = 'Sale';
            }
            if (badgeText) {
                var badgeSpan = document.createElement('span');
                badgeSpan.className = 'hot-trending-badge' + 
                    (badgeText === 'Sale' ? ' hot-trending-badge-sale' : ' hot-trending-badge-hot');
                badgeSpan.textContent = badgeText;
                imageWrapper.appendChild(badgeSpan);
            }
        }

        // Sold out overlay
        if (out) {
            var soldOut = document.createElement('div');
            soldOut.className = 'hot-trending-soldout-overlay';
            var soldOutSpan = document.createElement('span');
            soldOutSpan.textContent = 'Sold Out';
            soldOut.appendChild(soldOutSpan);
            imageWrapper.appendChild(soldOut);
        }

        // Image dots
        var dotsContainer = document.createElement('div');
        dotsContainer.className = 'hot-trending-image-dots';
        dotsContainer.setAttribute('data-slug', slug);
        dotsContainer.style.display = 'none';
        imageWrapper.appendChild(dotsContainer);

        link.appendChild(imageWrapper);

        // Card body
        var cardBody = document.createElement('div');
        cardBody.className = 'hot-trending-card-body';

        var titleEl = document.createElement('h3');
        titleEl.className = 'hot-trending-card-title';
        titleEl.textContent = product.title || 'Untitled';
        cardBody.appendChild(titleEl);

        // Color dots below title
        var colorDotsBelow = document.createElement('div');
        colorDotsBelow.className = 'hot-trending-color-dots-below';
        colorDotsBelow.setAttribute('data-slug', slug);
        cardBody.appendChild(colorDotsBelow);

        link.appendChild(cardBody);
        card.appendChild(link);

        // Fetch colors and setup
        fetchProductColors(slug).then(function(colors) {
            setupCard(card, product, colors, slug);
        });

        return card;
    }

    function setupCard(card, product, colors, slug) {
        var slider = card.querySelector('.hot-trending-image-slider');
        var dots = card.querySelector('.hot-trending-image-dots');
        var colorDots = card.querySelector('.hot-trending-color-dots-below');
        var all = getAllImagesForSlider(product, colors);

        if (all.length > 1) {
            setupSlider(card, slider, dots, all);
        } else if (dots) {
            dots.style.display = 'none';
        }

        if (colors && colors.length && colorDots) {
            setupColorDots(colorDots, colors, slug);
        } else if (colorDots) {
            colorDots.style.display = 'none';
        }
    }

    function setupSlider(card, slider, dotsContainer, images) {
        ensureGlobalMouseHandlers();

        slider.innerHTML = '';
        dotsContainer.innerHTML = '';
        dotsContainer.style.display = 'flex';

        var transitioning = false;

        var dragData = {
            card: card,
            idx: 0,
            total: images.length,
            transitioning: false,
            slideTo: null,
            reset: null,
            md: false,
            msX: 0,
            mcX: 0,
            tsX: 0,
            tcX: 0,
            dragging: false
        };

        function slideTo(to) {
            if (dragData.transitioning || to === dragData.idx) return;
            dragData.transitioning = true;
            var imgs = card.querySelectorAll('.hot-trending-slider-image');
            var dts = card.querySelectorAll('.hot-trending-image-dot');
            var dir = to > dragData.idx ? 1 : -1;
            imgs.forEach(function(im, i) {
                if (i === to) im.style.left = '0';
                else if (i === dragData.idx) im.style.left = dir > 0 ? '-100%' : '100%';
                else if (dir > 0 && i < to) im.style.left = '-100%';
                else if (dir < 0 && i > to) im.style.left = '100%';
                else im.style.left = dir > 0 ? '100%' : '-100%';
            });
            dts.forEach(function(d, i) { d.classList.toggle('active', i === to); });
            dragData.idx = to;
            setTimeout(function() { dragData.transitioning = false; }, 450);
        }

        function reset() {
            var imgs = card.querySelectorAll('.hot-trending-slider-image');
            imgs.forEach(function(im, i) {
                if (i === dragData.idx) im.style.left = '0';
                else if (i < dragData.idx) im.style.left = '-100%';
                else im.style.left = '100%';
            });
        }

        dragData.slideTo = slideTo;
        dragData.reset = reset;

        card._sliderDragData = dragData;

        images.forEach(function(src, i) {
            var img = document.createElement('img');
            img.src = src;
            img.alt = 'Image ' + (i + 1);
            img.className = 'hot-trending-card-image hot-trending-slider-image';
            img.setAttribute('data-index', i);
            img.loading = 'lazy';
            img.style.cssText = 'position:absolute;top:0;left:' + 
                (i === 0 ? '0' : '100%') + 
                ';width:100%;height:100%;object-fit:cover;transition:left 0.45s cubic-bezier(0.25,0.1,0.25,1);opacity:1;display:block;color:transparent;will-change:left;';
            img.onload = function() { handleImageLoad(this); };
            img.onerror = function() { handleImageError(this); };
            slider.appendChild(img);

            var dot = document.createElement('span');
            dot.className = 'hot-trending-image-dot';
            dot.setAttribute('data-index', i);
            (function(index) {
                dot.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (dragData.transitioning || index === dragData.idx) return;
                    slideTo(index);
                });
            })(i);
            dotsContainer.appendChild(dot);
        });

        var firstDot = dotsContainer.querySelector('[data-index="0"]');
        if (firstDot) firstDot.classList.add('active');

        // Touch events
        card.addEventListener('touchstart', function(e) {
            var d = card._sliderDragData;
            if (!d || d.transitioning) return;
            d.tsX = e.touches[0].clientX;
            d.tcX = d.tsX;
            d.dragging = true;
            card.querySelectorAll('.hot-trending-slider-image').forEach(function(im) { 
                im.style.transition = 'none'; 
            });
        }, { passive: true });

        card.addEventListener('touchmove', function(e) {
            var d = card._sliderDragData;
            if (!d || !d.dragging || d.transitioning) return;
            d.tcX = e.touches[0].clientX;
            var diff = d.tcX - d.tsX;
            var imgs = card.querySelectorAll('.hot-trending-slider-image');
            var cur = imgs[d.idx];
            if (cur) cur.style.left = diff + 'px';
            if (diff < -30 && d.idx < d.total - 1 && imgs[d.idx + 1]) {
                imgs[d.idx + 1].style.left = (100 + (diff / card.offsetWidth * 100)) + '%';
            } else if (diff > 30 && d.idx > 0 && imgs[d.idx - 1]) {
                imgs[d.idx - 1].style.left = (-100 + (diff / card.offsetWidth * 100)) + '%';
            }
        }, { passive: true });

        card.addEventListener('touchend', function() {
            var d = card._sliderDragData;
            if (!d || !d.dragging) return;
            d.dragging = false;
            var diff = d.tsX - d.tcX;
            var th = card.offsetWidth * 0.2;
            card.querySelectorAll('.hot-trending-slider-image').forEach(function(im) { 
                im.style.transition = 'left 0.45s cubic-bezier(0.25,0.1,0.25,1)'; 
            });
            if (Math.abs(diff) > th) {
                if (diff > 0 && d.idx < d.total - 1) slideTo(d.idx + 1);
                else if (diff < 0 && d.idx > 0) slideTo(d.idx - 1);
                else reset();
            } else {
                reset();
            }
        });

        // Mouse events
        card.addEventListener('mousedown', function(e) {
            var d = card._sliderDragData;
            if (!d || d.transitioning) return;
            if (activeDragData && activeDragData !== d) {
                activeDragData.md = false;
                activeDragData = null;
            }
            d.md = true;
            d.msX = e.clientX;
            d.mcX = d.msX;
            activeDragData = d;
            card.querySelectorAll('.hot-trending-slider-image').forEach(function(im) { 
                im.style.transition = 'none'; 
            });
        });
    }

    function setupColorDots(container, colors, slug) {
        if (!colors || !colors.length) {
            container.style.display = 'none';
            return;
        }
        container.innerHTML = '';
        colors.forEach(function(c) {
            var dot = document.createElement('span');
            dot.className = 'hot-trending-color-dot';
            dot.style.backgroundColor = c.color_code || '#ccc';
            if (c.color_name) dot.title = c.color_name;
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                window.location.href = '/product/' + encodeURIComponent(slug);
            });
            container.appendChild(dot);
        });
    }

    // ============================================
    // EMPTY STATE
    // ============================================

    function createEmptyState() {
        var d = document.createElement('div');
        d.className = 'hot-trending-empty';
        
        // Fire icon SVG
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '64');
        svg.setAttribute('height', '64');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', '#ccc');
        svg.setAttribute('stroke-width', '1.5');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 2C12 2 8 8 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 8 12 2 12 2Z');
        svg.appendChild(path);
        var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M12 16C14.2091 16 16 17.7909 16 20C16 21.1046 15.1046 22 14 22H10C8.89543 22 8 21.1046 8 20C8 17.7909 9.79086 16 12 16Z');
        svg.appendChild(path2);
        d.appendChild(svg);
        
        var p1 = document.createElement('p');
        p1.textContent = 'No trending products right now';
        d.appendChild(p1);
        
        var p2 = document.createElement('p');
        p2.className = 'hot-trending-empty-sub';
        p2.textContent = 'Hot picks coming soon — stay tuned';
        d.appendChild(p2);
        
        return d;
    }

    // ============================================
    // SKELETON CARD
    // ============================================

    function createSkeletonCard() {
        var d = document.createElement('div');
        d.className = 'hot-trending-card hot-trending-skeleton-card';
        
        var wrapper = document.createElement('div');
        wrapper.className = 'hot-trending-card-image-wrapper';
        var pulse = document.createElement('div');
        pulse.className = 'skeleton-pulse';
        pulse.style.cssText = 'width:100%;aspect-ratio:' + CONFIG.cardAspectRatio + ';';
        wrapper.appendChild(pulse);
        d.appendChild(wrapper);
        
        var body = document.createElement('div');
        body.className = 'hot-trending-card-body';
        
        var line1 = document.createElement('div');
        line1.className = 'skeleton-pulse skeleton-text';
        line1.style.width = '85%';
        body.appendChild(line1);
        
        var line2 = document.createElement('div');
        line2.className = 'skeleton-pulse skeleton-text';
        line2.style.width = '55%';
        body.appendChild(line2);
        
        d.appendChild(body);
        return d;
    }

    // ============================================
    // DATA FETCHING
    // ============================================

    async function fetchWithRetry(url, opts, retries) {
        opts = opts || {};
        retries = retries || API_CONFIG.retryAttempts;
        var ctrl = new AbortController();
        var tid = setTimeout(function() { ctrl.abort(); }, API_CONFIG.timeout);
        try {
            var res = await fetch(url, {
                signal: ctrl.signal,
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json' 
                }
            });
            clearTimeout(tid);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            var data = await res.json();
            if (data && data.data && Array.isArray(data.data)) return data.data;
            if (data && data.products && Array.isArray(data.products)) return data.products;
            if (Array.isArray(data)) return data;
            return [];
        } catch (e) {
            clearTimeout(tid);
            if (retries > 0 && e.name !== 'AbortError') {
                await new Promise(function(r) { setTimeout(r, 1000); });
                return fetchWithRetry(url, opts, retries - 1);
            }
            throw e;
        }
    }

    async function fetchTrendingProducts() {
        try {
            // Fetch all products and filter for hot/trending
            var allProducts = await fetchWithRetry(API_CONFIG.baseURL + API_CONFIG.endpoints.products);
            
            if (allProducts.length) {
                // Filter products that are hot or trending
                var trending = allProducts.filter(function(p) {
                    return p.is_hot === true || 
                           p.is_hot === 1 || 
                           p.is_hot === 'true' ||
                           p.is_trending === true || 
                           p.is_trending === 1 || 
                           p.is_trending === 'true';
                });
                
                // Sort by created_at (newest first) or popularity
                trending.sort(function(a, b) {
                    // Prioritize hot products
                    var aHot = (a.is_hot === true || a.is_hot === 1) ? 1 : 0;
                    var bHot = (b.is_hot === true || b.is_hot === 1) ? 1 : 0;
                    if (aHot !== bHot) return bHot - aHot;
                    
                    // Then sort by date
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                });
                
                return trending.slice(0, CONFIG.maxProducts);
            }
            return [];
        } catch (e) {
            console.error('Failed to fetch trending products:', e);
            return [];
        }
    }

    // ============================================
    // SECTION RENDERING
    // ============================================

    function createSectionHeader() {
        var h = document.createElement('div');
        h.className = 'hot-trending-header';
        
        // Fire emoji + title
        var titleWrapper = document.createElement('div');
        titleWrapper.className = 'hot-trending-title-wrapper';
        
        var fireIcon = document.createElement('span');
        fireIcon.className = 'hot-trending-fire-icon';
        fireIcon.textContent = '🔥';
        titleWrapper.appendChild(fireIcon);
        
        var title = document.createElement('h2');
        title.className = 'hot-trending-title';
        title.textContent = CONFIG.title;
        titleWrapper.appendChild(title);
        
        h.appendChild(titleWrapper);
        return h;
    }

    function createGridContainer() {
        var g = document.createElement('div');
        g.className = CONFIG.gridClass;
        return g;
    }

    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(en) {
                if (en.isIntersecting) {
                    var img = en.target;
                    if (img.tagName === 'IMG' && img.src && img.src !== window.location.href) {
                        img.style.opacity = '1';
                        obs.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0.01 });
        document.querySelectorAll('.hot-trending-card-image').forEach(function(img) { 
            obs.observe(img); 
        });
    }

    async function renderHotTrending(products) {
        var container = document.getElementById(CONFIG.containerId);
        var skeleton = document.getElementById(CONFIG.skeletonId);
        
        if (!container) return;
        if (skeleton) skeleton.style.display = 'block';

        activeDragData = null;

        try {
            var trendingProducts;
            if (Array.isArray(products) && products.length > 0) {
                // Filter from provided products
                trendingProducts = products.filter(function(p) {
                    return p.is_hot === true || 
                           p.is_hot === 1 || 
                           p.is_hot === 'true' ||
                           p.is_trending === true || 
                           p.is_trending === 1 || 
                           p.is_trending === 'true';
                });
            } else {
                trendingProducts = await fetchTrendingProducts();
            }

            container.innerHTML = '';
            
            var sec = document.createElement('section');
            sec.className = CONFIG.sectionClass;
            sec.appendChild(createSectionHeader());
            
            var grid = createGridContainer();
            
            if (trendingProducts && trendingProducts.length) {
                trendingProducts.slice(0, CONFIG.maxProducts).forEach(function(p) {
                    grid.appendChild(createProductCard(p));
                });
            } else {
                sec.classList.add('hot-trending-empty-section');
                grid.appendChild(createEmptyState());
            }
            
            sec.appendChild(grid);
            container.appendChild(sec);
            
            setTimeout(initLazyLoading, 100);
        } catch (e) {
            console.error('Failed to render hot/trending section:', e);
            container.innerHTML = '';
            
            var errDiv = document.createElement('div');
            errDiv.className = 'hot-trending-error';
            
            var errP = document.createElement('p');
            errP.textContent = 'Unable to load trending products';
            errDiv.appendChild(errP);
            
            var retryBtn = document.createElement('button');
            retryBtn.className = 'hot-trending-retry-btn';
            retryBtn.textContent = 'Try Again';
            retryBtn.onclick = function() { window.renderHotTrending(); };
            errDiv.appendChild(retryBtn);
            
            container.appendChild(errDiv);
        } finally {
            if (skeleton) skeleton.style.display = 'none';
        }
    }

    // ============================================
    // GLOBAL ACCESS
    // ============================================
    window.renderHotTrending = renderHotTrending;

    // ============================================
    // STYLES INJECTION
    // ============================================

    function injectStyles() {
        var id = 'hot-trending-dynamic-styles';
        if (document.getElementById(id)) return;
        
        var style = document.createElement('style');
        style.id = id;
        style.textContent = 
            // Section
            '.hot-trending-grid-section {' +
                'padding: 32px 0;' +
                'max-width: 100%;' +
                'margin: 0 auto;' +
                'background: #fff;' +
            '}' +
            '@media (max-width: 767px) {' +
                '.hot-trending-grid-section { padding: 20px 0; }' +
            '}' +
            '@media (min-width: 768px) and (max-width: 1023px) {' +
                '.hot-trending-grid-section { padding: 28px 16px; }' +
            '}' +
            '@media (min-width: 1024px) {' +
                '.hot-trending-grid-section { padding: 40px 36px; max-width: 1400px; }' +
            '}' +
            
            // Header
            '.hot-trending-header {' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: center;' +
                'margin-bottom: 20px;' +
                'padding: 0 8px;' +
            '}' +
            '@media (min-width: 768px) {' +
                '.hot-trending-header { margin-bottom: 24px; }' +
            '}' +
            '@media (min-width: 1024px) {' +
                '.hot-trending-header { margin-bottom: 28px; }' +
            '}' +
            
            // Title wrapper
            '.hot-trending-title-wrapper {' +
                'display: flex;' +
                'align-items: center;' +
                'gap: 8px;' +
            '}' +
            
            // Fire icon
            '.hot-trending-fire-icon {' +
                'font-size: 22px;' +
                'animation: hotTrendingPulse 2s ease-in-out infinite;' +
            '}' +
            '@media (min-width: 768px) {' +
                '.hot-trending-fire-icon { font-size: 28px; }' +
            '}' +
            '@media (min-width: 1024px) {' +
                '.hot-trending-fire-icon { font-size: 32px; }' +
            '}' +
            
            // Title
            '.hot-trending-title {' +
                'font-family: ' + JABIYEN_FONTS.families.heading + ';' +
                'font-weight: ' + JABIYEN_FONTS.weights.heading.bold + ';' +
                'font-size: 22px;' +
                'color: #1d1d1f;' +
                'letter-spacing: -0.3px;' +
                'text-align: center;' +
                'margin: 0;' +
            '}' +
            '@media (min-width: 768px) {' +
                '.hot-trending-title { font-size: 28px; }' +
            '}' +
            '@media (min-width: 1024px) {' +
                '.hot-trending-title { font-size: 32px; }' +
            '}' +
            
            // Grid
            '.hot-trending-grid {' +
                'display: grid;' +
                'grid-template-columns: repeat(2, 1fr);' +
                'gap: 1px;' +
                'width: 100%;' +
            '}' +
            '@media (min-width: 768px) {' +
                '.hot-trending-grid { grid-template-columns: repeat(3, 1fr); }' +
            '}' +
            '@media (min-width: 1024px) {' +
                '.hot-trending-grid { grid-template-columns: repeat(4, 1fr); }' +
            '}' +
            
            // Card
            '.hot-trending-card {' +
                'position: relative;' +
                'background: #fff;' +
                'transition: transform 0.3s;' +
                'cursor: pointer;' +
                'overflow: hidden;' +
            '}' +
            '.hot-trending-card:active { transform: scale(0.98); }' +
            '@media (hover: hover) {' +
                '.hot-trending-card:hover { transform: translateY(-2px); z-index: 2; box-shadow: 0 8px 25px rgba(0,0,0,0.12); }' +
            '}' +
            
            // Card link
            '.hot-trending-card-link {' +
                'text-decoration: none;' +
                'color: inherit;' +
                'display: flex;' +
                'flex-direction: column;' +
                'height: 100%;' +
            '}' +
            
            // Image wrapper
            '.hot-trending-card-image-wrapper {' +
                'position: relative;' +
                'aspect-ratio: 4/5;' +
                'background: #f5f5f7;' +
                'overflow: hidden;' +
                'margin-bottom: 6px;' +
                'width: 100%;' +
            '}' +
            
            // Image slider
            '.hot-trending-image-slider {' +
                'position: relative;' +
                'width: 100%;' +
                'height: 100%;' +
                'overflow: hidden;' +
            '}' +
            
            // Slider images
            '.hot-trending-slider-image {' +
                'position: absolute;' +
                'top: 0;' +
                'left: 100%;' +
                'width: 100%;' +
                'height: 100%;' +
                'object-fit: cover;' +
                'transition: left 0.45s cubic-bezier(0.25,0.1,0.25,1);' +
                'opacity: 1;' +
                'display: block;' +
                'color: transparent;' +
                'will-change: left;' +
            '}' +
            '.hot-trending-slider-image:first-child { left: 0; }' +
            
            // Image dots
            '.hot-trending-image-dots {' +
                'position: absolute;' +
                'bottom: 10px;' +
                'left: 50%;' +
                'transform: translateX(-50%);' +
                'display: flex;' +
                'gap: 6px;' +
                'z-index: 4;' +
                'pointer-events: auto;' +
                'padding: 4px 8px;' +
                'background: transparent;' +
            '}' +
            '.hot-trending-image-dot {' +
                'width: 6px;' +
                'height: 6px;' +
                'border-radius: 50%;' +
                'background: rgba(255,255,255,0.55);' +
                'cursor: pointer;' +
                'transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);' +
                'flex-shrink: 0;' +
                'box-shadow: 0 1px 2px rgba(0,0,0,0.15);' +
                'backdrop-filter: blur(4px);' +
                '-webkit-backdrop-filter: blur(4px);' +
            '}' +
            '.hot-trending-image-dot.active {' +
                'background: #ffffff;' +
                'width: 8px;' +
                'height: 8px;' +
                'box-shadow: 0 1px 4px rgba(0,0,0,0.25);' +
            '}' +
            '.hot-trending-image-dot:hover {' +
                'background: rgba(255,255,255,0.85);' +
                'transform: scale(1.2);' +
            '}' +
            
            // Badge
            '.hot-trending-badge {' +
                'position: absolute;' +
                'top: 4px;' +
                'left: 4px;' +
                'z-index: 5;' +
                'padding: 2px 7px;' +
                'font-family: ' + JABIYEN_FONTS.families.subtitle + ';' +
                'font-weight: ' + JABIYEN_FONTS.weights.subtitle.semibold + ';' +
                'font-size: 8px;' +
                'text-transform: uppercase;' +
                'background: #fff;' +
                'color: #1d1d1f;' +
                'letter-spacing: 0.5px;' +
                'border-radius: 1px;' +
                'pointer-events: none;' +
                'box-shadow: 0 1px 3px rgba(0,0,0,0.08);' +
            '}' +
            '@media (min-width: 768px) {' +
                '.hot-trending-badge { top: 6px; left: 6px; padding: 2px 8px; font-size: 9px; }' +
            '}' +
            '.hot-trending-badge-sale { color: #d70015 !important; }' +
            '.hot-trending-badge-hot {' +
                'background: #ff3b30;' +
                'color: #fff !important;' +
            '}' +
            
            // Sold out overlay
            '.hot-trending-soldout-overlay {' +
                'position: absolute;' +
                'inset: 0;' +
                'background: rgba(255,255,255,0.7);' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: center;' +
                'z-index: 6;' +
                'pointer-events: none;' +
            '}' +
            '.hot-trending-soldout-overlay span {' +
                'background: #1d1d1f;' +
                'color: #fff;' +
                'font-family: ' + JABIYEN_FONTS.families.body + ';' +
                'font-weight: ' + JABIYEN_FONTS.weights.body.bold + ';' +
                'font-size: 9px;' +
                'text-transform: uppercase;' +
                'padding: 5px 14px;' +
                'letter-spacing: 1px;' +
                'border-radius: 1px;' +
            '}' +
            '@media (min-width: 768px) {' +
                '.hot-trending-soldout-overlay span { font-size: 10px; padding: 6px 18px; }' +
            '}' +
            
            // Card body
            '.hot-trending-card-body {' +
                'padding: 4px 6px 6px;' +
                'display: flex;' +
                'flex-direction: column;' +
            '}' +
            '@media (min-width: 768px) {' +
                '.hot-trending-card-body { padding: 6px 8px 8px; }' +
            '}' +
            
            // Card title
            '.hot-trending-card-title {' +
                'font-family: ' + JABIYEN_FONTS.families.body + ';' +
                'font-weight: ' + JABIYEN_FONTS.weights.body.semibold + ';' +
                'font-size: 13px;' +
                'color: #1d1d1f;' +
                'line-height: 1.35;' +
                'display: -webkit-box;' +
                '-webkit-line-clamp: 2;' +
                '-webkit-box-orient: vertical;' +
                'overflow: hidden;' +
                'margin: 0;' +
                'text-align: center;' +
            '}' +
            '@media (min-width: 768px) {' +
                '.hot-trending-card-title { font-size: 15px; line-height: 1.4; }' +
            '}' +
            
            // Color dots below
            '.hot-trending-color-dots-below {' +
                'display: flex;' +
                'gap: 5px;' +
                'justify-content: center;' +
                'margin-top: 6px;' +
                'flex-wrap: wrap;' +
            '}' +
            '.hot-trending-color-dot {' +
                'width: 11px;' +
                'height: 11px;' +
                'border-radius: 50%;' +
                'cursor: pointer;' +
                'border: 1px solid rgba(0,0,0,0.08);' +
                'flex-shrink: 0;' +
                'display: block;' +
            '}' +
            '@media (min-width: 768px) {' +
                '.hot-trending-color-dot { width: 13px; height: 13px; }' +
            '}' +
            
            // Empty state
            '.hot-trending-empty {' +
                'text-align: center;' +
                'padding: 60px 20px;' +
                'max-width: 400px;' +
                'margin: 0 auto;' +
            '}' +
            '.hot-trending-empty svg {' +
                'margin: 0 auto 16px;' +
                'opacity: 0.4;' +
            '}' +
            '.hot-trending-empty p {' +
                'font-family: ' + JABIYEN_FONTS.families.body + ';' +
                'font-weight: ' + JABIYEN_FONTS.weights.body.medium + ';' +
                'font-size: 15px;' +
                'color: #86868b;' +
                'margin: 0;' +
            '}' +
            '.hot-trending-empty-sub {' +
                'font-family: ' + JABIYEN_FONTS.families.body + ';' +
                'font-weight: ' + JABIYEN_FONTS.weights.body.regular + ';' +
                'font-size: 12px !important;' +
                'color: #b0b0b5 !important;' +
                'margin-top: 6px !important;' +
            '}' +
            
            // Error state
            '.hot-trending-error {' +
                'text-align: center;' +
                'padding: 48px 20px;' +
            '}' +
            '.hot-trending-error p {' +
                'font-family: ' + JABIYEN_FONTS.families.body + ';' +
                'font-weight: ' + JABIYEN_FONTS.weights.body.regular + ';' +
                'font-size: 14px;' +
                'color: #86868b;' +
                'margin-bottom: 16px;' +
            '}' +
            '.hot-trending-retry-btn {' +
                'padding: 10px 24px;' +
                'background: #ff3b30;' +
                'color: #fff;' +
                'border: none;' +
                'border-radius: 50px;' +
                'font-family: ' + JABIYEN_FONTS.families.body + ';' +
                'font-weight: ' + JABIYEN_FONTS.weights.body.semibold + ';' +
                'font-size: 12px;' +
                'cursor: pointer;' +
                'transition: background 0.2s;' +
            '}' +
            '.hot-trending-retry-btn:hover { background: #d63029; }' +
            
            // Skeleton
            '.hot-trending-skeleton-card { pointer-events: none; }' +
            '.skeleton-pulse {' +
                'background: linear-gradient(90deg, #e5e5ea 0%, #f0f0f5 40%, #e5e5ea 80%);' +
                'background-size: 800px 100%;' +
                'animation: skeletonShimmer 1.8s infinite linear;' +
                'border-radius: 0;' +
            '}' +
            '.skeleton-text { height: 13px; margin-bottom: 5px; }' +
            
            // Animations
            '@keyframes hotTrendingPulse {' +
                '0%, 100% { transform: scale(1); }' +
                '50% { transform: scale(1.2); }' +
            '}' +
            '@keyframes skeletonShimmer {' +
                '0% { background-position: -468px 0; }' +
                '100% { background-position: 468px 0; }' +
            '}';
        
        document.head.appendChild(style);
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        applyFontsVariables();
        injectStyles();
        ensureGlobalMouseHandlers();
        
        // Listen for data loaded events
        window.addEventListener('jayenware:dataLoaded', function(e) {
            var detail = e.detail || {};
            if (detail.products && Array.isArray(detail.products)) {
                var trending = detail.products.filter(function(p) {
                    return p.is_hot === true || 
                           p.is_hot === 1 || 
                           p.is_trending === true || 
                           p.is_trending === 1;
                });
                if (trending.length) renderHotTrending(trending);
            }
        });
        
        // If data already loaded on page
        if (window.currentData && window.currentData.products && Array.isArray(window.currentData.products)) {
            var trending = window.currentData.products.filter(function(p) {
                return p.is_hot === true || 
                       p.is_hot === 1 || 
                       p.is_trending === true || 
                       p.is_trending === 1;
            });
            if (trending.length) {
                setTimeout(function() { renderHotTrending(trending); }, 50);
            }
        }
    }

    // ============================================
    // START
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
