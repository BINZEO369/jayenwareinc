// ============================================================================
// footer.js - Professional Premium Database-Driven Footer Component
// Version: 2.0 (Fully Dynamic Production Release)
// Brand: JAYENWARE / JABIYEN
// Infrastructure: BINZEO Infrastructure
// ============================================================================

// ============================================================================
// INJECT FOOTER CSS STYLES (Glassmorphism & High-End Dark UI Elements)
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
                grid-template-columns: 2fr 1.2fr 1.2fr 1.6fr;
                gap: 60px;
            }
        }

        /* ==================== BRANDING ==================== */
        .footer-brand-logo {
            max-height: 50px;
            width: auto;
            margin-bottom: 20px;
            object-fit: contain;
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
            max-width: 320px;
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
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: inherit;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .social-icon-link:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            opacity: 1 !important;
        }
        
        .social-icon-link svg, .social-icon-link img {
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
        }
        
        .footer-nested-links {
            list-style: none;
            padding-left: 14px;
            margin-top: 8px;
            border-left: 1px solid rgba(255, 255, 255, 0.08);
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
        }

        /* ==================== GRIDS (Payments, Shipping, Certs) ==================== */
        .footer-payment-grid, .footer-shipping-grid, .footer-cert-grid, .footer-badges-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        
        .footer-payment-item, .footer-cert-item, .footer-badge-item, .footer-shipping-item {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
            padding: 6px 10px;
            border-radius: 6px;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
        }
        
        .footer-payment-icon, .footer-shipping-icon, .footer-cert-icon, .footer-badge-icon {
            height: 20px;
            width: auto;
            object-fit: contain;
        }
        
        .footer-payment-account {
            font-size: 0.65rem;
            opacity: 0.5;
            margin-top: 2px;
        }

        /* ==================== APP BUTTONS ==================== */
        .footer-app-grid {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 15px;
        }
        
        .footer-app-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 14px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.8125rem;
            transition: all 0.3s ease;
            width: fit-content;
        }
        
        .footer-app-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateY(-1px);
        }

        /* ==================== COUNTRY SELECTOR ==================== */
        .footer-country-container {
            margin-top: 20px;
        }
        
        .footer-country-select {
            width: 100%;
            max-width: 260px;
            background: #1f1f1f;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            cursor: pointer;
            outline: none;
        }
        
        .footer-exchange-rate {
            font-size: 0.75rem;
            opacity: 0.5;
            margin-top: 6px;
            line-height: 1.4;
        }

        /* ==================== BOTTOM BAR ==================== */
        .footer-bottom-bar {
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 24px;
            margin-top: 20px;
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

        /* ==================== MODIFIERS ==================== */
        .footer-layout-centered { text-align: center; }
        .footer-layout-centered .footer-grid { text-align: center; }
        .footer-layout-centered .social-icons-grid,
        .footer-layout-centered .footer-payment-grid,
        .footer-layout-centered .footer-shipping-grid,
        .footer-layout-centered .footer-cert-grid,
        .footer-layout-centered .footer-badges-grid,
        .footer-layout-centered .footer-contact-item { justify-content: center; }
        .footer-layout-centered .footer-app-btn { margin: 0 auto; }

        .footer-layout-minimal .footer-brand-desc,
        .footer-layout-minimal .footer-app-grid,
        .footer-layout-minimal .footer-badges-grid { display: none; }
    </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ============================================================================
// PREMIUM MONOCHROME SVG ICON CODES FOR SOCIAL PLATFORMS
// ============================================================================
function getSocialIconHTML(platform, link) {
    const icons = {
        'facebook': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'instagram': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.908 12.2384 16.0396 11.4077 15.9059C10.5771 15.7722 9.80971 15.3801 9.21479 14.7851C8.61987 14.1902 8.2278 13.4228 8.09412 12.5922C7.96044 11.7615 8.092 10.9098 8.47026 10.1583C8.84852 9.40678 9.45418 8.7937 10.2009 8.4062C10.9477 8.0187 11.7978 7.87652 12.63 8C13.4789 8.12583 14.2648 8.52151 14.8716 9.12836C15.4785 9.73521 15.8742 10.5211 16 11.37Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`,
        'youtube': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8387 5.15941C21.4982 4.80824 21.0708 4.55518 20.6 4.43C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92916 4.58518 2.50178 4.83824 2.16132 5.18941C1.82085 5.54057 1.57882 5.97541 1.46 6.45C1.14521 8.17418 0.991095 9.92534 1 11.68C0.991095 13.4347 1.14521 15.1858 1.46 16.91C1.57882 17.3846 1.82085 17.8194 2.16132 18.1706C2.50178 18.5218 2.92916 18.7748 3.4 18.9C5.12 19.36 12 19.36 12 19.36C12 19.36 18.88 19.36 20.6 18.9C21.0708 18.7748 21.4982 18.5218 21.8387 18.1706C22.1792 17.8194 22.4212 17.3846 22.54 16.91C22.8548 15.1858 23.0089 13.4347 23 11.68C23.0089 9.92534 22.8548 8.17418 22.54 6.42Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.75 15.02L15.5 11.68L9.75 8.34V15.02Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'tiktok': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12V8.5C9 6.01472 11.0147 4 13.5 4H16M9 20C7.34315 20 6 18.6569 6 17C6 15.3431 7.34315 14 9 14C10.6569 14 12 15.3431 12 17V4M20 8V12C18.3431 12 17 10.6569 17 9V8H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'x': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor"/></svg>`,
        'linkedin': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 12V21H18V12C18 10.5 17.5 9 16 9C14.5 9 14 10.5 14 12V21H10V9H14V11C14 11 14.5 9.5 16.5 9.5C18.5 9.5 22 10.5 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`
    };
    
    const svg = icons[platform.toLowerCase()];
    if (!svg) return '';
    
    return `
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${platform}">
            ${svg}
        </a>
    `;
}

// ============================================================================
// RUN DIRECT OUTPUT - ALL TABLES REAL-TIME PARSING ENGINE
// ============================================================================
async function renderFooter() {
    if (document.getElementById('main-footer')) return;
    
    injectFooterStyles();

    try {
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error('Footer Configuration Endpoint Error');
        const db = await response.json();
        
        // Destructure database payload with array safe guards
        const { 
            content = [], socialLinks = [], menus = [], 
            paymentMethods = [], shippingPartners = [], certifications = [], 
            appLinks = [], countries = [], trustBadges = [], settings = {} 
        } = db;

        // Parse Context Settings
        const layoutStyle = settings?.layout_style || 'standard';
        const bgColor = settings?.background_color || '#1a1a1a';
        const textColor = settings?.text_color || '#ffffff';
        const globalCopyright = settings?.copyright_text || '';
        const systemVersion = settings?.version || '1.0';
        const customCSS = settings?.custom_css || '';

        // Flags
        const displaySocial = settings?.show_social_links !== false;
        const displayPayment = settings?.show_payment_methods !== false;
        const displayApps = settings?.show_app_links !== false;
        const displayCountry = settings?.show_country_selector !== false;

        // Map Section Content Rows safely
        const brandData = content.find(c => c.section_name === 'brand' && c.is_active) || {};
        const contactData = content.find(c => c.section_name === 'contact' && c.is_active) || {};

        // 1. Social Media Processing
        let socialHTML = '';
        if (displaySocial && socialLinks.length > 0) {
            socialHTML = socialLinks
                .filter(s => s.is_active)
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(s => {
                    if (s.platform_icon && s.platform_icon.startsWith('http')) {
                        return `<a href="${s.link_url}" target="_blank" rel="noopener noreferrer" class="social-icon-link" title="${s.hover_title || s.platform_name}"><img src="${s.platform_icon}" alt="${s.platform_name}"></a>`;
                    }
                    return getSocialIconHTML(s.platform_name, s.link_url);
                }).join('');
        }

        // 2. Navigation Architecture Engine
        let menusHTML = '';
        if (menus.length > 0) {
            menusHTML = menus
                .filter(m => m.is_active)
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(menu => {
                    const links = menu.links || [];
                    const structuredLinks = links.filter(l => l.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                    const parents = structuredLinks.filter(l => !l.parent_id);
                    const nested = structuredLinks.filter(l => l.parent_id);

                    return `
                    <div>
                        <h5 class="footer-section-title">${menu.title}</h5>
                        <ul class="footer-links-list">
                            ${parents.map(p => {
                                const target = p.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';
                                const icon = p.icon_class ? `<i class="${p.icon_class}"></i>` : '';
                                const subText = p.description ? `<span class="footer-link-desc">${p.description}</span>` : '';
                                
                                const subLinks = nested.filter(n => Number(n.parent_id) === Number(p.id));
                                let subLinksHTML = '';
                                if (subLinks.length > 0) {
                                    subLinksHTML = `
                                    <ul class="footer-nested-links">
                                        ${subLinks.map(sub => {
                                            const subTarget = sub.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';
                                            const subIcon = sub.icon_class ? `<i class="${sub.icon_class}"></i>` : '';
                                            return `<li><a href="${sub.link_url}" ${subTarget}>${subIcon}${sub.title}</a></li>`;
                                        }).join('')}
                                    </ul>`;
                                }
                                return `<li><a href="${p.link_url}" ${target}>${icon}${p.title}</a>${subText}${subLinksHTML}</li>`;
                            }).join('')}
                        </ul>
                    </div>`;
                }).join('');
        }

        // 3. Payment Methods Processor
        let paymentHTML = '';
        if (displayPayment && paymentMethods.length > 0) {
            const activePayments = paymentMethods.filter(p => p.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            if (activePayments.length > 0) {
                paymentHTML = `
                <div class="footer-section">
                    <h5 class="footer-section-title">Methods of Payment</h5>
                    <div class="footer-payment-grid">
                        ${activePayments.map(p => `
                            <div class="footer-payment-item" title="${p.name}">
                                ${p.icon_url ? `<img src="${p.icon_url}" alt="${p.name}" class="footer-payment-icon">` : `<span>${p.name}</span>`}
                                ${p.account_number ? `<span class="footer-payment-account">${p.account_number}</span>` : ''}
                                ${p.qr_code_url ? `<img src="${p.qr_code_url}" class="footer-payment-qr-trigger mt-1 h-4 w-auto cursor-pointer" onclick="window.open('${p.qr_code_url}','_blank')" alt="QR">` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }
        }

        // 4. Shipping Carriers Processing
        let shippingHTML = '';
        if (shippingPartners.length > 0) {
            const activeShipping = shippingPartners.filter(s => s.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            if (activeShipping.length > 0) {
                shippingHTML = `
                <div class="footer-section">
                    <h5 class="footer-section-title">Shipping Network</h5>
                    <div class="footer-shipping-grid">
                        ${activeShipping.map(s => `
                            <div class="footer-shipping-item" title="${s.name}">
                                ${s.icon_url ? `<img src="${s.icon_url}" alt="${s.name}" class="footer-shipping-icon">` : `<span>${s.name}</span>`}
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }
        }

        // 5. Corporate Certifications Architecture
        let certsHTML = '';
        if (certifications.length > 0) {
            const activeCerts = certifications.filter(c => c.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            if (activeCerts.length > 0) {
                certsHTML = `
                <div class="footer-section">
                    <h5 class="footer-section-title">Compliance & Certifications</h5>
                    <div class="footer-cert-grid">
                        ${activeCerts.map(c => {
                            const inner = c.badge_url ? `<img src="${c.badge_url}" alt="${c.name}" class="footer-cert-icon">` : `<span>${c.name}</span>`;
                            return c.link_url ? `<a href="${c.link_url}" target="_blank" rel="noopener noreferrer" class="footer-cert-item">${inner}</a>` : `<div class="footer-cert-item">${inner}</div>`;
                        }).join('')}
                    </div>
                </div>`;
            }
        }

        // 6. Native Enterprise Mobile Application Store Engine
        let applicationsHTML = '';
        if (displayApps && appLinks.length > 0) {
            const activeApps = appLinks.filter(a => a.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            if (activeApps.length > 0) {
                applicationsHTML = `
                <div class="footer-section">
                    <h5 class="footer-section-title">Enterprise Systems</h5>
                    <div class="footer-app-grid">
                        ${activeApps.map(a => {
                            let links = '';
                            const appIcon = a.icon_url ? `<img src="${a.icon_url}" class="w-4 h-4" alt="Icon">` : '';
                            if (a.app_store_url) {
                                links += `<a href="${a.app_store_url}" target="_blank" class="footer-app-btn">${appIcon} iOS Platform</a>`;
                            }
                            if (a.play_store_url) {
                                links += `<a href="${a.play_store_url}" target="_blank" class="footer-app-btn">${appIcon} Android Core</a>`;
                            }
                            return links;
                        }).join('')}
                    </div>
                </div>`;
            }
        }

        // 7. Trust Badges Processing
        let trustHTML = '';
        if (trustBadges.length > 0) {
            const activeBadges = trustBadges.filter(b => b.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            if (activeBadges.length > 0) {
                trustHTML = `
                <div class="footer-section">
                    <h5 class="footer-section-title">System Integrity</h5>
                    <div class="footer-badges-grid">
                        ${activeBadges.map(b => `
                            <div class="footer-badge-item" title="${b.title} - ${b.subtitle || ''}">
                                ${b.badge_url ? `<img src="${b.badge_url}" alt="${b.title}" class="footer-badge-icon">` : `<span>${b.title}</span>`}
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }
        }

        // 8. Internationalization Country Engine (Fixed Option Logic Interface)
        let nativeCountryHTML = '';
        let initialExchangeNodeText = '';
        
        if (displayCountry && countries.length > 0) {
            const activeCountries = countries.filter(c => c.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            if (activeCountries.length > 0) {
                const standardDefault = activeCountries.find(c => c.is_default) || activeCountries[0];
                
                if (standardDefault?.exchange_rate && Number(standardDefault.exchange_rate) !== 1) {
                    initialExchangeNodeText = `Exchange Engine Protocol: 1 USD = ${standardDefault.currency_symbol || ''}${standardDefault.exchange_rate} ${standardDefault.currency_code}`;
                }

                nativeCountryHTML = `
                <div class="footer-section footer-country-container">
                    <h5 class="footer-section-title">Regional Gateway</h5>
                    <select class="footer-country-select" id="footer-gateway-selector" aria-label="Regional Infrastructure Core Routing">
                        ${activeCountries.map(c => {
                            const selected = c.is_default ? 'selected' : '';
                            const symDisplay = c.currency_symbol ? ` [${c.currency_symbol}]` : '';
                            const langDisplay = c.language_name ? ` - ${c.language_name}` : '';
                            return `<option value="${c.country_code}" data-symbol="${c.currency_symbol || ''}" data-rate="${c.exchange_rate || 1}" data-code="${c.currency_code || ''}" data-rtl="${c.is_rtl}" ${selected}>${c.country_name}${symDisplay}${langDisplay}</option>`;
                        }).join('')}
                    </select>
                    <p class="footer-exchange-rate" id="footer-exchange-protocol-text">${initialExchangeNodeText}</p>
                </div>`;
            }
        }

        // Core Layout CSS String parsing modifier
        let layoutModifierClass = '';
        if (layoutStyle === 'centered') layoutModifierClass = 'footer-layout-centered';
        else if (layoutStyle === 'minimal') layoutModifierClass = 'footer-layout-minimal';

        // =====================================================================
        // EXECUTE MASTER COMPONENT BUILD
        // =====================================================================
        const fullFooterTemplate = `
        <footer class="pt-16 pb-8 ${layoutModifierClass}" id="main-footer" style="background: ${bgColor} !important; color: ${textColor} !important;">
            ${customCSS ? `<style>${customCSS}</style>` : ''}
            <div class="w-full px-6 lg:px-12">
                <div class="footer-grid">
                    <div>
                        ${brandData.logo_url ? `<img src="${brandData.logo_url}" alt="${brandData.title || ''}" class="footer-brand-logo">` : ''}
                        ${brandData.title ? `<h4 class="footer-brand-title">${brandData.title}</h4>` : ''}
                        ${brandData.description ? `<p class="footer-brand-desc">${brandData.description}</p>` : ''}
                        
                        ${displaySocial && socialHTML ? `<div class="social-icons-grid">${socialHTML}</div>` : ''}
                        ${applicationsHTML}
                        ${nativeCountryHTML}
                    </div>
                    
                    ${menusHTML}
                    
                    <div>
                        <h5 class="footer-section-title">Direct Connection</h5>
                        <ul class="footer-links-list" style="margin-bottom: 24px;">
                            ${contactData.email ? `<div class="footer-contact-item"><span class="footer-contact-icon">✉</span><span><a href="mailto:${contactData.email}">${contactData.email}</a></span></div>` : ''}
                            ${contactData.phone ? `<div class="footer-contact-item"><span class="footer-contact-icon">☎</span><span><a href="tel:${contactData.phone}">${contactData.phone}</a></span></div>` : ''}
                            ${contactData.address ? `<div class="footer-contact-item"><span class="footer-contact-icon">📍</span><span>${contactData.address}</span></div>` : ''}
                            ${contactData.working_hours ? `<div class="footer-contact-item"><span class="footer-contact-icon">🕐</span><span>${contactData.working_hours}</span></div>` : ''}
                        </ul>
                        
                        ${paymentHTML}
                        ${shippingHTML}
                        ${certsHTML}
                        ${trustHTML}
                    </div>
                </div>
                
                <div class="footer-bottom-bar">
                    <p>Architecture Matrix by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer" style="font-weight:600; text-decoration:underline;">BINZEO Infrastructure</a> v${systemVersion}</p>
                    <p>${brandData.copyright_text || globalCopyright || ('© ' + new Date().getFullYear() + ' System Engine.')}</p>
                </div>
            </div>
        </footer>`;

        document.body.insertAdjacentHTML('beforeend', fullFooterTemplate);

        // =====================================================================
        // CLIENT EVENT LISTENER & DOM LOGIC INJECTIONS
        // =====================================================================
        const selectorNode = document.getElementById('footer-gateway-selector');
        if (selectorNode) {
            // Initializing default text alignment configuration mapping matrix rules
            const currentSelectedOption = selectorNode.options[selectorNode.selectedIndex];
            if (currentSelectedOption && currentSelectedOption.getAttribute('data-rtl') === 'true') {
                document.getElementById('main-footer').setAttribute('dir', 'rtl');
            }

            selectorNode.addEventListener('change', function() {
                const option = this.options[this.selectedIndex];
                const code = option.value;
                const symbol = option.getAttribute('data-symbol');
                const rate = option.getAttribute('data-rate');
                const currCode = option.getAttribute('data-code');
                const isRtl = option.getAttribute('data-rtl') === 'true';

                // Handle system layout alignment shift dynamically
                const footerMainNode = document.getElementById('main-footer');
                if (isRtl) footerMainNode.setAttribute('dir', 'rtl');
                else footerMainNode.removeAttribute('dir');

                // Dynamic live execution context recalculation event handler simulation link
                const textProtocolNode = document.getElementById('footer-exchange-protocol-text');
                if (textProtocolNode) {
                    if (rate && Number(rate) !== 1) {
                        textProtocolNode.innerText = `Exchange Engine Protocol: 1 USD = ${symbol}${rate} ${currCode}`;
                    } else {
                        textProtocolNode.innerText = '';
                    }
                }
                
                // Dispatch system wide regional context update event notification pipeline
                const gatewayUpdateEvent = new CustomEvent('binzeo:regional:update', {
                    detail: { country: code, currency: currCode, symbol: symbol, rate: parseFloat(rate) }
                });
                window.dispatchEvent(gatewayUpdateEvent);
            });
        }

    } catch (err) {
        console.error('Core Engine Failure: Fallback Stack Initialized.', err);
        // Clean deployment recovery safety mesh block structure
        const disasterRecoveryTemplate = `
        <footer class="py-12" id="main-footer" style="background:#111 !important; color:#fff !important; text-align:center; font-family:sans-serif;">
            <div style="opacity:0.5; font-size:12px;">
                <p>© ${new Date().getFullYear()} JayenWare. All Rights Reserved.</p>
                <p style="font-size:10px; margin-top:4px;">Core Distributed Node Pipeline Online • BINZEO System Restored</p>
            </div>
        </footer>`;
        document.body.insertAdjacentHTML('beforeend', disasterRecoveryTemplate);
    }
}

// System Execution Dispatch Core Setup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
} else {
    setTimeout(renderFooter, 30);
}

// Module system compliance mapping protocol array
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFooter };
}
