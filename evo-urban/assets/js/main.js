// =======================================================
// EVO E-TİCARET SİTESİ - ANA JAVASCRIPT DOSYASI
// (BASİTLEŞTİRİLMİŞ VE STABİL SÜRÜM)
// =======================================================


// BÖLÜM 1: ÜRÜN VERİTABANI VE YÖNETİCİ TANIMLAMA
// -------------------------------------------------------

// Ürünler için varsayılan başlangıç verisi (Stok ve Kategori olmadan)
const defaultProducts = [
    {
        id: 1,
        name: "V-CODE HOODIE",
        price: 999,
        description: "Ağır gramajlı, %100 pamuk kumaştan üretilmiş oversize hoodie. Minimalist tasarımı ve konforlu kesimi ile sokak stilinin vazgeçilmezi.",
        mainImage: "assets/images/product-hoodie-black.jpg",
        thumbnails: [
            "assets/images/product-hoodie-black.jpg",
            "assets/images/product-hoodie-detail.jpg",
            "assets/images/product-hoodie-back.jpg"
        ]
    },
    {
        id: 2,
        name: "MONO TEE",
        price: 499,
        description: "Nefes alan, premium pamuklu kumaştan üretilmiş basic t-shirt. Hem rahat hem de şık kombinler için ideal.",
        mainImage: "assets/images/product-tshirt-white.jpg",
        thumbnails: [
            "assets/images/product-tshirt-white.jpg",
            "assets/images/product-tshirt-detail.jpg"
        ]
    },
];

// Sayfa yüklendiğinde, ürünleri localStorage'dan al. Eğer yoksa, varsayılanı kullan ve kaydet.
let products = JSON.parse(localStorage.getItem('evoProducts'));
if (!products || products.length === 0) {
    products = defaultProducts;
    localStorage.setItem('evoProducts', JSON.stringify(products));
}

const ADMIN_USERS = ['admin@evo.com'];


// BÖLÜM 2: ANA ÇALIŞTIRICI FONKSİYON
// -------------------------------------------------------

// Sayfa yüklendiğinde, ilgili fonksiyonları çağırır.
// Bu ana fonksiyon, loader.js tarafından çağrılır.
function initializeMainScripts() {
    
    // HER SAYFADA ÇALIŞMASI GEREKENLER
    initializeSideMenu();
    initializeHeaderScroll();
    initializeClickOutsideToClose();
    updateHeaderForUser();
    updateCartCounter();
    
    // SADECE İLGİLİ SAYFALARDA ÇALIŞACAK OLANLAR
    renderHomepageProducts();
    initializeProductPage();
    initializeCartPage();
    initializeRegisterPage();
    initializeLoginPage();
    initializeCheckoutPage();
    initializeOrdersPage();
    initializeAdminPage();
}


// BÖLÜM 3: YARDIMCI VE BAŞLATICI FONKSİYONLAR
// -------------------------------------------------------

function initializeSideMenu() {
    const menuOpenBtn = document.getElementById('menu-open-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const fullScreenMenu = document.getElementById('full-screen-menu');
    if (!menuOpenBtn || !fullScreenMenu) return;

    const openMenu = () => { fullScreenMenu.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
    const closeMenu = () => { fullScreenMenu.classList.remove('is-open'); document.body.style.overflow = 'auto'; };
    
    const desktopMediaQuery = window.matchMedia('(min-width: 992px)');
    const setupMenuInteraction = (mediaQuery) => {
        menuOpenBtn.removeEventListener('click', openMenu);
        menuOpenBtn.removeEventListener('mouseenter', openMenu);
        fullScreenMenu.removeEventListener('mouseleave', closeMenu);
        if (mediaQuery.matches) {
            menuOpenBtn.addEventListener('mouseenter', openMenu);
            fullScreenMenu.addEventListener('mouseleave', closeMenu);
        } else {
            menuOpenBtn.addEventListener('click', openMenu);
        }
    };

    if (menuCloseBtn) { menuCloseBtn.addEventListener('click', closeMenu); }
    setupMenuInteraction(desktopMediaQuery);
    desktopMediaQuery.addEventListener('change', () => setupMenuInteraction(desktopMediaQuery));
}

function initializeHeaderScroll() {
    const logoElement = document.querySelector('.logo-center');
    if (logoElement) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (scrollTop > 50) {
                logoElement.style.opacity = Math.max(0, 1 - (scrollTop - 50) / 150);
            } else {
                logoElement.style.opacity = 1;
            }
        });
    }
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('evoCart')) || [];
    const counter = document.getElementById('cart-item-count');
    if (!counter) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    counter.textContent = totalItems;
    if (totalItems > 0) {
        counter.classList.add('visible');
    } else {
        counter.classList.remove('visible');
    }
}

function updateHeaderForUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userLink = document.getElementById('user-link');
    const dropdownMenu = document.getElementById('profile-dropdown-menu');
    if (!userLink || !dropdownMenu) return;

    if (loggedInUser) {
        userLink.href = '#';
        const userRole = localStorage.getItem('userRole');
        const profileLink = dropdownMenu.querySelector('a[href="account.html"]');
        if (userRole === 'admin' && profileLink) {
            profileLink.textContent = "Yönetim Paneli";
            profileLink.href = "admin.html";
        }
        userLink.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle('active');
        });
        const logoutBtn = dropdownMenu.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('userRole');
                window.location.href = 'index.html';
            });
        }
    } else {
        dropdownMenu.remove();
        userLink.href = 'login.html';
    }
}

function initializeClickOutsideToClose() {
    window.addEventListener('click', function(e) {
        const dropdownMenu = document.getElementById('profile-dropdown-menu');
        const userLink = document.getElementById('user-link');
        if (dropdownMenu && userLink && !userLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    });
}

function initializeRegisterPage() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorEl = document.getElementById('register-error');
        let users = JSON.parse(localStorage.getItem('evoUsers')) || [];
        if (users.find(user => user.email === email)) {
            errorEl.textContent = 'Bu e-posta adresi zaten kayıtlı.';
            return;
        }
        users.push({ name, email, password });
        localStorage.setItem('evoUsers', JSON.stringify(users));
        localStorage.setItem('loggedInUser', email);
        if (ADMIN_USERS.includes(email)) {
            localStorage.setItem('userRole', 'admin');
        }
        window.location.href = 'index.html';
    });
}

function initializeLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');
        let users = JSON.parse(localStorage.getItem('evoUsers')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('loggedInUser', user.email);
            if (ADMIN_USERS.includes(user.email)) {
                localStorage.setItem('userRole', 'admin');
            }
            window.location.href = 'index.html';
        } else {
            errorEl.textContent = 'E-posta veya şifre hatalı.';
        }
    });
}

function initializeCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return;
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if ((JSON.parse(localStorage.getItem('evoCart')) || []).length === 0) {
                alert('Ödeme yapmak için sepetinizde ürün olmalıdır.');
                return;
            }
            if (localStorage.getItem('loggedInUser')) {
                window.location.href = 'checkout.html';
            } else {
                alert('Ödeme yapmak için lütfen giriş yapın.');
                window.location.href = 'login.html';
            }
        });
    }
    const cart = JSON.parse(localStorage.getItem('evoCart')) || [];
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Sepetinizde henüz ürün bulunmuyor.</p>';
        updateOrderSummary(0);
        return;
    }
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    cart.forEach((item, index) => {
        const productData = products.find(p => p.id === item.id);
        if (!productData) return;
        subtotal += productData.price * item.quantity;
        cartItemsContainer.innerHTML += `<div class="cart-item"><div class="cart-item-image"><img src="${item.image}" alt="${item.name}"></div><div class="cart-item-details"><h3>${item.name}</h3><p>Beden: ${item.size}</p><p>Adet: ${item.quantity}</p><p>Fiyat: ${productData.price.toFixed(2)} TL</p><button class="remove-item-btn" data-index="${index}">Kaldır</button></div></div>`;
    });
    updateOrderSummary(subtotal);
    addRemoveFunctionality();
}

