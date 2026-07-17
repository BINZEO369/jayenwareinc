// ============================================================
// JAYENWARE HOME CATEGORY SHOWCASE COMPONENT
// Integrated with /api/home-showcase/complete API
// Fixed Version - All issues resolved
// ============================================================

class HomeCategoryShowcase {
    constructor() {
        this.config = {
            apiEndpoint: '/api/home-showcase/complete',
            containerId: 'categoryshow-container',  // ✅ Fixed: Match with HTML
            skeletonId: 'categoryshow-skeleton',     // ✅ Fixed: Match with HTML
            gridClass: 'showcase-grid',              // Dynamic grid creation
            itemsPerRow: {
                mobile: 2,
                tablet: 2,
                desktop: 3
            }
        };
        
        this.data = {
            header: null,
            menCategories: [],
            womenCategories: []
        };
        
        this.isLoaded = false;
        this.gridElement = null;
        this.init();
    }

    async init() {
        try {
            await this.fetchData();
            if (this.hasData()) {
                this.render();
            } else {
                this.hide();
            }
        } catch (error) {
            console.error('[CategoryShowcase] Initialization error:', error);
            this.hide();
        }
    }

    async fetchData() {
        try {
            const response = await fetch(this.config.apiEndpoint);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.data = {
                header: data.header || null,
                menCategories: data.menCategories || [],
                womenCategories: data.womenCategories || []
            };
            
            console.log('[CategoryShowcase] Data loaded:', {
                men: this.data.menCategories.length,
                women: this.data.womenCategories.length,
                header: !!this.data.header
            });
        } catch (error) {
            console.error('[CategoryShowcase] Fetch error:', error);
            this.data = { header: null, menCategories: [], womenCategories: [] };
            throw error; // Re-throw for init() to catch
        }
    }

    hasData() {
        return this.data.menCategories.length > 0 || this.data.womenCategories.length > 0;
    }

    hide() {
        const container = document.getElementById(this.config.containerId);
        const skeleton = document.getElementById(this.config.skeletonId);
        
        if (container) {
            container.style.display = 'none';
        }
        if (skeleton) {
            skeleton.classList.add('skeleton-hidden');
            skeleton.classList.remove('skeleton-visible');
        }
    }

    createGridElement() {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            console.error('[CategoryShowcase] Container not found:', this.config.containerId);
            return null;
        }

        // Clear container
        container.innerHTML = '';
        
        // Create grid
        const grid = document.createElement('div');
        grid.className = this.config.gridClass;
        grid.id = 'categoryshow-dynamic-grid';
        container.appendChild(grid);
        
