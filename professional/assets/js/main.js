// main.js – PremiumShop Complete JavaScript

(function() {
    'use strict';

    // ===================== Helper Functions =====================
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function createThemeToggleButton(extraClasses) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = ['btn', 'btn-sm', 'btn-outline-secondary', 'theme-toggle-btn', extraClasses || ''].join(' ').trim();
        button.setAttribute('data-theme-toggle', 'true');
        button.setAttribute('title', 'Toggle color theme');
        button.setAttribute('aria-label', 'Toggle color theme');
        button.innerHTML = '<i class="fas fa-moon"></i>';
        return button;
    }

    function getThemeButtons() {
        return Array.from(document.querySelectorAll('#themeToggle, [data-theme-toggle]'));
    }

    function updateThemeButtons(theme) {
        getThemeButtons().forEach((button) => {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
            button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        });
    }

    function ensureThemeSwitcher() {
        if (getThemeButtons().length) {
            return;
        }

        const utilityGroup = document.querySelector('.top-utility-bar .container > .d-flex:first-child');
        const dashboardHost = document.querySelector('.dashboard-header .header-user');
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-switcher';

        if (utilityGroup) {
            wrapper.appendChild(createThemeToggleButton());
            utilityGroup.prepend(wrapper);
            return;
        }

        if (dashboardHost) {
            wrapper.classList.add('me-2');
            wrapper.appendChild(createThemeToggleButton());
            const userDropdown = dashboardHost.querySelector('.user-dropdown');
            dashboardHost.insertBefore(wrapper, userDropdown || dashboardHost.firstChild);
            return;
        }

        wrapper.classList.add('theme-switcher-floating');
        wrapper.appendChild(createThemeToggleButton());
        document.body.appendChild(wrapper);
    }

    function getMenuItemByText(menu, text) {
        const label = text.toLowerCase();
        return Array.from(menu.querySelectorAll('.dropdown-item')).find((item) => item.textContent.trim().toLowerCase() === label);
    }

    function createMenuItem(text, href) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'dropdown-item';
        link.href = href;
        link.textContent = text;
        li.appendChild(link);
        return li;
    }

    function ensureMenuItem(menu, text, href, options) {
        const settings = options || {};
        const existing = getMenuItemByText(menu, text);
        if (existing) {
            existing.href = href;
            return existing.closest('li');
        }

        const item = createMenuItem(text, href);
        if (settings.beforeText) {
            const beforeItem = getMenuItemByText(menu, settings.beforeText);
            if (beforeItem) {
                menu.insertBefore(item, beforeItem.closest('li'));
                return item;
            }
        }

        if (settings.afterText) {
            const afterItem = getMenuItemByText(menu, settings.afterText);
            if (afterItem) {
                afterItem.closest('li').insertAdjacentElement('afterend', item);
                return item;
            }
        }

        menu.appendChild(item);
        return item;
    }

    function enhanceSharedNavigation() {
        const accountMenus = Array.from(document.querySelectorAll('.dropdown-menu')).filter((menu) => /wishlist|profile|login|logout/i.test(menu.textContent));

        accountMenus.forEach((menu) => {
            const profileLink = getMenuItemByText(menu, 'Profile');
            if (profileLink) {
                profileLink.href = 'profile.html';
            }

            const cartLink = getMenuItemByText(menu, 'Cart');
            if (cartLink) {
                cartLink.href = 'cart.html';
            }

            const wishlistLink = getMenuItemByText(menu, 'Wishlist');
            if (wishlistLink) {
                wishlistLink.href = 'wishlist.html';
            }

            const loginLink = getMenuItemByText(menu, 'Login');
            if (loginLink) {
                loginLink.href = 'login.html';
                ensureMenuItem(menu, 'Register', 'register.html', { afterText: 'Login' });
                ensureMenuItem(menu, 'Forgot Password', 'forgot-password.html', { afterText: 'Register' });
            }
        });

        document.querySelectorAll('footer a').forEach((link) => {
            const text = link.textContent.trim().toLowerCase();
            if (text === 'about us') {
                link.href = 'about.html';
            }
            if (text === 'contact') {
                link.href = 'contact.html';
            }
        });
    }

    // ===================== Page Loader =====================
    window.addEventListener('load', function() {
        const loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('loader-hidden');
    });

    // ===================== Theme Switcher (Dark Mode) =====================
    (function initTheme() {
        ensureThemeSwitcher();
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButtons(savedTheme);

        document.addEventListener('click', function(e) {
            const themeToggle = e.target.closest('#themeToggle, [data-theme-toggle]');
            if (!themeToggle) return;

            let current = document.documentElement.getAttribute('data-theme');
            let newTheme = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeButtons(newTheme);
        });
    })();

    // ===================== Shared Navigation Enhancements =====================
    enhanceSharedNavigation();

    // ===================== Demo Theme Panel (Primary Color Switcher) =====================
    (function initDemoTheme() {
        document.querySelectorAll('.theme-demo-colors span').forEach(span => {
            span.addEventListener('click', function(e) {
                e.stopPropagation();
                const color = this.style.backgroundColor;
                if (color) {
                    document.documentElement.style.setProperty('--primary', color);
                    // Also adjust primary-dark for gradient consistency
                    // Simple darken approximation: reduce lightness – for demo only
                    document.documentElement.style.setProperty('--primary-dark', color);
                }
            });
        });
    })();

    // ===================== AOS (Animate on Scroll) Initialization =====================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-in-out'
        });
    }

    // ===================== Wishlist Toggle =====================
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.product-wishlist');
        if (!btn) return;
        e.preventDefault();
        const icon = btn.querySelector('i');
        if (!icon) return;
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        const badge = document.querySelector('.wishlist-badge');
        if (badge) {
            let count = parseInt(badge.textContent) || 0;
            if (icon.classList.contains('fas')) count++;
            else count = Math.max(0, count - 1);
            badge.textContent = count;
        }
        showToast(icon.classList.contains('fas') ? 'Added to wishlist' : 'Removed from wishlist');
    });

    // ===================== Add to Cart Simulation =====================
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.add-to-cart-sim, .add-to-cart-btn, .product-card .btn-outline-primary');
        if (!btn) return;
        // Prevent if it's a link to details
        if (btn.tagName === 'A' && btn.getAttribute('href') !== '#') return;
        e.preventDefault();
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            let count = parseInt(badge.textContent) || 0;
            badge.textContent = count + 1;
        }
        showToast('Item added to cart!');
    });

    // ===================== Quick View Modal =====================
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.quick-view-btn');
        if (!btn) return;
        e.preventDefault();

        const modalEl = document.getElementById('quickViewModal');
        if (!modalEl) {
            console.warn('Quick view modal not found.');
            return;
        }

        const card = btn.closest('.product-card');
        if (!card) return;

        const img = card.querySelector('img') ? card.querySelector('img').src : '';
        const title = card.querySelector('.product-title') ? card.querySelector('.product-title').textContent : 'Product';
        const categoryElem = card.querySelector('.product-category');
        const category = categoryElem ? categoryElem.textContent : '';
        const priceElem = card.querySelector('.product-price');
        const price = priceElem ? priceElem.textContent : '$0.00';
        const oldPriceElem = card.querySelector('.old-price');
        const oldPrice = oldPriceElem ? oldPriceElem.textContent : '';

        const modalImg = document.getElementById('quickViewImage');
        const modalTitle = document.getElementById('quickViewTitle');
        const modalCategory = document.getElementById('quickViewCategory');
        const modalPrice = document.getElementById('quickViewPrice');
        const modalOldPrice = document.getElementById('quickViewOldPrice');

        if (modalImg) modalImg.src = img;
        if (modalTitle) modalTitle.textContent = title;
        if (modalCategory) modalCategory.textContent = category;
        if (modalPrice) modalPrice.textContent = price;
        if (modalOldPrice) {
            if (oldPrice) {
                modalOldPrice.style.display = 'inline';
                modalOldPrice.textContent = oldPrice;
            } else {
                modalOldPrice.style.display = 'none';
            }
        }

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    });

    // ===================== Payment Method Selection =====================
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // ===================== Place Order Simulation (checkout) =====================
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const requiredFields = document.querySelectorAll('#checkout-form [required]');
            let allFilled = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) allFilled = false;
            });
            if (!allFilled) {
                alert('Please fill in all required fields.');
                return;
            }
            this.disabled = true;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Processing...';
            setTimeout(() => {
                alert('Order placed successfully! (Demo)');
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // ===================== Product Gallery Thumbnail Switch =====================
    window.changeImage = function(thumb) {
        const main = document.getElementById('mainImage');
        if (main) {
            main.src = thumb.src;
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        }
    };

    // ===================== Filter Sidebar Toggle (mobile) =====================
    const filterToggle = document.getElementById('filterToggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', function() {
            const sidebar = document.getElementById('filterSidebar');
            if (sidebar) sidebar.classList.toggle('show');
        });
    }

    // ===================== Rating Interaction (demo) =====================
    document.querySelectorAll('.rate-stars i').forEach(star => {
        star.addEventListener('mouseenter', function() {
            const value = this.getAttribute('data-value');
            highlightStars(this.parentElement, value);
        });
        star.addEventListener('mouseleave', function() {
            const container = this.parentElement;
            const current = container.getAttribute('data-current') || 0;
            highlightStars(container, current);
        });
        star.addEventListener('click', function() {
            const container = this.parentElement;
            const value = this.getAttribute('data-value');
            container.setAttribute('data-current', value);
            // Here you could submit rating via AJAX
        });
    });

    function highlightStars(container, value) {
        container.querySelectorAll('i').forEach(star => {
            const starValue = star.getAttribute('data-value');
            if (starValue <= value) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    // ===================== Coupon Code Simulation =====================
    document.querySelectorAll('.apply-coupon').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.previousElementSibling;
            if (!input) return;
            const code = input.value.trim();
            if (code.toLowerCase() === 'save10') {
                alert('Coupon applied! 10% discount.');
                // Update total on cart/checkout page (demo)
            } else {
                alert('Invalid coupon code.');
            }
        });
    });

    // ===================== Contact Form Simulation =====================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = originalText;
                alert('Message sent! (demo)');
                this.reset();
            }, 1500);
        });
    }

    // ===================== Toast Notification =====================
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // ===================== Load Cart Data on Page Load (if API exists) =====================
    async function loadCartData() {
        try {
            const response = await fetch('/cart/api/');
            if (response.ok) {
                const data = await response.json();
                document.querySelectorAll('.cart-badge').forEach(el => {
                    el.textContent = data.cart_count;
                });
                const miniCart = document.querySelector('.mini-cart-dropdown');
                if (miniCart && data.cart_html) {
                    miniCart.innerHTML = data.cart_html;
                }
            }
        } catch (e) {
            // Silently ignore if API not present (static demo)
        }
    }
    // Optionally call it – for static demo it's disabled
    // loadCartData();

    // ===================== Auto-set star rating widths =====================
    document.querySelectorAll('.star-rating[data-rating]').forEach(el => {
        const rating = parseFloat(el.getAttribute('data-rating')) || 0;
        const percent = (rating / 5) * 100;
        const inner = el.querySelector('.stars-inner');
        if (inner) inner.style.width = percent + '%';
    });

    // ===================== Add ripple class to all buttons (optional) =====================
    document.querySelectorAll('.btn').forEach(btn => {
        if (!btn.classList.contains('no-ripple')) {
            btn.classList.add('ripple-btn');
        }
    });

})();
