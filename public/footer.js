// ============================================================================
// footer.js - Professional Premium Footer Component
// Version: 2.0 (Strictly Database-Driven, No Hardcoded Text)
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

        /* ==================== GRIDS ==================== */
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
        
        .footer-payment-qr {
            width: 40px;
            height: 40px;
            margin-top: 5px;
            cursor: pointer;
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
        
        .footer-app-btn img {
            width: 20px;
            height: 20px;
        }

        /* ==================== COUNTRY SELECTOR ==================== */
        .footer-country-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 5px 12px;
            max-width: 280px;
        }
        
        .footer-active-flag {
            width: 24px;
            height: auto;
            border-radius: 2px;
        }
        
        .footer-country-select {
            width: 100%;
            background: transparent;
            color: inherit;
            border: none;
            padding: 8px 0;
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
            padding-left: 5px;
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
        
        .footer-layout-centered .footer-country-wrapper {
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
// SOCIAL ICONS SVG DICTIONARY
// ============================================================================
function getSocialIconHTML(platform, link) {
    const icons = {
        'facebook': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'instagram': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.908 12.2384 16.0396 11.4077 15.9059C10.5771 15.7722 9.80971 15.3801 9.21479 14.7851C8.61987 14.1902 8.2278 13.4228 8.09412 12.5922C7.96044 11.7615 8.092 10.9098 8.47026 10.1583C8.84852 9.40678 9.45418 8.7937 10.2009 8.4062C10.9477 8.0187 11.7978 7.87652 12.63 8C13.4789 8.12583 14.2648 8.52151 14.8716 9.12836C15.4785 9.73521 15.8742 10.5211 16 11.37Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`,
        'youtube': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8387 5.15941C21.4982 4.80824 21.0708 4.55518 20.6 4.43C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92916 4.58518 2.50178 4.83824 2.16132 5.18941C1.82085 5.54057 1.57882 5.97541 1.46 6.45C1.14521 8.17418 0.991095 9.92534 1 11.68C0.991095 13.4347 1.14521 15.1858 1.46 16.91C1.57882 17.3846 1.82085 17.8194 2.16132 18.1706C2.50178 18.5218 2.92916 18.7748 3.4 18.9C5.12 19.36 12 19.36 12 19.36C12 19.36 18.88 19.36 20.6 18.9C21.0708 18.7748 21.4982 18.5218 21.8387 18.1706C22.1792 17.8194 22.4212 17.3846 22.54 16.91C22.8548 15.1858 23.0089 13.4347 23 11.68C23.0089 9.92534 22.8548 8.17418 22.54 6.42Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.75 15.02L15.5 11.68L9.75 8.34V15.02Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'tiktok': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12V8.5C9 6.01472 11.0147 4 13.5 4H16M9 20C7.34315 20 6 18.6569 6 17C6 15.3431 7.34315 14 9 14C10.6569 14 12 15.3431 12 17V4M20 8V12C18.3431 12 17 10.6569 17 9V8H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'x': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor"/></svg>`,
        'pinterest': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16C8 16 6 10 6 8C6 4 9 2 12 2C16 2 18 5 18 8C18 12 16 16 13 16C11 16 10 14 10 14M10 14L8 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg>`,
        'threads': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M16.5 10.5C16.5 10.5 15.5 8 12 8C8.5 8 7.5 10.5 7.5 12.5C7.5 14.5 8.5 16.5 12 16.5C14.5 16.5 15.5 14.5 15.5 13.5C15.5 12.5 14.5 12 13 12C11.5 12 10.5 12.5 10.5 13.5C10.5 14.5 11.5 15 12 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
        'whatsapp': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C9.38318 21 7.42019 20.3098 5.86667 19.1333L2 20L2.86667 16.1333C1.69019 14.5798 1 12.6168 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8.5C8 8.5 8.5 7.5 9.5 7.5C10.5 7.5 11 8 11.5 9C12 10 12.5 10.5 13 11C13.5 11.5 14 12 14.5 12.5C15 13 15.5 13.5 16 14.5C16.5 15.5 16 16 16 16L15 16.5C14.5 16.5 13.5 16 13 15.5C12.5 15 11 13.5 10.5 13C10 12.5 9.5 12 9 11.5C8.5 11 8 10.5 8 9.5C8 8.5 8 8.5 8 8.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
        'linkedin': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9H2V21H6V9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 12V21H18V12C18 10.5 17.5 9 16 9C14.5 9 14 10.5 14 12V21H10V9H14V11C14 11 14.5 9.5 16.5 9.5C18.5 9.5 22 10.5 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`,
        'email': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };
    
    return icons[platform] || null;
}

// ============================================================================
// MAIN RENDER FUNCTION
// ============================================================================
async function renderFooter() {
    if (document.getElementById('main-footer')) return;
    injectFooterStyles();

    try {
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error('Footer API failed');
        const footerData = await response.json();
        
        // Extract DB Arrays completely (Ensuring everything maps correctly)
        const content = footerData.content || [];
        const socialLinks = footerData.socialLinks || [];
        const menus = footerData.menus || [];
        const paymentMethods = footerData.paymentMethods || [];
        const shippingPartners = footerData.shippingPartners || [];
        const certifications = footerData.certifications || [];
        const appLinks = footerData.appLinks || [];
        const countries = footerData.countries || [];
        const trustBadges = footerData.trustBadges || [];
        const settings = footerData.settings || {};
        
        // =====================================================================
        // SETTINGS & CONTENT MERGE (No defaults, entirely from DB)
        // =====================================================================
        const bgColor = settings.background_color || 'transparent';
        const textColor = settings.text_color || 'inherit';
        const layoutStyle = settings.layout_style || 'standard';
        const customCSS = settings.custom_css || '';
        const version = settings.version ? \`v\${settings.version}\` : '';
        
        let brandTitle = '', brandDesc = '', brandLogo = '', brandCopyright = '';
        let contactEmail = '', contactPhone = '', contactAddress = '', contactHours = '';
        
        content.forEach(c => {
            if (c.title) brandTitle = c.title;
            if (c.description) brandDesc = c.description;
            if (c.logo_url) brandLogo = c.logo_url;
            if (c.copyright_text) brandCopyright = c.copyright_text;
            if (c.email) contactEmail = c.email;
            if (c.phone) contactPhone = c.phone;
            if (c.address) contactAddress = c.address;
            if (c.working_hours) contactHours = c.working_hours;
        });

        // Use settings fallback for copyright if content table is empty
        if (!brandCopyright && settings.copyright_text) brandCopyright = settings.copyright_text;
        
        // =====================================================================
        // HTML GENERATORS
        // =====================================================================
        
        // 1. Social Links
        let socialIconsHTML = '';
        if (settings.show_social_links !== false && socialLinks.length > 0) {
            socialIconsHTML = socialLinks
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(link => {
                    const platform = (link.platform_name || '').toLowerCase().replace(/\\s+/g, '');
                    const title = link.hover_title || link.platform_name || '';
                    
                    if (link.platform_icon && link.platform_icon.trim() !== '') {
                        return \`<a href="\${link.link_url}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="\${link.platform_name}" title="\${title}"><img src="\${link.platform_icon}" alt="\${link.platform_name}"></a>\`;
                    }
                    
                    const svgData = getSocialIconHTML(platform);
                    if (svgData) {
                        return \`<a href="\${link.link_url}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="\${link.platform_name}" title="\${title}">\${svgData}</a>\`;
                    }
                    return '';
                }).join('');
            
            if (socialIconsHTML) {
                socialIconsHTML = \`<div class="social-icons-grid">\${socialIconsHTML}</div>\`;
            }
        }

        // 2. App Links
        let appHTML = '';
        if (settings.show_app_links !== false && appLinks.length > 0) {
            const sortedApps = [...appLinks].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            appHTML = \`
            <div class="footer-section">
                <div class="footer-app-grid">
                    \${sortedApps.map(app => {
                        let btns = '';
                        const iconImg = app.icon_url ? \`<img src="\${app.icon_url}" alt="\${app.platform_name}">\` : '';
                        if (app.app_store_url) {
                            btns += \`<a href="\${app.app_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn" title="Download on App Store">\${iconImg} App Store</a>\`;
                        }
                        if (app.play_store_url) {
                            btns += \`<a href="\${app.play_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn" title="Get it on Google Play">\${iconImg} Play Store</a>\`;
                        }
                        return btns;
                    }).join('')}
                </div>
            </div>\`;
        }

        // 3. Country Selector (FIXED: No HTML tags inside <option>)
        let countryHTML = '';
        if (settings.show_country_selector !== false && countries.length > 0) {
            const sortedCountries = [...countries].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            const defaultCountry = sortedCountries.find(c => c.is_default) || sortedCountries[0];
            
            // To show the flag properly without breaking the select, we place it next to the dropdown
            const activeFlag = defaultCountry?.flag_url ? \`<img src="\${defaultCountry.flag_url}" class="footer-active-flag" alt="\${defaultCountry.country_code}">\` : '';
            
            countryHTML = \`
            <div class="footer-section">
                <div class="footer-country-wrapper">
                    \${activeFlag}
                    <select class="footer-country-select" onchange="if(this.value) window.location.href=this.value" aria-label="Select country">
                        \${sortedCountries.map(country => {
                            const currencyStr = country.currency_symbol || country.currency_code || '';
                            const langStr = country.language_name || country.language_code || '';
                            const label = \`\${country.country_name} \${currencyStr ? '- ' + currencyStr : ''} \${langStr ? '(' + langStr + ')' : ''}\`.trim();
                            const selected = country.country_code === defaultCountry.country_code ? 'selected' : '';
                            return \`<option value="?country=\${country.country_code}&lang=\${country.language_code || ''}" \${selected}>\${label}</option>\`;
                        }).join('')}
                    </select>
                </div>
                \${defaultCountry?.exchange_rate && defaultCountry.exchange_rate != 1 ? 
                    \`<p class="footer-exchange-rate">Exchange Rate: 1 USD = \${defaultCountry.currency_symbol || ''}\${defaultCountry.exchange_rate}</p>\` : ''}
            </div>\`;
        }

        // 4. Contact Block
        let contactBlock = '';
        if (contactEmail || contactPhone || contactAddress || contactHours) {
            contactBlock = \`
                \${contactEmail ? \`<div class="footer-contact-item"><span class="footer-contact-icon">✉</span><span class="footer-contact-text"><a href="mailto:\${contactEmail}">\${contactEmail}</a></span></div>\` : ''}
                \${contactPhone ? \`<div class="footer-contact-item"><span class="footer-contact-icon">☎</span><span class="footer-contact-text"><a href="tel:\${contactPhone}">\${contactPhone}</a></span></div>\` : ''}
                \${contactAddress ? \`<div class="footer-contact-item"><span class="footer-contact-icon">📍</span><span class="footer-contact-text">\${contactAddress}</span></div>\` : ''}
                \${contactHours ? \`<div class="footer-contact-item"><span class="footer-contact-icon">🕐</span><span class="footer-contact-text">\${contactHours}</span></div>\` : ''}
            \`;
        }

        // 5. Payment Methods
        let paymentHTML = '';
        if (settings.show_payment_methods !== false && paymentMethods.length > 0) {
            const sortedPayments = [...paymentMethods].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            paymentHTML = \`
            <div class="footer-section">
                <div class="footer-payment-grid">
                    \${sortedPayments.map(pm => {
                        let item = '';
                        if (pm.icon_url) item += \`<img src="\${pm.icon_url}" alt="\${pm.name}" class="footer-payment-icon" title="\${pm.name}">\`;
                        else item += \`<span class="footer-payment-name">\${pm.name}</span>\`;
                        if (pm.account_number) item += \`<span class="footer-payment-account">\${pm.account_number}</span>\`;
                        if (pm.qr_code_url) item += \`<img src="\${pm.qr_code_url}" alt="\${pm.name} QR" class="footer-payment-qr" title="Scan QR" onclick="window.open('\${pm.qr_code_url}', '_blank')">\`;
                        return \`<div class="footer-payment-item">\${item}</div>\`;
                    }).join('')}
                </div>
            </div>\`;
        }

        // 6. Shipping & Certifications & Badges
        const renderGridSection = (dataList, className, hasLink = false) => {
            if (!dataList || dataList.length === 0) return '';
            const sorted = [...dataList].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            
            const gridHTML = sorted.map(item => {
                const imgHTML = (item.icon_url || item.badge_url) ? \`<img src="\${item.icon_url || item.badge_url}" alt="\${item.name || item.title}" class="footer-\${className}-icon">\` : \`<span>\${item.name || item.title}</span>\`;
                const subtitleHTML = item.subtitle ? \`<p class="footer-badge-subtitle">\${item.subtitle}</p>\` : '';
                
                const inner = \`\${imgHTML}\${subtitleHTML}\`;
                
                if (hasLink && item.link_url) {
                    return \`<a href="\${item.link_url}" target="_blank" rel="noopener noreferrer" class="footer-\${className}-item" title="\${item.name || item.title}">\${inner}</a>\`;
                }
                return \`<div class="footer-\${className}-item" title="\${item.name || item.title}">\${inner}</div>\`;
            }).join('');
            
            return \`<div class="footer-section"><div class="footer-\${className}-grid">\${gridHTML}</div></div>\`;
        };

        const shippingHTML = renderGridSection(shippingPartners, 'shipping');
        const certHTML = renderGridSection(certifications, 'cert', true);
        const badgesHTML = renderGridSection(trustBadges, 'badges');

        // 7. Menus & Links
        let menuColumnsHTML = '';
        if (menus.length > 0) {
            const sortedMenus = [...menus].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            menuColumnsHTML = sortedMenus.map(menu => {
                const links = menu.links || [];
                const sortedLinks = [...links].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                
                const topLevelLinks = sortedLinks.filter(l => !l.parent_id);
                const childLinks = sortedLinks.filter(l => l.parent_id);
                
                if(topLevelLinks.length === 0) return ''; // Skip empty menu columns

                return \`
                <div>
                    <h5 class="footer-section-title">\${menu.title}</h5>
                    <ul class="footer-links-list">
                        \${topLevelLinks.map(link => {
                            const target = link.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';
                            const icon = link.icon_class ? \`<i class="\${link.icon_class}"></i>\` : '';
                            const desc = link.description ? \`<span class="footer-link-desc">\${link.description}</span>\` : '';
                            
                            const children = childLinks.filter(cl => cl.parent_id === link.id);
                            let childrenHTML = '';
                            if (children.length > 0) {
                                childrenHTML = \`
                                <ul class="footer-nested-links">
                                    \${children.map(child => {
                                        const childTarget = child.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';
                                        const childIcon = child.icon_class ? \`<i class="\${child.icon_class}"></i>\` : '';
                                        return \`<li><a href="\${child.link_url || '#'}" \${childTarget}>\${childIcon}\${child.title}</a></li>\`;
                                    }).join('')}
                                </ul>\`;
                            }
                            
                            return \`<li><a href="\${link.link_url || '#'}" \${target}>\${icon}\${link.title}</a>\${desc}\${childrenHTML}</li>\`;
                        }).join('')}
                    </ul>
                </div>\`;
            }).join('');
        }

        // =====================================================================
        // LAYOUT & FINAL HTML INJECTION
        // =====================================================================
        let layoutClass = '';
        switch(layoutStyle) {
            case 'centered': layoutClass = 'footer-layout-centered'; break;
            case 'minimal': layoutClass = 'footer-layout-minimal'; break;
            case 'expanded': layoutClass = 'footer-layout-expanded'; break;
        }

        const footerHTML = \`
        <footer class="pt-12 pb-6 \${layoutClass}" id="main-footer" style="background: \${bgColor} !important; color: \${textColor} !important;">
            \${customCSS ? \`<style>\${customCSS}</style>\` : ''}
            <div class="w-full px-4 lg:px-12">
                <div class="footer-grid">
                    
                    <div>
                        \${brandLogo ? \`<img src="\${brandLogo}" alt="\${brandTitle}" class="footer-brand-logo">\` : ''}
                        \${brandTitle ? \`<h4 class="footer-brand-title">\${brandTitle}</h4>\` : ''}
                        \${brandDesc ? \`<p class="footer-brand-desc">\${brandDesc}</p>\` : ''}
                        
                        \${socialIconsHTML}
                        \${appHTML}
                        \${countryHTML}
                    </div>
                    
                    \${menuColumnsHTML}
                    
                    <div>
                        \${contactBlock ? \`<div class="footer-section">\${contactBlock}</div>\` : ''}
                        \${paymentHTML}
                        \${shippingHTML}
                        \${certHTML}
                        \${badgesHTML}
                    </div>
                    
                </div>
                
                <div class="footer-bottom-bar">
                    <p>Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer">BINZEO Infrastructure</a> \${version}</p>
                    <p>\${brandCopyright}</p>
                </div>
            </div>
        </footer>
        \`;
        
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        
        // Handle RTL alignment for language/country if necessary
        if (countries.length > 0) {
            const defaultCountry = countries.find(c => c.is_default) || countries[0];
            if (defaultCountry?.is_rtl) {
                document.getElementById('main-footer').setAttribute('dir', 'rtl');
            }
        }
        
    } catch (error) {
        console.error('Footer Component failed to render:', error);
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter);
} else {
    setTimeout(renderFooter, 60);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFooter };
}
