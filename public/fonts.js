// ============================================================
// JAYENWARE FONT CONFIGURATION
// Centralized font management for the entire application
// ============================================================

const JAYENWARE_FONTS = {
    // Primary fonts configuration
    primary: {
        heading: {
            family: "'Playfair Display', serif",
            weights: {
                regular: 400,
                bold: 700,
                black: 900
            },
            styles: ['normal', 'italic']
        },
        body: {
            family: "'Inter', sans-serif",
            weights: {
                light: 300,
                regular: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800,
                black: 900
            },
            styles: ['normal']
        }
    },
    
    // Font size scale (in pixels)
    scale: {
        // Titles
        'title-xl': { size: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, weight: 900, font: 'heading' },
        'title-lg': { size: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1.2, weight: 700, font: 'heading' },
        'title-md': { size: 'clamp(1.25rem, 3vw, 2rem)', lineHeight: 1.2, weight: 700, font: 'heading' },
        'title-sm': { size: 'clamp(1rem, 2.5vw, 1.5rem)', lineHeight: 1.3, weight: 600, font: 'heading' },
        
        // Subtitles
        'subtitle-lg': { size: 'clamp(1.125rem, 2vw, 1.25rem)', lineHeight: 1.4, weight: 500, font: 'body' },
        'subtitle-md': { size: 'clamp(1rem, 1.5vw, 1.125rem)', lineHeight: 1.4, weight: 500, font: 'body' },
        'subtitle-sm': { size: '0.875rem', lineHeight: 1.5, weight: 500, font: 'body' },
        
        // Body text
        'body-lg': { size: '1.125rem', lineHeight: 1.6, weight: 400, font: 'body' },
        'body-md': { size: '1rem', lineHeight: 1.6, weight: 400, font: 'body' },
        'body-sm': { size: '0.875rem', lineHeight: 1.5, weight: 400, font: 'body' },
        'body-xs': { size: '0.75rem', lineHeight: 1.5, weight: 400, font: 'body' },
        
        // Small descriptions
        'caption': { size: '0.75rem', lineHeight: 1.4, weight: 500, font: 'body' },
        'overline': { size: '0.625rem', lineHeight: 1.4, weight: 600, font: 'body', letterSpacing: '0.1em', textTransform: 'uppercase' }
    },
    
    // Utility function to get font CSS
    getFontCSS(type) {
        const config = this.scale[type];
        if (!config) return '';
        
        const family = config.font === 'heading' ? this.primary.heading.family : this.primary.body.family;
        const css = {
            fontFamily: family,
            fontSize: config.size,
            lineHeight: config.lineHeight,
            fontWeight: config.weight
        };
        
        if (config.letterSpacing) css.letterSpacing = config.letterSpacing;
        if (config.textTransform) css.textTransform = config.textTransform;
        
        return Object.entries(css).map(([key, value]) => {
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value};`;
        }).join('\n');
    },
    
    // Get Tailwind classes based on font type
    getTailwindClasses(type) {
        const mapping = {
            'title-xl': 'font-serif text-4xl sm:text-5xl lg:text-6xl font-black',
            'title-lg': 'font-serif text-3xl sm:text-4xl lg:text-5xl font-bold',
            'title-md': 'font-serif text-2xl sm:text-3xl lg:text-4xl font-bold',
            'title-sm': 'font-serif text-xl sm:text-2xl font-semibold',
            'subtitle-lg': 'font-sans text-lg sm:text-xl font-medium',
            'subtitle-md': 'font-sans text-base sm:text-lg font-medium',
            'subtitle-sm': 'font-sans text-sm font-medium',
            'body-lg': 'font-sans text-lg',
            'body-md': 'font-sans text-base',
            'body-sm': 'font-sans text-sm',
            'body-xs': 'font-sans text-xs',
            'caption': 'font-sans text-xs font-medium',
            'overline': 'font-sans text-[10px] font-semibold uppercase tracking-wider'
        };
        
        return mapping[type] || '';
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JAYENWARE_FONTS;
}

// Make globally available
window.JAYENWARE_FONTS = JAYENWARE_FONTS;
