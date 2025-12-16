// هذا الملف هو المحرك الرئيسي للمتجر

let allProducts = [];
let activeCategory = 'all';
let currentIndex = 0;
const ITEMS_PER_PAGE = 12;

// --- 0. تعريف الفئات ---
const CATEGORIES = [
    { id: 'all', name: 'الكل', icon: 'fas fa-th-large' },
    { id: 'hair_care', name: 'العناية بالشعر', icon: 'fas fa-air-freshener', keywords: ["شعر", "استشوار", "مكواة", "فرشاة", "remington", "babyliss", "kemei", "vgr", "geepas", "rozina", "mac styler"] },
    { id: 'kitchen', name: 'المطبخ', icon: 'fas fa-utensils', keywords: ["مطبخ", "قطاعة", "خلاط", "مفرمة", "مقشرة", "موقد", "غلاية", "توابل", "شواية"] },
    { id: 'watches', name: 'ساعات', icon: 'fas fa-clock', keywords: ["watch", "ساعة", "ساعه", "rolex", "رولكس", "seiko"] },
    { id: 'care', name: 'عناية وجمال', icon: 'fas fa-spa', keywords: ["بشرة", "عناية", "كريم", "سيروم", "كحل", "روج", "بودرة", "ايلاينر", "كونسيلر", "عطر", "مجموعة"] },
    { id: 'electronics', name: 'أجهزة وأدوات', icon: 'fas fa-bolt', keywords: ["كهربائية", "جهاز", "مكنسة", "منفاخ", "شاحن", "كاميرا", "تلميع", "مسدس", "روبوت"] }
];
window.CATEGORIES = CATEGORIES; // جعلها متاحة عالمياً للصفحات الأخرى

// --- 1. جلب المنتجات وعرضها ---
async function loadApp() {
    return new Promise(async (resolve, reject) => {
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

            // تحديث واجهة السلة
            updateCartUI();
            
            resolve(allProducts); // إرجاع المنتجات عند النجاح
        } catch (error) {
            console.error("Could not fetch products:", error);
            const appContent = document.getElementById('app-content');
            if (appContent) {
                appContent.innerHTML = `<p class="error-message">عفواً، حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.</p>`;
            }
            reject(error); // رفض البروميس عند الفشل
        }
    });
}

