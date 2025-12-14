// إعدادات المتجر
const WHATSAPP_NUMBER = "201110760081";
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartUI();
});

// جلب المنتجات
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        
        // التحقق من الرابط الحالي (Routing Logic)
        const urlParams = new URLSearchParams(window.location.search);
        const productSlug = urlParams.get('product');

        if (productSlug) {
            renderSingleProduct(productSlug);
        } else {
            renderHomePage();
        }
    } catch (error) {
        console.error("Error loading products:", error);
        document.getElementById('app-content').innerHTML = '<p class="text-center">جار تحميل المنتجات...</p>';
    }
}

// دالة مساعدة لتحديد السعر الفعلي (البيع أو الأصلي)
function getProductPrice(product) {
    // إذا كان هناك سعر تخفيض (Sale Price) نستخدمه، وإلا نستخدم السعر العادي
    return product['sale price'] ? product['sale price'] : product.price;
}

// دالة مساعدة لعرض السعر بشكل جميل (مع الشطب إذا وجد خصم)
function renderPriceHTML(product) {
    const currentPrice = getProductPrice(product);
    
    if (product['sale price'] && product['sale price'] < product.price) {
        return `
            <div class="price-box">
                <span class="old-price" style="text-decoration: line-through; color: #999; font-size: 0.9em;">${product.price} درهم</span>
                <span class="current-price" style="color: var(--uae-red); font-weight: bold; font-size: 1.1em;">${currentPrice} درهم</span>
            </div>
        `;
    } else {
        return `<span class="current-price" style="color: var(--uae-green); font-weight: bold;">${currentPrice} درهم</span>`;
    }
}

