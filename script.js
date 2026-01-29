// ===== Product Data =====
const products = [
    {
        id: 1,
        name: "Kemeja Formal Putih",
        price: 150000,
        category: "pria",
        image: "https://dynamic.zacdn.com/X6KFQDtGYyfTilSmFubN_Rp1I88=/filters:quality(70):format(webp)/https://static-id.zacdn.com/p/simple-perfect-4972-2565864-1.jpg"
    },
    {
        id: 2,
        name: "Dress Casual",
        price: 180000,
        category: "wanita",
        image: "img/dressCasual.jpg"
    },
    {
        id: 3,
        name: "Kaos Anak Lucu",
        price: 80000,
        category: "anak",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTboPUTgRmYtk3RoqqwvzEOC10SfyjTSLqMlQ&s"
    },
    {
        id: 4,
        name: "Celana Jeans Pria",
        price: 200000,
        category: "pria",
        image: "img/celanajeanspria.jpg"
    },
    {
        id: 5,
        name: "Blouse Wanita",
        price: 120000,
        category: "wanita",
        image: "img/blousewanita.jpg"
    },
    {
        id: 6,
        name: "Celana Pendek Anak",
        price: 60000,
        category: "anak",
        image: "img/celanapendekanak.jpg"
    },
    {
        id: 7,
        name: "Jacket Denim",
        price: 250000,
        category: "pria",
        image: "img/jaketdenim.jpg"
    },
    {
        id: 8,
        name: "Rok Plisket",
        price: 95000,
        category: "wanita",
        image: "img/rokplisket.jpg"
    }
];

// ===== Shopping Cart =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===== DOM Elements =====
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');

// ===== Display Products =====
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Tambah
                    </button>
                    <button class="wishlist-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// ===== Filter and Sort Products =====
function filterAndSortProducts() {
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;
    
    let filteredProducts = [...products];
    
    // Filter by category
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    // Sort products
    if (sortBy === 'termurah') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'termahal') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else {
        filteredProducts.sort((a, b) => b.id - a.id); // Terbaru
    }
    
    displayProducts(filteredProducts);
}

// ===== Add to Cart =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification('Produk berhasil ditambahkan ke keranjang!');
    }
}

// ===== Update Cart Display =====
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items display
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang Anda kosong</p>';
        totalPrice.textContent = 'Rp 0';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="quantity-btn remove" data-id="${item.id}" style="margin-left: 10px; background: #ff6b6b; color: white;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total price
    totalPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            decreaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            increaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

// ===== Cart Functions =====
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(id);
            return;
        }
        updateCart();
    }
}

function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        updateCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    showNotification('Produk berhasil dihapus dari keranjang!');
}

// ===== Show Notification =====
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        box-shadow: var(--shadow);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Event Listeners =====
cartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    
    alert(`Checkout berhasil!\nTotal: Rp ${totalPrice.textContent.replace('Rp ', '').replace(/\./g, '')}\nTerima kasih telah berbelanja!`);
    cart = [];
    updateCart();
    cartModal.classList.remove('active');
});

categoryFilter.addEventListener('change', filterAndSortProducts);
sortFilter.addEventListener('change', filterAndSortProducts);

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.');
        contactForm.reset();
    });
}

// ===== Initialize =====
displayProducts(products);
updateCart();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});