document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    let allProducts = [];
    let activeCategory = 'all';
    let currentIndex = 0;
    const ITEMS_PER_PAGE = 12; // عدد المنتجات في كل دفعة

    // --- 0. تعريف الفئات ---
    const CATEGORIES = [
        { id: 'all', name: 'الكل', icon: 'fas fa-th-large' },
        { id: 'hair_care', name: 'العناية بالشعر', icon: 'fas fa-air-freshener', keywords: ["شعر", "استشوار", "مكواة", "فرشاة", "remington", "babyliss", "kemei", "vgr", "geepas", "rozina", "mac styler"] },
        { id: 'kitchen', name: 'المطبخ', icon: 'fas fa-utensils', keywords: ["مطبخ", "قطاعة", "خلاط", "مفرمة", "مقشرة", "موقد", "غلاية", "توابل", "شواية"] },
        { id: 'watches', name: 'ساعات', icon: 'fas fa-clock', keywords: ["watch", "ساعة", "ساعه", "rolex", "رولكس", "seiko"] },
        { id: 'care', name: 'عناية وجمال', icon: 'fas fa-spa', keywords: ["بشرة", "عناية", "كريم", "سيروم", "كحل", "روج", "بودرة", "ايلاينر", "كونسيلر", "عطر", "مجموعة"] },
        { id: 'electronics', name: 'أجهزة وأدوات', icon: 'fas fa-bolt', keywords: ["كهربائية", "جهاز", "مكنسة", "منفاخ", "شاحن", "كاميرا", "تلميع", "مسدس", "روبوت"] }
    ];

    // --- 1. جلب المنتجات وعرضها ---
    async function fetchProducts() {
        try {
            // تحديد المسار الصحيح لملف المنتجات بناءً على الصفحة الحالية
            const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
            // جلب المنتجات من ملف JSON
            const response = await fetch(`${pathPrefix}products.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json();

            // تخزين المنتجات في window لتكون متاحة في كل مكان (مثل السلة)
            window.allProducts = allProducts;
            assignCategoryToProducts();

            // عرض المنتجات فقط إذا كنا في الصفحة الرئيسية
            if (appContent) {
                renderHomePage();
            }
        } catch (error) {
            console.error("Could not fetch products:", error);
            if (appContent) {
                appContent.innerHTML = `<p class="error-message">عفواً، حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.</p>`;
            }
        }
    }

    // --- دوال الفئات ---
    function assignCategoryToProducts() {
        allProducts.forEach(product => {
            const text = (product.title + " " + product.description).toLowerCase();
            for (let i = 1; i < CATEGORIES.length; i++) {
                const cat = CATEGORIES[i];
                if (cat.keywords.some(k => text.includes(k.toLowerCase()))) {
                    product.category = cat.id;
                    return;
                }
            }
            product.category = 'other'; // فئة افتراضية
        });
    }

    function renderCategories() {
        return `
            <div class="category-container">
                <div class="category-scroll">
                    ${CATEGORIES.map(cat => `
                        <div class="category-pill ${activeCategory === cat.id ? 'active' : ''}" 
                             onclick="filterByCategory('${cat.id}')">
                            <i class="${cat.icon}"></i> ${cat.name}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.filterByCategory = (catId) => {
        activeCategory = catId;
        currentIndex = 0; // إعادة المؤشر للبداية
        renderHomePage();
    };

    // --- دالة عرض المنتجات ---
    function displayProducts(products, title = "تسوق أحدث المنتجات") {
        const headerHTML = `
            <div class="products-grid-header">
                <h1 class="products-main-title">${title}</h1>
                ${products.length > 0 ? `<p>اكتشف تشكيلتنا الواسعة من المنتجات المختارة بعناية</p>` : `<p class="info-message">لا توجد منتجات تطابق بحثك.</p>`}
            </div>`;

        const productsHTML = `<div class="products-grid">${products.map(product => createProductCard(product)).join('')}</div>`;
        
        return headerHTML + productsHTML;
    }

    // --- دالة عرض الصفحة الرئيسية (مُعاد بناؤها) ---
    function renderHomePage() {
        if (!appContent) return;
        appContent.innerHTML = `
            ${renderCategories()}
            <div id="products-container"></div>
            <div id="load-more-container" class="load-more-container"></div>
        `;
        loadMoreProducts();
    }

    // --- دالة تحميل المزيد من المنتجات (مُعاد بناؤها) ---
    function loadMoreProducts() {
        const filteredProducts = activeCategory === 'all'
            ? allProducts
            : allProducts.filter(p => p.category === activeCategory);

        const batch = filteredProducts.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
        const productsContainer = document.getElementById('products-container');
        
        if (currentIndex === 0) {
            const title = `تسوق أحدث المنتجات في قسم "${CATEGORIES.find(c => c.id === activeCategory).name}"`;
            productsContainer.innerHTML = displayProducts(batch, title);
        } else {
            const grid = productsContainer.querySelector('.products-grid');
            if (grid) grid.innerHTML += batch.map(product => createProductCard(product)).join('');
        }
        
        currentIndex += batch.length;
        updateLoadMoreButton(filteredProducts.length);
    }

    // --- 2. إنشاء كرت المنتج (Product Card) ---
    window.createProductCard = function(product) { // جعل الدالة عامة
        const salePrice = parseFloat(product.sale_price);
        const originalPrice = parseFloat(product.price);
        let discountPercentage = 0;

        if (salePrice < originalPrice) {
            discountPercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
        }
        const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
        const primaryImage = product['image link'];
        const secondaryImage = product['additional image link'];

        return `
            <div class="product-card" data-id="${product.id}">
                <a href="${pathPrefix}product-details.html?id=${product.id}" class="product-link">
                    <div class="product-image-container">
                        <img 
                            src="${primaryImage}" 
                            alt="${product.title}" 
                            class="product-image product-image-primary"
                            loading="lazy" 
                            width="300" 
                            height="300">
                        ${secondaryImage ? `
                        <img 
                            src="${secondaryImage}" 
                            alt="${product.title} (صورة إضافية)" 
                            class="product-image product-image-secondary"
                            loading="lazy" 
                            width="300" 
                            height="300">
                        ` : ''}
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

    // --- 3. دوال البحث ---
    function handleSearch(query) {
        if (!query) {
            currentIndex = 0;
            renderHomePage();
            return;
        }
        const lowerCaseQuery = query.toLowerCase();
        const filteredProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes(lowerCaseQuery) ||
            (product.description && product.description.toLowerCase().includes(lowerCaseQuery)) ||
            (product.brand && product.brand.toLowerCase().includes(lowerCaseQuery))
        );
        
        const productsContainer = document.getElementById('products-container');
        if(productsContainer) productsContainer.innerHTML = displayProducts(filteredProducts, `نتائج البحث عن: "${query}"`);
        
        // إخفاء زر تحميل المزيد عند البحث
        document.getElementById('load-more-container').innerHTML = '';
    }

    // ربط البحث بالمدخلات (مع التحقق من وجود العناصر)
    if (searchInput) {
        searchInput.addEventListener('input', () => handleSearch(searchInput.value));
    }
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', () => handleSearch(mobileSearchInput.value));
    }

    // --- 4. تهيئة الصفحة ---
    fetchProducts();

    // --- 5. جعل دوال البحث متاحة عالمياً ---
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

    // --- 7. زر تحميل المزيد ---
    function updateLoadMoreButton(totalFiltered) {
        const loadMoreContainer = document.getElementById('load-more-container');
        if (currentIndex < totalFiltered) {
            loadMoreContainer.innerHTML = `<button class="btn-load-more" onclick="loadMoreProducts()">تحميل المزيد</button>`;
        } else {
            loadMoreContainer.innerHTML = ''; // إخفاء الزر عند عرض كل المنتجات
        }
    }
    window.loadMoreProducts = loadMoreProducts; // جعلها متاحة للزر

    // --- 8. اقتراحات البحث ---
    window.showSuggestions = function(input) {
        const query = input.value.toLowerCase().trim();
        const suggestionsBox = document.getElementById('search-suggestions');
        if (!suggestionsBox) return;

        if (query.length < 2) {
            suggestionsBox.classList.remove('active');
            return;
        }

        const matches = allProducts.filter(p => p.title.toLowerCase().includes(query)).slice(0, 5);
        
        if (matches.length > 0) {
            suggestionsBox.innerHTML = matches.map(p => {
                const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
                return `
                <a href="${pathPrefix}product-details.html?id=${p.id}" class="suggestion-item">
                    <img src="${p['image link']}" onerror="this.src='images/og-default.jpg'">
                    <div class="suggestion-info">
                        <h5>${p.title}</h5>
                        <span>${parseFloat(p.sale_price).toFixed(2)} ر.ع.</span>
                    </div>
                </a>`;
            }).join('');
            suggestionsBox.classList.add('active');
        } else {
            suggestionsBox.classList.remove('active');
        }
    }

    // إغلاق الاقتراحات عند النقر خارجها
    document.addEventListener('click', (e) => {
        const suggestionsBox = document.getElementById('search-suggestions');
        if (suggestionsBox && !e.target.closest('.search-box')) {
            suggestionsBox.classList.remove('active');
        }
    });
});

// --- 6. دوال السلة (Cart Functions) ---

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
    // toggleCart(true); // تم التعطيل: لن نفتح السلة تلقائيًا
}

async function updateCartUI() {
    const cart = getCart();
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!window.allProducts) {
        // إذا لم يتم تحميل المنتجات بعد، انتظر قليلاً ثم حاول مرة أخرى
        setTimeout(updateCartUI, 100);
        return;
    }

    // تحديث عدد المنتجات في أيقونة السلة
    if (cartCount) {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalQuantity;
        cartCount.style.display = totalQuantity > 0 ? 'flex' : 'none';
    }

    // تحديث محتوى السلة الجانبية (إذا كانت موجودة في الصفحة)
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
                                <div class="cart-item-price">
                                    <span>${cartItem.quantity} x </span>
                                    <span class="omani-red">${parseFloat(product.sale_price).toFixed(2)} ر.ع.</span>
                                </div>
                            </div>
                            <div class="cart-item-actions">
                                <!-- لاحقاً: يمكن إضافة أزرار لزيادة/نقصان الكمية -->
                                <button class="cart-item-remove" onclick="removeFromCart(${product.id})">&times;</button>
                            </div>
                        </div>
                    `;
                }
            }

            cartItemsContainer.innerHTML = itemsHTML;
            cartTotalElement.textContent = `${total.toFixed(2)} ر.ع.`;
        }
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
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