function initializeCheckoutPage() {
    const checkoutPage = document.querySelector('.checkout-page');
    if (!checkoutPage) return;
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('Ödeme sayfasına devam etmek için lütfen giriş yapın.');
        window.location.href = 'login.html';
        return;
    }
    const cart = JSON.parse(localStorage.getItem('evoCart')) || [];
    const itemsContainer = document.getElementById('checkout-items-container');
    let subtotal = 0;
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p>Sipariş özetiniz için sepetinizde ürün bulunmuyor.</p>';
    } else {
        cart.forEach(item => {
            const productData = products.find(p => p.id === item.id);
            if (productData) {
                subtotal += productData.price * item.quantity;
                itemsContainer.innerHTML += `<div class="checkout-item"><div class="checkout-item-image"><img src="${item.image}" alt="${item.name}"></div><div class="checkout-item-details"><h3>${item.name}</h3><p>${item.size} / ${item.quantity} Adet</p></div></div>`;
            }
        });
    }
    document.getElementById('checkout-subtotal').textContent = `${subtotal.toFixed(2)} TL`;
    document.getElementById('checkout-total').textContent = `${subtotal.toFixed(2)} TL`;
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Sipariş vermek için sepetinizde ürün olmalıdır.');
                return;
            }
            let allOrders = JSON.parse(localStorage.getItem('evoOrders')) || [];
            allOrders.push({
                orderId: Date.now(),
                userEmail: loggedInUser,
                date: new Date().toLocaleDateString('tr-TR'),
                items: cart,
                total: subtotal,
                status: 'Sipariş Alındı'
            });
            localStorage.setItem('evoOrders', JSON.stringify(allOrders));
            alert('Siparişiniz başarıyla alınmıştır!');
            localStorage.removeItem('evoCart');
            updateCartCounter();
            window.location.href = 'index.html';
        });
    }
}

function initializeOrdersPage() {
    const ordersContainer = document.getElementById('orders-list-container');
    if (!ordersContainer) return;
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('Siparişlerinizi görmek için lütfen giriş yapın.');
        window.location.href = 'login.html';
        return;
    }
    const allOrders = JSON.parse(localStorage.getItem('evoOrders')) || [];
    const userOrders = allOrders.filter(order => order.userEmail === loggedInUser);
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = '<p class="empty-orders-message">Henüz hiç sipariş vermediniz.</p>';
        return;
    }
    ordersContainer.innerHTML = '';
    userOrders.slice().reverse().forEach(order => {
        let productsHTML = '';
        order.items.forEach(item => {
            productsHTML += `<div class="order-product-item"><img src="${item.image}" alt="${item.name}"><div><strong>${item.name}</strong><p>${item.size} / ${item.quantity} Adet</p></div></div>`;
        });
        const orderCardHTML = `<div class="order-card"><div class="order-header"><div><strong>Sipariş No:</strong> ${order.orderId} <br><strong>Tarih:</strong> ${order.date}</div><div><span class="order-status">${order.status}</span> <br><strong>Toplam:</strong> ${order.total.toFixed(2)} TL</div></div><div class="order-body">${productsHTML}</div></div>`;
        ordersContainer.innerHTML += orderCardHTML;
    });
}

function initializeAdminPage() {
    const adminContainer = document.querySelector('.admin-page');
    if (!adminContainer) return;
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        alert('Bu sayfaya erişim yetkiniz yok.');
        window.location.href = 'index.html';
        return;
    }
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const activeTab = document.getElementById('tab-' + button.dataset.tab);
            if (activeTab) {
                activeTab.classList.add('active');
            }
        });
    });
    renderAdminOrders();
    renderAdminUsers();
    initializeAdminProductForm();
    renderAdminProducts();
}

function renderAdminOrders() {
    const ordersListContainer = document.getElementById('admin-orders-list');
    if (!ordersListContainer) return;
    const allOrders = JSON.parse(localStorage.getItem('evoOrders')) || [];
    if (allOrders.length === 0) {
        ordersListContainer.innerHTML = '<p class="empty-orders-message">Henüz hiç sipariş bulunmuyor.</p>';
        return;
    }
    ordersListContainer.innerHTML = '';
    allOrders.slice().reverse().forEach(order => {
        let productsHTML = '';
        order.items.forEach(item => {
            productsHTML += `<div class="order-product-item"><img src="${item.image}" alt="${item.name}"><div><strong>${item.name}</strong><p>${item.size} / ${item.quantity} Adet</p></div></div>`;
        });
        const statusOptions = ['Sipariş Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi'];
        let optionsHTML = '';
        statusOptions.forEach(status => {
            const isSelected = status === order.status ? 'selected' : '';
            optionsHTML += `<option value="${status}" ${isSelected}>${status}</option>`;
        });
        const statusClass = 'status-' + order.status.toLowerCase().replace(/ /g, '-');
        const orderCardHTML = `<div class="admin-order-card"><div class="admin-order-header"><div><strong>Sipariş No:</strong> ${order.orderId}</div><div><strong>Kullanıcı:</strong> ${order.userEmail}</div><div><strong>Tarih:</strong> ${order.date}</div></div><div class="admin-order-body">${productsHTML}<div class="status-changer"><label>Durumu Değiştir:</label><select class="order-status-select ${statusClass}" data-order-id="${order.orderId}">${optionsHTML}</select></div></div></div>`;
        ordersListContainer.innerHTML += orderCardHTML;
    });
    addStatusChangeFunctionality();
}

