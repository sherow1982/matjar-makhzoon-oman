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
});