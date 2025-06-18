// Unified cart system
const CART_CONFIG = {
    maxQuantity: 20,
    minQuantity: 1,
    taxRate: 0.18, // 18% GST
    storageKey: 'cartData',
    currency: '₹'
};

// Product data for all items
const productData = {
    // Namkeen products
    "dal-moth": {
        id: "dal-moth",
        title: "Dal Moth Special",
        price: 180,
        image: "images/namkeen/dal_mot.jpg",
        category: "namkeen",
        description: "Crispy lentil-based snack with aromatic spices"
    },
    "traditional-mixture": {
        id: "traditional-mixture",
        title: "Traditional Mixture",
        price: 200,
        image: "images/namkeen/mixture.jpg",
        category: "namkeen",
        description: "Classic mix of various crispy snacks and nuts"
    },
    "chakli": {
        id: "chakli",
        title: "Spiral Chakli",
        price: 220,
        image: "images/namkeen/chakli.jpg",
        category: "namkeen",
        description: "Crispy spiral-shaped snack with traditional spices"
    },
    "aloo-bhujia": {
        id: "aloo-bhujia",
        title: "Aloo Bhujia",
        price: 160,
        image: "images/namkeen/alu_bhojia.jpeg",
        category: "namkeen",
        description: "Crispy potato noodles with traditional spices"
    },
    "moong-bhujia": {
        id: "moong-bhujia",
        title: "Moong Bhujia",
        price: 180,
        image: "images/namkeen/moong_bhujia.jpg",
        category: "namkeen",
        description: "Crispy moong dal noodles with special spices"
    },
    "besan-bhujia": {
        id: "besan-bhujia",
        title: "Besan Bhujia",
        price: 200,
        image: "images/namkeen/besan_bhujia.jpg",
        category: "namkeen",
        description: "Crispy gram flour noodles with special spices"
    },
    "khatta-meetha": {
        id: "khatta-meetha",
        title: "Khatta Meetha",
        price: 220,
        image: "images/namkeen/khata_meetha.jpg",
        category: "namkeen",
        description: "Sweet and tangy mix with dried fruits"
    },
    "dry-fruit-mixture": {
        id: "dry-fruit-mixture",
        title: "Dry Fruit Mixture",
        price: 240,
        image: "images/namkeen/dry_fruit_mixture.jpg",
        category: "namkeen",
        description: "Premium mix of nuts and dried fruits"
    },
    "spicy-mixture": {
        id: "spicy-mixture",
        title: "Spicy Mixture",
        price: 200,
        image: "images/namkeen/spicy_mixture.jpg",
        category: "namkeen",
        description: "Hot and spicy mix of various snacks"
    },
    "masala-mathri": {
        id: "masala-mathri",
        title: "Masala Mathri",
        price: 180,
        image: "images/namkeen/masala_mathri.jpeg",
        category: "namkeen",
        description: "Flaky, spiced crackers made with premium flour"
    },
    "ajwain-mathri": {
        id: "ajwain-mathri",
        title: "Ajwain Mathri",
        price: 200,
        image: "images/namkeen/ajwain_mathri.jpg",
        category: "namkeen",
        description: "Flaky crackers with carom seeds"
    },
    "methi-mathri": {
        id: "methi-mathri",
        title: "Methi Mathri",
        price: 220,
        image: "images/namkeen/methi_mathri.jpg",
        category: "namkeen",
        description: "Fenugreek flavored crispy crackers"
    },

    // Sweets products
    "kaju-katli": {
      id: "kaju-katli",
      title: "Kaju Katli",
        price: 800,
        image: "images/signature/kaju-katli.jpg",
        category: "sweets",
        description: "Premium quality kaju katli made with pure cashews and cardamom"
    },
    "rasmalai": {
      id: "rasmalai",
      title: "Rasmalai",
        price: 600,
        image: "images/signature/rasmalai.jpg",
        category: "sweets",
        description: "Soft and creamy rasmalai in sweetened milk"
    },
    "gulab-jamun": {
      id: "gulab-jamun",
      title: "Gulab Jamun",
        price: 400,
        image: "images/signature/gulab-jamun.jpg",
        category: "sweets",
        description: "Soft and spongy gulab jamun in sugar syrup"
    },
    "motichoor-laddu": {
        id: "motichoor-laddu",
        title: "Motichoor Laddu",
        price: 500,
        image: "images/signature/motichoor-laddu.jpg",
        category: "sweets",
        description: "Traditional motichoor laddu made with fine boondi"
    },
    "besan-laddu": {
        id: "besan-laddu",
        title: "Besan Laddu",
        price: 450,
        image: "images/signature/besan-laddu.jpg",
        category: "sweets",
        description: "Rich and flavorful besan laddu with ghee"
    },
    "milk-barfi": {
        id: "milk-barfi",
        title: "Milk Barfi",
        price: 350,
        image: "images/signature/milk-barfi.jpg",
        category: "sweets",
        description: "Creamy milk barfi with a rich texture"
    }
};

