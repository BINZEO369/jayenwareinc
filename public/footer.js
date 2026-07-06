// ============================================================================
// footer.js - Professional Premium Footer Component
// Version: 2.0 (Fixed Design, All Tables, All Columns, Country Fix)
// Brand: JABIYEN (Premium Apparel)
// ============================================================================

// ============================================================================
// SOCIAL ICONS - PREMIUM MONOCHROME SVG SET
// ============================================================================
function getSocialIconHTML(platform, link) {
    const icons = {
        'facebook': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'instagram': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`,
        'youtube': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.54 6.42C21.15 3.42 14.04 4 12 4C9.96 4 2.85 3.42 1.46 6.42C0.87 8.17 1 16.09 1.46 18.58C2.85 21.58 9.96 21 12 21C14.04 21 21.15 21.58 22.54 18.58C23.13 16.83 23 8.91 22.54 6.42Z" stroke="currentColor" stroke-width="2"/><path d="M9.75 15.02L15.5 11.68L9.75 8.34V15.02Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
        'tiktok': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12V8.5C9 6.01472 11.0147 4 13.5 4H16M9 20C7.34315 20 6 18.6569 6 17C6 15.3431 7.34315 14 9 14C10.6569 14 12 15.3431 12 17V4M20 8V12C18.3431 12 17 10.6569 17 9V8H20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'x': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z" fill="currentColor"/></svg>`,
        'pinterest': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 16C8 16 6 10 6 8C6 4 9 2 12 2C16 2 18 5 18 8C18 12 16 16 13 16C11 16 10 14 10 14M10 14L8 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        'whatsapp': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 11.5C21 16.7467 16.7467 21 11.5 21C9.38318 21 7.42019 20.3098 5.86667 19.1333L2 20L2.86667 16.1333C1.69019 14.5798 1 12.6168 1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5V11.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
        'linkedin': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="9" width="4" height="12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 12V21H18V12C18 10.5 17.5 9 16 9C14.5 9 14 10.5 14 12V21H10V9H14V11C14 11 14.5 9.5 16.5 9.5C18.5 9.5 22 10.5 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"/></svg>`,
        'messenger': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 14.5 2.8 16.8 4.2 18.7L3.5 21.5L6.4 20.2C8.1 21.3 10.1 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 13L10 9.5L14 12.5L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };
    
    const svgContent = icons[platform];
    if (!svgContent) return null;
    
    return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="social-icon-link" aria-label="${platform}">${svgContent}</a>`;
}

// ============================================================================
// FOOTER RENDER FUNCTION
// ============================================================================
async function renderFooter() {
    if (document.getElementById('main-footer')) {
        console.log('[Footer] Already rendered');
        return;
    }
    
    console.log('[Footer] Rendering...');
    
    try {
        const response = await fetch('/api/footer/complete');
        if (!response.ok) throw new Error(`Footer API failed: ${response.status}`);
        const footerData = await response.json();
        
        const { 
            content = [], socialLinks = [], menus = [], paymentMethods = [], 
            shippingPartners = [], certifications = [], appLinks = [], 
            countries = [], trustBadges = [], settings = null 
        } = footerData;
        
        console.log('[Footer] Countries from API:', countries?.length || 0);
        
        // SETTINGS
        const bgColor = settings?.background_color || '#111111';
        const textColor = settings?.text_color || '#ffffff';
        const copyrightText = settings?.copyright_text || '© 2025 JayenWare. All Rights Reserved.';
        const layoutStyle = settings?.layout_style || 'standard';
        const version = settings?.version || '1.0';
        const showSocial = settings?.show_social_links !== false;
        const showPayment = settings?.show_payment_methods !== false;
        const showApp = settings?.show_app_links !== false;
        const showCountry = settings?.show_country_selector !== false;
        const customCSS = settings?.custom_css || '';
        
        // CONTENT MERGING
        const mainContent = content.find(c => c.section_name === 'main') || content.find(c => c.section_name === 'brand') || content[0] || {};
        const contactContent = content.find(c => c.section_name === 'contact') || {};
        
        const brandTitle = mainContent.title || 'JABIYEN';
        const brandDesc = mainContent.description || 'Premium lifestyle apparel. Quality fashion at affordable prices.';
        const brandLogo = mainContent.logo_url || '/logo.png';
        const brandCopyright = mainContent.copyright_text || copyrightText;
        const contactEmail = contactContent.email || mainContent.email || '';
        const contactPhone = contactContent.phone || mainContent.phone || '';
        const contactAddress = contactContent.address || mainContent.address || '';
        const contactHours = contactContent.working_hours || mainContent.working_hours || '';
        
        // SOCIAL LINKS
        let socialIconsHTML = '';
        if (showSocial && socialLinks.length > 0) {
            socialIconsHTML = socialLinks
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map(link => {
                    const platform = (link.platform_name || '').toLowerCase().replace(/\s+/g, '');
                    if (link.platform_icon && link.platform_icon.startsWith('http')) {
                        return `<a href="${link.link_url || '#'}" target="_blank" rel="noopener noreferrer" class="social-icon-link" title="${link.hover_title || link.platform_name || ''}"><img src="${link.platform_icon}" alt="${link.platform_name}"></a>`;
                    }
                    return getSocialIconHTML(platform, link.link_url || '#') || '';
                }).filter(html => html !== '').join('');
        }
        
        // PAYMENT METHODS
        let paymentHTML = '';
        if (showPayment && paymentMethods.length > 0) {
            paymentHTML = `<div class="footer-section">
                <h5 class="footer-section-title">Payment Methods</h5>
                <div class="footer-payment-grid">
                    ${paymentMethods.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(pm => `
                        <div class="footer-payment-item">
                            ${pm.icon_url ? `<img src="${pm.icon_url}" alt="${pm.name}" class="footer-payment-icon">` : ''}
                            <span class="footer-payment-name">${pm.name}</span>
                            ${pm.account_number ? `<span class="footer-payment-account">${pm.account_number}</span>` : ''}
                            ${pm.qr_code_url ? `<img src="${pm.qr_code_url}" alt="QR" class="footer-payment-qr" onclick="window.open('${pm.qr_code_url}','_blank')">` : ''}
                        </div>`).join('')}
                </div></div>`;
        }
        
        // SHIPPING PARTNERS
        let shippingHTML = '';
        if (shippingPartners.length > 0) {
            shippingHTML = `<div class="footer-section">
                <h5 class="footer-section-title">Shipping Partners</h5>
                <div class="footer-shipping-grid">
                    ${shippingPartners.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(sp => 
                        sp.icon_url ? `<img src="${sp.icon_url}" alt="${sp.name}" class="footer-shipping-icon" title="${sp.name}">` : `<span class="footer-shipping-name">${sp.name}</span>`
                    ).join('')}
                </div></div>`;
        }
        
        // CERTIFICATIONS
        let certHTML = '';
        if (certifications.length > 0) {
            certHTML = `<div class="footer-section">
                <h5 class="footer-section-title">Certifications</h5>
                <div class="footer-cert-grid">
                    ${certifications.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(cert => {
                        const inner = (cert.badge_url ? `<img src="${cert.badge_url}" alt="${cert.name}" class="footer-cert-icon">` : '') + `<span class="footer-cert-name">${cert.name}</span>`;
                        return cert.link_url ? `<a href="${cert.link_url}" target="_blank" rel="noopener noreferrer" class="footer-cert-item">${inner}</a>` : `<div class="footer-cert-item">${inner}</div>`;
                    }).join('')}
                </div></div>`;
        }
        
        // APP LINKS
        let appHTML = '';
        if (showApp && appLinks.length > 0) {
            appHTML = `<div class="footer-section">
                <h5 class="footer-section-title">Download Our App</h5>
                <div class="footer-app-grid">
                    ${appLinks.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(app => {
                        let btns = '';
                        if (app.app_store_url) btns += `<a href="${app.app_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn">📱 App Store</a>`;
                        if (app.play_store_url) btns += `<a href="${app.play_store_url}" target="_blank" rel="noopener noreferrer" class="footer-app-btn">▶ Play Store</a>`;
                        return btns;
                    }).join('')}
                </div></div>`;
        }
        
        // COUNTRY SELECTOR (FIXED)
        let countryHTML = '';
        if (showCountry && countries.length > 0) {
            const sortedCountries = [...countries].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            const defaultCountry = sortedCountries.find(c => c.is_default) || sortedCountries[0];
            
            countryHTML = `<div class="footer-section">
                <h5 class="footer-section-title">Country & Language</h5>
                <select class="footer-country-select" onchange="if(this.value) window.location.href=this.value" aria-label="Select country">
                    ${sortedCountries.map(c => {
                        const flagHTML = c.flag_url ? `<img src="${c.flag_url}" class="footer-country-flag" alt="${c.country_code}">` : '';
                        const display = `${c.country_name} (${c.currency_symbol || c.currency_code || 'BDT'})`;
                        return `<option value="?country=${c.country_code}&lang=${c.language_code || ''}" ${c.is_default ? 'selected' : ''}>${flagHTML}${display}</option>`;
                    }).join('')}
                </select>
                ${defaultCountry?.exchange_rate && defaultCountry.exchange_rate !== 1 ? `<p class="footer-exchange-rate">Rate: 1 USD = ${defaultCountry.currency_symbol || ''}${defaultCountry.exchange_rate}</p>` : ''}
            </div>`;
        } else if (showCountry) {
            countryHTML = `<div class="footer-section"><h5 class="footer-section-title">Country</h5><p class="footer-brand-desc">Bangladesh (BDT ৳)</p></div>`;
        }
        
        // TRUST BADGES
        let badgesHTML = '';
        if (trustBadges.length > 0) {
            badgesHTML = `<div class="footer-section">
                <h5 class="footer-section-title">Trust & Security</h5>
                <div class="footer-badges-grid">
                    ${trustBadges.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(badge => `
                        <div class="footer-badge-item" title="${badge.title}${badge.subtitle ? ': ' + badge.subtitle : ''}">
                            ${badge.badge_url ? `<img src="${badge.badge_url}" alt="${badge.title}" class="footer-badge-icon">` : ''}
                            <p class="footer-badge-title">${badge.title}</p>
                            ${badge.subtitle ? `<p class="footer-badge-subtitle">${badge.subtitle}</p>` : ''}
                        </div>`).join('')}
                </div></div>`;
        }
        
        // MENUS
        let menuColumnsHTML = '';
        if (menus.length > 0) {
            menuColumnsHTML = menus.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map(menu => {
                const links = menu.links || [];
                const topLevel = links.filter(l => !l.parent_id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
                const children = links.filter(l => l.parent_id);
                
                return `<div>
                    <h5 class="footer-section-title">${menu.title || 'Quick Links'}</h5>
                    <ul class="footer-links-list">
                        ${topLevel.map(link => {
                            const target = link.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : '';
                            const icon = link.icon_class ? `<i class="${link.icon_class}"></i>` : '';
                            const desc = link.description ? `<span class="footer-link-desc">${link.description}</span>` : '';
                            const childLinks = children.filter(cl => cl.parent_id === link.id);
                            let childHTML = '';
                            if (childLinks.length > 0) {
                                childHTML = `<ul class="footer-nested-links">${childLinks.map(cl => `<li><a href="${cl.link_url || '#'}" ${cl.open_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : ''}>${cl.icon_class ? `<i class="${cl.icon_class}"></i>` : ''}${cl.title || ''}</a>${cl.description ? `<span class="footer-nested-desc">${cl.description}</span>` : ''}</li>`).join('')}</ul>`;
                            }
                            return `<li><a href="${link.link_url || '#'}" ${target}>${icon}${link.title || ''}</a>${desc}${childHTML}</li>`;
                        }).join('')}
                    </ul>
                </div>`;
            }).join('');
        }
        
        // LAYOUT CLASS
        let layoutClass = '';
        if (layoutStyle === 'centered') layoutClass = 'footer-layout-centered';
        else if (layoutStyle === 'minimal') layoutClass = 'footer-layout-minimal';
        else if (layoutStyle === 'expanded') layoutClass = 'footer-layout-expanded';
        
        // BUILD FOOTER
        const footerHTML = `
        <footer class="pt-12 pb-6 ${layoutClass}" id="main-footer" style="background:${bgColor}!important;color:${textColor}!important">
            ${customCSS ? `<style>${customCSS}</style>` : ''}
            <div class="w-full px-4 lg:px-12">
                <div class="footer-grid">
                    <div>
                        ${brandLogo ? `<img src="${brandLogo}" alt="${brandTitle}" class="footer-brand-logo">` : ''}
                        <h4 class="footer-brand-title">${brandTitle}</h4>
                        <p class="footer-brand-desc">${brandDesc}</p>
                        ${socialIconsHTML ? `<div class="social-icons-grid">${socialIconsHTML}</div>` : ''}
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
                    <p>Powered by <a href="https://binzeo.vercel.app" target="_blank" rel="noopener noreferrer">BINZEO Infrastructure</a> v${version}</p>
                    <p>${brandCopyright}</p>
                </div>
            </div>
        </footer>`;
        
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        
        // RTL support
        if (countries.length > 0) {
            const defaultCountry = countries.find(c => c.is_default) || countries[0];
            if (defaultCountry?.is_rtl) {
                document.getElementById('main-footer')?.setAttribute('dir', 'rtl');
            }
        }
        
        // Hide footer skeleton
        const footerSkeleton = document.getElementById('footer-skeleton');
        if (footerSkeleton) {
            footerSkeleton.classList.add('skeleton-hidden');
            footerSkeleton.classList.remove('skeleton-visible');
        }
        
        console.log('[Footer] ✅ Rendered successfully');
        
    } catch (error) {
        console.error('[Footer] Error:', error);
        const fallbackHTML = `
        <footer id="main-footer" style="background:#111!important;color:#fff!important;text-align:center;padding:30px 20px">
            <p style="font-size:11px;opacity:0.7">© ${new Date().getFullYear()} JayenWare. All Rights Reserved.</p>
            <p style="font-size:9px;opacity:0.4;margin-top:6px">Powered by BINZEO Infrastructure v1.0</p>
        </footer>`;
        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
        const footerSkeleton = document.getElementById('footer-skeleton');
        if (footerSkeleton) {
            footerSkeleton.classList.add('skeleton-hidden');
            footerSkeleton.classList.remove('skeleton-visible');
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderFooter, getSocialIconHTML };
}

console.log('[Footer] footer.js loaded ✓');
