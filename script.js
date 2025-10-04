// Product card/image click to open item.html with details
// Mobile menu toggle with animation
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.mobile-menu-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        const nav = btn.closest('nav');
        const menu = nav ? nav.querySelector('.mobile-menu') : null;
        if (menu) menu.classList.toggle('open');
      });
    });
  });
})();

document.addEventListener('DOMContentLoaded', function() {
    // Auth UI helper: show profile only when signed-in
    function refreshAuthUI() {
        const isSignedIn = !!localStorage.getItem('profile');
        // Profile buttons in navbar (hide until signed in)
        document.querySelectorAll('.profile-btn').forEach(btn => {
            btn.style.display = isSignedIn ? 'inline-flex' : 'none';
        });
        // Sign up buttons (hide after sign-in)
        document.querySelectorAll('.signup-btn').forEach(btn => {
            btn.style.display = isSignedIn ? 'none' : '';
        });
        // In mobile slide-out menu, also hide any profile link if added in future
        document.querySelectorAll('.mobile-menu .profile-link').forEach(a => {
            a.style.display = isSignedIn ? '' : 'none';
        });
    }
    window.addEventListener('resize', refreshAuthUI);

    // Run once on load
    refreshAuthUI();

    // Cart button opens mini-cart (run first for reliability)
    document.querySelectorAll('.cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window.openMiniCart === 'function') {
                window.openMiniCart();
            } else {
                // Fallback
                window.location.href = 'cart.html';
            }
        });
    });

    // Sign up modal: create-once and open on click
    (function(){
        let popup;
        function openSignup() {
            if (!popup) {
                popup = document.createElement('div');
                popup.id = 'signupPopup';
                popup.style.position = 'fixed';
                popup.style.inset = '0';
                popup.style.background = 'rgba(0,0,0,0.5)';
                popup.style.display = 'flex';
                popup.style.alignItems = 'center';
                popup.style.justifyContent = 'center';
                popup.style.zIndex = '10000';

                const card = document.createElement('div');
                card.style.background = '#fff';
                card.style.borderRadius = '12px';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                card.style.width = 'min(92vw, 420px)';
                card.style.padding = '20px';
                card.style.position = 'relative';

                const close = document.createElement('button');
                close.innerHTML = '&times;';
                close.setAttribute('aria-label', 'Close');
                close.style.position = 'absolute';
                close.style.top = '8px';
                close.style.right = '12px';
                close.style.fontSize = '24px';
                close.style.border = 'none';
                close.style.background = 'transparent';
                close.style.cursor = 'pointer';
                close.style.color = '#6b7280';

                const title = document.createElement('h3');
                title.textContent = 'Create your account';
                title.style.margin = '0 0 12px';
                title.style.color = '#db2777';

                const form = document.createElement('form');
                form.id = 'signupInlineForm';
                form.innerHTML = `
                    <label style="display:block;margin:.5rem 0 .25rem;color:#6b7280;font-weight:600">Full name</label>
                    <input id="su_name" placeholder="Jane Doe" required style="width:100%;padding:.65rem .8rem;border-radius:.6rem;background:#fce7f3;border:1px solid #f9a8d4;color:#be185d;outline:none" />
                    <label style="display:block;margin:.75rem 0 .25rem;color:#6b7280;font-weight:600">Email</label>
                    <input id="su_email" type="email" placeholder="jane@example.com" required style="width:100%;padding:.65rem .8rem;border-radius:.6rem;background:#fce7f3;border:1px solid #f9a8d4;color:#be185d;outline:none" />
                    <label style="display:block;margin:.75rem 0 .25rem;color:#6b7280;font-weight:600">Password</label>
                    <input id="su_password" type="password" placeholder="••••••••" minlength="6" required style="width:100%;padding:.65rem .8rem;border-radius:.6rem;background:#fce7f3;border:1px solid #f9a8d4;color:#be185d;outline:none" />
                    <div id="su_error" style="color:#b91c1c;font-size:.9rem;margin-top:.5rem;display:none"></div>
                    <div id="su_ok" style="color:#065f46;background:#ecfeff;border:1px solid #a7f3d0;padding:.6rem .8rem;border-radius:.6rem;margin-top:.6rem;display:none">Account created! Welcome.</div>
                    <div style="display:flex;gap:.5rem;align-items:center;margin-top:.9rem">
                        <button type="submit" style="background:linear-gradient(90deg,#ec4899,#f472b6);color:#fff;border:none;border-radius:999px;padding:.6rem .9rem;font-weight:700;cursor:pointer">Create account</button>
                        <button type="button" id="su_close" style="background:transparent;border:none;color:#db2777;cursor:pointer;font-weight:600">Cancel</button>
                    </div>
                `;

                card.appendChild(close);
                card.appendChild(title);
                card.appendChild(form);
                popup.appendChild(card);
                document.body.appendChild(popup);

                // close handlers
                close.addEventListener('click', () => popup.remove());
                popup.addEventListener('click', (e) => { if (e.target === popup) popup.remove(); });
                form.querySelector('#su_close').addEventListener('click', () => popup.remove());

                // submit handler
                form.addEventListener('submit', function(e){
                    e.preventDefault();
                    const err = form.querySelector('#su_error');
                    const ok = form.querySelector('#su_ok');
                    err.style.display = 'none';
                    ok.style.display = 'none';
                    const name = form.querySelector('#su_name').value.trim();
                    const email = form.querySelector('#su_email').value.trim();
                    const password = form.querySelector('#su_password').value;
                    if (!name || !email || !password) { err.textContent = 'Please fill all fields.'; err.style.display = 'block'; return; }
                    if (!/\S+@\S+\.\S+/.test(email)) { err.textContent = 'Please enter a valid email.'; err.style.display = 'block'; return; }
                    if (password.length < 6) { err.textContent = 'Password must be at least 6 characters.'; err.style.display = 'block'; return; }
                    // mark as signed-in with profile
                    localStorage.setItem('profile', JSON.stringify({ name, email }));
                    ok.style.display = 'block';
                    // update UI to reveal profile on mobile
                    if (typeof window.dispatchEvent === 'function') {
                        window.dispatchEvent(new Event('resize'));
                    }
                    setTimeout(() => { popup.remove(); }, 900);
                });
            } else {
                document.body.appendChild(popup);
            }
        }
        document.querySelectorAll('.signup-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openSignup();
            });
        });
    })();

    // Profile modal: create-once and open on click (mirrors Sign Up style)
    (function(){
        let profilePopup;
        function openProfile() {
            if (!profilePopup) {
                profilePopup = document.createElement('div');
                profilePopup.id = 'profilePopup';
                profilePopup.style.position = 'fixed';
                profilePopup.style.inset = '0';
                profilePopup.style.background = 'rgba(0,0,0,0.5)';
                profilePopup.style.display = 'flex';
                profilePopup.style.alignItems = 'center';
                profilePopup.style.justifyContent = 'center';
                profilePopup.style.zIndex = '10000';

                const card = document.createElement('div');
                card.style.background = '#fff';
                card.style.borderRadius = '12px';
                card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                card.style.width = 'min(92vw, 420px)';
                card.style.padding = '20px';
                card.style.position = 'relative';

                const close = document.createElement('button');
                close.innerHTML = '&times;';
                close.setAttribute('aria-label', 'Close');
                close.style.position = 'absolute';
                close.style.top = '8px';
                close.style.right = '12px';
                close.style.fontSize = '24px';
                close.style.border = 'none';
                close.style.background = 'transparent';
                close.style.cursor = 'pointer';
                close.style.color = '#6b7280';

                const title = document.createElement('h3');
                title.textContent = 'Profile';
                title.style.margin = '0 0 12px';
                title.style.color = '#db2777';

                // Build header with avatar + name/email + edit button
                const header = document.createElement('div');
                header.style.display = 'flex';
                header.style.alignItems = 'center';
                header.style.gap = '12px';
                header.style.marginBottom = '12px';

                const avatar = document.createElement('div');
                avatar.id = 'pf_avatar';
                avatar.style.width = '56px';
                avatar.style.height = '56px';
                avatar.style.borderRadius = '50%';
                avatar.style.display = 'grid';
                avatar.style.placeItems = 'center';
                avatar.style.fontWeight = '800';
                avatar.style.letterSpacing = '1px';
                avatar.style.color = '#fff';
                avatar.style.background = 'linear-gradient(135deg,#f472b6,#ec4899)';

                const info = document.createElement('div');
                const nameEl = document.createElement('div');
                nameEl.id = 'pf_name_view';
                nameEl.style.fontWeight = '700';
                nameEl.style.fontSize = '1.05rem';
                nameEl.style.color = '#111827';
                const emailEl = document.createElement('div');
                emailEl.id = 'pf_email_view';
                emailEl.style.color = '#6b7280';
                emailEl.style.fontSize = '.95rem';
                info.appendChild(nameEl);
                info.appendChild(emailEl);

                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.textContent = 'Edit';
                editBtn.style.marginLeft = 'auto';
                editBtn.style.background = '#f3e8ff';
                editBtn.style.color = '#7c3aed';
                editBtn.style.border = '1px solid #e9d5ff';
                editBtn.style.borderRadius = '999px';
                editBtn.style.padding = '.45rem .8rem';
                editBtn.style.cursor = 'pointer';
                editBtn.style.fontWeight = '700';

                header.appendChild(avatar);
                header.appendChild(info);
                header.appendChild(editBtn);

                const form = document.createElement('form');
                form.id = 'profileInlineForm';
                form.style.display = 'none';
                form.style.marginTop = '8px';
                form.innerHTML = `
                    <label style="display:block;margin:.5rem 0 .25rem;color:#6b7280;font-weight:600">Full name</label>
                    <input id="pf_name" placeholder="Jane Doe" required style="width:100%;padding:.65rem .8rem;border-radius:.6rem;background:#fce7f3;border:1px solid #f9a8d4;color:#be185d;outline:none" />
                    <label style="display:block;margin:.75rem 0 .25rem;color:#6b7280;font-weight:600">Email</label>
                    <input id="pf_email" type="email" placeholder="jane@example.com" required style="width:100%;padding:.65rem .8rem;border-radius:.6rem;background:#fce7f3;border:1px solid #f9a8d4;color:#be185d;outline:none" />
                    <div id="pf_msg" style="display:none;margin-top:.6rem;padding:.6rem .8rem;border-radius:.6rem;font-size:.95rem;"></div>
                    <div style="display:flex;gap:.5rem;align-items:center;margin-top:.9rem;flex-wrap:wrap">
                        <button type="submit" style="background:linear-gradient(90deg,#ec4899,#f472b6);color:#fff;border:none;border-radius:999px;padding:.6rem .9rem;font-weight:700;cursor:pointer">Save changes</button>
                        <button type="button" id="pf_cancel" style="background:transparent;border:none;color:#db2777;cursor:pointer;font-weight:600">Cancel</button>
                        <button type="button" id="pf_signout" style="margin-left:auto;background:#fee2e2;border:1px solid #fecaca;color:#b91c1c;border-radius:999px;padding:.45rem .8rem;cursor:pointer;font-weight:700">Sign out</button>
                    </div>
                `;

                // Prefill from localStorage if available
                try {
                    const saved = JSON.parse(localStorage.getItem('profile') || '{}');
                    if (saved && (saved.name || saved.email)) {
                        const n = form.querySelector('#pf_name');
                        const e = form.querySelector('#pf_email');
                        if (saved.name) n.value = saved.name;
                        if (saved.email) e.value = saved.email;
                    }
                } catch(_) {}

                card.appendChild(close);
                card.appendChild(title);
                card.appendChild(header);
                card.appendChild(form);
                profilePopup.appendChild(card);
                document.body.appendChild(profilePopup);

                function populateView(name, email){
                    nameEl.textContent = name || 'Guest';
                    emailEl.textContent = email || 'Not set';
                    const initials = (name || 'G').split(/\s+/).map(s => s[0]).join('').slice(0,2).toUpperCase();
                    avatar.textContent = initials;
                }

                // initial view data
                try {
                    const saved = JSON.parse(localStorage.getItem('profile') || '{}');
                    populateView(saved.name, saved.email);
                } catch(_) { populateView('', ''); }

                // close handlers
                function closePopup(){ profilePopup.remove(); }
                close.addEventListener('click', closePopup);
                profilePopup.addEventListener('click', (e) => { if (e.target === profilePopup) closePopup(); });
                form.querySelector('#pf_cancel').addEventListener('click', function(){
                    form.style.display = 'none';
                    header.style.display = 'flex';
                });

                // toggle edit
                editBtn.addEventListener('click', function(){
                    // prefill inputs from view
                    const n = form.querySelector('#pf_name');
                    const e = form.querySelector('#pf_email');
                    n.value = nameEl.textContent === 'Guest' ? '' : nameEl.textContent;
                    e.value = emailEl.textContent === 'Not set' ? '' : emailEl.textContent;
                    header.style.display = 'none';
                    form.style.display = 'block';
                });

                // submit handler: save to localStorage
                form.addEventListener('submit', function(e){
                    e.preventDefault();
                    const msg = form.querySelector('#pf_msg');
                    const name = form.querySelector('#pf_name').value.trim();
                    const email = form.querySelector('#pf_email').value.trim();
                    msg.style.display = 'none';
                    if (!name || !email) { msg.textContent = 'Please fill all fields.'; msg.style.display = 'block'; msg.style.color = '#b91c1c'; msg.style.background = '#fee2e2'; msg.style.border = '1px solid #fecaca'; return; }
                    if (!/\S+@\S+\.\S+/.test(email)) { msg.textContent = 'Please enter a valid email.'; msg.style.display = 'block'; msg.style.color = '#b91c1c'; msg.style.background = '#fee2e2'; msg.style.border = '1px solid #fecaca'; return; }
                    localStorage.setItem('profile', JSON.stringify({ name, email }));
                    populateView(name, email);
                    // Update navbar buttons
                    if (typeof window.dispatchEvent === 'function') window.dispatchEvent(new Event('resize'));
                    msg.textContent = 'Saved!';
                    msg.style.display = 'block';
                    msg.style.color = '#065f46';
                    msg.style.background = '#ecfeff';
                    msg.style.border = '1px solid #a7f3d0';
                    setTimeout(() => {
                        msg.style.display = 'none';
                        form.style.display = 'none';
                        header.style.display = 'flex';
                    }, 900);
                });

                // sign out handler
                const signoutBtn = form.querySelector('#pf_signout');
                if (signoutBtn) {
                    signoutBtn.addEventListener('click', function(){
                        localStorage.removeItem('profile');
                        // Update navbar buttons and close popup
                        if (typeof window.dispatchEvent === 'function') window.dispatchEvent(new Event('resize'));
                        profilePopup.remove();
                    });
                }
            } else {
                document.body.appendChild(profilePopup);
            }
        }
        document.querySelectorAll('.profile-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openProfile();
            });
        });
    })();

    document.querySelectorAll('.product-card').forEach(function(card) {
        // Make the whole card clickable, including image
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // Prevent add-to-cart button from triggering item.html
            if (e.target.closest('.add-to-cart')) return;
            var img = card.querySelector('.product-image img');
            var title = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
            var desc = card.querySelector('p') ? card.querySelector('p').textContent : '';
            var price = card.querySelector('.product-price') ? card.querySelector('.product-price').textContent : '';
            localStorage.setItem('selectedItem', JSON.stringify({
                image: img ? img.src : '',
                title,
                desc,
                price: (price || '').replace('€','') || '0.92'
            }));
            // Fade out animation
            document.body.style.transition = 'opacity 0.5s';
            document.body.style.opacity = '0';
            setTimeout(function() {
                window.location.href = 'item.html';
            }, 500);
        });
    });
});

