//корзина
function saveCartToLocalStorage(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Функция для загрузки корзины из localStorage
function loadCartFromLocalStorage() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

// Функция для добавления товара в корзину
function addToCart(product) {
    const cart = loadCartFromLocalStorage();

    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    saveCartToLocalStorage(cart);
    updateCartCounter();
}

// Функция для обновления счетчика товаров в корзине
function updateCartCounter() {
    const cart = loadCartFromLocalStorage();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Функция для обработки клика по товару
function handleProductClick(event) {
    const productElement = event.currentTarget;
    const productId = productElement.dataset.id;
    const productName = productElement.querySelector('.title').textContent;
    const productPrice = parseFloat(productElement.querySelector('.new-price').textContent.replace('$', ''));
    const productImage = productElement.querySelector('img').src;
    const productCategory = productElement.querySelector('.type h1').textContent;

    const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        category: productCategory,
        description: "Organic product with high quality standards",
        stars: 5
    };

    localStorage.setItem('currentProduct', JSON.stringify(product));
    window.location.href = 'purchase.html';
}

// Функция для загрузки данных товара на странице purchase.html
function loadProductData() {
    const product = JSON.parse(localStorage.getItem('currentProduct'));
    if (!product) return;

    document.querySelector('.img-products').style.backgroundImage = `url(${product.image})`;
    document.querySelector('.name-product-purchase').textContent = product.name;
    document.querySelector('.new-price').textContent = `$${product.price.toFixed(2)}`;
    document.querySelector('.old-price').textContent = `$${(product.price * 1.2).toFixed(2)}`;
    document.querySelector('.text-discription-product').textContent = product.description;
    document.querySelector('.info-product-purchase').dataset.id = product.id;
    document.querySelector('.text-type-product').textContent = product.category;

    const starsContainer = document.querySelector('.stars-purchase');
    starsContainer.innerHTML = '';
    for (let i = 0; i < product.stars; i++) {
        const star = document.createElement('img');
        star.src = './img/Star 3.svg';
        star.alt = 'Star';
        starsContainer.appendChild(star);
    }
}

// Функция для отображения товаров в корзине
function renderCartItems() {
    const cart = loadCartFromLocalStorage();
    const basketItemsContainer = document.querySelector('.basket-items');
    const basketSummary = document.querySelector('.basket-summary');

    if (cart.length === 0) {
        basketItemsContainer.innerHTML = `
            <div class="empty-basket">
                <h3 class="empty-basket-title">Your basket is empty</h3>
                <p class="empty-basket-text">Looks like you haven't added any items to your cart yet.</p>
                <a href="shop.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }

    basketItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'basket-item';
        itemElement.dataset.id = item.id;

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="basket-item-img">
            <div class="basket-item-details">
                <h3 class="basket-item-name">${item.name}</h3>
                <span class="basket-item-category">${item.category}</span>
                <div class="basket-item-price">$${item.price.toFixed(2)}</div>
                <div class="basket-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <span class="remove-item">Remove</span>
            </div>
        `;

        basketItemsContainer.appendChild(itemElement);
    });

    updateCartSummary();
}

// Функция для обновления итоговой информации в корзине
function updateCartSummary() {
    const cart = loadCartFromLocalStorage();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.summary-total').textContent = `$${total.toFixed(2)}`;
}

// Функция для показа формы оформления заказа
function showCheckoutForm() {
    document.querySelector('.basket-container').style.display = 'none';
    document.querySelector('.checkout-form').style.display = 'block';

    const cart = loadCartFromLocalStorage();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.querySelector('.checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.checkout-total').textContent = `$${total.toFixed(2)}`;
}

// Функция для возврата к корзине из формы оформления
function backToCart() {
    document.querySelector('.basket-container').style.display = 'block';
    document.querySelector('.checkout-form').style.display = 'none';
}

