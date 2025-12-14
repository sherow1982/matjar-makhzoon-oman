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
    
    // تحديد المسار الصحيح لملف المنتجات بناءً على مكان الصفحة
    // إذا كنا داخل مجلد pages، نعود للخلف خطوة، وإلا نقرأ مباشرة
    const isInsidePages = window.location.pathname.includes('/pages/');
    const jsonPath = isInsidePages ? '../products.json' : 'products.json';

    // تشغيل المنطق المناسب للصفحة
    if (document.getElementById('checkout-items')) {
        loadCheckoutItems(); 
    } else if (document.getElementById('app-content')) {
        fetchProducts(jsonPath);
    }
});

// =========================================
// 3. جلب البيانات والتوجيه
// =========================================
async function fetchProducts(path) {
    try {
        const response = await fetch(path);
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
        // لا نعرض رسالة خطأ في الصفحات القانونية لأنها لا تحتاج المنتجات
        const app = document.getElementById('app-content');
        if(app && !window.location.pathname.includes('legal')) {
             app.innerHTML = '<p class="text-center" style="padding:50px">جاري تحميل المنتجات...</p>';
        }
    }
}

// دوال مساعدة
function getProductPrice(product) {
    return product['sale price'] ? product['sale price'] : product.price;
}

function renderPriceHTML(product) {
    const currentPrice = getProductPrice(product);
    if (product['sale price'] && product['sale price'] < product.price) {
        return `<div class="price-box">
                    <span style="text-decoration: line-through; color: #999; font-size: 0.9em;">${product.price} AED</span> 
                    <span style="color: var(--uae-red); font-weight: bold; font-size: 1.1em; margin-right:5px">${currentPrice} AED</span>
                </div>`;
    } else {
        return `<span style="color: var(--uae-green); font-weight: bold; font-size: 1.1em;">${currentPrice} AED</span>`;
    }
}

// === دالة توليد الوصف الاحترافي ===
function getProductDescription(product) {
    // 1. إذا كان الوصف موجوداً في الجيسون وليس فارغاً، استخدمه
    if (product.description && product.description.trim().length > 0) {
        return product.description;
    }

    // 2. إذا لم يوجد، قم بتوليد وصف احترافي بناءً على الاسم
    return `
        <p>نقدم لك <strong>${product.title}</strong>، الخيار الأمثل لمن يبحث عن التميز والجودة العالية.</p>
        <p>تم اختيار هذا المنتج بعناية في <strong>مخزون الإمارات</strong> ليوفر لك تجربة استخدام عملية ومريحة. يتميز بخامات عالية الجودة وتصميم عصري يلبي كافة احتياجاتك اليومية.</p>
        <p>احصل عليه الآن بسعر منافس واستفد من خدمة الشحن السريع والدفع عند الاستلام.</p>
    `;
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
        <div class="load-more-container" style="text-align: center; margin: 40px 0;">
            <button id="load-more-btn" class="btn-load-more" onclick="loadNextBatch()">عرض المزيد من المنتجات</button>
        </div>
    `;
    loadNextBatch();
}

function loadNextBatch() {
    const container = document.getElementById('products-grid-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    if(!container) return;

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
            <div class="product-card fade-in">
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

    if (currentIndex >= allProducts.length && loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

// =========================================
// 5. صفحة المنتج الفردي
// =========================================
function renderSingleProduct(slug) {
    const productName = decodeURIComponent(slug).replace(/-/g, ' ');
    const product = allProducts.find(p => p.title === productName) || allProducts.find(p => p.title.includes(productName));
    const app = document.getElementById('app-content');
    
    if (!app) return;
    if (!product) { app.innerHTML = '<div class="text-center" style="padding:50px"><h2>المنتج غير موجود</h2><a href="index.html" class="btn-add" style="width:200px; margin:20px auto">العودة للرئيسية</a></div>'; return; }

    const currentPrice = getProductPrice(product);
    const imageSrc = product['image link'];
    const additionalImage = product['additional image link'];
    // استدعاء دالة الوصف الجديدة
    const descriptionHTML = getProductDescription(product);

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
                
                <!-- قسم الوصف -->
                <div class="product-description" style="margin-bottom:25px; color:#555; line-height:1.8; font-size:15px;">
                    ${descriptionHTML}
                </div>

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

                <button class="policy-btn-trigger" onclick="openPolicyModal()">
                    <i class="fas fa-shield-alt"></i> سياسة الشحن والضمان والاسترجاع
                </button>
            </div>
        </div>
    `;
}

// =========================================
// 6. التحكم في النافذة المنبثقة
// =========================================
function openPolicyModal() {
    const modal = document.getElementById('policyModal');
    if(modal) modal.style.display = "block";
}
function closePolicyModal() {
    const modal = document.getElementById('policyModal');
    if(modal) modal.style.display = "none";
}
window.onclick = function(event) {
    const modal = document.getElementById('policyModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// =========================================
// 7. السلة والدفع
// =========================================
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.qty++;
    else {
        cart.push({ id: product.id, title: product.title, image: product['image link'], price: getProductPrice(product), qty: 1 });
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
    if(document.getElementById('checkout-items')) loadCheckoutItems();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if(cartCount) {
        cartCount.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    }
    
    if(cartItemsContainer && cartTotal) {
        cartItemsContainer.innerHTML = '';
        let totalAmount = 0;
        cart.forEach(item => {
            totalAmount += item.price * item.qty;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
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
    // التعامل مع المسارات سواء كنا في الرئيسية أو في صفحة فرعية
    if (window.location.pathname.includes('/pages/')) {
        window.location.href = 'checkout.html';
    } else {
        window.location.href = 'pages/checkout.html';
    }
}

function loadCheckoutItems() {
    const container = document.getElementById('checkout-items');
    if (!container) return; 
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // العودة للرئيسية إذا السلة فارغة
    if(cart.length === 0) { 
        if(window.location.pathname.includes('/pages/')) window.location.href = '../index.html';
        else window.location.href = 'index.html';
        return; 
    }
    
    container.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        container.innerHTML += `<div class="summary-item"><div><img src="${item.image}" alt="${item.title}"></div><div><h4>${item.title}</h4><span>${item.qty} x ${item.price}</span></div><div style="margin-right:auto">${item.qty * item.price}</div></div>`;
    });
    
    const sub = document.getElementById('sub-total');
    const final = document.getElementById('final-total');
    if(sub) sub.innerText = total + ' درهم';
    if(final) final.innerText = total + ' درهم';
}

function directOrder(title, price) {
    let msg = `*استفسار عن منتج*%0a🛍️ ${title}%0a💰 ${price} درهم%0aهل متوفر؟`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
}