// Populate item.html from selected item
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('item.html')) {
        try {
            var data = JSON.parse(localStorage.getItem('selectedItem') || '{}');
            if (data && (data.title || data.image)) {
                var imgEl = document.getElementById('item-img');
                var titleEl = document.getElementById('item-title');
                var descEl = document.getElementById('item-desc');
                var priceEl = document.getElementById('item-price');
                if (imgEl && data.image) imgEl.src = data.image;
                if (titleEl && data.title) titleEl.textContent = data.title;
                if (descEl && data.desc) descEl.textContent = data.desc;
                if (priceEl && data.price != null) {
                    var val = parseFloat(data.price);
                    priceEl.textContent = isFinite(val) ? ('€' + val.toFixed(2)) : ('' + String(data.price));
                }
            }
        } catch (e) {
            // ignore
        }
        // Ensure page is visible if we had fade-out
        document.body.style.opacity = '1';
        document.body.style.transition = '';
    }
});
// --- Cart Logic ---
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Check if item already exists, increment quantity if so
    const existing = cart.find(i => i.title === item.title);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...item, quantity: 1});
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Attach to plus buttons on products page
document.addEventListener('DOMContentLoaded', function() {
    // Utility to update cart count badge (make global)
    window.updateCartCount = function() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-btn').forEach(function(btn) {
            let badge = btn.querySelector('.cart-count');
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'cart-count';
                    badge.style.position = 'absolute';
                    badge.style.top = '-8px';
                    badge.style.right = '-8px';
                    badge.style.background = '#ec4899';
                    badge.style.color = '#fff';
                    badge.style.fontSize = '0.8rem';
                    badge.style.padding = '2px 7px';
                    badge.style.borderRadius = '50%';
                    badge.style.fontWeight = 'bold';
                    badge.style.zIndex = '10';
                    btn.style.position = 'relative';
                    btn.appendChild(badge);
                }
                badge.textContent = count;
                badge.style.display = 'inline-block';
            } else {
                if (badge) {
                    badge.style.display = 'none';
                }
            }
        });
    };

    // Mini-cart UI: create once and update live
    (function(){
        let mini;
        function renderMiniCart() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const list = mini.querySelector('#mini-cart-items');
            const totalEl = mini.querySelector('#mini-cart-total');
            list.innerHTML = '';
            let total = 0;
            cart.forEach((item, idx) => {
                const row = document.createElement('div');
                row.style.display = 'grid';
                row.style.gridTemplateColumns = '48px 1fr auto auto';
                row.style.gap = '8px';
                row.style.alignItems = 'center';
                row.style.margin = '6px 0';
                row.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;"/>
                    <div style="font-weight:600;color:#374151;">${item.title}</div>
                    <div style="color:#6b7280;">x${item.quantity}</div>
                    <div style="font-weight:700;color:#111827;">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                `;
                list.appendChild(row);
                total += parseFloat(item.price) * item.quantity;
            });
            totalEl.textContent = `$${total.toFixed(2)}`;
        }
        window.openMiniCart = function(){
            if (!mini) {
                mini = document.createElement('div');
                mini.id = 'mini-cart';
                mini.style.position = 'fixed';
                mini.style.right = '16px';
                mini.style.top = '64px';
                mini.style.width = 'min(92vw, 360px)';
                mini.style.background = '#fff';
                mini.style.border = '1px solid #f3e8ff';
                mini.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
                mini.style.borderRadius = '14px';
                mini.style.padding = '14px';
                mini.style.zIndex = '10001';

                mini.innerHTML = `
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                    <strong style="color:#db2777;">Your Cart</strong>
                    <div>
                      <button id="mini-view-cart" style="background:#f9a8d4;color:#7a1047;border:none;border-radius:999px;padding:.3rem .6rem;margin-right:6px;cursor:pointer;font-weight:700;">View</button>
                      <button id="mini-close" style="background:transparent;border:none;color:#6b7280;font-size:18px;cursor:pointer;">✕</button>
                    </div>
                  </div>
                  <div id="mini-cart-items" style="max-height:40vh;overflow:auto;"></div>
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
                    <span style="color:#6b7280;">Total</span>
                    <span id="mini-cart-total" style="font-weight:800;color:#111827;">€0.00</span>
                  </div>
                `;

                document.body.appendChild(mini);
                mini.querySelector('#mini-close').addEventListener('click', () => mini.remove());
                mini.querySelector('#mini-view-cart').addEventListener('click', () => { window.location.href = 'cart.html'; });
            }
            renderMiniCart();
        };

        // Update mini-cart when items change
        const origSet = localStorage.setItem;
        localStorage.setItem = function(k, v) {
            origSet.apply(this, arguments);
            if (k === 'cart' && window.document.getElementById('mini-cart')) {
                try { renderMiniCart(); } catch(e) {}
                try { window.updateCartCount(); } catch(e) {}
            }
        };
    })();

    document.querySelectorAll('.add-to-cart').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const card = btn.closest('.product-card');
            const img = card.querySelector('.product-image img');
            const title = card.querySelector('h3').textContent;
            const price = card.querySelector('.product-price') ? card.querySelector('.product-price').textContent : '';
            addToCart({
                image: img ? img.src : '',
                title,
                price: price.replace('€','') || '0.92'
            });
            updateCartCount();
        });
    });

    // Cart button navigation
    document.querySelectorAll('.cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            window.location.href = 'cart.html';
        });
    });
    updateCartCount();
 

    // If on cart.html, render cart items and wire Checkout
if (window.location.pathname.endsWith('cart.html')) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total-amount');
    let total = 0;
    cartItemsDiv.innerHTML = '';
    cart.forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <span class="cart-item-title">${item.title}</span>
            <span class="cart-item-qty">x${item.quantity}</span>
            <span class="cart-item-price">€${(parseFloat(item.price) * item.quantity).toFixed(2)}</span> <!-- 🔹 changed from $ to € -->
            <span class="cart-remove" title="Remove"><i class="fas fa-times"></i></span>
        `;
        // Remove item on click
        itemDiv.querySelector('.cart-remove').addEventListener('click', function() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(idx, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        });
        cartItemsDiv.appendChild(itemDiv);
        total += parseFloat(item.price) * item.quantity;
    });
    cartTotalSpan.textContent = `€${total.toFixed(2)}`; // 🔹 changed from $ to €
    updateCartCount();

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }
}
});

