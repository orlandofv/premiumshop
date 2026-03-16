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

    // ===================== Page Loader =====================
    window.addEventListener('load', function() {
        const loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('loader-hidden');
    });

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
            else count = Math.max(0, count-1);
            badge.textContent = count;
        }
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

        // Check if modal exists before proceeding
        const modalEl = document.getElementById('quickViewModal');
        if (!modalEl) {
            console.warn('Quick view modal not found in this page.');
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
    if (typeof changeImage === 'undefined') {
        window.changeImage = function(thumb) {
            const main = document.getElementById('mainImage');
            if (main) {
                main.src = thumb.src;
                document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            }
        };
    }

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

    document.querySelectorAll('.star-rating').forEach(el => {
        const rating = parseFloat(el.getAttribute('data-rating')) || 0;
        const percent = (rating / 5) * 100;
        el.querySelector('.stars-inner').style.width = percent + '%';
    });

    // Ensure modal close via X button works (fallback)
    document.querySelectorAll('.modal .btn-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) modalInstance.hide();
            }
        });
    });

    function closeCustomModal() {
    alert('Custom close function called!');
    document.getElementById('modal').style.display = 'none';
  }

})();


