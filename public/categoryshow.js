// ============================================================
// JAYENWARE HOME CATEGORY SHOWCASE COMPONENT
// Integrated with /api/home-showcase/complete API
// ============================================================

class HomeCategoryShowcase {
    constructor() {
        this.config = {
            apiEndpoint: '/api/home-showcase/complete',
            containerId: 'categories-section',
            gridId: 'categories-grid',
            skeletonId: 'categories-skeleton',
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
        this.init();
    }

    async init() {
        await this.fetchData();
        if (this.hasData()) {
            this.render();
        } else {
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
                women: this.data.womenCategories.length
            });
        } catch (error) {
            console.error('[CategoryShowcase] Fetch error:', error);
            this.data = { header: null, menCategories: [], womenCategories: [] };
        }
    }

    hasData() {
        return this.data.menCategories.length > 0 || this.data.womenCategories.length > 0;
    }

    hide() {
        const section = document.getElementById(this.config.containerId);
        const skeleton = document.getElementById(this.config.skeletonId);
        
        if (section) {
            section.classList.add('hidden');
        }
        if (skeleton) {
            skeleton.classList.add('skeleton-hidden');
            skeleton.classList.remove('skeleton-visible');
        }
    }

    render() {
        const grid = document.getElementById(this.config.gridId);
        const section = document.getElementById(this.config.containerId);
        const skeleton = document.getElementById(this.config.skeletonId);

        if (!grid || !section) {
            console.warn('[CategoryShowcase] Container not found');
            return;
        }

        // Show section, hide skeleton
        section.classList.remove('hidden', 'skeleton-hidden');
        if (skeleton) {
            skeleton.classList.add('skeleton-hidden');
            skeleton.classList.remove('skeleton-visible');
        }

        // Build header if available
        let headerHTML = '';
        if (this.data.header) {
            const header = this.data.header;
            headerHTML = `
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

        // Render category cards
        const allCategories = [...this.data.menCategories, ...this.data.womenCategories];
        
        // Sort by sort_order if available
        allCategories.sort((a, b) => (a.sort_order || 999) - (b.sort_order || 999));

        const cardsHTML = allCategories.map((item, index) => {
            const cat = item.categories;
            if (!cat) return '';
            
            const catName = cat.name || '';
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
                
                <!-- Gradient overlay -->
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
                
                <!-- Content -->
                <div style="
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
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="transition: transform 0.4s ease;">
                            <path d="M1 6H11M11 6L6 1M11 6L6 11" 
                                  stroke="currentColor" 
                                  stroke-width="1.5" 
                                  stroke-linecap="round" 
                                  stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            </a>`;
        }).join('');

        // Responsive grid styles
        const gridStyles = `
        <style id="showcase-grid-styles">
            #${this.config.gridId} {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0;
                max-width: 100%;
                margin: 0;
            }
            
            @media (min-width: 768px) {
                #${this.config.gridId} {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2px;
                    background: #ffffff;
                }
                
                #${this.config.gridId} .showcase-category-card {
                    aspect-ratio: 3/4;
                }
            }
            
            @media (min-width: 1024px) {
                #${this.config.gridId} {
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2px;
                }
                
                #${this.config.gridId} .showcase-category-card {
                    aspect-ratio: 4/3;
                }
            }
            
            /* Hover effects (desktop only) */
            @media (hover: hover) {
                #${this.config.gridId} .showcase-category-card:hover img {
                    transform: scale(1.06) !important;
                }
                
                #${this.config.gridId} .showcase-category-card:hover > div:first-of-type {
                    background: linear-gradient(180deg, 
                        rgba(0,0,0,0.05) 0%, 
                        rgba(0,0,0,0.3) 40%, 
                        rgba(0,0,0,0.7) 80%, 
                        rgba(0,0,0,0.85) 100%) !important;
                }
                
                #${this.config.gridId} .showcase-category-card:hover > div:last-child {
                    transform: translateY(-8px);
                }
                
                #${this.config.gridId} .showcase-category-card:hover svg {
                    transform: translateX(4px);
                }
            }
            
            /* Active/tap effects */
            #${this.config.gridId} .showcase-category-card:active {
                transform: scale(0.98);
                transition: transform 0.15s ease;
            }
            
            #${this.config.gridId} .showcase-category-card:active img {
                transform: scale(1.02);
                transition: transform 0.3s ease;
            }
            
            #${this.config.gridId} .showcase-category-card:active svg {
                transform: translateX(6px);
                transition: transform 0.2s ease;
            }
            
            /* Mobile adjustments */
            @media (max-width: 767px) {
                #${this.config.gridId} .showcase-category-card > div:last-child {
                    padding: 20px;
                }
                
                #${this.config.gridId} .showcase-category-card h3 {
                    font-size: 18px;
                    margin-bottom: 12px;
                }
            }
        </style>`;

        // Combine everything
        const existingStyles = document.getElementById('showcase-grid-styles');
        if (existingStyles) existingStyles.remove();

        grid.innerHTML = cardsHTML;
        document.head.insertAdjacentHTML('beforeend', gridStyles);

        // Insert header before grid if exists
        if (headerHTML) {
            const existingHeader = section.querySelector('.showcase-header');
            if (existingHeader) existingHeader.remove();
            grid.insertAdjacentHTML('beforebegin', headerHTML);
        }

        this.isLoaded = true;
        console.log('[CategoryShowcase] Rendered successfully');
    }

    createSlug(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Method to refresh data and re-render
    async refresh() {
        await this.fetchData();
        if (this.hasData()) {
            this.render();
        } else {
            this.hide();
        }
    }

    // Method to filter by gender
    filterByGender(gender) {
        if (!this.isLoaded) return;
        
        const cards = document.querySelectorAll(`#${this.config.gridId} .showcase-category-card`);
        
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
// Initialize when DOM is ready
// ============================================================
function initCategoryShowcase() {
    // Wait for data to be loaded
    if (window.currentData && window.currentData.products && window.currentData.products.length > 0) {
        window.categoryShowcase = new HomeCategoryShowcase();
        
        // Hide old categories section if it exists
        const oldCategoriesGrid = document.querySelector('#categories-section .categories-grid');
        if (oldCategoriesGrid) {
            oldCategoriesGrid.innerHTML = '';
        }
    } else {
        // Listen for data loaded event
        window.addEventListener('jayenware:dataLoaded', () => {
            window.categoryShowcase = new HomeCategoryShowcase();
            
            // Hide old categories section
            const oldCategoriesGrid = document.querySelector('#categories-section .categories-grid');
            if (oldCategoriesGrid) {
                oldCategoriesGrid.innerHTML = '';
            }
        }, { once: true });
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategoryShowcase);
} else {
    initCategoryShowcase();
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomeCategoryShowcase;
}