document.addEventListener('DOMContentLoaded', function() {
    var profileBtn = document.querySelector('.profile-btn');
    var loginPopup = document.getElementById('loginPopup');
    var loginClose = document.getElementById('loginClose');
    var container = document.getElementById('container');
    var registerBtn = document.getElementById('register');
    var loginBtn = document.getElementById('login');
    if(profileBtn && loginPopup && loginClose) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginPopup.classList.add('active');
        });
        loginClose.addEventListener('click', function() {
            loginPopup.classList.remove('active');
        });
        window.addEventListener('click', function(e) {
            if(e.target === loginPopup) {
                loginPopup.classList.remove('active');
            }
        });
    }
    if(registerBtn && container) {
        registerBtn.addEventListener('click', function() {
            container.classList.add('active');
        });
    }
    if(loginBtn && container) {
        loginBtn.addEventListener('click', function() {
            container.classList.remove('active');
        });
    }
});
// Mobile menu toggle (guarded for pages without the button)
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', function() {
                    const mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu) {
                        mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
                    }
                });
            }
        });

        // Add to cart functionality (guarded)
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const product = this.closest('.product-card');
                if (!product) return;
                const productName = product.querySelector('h3') ? product.querySelector('h3').textContent : 'Item';
                alert(`${productName} added to cart!`);
            });
        });

        // Newsletter form submission (guarded)
        (function(){
            const form = document.querySelector('.newsletter-form');
            if (!form) return;
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input') ? this.querySelector('input').value : '';
                if (email) {
                    alert(`Thank you for subscribing with ${email}!`);
                    this.reset();
                }
            });
        })();

         // Smooth scroll for internal links
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('a[href*="#"]').forEach(function(link) {
                link.addEventListener('click', function(e) {
                    var href = this.getAttribute('href');
                    if(href.startsWith('Products.html#')) {
                        var targetId = href.split('#')[1];
                        var target = document.getElementById(targetId);
                        if(target) {
                            e.preventDefault();
                            window.scrollTo({
                                top: target.offsetTop - 60,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        });

         // Smooth scroll for internal links
            document.addEventListener('DOMContentLoaded', function() {
                document.querySelectorAll('a[href^="#"]').forEach(function(link) {
                    link.addEventListener('click', function(e) {
                        var targetId = this.getAttribute('href').replace('#','');
                        var target = document.getElementById(targetId);
                        if(target) {
                            e.preventDefault();
                            window.scrollTo({
                                top: target.offsetTop - 60,
                                behavior: 'smooth'
                            });
                        }
                    });
                });
            });
        

        document.addEventListener('DOMContentLoaded', function() {
            var profileBtn = document.querySelector('.profile-btn');
            var loginPopup = document.getElementById('loginPopup');
            var loginClose = document.getElementById('loginClose');
            if(profileBtn && loginPopup && loginClose) {
                profileBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    loginPopup.classList.add('active');
                });
                loginClose.addEventListener('click', function() {
                    loginPopup.classList.remove('active');
                });
                window.addEventListener('click', function(e) {
                    if(e.target === loginPopup) {
                        loginPopup.classList.remove('active');
                    }
                });
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            var addBtn = document.getElementById('add-to-cart-btn');
            if (addBtn) {
                addBtn.addEventListener('click', function() {
                    var qty = parseInt(document.getElementById('item-qty').value) || 1;
                    var item = {
                        image: document.getElementById('item-img').src,
                        title: document.getElementById('item-title').textContent,
                        price: document.getElementById('item-price').textContent.replace('€','') || '0.00'
                    };
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const existing = cart.find(i => i.title === item.title);
                    if (existing) {
                        existing.quantity += qty;
                    } else {
                        cart.push({...item, quantity: qty});
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    if (typeof updateCartCount === 'function') updateCartCount();

                    // Lightweight UI feedback
                    var original = addBtn.innerHTML;
                    addBtn.disabled = true;
                    addBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
                    setTimeout(function(){
                        addBtn.disabled = false;
                        addBtn.innerHTML = original;
                    }, 1200);

                    // Inline confirmation text under controls
                    var controls = document.querySelector('.item-cart-controls');
                    var msg = document.getElementById('item-add-feedback');
                    if (!msg && controls) {
                        msg = document.createElement('div');
                        msg.id = 'item-add-feedback';
                        msg.style.color = '#16a34a';
                        msg.style.fontWeight = '600';
                        msg.style.fontSize = '0.95rem';
                        msg.style.transition = 'opacity 0.2s';
                        controls.appendChild(msg);
                    }
                    if (msg) {
                        msg.textContent = qty + ' added to cart';
                        msg.style.opacity = '1';
                        setTimeout(function(){ msg.style.opacity = '0'; }, 1400);
                    }

                    // Floating toast for extra visibility
                    (function(){
                        let toast = document.getElementById('add-toast');
                        if (!toast) {
                            toast = document.createElement('div');
                            toast.id = 'add-toast';
                            toast.style.position = 'fixed';
                            toast.style.left = '50%';
                            toast.style.bottom = '24px';
                            toast.style.transform = 'translateX(-50%)';
                            toast.style.background = '#16a34a';
                            toast.style.color = '#fff';
                            toast.style.padding = '10px 16px';
                            toast.style.borderRadius = '999px';
                            toast.style.fontWeight = '700';
                            toast.style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)';
                            toast.style.zIndex = '9999';
                            toast.style.opacity = '0';
                            toast.style.transition = 'opacity .2s';
                            document.body.appendChild(toast);
                        }
                        toast.textContent = qty + ' added to cart';
                        toast.style.opacity = '1';
                        setTimeout(function(){ toast.style.opacity = '0'; }, 1400);
                    })();
                });
            }
        });

        // Products page controller: filtering and sorting
        document.addEventListener('DOMContentLoaded', function() {
            if (!/Products\.html$/i.test(window.location.pathname)) return;
            const productsSection = document.querySelector('.products');
            const grid = document.querySelector('.products-grid');
            const header = document.querySelector('.products-header');
            if (!productsSection || !grid || !header) return;

            // Build controls UI
            const controls = document.createElement('div');
            controls.className = 'products-controls';
            controls.style.display = 'flex';
            controls.style.flexWrap = 'wrap';
            controls.style.gap = '10px';
            controls.style.alignItems = 'center';
            controls.style.margin = '8px 0 16px 0';

            const search = document.createElement('input');
            search.type = 'search';
            search.placeholder = 'Search products…';
            search.style.padding = '.55rem .8rem';
            search.style.borderRadius = '10px';
            search.style.border = '1px solid #f9a8d4';
            search.style.background = '#fce7f3';
            search.style.color = '#be185d';
            search.style.outline = 'none';
            search.style.minWidth = '220px';

            const sort = document.createElement('select');
            sort.innerHTML = `
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
            `;
            sort.style.padding = '.55rem .8rem';
            sort.style.borderRadius = '10px';
            sort.style.border = '1px solid #f9a8d4';
            sort.style.background = '#fff';
            sort.style.color = '#6b7280';

            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.textContent = 'Clear';
            clearBtn.style.background = '#f3e8ff';
            clearBtn.style.color = '#7c3aed';
            clearBtn.style.border = '1px solid #e9d5ff';
            clearBtn.style.borderRadius = '999px';
            clearBtn.style.padding = '.45rem .9rem';
            clearBtn.style.cursor = 'pointer';
            clearBtn.style.fontWeight = '700';

            controls.appendChild(search);
            controls.appendChild(sort);
            controls.appendChild(clearBtn);

            header.insertAdjacentElement('afterend', controls);

            // Build a data model from current cards
            const originalCards = Array.from(grid.querySelectorAll('.product-card'));
            const model = originalCards.map((card, idx) => {
                const title = (card.querySelector('h3')?.textContent || '').trim();
                const desc = (card.querySelector('p')?.textContent || '').trim();
                const priceText = (card.querySelector('.product-price')?.textContent || '').replace('€', '').trim();
                const price = parseFloat(priceText);
                return {
                    idx,
                    node: card,
                    title,
                    desc,
                    price: isFinite(price) ? price : Number.NaN
                };
            });

            function apply() {
                const q = search.value.trim().toLowerCase();
                const sortBy = sort.value;

                // Filter
                let filtered = model.filter(m => {
                    if (!q) return true;
                    return m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q);
                });

                // Sort
                const collator = new Intl.Collator(undefined, { numeric: false, sensitivity: 'base' });
                filtered.sort((a, b) => {
                    switch (sortBy) {
                        case 'price-asc':
                            return (a.price || Infinity) - (b.price || Infinity);
                        case 'price-desc':
                            return (b.price || -Infinity) - (a.price || -Infinity);
                        case 'name-asc':
                            return collator.compare(a.title, b.title);
                        case 'name-desc':
                            return collator.compare(b.title, a.title);
                        default:
                            return a.idx - b.idx; // original order
                    }
                });

                // Render: clear grid and append in new order
                const frag = document.createDocumentFragment();
                filtered.forEach(item => frag.appendChild(item.node));
                grid.innerHTML = '';
                grid.appendChild(frag);
            }

            // Wire events
            let searchDebounce;
            search.addEventListener('input', () => {
                clearTimeout(searchDebounce);
                searchDebounce = setTimeout(apply, 180);
            });
            sort.addEventListener('change', apply);
            clearBtn.addEventListener('click', () => {
                search.value = '';
                sort.value = 'default';
                apply();
            });

            // Initial apply
            apply();
        });

        // ...existing code...

// Mini-cart UI: create once and update live
(function(){
    let mini;
    function renderMiniCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const list = mini.querySelector('#mini-cart-items');
        const totalEl = mini.querySelector('#mini-cart-total');
        list.innerHTML = '';
        let total = 0;
        cart.forEach((item, idx) => {
            const row = document.createElement('div');
            row.style.display = 'grid';
            row.style.gridTemplateColumns = '48px 1fr auto auto';
            row.style.gap = '8px';
            row.style.alignItems = 'center';
            row.style.margin = '6px 0';
            row.innerHTML = `
                <img src="${item.image}" alt="${item.title}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;"/>
                <div style="font-weight:600;color:#374151;">${item.title}</div>
                <div style="color:#6b7280;">x${item.quantity}</div>
                <div style="font-weight:700;color:#111827;">€${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
            `;
            list.appendChild(row);
            total += parseFloat(item.price) * item.quantity;
        });
        totalEl.textContent = `€${total.toFixed(2)}`;
    }
    window.openMiniCart = function(){
        if (!mini) {
            mini = document.createElement('div');
            mini.id = 'mini-cart';
            mini.style.position = 'fixed';
            mini.style.right = '16px';
            mini.style.top = '64px';
            mini.style.width = 'min(92vw, 360px)';
            mini.style.background = '#fff';
            mini.style.border = '1px solid #f3e8ff';
            mini.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
            mini.style.borderRadius = '14px';
            mini.style.padding = '14px';
            mini.style.zIndex = '10001';

            mini.innerHTML = `
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <strong style="color:#db2777;">Your Cart</strong>
                <div>
                  <button id="mini-view-cart" style="background:#f9a8d4;color:#7a1047;border:none;border-radius:999px;padding:.3rem .6rem;margin-right:6px;cursor:pointer;font-weight:700;">View</button>
                  <button id="mini-close" style="background:transparent;border:none;color:#6b7280;font-size:18px;cursor:pointer;">✕</button>
                </div>
              </div>
              <div id="mini-cart-items" style="max-height:40vh;overflow:auto;"></div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
                <span style="color:#6b7280;">Total</span>
                <span id="mini-cart-total" style="font-weight:800;color:#111827;">€0.00</span>
              </div>
            `;

            document.body.appendChild(mini);
            mini.querySelector('#mini-close').addEventListener('click', () => mini.remove());
            mini.querySelector('#mini-view-cart').addEventListener('click', () => { window.location.href = 'cart.html'; });
        }
        renderMiniCart();
    };

    // Update mini-cart when items change
    const origSet = localStorage.setItem;
    localStorage.setItem = function(k, v) {
        origSet.apply(this, arguments);
        if (k === 'cart' && window.document.getElementById('mini-cart')) {
            try { renderMiniCart(); } catch(e) {}
            try { window.updateCartCount(); } catch(e) {}
        }
    };
})();

// ...existing code...

// If on cart.html, render cart items and wire Checkout
if (window.location.pathname.endsWith('cart.html')) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total-amount');
    let total = 0;
    cartItemsDiv.innerHTML = '';
    cart.forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <span class="cart-item-title">${item.title}</span>
            <span class="cart-item-qty">x${item.quantity}</span>
            <span class="cart-item-price">€${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
            <span class="cart-remove" title="Remove"><i class="fas fa-times"></i></span>
        `;
        // Remove item on click
        itemDiv.querySelector('.cart-remove').addEventListener('click', function() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(idx, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        });
        cartItemsDiv.appendChild(itemDiv);
        total += parseFloat(item.price) * item.quantity;
    });
    cartTotalSpan.textContent = `€${total.toFixed(2)}`;
    updateCartCount();

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }
}

// ...existing code...

