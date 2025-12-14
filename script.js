// =========================================
// إعدادات المتجر العامة
// =========================================
const WHATSAPP_NUMBER = "201110760081";
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =========================================
// عند تحميل الصفحة
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. تحديث أيقونة السلة فوراً
    updateCartUI();

    // 2. التحقق: هل نحن في صفحة التشيك أوت؟ (لمنع تشغيل كود المنتجات هناك)
    if (document.getElementById('checkout-items')) {
        // نحن في صفحة checkout.html
        loadCheckoutItems(); 
    } 
    // 3. هل نحن في الصفحة الرئيسية أو صفحة المنتج؟
    else if (document.getElementById('app-content')) {
        fetchProducts();
    }
});

// =========================================
// جلب وعرض المنتجات
// =========================================
async function fetchProducts() {
    try {
        // جلب البيانات من ملف JSON
        const response = await fetch('products.json');
        allProducts = await response.json();
        
        // التحقق من الرابط: هل هو صفحة منتج أم رئيسية؟
        const urlParams = new URLSearchParams(window.location.search);
        const productSlug = urlParams.get('product');

        if (productSlug) {
            renderSingleProduct(productSlug);
        } else {
            renderHomePage();
        }
    } catch (error) {
        console.error("Error loading products:", error);
        // محاولة إيجاد العنصر قبل الكتابة فيه لتجنب الأخطاء في الصفحات الفرعية
        const app = document.getElementById('app-content');
        if(app) app.innerHTML = '<p class="text-center" style="padding:50px">جاري تحميل المنتجات...</p>';
    }
}

// دالة مساعدة: تحديد السعر (عادي أو مخفض)
function getProductPrice(product) {
    return product['sale price'] ? product['sale price'] : product.price;
}

// دالة مساعدة: تصميم HTML للسعر
function renderPriceHTML(product) {
    const currentPrice = getProductPrice(product);
    if (product['sale price'] && product['sale price'] < product.price) {
        return `
            <div class="price-box">
                <span style="text-decoration: line-through; color: #999; font-size: 0.9em;">${product.price} AED</span>
                <span style="color: var(--uae-red); font-weight: bold; font-size: 1.1em; margin-right:5px">${currentPrice} AED</span>
            </div>
        `;
    } else {
        return `<span style="color: var(--uae-green); font-weight: bold; font-size: 1.1em;">${currentPrice} AED</span>`;
    }
}

