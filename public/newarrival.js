// ============================================================
// JAYENWARE – NEW ARRIVALS SECTION (2×2 Grid Layout)
// Loaded from newarrival.js
// ============================================================

(function () {
  const STYLES = `
    #new-arrivals-section {
      display: block;
      padding: 48px 0;
      background: #ffffff;
    }

    #new-arrivals-section .na-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;
    }

    #new-arrivals-section .na-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
    }

    #new-arrivals-section .na-title {
      font-size: 28px;
      color: #1d1d1f;
      font-family: var(--font-heading, 'Inter', sans-serif);
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0;
    }

    #new-arrivals-section .na-link {
      font-size: 14px;
      font-weight: 500;
      color: #007aff;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: gap 0.2s ease;
      font-family: var(--font-body, 'Inter', sans-serif);
    }

    #new-arrivals-section .na-link:hover {
      gap: 8px;
    }

    #new-arrivals-section .na-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    @media (min-width: 768px) {
      #new-arrivals-section .na-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
    }

    @media (min-width: 1024px) {
      #new-arrivals-section .na-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 28px;
      }
    }

    /* Product Card – New Arrival Grid */
    #new-arrivals-section .na-card {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
      transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      position: relative;
      background: transparent;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    #new-arrivals-section .na-card:active {
      transform: scale(0.97);
      transition: transform 0.1s cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    @media (hover: hover) {
      #new-arrivals-section .na-card:hover {
        transform: translateY(-4px);
      }
    }

    #new-arrivals-section .na-card-img {
      position: relative;
      aspect-ratio: 3 / 4;
      background: #fafafa;
      overflow: hidden;
      margin-bottom: 14px;
      border-radius: 0;
    }

    #new-arrivals-section .na-card-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    @media (hover: hover) {
      #new-arrivals-section .na-card:hover .na-card-img img {
        transform: scale(1.04);
      }
    }

    #new-arrivals-section .na-card-body {
      padding: 0 4px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    #new-arrivals-section .na-card-category {
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
      color: #86868b;
      font-family: var(--font-accent, 'Inter', sans-serif);
      letter-spacing: 0.5px;
    }

    #new-arrivals-section .na-card-title {
      font-size: 15px;
      font-weight: 500;
      color: #1d1d1f;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-family: var(--font-body, 'Inter', sans-serif);
      margin: 0;
    }

    #new-arrivals-section .na-card-price-wrapper {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    #new-arrivals-section .na-card-price {
      font-size: 15px;
      font-weight: 600;
      color: #1d1d1f;
      font-family: var(--font-body, 'Inter', sans-serif);
    }

    #new-arrivals-section .na-card-old-price {
      font-size: 13px;
      color: #b0b0b5;
      text-decoration: line-through;
      font-weight: 400;
      font-family: var(--font-body, 'Inter', sans-serif);
    }

    /* Badges */
    #new-arrivals-section .na-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
      padding: 4px 10px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      background: #ffffff;
      color: #1d1d1f;
      pointer-events: none;
      font-family: var(--font-body, 'Inter', sans-serif);
      letter-spacing: 0.5px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    #new-arrivals-section .na-badge-sale {
      color: #d70015 !important;
    }

    /* Quick Add Button */
    #new-arrivals-section .na-add-btn {
      position: absolute;
      bottom: 70px;
      right: 10px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #ffffff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1);
      color: #1d1d1f;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      z-index: 3;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    @media (hover: hover) {
      #new-arrivals-section .na-add-btn {
        opacity: 0;
        transform: translateY(6px);
      }
      #new-arrivals-section .na-card:hover .na-add-btn {
        opacity: 1;
        transform: translateY(0);
      }
      #new-arrivals-section .na-add-btn:hover {
        background: #1d1d1f;
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
      }
    }

    #new-arrivals-section .na-add-btn:active {
      transform: scale(0.88);
      background: #1d1d1f;
      color: #ffffff;
      transition: transform 0.1s cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    /* Sold Out Overlay */
    #new-arrivals-section .na-soldout-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5;
      pointer-events: none;
    }

    #new-arrivals-section .na-soldout-overlay span {
      background: #1d1d1f;
      color: #ffffff;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 6px 18px;
      font-family: var(--font-body, 'Inter', sans-serif);
      letter-spacing: 1px;
    }

    /* Empty State */
    #new-arrivals-section .na-empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px 0;
      color: #86868b;
      font-size: 14px;
      font-family: var(--font-body, 'Inter', sans-serif);
    }

    /* Responsive */
    @media (max-width: 767px) {
      #new-arrivals-section {
        padding: 32px 0;
      }

      #new-arrivals-section .na-container {
        padding: 0 20px;
      }

      #new-arrivals-section .na-header {
        margin-bottom: 24px;
      }

      #new-arrivals-section .na-title {
        font-size: 22px;
      }

      #new-arrivals-section .na-grid {
        gap: 16px;
      }

      #new-arrivals-section .na-card-body {
        padding: 0 2px;
      }

      #new-arrivals-section .na-card-title {
        font-size: 13px;
      }

      #new-arrivals-section .na-add-btn {
        width: 34px;
        height: 34px;
        bottom: 58px;
        right: 8px;
        opacity: 1;
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      #new-arrivals-section .na-badge {
        top: 8px;
        left: 8px;
        padding: 3px 8px;
        font-size: 9px;
      }
    }

    @media (min-width: 1400px) {
      #new-arrivals-section .na-title {
        font-size: 32px;
      }

      #new-arrivals-section .na-card-title {
        font-size: 16px;
      }
    }
  `;

  function injectStyles() {
    if (document.getElementById('na-styles')) return;
    const styleTag = document.createElement('style');
    styleTag.id = 'na-styles';
    styleTag.textContent = STYLES;
    document.head.appendChild(styleTag);
  }

  function getProductSlug(p) {
    return (p.slug || p.title || 'product')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function buildCard(product) {
    const isOut = product.stock <= 0;
    const slug = getProductSlug(product);

    let badgeHTML = '';
    if (!isOut) {
      if (product.is_on_sale) {
        badgeHTML = '<span class="na-badge na-badge-sale">Sale</span>';
      } else {
        badgeHTML = '<span class="na-badge">New</span>';
      }
    }

    const soldOutHTML = isOut
      ? '<div class="na-soldout-overlay"><span>Sold Out</span></div>'
      : '';

    const addBtnHTML = !isOut
      ? `<button class="na-add-btn" onclick="event.preventDefault();event.stopPropagation();if(typeof addToCart==='function')addToCart(${product.id},null)" aria-label="Add to cart">
           <i class="fa-solid fa-plus"></i>
         </button>`
      : '';

    return `
      <a href="/product/${slug}" class="na-card">
        <div class="na-card-img">
          <img src="${product.img}" alt="${product.title}" loading="lazy" />
          ${badgeHTML}
          ${soldOutHTML}
          ${addBtnHTML}
        </div>
        <div class="na-card-body">
          <span class="na-card-category">${product.category}</span>
          <h3 class="na-card-title">${product.title}</h3>
          <div class="na-card-price-wrapper">
            <span class="na-card-price">৳${product.price}</span>
            ${product.old_price ? `<span class="na-card-old-price">৳${product.old_price}</span>` : ''}
          </div>
        </div>
      </a>`;
  }

  window.renderNewArrival = function (products = []) {
    injectStyles();

    const section = document.getElementById('new-arrivals-section');
    if (!section) {
      console.warn('[NewArrival] #new-arrivals-section not found in DOM.');
      return;
    }

    // Hide skeleton
    const skeleton = document.getElementById('new-arrivals-skeleton');
    if (skeleton) {
      skeleton.classList.add('skeleton-hidden');
      skeleton.classList.remove('skeleton-visible');
    }

    if (!products || products.length === 0) {
      section.innerHTML = `
        <div class="na-container">
          <div class="na-header">
            <h2 class="na-title">New Arrivals</h2>
            <a href="/products" class="na-link" onclick="event.preventDefault();navigate('products')">View All →</a>
          </div>
          <div class="na-grid">
            <div class="na-empty">No new arrivals at the moment. Check back soon!</div>
          </div>
        </div>`;
      section.classList.remove('skeleton-hidden');
      return;
    }

    section.innerHTML = `
      <div class="na-container">
        <div class="na-header">
          <h2 class="na-title">New Arrivals</h2>
          <a href="/products" class="na-link" onclick="event.preventDefault();navigate('products')">View All →</a>
        </div>
        <div class="na-grid">
          ${products.map(p => buildCard(p)).join('')}
        </div>
      </div>`;

    section.classList.remove('skeleton-hidden');
  };
})();
