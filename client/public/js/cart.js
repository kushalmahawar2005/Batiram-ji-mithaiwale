// Unified cart system
let cart = {
    items: [],
    total: 0
};
const sweetDetails = {
    "kaju-katli": {
      id: "kaju-katli",
      title: "Kaju Katli",
      price: 400,
      image: "images/products/kaju-katli.jpg"
    },
    "rasmalai": {
      id: "rasmalai",
      title: "Rasmalai",
      price: 350,
      image: "images/products/rasmalai.jpg"
    },
    "gulab-jamun": {
      id: "gulab-jamun",
      title: "Gulab Jamun",
      price: 250,
      image: "images/products/gulab-jamun.jpg"
    }
    // Add more if needed
  };
  

// Universal product lookup function
function getProductById(productId) {
    // Convert numeric IDs to strings for consistency
    const id = String(productId);
    
    // Try to find in products array (from sweets.js)
    if (typeof products !== 'undefined') {
        const product = products.find(p => String(p.id) === id);
        if (product) {
            return {
                ...product,
                price: extractPrice(product.price)
            };
        }
    }
    
    // Try to find in allSweets array (from script.js)
    if (typeof allSweets !== 'undefined') {
        const sweet = allSweets.find(s => String(s.id) === id);
        if (sweet) {
            return {
                ...sweet,
                price: extractPrice(sweet.price)
            };
        }
    }
    
    // Try to find in sweetDetails object
    if (typeof sweetDetails !== 'undefined' && sweetDetails[id]) {
        return {
            ...sweetDetails[id],
            price: extractPrice(sweetDetails[id].price)
        };
    }
    
    // Try to find in sweetProducts array
    if (typeof sweetProducts !== 'undefined') {
        const sweet = sweetProducts.find(p => String(p.id) === id);
        if (sweet) {
            return {
                ...sweet,
                price: extractPrice(sweet.price)
            };
        }
    }
    
    console.error('Product not found:', id);
    return null;
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

// Add to cart
function addToCart(productId) {
    try {
        const product = getProductById(productId);
        if (!product) {
            showNotification('Product not found', 'error');
            return;
        }

        // Get quantity from modal if it exists
        const quantityElement = document.getElementById(`quantity-${productId}`);
        const quantity = quantityElement ? parseInt(quantityElement.textContent) : 1;

        // Check if product already exists in cart
        const existingItem = cart.items.find(item => item.id === String(productId));
        
        if (existingItem) {
            // If product exists, increment quantity
            existingItem.quantity += quantity;
        } else {
            // If product doesn't exist, add it with specified quantity
            cart.items.push({
                id: String(productId),
                name: product.title || product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        // Update cart count and show notification
        updateCartDisplay();
        showNotification('Product added to cart!', 'success');

        // Save cart to localStorage
        saveCart();

        // Close modal if it's open
        closeModal('productModal');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding product to cart', 'error');
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart.items = cart.items.filter(item => item.id !== String(productId));
    updateCartDisplay();
    showNotification('Item removed from cart', 'success');
    saveCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.items.find(item => item.id === String(productId));
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
        saveCart();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    if (!cartItems) return;

    // Calculate total
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Update cart items
    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Update total and count
    if (cartTotal) cartTotal.textContent = `₹${cart.total}`;
    if (cartCount) cartCount.textContent = cart.items.reduce((count, item) => count + item.quantity, 0);

    // Add responsive styles if not already in document
    if (!document.getElementById('cart-styles')) {
        const style = document.createElement('style');
        style.id = 'cart-styles';
        style.textContent = `
            .cart-modal {
                display: none;
                position: fixed;
                top: 0;
                right: 0;
                width: 100%;
                max-width: 400px;
                height: 100%;
                background: white;
                box-shadow: -2px 0 5px rgba(0,0,0,0.1);
                z-index: 1000;
                overflow-y: auto;
            }
            .cart-item {
                display: flex;
                gap: 15px;
                padding: 15px;
                border-bottom: 1px solid #eee;
            }
            .cart-item img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 8px;
            }
            .cart-item-details {
                flex: 1;
            }
            .cart-item-quantity {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 10px;
            }
            .quantity-btn {
                padding: 5px 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                cursor: pointer;
            }
            .remove-item {
                color: #ff6b6b;
                border: none;
                background: none;
                cursor: pointer;
            }
            @media (max-width: 768px) {
                .cart-modal {
                    max-width: 100%;
                }
                .cart-item {
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .cart-item img {
                    width: 120px;
                    height: 120px;
                }
                .cart-item-quantity {
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
    if (cartModal.style.display === 'block') {
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

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
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    
    // Add cart modal close handlers
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        // Close when clicking outside
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                toggleCart();
            }
        });

        // Close when clicking close button
        const closeBtn = cartModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', toggleCart);
        }
    }

    // Initialize cart icon click handler
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }

    // Add product modal close handlers
    const productModal = document.getElementById('productModal');
    if (productModal) {
        // Close when clicking outside
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeModal('productModal');
            }
        });
    }
}); 