// عرض الصفحة الرئيسية (Grid)
function renderHomePage() {
    const app = document.getElementById('app-content');
    if (!app) return;

    let html = `
        <div class="hero-banner" style="background: linear-gradient(135deg, var(--uae-green), #000); color: white; padding: 40px 20px; border-radius: 8px; margin-top: 20px; text-align: center; margin-bottom:40px;">
            <h1 style="margin-bottom:10px">عروض مخزون الإمارات</h1>
            <p>أفضل المنتجات - شحن سريع - دفع عند الاستلام</p>
        </div>
        <div class="products-grid">
    `;

    allProducts.forEach(product => {
        const slug = encodeURIComponent(product.title.replace(/\s+/g, '-'));
        const imageSrc = product['image link'];
        
        // حساب نسبة الخصم
        let discountBadge = '';
        if (product['sale price'] && product['sale price'] < product.price) {
            const saved = Math.round(((product.price - product['sale price']) / product.price) * 100);
            discountBadge = `<span style="position:absolute; top:10px; right:10px; background:var(--uae-red); color:#fff; padding:3px 10px; border-radius:4px; font-size:12px; font-weight:bold; z-index:2">خصم ${saved}%</span>`;
        }

        html += `
            <div class="product-card">
                ${discountBadge}
                <div class="product-img-wrapper">
                    <a href="?product=${slug}">
                        <img src="${imageSrc}" alt="${product.title}" loading="lazy">
                    </a>
                </div>
                <div class="product-info">
                    <a href="?product=${slug}" class="product-title">${product.title}</a>
                    ${renderPriceHTML(product)}
                    <button class="btn-add" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-bag"></i> أضف للسلة
                    </button>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    app.innerHTML = html;
}

// عرض صفحة المنتج الفردي
function renderSingleProduct(slug) {
    const productName = decodeURIComponent(slug).replace(/-/g, ' ');
    const product = allProducts.find(p => p.title === productName) || allProducts.find(p => p.title.includes(productName));
    const app = document.getElementById('app-content');
    
    if (!app) return;
    if (!product) {
        app.innerHTML = '<div class="text-center" style="padding:50px"><h2>المنتج غير موجود</h2><a href="index.html" class="btn-add" style="width:200px; margin:20px auto">العودة للرئيسية</a></div>';
        return;
    }

    const currentPrice = getProductPrice(product);
    const imageSrc = product['image link'];
    const additionalImage = product['additional image link'];

    // صور المنتج (معرض مصغر)
    let galleryHTML = `<img id="main-img" src="${imageSrc}" alt="${product.title}">`;
    if (additionalImage) {
        galleryHTML += `
            <div style="display:flex; gap:10px; margin-top:10px;">
                <img src="${imageSrc}" style="width:70px; height:70px; object-fit:cover; border:1px solid #ddd; cursor:pointer; border-radius:4px" onclick="document.getElementById('main-img').src='${imageSrc}'">
                <img src="${additionalImage}" style="width:70px; height:70px; object-fit:cover; border:1px solid #ddd; cursor:pointer; border-radius:4px" onclick="document.getElementById('main-img').src='${additionalImage}'">
            </div>
        `;
    }

    app.innerHTML = `
        <div class="breadcrumb">
            <a href="index.html">الرئيسية</a> / <span style="color:var(--uae-black)">${product.title}</span>
        </div>
        <div class="single-product-container">
            <div class="single-img">
                ${galleryHTML}
            </div>
            <div class="single-details">
                <h1>${product.title}</h1>
                <div style="margin-bottom:20px">${renderPriceHTML(product)}</div>
                
                <div style="margin-bottom: 25px; color: #666; font-size: 14px; background:#f9f9f9; padding:15px; border-radius:5px">
                    <p style="margin-bottom:5px"><strong>SKU:</strong> ${product.sku}</p>
                    <p style="margin-bottom:5px"><strong>الحالة:</strong> ${product.condition === 'new' ? 'جديد أصلي' : 'مستخدم'}</p>
                    <p><strong>التوفر:</strong> ${product.availability === 'in_stock' ? '<span style="color:green; font-weight:bold">متوفر (تسليم فوري)</span>' : '<span style="color:red">نفذت الكمية</span>'}</p>
                </div>

                <div class="buy-actions">
                    <button class="btn-whatsapp-large" onclick="directOrder('${product.title}', ${currentPrice})">
                        <i class="fab fa-whatsapp"></i> اطلب الآن عبر واتساب
                    </button>
                    <button class="btn-add" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> إضافة للسلة ومتابعة التسوق
                    </button>
                </div>

                <div class="policy-box">
                    <strong><i class="fas fa-shield-alt"></i> ضمان مخزون الإمارات:</strong>
                    <ul style="margin-top:10px; font-size:13px;">
                        <li>الدفع نقداً عند الاستلام.</li>
                        <li>شحن لجميع الإمارات خلال 1-3 أيام.</li>
                        <li>ضمان استرجاع 14 يوم (تطبق الشروط).</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// =========================================
// منطق السلة (Cart Logic)
// =========================================
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty++;
    } else {
        const finalPrice = getProductPrice(product);
        cart.push({ 
            id: product.id,
            title: product.title,
            image: product['image link'], 
            price: finalPrice,
            qty: 1 
        });
    }
    saveCart();
    toggleCart(true);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    // إذا كنا في صفحة التشيك أوت، حدث القائمة هناك أيضاً
    if(document.getElementById('checkout-items')) loadCheckoutItems();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if(cartCount) {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.innerText = totalQty;
    }

    if(cartItemsContainer && cartTotal) {
        cartItemsContainer.innerHTML = '';
        let totalAmount = 0;

        cart.forEach(item => {
            totalAmount += item.price * item.qty;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div style="flex: 1;">
                        <h5 style="margin-bottom: 5px; font-size:13px">${item.title}</h5>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: var(--uae-green); font-weight: bold; font-size:13px">${item.price} x ${item.qty}</span>
                            <span style="color: #c00; cursor: pointer; font-size:14px" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></span>
                        </div>
                    </div>
                </div>
            `;
        });
        cartTotal.innerText = totalAmount.toFixed(2) + ' درهم';
    }
}

function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    if(!sidebar || !overlay) return;

    if (forceOpen) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    } else {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// =========================================
// الانتقال لصفحة الدفع
// =========================================
function checkoutPage() {
    if (cart.length === 0) {
        alert("السلة فارغة! قم بإضافة منتجات أولاً.");
        return;
    }
    // التوجيه إلى المجلد الجديد pages
    window.location.href = 'pages/checkout.html';
}

// دالة الطلب المباشر للمنتج الفردي
function directOrder(title, price) {
    let message = `*استفسار عن منتج (مخزون الإمارات)*%0a`;
    message += `---------------------------%0a`;
    message += `🛍️ *المنتج:* ${title}%0a`;
    message += `💰 *السعر:* ${price} درهم%0a`;
    message += `---------------------------%0a`;
    message += `هل المنتج متوفر؟ أرغب في طلبه للشحن.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}
