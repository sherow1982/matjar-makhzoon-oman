document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    let allProducts = [];

    // --- دالة لجلب المنتجات ---
    async function fetchProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json();
            displayProducts(allProducts);
        } catch (error) {
            console.error("Could not fetch products:", error);
            appContent.innerHTML = `<p class="error-message">عفواً، حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.</p>`;
        }
    }

    // --- دالة لعرض المنتجات ---
    function displayProducts(products) {
        if (!products.length) {
            appContent.innerHTML = `<p class="info-message">لا توجد منتجات تطابق بحثك.</p>`;
            return;
        }

        const productsHTML = `
            <div class="products-grid-header">
                <h1 class="products-main-title">تسوق أحدث المنتجات</h1>
                <p>اكتشف تشكيلتنا الواسعة من المنتجات المختارة بعناية</p>
            </div>
            <div class="products-grid">
                ${products.map(product => createProductCard(product)).join('')}
            </div>
        `;
        appContent.innerHTML = productsHTML;
    }

    // --- دالة لإنشاء كرت المنتج ---
    window.createProductCard = function(product) { // جعل الدالة عامة
        const salePrice = parseFloat(product.sale_price);
        const originalPrice = parseFloat(product.price);
        let discountPercentage = 0;

        if (salePrice < originalPrice) {
            discountPercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
        }

        return `
            <div class="product-card" data-id="${product.id}">
                <a href="product-details.html?id=${product.id}" class="product-link">
                    <div class="product-image-container">
                        <img 
                            src="${product['image link']}" 
                            alt="${product.title}" 
                            class="product-image"
                            loading="lazy" 
                            width="300" 
                            height="300">
                        ${discountPercentage > 0 ? `<span class="discount-badge">${discountPercentage}%</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-price">
                            <span class="sale-price">${salePrice.toFixed(2)} ر.ع.</span>
                            ${originalPrice > salePrice ? `<span class="original-price">${originalPrice.toFixed(2)} ر.ع.</span>` : ''}
                        </div>
                    </div>
                </a>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, event)">
                    <i class="fas fa-cart-plus"></i> أضف للسلة
                </button>
            </div>
        `;
    }

    // --- دوال البحث ---
    function handleSearch(query) {
        if (!query) {
            displayProducts(allProducts);
            return;
        }
        const lowerCaseQuery = query.toLowerCase();
        const filteredProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes(lowerCaseQuery) ||
            product.description.toLowerCase().includes(lowerCaseQuery) ||
            product.brand.toLowerCase().includes(lowerCaseQuery)
        );
        displayProducts(filteredProducts);
    }

    // ربط البحث بالمدخلات
    searchInput.addEventListener('input', () => handleSearch(searchInput.value));
    mobileSearchInput.addEventListener('input', () => handleSearch(mobileSearchInput.value));

    // --- تهيئة الصفحة ---
    fetchProducts();

    // --- جعل الدوال متاحة عالمياً ---
    window.searchProducts = () => handleSearch(searchInput.value);
    window.searchFromMobile = () => handleSearch(mobileSearchInput.value);
    window.handleEnter = (event) => {
        if (event.key === 'Enter') {
            handleSearch(searchInput.value);
        }
    };
    window.handleMobileSearch = (event) => {
        if (event.key === 'Enter') {
            handleSearch(mobileSearchInput.value);
            toggleMobileMenu(); // إغلاق القائمة بعد البحث
        }
    };
});

// --- دوال السلة (Cart Functions) ---

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(productId, event) {
    event.stopPropagation(); // منع الانتقال للصفحة عند الضغط على الزر
    let cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart(cart);
    showNotification('تمت إضافة المنتج إلى السلة بنجاح!');
    toggleCart(true); // فتح السلة عند الإضافة
}

function updateCartUI() {
    const cart = getCart();
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    // تحديث عدد المنتجات في أيقونة السلة
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;
    cartCount.style.display = totalQuantity > 0 ? 'flex' : 'none';

    // تحديث محتوى السلة الجانبية (إذا كانت موجودة في الصفحة)
    if (cartItemsContainer) {
        // هنا يجب جلب بيانات المنتجات الكاملة لعرضها في السلة
        // هذه الخطوة تتطلب الوصول إلى `allProducts` أو جلبها مرة أخرى
        // للتبسيط، سنعرض فقط رسالة إذا كانت فارغة
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">سلّتك فارغة حالياً.</p>';
            cartTotalElement.textContent = '0.00 ر.ع.';
        } else {
            // منطق عرض المنتجات في السلة (يتطلب تفاصيل المنتج)
            // هذا الجزء يحتاج إلى تطوير إضافي في صفحة السلة وصفحة الدفع
        }
    }
}

function toggleCart(forceOpen = false) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    if (forceOpen) {
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
    } else {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// تحديث واجهة المستخدم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateCartUI);