// ============================================================================
// footer.js - Professional Premium Footer Component
// Version: 1.0 (Standalone Component with CSS & Configs)
// Brand: JABIYEN (Premium Apparel)
// ============================================================================

// ============================================================================
// INJECT FOOTER CSS STYLES
// ============================================================================
function injectFooterStyles() {
    if (document.getElementById("footer-components-style")) return;

    const styles = `
    <style id="footer-components-style">
        /* ==================== BASE FOOTER STYLES ==================== */
        #main-footer {
            font-family: var(--font-body, 'Inter', sans-serif);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
            z-index: 10;
        }
        
        #main-footer a {
            color: inherit;
            text-decoration: none;
            transition: color 0.3s ease, opacity 0.3s ease;
        }
        
        #main-footer a:hover {
            opacity: 0.7;
        }

        /* ==================== GRID LAYOUT ==================== */
        .footer-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        @media (min-width: 768px) {
            .footer-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (min-width: 1024px) {
            .footer-grid {
                grid-template-columns: 2fr 1fr 1fr 1.5fr;
                gap: 60px;
            }
        }

        /* ==================== BRANDING ==================== */
        .footer-brand-logo {
            max-width: 120px;
            margin-bottom: 20px;
            border-radius: 8px;
        }
        
        .footer-brand-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            text-transform: uppercase;
        }
        
        .footer-brand-desc {
            font-size: 0.875rem;
            line-height: 1.6;
            opacity: 0.7;
            margin-bottom: 24px;
            max-width: 300px;
        }

        /* ==================== SOCIAL ICONS ==================== */
        .social-icons-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .social-icon-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: inherit;
            transition: all 0.3s ease;
        }
        
        .social-icon-link:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
            opacity: 1 !important;
        }
        
        .social-icon-link svg {
            width: 18px;
            height: 18px;
        }
        
        .social-icon-link img {
            width: 18px;
            height: 18px;
            object-fit: contain;
        }

        /* ==================== SECTIONS & TYPOGRAPHY ==================== */
        .footer-section {
            margin-bottom: 32px;
        }
        
        .footer-section:last-child {
            margin-bottom: 0;
        }
        
        .footer-section-title {
            font-family: var(--font-heading, 'Manrope', sans-serif);
            font-size: 0.875rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 20px;
            opacity: 0.9;
        }

        /* ==================== LISTS & LINKS ==================== */
        .footer-links-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-links-list > li {
            margin-bottom: 12px;
            font-size: 0.875rem;
            opacity: 0.8;
        }
        
        .footer-links-list i {
            margin-right: 8px;
            font-size: 0.9em;
            opacity: 0.7;
        }
        
        .footer-link-desc {
            display: block;
            font-size: 0.75rem;
            opacity: 0.5;
            margin-top: 4px;
            padding-left: 16px;
        }
        
        .footer-nested-links {
            list-style: none;
            padding-left: 16px;
            margin-top: 8px;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .footer-nested-links > li {
            margin-bottom: 8px;
            font-size: 0.8125rem;
        }

        /* ==================== CONTACT INFO ==================== */
        .footer-contact-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
            font-size: 0.875rem;
            opacity: 0.8;
        }
        
        .footer-contact-icon {
            opacity: 0.6;
            font-size: 1.1em;
            line-height: 1.4;
        }

        /* ==================== GRIDS (Payments, Shipping, Certs) ==================== */
        .footer-payment-grid, .footer-shipping-grid, .footer-cert-grid, .footer-badges-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .footer-payment-item, .footer-cert-item, .footer-badge-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 8px 12px;
            border-radius: 8px;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            text-align: center;
        }
        
        .footer-payment-icon, .footer-shipping-icon, .footer-cert-icon, .footer-badge-icon {
            height: 24px;
            width: auto;
            object-fit: contain;
            margin-bottom: 4px;
        }

        /* ==================== APP BUTTONS ==================== */
        .footer-app-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .footer-app-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 10px 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.8125rem;
            transition: all 0.3s ease;
            width: fit-content;
        }
        
        .footer-app-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
            opacity: 1 !important;
        }

        /* ==================== COUNTRY SELECTOR ==================== */
        .footer-country-select {
            width: 100%;
            max-width: 250px;
            background: rgba(255, 255, 255, 0.05);
            color: inherit;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 10px 12px;
            border-radius: 8px;
            font-size: 0.875rem;
            appearance: none;
            cursor: pointer;
            outline: none;
        }
        
        .footer-country-select option {
            background: #1a1a1a;
            color: #ffffff;
        }
        
        .footer-exchange-rate {
            font-size: 0.75rem;
            opacity: 0.5;
            margin-top: 8px;
        }

        /* ==================== BOTTOM BAR ==================== */
        .footer-bottom-bar {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            font-size: 0.75rem;
            opacity: 0.6;
            text-align: center;
        }
        
        @media (min-width: 768px) {
            .footer-bottom-bar {
                flex-direction: row;
                text-align: left;
            }
        }

        /* ==================== LAYOUT MODIFIERS ==================== */
        .footer-layout-centered .footer-grid {
            text-align: center;
        }
        
        .footer-layout-centered .social-icons-grid,
        .footer-layout-centered .footer-payment-grid,
        .footer-layout-centered .footer-shipping-grid,
        .footer-layout-centered .footer-cert-grid,
        .footer-layout-centered .footer-badges-grid,
        .footer-layout-centered .footer-contact-item {
            justify-content: center;
        }
        
        .footer-layout-centered .footer-app-btn {
            margin: 0 auto;
        }

        .footer-layout-minimal .footer-brand-desc,
        .footer-layout-minimal .footer-app-grid,
        .footer-layout-minimal .footer-badges-grid {
            display: none;
        }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================================================
// SOCIAL ICONS - PREMIUM MONOCHROME SVG SET
// ============================================================================
function getSocialIconHTML(platform, link) {
    const icons = {
        'facebook': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        'instagram': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.908 12.2384 16.0396 11.4077 15.9059C10.5771 15.7722 9.80971 15.3801 9.21479 14.7851C8.61987 14.1902 8.2278 13.4228 8.09412 12.5922C7.96044 11.7615 8.092 10.9098 8.47026 10.1583C8.84852 9.40678 9.45418 8.7937 10.2009 8.4062C10.9477 8.0187 11.7978 7.87652 12.63 8C13.4789 8.12583 14.2648 8.52151 14.8716 9.12836C15.4785 9.73521 15.8742 10.5211 16 11.37Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`
        },
        'youtube': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8387 5.15941C21.4982 4.80824 21.0708 4.55518 20.6 4.43C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92916 4.58518 2.50178 4.83824 2.16132 5.18941C1.82085 5.54057 1.57882 5.97541 1.46 6.45C1.14521 8.17418 0.991095 9.92534 1 11.68C0.991095 13.4347 1.14521 15.1858 1.46 16.91C1.57882 17.3846 1.82085 17.8194 2.16132 18.1706C2.50178 18.5218 2.92916 18.7748 3.4 18.9C5.12 19.36 12 19.36 12 19.36C12 19.36 18.88 19.36 20.6 18.9C21.0708 18.7748 21.4982 18.5218 21.8387 18.1706C22.1792 17.8194 22.4212 17.3846 22.54 16.91C22.8548 15.1858 23.0089 13.4347 23 11.68C23.0089 9.92534 22.8548 8.17418 22.54 6.42Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.75 15.02L15.5 11.68L9.75 8.34V15.02Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        'tiktok': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12V8.5C9 6.01472 11.0147 4 13.5 4H16M9 20C7.34315 20 6 18.6569 6 17C6 15.3431 7.34315 14 9 14C10.6569 14 12 15.3431 12 17V4M20 8V12C18.3431 12 17 10.6569 17 9V8H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        'x': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor"/></svg>`
        },
        'pinterest': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16C8 16 6 10 6 8C6 4 9 2 12 2C16 2 18 5 18 8C18 12 16 16 13 16C11 16 10 14 10 14M10 14L8 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg>`
        },
        'threads': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M16.5 10.5C16.5 10.5 15.5 8 12 8C8.5 8 7.5 10.5 7.5 12.5C7.5 14.5 8.5 16.5 12 16.5C14.5 16.5 15.5 14.5 15.5 13.5C15.5 12.5 14.5 12 13 12C11.5 12 10.5 12.5 10.5 13.5C10.5 14.5 11.5 15 12 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
        },
        'whatsapp': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C9.38318 21 7.42019 20.3098 5.86667 19.1333L2 20L2.86667 16.1333C1.69019 14.5798 1 12.6168 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8.5C8 8.5 8.5 7.5 9.5 7.5C10.5 7.5 11 8 11.5 9C12 10 12.5 10.5 13 11C13.5 11.5 14 12 14.5 12.5C15 13 15.5 13.5 16 14.5C16.5 15.5 16 16 16 16L15 16.5C14.5 16.5 13.5 16 13 15.5C12.5 15 11 13.5 10.5 13C10 12.5 9.5 12 9 11.5C8.5 11 8 10.5 8 9.5C8 8.5 8 8.5 8 8.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`
        },
        'linkedin': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 12V21H18V12C18 10.5 17.5 9 16 9C14.5 9 14 10.5 14 12V21H10V9H14V11C14 11 14.5 9.5 16.5 9.5C18.5 9.5 22 10.5 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`
        },
        'email': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        },
        'google': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M12 6V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="2"/></svg>`
        },
        'maps': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C12 22 20 16 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 16 12 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/></svg>`
        },
        'linktree': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2V14M12 14L8 10M12 14L16 10M12 22V18M8 18L12 14M16 18L12 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="6" r="2" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="14" r="1" fill="currentColor"/></svg>`
        },
        'messenger': {
            svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 14.5 2.8 16.8 4.2 18.7L3.5 21.5L6.4 20.2C8.1 21.3 10.1 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 13L10 9.5L14 12.5L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        }
    };
    
    const iconData = icons[platform];
    if (!iconData) return null;
    
    return `
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${platform.charAt(0).toUpperCase() + platform.slice(1)}">
            ${iconData.svg}
        </a>
    `;
}