function renderAdminUsers() {
    const userListBody = document.getElementById('user-list-body');
    if (!userListBody) return;
    const allUsers = JSON.parse(localStorage.getItem('evoUsers')) || [];
    userListBody.innerHTML = '';
    allUsers.forEach(user => {
        userListBody.innerHTML += `<tr><td>${user.name}</td><td>${user.email}</td></tr>`;
    });
}

// Yönetici paneli - Ürün Ekleme formuna işlevsellik verir.
function initializeAdminProductForm() {
    const productForm = document.getElementById('add-product-form');
    if (!productForm) return;

    const mainImageInput = document.getElementById('product-main-image-upload');
    const mainImagePreview = document.getElementById('main-image-preview-container');
    const thumbnailsInput = document.getElementById('product-thumbnails-upload');
    const thumbnailsPreview = document.getElementById('thumbnails-preview-container');

    mainImageInput.addEventListener('change', function() { previewSingleImage(this, mainImagePreview); });
    thumbnailsInput.addEventListener('change', function() { previewMultipleImages(this, thumbnailsPreview); });

    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const mainImageSrc = mainImagePreview.querySelector('img')?.src;
        const thumbnailElements = thumbnailsPreview.querySelectorAll('img');
        const thumbnailSrcs = Array.from(thumbnailElements).map(img => img.src);

        if (!mainImageSrc) {
            alert('Lütfen bir ana görsel seçin.');
            return;
        }

        // DÜZELTME: Sadece var olan form alanları okunuyor. Kategori ve Stok kaldırıldı.
        const newProduct = {
            id: Date.now(),
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            description: document.getElementById('product-description').value,
            mainImage: mainImageSrc,
            thumbnails: thumbnailSrcs.length > 0 ? thumbnailSrcs : [mainImageSrc]
        };

        let currentProducts = JSON.parse(localStorage.getItem('evoProducts')) || [];
        currentProducts.push(newProduct);
        localStorage.setItem('evoProducts', JSON.stringify(currentProducts));
        products = currentProducts;

        alert('Ürün başarıyla eklendi!');
        this.reset(); // Formu temizle
        mainImagePreview.innerHTML = '';
        thumbnailsPreview.innerHTML = '';

        // Listeleri anında güncelle
        renderAdminProducts();
        renderHomepageProducts();
    });
}
function renderAdminProducts() {
    const productListBody = document.getElementById('manage-product-list-body');
    if (!productListBody) return;
    let currentProducts = JSON.parse(localStorage.getItem('evoProducts')) || [];
    productListBody.innerHTML = '';
    currentProducts.forEach(product => {
        const productRowHTML = `<tr><td>${product.name}</td><td>${product.price.toFixed(2)} TL</td><td><button class="delete-product-btn" data-id="${product.id}">Sil</button></td></tr>`;
        productListBody.innerHTML += productRowHTML;
    });
    addDeleteFunctionality();
}

function addDeleteFunctionality() {
    const deleteButtons = document.querySelectorAll('.delete-product-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            if (confirm('Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz?')) {
                let currentProducts = JSON.parse(localStorage.getItem('evoProducts')) || [];
                const updatedProducts = currentProducts.filter(p => p.id !== productId);
                localStorage.setItem('evoProducts', JSON.stringify(updatedProducts));
                products = updatedProducts;
                alert('Ürün başarıyla silindi.');
                renderAdminProducts();
                renderHomepageProducts();
            }
        });
    });
}

function previewSingleImage(input, previewContainer) {
    previewContainer.innerHTML = '';
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => { previewContainer.innerHTML = `<img src="${e.target.result}" alt="Önizleme">`; }
        reader.readAsDataURL(input.files[0]);
    }
}

function previewMultipleImages(input, previewContainer) {
    previewContainer.innerHTML = '';
    if (input.files) {
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => { previewContainer.innerHTML += `<img src="${e.target.result}" alt="Önizleme">`; }
            reader.readAsDataURL(file);
        });
    }
}

function renderHomepageProducts() {
    const productGrid = document.getElementById('main-product-grid');
    if (!productGrid) return;
    productGrid.innerHTML = '';
    products.slice(0, 4).forEach(product => {
        productGrid.innerHTML += `<div class="product-card"><a href="product-detail.html?id=${product.id}"><img src="${product.mainImage}" alt="${product.name}"><p class="product-name">${product.name}</p><p class="product-price">${product.price.toFixed(2)} TL</p></a></div>`;
    });
}

