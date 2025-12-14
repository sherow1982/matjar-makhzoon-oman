طلبك واضح تماماً. سأقوم بإضافة رابط "السياسات والشروط" في الشريط العلوي (الهيدر) والفوتر ليكون ثابتاً، وسأضيف نظام "نافذة منبثقة" (Modal) احترافي في صفحة المنتج يعرض سياسة الشحن والاسترجاع عند الضغط على زر مخصص، بدلاً من إرسال العميل لصفحة أخرى.

إليك الأكواد الثلاثة الكاملة (فقط قم بنسخها واستبدال الملفات الحالية).

1. ملف index.html الكامل
تمت إضافة:

رابط "السياسات والشروط" في الشريط العلوي.

كود "النافذة المنبثقة" (Modal) مخفي في أسفل الصفحة، سيتم تفعيله بالجافاسكربت.

HTML
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>متجر مخزون الإمارات | تسوق بذكاء</title>
    <meta name="description" content="أفضل متجر إلكتروني في الإمارات. دفع عند الاستلام، شحن سريع.">
    <!-- خط كايرو -->
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <!-- أيقونات FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- ملف الاستايل -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- الشريط العلوي -->
    <div class="top-bar">
        <div class="container flex-between">
            <div class="contact-info">
                <a href="pages/legal.html" class="top-link"><i class="fas fa-gavel"></i> السياسات والشروط</a>
                <span class="sep">|</span>
                <span><i class="fab fa-whatsapp"></i> خدمة العملاء 24/7</span>
            </div>
            <div class="shipping-note">
                <i class="fas fa-truck-moving"></i> شحن سريع لجميع مدن الإمارات
            </div>
        </div>
    </div>

    <!-- الهيدر الرئيسي -->
    <header class="main-header">
        <div class="container flex-between">
            <a href="index.html" class="logo">
                <span class="uae-red">مخزون</span> <span class="uae-green">الإمارات</span>
            </a>
            
            <div class="search-box">
                <input type="text" placeholder="ابحث عن منتج...">
                <button><i class="fas fa-search"></i></button>
            </div>

            <div class="header-icons">
                <div class="cart-icon" onclick="toggleCart()">
                    <i class="fas fa-shopping-bag"></i>
                    <span id="cart-count">0</span>
                    <span class="cart-text">السلة</span>
                </div>
            </div>
        </div>
    </header>

    <!-- منطقة المحتوى المتغيرة (SPA) -->
    <main id="app-content" class="container">
        <!-- يتم تعبئة المحتوى هنا بواسطة script.js -->
    </main>

    <!-- السلة الجانبية -->
    <div class="cart-sidebar" id="cart-sidebar">
        <div class="cart-header">
            <h3><i class="fas fa-shopping-cart"></i> سلة المشتريات</h3>
            <span class="close-cart" onclick="toggleCart()">&times;</span>
        </div>
        <div class="cart-items" id="cart-items"></div>
        <div class="cart-footer">
            <div class="total-row-cart">
                <span>المجموع:</span>
                <span id="cart-total" class="uae-green">0.00 درهم</span>
            </div>
            <button class="checkout-btn" onclick="checkoutPage()">
                <i class="fas fa-check-circle"></i> إتمام الطلب
            </button>
        </div>
    </div>
    <div class="overlay" id="overlay" onclick="toggleCart()"></div>

    <!-- نافذة سياسة الشحن والاسترجاع (Modal) -->
    <div id="policyModal" class="modal-window">
        <div class="modal-content">
            <span class="close-modal" onclick="closePolicyModal()">&times;</span>
            <div class="modal-header">
                <h3><i class="fas fa-shield-alt"></i> سياسة الشحن والضمان</h3>
            </div>
            <div class="modal-body">
                <div class="policy-item">
                    <h4><i class="fas fa-truck"></i> الشحن والتوصيل</h4>
                    <p>يتم التوصيل لجميع مناطق الإمارات خلال 1 إلى 3 أيام عمل. رسوم الشحن تحسب عند إتمام الطلب.</p>
                </div>
                <div class="policy-item">
                    <h4><i class="fas fa-undo"></i> سياسة الاسترجاع</h4>
                    <p>يحق للعميل استرجاع المنتج خلال 14 يوم من تاريخ الاستلام بشرط أن يكون بحالته الأصلية.</p>
                </div>
                <div class="policy-item alert-item">
                    <h4><i class="fas fa-exclamation-circle"></i> تنويه هام</h4>
                    <p>لا يتم استرجاع منتجات التجميل والعطور المفتوحة لأسباب صحية.</p>
                </div>
            </div>
            <a href="pages/legal.html" class="btn-full-policy">قراءة السياسة كاملة</a>
        </div>
    </div>

    <!-- الفوتر -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h4>مخزون الإمارات</h4>
                    <p>وجهتك الأولى للتسوق الإلكتروني في الإمارات. منتجات أصلية 100%.</p>
                </div>
                <div class="footer-col">
                    <h4>روابط هامة</h4>
                    <ul>
                        <li><a href="pages/legal.html">الشروط والأحكام</a></li>
                        <li><a href="pages/legal.html">سياسة الخصوصية</a></li>
                        <li><a href="pages/legal.html">سياسة الاسترجاع</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>تواصل معنا</h4>
                    <ul>
                        <li><i class="fab fa-whatsapp"></i> 201110760081+</li>
                        <li><i class="fas fa-envelope"></i> info@arabsad.com</li>
                    </ul>
                </div>
            </div>
            <div class="copyright">
                <p>جميع الحقوق محفوظة © 2025 متجر مخزون الإمارات</p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
