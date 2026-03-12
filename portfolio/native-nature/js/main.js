/* ============================================
   NATIVE NATURE — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // Navbar scroll behavior
    // ========================================
    const navbar = document.getElementById('navbar');
    const announcementBar = document.querySelector('.announcement-bar');

    const handleScroll = () => {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);

        if (announcementBar) {
            if (scrolled) {
                announcementBar.style.transform = 'translateY(-100%)';
                announcementBar.style.position = 'fixed';
                announcementBar.style.top = '0';
                announcementBar.style.left = '0';
                announcementBar.style.right = '0';
                announcementBar.style.zIndex = '1001';
            } else {
                announcementBar.style.transform = 'translateY(0)';
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ========================================
    // Mobile menu toggle
    // ========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ========================================
    // Cart functionality
    // ========================================
    const cart = [];
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cartCount = document.querySelector('.cart-count');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartShopLink = document.getElementById('cartShopLink');

    const openCart = () => {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeCart = () => {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    if (cartShopLink) {
        cartShopLink.addEventListener('click', closeCart);
    }

    const updateCartUI = () => {
        // Update count badge
        const totalItems = cart.length;
        cartCount.textContent = totalItems;
        cartCount.classList.toggle('visible', totalItems > 0);

        if (totalItems === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <p>Your bag is empty</p>
                    <a href="#shop" class="btn btn-primary" onclick="document.getElementById('cartDrawer').classList.remove('open');document.getElementById('cartOverlay').classList.remove('open');document.body.style.overflow='';">Start Shopping</a>
                </div>
            `;
            cartFooter.style.display = 'none';
            return;
        }

        // Build cart items
        let html = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            subtotal += item.price;
            html += `
                <div class="cart-item">
                    <div class="cart-item-image"></div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">£${item.price.toFixed(2)}</div>
                        <button class="cart-item-remove" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
        });

        cartBody.innerHTML = html;
        cartSubtotal.textContent = `£${subtotal.toFixed(2)}`;
        cartFooter.style.display = 'block';

        // Add remove listeners
        cartBody.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    };

    // Add to cart buttons
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = btn.dataset.product;
            const price = parseFloat(btn.dataset.price);

            cart.push({ name: product, price });
            updateCartUI();
            openCart();

            // Button feedback
            const originalText = btn.textContent;
            btn.textContent = 'Added ✓';
            btn.style.background = 'var(--green-primary)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1500);
        });
    });

    // ========================================
    // Scroll reveal animations
    // ========================================
    const revealElements = document.querySelectorAll(
        '.product-card, .category-card, .testimonial-card, .split-content, .split-image, .trust-item, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));

    // ========================================
    // Newsletter form
    // ========================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Subscribed ✓';
            btn.style.background = 'var(--green-primary)';
            btn.style.borderColor = 'var(--green-primary)';
            btn.style.color = 'white';
            input.value = '';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }, 3000);
        });
    }

    // ========================================
    // Smooth scroll for anchor links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================================
    // Stagger animation for grid items
    // ========================================
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    child.style.transitionDelay = `${i * 100}ms`;
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.products-grid, .categories-grid, .testimonials-grid').forEach(grid => {
        staggerObserver.observe(grid);
    });
});