function addStatusChangeFunctionality() {
    const statusSelects = document.querySelectorAll('.order-status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const orderId = parseInt(this.dataset.orderId);
            const newStatus = this.value;
            let allOrders = JSON.parse(localStorage.getItem('evoOrders')) || [];
            const orderToUpdate = allOrders.find(order => order.orderId === orderId);
            if (orderToUpdate) {
                orderToUpdate.status = newStatus;
                localStorage.setItem('evoOrders', JSON.stringify(allOrders));
                this.className = 'order-status-select ';
                this.classList.add('status-' + newStatus.toLowerCase().replace(/ /g, '-'));
                alert(`Sipariş #${orderId} durumu "${newStatus}" olarak güncellendi.`);
            }
        });
    });
}

function updateOrderSummary(subtotal) {
    const subtotalPriceEl = document.getElementById('subtotal-price');
    const totalPriceEl = document.getElementById('total-price');
    if (subtotalPriceEl && totalPriceEl) {
        subtotalPriceEl.textContent = `${subtotal.toFixed(2)} TL`;
        totalPriceEl.textContent = `${subtotal.toFixed(2)} TL`;
    }
}

function addRemoveFunctionality() {
    const removeButtons = document.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemIndex = parseInt(this.dataset.index);
            let cart = JSON.parse(localStorage.getItem('evoCart')) || [];
            cart.splice(itemIndex, 1);
            localStorage.setItem('evoCart', JSON.stringify(cart));
            initializeCartPage();
            updateCartCounter();
        });
    });
}

function initializeProductGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-grid img');
    const mainImage = document.querySelector('.main-image img');
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbnails.forEach(innerThumb => innerThumb.classList.remove('active'));
                this.classList.add('active');
                mainImage.src = this.src;
                mainImage.alt = this.alt;
            });
        });
    }
}

function initializeSizeSelector() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    if (sizeButtons.length > 0) {
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                if(this.disabled) return;
                sizeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

function initializeQuantitySelector() {
    const quantityInput = document.getElementById('quantity-input');
    const increaseBtn = document.getElementById('increase-quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    if (quantityInput && increaseBtn && decreaseBtn) {
        increaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
        decreaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    }
}

function initializeProductPage() {
    const productDetailPage = document.querySelector('.product-detail-page');
    if (!productDetailPage) return;
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    if (product) {
        document.title = `${product.name} | EVO`;
        document.querySelector('.product-title').textContent = product.name;
        document.querySelector('.product-price').textContent = `${product.price.toFixed(2)} TL`;
        document.querySelector('.product-short-desc').textContent = product.description;
        document.querySelector('.main-image img').src = product.mainImage;
        const thumbnailGrid = document.querySelector('.thumbnail-grid');
        thumbnailGrid.innerHTML = '';
        (product.thumbnails || []).forEach((thumbSrc, index) => {
            const img = document.createElement('img');
            img.src = thumbSrc;
            img.alt = `${product.name} - ${index + 1}`;
            if (index === 0) img.classList.add('active');
            thumbnailGrid.appendChild(img);
        });
        initializeProductGallery();
        initializeSizeSelector();
        initializeQuantitySelector();
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', () => {
            const selectedSizeEl = document.querySelector('.size-btn.active');
            if (!selectedSizeEl) {
                alert('Lütfen bir beden seçin!');
                return;
            }
            const quantityInput = document.getElementById('quantity-input');
            const selectedQuantity = parseInt(quantityInput.value);
            const selectedSize = selectedSizeEl.dataset.value;
            let cart = JSON.parse(localStorage.getItem('evoCart')) || [];
            const existingItem = cart.find(item => item.id === productId && item.size === selectedSize);
            if (existingItem) {
                existingItem.quantity += selectedQuantity;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    image: product.mainImage,
                    size: selectedSize,
                    quantity: selectedQuantity
                });
            }
            localStorage.setItem('evoCart', JSON.stringify(cart));
            addToCartBtn.textContent = 'SEPETE EKLENDİ ✔';
            addToCartBtn.classList.add('added');
            setTimeout(() => {
                addToCartBtn.textContent = 'SEPETE EKLE';
                addToCartBtn.classList.remove('added');
            }, 2000);
            updateCartCounter();
        });
    } else {
        productDetailPage.innerHTML = '<h1>Ürün Bulunamadı</h1>';
    }
}