// Функция для показа модального окна об успешном заказе
function showOrderSuccessModal() {
    const cart = loadCartFromLocalStorage();
    const orderNumber = Math.floor(Math.random() * 1000000);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08;

    // Формируем список товаров
    const itemsList = cart.map(item =>
        `<li>${item.name} - ${item.quantity} × $${item.price.toFixed(2)}</li>`
    ).join('');

    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">✓</div>
            <h2>Order #${orderNumber} Confirmed!</h2>
            <div class="order-details">
                <p>We've sent the order confirmation and details to your email.</p>
                <p>
                    You'll receive a tracking number via email once your order ships.<br>
                    For any questions, please contact our support team.
                </p>
            </div>
            <button class="modal-close-btn">Back to Shopping</button>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.querySelector('.modal-close-btn').addEventListener('click', function () {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
        window.location.href = 'shop.html';
    });
}

// Обработчик отправки формы оформления заказа
function handleCheckoutFormSubmit(e) {
    e.preventDefault();

    localStorage.removeItem('shoppingCart');
    updateCartCounter();
    showOrderSuccessModal();
    document.querySelector('.checkout-form').style.display = 'none';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    updateCartCounter();

    // Обработчики для товаров на страницах index.html и shop.html
    const products = document.querySelectorAll('.product');
    if (products.length > 0) {
        products.forEach(product => {
            product.addEventListener('click', handleProductClick);
        });
    }

    // Загрузка данных товара на странице purchase.html
    if (document.querySelector('.info-product-purchase')) {
        loadProductData();

        document.querySelector('.btn-sec1-purchase').addEventListener('click', function () {
            const product = {
                id: document.querySelector('.info-product-purchase').dataset.id,
                name: document.querySelector('.name-product-purchase').textContent,
                price: parseFloat(document.querySelector('.new-price').textContent.replace('$', '')),
                image: document.querySelector('.img-products').style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)[1],
                category: document.querySelector('.text-type-product').textContent,
                quantity: parseInt(document.querySelector('.Quantity-products').textContent)
            };

            addToCart(product);
            window.location.href = 'basket.html';
        });
    }

    // Обработчики для страницы корзины
    if (document.querySelector('.basket-container')) {
        renderCartItems();

        document.querySelector('.basket-items').addEventListener('click', function (e) {
            const itemElement = e.target.closest('.basket-item');
            if (!itemElement) return;

            const itemId = itemElement.dataset.id;
            const cart = loadCartFromLocalStorage();
            const itemIndex = cart.findIndex(item => item.id === itemId);

            if (e.target.classList.contains('plus')) {
                cart[itemIndex].quantity += 1;
            } else if (e.target.classList.contains('minus')) {
                cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity - 1);
            } else if (e.target.classList.contains('remove-item')) {
                cart.splice(itemIndex, 1);
            }

            saveCartToLocalStorage(cart);
            renderCartItems();
            updateCartCounter();
        });

        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function () {
                const cart = loadCartFromLocalStorage();
                if (cart.length > 0) {
                    showCheckoutForm();
                } else {
                    alert('Your cart is empty. Please add some products first.');
                }
            });
        }
    }

    // Обработчики для формы оформления заказа
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', handleCheckoutFormSubmit);
    }

    const backToCartBtn = document.querySelector('.back-to-cart-btn');
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', backToCart);
    }
});


function handleCheckoutFormSubmit(e) {
    e.preventDefault();

    // Проверяем, приняты ли условия
    const consentCheckbox = document.getElementById('consent');
    if (!consentCheckbox.checked) {
        alert('Please agree to our Terms of Service and Privacy Policy to continue.');
        return;
    }

    // Здесь должна быть реальная отправка формы (AJAX, fetch, etc.)
    // Для примера просто очищаем корзину и показываем сообщение

    localStorage.removeItem('shoppingCart');
    updateCartCounter();
    showOrderSuccessModal();
    document.querySelector('.checkout-form').style.display = 'none';
}

function toggleSection(sectionNumber) {
    const content = document.getElementById(`section${sectionNumber}`);
    const icon = document.querySelector(`#section${sectionNumber}`).previousElementSibling.querySelector('.toggle-icon');

    content.classList.toggle('show');
    icon.classList.toggle('rotate');
}


