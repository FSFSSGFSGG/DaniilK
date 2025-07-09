// This file is intentionally left blank.

// Модалки
const registerModal = document.getElementById('register-modal');
const loginModal = document.getElementById('login-modal');
const openRegisterBtn = document.getElementById('open-register');
const openLoginBtn = document.getElementById('open-login');
const closeRegisterBtn = document.getElementById('close-register');
const closeLoginBtn = document.getElementById('close-login');

// Открытие модалок
openRegisterBtn.onclick = () => registerModal.classList.add('active');
openLoginBtn.onclick = () => loginModal.classList.add('active');

// Закрытие модалок
closeRegisterBtn.onclick = () => registerModal.classList.remove('active');
closeLoginBtn.onclick = () => loginModal.classList.remove('active');

// Закрытие по клику вне окна
window.onclick = function(e) {
    if (e.target === registerModal) registerModal.classList.remove('active');
    if (e.target === loginModal) loginModal.classList.remove('active');
};

function showProfile(email) {
    document.getElementById('auth-buttons').style.display = 'none';
    const miniProfile = document.getElementById('mini-profile');
    document.getElementById('profile-email').textContent = email;
    miniProfile.style.display = 'flex';
}

function hideProfile() {
    document.getElementById('mini-profile').style.display = 'none';
    document.getElementById('auth-buttons').style.display = 'flex';
    localStorage.removeItem('userEmail');
}

// Проверка при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const email = localStorage.getItem('userEmail');
    if (email) {
        showProfile(email);
    } else {
        hideProfile();
    }
});

// Обработка регистрации
document.getElementById('register-form').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    // Здесь можно добавить валидацию/отправку на сервер
    document.getElementById('register-modal').classList.remove('active');
    localStorage.setItem('userEmail', email);
    showProfile(email);
    window.location.href = '/'; // Переадресация на главную
};

// Обработка входа
document.getElementById('login-form').onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    // Здесь можно добавить валидацию/отправку на сервер
    document.getElementById('login-modal').classList.remove('active');
    localStorage.setItem('userEmail', email);
    showProfile(email);
    window.location.href = '/'; // Переадресация на главную
};

// Выход из аккаунта
document.getElementById('logout-btn').onclick = function() {
    hideProfile();
    // Очистка localStorage уже происходит в hideProfile
};

// --- КОРЗИНА ---

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    document.getElementById('cart-count').textContent = cart.length;
}