// Universal product lookup function
function getProductById(productId) {
    const id = String(productId);
    return productData[id] || null;
}

// Extract numeric price from string price
function extractPrice(price) {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        // Handle various price formats
        const formats = [
            /₹(\d+)/,                    // ₹300
            /₹(\d+)\/kg/,                // ₹300/kg
            /₹(\d+)\/piece/,             // ₹300/piece
            /₹(\d+)\/box/,               // ₹300/box
            /₹(\d+)\s*-\s*₹(\d+)/,       // ₹300 - ₹500
            /₹(\d+)\s*per\s*kg/,         // ₹300 per kg
            /₹(\d+)\s*per\s*piece/,      // ₹300 per piece
            /₹(\d+)\s*per\s*box/         // ₹300 per box
        ];

        for (const format of formats) {
            const match = price.match(format);
            if (match) {
                // For range prices (e.g., ₹300 - ₹500), return the lower price
                if (match[2]) {
                    return Math.min(parseInt(match[1]), parseInt(match[2]));
                }
                return parseInt(match[1]);
            }
        }

        // Try to extract any number from the string
        const numberMatch = price.match(/\d+/);
        if (numberMatch) {
            return parseInt(numberMatch[0]);
        }
    }
    return 0;
}

// Cart Manager Class
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.initializeEventListeners();
        this.updateCartUI();
    }

    loadCart() {
        try {
            const savedCart = localStorage.getItem(CART_CONFIG.storageKey);
            if (!savedCart) return { items: [], subtotal: 0, tax: 0, total: 0 };
            
            const cart = JSON.parse(savedCart);
            // Ensure cart has the correct structure
            return {
                items: Array.isArray(cart.items) ? cart.items : [],
                subtotal: cart.subtotal || 0,
                tax: cart.tax || 0,
                total: cart.total || 0
            };
        } catch (error) {
            console.error('Error loading cart:', error);
            return { items: [], subtotal: 0, tax: 0, total: 0 };
        }
    }

    saveCart() {
        try {
            this.calculateTotals();
            localStorage.setItem(CART_CONFIG.storageKey, JSON.stringify(this.cart));
            this.updateCartUI();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    calculateTotals() {
        this.cart.subtotal = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cart.tax = this.cart.subtotal * CART_CONFIG.taxRate;
        this.cart.total = this.cart.subtotal + this.cart.tax;
    }

    addToCart(product) {
        try {
            const existingItem = this.cart.items.find(item => item.id === product.id);
        
        if (existingItem) {
                if (existingItem.quantity >= CART_CONFIG.maxQuantity) {
                    showToast(`Maximum quantity (${CART_CONFIG.maxQuantity}) reached for this item`);
                    return;
                }
                existingItem.quantity++;
        } else {
                this.cart.items.push({
                    id: product.id,
                    title: product.title,
                price: product.price,
                    quantity: 1,
                    image: product.image
                });
            }

            this.saveCart();
            showToast('Item added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
            showToast('Error adding item to cart');
        }
    }

    removeFromCart(productId) {
        try {
            this.cart.items = this.cart.items.filter(item => item.id !== productId);
            this.saveCart();
            showToast('Item removed from cart');
        } catch (error) {
            console.error('Error removing from cart:', error);
            showToast('Error removing item from cart');
        }
    }

    updateQuantity(productId, quantity) {
        try {
            const item = this.cart.items.find(item => item.id === productId);
    if (!item) return;

            if (quantity <= 0) {
                this.removeFromCart(productId);
                return;
            }

            if (quantity > CART_CONFIG.maxQuantity) {
                showToast(`Maximum quantity (${CART_CONFIG.maxQuantity}) reached for this item`);
                return;
            }

            item.quantity = quantity;
            this.saveCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            showToast('Error updating quantity');
        }
    }

    updateCartUI() {
        try {
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                const totalItems = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'block' : 'none';
            }

            // Update cart modal if it exists
    const cartItems = document.getElementById('cartItems');
            const cartSubtotal = document.getElementById('cartSubtotal');
            const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');
            const checkoutBtn = document.getElementById('checkoutBtn');

            if (cartItems) {
                if (this.cart.items.length === 0) {
                    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                } else {
                    cartItems.innerHTML = this.cart.items.map(item => `
                        <div class="cart-item" data-product-id="${item.id}">
                            <img src="${item.image}" alt="${item.title}" onerror="this.src='images/placeholder.jpg'">
            <div class="cart-item-details">
                                <h4>${item.title}</h4>
                                <p>${CART_CONFIG.currency}${item.price} x ${item.quantity}</p>
                                <div class="cart-item-actions">
                                    <button onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                                    <button onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                    <button class="remove-item" onclick="cartManager.removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
                                </div>
                            </div>
                            <div class="cart-item-total">${CART_CONFIG.currency}${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
                }
            }

            if (cartSubtotal) cartSubtotal.textContent = `${CART_CONFIG.currency}${this.cart.subtotal.toFixed(2)}`;
            if (cartTax) cartTax.textContent = `${CART_CONFIG.currency}${this.cart.tax.toFixed(2)}`;
            if (cartTotal) cartTotal.textContent = `${CART_CONFIG.currency}${this.cart.total.toFixed(2)}`;
            if (checkoutBtn) checkoutBtn.disabled = this.cart.items.length === 0;
        } catch (error) {
            console.error('Error updating cart UI:', error);
        }
    }

    initializeEventListeners() {
        // Cart icon click
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.toggleCart());
        }

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            const cartModal = document.getElementById('cartModal');
            if (cartModal && !cartModal.contains(e.target) && !e.target.closest('.cart-icon')) {
                cartModal.classList.remove('show');
            }
        });

        // Close cart button
        const closeCartBtn = document.getElementById('closeCart');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => this.toggleCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    toggleCart(forceShow = false) {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
        if (forceShow) {
            cartModal.classList.add('show');
        } else {
    cartModal.classList.toggle('show');
        }

    if (cartModal.classList.contains('show')) {
            this.updateCartUI();
        }
    }

    proceedToCheckout() {
        if (this.cart.items.length === 0) {
            showToast('Your cart is empty!', 'error');
            return;
        }

        this.calculateTotals();
        // Save cart data before proceeding to checkout
        localStorage.setItem(CART_CONFIG.storageKey, JSON.stringify(this.cart));
        window.location.href = 'payment.html';
    }

    clearCart() {
        this.cart = {
            items: [],
            subtotal: 0,
            tax: 0,
            total: 0
        };
        this.saveCart();
        this.updateCartUI();
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }, 100);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cartManager.updateCartUI();
});

// Show notification
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles if not already in document
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                z-index: 1000;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 90%;
                text-align: center;
            }
            .notification.show {
                opacity: 1;
                transform: translateY(0);
            }
            .notification.success {
                background-color: #4CAF50;
            }
            .notification.error {
                background-color: #f44336;
            }
            .notification.info {
                background-color: #2196F3;
            }
            @media (max-width: 768px) {
                .notification {
                    left: 20px;
                    right: 20px;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Show item details
function showItemDetails(type, id) {
    const product = getProductById(id);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }

    // Create modal if it doesn't exist
    let modal = document.getElementById('productModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add close handlers
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal('productModal'));
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal('productModal');
            }
        });
    }

    const modalContent = modal.querySelector('.modal-body');
    if (!modalContent) {
        console.error('Modal content not found');
        return;
    }

    // Generate modal content
    modalContent.innerHTML = `
        <div class="product-details">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title || product.name}" onerror="this.src='images/placeholder.jpg'">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h2>${product.title || product.name}</h2>
                <p class="description">${product.description}</p>
                <div class="price-details">
                    <span class="price">₹${product.price}</span>
                    ${product.rating ? `<span class="rating">${product.rating}</span>` : ''}
                </div>
                ${product.ingredients ? `
                    <div class="ingredients-section">
                        <h3>Ingredients</h3>
                        <p>${product.ingredients}</p>
                    </div>
                ` : ''}
                ${product.shelfLife ? `
                    <div class="shelf-life">
                        <h3>Shelf Life</h3>
                        <p>${product.shelfLife}</p>
                    </div>
                ` : ''}
                ${product.packaging ? `
                    <div class="packaging">
                        <h3>Packaging</h3>
                        <p>${product.packaging}</p>
                    </div>
                ` : ''}
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="updateQuantity('${id}', -1)">-</button>
                    <span id="quantity-${id}">1</span>
                    <button class="quantity-btn" onclick="updateQuantity('${id}', 1)">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${id}')">Add to Cart</button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Show sweet details (alias for showItemDetails)
function showSweetDetails(id) {
    showItemDetails('sweet', id);
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Cart functionality
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    const existingItem = cart.items.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showToast('Item added to cart!');
}

function removeFromCart(productId) {
    cart.items = cart.items.filter(item => item.id !== productId);
    updateCart();
    showToast('Item removed from cart!');
}

function updateQuantity(productId, quantity) {
    const item = cart.items.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            updateCart();
        }
    }
}

function updateCart() {
    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Update cart modal
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        if (cart.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='images/placeholder.jpg'">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>₹${item.price} x ${item.quantity}</p>
                        <div class="cart-item-actions">
                            <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            <button class="remove-item" onclick="removeFromCart('${item.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-total">₹${item.price * item.quantity}</div>
                </div>
            `).join('');
        }
    }

    // Update totals
    const subtotal = document.getElementById('cartSubtotal');
    const tax = document.getElementById('cartTax');
    const total = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (subtotal) subtotal.textContent = `₹${cart.total}`;
    if (tax) tax.textContent = `₹${(cart.total * 0.18).toFixed(2)}`;
    if (total) total.textContent = `₹${(cart.total * 1.18).toFixed(2)}`;
    if (checkoutBtn) checkoutBtn.disabled = cart.items.length === 0;

    // Save to localStorage using the consistent key
    const cartData = {
        items: cart.items,
        subtotal: cart.total,
        tax: cart.total * 0.18,
        total: cart.total * 1.18
    };
    localStorage.setItem(CART_CONFIG.storageKey, JSON.stringify(cartData));
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.toggle('show');
        if (cartModal.classList.contains('show')) {
            updateCart();
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }
}

// Initialize cart from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }

    // Add click event listener for cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }

    // Close cart modal when clicking outside
    document.addEventListener('click', function(event) {
        const cartModal = document.getElementById('cartModal');
        const cartIcon = document.querySelector('.cart-icon');
        if (cartModal && !cartModal.contains(event.target) && !cartIcon.contains(event.target)) {
            cartModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Close cart modal when clicking close button
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }
}); 

// Add checkout functionality
function initializeCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (Object.keys(cartManager.cart).length === 0) {
                showToast('Your cart is empty!');
                return;
            }

            // Calculate total amount
            const total = Object.values(cartManager.cart).reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);

            // Initialize Razorpay
            const options = {
                key: "rzp_test_YOUR_KEY_HERE", // Replace with your Razorpay key
                amount: total * 100, // Amount in paise
                currency: "INR",
                name: "Bastiramji Mithai Wale",
                description: "Payment for your order",
                handler: function(response) {
                    // Handle successful payment
                    showToast('Payment successful! Order placed.');
                    // Clear cart after successful payment
                    cartManager.cart = {};
                    cartManager.saveCart();
                    cartManager.updateCartUI();
                    cartManager.toggleCart();
                },
                prefill: {
                    name: "Customer Name",
                    email: "customer@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#8B0000"
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        });
    }
} 