// ============================================================================
// FOOTER - PROFESSIONAL DATABASE-DRIVEN (ALL 11 TABLES - ALL COLUMNS)
// ============================================================================
async function renderFooter() {
    if (document.getElementById('main-footer')) return;
    
    // Inject CSS dynamically
    injectFooterStyles();

    try {
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error('Footer API failed');
        const footerData = await response.json();
        
        const { 
            content = [], 
            socialLinks = [], 
            menus = [], 
            paymentMethods = [], 
            shippingPartners = [], 
            certifications = [], 
            appLinks = [], 
            countries = [], 
            trustBadges = [], 
            settings = null 
        } = footerData;
        
        // =====================================================================
        // FOOTER SETTINGS
        // =====================================================================
        const bgColor = settings?.background_color || '#1a1a1a';
        const textColor = settings?.text_color || '#ffffff';
        const copyrightText = settings?.copyright_text || '© 2025 JayenWare. All Rights Reserved.';
        const layoutStyle = settings?.layout_style || 'standard';
        const version = settings?.version || '1.0';
        const showSocial = settings?.show_social_links !== false;
        const showPayment = settings?.show_payment_methods !== false;
        const showApp = settings?.show_app_links !== false;
        const showCountry = settings?.show_country_selector !== false;
        const customCSS = settings?.custom_css || '';
        
        // =====================================================================
        // FOOTER CONTENT - Merge ALL content rows
        // =====================================================================
        const mergedContent = {};
        content.forEach(c => {
            if (c.title) mergedContent.title = mergedContent.title || c.title;
            if (c.description) mergedContent.description = mergedContent.description || c.description;
            if (c.logo_url) mergedContent.logo_url = mergedContent.logo_url || c.logo_url;
            if (c.email) mergedContent.email = mergedContent.email || c.email;
            if (c.phone) mergedContent.phone = mergedContent.phone || c.phone;
            if (c.address) mergedContent.address = mergedContent.address || c.address;
            if (c.working_hours) mergedContent.working_hours = mergedContent.working_hours || c.working_hours;
            if (c.copyright_text) mergedContent.copyright_text = mergedContent.copyright_text || c.copyright_text;
        });
        
        const brandSection = content.find(c => c.section_name === 'brand') || {};
        const contactSection = content.find(c => c.section_name === 'contact') || {};
        const aboutSection = content.find(c => c.section_name === 'about') || {};
        const infoSection = content.find(c => c.section_name === 'info') || {};
        
        const brandTitle = brandSection.title || mergedContent.title || 'JABIYEN';
        const brandDesc = brandSection.description || aboutSection.description || mergedContent.description || 'Premium lifestyle apparel architecture.';
        const brandLogo = brandSection.logo_url || mergedContent.logo_url || '/logo.png';
        const brandCopyright = brandSection.copyright_text || infoSection.copyright_text || mergedContent.copyright_text || copyrightText;
        const contactEmail = contactSection.email || infoSection.email || brandSection.email || mergedContent.email || '';
        const contactPhone = contactSection.phone || infoSection.phone || brandSection.phone || mergedContent.phone || '';
        const contactAddress = contactSection.address || infoSection.address || brandSection.address || mergedContent.address || '';
        const contactHours = contactSection.working_hours || infoSection.working_hours || brandSection.working_hours || mergedContent.working_hours || '';
        
        // =====================================================================
        // SOCIAL LINKS
        // =====================================================================
        let socialIconsHTML = '';
        if (showSocial && socialLinks.length > 0) {
            socialIconsHTML = socialLinks
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(link => {
                    const platform = (link.platform_name || '').toLowerCase().replace(/\s+/g, '');
                    const hoverTitle = link.hover_title || link.platform_name || '';
                    
                    if (link.platform_icon && link.platform_icon.startsWith('http')) {
                        return `
                        <a href="${link.link_url || '#'}" target="_blank" rel="noopener noreferrer" 
                           class="social-icon-link" aria-label="${link.platform_name}" title="${hoverTitle}">
                            <img src="${link.platform_icon}" alt="${link.platform_name}">
                        </a>`;
                    }
                    
                    const iconHTML = getSocialIconHTML(platform, link.link_url || '#');
                    if (!iconHTML) return '';
                    
                    return iconHTML.replace(
                        `aria-label="${platform.charAt(0).toUpperCase() + platform.slice(1)}"`, 
                        `aria-label="${link.platform_name}" title="${hoverTitle}"`
                    );
                }).filter(html => html !== '').join('');
        }
        
        // =====================================================================
        // PAYMENT METHODS
        // =====================================================================
        let paymentHTML = '';
        if (showPayment && paymentMethods.length > 0) {
            const sortedPayments = [...paymentMethods].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            paymentHTML = `
            <div class="footer-section">
                <h5 class="footer-section-title">Payment Methods</h5>
                <div class="footer-payment-grid">
                    ${sortedPayments.map(pm => {
                        let itemHTML = '';
                        if (pm.icon_url) {
                            itemHTML += `<img src="${pm.icon_url}" alt="${pm.name}" class="footer-payment-icon" title="${pm.name}">`;
                        } else {
                            itemHTML += `<span class="footer-payment-name">${pm.name}</span>`;
                        }
                        if (pm.account_number) {
                            itemHTML += `<span class="footer-payment-account">${pm.account_number}</span>`;
                        }
                        if (pm.qr_code_url) {
                            itemHTML += `<img src="${pm.qr_code_url}" alt="${pm.name} QR" class="footer-payment-qr" title="Scan QR for ${pm.name}" onclick="window.open('${pm.qr_code_url}', '_blank')">`;
                        }
                        return `<div class="footer-payment-item">${itemHTML}</div>`;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // SHIPPING PARTNERS
        // =====================================================================
        let shippingHTML = '';
        if (shippingPartners.length > 0) {
            const sortedShipping = [...shippingPartners].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            shippingHTML = `
            <div class="footer-section">
                <h5 class="footer-section-title">Shipping Partners</h5>
                <div class="footer-shipping-grid">
                    ${sortedShipping.map(sp => {
                        return sp.icon_url 
                            ? `<img src="${sp.icon_url}" alt="${sp.name}" class="footer-shipping-icon" title="${sp.name}">`
                            : `<span class="footer-shipping-name">${sp.name}</span>`;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // CERTIFICATIONS
        // =====================================================================
        let certHTML = '';
        if (certifications.length > 0) {
            const sortedCerts = [...certifications].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            certHTML = `
            <div class="footer-section">
                <h5 class="footer-section-title">Certifications</h5>
                <div class="footer-cert-grid">
                    ${sortedCerts.map(cert => {
                        const badgeContent = cert.badge_url 
                            ? `<img src="${cert.badge_url}" alt="${cert.name}" class="footer-cert-icon">`
                            : `<span class="footer-cert-name">${cert.name}</span>`;
                        const nameContent = cert.badge_url ? `<span class="footer-cert-name">${cert.name}</span>` : '';
                        
                        if (cert.link_url) {
                            return `<a href="${cert.link_url}" target="_blank" rel="noopener noreferrer" class="footer-cert-item" title="${cert.name}">${badgeContent}${nameContent}</a>`;
                        }
                        return `<div class="footer-cert-item" title="${cert.name}">${badgeContent}${nameContent}</div>`;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // APP LINKS
        // =====================================================================
        let appHTML = '';
        if (showApp && appLinks.length > 0) {
            const sortedApps = [...appLinks].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            appHTML = `
            <div class="footer-section">
                <h5 class="footer-section-title">Download Our App</h5>
                <div class="footer-app-grid">
                    ${sortedApps.map(app => {
                        let buttons = '';
                        const iconImg = app.icon_url ? `<img src="${app.icon_url}" alt="${app.platform_name}">` : '';
                        
                        if (app.app_store_url) {
                            buttons += `<a href="${app.app_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn" title="Download on App Store">
                                ${iconImg || '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>'}
                                App Store
                            </a>`;
                        }
                        if (app.play_store_url) {
                            buttons += `<a href="${app.play_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn" title="Get it on Google Play">
                                ${iconImg || '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M14.94 11.5L17.5 8.94C17.66 8.78 17.66 8.53 17.5 8.37L16.14 7.01C15.98 6.85 15.73 6.85 15.57 7.01L13 9.58L10.43 7.01C10.27 6.85 10.02 6.85 9.86 7.01L8.5 8.37C8.34 8.53 8.34 8.78 8.5 8.94L11.06 11.5L8.5 14.06C8.34 14.22 8.34 14.47 8.5 14.63L9.86 15.99C10.02 16.15 10.27 16.15 10.43 15.99L13 13.42L15.57 15.99C15.73 16.15 15.98 16.15 16.14 15.99L17.5 14.63C17.66 14.47 17.66 14.22 17.5 14.06L14.94 11.5Z"/></svg>'}
                                Play Store
                            </a>`;
                        }
                        return buttons;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // COUNTRY SELECTOR
        // =====================================================================
        let countryHTML = '';
        if (showCountry && countries.length > 0) {
            const sortedCountries = [...countries].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            const defaultCountry = sortedCountries.find(c => c.is_default) || sortedCountries[0];
            
            countryHTML = `
            <div class="footer-section">
                <h5 class="footer-section-title">Country & Language</h5>
                <select class="footer-country-select" onchange="if(this.value) window.location.href=this.value" aria-label="Select country and language">
                    ${sortedCountries.map(country => {
                        const flagHTML = country.flag_url ? `<img src="${country.flag_url}" class="footer-country-flag" alt="${country.country_code}">` : '';
                        const currencyDisplay = country.currency_symbol || (country.currency_code ? country.currency_code + ' ' : '');
                        const langDisplay = country.language_name || (country.language_code ? country.language_code.toUpperCase() : '');
                        const label = `${country.country_name} ${currencyDisplay}${langDisplay ? '(' + langDisplay + ')' : ''}`;
                        const selected = country.is_default ? 'selected' : '';
                        return `<option value="?country=${country.country_code}&lang=${country.language_code || ''}" ${selected}>${flagHTML}${label.trim()}</option>`;
                    }).join('')}
                </select>
                ${defaultCountry?.exchange_rate && defaultCountry.exchange_rate !== 1 ? 
                    `<p class="footer-exchange-rate">Exchange Rate: 1 USD = ${defaultCountry.currency_symbol || ''}${defaultCountry.exchange_rate}</p>` : ''}
            </div>`;
        }
        
        // =====================================================================
        // TRUST BADGES
        // =====================================================================
        let badgesHTML = '';
        if (trustBadges.length > 0) {
            const sortedBadges = [...trustBadges].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            badgesHTML = `
            <div class="footer-section">
                <h5 class="footer-section-title">Trust & Security</h5>
                <div class="footer-badges-grid">
                    ${sortedBadges.map(badge => {
                        const badgeImg = badge.badge_url 
                            ? `<img src="${badge.badge_url}" alt="${badge.title}" class="footer-badge-icon">`
                            : `<span class="footer-badge-title">${badge.title}</span>`;
                        return `
                        <div class="footer-badge-item" title="${badge.title}${badge.subtitle ? ': ' + badge.subtitle : ''}">
                            ${badgeImg}
                            ${badge.badge_url ? `<p class="footer-badge-title">${badge.title}</p>` : ''}
                            ${badge.subtitle ? `<p class="footer-badge-subtitle">${badge.subtitle}</p>` : ''}
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
        }
        
        // =====================================================================
        // MENUS & QUICK LINKS
        // =====================================================================
        let menuColumnsHTML = '';
        if (menus.length > 0) {
            const sortedMenus = [...menus].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            menuColumnsHTML = sortedMenus.map(menu => {
                const links = menu.links || [];
                const sortedLinks = [...links].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                const topLevelLinks = sortedLinks.filter(l => !l.parent_id);
                const childLinks = sortedLinks.filter(l => l.parent_id);
                
                return `
                <div>
                    <h5 class="footer-section-title">${menu.title || 'Links'}</h5>
                    <ul class="footer-links-list">
                        ${topLevelLinks.map(link => {
                            const target = link.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';
                            const iconHTML = link.icon_class ? `<i class="${link.icon_class}"></i>` : '';
                            const descHTML = link.description ? `<span class="footer-link-desc">${link.description}</span>` : '';
                            
                            const children = childLinks.filter(cl => cl.parent_id === link.id);
                            let childrenHTML = '';
                            if (children.length > 0) {
                                childrenHTML = `
                                <ul class="footer-nested-links">
                                    ${children.map(child => {
                                        const childTarget = child.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';
                                        const childIcon = child.icon_class ? `<i class="${child.icon_class}"></i>` : '';
                                        const childDesc = child.description ? `<span class="footer-nested-desc">${child.description}</span>` : '';
                                        return `<li><a href="${child.link_url || '#'}" ${childTarget}>${childIcon}${child.title || ''}</a>${childDesc}</li>`;
                                    }).join('')}
                                </ul>`;
                            }
                            
                            return `<li><a href="${link.link_url || '#'}" ${target}>${iconHTML}${link.title || ''}</a>${descHTML}${childrenHTML}</li>`;
                        }).join('')}
                    </ul>
                </div>`;
            }).join('');
        }
        
        // =====================================================================
        // LAYOUT CLASS
        // =====================================================================
        let layoutClass = '';
        switch(layoutStyle) {
            case 'centered': layoutClass = 'footer-layout-centered'; break;
            case 'minimal': layoutClass = 'footer-layout-minimal'; break;
            case 'expanded': layoutClass = 'footer-layout-expanded'; break;
            default: layoutClass = '';
        }
        
        // =====================================================================
        // BUILD COMPLETE FOOTER HTML
        // =====================================================================
        const footerHTML = `
        <footer class="pt-12 pb-6 ${layoutClass}" id="main-footer" style="background: ${bgColor} !important; color: ${textColor} !important;">
            ${customCSS ? `<style>${customCSS}</style>` : ''}
            <div class="w-full px-4 lg:px-12">
                <div class="footer-grid">
                    <div>
                        ${brandLogo ? `<img src="${brandLogo}" alt="${brandTitle}" class="footer-brand-logo">` : ''}
                        <h4 class="footer-brand-title">${brandTitle}</h4>
                        <p class="footer-brand-desc">${brandDesc}</p>
                        
                        ${showSocial && socialIconsHTML ? `
                        <div class="social-icons-grid">
                            ${socialIconsHTML}
                        </div>` : ''}
                        
                        ${appHTML}
                        ${countryHTML}
                    </div>
                    
                    ${menuColumnsHTML}
                    
                    <div>
                        <h5 class="footer-section-title">Direct Contact</h5>
                        ${contactEmail ? `<div class="footer-contact-item"><span class="footer-contact-icon">✉</span><span class="footer-contact-text"><a href="mailto:${contactEmail}">${contactEmail}</a></span></div>` : ''}
                        ${contactPhone ? `<div class="footer-contact-item"><span class="footer-contact-icon">☎</span><span class="footer-contact-text"><a href="tel:${contactPhone}">${contactPhone}</a></span></div>` : ''}
                        ${contactAddress ? `<div class="footer-contact-item"><span class="footer-contact-icon">📍</span><span class="footer-contact-text">${contactAddress}</span></div>` : ''}
                        ${contactHours ? `<div class="footer-contact-item"><span class="footer-contact-icon">🕐</span><span class="footer-contact-text">${contactHours}</span></div>` : ''}
                        
                        ${paymentHTML}
                        ${shippingHTML}
                        ${certHTML}
                        ${badgesHTML}
                    </div>
                </div>
                
                <div class="footer-bottom-bar">
                    <p>Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer">BINZEO Infrastructure</a> ${version ? 'v' + version : ''}</p>
                    <p>${brandCopyright}</p>
                </div>
            </div>
        </footer>
        `;
        
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        
        if (countries.length > 0) {
            const defaultCountry = countries.find(c => c.is_default) || countries[0];
            if (defaultCountry?.is_rtl) {
                const footerEl = document.getElementById('main-footer');
                if (footerEl) footerEl.setAttribute('dir', 'rtl');
            }
        }
        
    } catch (error) {
        console.error('Footer render error:', error);
        const fallbackHTML = `
        <footer class="pt-12 pb-6" id="main-footer" style="background: #1a1a1a !important; color: #ffffff !important;">
            <div class="w-full px-4 lg:px-12 text-center">
                <p class="text-[10px] opacity-50">© ${new Date().getFullYear()} JayenWare. All Rights Reserved.</p>
                <p class="text-[8px] opacity-30 mt-1">Powered by BINZEO Infrastructure v1.0</p>
            </div>
        </footer>`;
        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
    }
}

// Ensure the footer renders on page load if needed, otherwise rely on external call
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
} else {
    setTimeout(renderFooter, 60);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFooter, getSocialIconHTML };
}
