
        // Данные для меню
        const menuItems = [
            { id: 1, name: "Калифорния", description: "Классические роллы с нежным лососем, сливочным сыром и свежим огурцом. Идеальный баланс вкуса и текстуры.", grams: 250, price: 350, image: '../images/fila.png'},
            { id: 2, name: "Онигири", description: "Традиционные японские рисовые треугольники с ароматными нори и начинкой из тунца. Удобный перекус с насыщенным вкусом.", grams: 230, price: 200, image:  '../images/oni.png'},
            { id: 3, name: "Рамен", description: "Насыщенный мисо-бульон с лапшой удон, курицей, грибами, яйцом, кукурузой и луком. Сытное и ароматное блюдо с добавлением кунжута.", grams: 500, price: 270, image: '../images/ramen.png' },
            { id: 4, name: "Такояки", description: "Аппетитные японские шарики с нежным тунцом, луком и пикантным спайси-соусом. Хрустящие снаружи и сочные внутри.", grams: 150, price: 200, image: '../images/tako.png'},
            { id: 5, name: "Данго", description: "Традиционные японские сладкие рисовые шарики с нежным лососем и икрой тобико. Необычное сочетание вкусов.", grams: 100, price: 150, image: '../images/dango.png'},
        ];

        // Корзина
        let cart = [];
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const totalAmount = document.getElementById('totalAmount');
        const dishesGrid = document.querySelector('.dishes-grid');


        // Профиль пользователя
        let userProfile = {
            name: 'Дмитрий Кирисамов',
            email: 'dk@gmail.com',
            phone: '+7 (951) 451-47-42',
            address: 'ул. Пушкина, д. 10, кв. 25'
        };

         // Загрузка профиля
        function loadProfile() {
            // Загружаем из localStorage, если есть
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                userProfile = JSON.parse(savedProfile);
            }
            
            // Обновляем поля в настройках
            document.querySelector('#settings input[type="text"]').value = userProfile.name;
            document.querySelector('#settings input[type="email"]').value = userProfile.email;
            document.querySelector('#settings input[type="tel"]').value = userProfile.phone;
            document.querySelector('#settings input[type="text"][value="ул. Пушкина, д. 10, кв. 25"]').textContent = userProfile.address;
            
            // Обновляем отображение профиля
            document.querySelector('.profile-name').textContent = userProfile.name;
            document.querySelector('.profile-email').textContent = userProfile.email;
            document.querySelector('.profile-phone').textContent = userProfile.phone;
            document.querySelector('.profile-address').textContent = userProfile.address;
        }
        
        // Настройка маски телефона
        function setupPhoneMask() {
            const phoneInputs = document.querySelectorAll('input[type="tel"]');
            
            phoneInputs.forEach(input => {
                input.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    let formattedValue = '+7 (';
                    
                    if (value.length > 1) {
                        value = value.substring(1);
                    } else {
                        value = '';
                    }
                    
                    if (value.length > 0) {
                        formattedValue += value.substring(0, 3);
                    }
                    if (value.length > 3) {
                        formattedValue += ') ' + value.substring(3, 6);
                    }
                    if (value.length > 6) {
                        formattedValue += '-' + value.substring(6, 8);
                    }
                    if (value.length > 8) {
                        formattedValue += '-' + value.substring(8, 10);
                    }
                    
                    e.target.value = formattedValue;
                });
            });
        }
        
        // Функция для сохранения профиля
        function saveProfile() {
            const name = document.querySelector('#settings input[type="text"]').value.trim();
            const email = document.querySelector('#settings input[type="email"]').value.trim();
            const phone = document.querySelector('#settings input[type="tel"]').value.trim();
            const address = document.querySelector('#settings input[type="text"][value="ул. Пушкина, д. 10, кв. 25"]').value.trim();
            const password = document.querySelector('#settings input[type="password"]').value;
            
            // Валидация
            let isValid = true;
            const nameField = document.querySelector('#settings input[type="text"]').closest('.contact-item');
            const emailField = document.querySelector('#settings input[type="email"]').closest('.contact-item');
            const phoneField = document.querySelector('#settings input[type="tel"]').closest('.contact-item');
            
            // Сбросим ошибки
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.error-field').forEach(el => el.classList.remove('error-field'));
            document.querySelectorAll('.contact-item.error').forEach(el => el.classList.remove('error'));
            
            // Проверка имени
            if (!name || name.length < 2) {
                showError(nameField, 'Имя должно содержать минимум 2 символа');
                isValid = false;
            }
            
            // Проверка email
            if (!validateEmail(email)) {
                showError(emailField, 'Введите корректный email');
                isValid = false;
            }
            
            // Проверка телефона
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length !== 11) {
                showError(phoneField, 'Введите корректный номер телефона');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Обновляем профиль
            userProfile.name = name;
            userProfile.email = email;
            userProfile.phone = phone;
            userProfile.address = address;
            
            // Сохраняем в localStorage
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            
            // Обновляем отображение профиля
            document.querySelector('.profile-name').textContent = userProfile.name;
            document.querySelector('.profile-email').textContent = userProfile.email;
            document.querySelector('.profile-phone').textContent = userProfile.phone;
            document.querySelector('.profile-address').textContent = userProfile.address;
            
            alert('Настройки сохранены!');
        }
        
        // Функция валидации email
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        // Функция отображения ошибки
        function showError(field, message) {
            field.classList.add('error');
            const input = field.querySelector('input, textarea');
            input.classList.add('error-field');
            
            let errorElement = field.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Показ раздела
        function showSection(sectionId) {
            // Скрыть все разделы
            document.querySelectorAll('main section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Показать выбранный раздел
            document.getElementById(sectionId).classList.add('active');
            
            // Обновить активную кнопку в футере
            document.querySelectorAll('footer .footer-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Для основных разделов активируем соответствующую кнопку
            const footerBtns = {
                'promotions': 0,
                'menu': 1,
                'cart': 2,
                'profile': 3,
                'contacts': 4
            };
            
            if (footerBtns.hasOwnProperty(sectionId)) {
                document.querySelectorAll('footer .footer-btn')[footerBtns[sectionId]].classList.add('active');
            }

            if (sectionId === 'order-history') {
                renderOrderHistory();
    }
        }

        // Генерация меню
        function generateMenu() {
            dishesGrid.innerHTML = '';
            
            menuItems.forEach(item => {
                const dishCard = document.createElement('div');
                dishCard.className = 'dish-card';
                dishCard.innerHTML = `
                    <div class="dish-image" style="background-image: url('${item.image}')"></div>
                    <div class="dish-info">
                        <div class="dish-name">${item.name}</div>
                        <div class="dish-meta">
                            <span>${item.grams}г</span>
                            <span class="dish-price">${item.price}₽</span>
                        </div>
                        <button class="add-btn" onclick="addToCart(${item.id})">Добавить</button>
                    </div>
                `;
                
                // Добавляем обработчик для открытия деталей блюда
                dishCard.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('add-btn')) {
                        alert(`Подробности блюда:\n\n${item.name}\n${item.description}\n${item.grams}г\n${item.price}₽`);
                    }
                });
                
                dishesGrid.appendChild(dishCard);
            });
        }

        // Добавление в корзину
        function addToCart(itemId) {
            const item = menuItems.find(i => i.id === itemId);
            const existingItem = cart.find(i => i.id === itemId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1
                });
            }
            
            updateCart();
        }

        // Обновление корзины
        function updateCart() {
            // Обновляем счетчик
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Обновляем список товаров
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-basket"></i>
                        <h3>Корзина пуста</h3>
                        <p>Добавьте что-нибудь из меню</p>
                    </div>
                `;
                cartTotal.style.display = 'none';
            } else {
                cartItems.innerHTML = '';
                let total = 0;
                
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-price">${item.price}₽ × ${item.quantity} = ${itemTotal}₽</div>
                        </div>
                        <div class="item-controls">
                            <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });
                
                totalAmount.textContent = total;
                cartTotal.style.display = 'block';
            }
        }

        // Изменение количества
        function changeQuantity(itemId, change) {
            const item = cart.find(i => i.id === itemId);
            
            if (item) {
                item.quantity += change;
                
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== itemId);
                }
                
                updateCart();
            }
        }

        // История заказов
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

// Функция для сохранения заказа в историю
function saveOrderToHistory() {
    if (cart.length === 0) return;
    
    const newOrder = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'Выполнен'
    };
    
    orderHistory.unshift(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    cart = [];
    updateCart();
    renderOrderHistory();
}

// Функция отображения истории заказов
function renderOrderHistory() {
    const container = document.getElementById('historyContainer');
    
    if (orderHistory.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-history"></i>
                <h3>История заказов пуста</h3>
                <p>Сделайте свой первый заказ!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    orderHistory.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-date">${order.date}</div>
                <div class="order-status">${order.status}</div>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div>${item.name} × ${item.quantity}</div>
                        <div>${item.price * item.quantity}₽</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">
                Итого: ${order.total}₽
            </div>
        `;
        
        container.appendChild(orderCard);
    });
}

// Обновляем кнопку оформления заказа
document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    saveOrderToHistory();
    alert('Заказ оформлен! Спасибо за покупку!');
    showSection('promotions');
});



// Инициализация истории при загрузке
    window.onload = function() {
    generateMenu();
    updateCart();
    renderOrderHistory();
    loadProfile();
    setupPhoneMask();
};