2. ملف style.css الكامل
تمت إضافة تنسيقات الزر الجديد (زر السياسات) وتصميم النافذة المنبثقة (Modal) بشكل احترافي.

CSS
/* =========================================
   1. تعريف المتغيرات والأساسيات
   ========================================= */
:root {
    --uae-green: #00732f;
    --uae-red: #c00d0d;
    --uae-black: #000000;
    --uae-white: #ffffff;
    --font-main: 'Cairo', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; outline: none; }
body { font-family: var(--font-main); background-color: #fff; color: #333; line-height: 1.6; direction: rtl; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
ul { list-style: none; }
img { max-width: 100%; }

/* Utilities */
.container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.uae-red { color: var(--uae-red); }
.uae-green { color: var(--uae-green); }

/* =========================================
   2. الهيدر والشريط العلوي
   ========================================= */
.top-bar { background-color: var(--uae-green); color: #fff; padding: 10px 0; font-size: 13px; font-weight: 600; }
.top-link { color: #fff; display: inline-flex; align-items: center; gap: 5px; }
.top-link:hover { text-decoration: underline; }
.sep { margin: 0 10px; opacity: 0.5; }

.main-header { background: #fff; border-bottom: 1px solid #eee; padding: 15px 0; position: sticky; top: 0; z-index: 800; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
.logo { font-size: 26px; font-weight: 800; }
.search-box { display: flex; border: 2px solid #eee; border-radius: 50px; overflow: hidden; width: 50%; background: #f9f9f9; }
.search-box input { border: none; padding: 10px 20px; width: 100%; font-family: var(--font-main); background: transparent; }
.search-box button { background: var(--uae-black); color: #fff; border: none; padding: 0 25px; cursor: pointer; }

.header-icons .cart-icon { position: relative; cursor: pointer; font-size: 22px; display: flex; align-items: center; gap: 8px; }
.cart-icon span#cart-count { position: absolute; top: -8px; right: -8px; background: var(--uae-red); color: #fff; font-size: 11px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.cart-text { font-size: 14px; font-weight: bold; }

/* =========================================
   3. المنتجات والصفحة الرئيسية
   ========================================= */
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; margin: 40px 0; }
.product-card { background: #fff; border: 1px solid #eee; border-radius: 8px; overflow: hidden; transition: 0.3s; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }

.product-img-wrapper { height: 250px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.product-img-wrapper img { height: 100%; width: 100%; object-fit: contain; transition: 0.5s; }
.product-card:hover img { transform: scale(1.05); }

.product-info { padding: 15px; }
.product-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.btn-add { display: block; width: 100%; background: var(--uae-black); color: #fff; padding: 12px; border-radius: 5px; cursor: pointer; border: none; font-family: var(--font-main); font-weight: bold; margin-top: 10px; transition: 0.3s; }
.btn-add:hover { background: var(--uae-green); }

/* زر تحميل المزيد */
.load-more-container { text-align: center; margin: 40px 0; }
.btn-load-more { background: transparent; color: #000; border: 2px solid #000; padding: 10px 30px; border-radius: 50px; cursor: pointer; font-weight: bold; font-family: var(--font-main); transition: 0.3s; }
.btn-load-more:hover { background: #000; color: #fff; }

/* =========================================
   4. صفحة المنتج الفردي (Updated)
   ========================================= */
.breadcrumb { margin: 20px 0; font-size: 14px; color: #777; }
.single-product-container { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin: 30px 0; }
.single-img img { width: 100%; border-radius: 8px; border: 1px solid #eee; }
.single-details h1 { font-size: 28px; margin-bottom: 15px; }

.policy-btn-trigger {
    background: transparent;
    border: 2px dashed #ccc;
    color: #555;
    width: 100%;
    padding: 15px;
    margin-top: 20px;
    border-radius: 5px;
    cursor: pointer;
    font-family: var(--font-main);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: 0.3s;
}
.policy-btn-trigger:hover { border-color: var(--uae-green); color: var(--uae-green); background: #f9fff9; }

.buy-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.btn-whatsapp-large { background: #25D366; color: #fff; padding: 15px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 18px; font-family: var(--font-main); display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; }
.btn-whatsapp-large:hover { background: #1ebc57; }

/* =========================================
   5. تصميم النافذة المنبثقة (Modal Styles)
   ========================================= */
.modal-window { display: none; position: fixed; z-index: 2000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); backdrop-filter: blur(3px); }
.modal-content { background-color: #fff; margin: 10% auto; padding: 0; border-radius: 10px; width: 90%; max-width: 500px; box-shadow: 0 5px 30px rgba(0,0,0,0.3); animation: slideDown 0.4s; overflow: hidden; }
@keyframes slideDown { from {opacity: 0; transform: translateY(-50px);} to {opacity: 1; transform: translateY(0);} }

.modal-header { background: var(--uae-green); padding: 15px 20px; color: #fff; }
.modal-header h3 { margin: 0; font-size: 18px; }
.close-modal { color: #fff; float: left; font-size: 28px; font-weight: bold; cursor: pointer; line-height: 20px; }
.modal-body { padding: 25px; }
.policy-item { margin-bottom: 20px; }
.policy-item h4 { margin-bottom: 5px; color: var(--uae-black); font-size: 16px; }
.policy-item p { font-size: 14px; color: #666; margin: 0; }
.alert-item { background: #fff0f0; padding: 10px; border-radius: 5px; border-right: 3px solid var(--uae-red); }
.alert-item h4 { color: var(--uae-red); }
.btn-full-policy { display: block; text-align: center; background: #f9f9f9; padding: 15px; text-decoration: none; color: #333; font-weight: bold; border-top: 1px solid #eee; transition: 0.3s; }
.btn-full-policy:hover { background: #eee; }

/* =========================================
   6. السلة والفوتر
   ========================================= */
.cart-sidebar { position: fixed; top: 0; left: 0; width: 350px; height: 100%; background: #fff; z-index: 1000; transform: translateX(-100%); transition: 0.4s; box-shadow: 2px 0 15px rgba(0,0,0,0.1); }
.cart-sidebar.active { transform: translateX(0); }
.cart-header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 900; display: none; }
.overlay.active { display: block; }

footer { background: #1a1a1a; color: #fff; padding: 60px 0 20px; margin-top: 60px; border-top: 5px solid var(--uae-red); }
.footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px; }
.footer-col h4 { margin-bottom: 20px; font-size: 18px; color: #fff; }
.footer-col ul li { margin-bottom: 10px; }
.footer-col ul li a { color: #aaa; font-size: 14px; }
.footer-col ul li a:hover { color: var(--uae-green); }
.copyright { text-align: center; border-top: 1px solid #333; padding-top: 25px; font-size: 13px; color: #777; }

/* Responsive */
@media (max-width: 768px) {
    .single-product-container { grid-template-columns: 1fr; }
    .search-box { display: none; }
    .cart-sidebar { width: 85%; }
}
3. ملف script.js الكامل
تم إضافة دالة renderSingleProduct المحدثة التي تحتوي على الزر الجديد، ودوال التحكم في النافذة المنبثقة.

JavaScript
// =========================================
// 1. إعدادات المتجر
// =========================================
const WHATSAPP_NUMBER = "201110760081";
let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentIndex = 0;       
const BATCH_SIZE = 24;      

// =========================================
// 2. التحميل الأولي
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    if (document.getElementById('checkout-items')) {
        loadCheckoutItems(); 
    } else if (document.getElementById('app-content')) {
        fetchProducts();
    }
});

// =========================================
// 3. جلب البيانات والتوجيه
// =========================================
async function fetchProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        const urlParams = new URLSearchParams(window.location.search);
        const productSlug = urlParams.get('product');

        if (productSlug) {
            renderSingleProduct(productSlug);
        } else {
            renderHomePage();
        }
    } catch (error) {
        console.error("Error loading products:", error);
        const app = document.getElementById('app-content');
        if(app) app.innerHTML = '<p class="text-center" style="padding:50px">جاري تحميل المنتجات...</p>';
    }
}

// helpers
function getProductPrice(product) {
    return product['sale price'] ? product['sale price'] : product.price;
}

function renderPriceHTML(product) {
    const currentPrice = getProductPrice(product);
    if (product['sale price'] && product['sale price'] < product.price) {
        return `<div class="price-box"><span style="text-decoration: line-through; color: #999; font-size: 0.9em;">${product.price} AED</span> <span style="color: var(--uae-red); font-weight: bold; font-size: 1.1em; margin-right:5px">${currentPrice} AED</span></div>`;
    } else {
        return `<span style="color: var(--uae-green); font-weight: bold; font-size: 1.1em;">${currentPrice} AED</span>`;
    }
}

// =========================================
// 4. الصفحة الرئيسية
// =========================================
function renderHomePage() {
    const app = document.getElementById('app-content');
    if (!app) return;
    currentIndex = 0;

    app.innerHTML = `
        <div class="hero-banner" style="background: linear-gradient(135deg, var(--uae-green), #000); color: white; padding: 40px 20px; border-radius: 8px; margin-top: 20px; text-align: center; margin-bottom:40px;">
            <h1 style="margin-bottom:10px">عروض مخزون الإمارات</h1>
            <p>أفضل المنتجات - شحن سريع - دفع عند الاستلام</p>
        </div>
        <div class="products-grid" id="products-grid-container"></div>
        <div class="load-more-container">
            <button id="load-more-btn" class="btn-load-more" onclick="loadNextBatch()">عرض المزيد</button>
        </div>
    `;
    loadNextBatch();
}

function loadNextBatch() {
    const container = document.getElementById('products-grid-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const nextProducts = allProducts.slice(currentIndex, currentIndex + BATCH_SIZE);
    
    let htmlBatch = '';
    nextProducts.forEach(product => {
        const slug = encodeURIComponent(product.title.replace(/\s+/g, '-'));
        const imageSrc = product['image link'];
        let discountBadge = '';
        if (product['sale price'] && product['sale price'] < product.price) {
            const saved = Math.round(((product.price - product['sale price']) / product.price) * 100);
            discountBadge = `<span style="position:absolute; top:10px; right:10px; background:var(--uae-red); color:#fff; padding:3px 10px; border-radius:4px; font-size:12px; font-weight:bold; z-index:2">خصم ${saved}%</span>`;
        }

        htmlBatch += `
            <div class="product-card" style="animation: fadeIn 0.5s ease forwards;">
                ${discountBadge}
                <div class="product-img-wrapper">
                    <a href="?product=${slug}"><img src="${imageSrc}" alt="${product.title}" loading="lazy"></a>
                </div>
                <div class="product-info">
                    <a href="?product=${slug}" class="product-title">${product.title}</a>
                    ${renderPriceHTML(product)}
                    <button class="btn-add" onclick="addToCart(${product.id})"><i class="fas fa-shopping-bag"></i> أضف للسلة</button>
                </div>
            </div>
        `;
    });
    container.insertAdjacentHTML('beforeend', htmlBatch);
    currentIndex += BATCH_SIZE;
    if (currentIndex >= allProducts.length && loadMoreBtn) loadMoreBtn.style.display = 'none';
}

// =========================================
// 5. صفحة المنتج (مع زر السياسات الجديد)
// =========================================
function renderSingleProduct(slug) {
    const productName = decodeURIComponent(slug).replace(/-/g, ' ');
    const product = allProducts.find(p => p.title === productName) || allProducts.find(p => p.title.includes(productName));
    const app = document.getElementById('app-content');
    
    if (!app) return;
    if (!product) { app.innerHTML = '<h2>المنتج غير موجود</h2>'; return; }

    const currentPrice = getProductPrice(product);
    const imageSrc = product['image link'];
    const additionalImage = product['additional image link'];

    let galleryHTML = `<img id="main-img" src="${imageSrc}" alt="${product.title}">`;
    if (additionalImage) {
        galleryHTML += `<div style="display:flex; gap:10px; margin-top:10px;">
            <img src="${imageSrc}" style="width:70px; height:70px; object-fit:cover; border:1px solid #ddd; cursor:pointer; border-radius:4px" onclick="document.getElementById('main-img').src='${imageSrc}'">
            <img src="${additionalImage}" style="width:70px; height:70px; object-fit:cover; border:1px solid #ddd; cursor:pointer; border-radius:4px" onclick="document.getElementById('main-img').src='${additionalImage}'">
        </div>`;
    }

    app.innerHTML = `
        <div class="breadcrumb">
            <a href="index.html">الرئيسية</a> / <span>${product.title}</span>
        </div>
        <div class="single-product-container">
            <div class="single-img">${galleryHTML}</div>
            <div class="single-details">
                <h1>${product.title}</h1>
                <div style="margin-bottom:20px">${renderPriceHTML(product)}</div>
                
                <div style="margin-bottom: 25px; background:#f9f9f9; padding:15px; border-radius:5px; font-size:14px; color:#555;">
                    <p><strong>SKU:</strong> ${product.sku}</p>
                    <p><strong>الحالة:</strong> ${product.condition === 'new' ? 'جديد أصلي' : 'مستخدم'}</p>
                    <p><strong>التوفر:</strong> ${product.availability === 'in_stock' ? '<span style="color:green; font-weight:bold">متوفر</span>' : '<span style="color:red">غير متوفر</span>'}</p>
                </div>

                <div class="buy-actions">
                    <button class="btn-whatsapp-large" onclick="directOrder('${product.title}', ${currentPrice})">
                        <i class="fab fa-whatsapp"></i> اطلب الآن عبر واتساب
                    </button>
                    <button class="btn-add" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> إضافة للسلة
                    </button>
                </div>

                <!-- زر السياسة الاحترافي -->
                <button class="policy-btn-trigger" onclick="openPolicyModal()">
                    <i class="fas fa-shield-alt"></i> سياسة الشحن والضمان والاسترجاع
                </button>
            </div>
        </div>
    `;
}

// =========================================
// 6. التحكم في النافذة المنبثقة (Modal)
// =========================================
function openPolicyModal() {
    document.getElementById('policyModal').style.display = "block";
}
function closePolicyModal() {
    document.getElementById('policyModal').style.display = "none";
}
// إغلاق النافذة عند الضغط خارجها
window.onclick = function(event) {
    const modal = document.getElementById('policyModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// =========================================
// 7. وظائف السلة والدفع
// =========================================
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.qty++;
    else cart.push({ id: product.id, title: product.title, image: product['image link'], price: getProductPrice(product), qty: 1 });
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
    if(document.getElementById('checkout-items')) loadCheckoutItems();
}
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if(cartCount) cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    
    if(cartItemsContainer && cartTotal) {
        cartItemsContainer.innerHTML = '';
        let totalAmount = 0;
        cart.forEach(item => {
            totalAmount += item.price * item.qty;
            cartItemsContainer.innerHTML += `
                <div class="cart-item" style="display:flex; gap:10px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px">
                    <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:4px">
                    <div style="flex:1">
                        <h5 style="font-size:13px; margin-bottom:5px">${item.title}</h5>
                        <div style="display:flex; justify-content:space-between">
                            <span style="color:var(--uae-green); font-weight:bold">${item.price} x ${item.qty}</span>
                            <span style="color:#c00; cursor:pointer" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></span>
                        </div>
                    </div>
                </div>`;
        });
        cartTotal.innerText = totalAmount.toFixed(2) + ' درهم';
    }
}
function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    if(!sidebar) return;
    if (forceOpen) { sidebar.classList.add('active'); overlay.classList.add('active'); }
    else { sidebar.classList.toggle('active'); overlay.classList.toggle('active'); }
}
function checkoutPage() {
    if (cart.length === 0) { alert("السلة فارغة!"); return; }
    window.location.href = 'pages/checkout.html';
}
function loadCheckoutItems() {
    const container = document.getElementById('checkout-items');
    if (!container) return; 
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(cart.length === 0) { window.location.href = '../index.html'; return; }
    container.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        container.innerHTML += `<div class="summary-item"><h4>${item.title}</h4><span>${item.qty} x ${item.price}</span></div>`;
    });
    document.getElementById('sub-total').innerText = total + ' درهم';
    document.getElementById('final-total').innerText = total + ' درهم';
}
function directOrder(title, price) {
    let msg = `*استفسار عن منتج*%0a🛍️ ${title}%0a💰 ${price} درهم%0aهل متوفر؟`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}
