// ============================================
// HOT / TRENDING NOW SECTION
// Complete Client-Side Component
// Fixed Container IDs & Function Names
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
            products: '/api/products',
            productColors: '/api/product-colors'
        },
        timeout: 10000,
        retryAttempts: 2
    };

    // ============================================
    // SECTION CONFIGURATION - FIXED IDs
    // ============================================
    var CONFIG = {
        containerId: 'trending-now-container',      // ✅ matches index.html
        skeletonId: 'trending-now-skeleton',         // ✅ matches index.html
        sectionClass: 'trending-now-grid-section',
        gridClass: 'trending-now-grid',
        title: 'Trending Now',
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
            var imgs = d.card.querySelectorAll('.trending-now-slider-image');
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
            var imgs = d.card.querySelectorAll('.trending-now-slider-image');
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
            var wrapper = img.closest('.trending-now-card-image-wrapper');
            if (wrapper) wrapper.style.background = '#f5f5f7';
        }
    }

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
        card.className = 'trending-now-card';
        card.setAttribute('data-product-id', product.id);
        card.setAttribute('data-product-slug', slug);

        var link = document.createElement('a');
        link.href = '/product/' + encodeURIComponent(slug);
        link.className = 'trending-now-card-link';

        var imageWrapper = document.createElement('div');
        imageWrapper.className = 'trending-now-card-image-wrapper';

        var slider = document.createElement('div');
        slider.className = 'trending-now-image-slider';
        slider.setAttribute('data-slug', slug);

        var mainImg = document.createElement('img');
        mainImg.src = img;
        mainImg.alt = product.title || 'Product';
        mainImg.className = 'trending-now-card-image trending-now-slider-image active';
        mainImg.setAttribute('data-index', '0');
        mainImg.loading = 'lazy';
        mainImg.onload = function() { handleImageLoad(mainImg); };
        mainImg.onerror = function() { handleImageError(mainImg); };
        slider.appendChild(mainImg);

        imageWrapper.appendChild(slider);

        // Badge
        if (!out) {
            var badgeText = '';
            if (product.is_hot === true || product.is_hot === 1) badgeText = 'Trending';
            else if (product.is_on_sale === true || product.is_on_sale === 1) badgeText = 'Sale';
            
            if (badgeText) {
                var badgeSpan = document.createElement('span');
                badgeSpan.className = 'trending-now-badge' + (badgeText === 'Sale' ? ' trending-now-badge-sale' : '');
                badgeSpan.textContent = badgeText;
                imageWrapper.appendChild(badgeSpan);
            }
        }

        // Sold out overlay
        if (out) {
            var soldOut = document.createElement('div');
            soldOut.className = 'trending-now-soldout-overlay';
            var soldOutSpan = document.createElement('span');
            soldOutSpan.textContent = 'Sold Out';
            soldOut.appendChild(soldOutSpan);
            imageWrapper.appendChild(soldOut);
        }

        // Image dots
        var dotsContainer = document.createElement('div');
        dotsContainer.className = 'trending-now-image-dots';
        dotsContainer.setAttribute('data-slug', slug);
        dotsContainer.style.display = 'none';
        imageWrapper.appendChild(dotsContainer);

        link.appendChild(imageWrapper);

        // Card body
        var cardBody = document.createElement('div');
        cardBody.className = 'trending-now-card-body';

        var titleEl = document.createElement('h3');
        titleEl.className = 'trending-now-card-title';
        titleEl.textContent = product.title || 'Untitled';
        cardBody.appendChild(titleEl);

        // Color dots below title
        var colorDotsBelow = document.createElement('div');
        colorDotsBelow.className = 'trending-now-color-dots-below';
        colorDotsBelow.setAttribute('data-slug', slug);
        cardBody.appendChild(colorDotsBelow);

        link.appendChild(cardBody);
        card.appendChild(link);

        fetchProductColors(slug).then(function(colors) {
            setupCard(card, product, colors, slug);
        });

        return card;
    }

    function setupCard(card, product, colors, slug) {
        var slider = card.querySelector('.trending-now-image-slider');
        var dots = card.querySelector('.trending-now-image-dots');
        var colorDots = card.querySelector('.trending-now-color-dots-below');
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

        var dragData = {
            card: card,
            idx: 0,
            total: images.length,
            transitioning: false,
            slideTo: null,
            reset: null,
            md: false,
            msX: 0,
            mcX: 0
        };

        function slideTo(to) {
            if (dragData.transitioning || to === dragData.idx) return;
            dragData.transitioning = true;
            var imgs = card.querySelectorAll('.trending-now-slider-image');
            var dts = card.querySelectorAll('.trending-now-image-dot');
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
            var imgs = card.querySelectorAll('.trending-now-slider-image');
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
            img.className = 'trending-now-card-image trending-now-slider-image';
            img.setAttribute('data-index', i);
            img.loading = 'lazy';
            img.style.cssText = 'position:absolute;top:0;left:' + (i === 0 ? '0' : '100%') + ';width:100%;height:100%;object-fit:cover;transition:left 0.45s cubic-bezier(0.25,0.1,0.25,1);opacity:1;display:block;color:transparent;will-change:left;';
            img.onload = function() { handleImageLoad(this); };
            img.onerror = function() { handleImageError(this); };
            slider.appendChild(img);

            var dot = document.createElement('span');
            dot.className = 'trending-now-image-dot';
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
            d.dragging = true;
            card.querySelectorAll('.trending-now-slider-image').forEach(function(im) { im.style.transition = 'none'; });
        }, { passive: true });

        card.addEventListener('touchmove', function(e) {
            var d = card._sliderDragData;
            if (!d || !d.dragging || d.transitioning) return;
            var diff = e.touches[0].clientX - d.tsX;
            var imgs = card.querySelectorAll('.trending-now-slider-image');
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
            var diff = d.tsX - (d.mcX || d.tsX);
            var th = card.offsetWidth * 0.2;
            card.querySelectorAll('.trending-now-slider-image').forEach(function(im) { im.style.transition = 'left 0.45s cubic-bezier(0.25,0.1,0.25,1)'; });
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
            card.querySelectorAll('.trending-now-slider-image').forEach(function(im) { im.style.transition = 'none'; });
        });
    }

    function setupColorDots(container, colors, slug) {
        if (!colors || !colors.length) { container.style.display = 'none'; return; }
        container.innerHTML = '';
        colors.forEach(function(c) {
            var dot = document.createElement('span');
            dot.className = 'trending-now-color-dot';
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
        d.className = 'trending-now-empty';
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '64');
        svg.setAttribute('height', '64');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', '#ccc');
        svg.setAttribute('stroke-width', '1.5');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M13 2L3 14h9l-1 8 10-12h-9l1-8z');
        svg.appendChild(path);
        d.appendChild(svg);
        var p1 = document.createElement('p');
        p1.textContent = 'No trending products right now';
        d.appendChild(p1);
        var p2 = document.createElement('p');
        p2.className = 'trending-now-empty-sub';
        p2.textContent = 'Hot picks coming soon — stay tuned';
        d.appendChild(p2);
        return d;
    }

    // ============================================
    // DATA FETCHING
    // ============================================

    async function fetchWithRetry(url, retries) {
        retries = retries || API_CONFIG.retryAttempts;
        var ctrl = new AbortController();
        var tid = setTimeout(function() { ctrl.abort(); }, API_CONFIG.timeout);
        try {
            var res = await fetch(url, {
                signal: ctrl.signal,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
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
                return fetchWithRetry(url, retries - 1);
            }
            throw e;
        }
    }

    async function fetchTrendingProducts() {
        try {
            var allProducts = await fetchWithRetry(API_CONFIG.baseURL + API_CONFIG.endpoints.products);
            if (allProducts.length) {
                var trending = allProducts.filter(function(p) {
                    return p.is_hot === true || p.is_hot === 1 || p.is_hot === 'true';
                });
                trending.sort(function(a, b) {
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
        h.className = 'trending-now-header';
        var title = document.createElement('h2');
        title.className = 'trending-now-title';
        title.textContent = CONFIG.title;
        h.appendChild(title);
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
        document.querySelectorAll('.trending-now-card-image').forEach(function(img) { obs.observe(img); });
    }

    // ✅ MAIN FUNCTION - Named renderTrendingNow to match index.html
    async function renderTrendingNow(products) {
        var container = document.getElementById(CONFIG.containerId);
        var skeleton = document.getElementById(CONFIG.skeletonId);
        
        if (!container) {
            console.warn('[TrendingNow] Container #' + CONFIG.containerId + ' not found');
            return;
        }
        
        if (skeleton) skeleton.style.display = 'block';

        activeDragData = null;

        try {
            var trendingProducts;
            if (Array.isArray(products) && products.length > 0) {
                trendingProducts = products.filter(function(p) {
                    return p.is_hot === true || p.is_hot === 1 || p.is_hot === 'true';
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
                sec.classList.add('trending-now-empty-section');
                grid.appendChild(createEmptyState());
            }
            
            sec.appendChild(grid);
            container.appendChild(sec);
            setTimeout(initLazyLoading, 100);
        } catch (e) {
            console.error('[TrendingNow] Failed to render:', e);
            container.innerHTML = '';
            var errDiv = document.createElement('div');
            errDiv.className = 'trending-now-error';
            var errP = document.createElement('p');
            errP.textContent = 'Unable to load trending products';
            errDiv.appendChild(errP);
            var retryBtn = document.createElement('button');
            retryBtn.className = 'trending-now-retry-btn';
            retryBtn.textContent = 'Try Again';
            retryBtn.onclick = function() { renderTrendingNow(); };
            errDiv.appendChild(retryBtn);
            container.appendChild(errDiv);
        } finally {
            if (skeleton) skeleton.style.display = 'none';
        }
    }

    // ✅ Expose as renderTrendingNow (matches index.html call)
    window.renderTrendingNow = renderTrendingNow;

    // ============================================
    // STYLES INJECTION
    // ============================================

    function injectStyles() {
        var id = 'trending-now-dynamic-styles';
        if (document.getElementById(id)) return;
        
        var style = document.createElement('style');
        style.id = id;
        style.textContent = 
            '.trending-now-grid-section { padding: 32px 0; max-width: 100%; margin: 0 auto; background: #fff; }' +
            '@media (max-width: 767px) { .trending-now-grid-section { padding: 20px 0; } }' +
            '@media (min-width: 768px) and (max-width: 1023px) { .trending-now-grid-section { padding: 28px 16px; } }' +
            '@media (min-width: 1024px) { .trending-now-grid-section { padding: 40px 36px; max-width: 1400px; } }' +
            '.trending-now-header { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; padding: 0 8px; }' +
            '@media (min-width: 768px) { .trending-now-header { margin-bottom: 24px; } }' +
            '@media (min-width: 1024px) { .trending-now-header { margin-bottom: 28px; } }' +
            '.trending-now-title { font-family: ' + JABIYEN_FONTS.families.heading + '; font-weight: ' + JABIYEN_FONTS.weights.heading.bold + '; font-size: 22px; color: #1d1d1f; letter-spacing: -0.3px; text-align: center; }' +
            '@media (min-width: 768px) { .trending-now-title { font-size: 28px; } }' +
            '@media (min-width: 1024px) { .trending-now-title { font-size: 32px; } }' +
            '.trending-now-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; width: 100%; }' +
            '@media (min-width: 768px) { .trending-now-grid { grid-template-columns: repeat(3, 1fr); } }' +
            '@media (min-width: 1024px) { .trending-now-grid { grid-template-columns: repeat(4, 1fr); } }' +
            '.trending-now-card { position: relative; background: #fff; transition: transform 0.3s; cursor: pointer; overflow: hidden; }' +
            '.trending-now-card:active { transform: scale(0.98); }' +
            '@media (hover: hover) { .trending-now-card:hover { transform: translateY(-2px); z-index: 2; box-shadow: 0 8px 25px rgba(0,0,0,0.12); } }' +
            '.trending-now-card-link { text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%; }' +
            '.trending-now-card-image-wrapper { position: relative; aspect-ratio: 4/5; background: #f5f5f7; overflow: hidden; margin-bottom: 6px; width: 100%; }' +
            '.trending-now-image-slider { position: relative; width: 100%; height: 100%; overflow: hidden; }' +
            '.trending-now-slider-image { position: absolute; top: 0; left: 100%; width: 100%; height: 100%; object-fit: cover; transition: left 0.45s cubic-bezier(0.25,0.1,0.25,1); opacity: 1; display: block; color: transparent; will-change: left; }' +
            '.trending-now-slider-image:first-child { left: 0; }' +
            '.trending-now-image-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 4; pointer-events: auto; padding: 4px 8px; background: transparent; }' +
            '.trending-now-image-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.55); cursor: pointer; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.15); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }' +
            '.trending-now-image-dot.active { background: #ffffff; width: 8px; height: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }' +
            '.trending-now-image-dot:hover { background: rgba(255,255,255,0.85); transform: scale(1.2); }' +
            '.trending-now-badge { position: absolute; top: 4px; left: 4px; z-index: 5; padding: 2px 7px; font-family: ' + JABIYEN_FONTS.families.subtitle + '; font-weight: ' + JABIYEN_FONTS.weights.subtitle.semibold + '; font-size: 8px; text-transform: uppercase; background: #007aff; color: #fff; letter-spacing: 0.5px; border-radius: 1px; pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }' +
            '@media (min-width: 768px) { .trending-now-badge { top: 6px; left: 6px; padding: 2px 8px; font-size: 9px; } }' +
            '.trending-now-badge-sale { background: #d70015 !important; }' +
            '.trending-now-soldout-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 6; pointer-events: none; }' +
            '.trending-now-soldout-overlay span { background: #1d1d1f; color: #fff; font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.bold + '; font-size: 9px; text-transform: uppercase; padding: 5px 14px; letter-spacing: 1px; border-radius: 1px; }' +
            '@media (min-width: 768px) { .trending-now-soldout-overlay span { font-size: 10px; padding: 6px 18px; } }' +
            '.trending-now-card-body { padding: 4px 6px 6px; display: flex; flex-direction: column; }' +
            '@media (min-width: 768px) { .trending-now-card-body { padding: 6px 8px 8px; } }' +
            '.trending-now-card-title { font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.semibold + '; font-size: 13px; color: #1d1d1f; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; text-align: center; }' +
            '@media (min-width: 768px) { .trending-now-card-title { font-size: 15px; line-height: 1.4; } }' +
            '.trending-now-color-dots-below { display: flex; gap: 5px; justify-content: center; margin-top: 6px; flex-wrap: wrap; }' +
            '.trending-now-color-dot { width: 11px; height: 11px; border-radius: 50%; cursor: pointer; border: 1px solid rgba(0,0,0,0.08); flex-shrink: 0; display: block; }' +
            '@media (min-width: 768px) { .trending-now-color-dot { width: 13px; height: 13px; } }' +
            '.trending-now-empty { text-align: center; padding: 60px 20px; max-width: 400px; margin: 0 auto; }' +
            '.trending-now-empty svg { margin: 0 auto 16px; opacity: 0.4; }' +
            '.trending-now-empty p { font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.medium + '; font-size: 15px; color: #86868b; margin: 0; }' +
            '.trending-now-empty-sub { font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.regular + '; font-size: 12px !important; color: #b0b0b5 !important; margin-top: 6px !important; }' +
            '.trending-now-error { text-align: center; padding: 48px 20px; }' +
            '.trending-now-error p { font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.regular + '; font-size: 14px; color: #86868b; margin-bottom: 16px; }' +
            '.trending-now-retry-btn { padding: 10px 24px; background: #007aff; color: #fff; border: none; border-radius: 50px; font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.semibold + '; font-size: 12px; cursor: pointer; transition: background 0.2s; }' +
            '.trending-now-retry-btn:hover { background: #0056cc; }' +
            '.trending-now-skeleton-card { pointer-events: none; }' +
            '.skeleton-pulse { background: linear-gradient(90deg, #e5e5ea 0%, #f0f0f5 40%, #e5e5ea 80%); background-size: 800px 100%; animation: skeletonShimmer 1.8s infinite linear; border-radius: 0; }' +
            '.skeleton-text { height: 13px; margin-bottom: 5px; }' +
            '@keyframes skeletonShimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }';
        
        document.head.appendChild(style);
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        applyFontsVariables();
        injectStyles();
        ensureGlobalMouseHandlers();

        window.addEventListener('jayenware:dataLoaded', function(e) {
            var detail = e.detail || {};
            if (detail.products && Array.isArray(detail.products)) {
                var trending = detail.products.filter(function(p) {
                    return p.is_hot === true || p.is_hot === 1;
                });
                if (trending.length) renderTrendingNow(trending);
            }
        });

        if (window.currentData && window.currentData.products && Array.isArray(window.currentData.products)) {
            var trending = window.currentData.products.filter(function(p) {
                return p.is_hot === true || p.is_hot === 1;
            });
            if (trending.length) {
                setTimeout(function() { renderTrendingNow(trending); }, 50);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