function renderCart() {
    const cart = getCart();
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="text-align:center;color:#888;">Корзина пуста</div>';
        cartTotal.textContent = '';
    } else {
        cart.forEach((item, idx) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-img" style="background-image:url('${item.img}')"></div>
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <button class="cart-item-remove" data-idx="${idx}" title="Удалить">×</button>
            `;
            cartItems.appendChild(div);
        });
        cartTotal.textContent = 'Итого: ' + total.toLocaleString() + ' ₽';
    }
}

function addToCart(item) {
    const cart = getCart();
    cart.push(item);
    setCart(cart);
    updateCartCount();
}

document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    updateCartCount();
});

// Открытие/закрытие корзины
document.getElementById('open-cart').onclick = function() {
    renderCart();
    document.getElementById('cart-modal').classList.add('active');
};
document.getElementById('close-cart').onclick = function() {
    document.getElementById('cart-modal').classList.remove('active');
};
// Удаление товара из корзины
document.getElementById('cart-items').onclick = function(e) {
    if (e.target.classList.contains('cart-item-remove')) {
        const idx = +e.target.getAttribute('data-idx');
        const cart = getCart();
        cart.splice(idx, 1);
        setCart(cart);
        renderCart();
        updateCartCount();
    }
};

// Добавление товара в корзину по кнопке
document.querySelectorAll('.products, .recommendations .products').forEach(section => {
    section.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') && e.target.textContent.includes('В корзину')) {
            const card = e.target.closest('.product-card');
            const title = card.querySelector('.product-title').textContent;
            const priceText = card.querySelector('.product-price').textContent.replace(/[^\d]/g, '');
            const price = parseInt(priceText, 10);
            const img = card.querySelector('.product-image').style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            addToCart({ title, price, img });
        }
    });
});

// Открытие формы заказа
document.getElementById('checkout-btn').onclick = function() {
    document.getElementById('checkout-form').style.display = 'block';
    this.style.display = 'none';
};

// Обработка отправки заказа
document.getElementById('checkout-form').onsubmit = function(e) {
    e.preventDefault();
    // Можно добавить валидацию и отправку данных на сервер
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('checkout-success').style.display = 'block';
    // Очистить корзину после заказа
    localStorage.removeItem('cart');
    updateCartCount();
};

// При закрытии корзины сбрасывать форму заказа
document.getElementById('close-cart').onclick = function() {
    document.getElementById('cart-modal').classList.remove('active');
    document.getElementById('checkout-form').reset();
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('checkout-btn').style.display = 'block';
    document.getElementById('checkout-success').style.display = 'none';
};

// --- Модальное окно товара с каруселью ---
const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const productModalImg = document.getElementById('product-modal-img');
const productModalTitle = document.getElementById('product-modal-title');
const productModalDesc = document.getElementById('product-modal-desc');
const productModalSize = document.getElementById('product-modal-size');
const productModalPrice = document.getElementById('product-modal-price');
const productModalAdd = document.getElementById('product-modal-add');
let productModalImages = [];
let productModalCurrent = 0;
let productModalPriceValue = 0;
let productModalTitleValue = '';
let productModalSizeValue = '';
let productModalImgValue = '';

document.querySelectorAll('.btn-details').forEach(btn => {
    btn.onclick = function() {
        const card = btn.closest('.product-card');
        productModalTitleValue = card.dataset.title;
        productModalImages = JSON.parse(card.dataset.images);
        productModalCurrent = 0;
        productModalImgValue = productModalImages[0];
        productModalImg.src = productModalImgValue;
        productModalTitle.textContent = productModalTitleValue;
        productModalDesc.textContent = card.dataset.desc;
        productModalPriceValue = parseInt(card.querySelector('.add-to-cart').dataset.price, 10);
        productModalPrice.textContent = card.querySelector('.product-price').textContent;
        // Заполнить размеры
        const sizes = JSON.parse(card.dataset.sizes);
        productModalSize.innerHTML = '';
        sizes.forEach(size => {
            const opt = document.createElement('option');
            opt.value = size;
            opt.textContent = size;
            productModalSize.appendChild(opt);
        });
        productModalSizeValue = sizes[0];
        productModalSize.onchange = function() {
            productModalSizeValue = this.value;
        };
        productModal.style.display = 'flex';
        productModal.classList.add('active');
    };
});

document.getElementById('gallery-prev').onclick = function() {
    if (productModalImages.length > 0) {
        productModalCurrent = (productModalCurrent - 1 + productModalImages.length) % productModalImages.length;
        productModalImgValue = productModalImages[productModalCurrent];
        productModalImg.src = productModalImgValue;
    }
};
document.getElementById('gallery-next').onclick = function() {
    if (productModalImages.length > 0) {
        productModalCurrent = (productModalCurrent + 1) % productModalImages.length;
        productModalImgValue = productModalImages[productModalCurrent];
        productModalImg.src = productModalImgValue;
    }
};

closeProductModal.onclick = function() {
    productModal.classList.remove('active');
    setTimeout(() => { productModal.style.display = 'none'; }, 200);
};

// Добавление в корзину из модального окна товара
productModalAdd.onclick = function() {
    addToCart({
        title: productModalTitleValue + ' (' + productModalSizeValue + ')',
        price: productModalPriceValue,
        img: productModalImgValue
    });
    productModal.classList.remove('active');
    setTimeout(() => { productModal.style.display = 'none'; }, 200);
};