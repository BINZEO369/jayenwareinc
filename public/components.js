async function initSharedComponents() {
    document.getElementById('header-container').innerHTML = '<header style="position:fixed;top:0;left:0;right:0;z-index:50;background:white;border-bottom:1px solid #eee;padding:10px 20px;display:flex;justify-content:space-between;align-items:center"><a href="/" style="font-size:20px;font-weight:900;text-decoration:none;color:black">JAYENWARE</a><div style="display:flex;gap:15px"><a href="/" style="text-decoration:none;color:black;font-size:12px;font-weight:bold">HOME</a><a href="/products" style="text-decoration:none;color:black;font-size:12px;font-weight:bold">SHOP</a></div></header>';
    document.getElementById('footer-container').innerHTML = '<footer style="background:#1d1d1f;color:white;padding:30px;text-align:center;margin-top:50px"><p style="font-size:12px">© 2024 JAYENWARE</p></footer>';
}
function showToast(m,t){var d=document.createElement('div');d.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:50px;font-size:12px;font-weight:bold;color:white;z-index:9999;background:#1d1d1f;';d.textContent=m;document.body.appendChild(d);setTimeout(function(){d.style.opacity='0';d.style.transition='opacity 0.3s';setTimeout(function(){d.remove()},300)},2500)}
var wishlist=JSON.parse(localStorage.getItem('jayen_wishlist')||'[]');
var cart=JSON.parse(localStorage.getItem('jayen_cart')||'[]');
function addToCart(id){if(!cart.includes(id)){cart.push(id);localStorage.setItem('jayen_cart',JSON.stringify(cart));showToast('Added to cart!')}}
function toggleWishlist(id){var i=wishlist.indexOf(id);if(i>-1){wishlist.splice(i,1)}else{wishlist.push(id)};localStorage.setItem('jayen_wishlist',JSON.stringify(wishlist));showToast('Wishlist updated!')}
function getProductSlug(p){return p.title.toLowerCase().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-')}
