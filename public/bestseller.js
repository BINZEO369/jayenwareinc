
// ============================================
// BEST SELLERS SECTION
// Complete Client-Side Component
// Same design, same colors, same image slider as New Arrivals & Trending Now
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
    // SECTION CONFIGURATION
    // ============================================
    var CONFIG = {
        containerId: 'best-sellers-container',
        skeletonId: 'best-sellers-skeleton',
        sectionClass: 'best-sellers-grid-section',
        gridClass: 'best-sellers-grid',
        title: 'Best Sellers',
        maxProducts: 8,
        cardAspectRatio: '4/5'
    };

    var productColorsCache = {};

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
        return (product.slug || product.title || 'product').toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
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
            var wrapper = img.closest('.best-sellers-card-image-wrapper');
            if (wrapper) wrapper.style.background = '#f5f5f7';
        }
    }

    window.handleBestSellersImageLoad = handleImageLoad;
    window.handleBestSellersImageError = handleImageError;

    async function fetchProductColors(slug) {
        if (productColorsCache[slug]) return productColorsCache[slug];
        try {
            var res = await fetch(API_CONFIG.baseURL + API_CONFIG.endpoints.productColors + '?slug=' + encodeURIComponent(slug));
            if (!res.ok) return [];
            var data = await res.json();
            productColorsCache[slug] = data || [];
            return data || [];
        } catch (e) { return []; }
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
    // PRODUCT CARD
    // ============================================
    function createProductCard(product) {
        var out = product.is_out_of_stock === true || product.is_out_of_stock === 1 || product.stock === 0 || product.stock === '0';
        var slug = getProductSlug(product);
        var img = getImageUrl(product);

        var card = document.createElement('div');
        card.className = 'best-sellers-card';
        card.setAttribute('data-product-id', product.id);
        card.setAttribute('data-product-slug', slug);

        var link = document.createElement('a');
        link.href = '/product/' + encodeURIComponent(slug);
        link.className = 'best-sellers-card-link';

        var imageWrapper = document.createElement('div');
        imageWrapper.className = 'best-sellers-card-image-wrapper';

        var slider = document.createElement('div');
        slider.className = 'best-sellers-image-slider';
        slider.setAttribute('data-slug', slug);

        var mainImg = document.createElement('img');
        mainImg.src = img;
        mainImg.alt = product.title || 'Product';
        mainImg.className = 'best-sellers-card-image best-sellers-slider-image active';
        mainImg.setAttribute('data-index', '0');
        mainImg.loading = 'lazy';
        mainImg.onload = function() { handleImageLoad(mainImg); };
        mainImg.onerror = function() { handleImageError(mainImg); };
        slider.appendChild(mainImg);

        imageWrapper.appendChild(slider);

        if (!out) {
            var badgeText = '';
            if (product.is_best === true || product.is_best === 1) badgeText = 'Best Seller';
            else if (product.is_on_sale === true || product.is_on_sale === 1) badgeText = 'Sale';
            if (badgeText) {
                var badgeSpan = document.createElement('span');
                badgeSpan.className = 'best-sellers-badge' + (badgeText === 'Sale' ? ' best-sellers-badge-sale' : '');
                badgeSpan.textContent = badgeText;
                imageWrapper.appendChild(badgeSpan);
            }
        }

        if (out) {
            var soldOut = document.createElement('div');
            soldOut.className = 'best-sellers-soldout-overlay';
            var soldOutSpan = document.createElement('span');
            soldOutSpan.textContent = 'Sold Out';
            soldOut.appendChild(soldOutSpan);
            imageWrapper.appendChild(soldOut);
        }

        var dotsContainer = document.createElement('div');
        dotsContainer.className = 'best-sellers-image-dots';
        dotsContainer.setAttribute('data-slug', slug);
        dotsContainer.style.display = 'none';
        imageWrapper.appendChild(dotsContainer);

        link.appendChild(imageWrapper);

        var cardBody = document.createElement('div');
        cardBody.className = 'best-sellers-card-body';

        var titleEl = document.createElement('h3');
        titleEl.className = 'best-sellers-card-title';
        titleEl.textContent = product.title || 'Untitled';
        cardBody.appendChild(titleEl);

        var colorDotsBelow = document.createElement('div');
        colorDotsBelow.className = 'best-sellers-color-dots-below';
        colorDotsBelow.setAttribute('data-slug', slug);
        cardBody.appendChild(colorDotsBelow);

        link.appendChild(cardBody);
        card.appendChild(link);

        fetchProductColors(slug).then(function(colors) { setupCard(card, product, colors, slug); });
        return card;
    }

    function setupCard(card, product, colors, slug) {
        var slider = card.querySelector('.best-sellers-image-slider');
        var dots = card.querySelector('.best-sellers-image-dots');
        var colorDots = card.querySelector('.best-sellers-color-dots-below');
        var all = getAllImagesForSlider(product, colors);
        if (all.length > 1) setupSlider(card, slider, dots, all);
        else if (dots) dots.style.display = 'none';
        if (colors && colors.length && colorDots) setupColorDots(colorDots, colors, slug);
        else if (colorDots) colorDots.style.display = 'none';
    }

    function setupSlider(card, slider, dotsContainer, images) {
        slider.innerHTML = '';
        dotsContainer.innerHTML = '';
        dotsContainer.style.display = 'flex';

        var currentIndex = 0;
        var totalImages = images.length;
        var isAnimating = false;

        function updateSlide(index, direction) {
            if (isAnimating || index === currentIndex) return;
            if (index < 0 || index >= totalImages) return;
            isAnimating = true;

            var imgs = card.querySelectorAll('.best-sellers-slider-image');
            var dts = card.querySelectorAll('.best-sellers-image-dot');
            var dir = direction || (index > currentIndex ? 1 : -1);
            var oldIndex = currentIndex;
            currentIndex = index;

            imgs.forEach(function(im, i) {
                im.style.transition = 'left 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)';
                if (i === index) {
                    im.style.left = '0';
                    im.style.zIndex = '2';
                } else if (i === oldIndex) {
                    im.style.left = dir > 0 ? '-100%' : '100%';
                    im.style.zIndex = '1';
                } else if (dir > 0 && i < index) {
                    im.style.left = '-100%';
                    im.style.zIndex = '1';
                } else if (dir < 0 && i > index) {
                    im.style.left = '100%';
                    im.style.zIndex = '1';
                } else {
                    im.style.left = dir > 0 ? '100%' : '-100%';
                    im.style.zIndex = '0';
                }
            });

            dts.forEach(function(d, i) {
                d.classList.toggle('active', i === index);
            });

            setTimeout(function() {
                isAnimating = false;
            }, 500);
        }

        function resetToCurrent() {
            var imgs = card.querySelectorAll('.best-sellers-slider-image');
            imgs.forEach(function(im, i) {
                im.style.transition = 'left 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)';
                if (i === currentIndex) {
                    im.style.left = '0';
                    im.style.zIndex = '2';
                } else if (i < currentIndex) {
                    im.style.left = '-100%';
                    im.style.zIndex = '1';
                } else {
                    im.style.left = '100%';
                    im.style.zIndex = '0';
                }
            });
        }

        images.forEach(function(src, i) {
            var img = document.createElement('img');
            img.src = src;
            img.alt = 'Image ' + (i + 1);
            img.className = 'best-sellers-card-image best-sellers-slider-image';
            img.setAttribute('data-index', i);
            img.loading = 'lazy';
            img.style.cssText = 'position:absolute;top:0;left:' + (i === 0 ? '0' : '100%') + ';width:100%;height:100%;object-fit:cover;transition:left 0.45s cubic-bezier(0.25,0.1,0.25,1);opacity:1;display:block;color:transparent;will-change:left;z-index:' + (i === 0 ? '2' : '0') + ';';
            img.onload = function() { handleImageLoad(this); };
            img.onerror = function() { handleImageError(this); };
            img.draggable = false;
            slider.appendChild(img);

            var dot = document.createElement('span');
            dot.className = 'best-sellers-image-dot';
            dot.setAttribute('data-index', i);
            (function(index) {
                dot.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (isAnimating || index === currentIndex) return;
                    updateSlide(index);
                });
            })(i);
            dotsContainer.appendChild(dot);
        });

        var firstDot = dotsContainer.querySelector('[data-index="0"]');
        if (firstDot) firstDot.classList.add('active');

        var startX = 0;
        var startY = 0;
        var currentX = 0;
        var currentY = 0;
        var isDragging = false;
        var isHorizontalSwipe = null;

        card.addEventListener('touchstart', function(e) {
            if (isAnimating) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            currentX = startX;
            currentY = startY;
            isDragging = true;
            isHorizontalSwipe = null;
            var imgs = card.querySelectorAll('.best-sellers-slider-image');
            imgs.forEach(function(im) { im.style.transition = 'none'; });
        }, { passive: true });

        card.addEventListener('touchmove', function(e) {
            if (!isDragging || isAnimating) return;
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            var diffX = currentX - startX;
            var diffY = currentY - startY;

            if (isHorizontalSwipe === null && (Math.abs(diffX) > 5 || Math.abs(diffY) > 5)) {
                isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
            }

            if (isHorizontalSwipe === false) return;

            if (isHorizontalSwipe === true) {
                e.preventDefault();
                var imgs = card.querySelectorAll('.best-sellers-slider-image');
                var cur = imgs[currentIndex];
                if (cur) {
                    cur.style.left = diffX + 'px';
                    cur.style.zIndex = '3';
                }
                if (diffX < -10 && currentIndex < totalImages - 1 && imgs[currentIndex + 1]) {
                    imgs[currentIndex + 1].style.left = (100 + (diffX / card.offsetWidth * 100)) + '%';
                    imgs[currentIndex + 1].style.zIndex = '2';
                } else if (diffX > 10 && currentIndex > 0 && imgs[currentIndex - 1]) {
                    imgs[currentIndex - 1].style.left = (-100 + (diffX / card.offsetWidth * 100)) + '%';
                    imgs[currentIndex - 1].style.zIndex = '2';
                }
            }
        }, { passive: false });

        card.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;

            if (isHorizontalSwipe === false) {
                resetToCurrent();
                return;
            }

            if (isHorizontalSwipe === null) {
                resetToCurrent();
                return;
            }

            var diffX = startX - currentX;
            var threshold = card.offsetWidth * 0.2;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0 && currentIndex < totalImages - 1) {
                    updateSlide(currentIndex + 1, 1);
                } else if (diffX < 0 && currentIndex > 0) {
                    updateSlide(currentIndex - 1, -1);
                } else {
                    resetToCurrent();
                }
            } else {
                resetToCurrent();
            }
        });

        card.addEventListener('mousedown', function(e) {
            if (isAnimating) return;
            startX = e.clientX;
            startY = e.clientY;
            currentX = startX;
            currentY = startY;
            isDragging = true;
            isHorizontalSwipe = null;
            var imgs = card.querySelectorAll('.best-sellers-slider-image');
            imgs.forEach(function(im) { im.style.transition = 'none'; });
            e.preventDefault();
        });

        card.addEventListener('mousemove', function(e) {
            if (!isDragging || isAnimating) return;
            currentX = e.clientX;
            currentY = e.clientY;
            var diffX = currentX - startX;
            var diffY = currentY - startY;

            if (isHorizontalSwipe === null && (Math.abs(diffX) > 5 || Math.abs(diffY) > 5)) {
                isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
            }

            if (isHorizontalSwipe === false) return;

            if (isHorizontalSwipe === true) {
                e.preventDefault();
                var imgs = card.querySelectorAll('.best-sellers-slider-image');
                var cur = imgs[currentIndex];
                if (cur) {
                    cur.style.left = diffX + 'px';
                    cur.style.zIndex = '3';
                }
                if (diffX < -10 && currentIndex < totalImages - 1 && imgs[currentIndex + 1]) {
                    imgs[currentIndex + 1].style.left = (100 + (diffX / card.offsetWidth * 100)) + '%';
                    imgs[currentIndex + 1].style.zIndex = '2';
                } else if (diffX > 10 && currentIndex > 0 && imgs[currentIndex - 1]) {
                    imgs[currentIndex - 1].style.left = (-100 + (diffX / card.offsetWidth * 100)) + '%';
                    imgs[currentIndex - 1].style.zIndex = '2';
                }
            }
        });

        card.addEventListener('mouseup', function(e) {
            if (!isDragging) return;
            isDragging = false;

            if (isHorizontalSwipe === false || isHorizontalSwipe === null) {
                resetToCurrent();
                return;
            }

            var diffX = startX - currentX;
            var threshold = card.offsetWidth * 0.2;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0 && currentIndex < totalImages - 1) {
                    updateSlide(currentIndex + 1, 1);
                } else if (diffX < 0 && currentIndex > 0) {
                    updateSlide(currentIndex - 1, -1);
                } else {
                    resetToCurrent();
                }
            } else {
                resetToCurrent();
            }
        });

        card.addEventListener('mouseleave', function() {
            if (!isDragging) return;
            isDragging = false;
            resetToCurrent();
        });
    }

    function setupColorDots(container, colors, slug) {
        if (!colors || !colors.length) { container.style.display = 'none'; return; }
        container.innerHTML = '';
        colors.forEach(function(c) {
            var dot = document.createElement('span');
            dot.className = 'best-sellers-color-dot';
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
        d.className = 'best-sellers-empty';
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '64');
        svg.setAttribute('height', '64');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', '#ccc');
        svg.setAttribute('stroke-width', '1.5');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
        svg.appendChild(path);
        d.appendChild(svg);
        var p1 = document.createElement('p');
        p1.textContent = 'No best sellers right now';
        d.appendChild(p1);
        var p2 = document.createElement('p');
        p2.className = 'best-sellers-empty-sub';
        p2.textContent = 'Top picks coming soon — stay tuned';
        d.appendChild(p2);
        return d;
    }

    // ============================================
    // SKELETON CARD
    // ============================================
    function createSkeletonCard() {
        var d = document.createElement('div');
        d.className = 'best-sellers-card best-sellers-skeleton-card';
        var wrapper = document.createElement('div');
        wrapper.className = 'best-sellers-card-image-wrapper';
        var pulse = document.createElement('div');
        pulse.className = 'skeleton-pulse';
        pulse.style.cssText = 'width:100%;aspect-ratio:' + CONFIG.cardAspectRatio + ';';
        wrapper.appendChild(pulse);
        d.appendChild(wrapper);
        var body = document.createElement('div');
        body.className = 'best-sellers-card-body';
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
                return fetchWithRetry(url, opts, retries - 1);
            }
            throw e;
        }
    }

    async function fetchBestSellingProducts() {
        try {
            var allProducts = await fetchWithRetry(API_CONFIG.baseURL + API_CONFIG.endpoints.products);
            if (allProducts.length) {
                var bestSellers = allProducts.filter(function(p) {
                    return p.is_best === true || p.is_best === 1 || p.is_best === 'true';
                });
                bestSellers.sort(function(a, b) {
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                });
                return bestSellers.slice(0, CONFIG.maxProducts);
            }
            return [];
        } catch (e) { return []; }
    }

    // ============================================
    // SECTION RENDERING
    // ============================================
    function createSectionHeader() {
        var h = document.createElement('div');
        h.className = 'best-sellers-header';
        var title = document.createElement('h2');
        title.className = 'best-sellers-title';
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
        document.querySelectorAll('.best-sellers-card-image').forEach(function(img) { obs.observe(img); });
    }

    async function renderBestSeller(products) {
        var container = document.getElementById(CONFIG.containerId);
        var skeleton = document.getElementById(CONFIG.skeletonId);
        if (!container) return;
        if (skeleton) skeleton.style.display = 'block';

        try {
            var bestSellingProducts;
            if (Array.isArray(products) && products.length > 0) {
                bestSellingProducts = products.filter(function(p) {
                    return p.is_best === true || p.is_best === 1 || p.is_best === 'true';
                });
            } else {
                bestSellingProducts = await fetchBestSellingProducts();
            }

            container.innerHTML = '';
            var sec = document.createElement('section');
            sec.className = CONFIG.sectionClass;
            sec.appendChild(createSectionHeader());
            var grid = createGridContainer();

            if (bestSellingProducts && bestSellingProducts.length) {
                bestSellingProducts.slice(0, CONFIG.maxProducts).forEach(function(p) {
                    grid.appendChild(createProductCard(p));
                });
            } else {
                sec.classList.add('best-sellers-empty-section');
                grid.appendChild(createEmptyState());
            }

            sec.appendChild(grid);
            container.appendChild(sec);
            setTimeout(initLazyLoading, 100);
        } catch (e) {
            container.innerHTML = '';
            var errDiv = document.createElement('div');
            errDiv.className = 'best-sellers-error';
            var errP = document.createElement('p');
            errP.textContent = 'Unable to load best sellers';
            errDiv.appendChild(errP);
            var retryBtn = document.createElement('button');
            retryBtn.className = 'best-sellers-retry-btn';
            retryBtn.textContent = 'Try Again';
            retryBtn.onclick = function() { window.renderBestSeller(); };
            errDiv.appendChild(retryBtn);
            container.appendChild(errDiv);
        } finally {
            if (skeleton) skeleton.style.display = 'none';
        }
    }

    window.renderBestSeller = renderBestSeller;

    // ============================================
    // STYLES INJECTION - Same design as New Arrivals
    // ============================================
    function injectStyles() {
        var id = 'best-sellers-dynamic-styles';
        if (document.getElementById(id)) return;
        var style = document.createElement('style');
        style.id = id;
        style.textContent = '.best-sellers-grid-section { padding: 32px 0; max-width: 100%; margin: 0 auto; background: #fff; }' +
            '@media (max-width: 767px) { .best-sellers-grid-section { padding: 20px 0; } }' +
            '@media (min-width: 768px) and (max-width: 1023px) { .best-sellers-grid-section { padding: 28px 16px; } }' +
            '@media (min-width: 1024px) { .best-sellers-grid-section { padding: 40px 36px; max-width: 1400px; } }' +
            '.best-sellers-header { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; padding: 0 8px; }' +
            '@media (min-width: 768px) { .best-sellers-header { margin-bottom: 24px; } }' +
            '@media (min-width: 1024px) { .best-sellers-header { margin-bottom: 28px; } }' +
            '.best-sellers-title { font-family: ' + JABIYEN_FONTS.families.heading + '; font-weight: ' + JABIYEN_FONTS.weights.heading.bold + '; font-size: 22px; color: #1d1d1f; letter-spacing: -0.3px; text-align: center; }' +
            '@media (min-width: 768px) { .best-sellers-title { font-size: 28px; } }' +
            '@media (min-width: 1024px) { .best-sellers-title { font-size: 32px; } }' +
            '.best-sellers-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; width: 100%; }' +
            '@media (min-width: 768px) { .best-sellers-grid { grid-template-columns: repeat(3, 1fr); } }' +
            '@media (min-width: 1024px) { .best-sellers-grid { grid-template-columns: repeat(4, 1fr); } }' +
            '.best-sellers-card { position: relative; background: #fff; transition: transform 0.3s; cursor: pointer; overflow: hidden; }' +
            '.best-sellers-card:active { transform: scale(0.98); }' +
            '@media (hover: hover) { .best-sellers-card:hover { transform: translateY(-2px); z-index: 2; box-shadow: 0 8px 25px rgba(0,0,0,0.12); } }' +
            '.best-sellers-card-link { text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%; }' +
            '.best-sellers-card-image-wrapper { position: relative; aspect-ratio: 4/5; background: #f5f5f7; overflow: hidden; margin-bottom: 6px; width: 100%; }' +
            '.best-sellers-image-slider { position: relative; width: 100%; height: 100%; overflow: hidden; }' +
            '.best-sellers-slider-image { position: absolute; top: 0; left: 100%; width: 100%; height: 100%; object-fit: cover; transition: left 0.45s cubic-bezier(0.25,0.1,0.25,1); opacity: 1; display: block; color: transparent; will-change: left; }' +
            '.best-sellers-slider-image:first-child { left: 0; }' +
            '.best-sellers-image-dots { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 4; pointer-events: auto; padding: 4px 8px; background: transparent; }' +
            '.best-sellers-image-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.55); cursor: pointer; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,0.15); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }' +
            '.best-sellers-image-dot.active { background: #ffffff; width: 8px; height: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); }' +
            '.best-sellers-image-dot:hover { background: rgba(255,255,255,0.85); transform: scale(1.2); }' +
            '.best-sellers-badge { position: absolute; top: 4px; left: 4px; z-index: 5; padding: 2px 7px; font-family: ' + JABIYEN_FONTS.families.subtitle + '; font-weight: ' + JABIYEN_FONTS.weights.subtitle.semibold + '; font-size: 8px; text-transform: uppercase; background: #fff; color: #1d1d1f; letter-spacing: 0.5px; border-radius: 1px; pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }' +
            '@media (min-width: 768px) { .best-sellers-badge { top: 6px; left: 6px; padding: 2px 8px; font-size: 9px; } }' +
            '.best-sellers-badge-sale { color: #d70015 !important; }' +
            '.best-sellers-soldout-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 6; pointer-events: none; }' +
            '.best-sellers-soldout-overlay span { background: #1d1d1f; color: #fff; font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.bold + '; font-size: 9px; text-transform: uppercase; padding: 5px 14px; letter-spacing: 1px; border-radius: 1px; }' +
            '@media (min-width: 768px) { .best-sellers-soldout-overlay span { font-size: 10px; padding: 6px 18px; } }' +
            '.best-sellers-card-body { padding: 4px 6px 6px; display: flex; flex-direction: column; }' +
            '@media (min-width: 768px) { .best-sellers-card-body { padding: 6px 8px 8px; } }' +
            '.best-sellers-card-title { font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.semibold + '; font-size: 13px; color: #1d1d1f; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; text-align: center; }' +
            '@media (min-width: 768px) { .best-sellers-card-title { font-size: 15px; line-height: 1.4; } }' +
            '.best-sellers-color-dots-below { display: flex; gap: 5px; justify-content: center; margin-top: 6px; flex-wrap: wrap; }' +
            '.best-sellers-color-dot { width: 11px; height: 11px; border-radius: 50%; cursor: pointer; border: 1px solid rgba(0,0,0,0.08); flex-shrink: 0; display: block; }' +
            '@media (min-width: 768px) { .best-sellers-color-dot { width: 13px; height: 13px; } }' +
            '.best-sellers-empty { text-align: center; padding: 60px 20px; max-width: 400px; margin: 0 auto; }' +
            '.best-sellers-empty svg { margin: 0 auto 16px; opacity: 0.4; }' +
            '.best-sellers-empty p { font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.medium + '; font-size: 15px; color: #86868b; margin: 0; }' +
            '.best-sellers-empty-sub { font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.regular + '; font-size: 12px !important; color: #b0b0b5 !important; margin-top: 6px !important; }' +
            '.best-sellers-error { text-align: center; padding: 48px 20px; }' +
            '.best-sellers-error p { font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.regular + '; font-size: 14px; color: #86868b; margin-bottom: 16px; }' +
            '.best-sellers-retry-btn { padding: 10px 24px; background: #1d1d1f; color: #fff; border: none; border-radius: 50px; font-family: ' + JABIYEN_FONTS.families.body + '; font-weight: ' + JABIYEN_FONTS.weights.body.semibold + '; font-size: 12px; cursor: pointer; transition: background 0.2s; }' +
            '.best-sellers-retry-btn:hover { background: #007aff; }' +
            '.best-sellers-skeleton-card { pointer-events: none; }' +
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
        window.addEventListener('jayenware:dataLoaded', function(e) {
            var detail = e.detail || {};
            if (detail.products && Array.isArray(detail.products)) {
                var best = detail.products.filter(function(p) {
                    return p.is_best === true || p.is_best === 1 || p.is_best === 'true';
                });
                if (best.length) renderBestSeller(best);
            }
        });
        if (window.currentData && window.currentData.products && Array.isArray(window.currentData.products)) {
            var best = window.currentData.products.filter(function(p) {
                return p.is_best === true || p.is_best === 1 || p.is_best === 'true';
            });
            if (best.length) setTimeout(function() { renderBestSeller(best); }, 50);
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
