// ============================================================
// JAYENWARE – NEW ARRIVALS SECTION (2x2 Grid Layout)
// ENHANCED: Premium dot design, centered title, no View All
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

    const CONFIG = {
        containerId: 'new-arrivals-container',
        skeletonId: 'new-arrivals-skeleton',
        sectionClass: 'new-arrivals-grid-section',
        gridClass: 'new-arrivals-grid',
        title: 'New Arrivals',
        maxProducts: 8,
        cardAspectRatio: '4/5'
    };

    let productColorsCache = {};

    function getImageUrl(product) {
        if (product.img && product.img.trim() !== '') return product.img;
        if (product.image && product.image.trim() !== '') return product.image;
        if (product.image_url && product.image_url.trim() !== '') return product.image_url;
        if (product.images && product.images.trim() !== '') {
            const arr = product.images.split(',');
            if (arr[0] && arr[0].trim() !== '') return arr[0].trim();
        }
        return '/placeholder.png';
    }

    function getProductSlug(product) {
        return (product.slug || product.title || 'product').toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
    }

    function handleImageLoad(img) { if (img && img.classList) { img.classList.add('loaded'); img.style.opacity = '1'; } }
    function handleImageError(img) {
        if (img && img.classList) {
            img.style.display = 'none';
            const wrapper = img.closest('.new-arrival-card-image-wrapper');
            if (wrapper) { wrapper.style.background = '#f5f5f7'; }
        }
    }
    window.handleNewArrivalImageLoad = handleImageLoad;
    window.handleNewArrivalImageError = handleImageError;

    async function fetchProductColors(slug) {
        if (productColorsCache[slug]) return productColorsCache[slug];
        try {
            const res = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.productColors}?slug=${encodeURIComponent(slug)}`);
            if (!res.ok) return [];
            const data = await res.json();
            productColorsCache[slug] = data || [];
            return data || [];
        } catch (e) { return []; }
    }

    function getAllImagesForSlider(product, colors) {
        const images = [];
        const main = getImageUrl(product);
        if (main && main !== '/placeholder.png') images.push(main);
        if (colors) colors.forEach(c => { if (c.color_image && c.color_image.trim() && !images.includes(c.color_image)) images.push(c.color_image); });
        return images;
    }

    function createProductCard(product) {
        const out = product.is_out_of_stock === true || product.is_out_of_stock === 1 || product.stock === 0 || product.stock === '0';
        const slug = getProductSlug(product);
        const img = getImageUrl(product);
        let badge = '';
        if (!out) {
            if (product.is_new_arrival === true || product.is_new_arrival === 1) badge = '<span class="new-arrival-badge">New</span>';
            else if (product.is_on_sale === true || product.is_on_sale === 1) badge = '<span class="new-arrival-badge new-arrival-badge-sale">Sale</span>';
        }
        const card = document.createElement('div');
        card.className = 'new-arrival-card';
        card.setAttribute('data-product-id', product.id);
        card.setAttribute('data-product-slug', slug);
        card.innerHTML = `
            <a href="/product/${slug}" class="new-arrival-card-link">
                <div class="new-arrival-card-image-wrapper">
                    <div class="new-arrival-image-slider" data-slug="${slug}">
                        <img src="${img}" alt="${product.title||'Product'}" class="new-arrival-card-image new-arrival-slider-image active" data-index="0" loading="lazy" onload="window.handleNewArrivalImageLoad&&window.handleNewArrivalImageLoad(this)" onerror="window.handleNewArrivalImageError&&window.handleNewArrivalImageError(this)">
                    </div>
                    ${badge}
                    ${out?'<div class="new-arrival-soldout-overlay"><span>Sold Out</span></div>':''}
                    <div class="new-arrival-image-dots" data-slug="${slug}" style="display:none;"></div>
                </div>
                <div class="new-arrival-card-body">
                    <h3 class="new-arrival-card-title">${product.title||'Untitled'}</h3>
                    <div class="new-arrival-color-dots-below" data-slug="${slug}"></div>
                </div>
            </a>`;
        fetchProductColors(slug).then(colors => setupCard(card, product, colors, slug));
        return card;
    }

    function setupCard(card, product, colors, slug) {
        const slider = card.querySelector('.new-arrival-image-slider');
        const dots = card.querySelector('.new-arrival-image-dots');
        const colorDots = card.querySelector('.new-arrival-color-dots-below');
        const all = getAllImagesForSlider(product, colors);
        if (all.length > 1) setupSlider(card, slider, dots, all);
        else if (dots) dots.style.display = 'none';
        if (colors && colors.length && colorDots) setupColorDots(colorDots, colors, slug);
        else if (colorDots) colorDots.style.display = 'none';
    }

    function setupSlider(card, slider, dotsContainer, images) {
        slider.innerHTML = '';
        dotsContainer.innerHTML = '';
        dotsContainer.style.display = 'flex';
        let idx = 0, transitioning = false;
        let tsX = 0, tcX = 0, dragging = false;
        let md = false, msX = 0, mcX = 0;

        images.forEach((src, i) => {
            const img = document.createElement('img');
            img.src = src; img.alt = `Image ${i+1}`;
            img.className = 'new-arrival-card-image new-arrival-slider-image';
            img.setAttribute('data-index', i);
            img.loading = 'lazy';
            img.style.cssText = `position:absolute;top:0;left:${i===0?'0':'100%'};width:100%;height:100%;object-fit:cover;transition:left 0.45s cubic-bezier(0.25,0.1,0.25,1);opacity:1;display:block;color:transparent;will-change:left;`;
            img.onload = function() { handleImageLoad(this); };
            img.onerror = function() { handleImageError(this); };
            slider.appendChild(img);
            const dot = document.createElement('span');
            dot.className = 'new-arrival-image-dot';
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); if (!transitioning && i !== idx) { slideTo(i); idx = i; } });
            dotsContainer.appendChild(dot);
        });
        dotsContainer.querySelector('[data-index="0"]')?.classList.add('active');

        function slideTo(to) {
            if (transitioning || to === idx) return;
            transitioning = true;
            const imgs = card.querySelectorAll('.new-arrival-slider-image');
            const dts = card.querySelectorAll('.new-arrival-image-dot');
            const dir = to > idx ? 1 : -1;
            imgs.forEach((im, i) => {
                if (i === to) im.style.left = '0';
                else if (i === idx) im.style.left = dir > 0 ? '-100%' : '100%';
                else if (dir > 0 && i < to) im.style.left = '-100%';
                else if (dir < 0 && i > to) im.style.left = '100%';
                else im.style.left = dir > 0 ? '100%' : '-100%';
            });
            dts.forEach((d, i) => d.classList.toggle('active', i === to));
            idx = to;
            setTimeout(() => { transitioning = false; }, 450);
        }

        function reset() {
            const imgs = card.querySelectorAll('.new-arrival-slider-image');
            imgs.forEach((im, i) => { im.style.left = i === idx ? '0' : i < idx ? '-100%' : '100%'; });
        }

        card.addEventListener('touchstart', (e) => {
            if (transitioning) return;
            tsX = e.touches[0].clientX; tcX = tsX; dragging = true;
            card.querySelectorAll('.new-arrival-slider-image').forEach(im => im.style.transition = 'none');
        }, { passive: true });
        card.addEventListener('touchmove', (e) => {
            if (!dragging || transitioning) return;
            tcX = e.touches[0].clientX;
            const diff = tcX - tsX;
            const imgs = card.querySelectorAll('.new-arrival-slider-image');
            const cur = imgs[idx];
            if (cur) cur.style.left = diff + 'px';
            if (diff < -30 && idx < images.length - 1 && imgs[idx+1]) imgs[idx+1].style.left = (100 + (diff / card.offsetWidth * 100)) + '%';
            else if (diff > 30 && idx > 0 && imgs[idx-1]) imgs[idx-1].style.left = (-100 + (diff / card.offsetWidth * 100)) + '%';
        }, { passive: true });
        card.addEventListener('touchend', () => {
            if (!dragging) return; dragging = false;
            const diff = tsX - tcX;
            const th = card.offsetWidth * 0.2;
            card.querySelectorAll('.new-arrival-slider-image').forEach(im => im.style.transition = 'left 0.45s cubic-bezier(0.25,0.1,0.25,1)');
            if (Math.abs(diff) > th) {
                if (diff > 0 && idx < images.length - 1) slideTo(idx + 1);
                else if (diff < 0 && idx > 0) slideTo(idx - 1);
                else reset();
            } else reset();
        });

        card.addEventListener('mousedown', (e) => {
            if (transitioning) return;
            md = true; msX = e.clientX; mcX = msX;
            card.querySelectorAll('.new-arrival-slider-image').forEach(im => im.style.transition = 'none');
        });
        window.addEventListener('mousemove', (e) => {
            if (!md || transitioning) return;
            mcX = e.clientX;
            const diff = mcX - msX;
            const imgs = card.querySelectorAll('.new-arrival-slider-image');
            const cur = imgs[idx];
            if (cur) cur.style.left = diff + 'px';
            if (diff < -30 && idx < images.length - 1 && imgs[idx+1]) imgs[idx+1].style.left = (100 + (diff / card.offsetWidth * 100)) + '%';
            else if (diff > 30 && idx > 0 && imgs[idx-1]) imgs[idx-1].style.left = (-100 + (diff / card.offsetWidth * 100)) + '%';
        });
        window.addEventListener('mouseup', () => {
            if (!md) return; md = false;
            const diff = msX - mcX;
            const th = card.offsetWidth * 0.2;
            card.querySelectorAll('.new-arrival-slider-image').forEach(im => im.style.transition = 'left 0.45s cubic-bezier(0.25,0.1,0.25,1)');
            if (Math.abs(diff) > th) {
                if (diff > 0 && idx < images.length - 1) slideTo(idx + 1);
                else if (diff < 0 && idx > 0) slideTo(idx - 1);
                else reset();
            } else reset();
        });
    }

    function setupColorDots(container, colors, slug) {
        if (!colors || !colors.length) { container.style.display = 'none'; return; }
        container.innerHTML = colors.map(c => `<span class="new-arrival-color-dot" style="background-color:${c.color_code||'#ccc'};" title="${c.color_name||''}"></span>`).join('');
        container.querySelectorAll('.new-arrival-color-dot').forEach(d => {
            d.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); window.location.href = `/product/${slug}`; });
        });
    }

    function createEmptyState() {
        const d = document.createElement('div'); d.className = 'new-arrival-empty';
        d.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg><p>No new arrivals at the moment</p><p class="new-arrival-empty-sub">Check back soon for fresh styles</p>`;
        return d;
    }

    function createSkeletonCard() {
        const d = document.createElement('div'); d.className = 'new-arrival-card new-arrival-skeleton-card';
        d.innerHTML = `<div class="new-arrival-card-image-wrapper"><div class="skeleton-pulse" style="width:100%;aspect-ratio:${CONFIG.cardAspectRatio};"></div></div><div class="new-arrival-card-body"><div class="skeleton-pulse skeleton-text" style="width:85%;"></div><div class="skeleton-pulse skeleton-text" style="width:55%;"></div></div>`;
        return d;
    }

    async function fetchWithRetry(url, opts = {}, retries = 2) {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 10000);
        try {
            const res = await fetch(url, { ...opts, signal: ctrl.signal, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...opts.headers } });
            clearTimeout(tid);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data?.data && Array.isArray(data.data)) return data.data;
            if (data?.products && Array.isArray(data.products)) return data.products;
            if (Array.isArray(data)) return data;
            return [];
        } catch (e) {
            clearTimeout(tid);
            if (retries > 0 && e.name !== 'AbortError') { await new Promise(r => setTimeout(r, 1000)); return fetchWithRetry(url, opts, retries - 1); }
            throw e;
        }
    }

    async function fetchNewArrivals() {
        try {
            const data = await fetchWithRetry(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.newArrivals}`);
            if (data.length) return data.filter(p => p.is_new_arrival === true || p.is_new_arrival === 1 || p.is_new_arrival === 'true');
            const all = await fetchWithRetry(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}`);
            if (all.length) return all.filter(p => p.is_new_arrival === true || p.is_new_arrival === 1 || p.is_new_arrival === 'true').sort((a, b) => new Date(b.created_at||0) - new Date(a.created_at||0)).slice(0, CONFIG.maxProducts);
            return [];
        } catch (e) { return []; }
    }

    function createSectionHeader() {
        const h = document.createElement('div');
        h.className = 'new-arrival-header';
        h.innerHTML = `<h2 class="new-arrival-title">${CONFIG.title}</h2>`;
        return h;
    }

    function createGridContainer() { const g = document.createElement('div'); g.className = CONFIG.gridClass; return g; }

    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) return;
        const obs = new IntersectionObserver((entries) => { entries.forEach(en => { if (en.isIntersecting) { const img = en.target; if (img.tagName === 'IMG' && img.src && img.src !== window.location.href) { img.style.opacity = '1'; obs.unobserve(img); } } }); }, { rootMargin: '200px 0px', threshold: 0.01 });
        document.querySelectorAll('.new-arrival-card-image').forEach(img => obs.observe(img));
    }

    async function renderNewArrivals(products) {
        const container = document.getElementById(CONFIG.containerId);
        const skeleton = document.getElementById(CONFIG.skeletonId);
        if (!container) return;
        if (skeleton) skeleton.style.display = 'block';
        try {
            let arrivals = Array.isArray(products) && products.length > 0 ? products.filter(p => p.is_new_arrival === true || p.is_new_arrival === 1 || p.is_new_arrival === 'true') : await fetchNewArrivals();
            container.innerHTML = '';
            const sec = document.createElement('section'); sec.className = CONFIG.sectionClass;
            sec.appendChild(createSectionHeader());
            const grid = createGridContainer();
            if (arrivals && arrivals.length) arrivals.slice(0, CONFIG.maxProducts).forEach(p => grid.appendChild(createProductCard(p)));
            else { sec.classList.add('new-arrival-empty-section'); grid.appendChild(createEmptyState()); }
            sec.appendChild(grid); container.appendChild(sec);
            setTimeout(initLazyLoading, 100);
        } catch (e) { container.innerHTML = `<div class="new-arrival-error"><p>Unable to load new arrivals</p><button onclick="window.renderNewArrival()" class="new-arrival-retry-btn">Try Again</button></div>`; }
        finally { if (skeleton) skeleton.style.display = 'none'; }
    }
    window.renderNewArrival = renderNewArrivals;

    function injectStyles() {
        const id = 'new-arrival-dynamic-styles';
        if (document.getElementById(id)) return;
        const styles = `
            <style id="${id}">
                .new-arrivals-grid-section { padding: 32px 0; max-width: 100%; margin: 0 auto; background: #fff; }
                @media (max-width: 767px) { .new-arrivals-grid-section { padding: 20px 0; } }
                @media (min-width: 768px) and (max-width: 1023px) { .new-arrivals-grid-section { padding: 28px 16px; } }
                @media (min-width: 1024px) { .new-arrivals-grid-section { padding: 40px 36px; max-width: 1400px; } }

                /* Centered Header */
                .new-arrival-header { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; padding: 0 8px; }
                @media (min-width: 768px) { .new-arrival-header { margin-bottom: 24px; } }
                @media (min-width: 1024px) { .new-arrival-header { margin-bottom: 28px; } }
                .new-arrival-title { font-family: ${JABIYEN_FONTS.families.heading}; font-weight: ${JABIYEN_FONTS.weights.heading.bold}; font-size: 22px; color: #1d1d1f; letter-spacing: -0.3px; text-align: center; }
                @media (min-width: 768px) { .new-arrival-title { font-size: 28px; } }
                @media (min-width: 1024px) { .new-arrival-title { font-size: 32px; } }

                .new-arrivals-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; width: 100%; }
                @media (min-width: 768px) { .new-arrivals-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (min-width: 1024px) { .new-arrivals-grid { grid-template-columns: repeat(4, 1fr); } }

                .new-arrival-card { position: relative; background: #fff; transition: transform 0.3s; cursor: pointer; overflow: hidden; }
                .new-arrival-card:active { transform: scale(0.98); }
                @media (hover: hover) { .new-arrival-card:hover { transform: translateY(-2px); z-index: 2; box-shadow: 0 8px 25px rgba(0,0,0,0.12); } }
                .new-arrival-card-link { text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%; }
                .new-arrival-card-image-wrapper { position: relative; aspect-ratio: 4/5; background: #f5f5f7; overflow: hidden; margin-bottom: 6px; width: 100%; }
                .new-arrival-image-slider { position: relative; width: 100%; height: 100%; overflow: hidden; }
                .new-arrival-slider-image { position: absolute; top: 0; left: 100%; width: 100%; height: 100%; object-fit: cover; transition: left 0.45s cubic-bezier(0.25,0.1,0.25,1); opacity: 1; display: block; color: transparent; will-change: left; }
                .new-arrival-slider-image:first-child { left: 0; }

                /* Premium Dots */
                .new-arrival-image-dots {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 6px;
                    z-index: 4;
                    pointer-events: auto;
                    padding: 4px 8px;
                    background: transparent;
                }
                .new-arrival-image-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.55);
                    cursor: pointer;
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    flex-shrink: 0;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.15);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }
                .new-arrival-image-dot.active {
                    background: #ffffff;
                    width: 8px;
                    height: 8px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
                }
                .new-arrival-image-dot:hover {
                    background: rgba(255,255,255,0.85);
                    transform: scale(1.2);
                }

                .new-arrival-badge { position: absolute; top: 4px; left: 4px; z-index: 5; padding: 2px 7px; font-family: ${JABIYEN_FONTS.families.subtitle}; font-weight: ${JABIYEN_FONTS.weights.subtitle.semibold}; font-size: 8px; text-transform: uppercase; background: #fff; color: #1d1d1f; letter-spacing: 0.5px; border-radius: 1px; pointer-events: none; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
                @media (min-width: 768px) { .new-arrival-badge { top: 6px; left: 6px; padding: 2px 8px; font-size: 9px; } }
                .new-arrival-badge-sale { color: #d70015 !important; }

                .new-arrival-soldout-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 6; pointer-events: none; }
                .new-arrival-soldout-overlay span { background: #1d1d1f; color: #fff; font-family: ${JABIYEN_FONTS.families.body}; font-weight: ${JABIYEN_FONTS.weights.body.bold}; font-size: 9px; text-transform: uppercase; padding: 5px 14px; letter-spacing: 1px; border-radius: 1px; }
                @media (min-width: 768px) { .new-arrival-soldout-overlay span { font-size: 10px; padding: 6px 18px; } }

                .new-arrival-card-body { padding: 4px 6px 6px; display: flex; flex-direction: column; }
                @media (min-width: 768px) { .new-arrival-card-body { padding: 6px 8px 8px; } }
                .new-arrival-card-title { font-family: ${JABIYEN_FONTS.families.body}; font-weight: ${JABIYEN_FONTS.weights.body.semibold}; font-size: 13px; color: #1d1d1f; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; text-align: center; }
                @media (min-width: 768px) { .new-arrival-card-title { font-size: 15px; line-height: 1.4; } }

                .new-arrival-color-dots-below { display: flex; gap: 5px; justify-content: center; margin-top: 6px; flex-wrap: wrap; }
                .new-arrival-color-dot { width: 11px; height: 11px; border-radius: 50%; cursor: pointer; border: 1px solid rgba(0,0,0,0.08); flex-shrink: 0; display: block; }
                @media (min-width: 768px) { .new-arrival-color-dot { width: 13px; height: 13px; } }

                .new-arrival-empty { text-align: center; padding: 60px 20px; max-width: 400px; margin: 0 auto; }
                .new-arrival-empty svg { margin: 0 auto 16px; opacity: 0.4; }
                .new-arrival-empty p { font-family: ${JABIYEN_FONTS.families.body}; font-weight: ${JABIYEN_FONTS.weights.body.medium}; font-size: 15px; color: #86868b; margin: 0; }
                .new-arrival-empty-sub { font-family: ${JABIYEN_FONTS.families.body}; font-weight: ${JABIYEN_FONTS.weights.body.regular}; font-size: 12px !important; color: #b0b0b5 !important; margin-top: 6px !important; }

                .new-arrival-error { text-align: center; padding: 48px 20px; }
                .new-arrival-error p { font-family: ${JABIYEN_FONTS.families.body}; font-weight: ${JABIYEN_FONTS.weights.body.regular}; font-size: 14px; color: #86868b; margin-bottom: 16px; }
                .new-arrival-retry-btn { padding: 10px 24px; background: #1d1d1f; color: #fff; border: none; border-radius: 50px; font-family: ${JABIYEN_FONTS.families.body}; font-weight: ${JABIYEN_FONTS.weights.body.semibold}; font-size: 12px; cursor: pointer; transition: background 0.2s; }
                .new-arrival-retry-btn:hover { background: #007aff; }

                .new-arrival-skeleton-card { pointer-events: none; }
                .skeleton-pulse { background: linear-gradient(90deg, #e5e5ea 0%, #f0f0f5 40%, #e5e5ea 80%); background-size: 800px 100%; animation: skeletonShimmer 1.8s infinite linear; border-radius: 0; }
                .skeleton-text { height: 13px; margin-bottom: 5px; }
                @keyframes skeletonShimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
            </style>`;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    function init() {
        applyFontsVariables();
        injectStyles();
        window.addEventListener('jayenware:dataLoaded', (e) => {
            const detail = e.detail || {};
            if (detail.products && Array.isArray(detail.products)) {
                const arr = detail.products.filter(p => p.is_new_arrival === true || p.is_new_arrival === 1);
                if (arr.length) renderNewArrivals(arr);
            }
        });
        if (window.currentData?.products && Array.isArray(window.currentData.products)) {
            const arr = window.currentData.products.filter(p => p.is_new_arrival === true || p.is_new_arrival === 1);
            if (arr.length) setTimeout(() => renderNewArrivals(arr), 50);
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

})();
