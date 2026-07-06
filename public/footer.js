// ============================================================================
// footer.js - Professional Premium Footer Component (FULLY FIXED v4.0)
// Version: 4.0 (All 11 Tables | All Columns | Country Fixed | Visibility Fixed)
// Brand: JABIYEN (Premium Apparel)
// Load Order: Must load BEFORE components.js
// ============================================================================

// ============================================================================
// SOCIAL ICONS - PREMIUM MONOCHROME SVG SET
// ============================================================================
function getSocialIconHTML(platform, link) {
    const icons = {
        'facebook': { svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
        'instagram': { svg: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>` },
        'youtube': { svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8387 5.15941C21.4982 4.80824 21.0708 4.55518 20.6 4.43C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92916 4.58518 2.50178 4.83824 2.16132 5.18941C1.82085 5.54057 1.57882 5.97541 1.46 6.45C1.14521 8.17418 0.991095 9.92534 1 11.68C0.991095 13.4347 1.14521 15.1858 1.46 16.91C1.57882 17.3846 1.82085 17.8194 2.16132 18.1706C2.50178 18.5218 2.92916 18.7748 3.4 18.9C5.12 19.36 12 19.36 12 19.36C12 19.36 18.88 19.36 20.6 18.9C21.0708 18.7748 21.4982 18.5218 21.8387 18.1706C22.1792 17.8194 22.4212 17.3846 22.54 16.91C22.8548 15.1858 23.0089 13.4347 23 11.68C23.0089 9.92534 22.8548 8.17418 22.54 6.42Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.75 15.02L15.5 11.68L9.75 8.34V15.02Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
        'tiktok': { svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 12V8.5C9 6.01472 11.0147 4 13.5 4H16M9 20C7.34315 20 6 18.6569 6 17C6 15.3431 7.34315 14 9 14C10.6569 14 12 15.3431 12 17V4M20 8V12C18.3431 12 17 10.6569 17 9V8H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
        'x': { svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor"/></svg>` },
        'pinterest': { svg: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 16C8 16 6 10 6 8C6 4 9 2 12 2C16 2 18 5 18 8C18 12 16 16 13 16C11 16 10 14 10 14M10 14L8 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
        'threads': { svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M16.5 10.5C16.5 10.5 15.5 8 12 8C8.5 8 7.5 10.5 7.5 12.5C7.5 14.5 8.5 16.5 12 16.5C14.5 16.5 15.5 14.5 15.5 13.5C15.5 12.5 14.5 12 13 12C11.5 12 10.5 12.5 10.5 13.5C10.5 14.5 11.5 15 12 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
        'whatsapp': { svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C9.38318 21 7.42019 20.3098 5.86667 19.1333L2 20L2.86667 16.1333C1.69019 14.5798 1 12.6168 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5V11.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 8.5C8 8.5 8.5 7.5 9.5 7.5C10.5 7.5 11 8 11.5 9C12 10 12.5 10.5 13 11C13.5 11.5 14 12 14.5 12.5C15 13 15.5 13.5 16 14.5C16.5 15.5 16 16 16 16L15 16.5C14.5 16.5 13.5 16 13 15.5C12.5 15 11 13.5 10.5 13C10 12.5 9.5 12 9 11.5C8.5 11 8 10.5 8 9.5C8 8.5 8 8.5 8 8.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>` },
        'linkedin': { svg: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" stroke-width="2"/><path d="M7 10V17M7 7.01V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M11 10V17M17 10V17M14 10V13.5C14 15.5 17 15.5 17 13.5V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
        'email': { svg: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" stroke-width="2"/><path d="M2 7L12 14L22 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` }
    };
    const iconData = icons[platform];
    if (!iconData) return null;
    return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${platform}">${iconData.svg}</a>`;
}

// ============================================================================
// FOOTER RENDER - COMPLETE (ALL 11 TABLES + ALL COLUMNS + VISIBILITY FIXED)
// ============================================================================
async function renderFooter() {
    // Remove footer skeleton first
    const footerSkeleton = document.getElementById('footer-skeleton');
    if (footerSkeleton) footerSkeleton.remove();

    if (document.getElementById('main-footer')) {
        console.log('[Footer] Already rendered, skipping.');
        return;
    }

    console.log('[Footer] 🚀 Starting render...');

    try {
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const footerData = await response.json();
        console.log('[Footer] 📦 Data received:', {
            content: footerData.content?.length || 0,
            socialLinks: footerData.socialLinks?.length || 0,
            menus: footerData.menus?.length || 0,
            paymentMethods: footerData.paymentMethods?.length || 0,
            shippingPartners: footerData.shippingPartners?.length || 0,
            certifications: footerData.certifications?.length || 0,
            appLinks: footerData.appLinks?.length || 0,
            countries: footerData.countries?.length || 0,
            trustBadges: footerData.trustBadges?.length || 0,
            settings: footerData.settings ? 'present' : 'missing'
        });
        console.log('[Footer] 🌍 Countries data:', JSON.stringify(footerData.countries));

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
        // SETTINGS
        // =====================================================================
        const bgColor = settings?.background_color || '#0f0f0f';
        const textColor = settings?.text_color || '#ffffff';
        const copyrightText = settings?.copyright_text || `© ${new Date().getFullYear()} JayenWare. All Rights Reserved.`;
        const layoutStyle = settings?.layout_style || 'standard';
        const theme = settings?.theme || 'dark';
        const version = settings?.version || '1.0';
        const showSocial = settings?.show_social_links !== false;
        const showPayment = settings?.show_payment_methods !== false;
        const showApp = settings?.show_app_links !== false;
        const showCountry = settings?.show_country_selector !== false;
        const customCSS = settings?.custom_css || '';

        // =====================================================================
        // CONTENT
        // =====================================================================
        const mainContent = content.find(c => c.section_name === 'main') || content[0] || {};
        const contactSection = content.find(c => c.section_name === 'contact') || {};
        const brandTitle = mainContent.title || 'JABIYEN';
        const brandDesc = mainContent.description || 'Premium lifestyle apparel. Quality you can trust.';
        const brandLogo = mainContent.logo_url || '/logo.png';
        const contactEmail = contactSection.email || mainContent.email || '';
        const contactPhone = contactSection.phone || mainContent.phone || '';
        const contactAddress = contactSection.address || mainContent.address || '';
        const contactHours = contactSection.working_hours || mainContent.working_hours || '';
        const displayCopyright = mainContent.copyright_text || copyrightText;

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
                        return `<a href="${link.link_url || '#'}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${link.platform_name}" title="${hoverTitle}"><img src="${link.platform_icon}" alt="${link.platform_name}"></a>`;
                    }
                    const iconHTML = getSocialIconHTML(platform, link.link_url || '#');
                    if (!iconHTML) return `<a href="${link.link_url || '#'}" target="_blank" class="social-icon-link" title="${hoverTitle}">🔗</a>`;
                    return iconHTML.replace(`aria-label="${platform}"`, `aria-label="${link.platform_name}" title="${hoverTitle}"`);
                })
                .filter(Boolean)
                .join('');
        }

        // =====================================================================
        // PAYMENT METHODS
        // =====================================================================
        let paymentHTML = '';
        if (showPayment && paymentMethods.length > 0) {
            const items = paymentMethods
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(pm => {
                    let item = '';
                    if (pm.icon_url) item += `<img src="${pm.icon_url}" alt="${pm.name}" class="footer-payment-icon" title="${pm.name}">`;
                    else item += `<span class="footer-payment-name">${pm.name}</span>`;
                    if (pm.account_number) item += `<span class="footer-payment-account">${pm.account_number}</span>`;
                    if (pm.qr_code_url) item += `<img src="${pm.qr_code_url}" alt="${pm.name} QR" class="footer-payment-qr" onclick="window.open('${pm.qr_code_url}','_blank')">`;
                    return `<div class="footer-payment-item">${item}</div>`;
                })
                .join('');
            paymentHTML = `<div class="footer-section"><h5 class="footer-section-title">💳 Payment Methods</h5><div class="footer-payment-grid">${items}</div></div>`;
        }

        // =====================================================================
        // SHIPPING PARTNERS
        // =====================================================================
        let shippingHTML = '';
        if (shippingPartners.length > 0) {
            const items = shippingPartners
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(sp => sp.icon_url ? `<img src="${sp.icon_url}" alt="${sp.name}" class="footer-shipping-icon" title="${sp.name}">` : `<span class="footer-shipping-name">${sp.name}</span>`)
                .join('');
            shippingHTML = `<div class="footer-section"><h5 class="footer-section-title">🚚 Shipping Partners</h5><div class="footer-shipping-grid">${items}</div></div>`;
        }

        // =====================================================================
        // CERTIFICATIONS
        // =====================================================================
        let certHTML = '';
        if (certifications.length > 0) {
            const items = certifications
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(cert => {
                    const badge = cert.badge_url ? `<img src="${cert.badge_url}" alt="${cert.name}" class="footer-cert-icon">` : '';
                    const name = `<span class="footer-cert-name">${cert.name}</span>`;
                    const inner = badge + name;
                    return cert.link_url ? `<a href="${cert.link_url}" target="_blank" rel="noopener" class="footer-cert-item" title="${cert.name}">${inner}</a>` : `<div class="footer-cert-item" title="${cert.name}">${inner}</div>`;
                })
                .join('');
            certHTML = `<div class="footer-section"><h5 class="footer-section-title">✅ Certifications</h5><div class="footer-cert-grid">${items}</div></div>`;
        }

        // =====================================================================
        // APP LINKS
        // =====================================================================
        let appHTML = '';
        if (showApp && appLinks.length > 0) {
            const items = appLinks
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(app => {
                    let btns = '';
                    const icon = app.icon_url ? `<img src="${app.icon_url}" alt="">` : '';
                    if (app.app_store_url) btns += `<a href="${app.app_store_url}" target="_blank" rel="noopener" class="footer-app-btn">${icon || '🍎'} App Store</a>`;
                    if (app.play_store_url) btns += `<a href="${app.play_store_url}" target="_blank" rel="noopener" class="footer-app-btn">${icon || '▶'} Play Store</a>`;
                    return btns;
                })
                .join('');
            appHTML = `<div class="footer-section"><h5 class="footer-section-title">📱 Download App</h5><div class="footer-app-grid">${items}</div></div>`;
        }

        // =====================================================================
        // COUNTRY SELECTOR - FIXED WITH INLINE STYLES
        // =====================================================================
        let countryHTML = '';
        if (showCountry && countries.length > 0) {
            const sorted = countries.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            const defaultC = sorted.find(c => c.is_default) || sorted[0];

            const options = sorted.map(c => {
                const flag = c.flag_url ? `<img src="${c.flag_url}" class="footer-country-flag" alt="${c.country_code}" style="width:18px;height:12px;object-fit:cover;border-radius:2px;display:inline-block;vertical-align:middle;margin-right:8px;border:1px solid rgba(255,255,255,0.1);">` : '';
                const cur = c.currency_symbol || c.currency_code || '';
                const lang = c.language_name || (c.language_code ? c.language_code.toUpperCase() : '');
                const label = `${c.country_name}${cur ? ' · ' + cur : ''}${lang ? ' (' + lang + ')' : ''}`;
                const sel = c.is_default ? 'selected' : '';
                return `<option value="?country=${c.country_code}&lang=${c.language_code || ''}" ${sel}>${flag}${label}</option>`;
            }).join('');

            const rateText = defaultC?.exchange_rate && defaultC.exchange_rate !== 1
                ? `<p class="footer-exchange-rate" style="font-size:8px;opacity:0.45;margin-top:6px;">💱 1 USD ≈ ${defaultC.currency_symbol || ''}${defaultC.exchange_rate}</p>`
                : '';

            countryHTML = `
            <div class="footer-section">
                <h5 class="footer-section-title">🌍 Country & Language</h5>
                <select class="footer-country-select" 
                        onchange="if(this.value)window.location.href=this.value" 
                        aria-label="Select country"
                        style="width:100%;max-width:260px;padding:10px 36px 10px 14px;font-size:11px;font-family:inherit;background:rgba(255,255,255,0.1);color:#ffffff;border:1px solid rgba(255,255,255,0.2);border-radius:10px;cursor:pointer;outline:none;appearance:none;-webkit-appearance:none;background-image:url('data:image/svg+xml,%3Csvg width=%2710%27 height=%276%27 viewBox=%270 0 10 6%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M1 1L5 5L9 1%27 stroke=%27white%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 14px center;">
                    ${options}
                </select>
                ${rateText}
            </div>`;
        }

        // =====================================================================
        // TRUST BADGES
        // =====================================================================
        let badgesHTML = '';
        if (trustBadges.length > 0) {
            const items = trustBadges
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(badge => {
                    const img = badge.badge_url ? `<img src="${badge.badge_url}" alt="${badge.title}" class="footer-badge-icon">` : '';
                    const title = `<p class="footer-badge-title">${badge.title}</p>`;
                    const sub = badge.subtitle ? `<p class="footer-badge-subtitle">${badge.subtitle}</p>` : '';
                    return `<div class="footer-badge-item" title="${badge.title}${badge.subtitle ? ': ' + badge.subtitle : ''}">${img}${title}${sub}</div>`;
                })
                .join('');
            badgesHTML = `<div class="footer-section"><h5 class="footer-section-title">🛡️ Trust & Security</h5><div class="footer-badges-grid">${items}</div></div>`;
        }

        // =====================================================================
        // MENUS & QUICK LINKS
        // =====================================================================
        let menuColumnsHTML = '';
        if (menus.length > 0) {
            menuColumnsHTML = menus
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(menu => {
                    const links = (menu.links || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                    const top = links.filter(l => !l.parent_id);
                    const children = links.filter(l => l.parent_id);

                    const listItems = top.map(link => {
                        const target = link.open_in_new_tab ? 'target="_blank" rel="noopener"' : '';
                        const icon = link.icon_class ? `<i class="${link.icon_class}"></i>` : '';
                        const desc = link.description ? `<span class="footer-link-desc">${link.description}</span>` : '';
                        const subs = children.filter(cl => cl.parent_id === link.id);

                        let subsHTML = '';
                        if (subs.length > 0) {
                            subsHTML = `<ul class="footer-nested-links">${subs.map(s => {
                                const st = s.open_in_new_tab ? 'target="_blank" rel="noopener"' : '';
                                const si = s.icon_class ? `<i class="${s.icon_class}"></i>` : '';
                                const sd = s.description ? `<span class="footer-nested-desc">${s.description}</span>` : '';
                                return `<li><a href="${s.link_url || '#'}" ${st}>${si}${s.title || ''}</a>${sd}</li>`;
                            }).join('')}</ul>`;
                        }

                        return `<li><a href="${link.link_url || '#'}" ${target}>${icon}${link.title || ''}</a>${desc}${subsHTML}</li>`;
                    }).join('');

                    return `<div><h5 class="footer-section-title">📋 ${menu.title || 'Quick Links'}</h5><ul class="footer-links-list">${listItems}</ul></div>`;
                })
                .join('');
        }

        // =====================================================================
        // LAYOUT CLASS
        // =====================================================================
        const layoutMap = { centered: 'footer-layout-centered', minimal: 'footer-layout-minimal', expanded: 'footer-layout-expanded' };
        const layoutClass = layoutMap[layoutStyle] || '';

        // =====================================================================
        // BUILD COMPLETE FOOTER HTML
        // =====================================================================
        const footerHTML = `
        <footer class="pt-12 pb-6 ${layoutClass}" id="main-footer" style="background:${bgColor}!important;color:${textColor}!important;" data-theme="${theme}">
            ${customCSS ? `<style>${customCSS}</style>` : ''}
            <div class="w-full px-4 lg:px-12">
                <div class="footer-grid">
                    <!-- Brand Column -->
                    <div>
                        ${brandLogo ? `<img src="${brandLogo}" alt="${brandTitle}" class="footer-brand-logo" style="height:32px;width:auto;margin-bottom:12px;opacity:0.9;">` : ''}
                        <h4 class="footer-brand-title" style="font-family:inherit;font-size:16px;font-weight:800;letter-spacing:0.05em;margin-bottom:8px;color:inherit;">${brandTitle}</h4>
                        <p class="footer-brand-desc" style="font-size:10px;line-height:1.6;opacity:0.55;margin-bottom:16px;max-width:280px;">${brandDesc}</p>
                        ${showSocial && socialIconsHTML ? `<div class="social-icons-grid" style="display:flex;flex-wrap:wrap;gap:7px;justify-content:flex-start;">${socialIconsHTML}</div>` : ''}
                        ${appHTML}
                        ${countryHTML}
                    </div>
                    <!-- Dynamic Menu Columns -->
                    ${menuColumnsHTML}
                    <!-- Contact Column -->
                    <div>
                        <h5 class="footer-section-title" style="font-family:inherit;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;opacity:0.5;">📞 Direct Contact</h5>
                        ${contactEmail ? `<div class="footer-contact-item" style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:10px;"><span style="opacity:0.4;">✉</span><span style="opacity:0.6;"><a href="mailto:${contactEmail}" style="color:inherit;text-decoration:none;">${contactEmail}</a></span></div>` : ''}
                        ${contactPhone ? `<div class="footer-contact-item" style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:10px;"><span style="opacity:0.4;">☎</span><span style="opacity:0.6;"><a href="tel:${contactPhone}" style="color:inherit;text-decoration:none;">${contactPhone}</a></span></div>` : ''}
                        ${contactAddress ? `<div class="footer-contact-item" style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:10px;"><span style="opacity:0.4;">📍</span><span style="opacity:0.6;">${contactAddress}</span></div>` : ''}
                        ${contactHours ? `<div class="footer-contact-item" style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;font-size:10px;"><span style="opacity:0.4;">🕐</span><span style="opacity:0.6;">${contactHours}</span></div>` : ''}
                        ${paymentHTML}
                        ${shippingHTML}
                        ${certHTML}
                        ${badgesHTML}
                    </div>
                </div>
                <!-- Bottom Bar -->
                <div class="footer-bottom-bar" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;margin-top:16px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;gap:10px;opacity:0.4;font-size:8px;text-transform:uppercase;letter-spacing:0.06em;">
                    <p>Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener" style="font-weight:700;color:inherit;text-decoration:none;">BINZEO Infrastructure</a> v${version}</p>
                    <p>${displayCopyright}</p>
                </div>
            </div>
        </footer>`;

        document.body.insertAdjacentHTML('beforeend', footerHTML);
        console.log('[Footer] ✅ Rendered successfully!');
        console.log('[Footer] 🔍 Country selector in DOM:', document.querySelector('.footer-country-select') ? 'YES' : 'NO');

        // RTL Support
        if (countries.length > 0) {
            const defaultC = countries.find(c => c.is_default) || countries[0];
            if (defaultC?.is_rtl) {
                const el = document.getElementById('main-footer');
                if (el) el.setAttribute('dir', 'rtl');
            }
        }

    } catch (error) {
        console.error('[Footer] ❌ Error:', error);
        document.body.insertAdjacentHTML('beforeend', `<footer style="background:#0f0f0f;color:#fff;text-align:center;padding:30px;font-size:12px;"><p>© ${new Date().getFullYear()} JayenWare. All Rights Reserved.</p></footer>`);
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================
console.log('[Footer] ✅ footer.js loaded - renderFooter function ready');

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFooter, getSocialIconHTML };
}