// 1. عرض الصفحة الرئيسية
function renderHomePage() {
    const app = document.getElementById('app-content');
    
    let html = `
        <div class="hero-banner" style="background: linear-gradient(45deg, var(--uae-green), #000); color: white; padding: 40px; border-radius: 10px; margin-top: 20px; text-align: center;">
            <h1 style="margin-bottom:10px">عروض متجر مخزون الإمارات</h1>
            <p>خصومات حصرية - الدفع عند الاستلام - شحن سريع</p>
        </div>
        <div class="products-grid">
    `;

    allProducts.forEach(product => {
        // نستخدم title بدلاً من name
        const slug = encodeURIComponent(product.title.replace(/\s+/g, '-'));
        // نستخدم ['image link'] لأن الاسم يحتوي مسافة
        const imageSrc = product['image link']; 
        
        // حساب نسبة الخصم للعرض (اختياري)
        let discountBadge = '';
        if (product['sale price'] && product['sale price'] < product.price) {
            const saved = Math.round(((product.price - product['sale price']) / product.price) * 100);
            discountBadge = `<span style="position:absolute; top:10px; right:10px; background:var(--uae-red); color:#fff; padding:2px 8px; border-radius:3px; font-size:12px;">خصم ${saved}%</span>`;
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
                        <i class="fas fa-cart-plus"></i> أضف للسلة
                    </button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    app.innerHTML = html;
}

// 2. عرض صفحة المنتج الفردي
function renderSingleProduct(slug) {
    const productName = decodeURIComponent(slug).replace(/-/g, ' ');
    // البحث بالعنوان title
    const product = allProducts.find(p => p.title === productName) || allProducts.find(p => p.title.includes(productName));

    const app = document.getElementById('app-content');

    if (!product) {
        app.innerHTML = '<h2>المنتج غير موجود</h2><a href="index.html">العودة للرئيسية</a>';
        return;
    }

    const currentPrice = getProductPrice(product);
    const imageSrc = product['image link'];
    const additionalImage = product['additional image link'];

    // منطق لعرض صورة إضافية إذا وجدت
    let galleryHTML = `<img id="main-img" src="${imageSrc}" alt="${product.title}">`;
    if (additionalImage) {
        galleryHTML += `
            <div style="display:flex; gap:10px; margin-top:10px;">
                <img src="${imageSrc}" style="width:60px; height:60px; object-fit:cover; border:1px solid #ddd; cursor:pointer;" onclick="document.getElementById('main-img').src='${imageSrc}'">
                <img src="${additionalImage}" style="width:60px; height:60px; object-fit:cover; border:1px solid #ddd; cursor:pointer;" onclick="document.getElementById('main-img').src='${additionalImage}'">
            </div>
        `;
    }

    app.innerHTML = `
        <div class="breadcrumb" style="margin: 20px 0; font-size: 14px; color: #777;">
            <a href="index.html">الرئيسية</a> / <span style="color:var(--uae-black)">${product.title}</span>
        </div>
        <div class="single-product-container">
            <div class="single-img">
                ${galleryHTML}
            </div>
            <div class="single-details">
                <h1>${product.title}</h1>
                <div style="margin-bottom:15px">
                   ${renderPriceHTML(product)}
                </div>
                
                <div style="margin-bottom: 20px; color: #555; font-size: 14px;">
                    <p><strong>كود المنتج (SKU):</strong> ${product.sku}</p>
                    <p><strong>الحالة:</strong> ${product.condition === 'new' ? 'جديد أصلي' : 'مستخدم'}</p>
                    <p><strong>التوفر:</strong> ${product.availability === 'in_stock' ? '<span style="color:green">متوفر في المخزون</span>' : '<span style="color:red">نفذت الكمية</span>'}</p>
                </div>

                <div class="policy-box">
                    <strong><i class="fas fa-shield-alt"></i> ضمان مخزون الإمارات:</strong>
                    <ul style="margin-top:5px; font-size:13px; list-style:inside;">
                        <li>الدفع عند الاستلام متاح.</li>
                        <li>شحن سريع 1-3 أيام عمل.</li>
                        <li>استرجاع 14 يوم (لا يشمل منتجات التجميل).</li>
                    </ul>
                </div>

                <div class="buy-actions">
                    <button class="btn-whatsapp-large" onclick="directOrder('${product.title}', ${currentPrice})">
                        <i class="fab fa-whatsapp"></i> اطلب الآن عبر واتساب
                    </button>
                    <button class="btn-add" style="width: auto; padding: 0 30px;" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> إضافة للسلة
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 3. وظائف السلة
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty++;
    } else {
        // نخزن السعر الحالي (بعد الخصم) في السلة
        const finalPrice = getProductPrice(product);
        cart.push({ 
            id: product.id,
            title: product.title,
            image: product['image link'], // تخزين الصورة للعرض في السلة
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
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalQty;

    cartItemsContainer.innerHTML = '';
    let totalAmount = 0;

    cart.forEach(item => {
        totalAmount += item.price * item.qty;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div style="flex: 1;">
                    <h5 style="margin-bottom: 5px; font-size:14px">${item.title}</h5>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--uae-green); font-weight: bold; font-size:13px">${item.price} x ${item.qty}</span>
                        <span style="color: #c00; cursor: pointer;" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></span>
                    </div>
                </div>
            </div>
        `;
    });

    cartTotal.innerText = totalAmount.toFixed(2) + ' درهم';
}

function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    
    if (forceOpen) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    } else {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// 4. إتمام الطلب عبر واتساب
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }

    let message = `*طلب جديد من موقع مخزون الإمارات*%0a`;
    message += `---------------------------%0a`;
    let total = 0;

    cart.forEach(item => {
        let subtotal = item.price * item.qty;
        message += `📦 *${item.title}*%0a`;
        message += `   العدد: ${item.qty} | السعر: ${subtotal} درهم%0a`;
        total += subtotal;
    });

    message += `---------------------------%0a`;
    message += `💰 *الإجمالي النهائي: ${total} درهم*%0a`;
    message += `%0a📍 *يرجى إرسال الموقع (Location) لتأكيد الشحن.*`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

// طلب مباشر
function directOrder(title, price) {
    let message = `*استفسار/طلب عن منتج*%0a`;
    message += `---------------------------%0a`;
    message += `🛍️ المنتج: ${title}%0a`;
    message += `💵 السعر: ${price} درهم%0a`;
    message += `---------------------------%0a`;
    message += `هل المنتج متوفر؟ وأرغب في الطلب.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}