// --- دوال الفئات ---
function assignCategoryToProducts() {
    if (!window.allProducts) return;
    window.allProducts.forEach(product => {
        const text = (product.title + " " + (product.description || "")).toLowerCase();
        let foundCategory = false;
        for (let i = 1; i < CATEGORIES.length; i++) {
            const cat = CATEGORIES[i];
            if (cat.keywords.some(k => text.includes(k.toLowerCase()))) {
                product.category = cat.id;
                foundCategory = true;
                break; // الخروج من الحلقة بمجرد العثور على فئة
            }
        }
        if (!foundCategory) product.category = 'other'; // فئة افتراضية
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
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.innerHTML = ''; // تنظيف المحتوى القديم
        }
        renderHomePage();
};

// --- دالة عرض المنتجات ---
function displayProducts(products, title = "تسوق أحدث المنتجات") {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;

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
        const appContent = document.getElementById('app-content');
        if (!appContent) return;
        appContent.innerHTML = `
            ${renderCategories()}
            <div id="products-container"></div>
            <div id="load-more-container" class="load-more-container"></div>
        `;
        document.querySelectorAll('.category-pill').forEach(pill => pill.classList.remove('active'));
        document.querySelector(`.category-pill[onclick="filterByCategory('${activeCategory}')"]`).classList.add('active');
        loadMoreProducts();
    }

    // --- دالة تحميل المزيد من المنتجات (مُعاد بناؤها) ---
    function loadMoreProducts() {
        const filteredProducts = activeCategory === 'all'
            ? window.allProducts
            : window.allProducts.filter(p => p.category === activeCategory);

        const batch = filteredProducts.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
        const productsContainer = document.getElementById('products-container');
        
        if (currentIndex === 0) {
            const title = `تسوق أحدث المنتجات في قسم "${CATEGORIES.find(c => c.id === activeCategory).name}"`;
            productsContainer.innerHTML = displayProducts(batch, title);
        } else if (batch.length > 0) {
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
        const slug = window.createSlug(product.title);

        if (salePrice < originalPrice) {
            discountPercentage = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
        }
        const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
        // تعديل الرابط ليشمل الاسم
        const productUrl = `${pathPrefix}product-details.html?id=${product.id}&slug=${slug}`;

        const primaryImage = product['image link'];
        const secondaryImage = product['additional image link'];

        return `
            <div class="product-card" data-id="${product.id}">
                <a href="${productUrl}" class="product-link">
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
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, 1, event)">
                    <i class="fas fa-cart-plus"></i> أضف للسلة
                </button>
            </div>
        `;
    }

    // --- 3. دوال البحث ---
    function handleSearch(query) {
        const appContent = document.getElementById('app-content');
        if (!appContent) return;

        if (!query) {
            // إذا كان البحث فارغًا، أعد عرض الفئة النشطة الحالية
            filterByCategory(activeCategory);
            return;
        }

        // فلترة المنتجات وعرض النتائج مباشرة
        const lowerCaseQuery = query.toLowerCase();
        const filteredProducts = window.allProducts.filter(product =>
            product.title.toLowerCase().includes(lowerCaseQuery) ||
            (product.description && product.description.toLowerCase().includes(lowerCaseQuery)) ||
            (product.brand && product.brand.toLowerCase().includes(lowerCaseQuery))
        );
        
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.innerHTML = displayProducts(filteredProducts, `نتائج البحث عن: "${query}"`);
        }
        
        // إخفاء زر تحميل المزيد عند البحث
        const loadMoreContainer = document.getElementById('load-more-container');
        if (loadMoreContainer) loadMoreContainer.innerHTML = '';

        // تحديث شريط الفئات لإظهار "الكل" كنشط
        document.querySelectorAll('.category-pill').forEach(pill => pill.classList.remove('active'));
        const allCatPill = document.querySelector(`.category-pill[onclick="filterByCategory('all')"]`);
        if(allCatPill) allCatPill.classList.add('active');
    }

    // --- 4. جعل دوال البحث متاحة عالمياً ---
    window.searchProducts = () => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) handleSearch(searchInput.value);
    };
    window.searchFromMobile = () => {
        const mobileSearchInput = document.getElementById('mobile-search-input');
        if (mobileSearchInput) handleSearch(mobileSearchInput.value);
    };
    window.handleEnter = (event, inputElement) => {
        if (event.key === 'Enter') {
            handleSearch(inputElement.value);
        }
    };
    window.handleMobileSearch = (event, inputElement) => {
        if (event.key === 'Enter') {
            handleSearch(inputElement.value);
            toggleMobileMenu(); // إغلاق القائمة بعد البحث
        }
    };

    // --- 7. زر تحميل المزيد ---
    function updateLoadMoreButton(totalFiltered) {
        const loadMoreContainer = document.getElementById('load-more-container');
        if (!loadMoreContainer) return;
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

        const matches = window.allProducts.filter(p => p.title.toLowerCase().includes(query)).slice(0, 5);
        
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

    // دالة لإنشاء Slug من النص العربي (متاحة عالمياً)
    window.createSlug = function(text) {
        if (!text) return '';
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // استبدال المسافات بـ -
            .replace(/[^\u0600-\u06FF\w-]+/g, '') // إزالة كل ما ليس حرف عربي أو رقم أو -
            .replace(/--+/g, '-')         // استبدال -- بـ -
            .replace(/^-+/, '')             // إزالة - من البداية
            .replace(/-+$/, '');            // إزالة - من النهاية
    }

document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const searchInput = document.getElementById('search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const loadingBar = document.getElementById('loading-bar');

    if (appContent) { // نحن في الصفحة الرئيسية
        if(loadingBar) loadingBar.style.display = 'block';
        
        loadApp().then(() => {
            if(loadingBar) loadingBar.style.display = 'none';
            renderHomePage();

            // ربط البحث بالمدخلات
            if (searchInput) {
                searchInput.addEventListener('input', () => handleSearch(searchInput.value));
            }
            if (mobileSearchInput) {
                mobileSearchInput.addEventListener('input', () => handleSearch(mobileSearchInput.value));
            }
        }).catch(() => {
            if(loadingBar) loadingBar.style.display = 'none';
        });
    }
});