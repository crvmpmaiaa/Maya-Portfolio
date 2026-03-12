/* ============================================
   NATIVE NATURE — Product Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // Purchase option toggle
    // ========================================
    const purchaseOptions = document.querySelectorAll('.purchase-option');
    const atcBtn = document.querySelector('.btn-atc');
    let quantity = 1;

    // Read prices from the purchase option labels
    const oneTimeOption = document.querySelector('.purchase-option input[value="one-time"]');
    const subscribeOption = document.querySelector('.purchase-option input[value="subscribe"]');

    // Parse price from the ATC button text
    let oneTimePrice = 0;
    let subscribePrice = 0;

    if (oneTimeOption) {
        const label = oneTimeOption.closest('.purchase-option');
        const priceText = label.querySelector('.option-left span').textContent;
        oneTimePrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }
    if (subscribeOption) {
        const label = subscribeOption.closest('.purchase-option');
        const priceText = label.querySelector('.option-left span').textContent;
        subscribePrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }

    // Fallback: parse from ATC button
    if (!oneTimePrice && atcBtn) {
        const match = atcBtn.textContent.match(/£([\d.]+)/);
        if (match) oneTimePrice = parseFloat(match[1]);
    }

    let basePrice = oneTimePrice || 0;

    purchaseOptions.forEach(option => {
        option.addEventListener('click', () => {
            purchaseOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');

            const value = option.querySelector('input').value;
            basePrice = value === 'subscribe' ? subscribePrice : oneTimePrice;
            updateATCButton();
        });
    });

    // ========================================
    // Quantity selector
    // ========================================
    const qtyMinus = document.querySelector('.qty-btn.minus');
    const qtyPlus = document.querySelector('.qty-btn.plus');
    const qtyValue = document.querySelector('.qty-value');

    if (qtyMinus && qtyPlus && qtyValue) {
        qtyMinus.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                qtyValue.textContent = quantity;
                updateATCButton();
            }
        });

        qtyPlus.addEventListener('click', () => {
            if (quantity < 10) {
                quantity++;
                qtyValue.textContent = quantity;
                updateATCButton();
            }
        });
    }

    const updateATCButton = () => {
        if (atcBtn && basePrice) {
            const total = (basePrice * quantity).toFixed(2);
            atcBtn.textContent = `Add to Bag — £${total}`;
        }
    };

    // ========================================
    // ATC button
    // ========================================
    if (atcBtn) {
        atcBtn.addEventListener('click', () => {
            const originalText = atcBtn.textContent;
            atcBtn.textContent = 'Added to Bag ✓';
            atcBtn.style.background = 'var(--green-mid)';

            setTimeout(() => {
                atcBtn.textContent = originalText;
                atcBtn.style.background = '';
            }, 2000);
        });
    }

    // ========================================
    // Gallery thumbnail switching
    // ========================================
    const thumbs = document.querySelectorAll('.thumb');
    const mainImage = document.querySelector('.gallery-placeholder');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            if (mainImage) {
                mainImage.style.background = thumb.style.background;
            }
        });
    });

    // ========================================
    // Animate review bars on scroll
    // ========================================
    const barsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.bar-fill');
                fills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0%';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            fill.style.width = width;
                        });
                    });
                });
                barsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const reviewsSection = document.querySelector('.reviews-bars');
    if (reviewsSection) {
        barsObserver.observe(reviewsSection);
    }
});
