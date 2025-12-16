document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');

    // --- دالة فتح وإغلاق القائمة الجانبية للموبايل ---
    window.toggleMobileMenu = function() {
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
    };

    // --- دالة فتح وإغلاق السلة ---
    window.toggleCart = function(forceOpen = false) {
        if (forceOpen) {
            cartSidebar.classList.add('open');
            overlay.classList.add('active');
        } else {
            cartSidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }
    };

    // --- دالة إتمام الطلب (الانتقال لصفحة الدفع) ---
    window.checkoutPage = function() {
        // لاحقاً، يمكنك إضافة المنتجات هنا قبل الانتقال
        // التحقق إذا كنا داخل مجلد pages أم لا
        if (window.location.pathname.includes('/pages/')) {
            window.location.href = 'checkout.html';
        } else {
            window.location.href = 'pages/checkout.html';
        }
    };

    // تحديث واجهة المستخدم عند تحميل الصفحة
    updateCartUI();
});

// --- دوال السلة (Cart Functions) ---

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId, quantity = 1, event) {
    if (event) event.stopPropagation(); // منع الانتقال للصفحة عند الضغط على الزر
    let cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }

    saveCart(cart);
    showNotification('تمت إضافة المنتج إلى السلة بنجاح!');
    toggleCart(true); // إعادة التفعيل: فتح السلة عند الإضافة
}

function updateCartItemQuantity(productId, newQuantity) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1); // إزالة المنتج إذا كانت الكمية 0
        }
    }
    saveCart(cart);
}

async function updateCartUI() {
    const cart = getCart();
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!window.allProducts) {
        setTimeout(updateCartUI, 100);
        return;
    }

    if (cartCount) {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalQuantity;
        cartCount.style.display = totalQuantity > 0 ? 'flex' : 'none';
    }

    if (cartItemsContainer && cartTotalElement) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">سلّتك فارغة حالياً.</p>';
            cartTotalElement.textContent = '0.00 ر.ع.';
        } else {
            let total = 0;
            let itemsHTML = '';
            for (const cartItem of cart) {
                const product = window.allProducts.find(p => p.id === cartItem.id);
                if (product) {
                    const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
                    const imageUrl = product['image link'].startsWith('http') ? product['image link'] : `${pathPrefix}${product['image link']}`;
                    const itemTotal = parseFloat(product.sale_price) * cartItem.quantity;
                    total += itemTotal;
                    itemsHTML += `
                        <div class="cart-item">
                            <img src="${imageUrl}" alt="${product.title}" class="cart-item-img">
                            <div class="cart-item-details">
                                <h4 class="cart-item-title">${product.title}</h4>
                                <div class="cart-item-price">${parseFloat(product.sale_price).toFixed(2)} ر.ع.</div>
                                <div class="cart-quantity-selector">
                                    <button onclick="updateCartItemQuantity(${product.id}, ${cartItem.quantity - 1})">-</button>
                                    <input type="text" value="${cartItem.quantity}" readonly>
                                    <button onclick="updateCartItemQuantity(${product.id}, ${cartItem.quantity + 1})">+</button>
                                </div>
                            </div>
                            <button class="cart-item-remove" onclick="updateCartItemQuantity(${product.id}, 0)" title="إزالة المنتج">&times;</button>
                        </div>
                    `;
                }
            }
            cartItemsContainer.innerHTML = itemsHTML;
            cartTotalElement.textContent = `${total.toFixed(2)} ر.ع.`;
        }
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => { document.body.removeChild(notification); }, 500);
    }, 3000);
}