        return grid;
    }

    render() {
        const container = document.getElementById(this.config.containerId);
        const skeleton = document.getElementById(this.config.skeletonId);

        if (!container) {
            console.error('[CategoryShowcase] Container not found');
            return;
        }

        // Show container, hide skeleton
        container.style.display = 'block';
        if (skeleton) {
            skeleton.classList.add('skeleton-hidden');
            skeleton.classList.remove('skeleton-visible');
        }

        // Create grid element
        this.gridElement = this.createGridElement();
        if (!this.gridElement) return;

        // Build header if available
        if (this.data.header) {
            const headerHTML = this.buildHeaderHTML();
            container.insertAdjacentHTML('afterbegin', headerHTML);
        }

        // Render category cards
        const allCategories = [...this.data.menCategories, ...this.data.womenCategories];
        allCategories.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

        if (allCategories.length === 0) {
            this.hide();
            return;
        }

        const cardsHTML = allCategories.map((item, index) => this.buildCardHTML(item, index)).join('');
        this.gridElement.innerHTML = cardsHTML;

        // Add responsive styles
        this.injectStyles();

        this.isLoaded = true;
        console.log('[CategoryShowcase] Rendered successfully with', allCategories.length, 'categories');
    }

    buildHeaderHTML() {
        const header = this.data.header;
        if (!header) return '';

        return `
        <div class="showcase-header" style="
            text-align: center;
            padding: 48px 20px 32px;
            max-width: 800px;
            margin: 0 auto;
        ">
            ${header.title ? `<h2 style="
                font-size: clamp(24px, 4vw, 36px);
                font-weight: 700;
                color: #1d1d1f;
                margin: 0 0 12px 0;
                font-family: var(--font-heading, 'Manrope', sans-serif);
                letter-spacing: -0.02em;
            ">${header.title}</h2>` : ''}
            
            ${header.subtitle ? `<p style="
                font-size: clamp(14px, 2vw, 16px);
                color: #86868b;
                margin: 0;
                line-height: 1.6;
                font-family: var(--font-body, 'Inter', sans-serif);
            ">${header.subtitle}</p>` : ''}
        </div>`;
    }

    buildCardHTML(item, index) {
        const cat = item.categories;
        if (!cat) return '';
        
        const catName = cat.name || 'Category';
        const catSlug = cat.slug || this.createSlug(catName);
        const imgSrc = cat.image_url || cat.image || '';
        const gender = item.gender || '';
        
        return `
        <a href="/category/${catSlug}" 
           class="showcase-category-card" 
           data-gender="${gender.toLowerCase()}"
           data-index="${index}"
           style="
            position: relative;
            aspect-ratio: 1/1;
            overflow: hidden;
            cursor: pointer;
            text-decoration: none;
            color: #fff;
            background: #1d1d1f;
            isolation: isolate;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
           ">
            
            ${imgSrc ? `<img src="${imgSrc}" 
                 alt="${catName}" 
                 loading="${index < 3 ? 'eager' : 'lazy'}"
                 onerror="this.style.opacity='0'"
                 style="
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
                    z-index: 1;
                 ">` : ''}
            
            <div style="
                position: absolute;
                inset: 0;
                background: linear-gradient(180deg, 
                    rgba(0,0,0,0) 0%, 
                    rgba(0,0,0,0.15) 40%, 
                    rgba(0,0,0,0.55) 80%, 
                    rgba(0,0,0,0.7) 100%);
                z-index: 2;
                transition: background 0.6s ease;
            "></div>
            
            <div class="card-content" style="
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 3;
                padding: clamp(16px, 4vw, 32px);
                transition: transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
            ">
                ${gender ? `<span style="
                    display: block;
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: rgba(255,255,255,0.7);
                    margin-bottom: 4px;
                    font-family: var(--font-body, 'Inter', sans-serif);
                ">${gender}</span>` : ''}
                
                <h3 style="
                    font-size: clamp(18px, 3vw, 28px);
                    line-height: 1.15;
                    margin: 0 0 16px 0;
                    color: #fff;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    font-family: var(--font-heading, 'Manrope', sans-serif);
                    font-weight: 700;
                    letter-spacing: -0.01em;
                ">${catName}</h3>
                
                <span style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #fff;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    font-family: var(--font-body, 'Inter', sans-serif);
                    position: relative;
                ">
                    Explore
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="arrow-icon" style="transition: transform 0.4s ease;">
                        <path d="M1 6H11M11 6L6 1M11 6L6 11" 
                              stroke="currentColor" 
                              stroke-width="1.5" 
                              stroke-linecap="round" 
                              stroke-linejoin="round"/>
                    </svg>
                </span>
            </div>
        </a>`;
    }

    injectStyles() {
        // Remove existing styles if any
        const existingStyles = document.getElementById('showcase-grid-styles');
        if (existingStyles) existingStyles.remove();

        const styles = `
        <style id="showcase-grid-styles">
            #categoryshow-dynamic-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0;
                max-width: 100%;
                margin: 0;
            }
            
            @media (min-width: 768px) {
                #categoryshow-dynamic-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2px;
                    background: #ffffff;
                }
                
                #categoryshow-dynamic-grid .showcase-category-card {
                    aspect-ratio: 3/4;
                }
            }
            
            @media (min-width: 1024px) {
                #categoryshow-dynamic-grid {
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2px;
                }
                
                #categoryshow-dynamic-grid .showcase-category-card {
                    aspect-ratio: 4/3;
                }
            }
            
            /* Hover effects (desktop only) */
            @media (hover: hover) {
                #categoryshow-dynamic-grid .showcase-category-card:hover img {
                    transform: scale(1.06) !important;
                }
                
                #categoryshow-dynamic-grid .showcase-category-card:hover > div:first-of-type {
                    background: linear-gradient(180deg, 
                        rgba(0,0,0,0.05) 0%, 
                        rgba(0,0,0,0.3) 40%, 
                        rgba(0,0,0,0.7) 80%, 
                        rgba(0,0,0,0.85) 100%) !important;
                }
                
                #categoryshow-dynamic-grid .showcase-category-card:hover .card-content {
                    transform: translateY(-8px);
                }
                
                #categoryshow-dynamic-grid .showcase-category-card:hover .arrow-icon {
                    transform: translateX(4px);
                }
            }
            
            /* Active/tap effects */
            #categoryshow-dynamic-grid .showcase-category-card:active {
                transform: scale(0.98);
                transition: transform 0.15s ease;
            }
            
            #categoryshow-dynamic-grid .showcase-category-card:active img {
                transform: scale(1.02);
                transition: transform 0.3s ease;
            }
            
            #categoryshow-dynamic-grid .showcase-category-card:active .arrow-icon {
                transform: translateX(6px);
                transition: transform 0.2s ease;
            }
            
            /* Mobile adjustments */
            @media (max-width: 767px) {
                #categoryshow-dynamic-grid .card-content {
                    padding: 20px;
                }
                
                #categoryshow-dynamic-grid .showcase-category-card h3 {
                    font-size: 18px;
                    margin-bottom: 12px;
                }
            }
        </style>`;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    createSlug(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    async refresh() {
        await this.fetchData();
        if (this.hasData()) {
            this.render();
        } else {
            this.hide();
        }
    }

    filterByGender(gender) {
        if (!this.isLoaded || !this.gridElement) return;
        
        const cards = this.gridElement.querySelectorAll('.showcase-category-card');
        
        cards.forEach(card => {
            if (!gender || gender === 'all') {
                card.style.display = '';
            } else {
                const cardGender = card.getAttribute('data-gender');
                card.style.display = cardGender === gender.toLowerCase() ? '' : 'none';
            }
        });
    }
}

// ============================================================
// Initialize Function - Fixed timing issues
// ============================================================
function initCategoryShowcase() {
    console.log('[CategoryShowcase] Initializing...');
    
    // Try to initialize immediately if data exists
    const tryInit = () => {
        // Check if we have access to the main app's data
        if (typeof window.currentData !== 'undefined' && 
            window.currentData.products && 
            window.currentData.products.length > 0) {
            
            console.log('[CategoryShowcase] Data already available, starting immediately');
            window.categoryShowcase = new HomeCategoryShowcase();
            return true;
        }
        return false;
    };

    // Try immediate initialization
    if (!tryInit()) {
        console.log('[CategoryShowcase] Waiting for data...');
        
        // Listen for data loaded event from main app
        window.addEventListener('jayenware:dataLoaded', (event) => {
            console.log('[CategoryShowcase] Data loaded event received:', event.detail);
            
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                if (!window.categoryShowcase) {
                    window.categoryShowcase = new HomeCategoryShowcase();
                } else {
                    window.categoryShowcase.refresh();
                }
            }, 100);
            
        }, { once: true });
        
        // Fallback: Try again after a timeout
        setTimeout(() => {
            if (!window.categoryShowcase) {
                console.log('[CategoryShowcase] Fallback initialization');
                window.categoryShowcase = new HomeCategoryShowcase();
            }
        }, 3000);
    }

    // Also initialize when DOM is fully ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.categoryShowcase) {
                console.log('[CategoryShowcase] DOMContentLoaded initialization');
                window.categoryShowcase = new HomeCategoryShowcase();
            }
        });
    }
}

// ============================================================
// Start initialization
// ============================================================
if (typeof window !== 'undefined') {
    // Make sure we're in browser environment
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCategoryShowcase);
    } else {
        // DOM already loaded, start immediately
        setTimeout(initCategoryShowcase, 0);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HomeCategoryShowcase, initCategoryShowcase };
}
