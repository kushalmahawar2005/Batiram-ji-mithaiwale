// Sample product data with categories and recommendations
const products = [
    {
        id: 1,
        name: "Gulab Jamun",
        description: "Soft, golden brown milk dumplings soaked in sugar syrup",
        price: "₹200/kg",
        image: "images/products/gulab-jamun.jpg",
        category: "traditional",
        priceRange: "low",
        dietary: ["vegetarian"],
        sweetness: "high",
        shelfLife: "3 days",
        recommendedWith: [2, 5], // IDs of recommended products
        occasions: ["festival", "celebration", "gifting"],
        popularity: 95
    },
    {
        id: 2,
        name: "Rasgulla",
        description: "Spongy cottage cheese balls in light sugar syrup",
        price: "₹180/kg",
        image: "images/products/rasgulla.jpg",
        category: "traditional",
        priceRange: "low",
        dietary: ["vegetarian"],
        sweetness: "medium",
        shelfLife: "3 days",
        recommendedWith: [1, 3],
        occasions: ["festival", "celebration"],
        popularity: 90
    },
    {
        id: 3,
        name: "Kaju Katli",
        description: "Diamond-shaped cashew fudge with silver coating",
        price: "₹400/kg",
        image: "images/products/kaju-katli.jpg",
        category: "gift",
        priceRange: "high",
        dietary: ["vegetarian"],
        sweetness: "medium",
        shelfLife: "15 days",
        recommendedWith: [4, 5],
        occasions: ["gifting", "festival"],
        popularity: 85
    },
    {
        id: 4,
        name: "Special Diwali Box",
        description: "Assorted sweets for Diwali celebrations",
        price: "₹800/box",
        image: "images/products/diwali-box.jpg",
        category: "festival",
        priceRange: "high",
        dietary: ["vegetarian"],
        sweetness: "mixed",
        shelfLife: "7 days",
        recommendedWith: [3, 5],
        occasions: ["festival", "gifting"],
        popularity: 88
    },
    {
        id: 5,
        name: "Motichoor Ladoo",
        description: "Tiny pearl-like sweet balls made from gram flour",
        price: "₹250/kg",
        image: "images/products/motichoor-ladoo.jpg",
        category: "traditional",
        priceRange: "medium",
        dietary: ["vegetarian"],
        sweetness: "high",
        shelfLife: "10 days",
        recommendedWith: [1, 2],
        occasions: ["festival", "celebration"],
        popularity: 92
    },
    {
        id: 6,
        name: "Signature Kheer",
        description: "Creamy rice pudding with saffron and dry fruits",
        price: "₹300/kg",
        image: "images/products/kheer.jpg",
        category: "traditional",
        priceRange: "medium",
        dietary: ["vegetarian"],
        sweetness: "medium",
        shelfLife: "2 days",
        recommendedWith: [1, 2],
        occasions: ["festival", "celebration"],
        popularity: 88
    },
    {
        id: 7,
        name: "Premium Dry Fruit Mix",
        description: "Assorted dry fruit sweets with premium ingredients",
        price: "₹600/kg",
        image: "images/products/dry-fruit-mix.jpg",
        category: "gift",
        priceRange: "high",
        dietary: ["vegetarian"],
        sweetness: "medium",
        shelfLife: "20 days",
        recommendedWith: [3, 4],
        occasions: ["gifting", "festival"],
        popularity: 85
    },
    {
        id: 8,
        name: "Special Thali",
        description: "Complete assortment of our best-selling sweets",
        price: "₹1200/box",
        image: "images/products/special-thali.jpg",
        category: "festival",
        priceRange: "high",
        dietary: ["vegetarian"],
        sweetness: "mixed",
        shelfLife: "5 days",
        recommendedWith: [4, 7],
        occasions: ["festival", "gifting"],
        popularity: 90
    }
];

// Shopping cart
let cart = {
    items: [],
    total: 0
};

// User preferences and history
let userPreferences = {
    recentlyViewed: [],
    favoriteCategories: [],
    dietaryPreferences: [],
    sweetnessPreference: null
};

// Sweets Collection Page Functions
let currentPage = 1;
const sweetsPerPage = 12;
let currentView = 'grid';
let allSweets = [];
let filteredSweets = [];

// Initialize sweets page
function initSweetsPage() {
    loadAllSweets();
    initializeFilters();
    initializeViewToggle();
    initializeSearch();
}

// Load all sweets data
async function loadAllSweets() {
    try {
        // This would typically be an API call
        allSweets = [
            {
                id: 1,
                name: "Kaju Katli",
                description: "Diamond-shaped cashew fudge with a silvery coating",
                price: 800,
                weight: "500g",
                category: "dry-fruits",
                image: "images/sweets/kaju-katli.jpg",
                badge: "Bestseller",
                rating: 4.9
            },
            {
                id: 2,
                name: "Gulab Jamun",
                description: "Soft milk-solid balls soaked in rose-scented syrup",
                price: 400,
                weight: "500g",
                category: "milk",
                image: "images/sweets/gulab-jamun.jpg",
                badge: "Popular",
                rating: 4.8
            },
            // Add more sweets here
        ];
        
        filteredSweets = [...allSweets];
        displaySweets();
    } catch (error) {
        console.error('Error loading sweets:', error);
        showNotification('Failed to load sweets', 'error');
    }
}

// Display sweets in grid/list
function displaySweets() {
    const sweetsGrid = document.getElementById('sweetsGrid');
    const start = (currentPage - 1) * sweetsPerPage;
    const end = start + sweetsPerPage;
    const sweetsToShow = filteredSweets.slice(start, end);

    sweetsGrid.innerHTML = sweetsToShow.map(sweet => `
        <div class="sweet-card" data-aos="fade-up">
            <div class="sweet-image">
                <img src="${sweet.image}" alt="${sweet.name}" onerror="this.src='images/placeholder.jpg'">
                ${sweet.badge ? `<span class="sweet-badge">${sweet.badge}</span>` : ''}
            </div>
            <div class="sweet-content">
                <h3>${sweet.name}</h3>
                <p>${sweet.description}</p>
                <div class="sweet-details">
                    <div class="sweet-price">₹${sweet.price}</div>
                    <div class="sweet-weight">${sweet.weight}</div>
                </div>
                <div class="sweet-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${sweet.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="view-details-btn" onclick="showItemDetails('sweet', ${sweet.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    updateLoadMoreButton();
}

// Initialize filters
function initializeFilters() {
    document.getElementById('categoryFilter').addEventListener('change', filterSweets);
    document.getElementById('priceFilter').addEventListener('change', filterSweets);
    document.getElementById('sortFilter').addEventListener('change', filterSweets);
}

// Filter sweets based on selected criteria
function filterSweets() {
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    filteredSweets = allSweets.filter(sweet => {
        if (category !== 'all' && sweet.category !== category) return false;
        
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            if (max) {
                if (sweet.price < min || sweet.price > max) return false;
            } else {
                if (sweet.price < min) return false;
            }
        }
        
        return true;
    });

    // Sort sweets
    filteredSweets.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
                return a.name.localeCompare(b.name);
            default: // 'popular'
                return b.rating - a.rating;
        }
    });

    currentPage = 1;
    displaySweets();
}

// Initialize view toggle
function initializeViewToggle() {
    const gridBtn = document.querySelector('.grid-view');
    const listBtn = document.querySelector('.list-view');
    const sweetsGrid = document.getElementById('sweetsGrid');

    gridBtn.addEventListener('click', () => {
        currentView = 'grid';
        sweetsGrid.classList.remove('list-view');
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });

    listBtn.addEventListener('click', () => {
        currentView = 'list';
        sweetsGrid.classList.add('list-view');
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('sweetSearch');
    let searchTimeout;

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = searchInput.value.toLowerCase();
            filteredSweets = allSweets.filter(sweet => 
                sweet.name.toLowerCase().includes(searchTerm) ||
                sweet.description.toLowerCase().includes(searchTerm)
            );
            currentPage = 1;
            displaySweets();
        }, 300);
    });
}

// Load more sweets
function loadMoreSweets() {
    if (currentPage * sweetsPerPage < filteredSweets.length) {
        currentPage++;
        displaySweets();
    }
}

// Update load more button visibility
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const hasMore = currentPage * sweetsPerPage < filteredSweets.length;
    loadMoreBtn.style.display = hasMore ? 'inline-block' : 'none';
}

// Add item to cart
function addToCart(sweetId) {
    const sweet = allSweets.find(s => s.id === sweetId);
    if (!sweet) return;

    const existingItem = cart.items.find(item => item.id === sweetId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({
            id: sweet.id,
            name: sweet.name,
            price: sweet.price,
            weight: sweet.weight,
            image: sweet.image,
            quantity: 1
        });
    }

    updateCart();
    showNotification('Added to cart', 'success');
}

// Remove item from cart
function removeFromCart(sweetId) {
    cart.items = cart.items.filter(item => item.id !== sweetId);
    updateCart();
    showNotification('Removed from cart', 'success');
}

// Update cart quantity
function updateCartQuantity(sweetId, change) {
    const item = cart.items.find(item => item.id === sweetId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(sweetId);
    } else {
        updateCart();
    }
}

// Update cart display and total
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    if (!cartItems) return;

    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price} × ${item.quantity}</div>
                <div class="cart-item-weight">${item.weight}</div>
            </div>
            <div class="cart-item-actions">
                <button onclick="updateCartQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    cartTotal.textContent = `₹${cart.total}`;
    cartCount.textContent = cart.items.reduce((count, item) => count + item.quantity, 0);

    // Save cart to localStorage
    localStorage.setItem('sweetShopCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('sweetShopCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Initialize checkout process
function initializeCheckout() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const checkoutModal = document.getElementById('checkoutModal');
    const orderSummary = document.getElementById('orderSummary');
    
    orderSummary.innerHTML = `
        <h3>Order Summary</h3>
        ${cart.items.map(item => `
            <div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            </div>
        `).join('')}
        <div class="order-total">
            <strong>Total:</strong>
            <strong>₹${cart.total}</strong>
        </div>
    `;

    checkoutModal.style.display = 'block';
}

// Process checkout
async function processCheckout(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        // This would typically be an API call to process the order
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
        
        // Clear cart after successful checkout
        cart = { items: [], total: 0 };
        updateCart();
        
        // Close checkout modal
        document.getElementById('checkoutModal').style.display = 'none';
        
        showNotification('Order placed successfully!', 'success');
    } catch (error) {
        showNotification('Failed to process order. Please try again.', 'error');
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.sweets-collection')) {
        initSweetsPage();
        loadCart();
    }
    // ... existing initialization code ...
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const productGrid = document.querySelector('.product-grid');
    const cartCount = document.querySelector('.cart-count');
    const contactForm = document.querySelector('.contact-form');
    const cartModal = document.getElementById('cartModal');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.querySelector('.search-bar input');
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialDots = document.querySelector('.testimonial-dots');
    const newsletterForm = document.querySelector('.newsletter-form');

    // Initialize features only if elements exist
    if (productGrid) {
        loadProducts();
    }

    if (cartCount) {
        updateCartCount();
    }

    if (testimonialSlider && testimonialDots) {
        initTestimonials();
    }

    // Add event listeners with null checks
    if (categoryFilter) {
        categoryFilter.addEventListener('change', loadProducts);
    }

    if (priceFilter) {
        priceFilter.addEventListener('change', loadProducts);
    }

    if (searchInput) {
        searchInput.addEventListener('input', loadProducts);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                this.reset();
                
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.');
                
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }

    // Initialize scroll animations
    initScrollAnimations();

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartCount();
        } catch (error) {
            console.error('Error loading cart:', error);
            cart = [];
        }
    }

    // Add event listener for checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            window.location.href = 'payment.html';
        });
    }

    // Initialize payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            const method = option.getAttribute('data-method');
            selectPaymentMethod(method);
        });
    });

    // Close payment modal when clicking outside
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                togglePayment();
            }
        });
    }

    // Initialize Razorpay
    if (typeof Razorpay !== 'undefined') {
        window.Razorpay = Razorpay;
    }

    // Sweet Details Data
    const sweetDetails = {
        'kaju-katli': {
            title: 'Kaju Katli',
            description: 'Delicious diamond-shaped sweet made from cashew nuts and sugar, with a smooth, silvery finish. Each piece is carefully crafted to melt in your mouth.',
            price: 800,
            quantity: '250g',
            image: 'images/signature/kaju-katli.jpg',
            shelfLife: '7 days shelf life',
            rating: '4.9/5',
            packaging: 'Premium gift box available',
            ingredients: 'Cashew nuts, Sugar, Cardamom, Pure ghee',
            features: [
                'Made with premium cashews',
                'No artificial flavors',
                'Traditional recipe',
                'Perfect gift option'
            ]
        },
        'rasmalai': {
            title: 'Rasmalai',
            description: 'Soft, spongy cottage cheese dumplings soaked in creamy, cardamom-flavored milk. Garnished with pistachios and saffron.',
            price: 600,
            quantity: '6 pieces',
            image: 'images/signature/rasmalai.jpg',
            shelfLife: '5 days shelf life',
            rating: '4.8/5',
            packaging: 'Special container with cooling gel',
            ingredients: 'Cottage cheese, Milk, Sugar, Cardamom, Saffron, Pistachios',
            features: [
                'Fresh daily preparation',
                'Rich in protein',
                'Authentic taste',
                'Premium packaging'
            ]
        },
        'gulab-jamun': {
            title: 'Gulab Jamun',
            description: 'Soft, melt-in-mouth milk dough balls deep fried and soaked in aromatic sugar syrup infused with cardamom and rose water.',
            price: 400,
            quantity: '12 pieces',
            image: 'images/signature/gulab-jamun.jpg',
            shelfLife: '6 days shelf life',
            rating: '4.7/5',
            packaging: 'Vacuum sealed container',
            ingredients: 'Milk powder, All-purpose flour, Sugar, Cardamom, Rose water',
            features: [
                'Perfectly sweetened',
                'Soft texture',
                'Rose flavored',
                'Ready to serve'
            ]
        },
        'soan-papdi': {
            title: 'Soan Papdi',
            description: 'Flaky, melt-in-mouth sweet made with gram flour, ghee, and cardamom. A perfect blend of crispy and soft textures.',
            price: 350,
            quantity: '500g',
            image: 'images/signature/soan-papdi.jpg',
            shelfLife: '15 days shelf life',
            rating: '4.8/5',
            packaging: 'Traditional box packaging',
            ingredients: 'Gram flour, Sugar, Pure ghee, Cardamom, Almonds',
            features: [
                'Flaky texture',
                'Long shelf life',
                'Perfect for sharing',
                'Travel-friendly'
            ]
        },
        'motichoor-ladoo': {
            title: 'Motichoor Ladoo',
            description: 'Tiny gram flour pearls combined with ghee and sugar syrup, shaped into perfect spheres. Garnished with pistachios.',
            price: 600,
            quantity: '12 pieces',
            image: 'images/signature/motichoor-ladoo.jpg',
            shelfLife: '8 days shelf life',
            rating: '4.9/5',
            packaging: 'Premium gift box',
            ingredients: 'Gram flour, Sugar, Pure ghee, Cardamom, Pistachios',
            features: [
                'Melt in mouth',
                'Premium quality',
                'Festive favorite',
                'Gift packaging'
            ]
        },
        'rajbhog': {
            title: 'Rajbhog',
            description: 'Large, stuffed cottage cheese dumplings in saffron-flavored milk. Filled with dry fruits and aromatic spices.',
            price: 700,
            quantity: '6 pieces',
            image: 'images/signature/rajbhog.jpg',
            shelfLife: '4 days shelf life',
            rating: '4.8/5',
            packaging: 'Special cooling container',
            ingredients: 'Cottage cheese, Milk, Sugar, Saffron, Mixed dry fruits, Cardamom',
            features: [
                'Premium ingredients',
                'Rich stuffing',
                'Royal taste',
                'Special packaging'
            ]
        }
    };

    // Offer Details Data
    const offerDetails = {
        diwali: {
            title: "Diwali Special Box",
            image: "images/offers/diwali-special.jpg",
            description: "Celebrate Diwali with our premium selection of traditional sweets. This special box includes an assortment of our finest mithai, perfect for gifting and sharing with loved ones.",
            originalPrice: "₹2,499",
            discountedPrice: "₹1,999",
            savings: "Save ₹500 (20% OFF)",
            features: [
                { icon: "fas fa-gift", text: "Premium Gift Packaging" },
                { icon: "fas fa-box", text: "12 Varieties of Sweets" },
                { icon: "fas fa-truck", text: "Free Express Delivery" },
                { icon: "fas fa-clock", text: "7 Days Shelf Life" }
            ],
            validity: "Valid till 31st October 2024"
        },
        wedding: {
            title: "Wedding Collection",
            image: "images/offers/wedding-special.jpg",
            description: "Make your special day even sweeter with our exclusive wedding collection. Perfect for pre-wedding celebrations, ceremonies, and guest favors.",
            originalPrice: "₹5,999",
            discountedPrice: "₹4,999",
            savings: "Save ₹1,000 (15% OFF)",
            features: [
                { icon: "fas fa-users", text: "Serves 100+ Guests" },
                { icon: "fas fa-box", text: "15 Premium Varieties" },
                { icon: "fas fa-truck", text: "Free Priority Delivery" },
                { icon: "fas fa-calendar", text: "Advance Booking Available" }
            ],
            validity: "Book 15 days in advance"
        },
        festival: {
            title: "Festival Special Box",
            image: "images/offers/festival-special.jpg",
            description: "A curated selection of festival favorites, perfect for any celebration. Includes our most popular sweet varieties in a beautiful presentation box.",
            originalPrice: "₹1,999",
            discountedPrice: "₹1,499",
            savings: "Save ₹500 (25% OFF)",
            features: [
                { icon: "fas fa-gift", text: "Elegant Gift Box" },
                { icon: "fas fa-box", text: "8 Classic Varieties" },
                { icon: "fas fa-truck", text: "Free Delivery" },
                { icon: "fas fa-clock", text: "6 Days Shelf Life" }
            ],
            validity: "Limited time offer"
        }
    };

    // Modal Elements
    const sweetModal = document.getElementById('sweetModal');
    const offerModal = document.getElementById('offerModal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Close modal function
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Add click event listeners to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(sweetModal);
            closeModal(offerModal);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === sweetModal) closeModal(sweetModal);
        if (e.target === offerModal) closeModal(offerModal);
    });

    // Handle sweet details view
    document.querySelectorAll('.view-details-btn[data-sweet]').forEach(button => {
        button.addEventListener('click', () => {
            const sweetId = button.getAttribute('data-sweet');
            showSweetDetails(sweetId);
        });
    });

    // Function to show sweet details
    function showSweetDetails(sweetId) {
        const sweet = sweetDetails[sweetId];
        if (!sweet) return;

        const modalBody = document.getElementById('sweetModal').querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="sweet-details">
                <div class="sweet-image">
                    <img src="${sweet.image}" alt="${sweet.title}">
                </div>
                <div class="sweet-info">
                    <h2>${sweet.title}</h2>
                    <p class="description">${sweet.description}</p>
                    <div class="price-rating">
                        <span class="price">₹${sweet.price}</span>
                        <span class="rating"><i class="fas fa-star"></i> ${sweet.rating}</span>
                    </div>
                    <div class="details-section">
                        <h3>Ingredients</h3>
                        <p>${sweet.ingredients}</p>
                    </div>
                    <div class="details-section">
                        <h3>Features</h3>
                        <ul>
                            ${sweet.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="details-section">
                        <div class="shelf-life">
                            <i class="fas fa-clock"></i> ${sweet.shelfLife}
                        </div>
                        <div class="packaging">
                            <i class="fas fa-box"></i> ${sweet.packaging}
                        </div>
                    </div>
                    <div class="quantity-selector">
                        <button onclick="decrementQuantity()" class="quantity-btn">-</button>
                        <input type="number" id="sweetQuantity" value="1" min="1" max="20">
                        <button onclick="incrementQuantity()" class="quantity-btn">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${sweetId}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;

        // Show modal
        const modal = document.getElementById('sweetModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Quick View functionality
    document.querySelectorAll('.signature-card').forEach(card => {
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Quick View';
        
        card.querySelector('.signature-image').appendChild(quickViewBtn);
        
        quickViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const sweetId = card.querySelector('.view-details-btn').getAttribute('data-sweet');
            showQuickView(sweetId);
        });
    });

    function showQuickView(sweetId) {
        const sweet = sweetDetails[sweetId];
        if (!sweet) return;

        const quickViewModal = document.createElement('div');
        quickViewModal.className = 'quick-view-modal';
        quickViewModal.innerHTML = `
            <div class="quick-view-content">
                <button class="close-quick-view">&times;</button>
                <div class="quick-view-grid">
                    <div class="quick-view-image">
                        <img src="${sweet.image}" alt="${sweet.title}">
                    </div>
                    <div class="quick-view-details">
                        <h2>${sweet.title}</h2>
                        <p class="price">₹${sweet.price}</p>
                        <p class="description">${sweet.description}</p>
                        <div class="product-info">
                            <p><strong>Shelf Life:</strong> ${sweet.shelfLife}</p>
                            <p><strong>Rating:</strong> ${sweet.rating}</p>
                            <p><strong>Quantity:</strong> ${sweet.quantity}</p>
                        </div>
                        <button class="view-details-btn" onclick="showSweetDetails('${sweetId}')">
                            View Full Details
                        </button>
                        <button class="add-to-cart-btn" onclick="addToCart('${sweetId}')">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(quickViewModal);

        // Close quick view when clicking outside or on close button
        quickViewModal.addEventListener('click', (e) => {
            if (e.target === quickViewModal || e.target.classList.contains('close-quick-view')) {
                quickViewModal.remove();
            }
        });
    }

    // Close modal function
    function closeSweetDetails() {
        const modal = document.getElementById('sweetModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('sweetModal');
        if (e.target === modal) {
            closeSweetDetails();
        }
    });

    // Close modal when clicking close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            closeSweetDetails();
        });
    });

    // Handle offer details view
    document.querySelectorAll('.view-details-btn[data-offer]').forEach(button => {
        button.addEventListener('click', () => {
            const offerId = button.getAttribute('data-offer');
            const offer = offerDetails[offerId];
            
            if (offer) {
                const modalBody = offerModal.querySelector('.modal-body');
                modalBody.innerHTML = `
                    <div class="offer-details">
                        <div class="offer-image">
                            <img src="images/offers/${offerId}.jpg" alt="${offer.title}">
                        </div>
                        <div class="offer-info">
                            <h2>${offer.title}</h2>
                            <p class="description">${offer.description}</p>
                            <div class="price-section">
                                <div class="original-price">${offer.originalPrice}</div>
                                <div class="discounted-price">${offer.discountedPrice}</div>
                                <div class="savings">Save ${offer.savings}</div>
                            </div>
                            <div class="details-section">
                                <h3>Features</h3>
                                <ul>
                                    ${offer.features.map(feature => `<li><i class="fas fa-check"></i> ${feature.text}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="details-section">
                                <h3>Validity</h3>
                                <p>${offer.validity}</p>
                            </div>
                            <button class="add-to-cart-btn">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                offerModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Function to show sweet details
    function showSweetDetails(sweetId) {
        const sweet = sweetDetails[sweetId];
        if (!sweet) return;

        const modalBody = document.getElementById('sweetModal').querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="sweet-details">
                <div class="sweet-image">
                    <img src="${sweet.image}" alt="${sweet.title}">
                </div>
                <div class="sweet-info">
                    <h2>${sweet.title}</h2>
                    <p class="description">${sweet.description}</p>
                    <div class="price-rating">
                        <span class="price">₹${sweet.price}</span>
                        <span class="rating"><i class="fas fa-star"></i> ${sweet.rating}</span>
                    </div>
                    <div class="details-section">
                        <h3>Ingredients</h3>
                        <p>${sweet.ingredients}</p>
                    </div>
                    <div class="details-section">
                        <h3>Features</h3>
                        <ul>
                            ${sweet.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="details-section">
                        <div class="shelf-life">
                            <i class="fas fa-clock"></i> ${sweet.shelfLife}
                        </div>
                        <div class="packaging">
                            <i class="fas fa-box"></i> ${sweet.packaging}
                        </div>
                    </div>
                    <div class="quantity-selector">
                        <button onclick="decrementQuantity()" class="quantity-btn">-</button>
                        <input type="number" id="sweetQuantity" value="1" min="1" max="20">
                        <button onclick="incrementQuantity()" class="quantity-btn">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${sweetId}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;

        // Show modal
        const modal = document.getElementById('sweetModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Quantity management functions
    function incrementQuantity() {
        const quantityInput = document.getElementById('sweetQuantity');
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 20) {
            quantityInput.value = currentValue + 1;
        }
    }

    function decrementQuantity() {
        const quantityInput = document.getElementById('sweetQuantity');
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }

    // Add to cart function
    function addToCart() {
        const sweetTitle = document.getElementById('modalSweetTitle').textContent;
        const quantity = document.getElementById('sweetQuantity').value;
        const price = document.getElementById('modalSweetPrice').textContent;
        
        // Add to cart logic here
        console.log(`Added ${quantity} ${sweetTitle} to cart at ${price} each`);
        
        // Close modal
        closeSweetDetails();
        
        // Show success message
        alert(`${quantity} ${sweetTitle} added to cart successfully!`);
    }

    // Event listener for clicking outside modal
    window.onclick = function(event) {
        const modal = document.getElementById('sweetModal');
        if (event.target == modal) {
            closeSweetDetails();
        }
    }

    // Add event listeners to all view details buttons
    document.addEventListener('DOMContentLoaded', function() {
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sweetId = this.getAttribute('data-sweet');
                showSweetDetails(sweetId);
            });
        });
    });

    // Namkeen Category Filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const namkeenCards = document.querySelectorAll('.namkeen-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            // Show/hide cards based on category
            namkeenCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    // Add animation
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add to Cart functionality for Namkeen items
    const addToCartButtons = document.querySelectorAll('.add-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.namkeen-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            
            // Add item to cart (use your existing cart functionality)
            addItemToCart({
                name: name,
                price: price,
                quantity: 1
            });
            
            // Show notification
            showNotification(`Added ${name} to cart!`);
        });
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Add this CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #e65c00;
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            animation: slideIn 0.3s ease;
            z-index: 1000;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);

    // Namkeen Details Data
    const namkeenDetails = {
        'dal-moth': {
            title: 'Dal Moth Special',
            description: 'A perfect blend of crispy lentils, peanuts, and aromatic spices. Our Dal Moth is carefully crafted using traditional recipes to give you the authentic taste of Indian savories.',
            price: 180,
            quantity: '500g',
            image: 'images/namkeen/dal-moth.jpg',
            spiceLevel: 'Medium Spicy',
            rating: '4.8/5',
            packaging: 'Airtight container',
            ingredients: 'Yellow Moong Dal, Peanuts, Cashews, Raisins, Red Chili, Black Pepper, Salt, Vegetable Oil',
            nutritionalInfo: {
                servingSize: '100g',
                calories: '520 kcal',
                protein: '20g',
                carbohydrates: '52g',
                fat: '28g',
                fiber: '4g'
            }
        },
        'aloo-bhujia': {
            title: 'Aloo Bhujia',
            description: 'Crunchy and flavorful potato noodles seasoned with traditional spices. A perfect tea-time snack that brings the authentic taste of Indian street food to your home.',
            price: 160,
            quantity: '500g',
            image: 'images/namkeen/aloo-bhujia.jpg',
            spiceLevel: 'Spicy',
            rating: '4.7/5',
            packaging: 'Resealable pack',
            ingredients: 'Potato, Gram Flour, Red Chili Powder, Black Pepper, Cumin, Salt, Vegetable Oil',
            nutritionalInfo: {
                servingSize: '100g',
                calories: '480 kcal',
                protein: '12g',
                carbohydrates: '58g',
                fat: '24g',
                fiber: '3g'
            }
        },
        'khatta-meetha': {
            title: 'Khatta Meetha',
            description: 'A delightful mix of sweet and tangy flavors, featuring crispy puffed rice, nuts, and dried fruits. Perfect for those who enjoy a balance of tastes.',
            price: 200,
            quantity: '500g',
            image: 'images/namkeen/khatta-meetha.jpg',
            spiceLevel: 'Mild',
            rating: '4.9/5',
            packaging: 'Premium box',
            ingredients: 'Puffed Rice, Peanuts, Cashews, Raisins, Green Mango Powder, Black Salt, Sugar, Vegetable Oil',
            nutritionalInfo: {
                servingSize: '100g',
                calories: '450 kcal',
                protein: '10g',
                carbohydrates: '62g',
                fat: '22g',
                fiber: '2g'
            }
        },
        'masala-mathri': {
            title: 'Masala Mathri',
            description: 'Traditional spiced crackers made with premium flour and aromatic spices. Each mathri is handcrafted to ensure perfect texture and taste.',
            price: 220,
            quantity: '500g',
            image: 'images/namkeen/masala-mathri.jpg',
            spiceLevel: 'Medium',
            rating: '4.8/5',
            packaging: 'Traditional jar',
            ingredients: 'Wheat Flour, Semolina, Carom Seeds, Black Pepper, Cumin, Salt, Ghee',
            nutritionalInfo: {
                servingSize: '100g',
                calories: '490 kcal',
                protein: '8g',
                carbohydrates: '56g',
                fat: '26g',
                fiber: '2g'
            }
        }
    };

    // Function to show namkeen details
    function showNamkeenDetails(namkeenId) {
        const namkeen = namkeenDetails[namkeenId];
        if (!namkeen) return;

        // Update modal content
        document.getElementById('modalNamkeenImage').src = namkeen.image;
        document.getElementById('modalNamkeenTitle').textContent = namkeen.title;
        document.getElementById('modalNamkeenDescription').textContent = namkeen.description;
        document.getElementById('modalNamkeenPrice').textContent = `₹${namkeen.price}`;
        document.getElementById('modalNamkeenQuantity').textContent = namkeen.quantity;
        document.getElementById('modalSpiceLevel').textContent = namkeen.spiceLevel;
        document.getElementById('modalRating').textContent = namkeen.rating;
        document.getElementById('modalPackaging').textContent = namkeen.packaging;
        document.getElementById('modalIngredients').textContent = namkeen.ingredients;

        // Update nutritional information
        const nutritionalInfo = namkeen.nutritionalInfo;
        document.getElementById('modalNutritionalInfo').innerHTML = `
            <div class="nutrition-grid">
                <div class="nutrition-item">
                    <span class="label">Serving Size:</span>
                    <span class="value">${nutritionalInfo.servingSize}</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Calories:</span>
                    <span class="value">${nutritionalInfo.calories}</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Protein:</span>
                    <span class="value">${nutritionalInfo.protein}</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Carbohydrates:</span>
                    <span class="value">${nutritionalInfo.carbohydrates}</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Fat:</span>
                    <span class="value">${nutritionalInfo.fat}</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Fiber:</span>
                    <span class="value">${nutritionalInfo.fiber}</span>
                </div>
            </div>
        `;

        // Reset quantity
        document.getElementById('namkeenQuantity').value = 1;

        // Show modal
        document.getElementById('namkeenModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Function to close namkeen details modal
    function closeNamkeenDetails() {
        document.getElementById('namkeenModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Add event listeners for namkeen view details buttons
    document.addEventListener('DOMContentLoaded', function() {
        // Existing event listeners...

        // Add namkeen view details listeners
        document.querySelectorAll('.view-details-btn[data-namkeen]').forEach(button => {
            button.addEventListener('click', function() {
                const namkeenId = this.getAttribute('data-namkeen');
                showNamkeenDetails(namkeenId);
            });
        });

        // Close namkeen modal when clicking outside
        const namkeenModal = document.getElementById('namkeenModal');
        if (namkeenModal) {
            window.addEventListener('click', (e) => {
                if (e.target === namkeenModal) {
                    closeNamkeenDetails();
                }
            });
        }
    });

    // Memory Slider functionality
    function initMemorySlider() {
        const slider = document.querySelector('.memories-slider');
        const slides = document.querySelectorAll('.memory-slide');
        const dots = document.querySelectorAll('.timeline-dot');
        const prevBtn = document.querySelector('.memory-nav.prev');
        const nextBtn = document.querySelector('.memory-nav.next');
        let currentSlide = 0;
        let autoSlideInterval;

        function goToSlide(index) {
            // Remove active class from current slide and dot
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            // Update current slide index
            currentSlide = index;
            
            // Handle wrap-around
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            
            // Add active class to new slide and dot
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Event Listeners
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        // Add click events to timeline dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });

        // Pause auto-slide on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        // Start auto-sliding
        startAutoSlide();
    }

    // Initialize memory slider when DOM is loaded
    initMemorySlider();

    // Sweet Box Modal Functionality
    function initBoxModals() {
        const boxes = document.querySelectorAll('.box-card');
        const modal = document.querySelector('.box-modal');
        const modalContent = modal.querySelector('.modal-content');

        boxes.forEach(box => {
            const viewBtn = box.querySelector('.view-box-btn');
            viewBtn.addEventListener('click', () => {
                const boxData = {
                    title: box.querySelector('h3').textContent,
                    description: box.querySelector('p').textContent,
                    price: box.querySelector('.box-price').textContent,
                    weight: box.querySelector('.box-weight').textContent,
                    image: box.querySelector('img').src,
                    features: Array.from(box.querySelectorAll('.box-features span')).map(span => span.textContent)
                };
                
                showBoxModal(boxData);
            });
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBoxModal();
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeBoxModal();
            }
        });
    }

    function showBoxModal(boxData) {
        const modal = document.querySelector('.box-modal');
        const content = modal.querySelector('.box-details-content');
        
        content.innerHTML = `
            <div class="box-image-large">
                <img src="${boxData.image}" alt="${boxData.title}">
            </div>
            <div class="box-info">
                <h2>${boxData.title}</h2>
                <p>${boxData.description}</p>
                <div class="box-details">
                    <div class="box-price">${boxData.price}</div>
                    <div class="box-weight">${boxData.weight}</div>
                </div>
                <div class="box-contents">
                    <h3>Features</h3>
                    <div class="box-features-list">
                        ${boxData.features.map(feature => `
                            <span><i class="fas fa-check"></i>${feature}</span>
                        `).join('')}
                    </div>
                </div>
                <button class="add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeBoxModal() {
        const modal = document.querySelector('.box-modal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Initialize all functionalities when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initBoxModals();
        // ... other init functions ...
    });
});

// Initialize scroll animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                animateChildElements(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
}

// Animate child elements
function animateChildElements(section) {
    const headings = section.querySelectorAll('h2');
    const subtitles = section.querySelectorAll('.subtitle');
    const cards = section.querySelectorAll('.memory-card, .box-card');
    
    headings.forEach((heading, index) => {
        heading.style.transitionDelay = `${index * 0.2}s`;
        heading.style.transform = 'translateY(0)';
    });
    
    subtitles.forEach((subtitle, index) => {
        subtitle.style.transitionDelay = `${index * 0.2 + 0.2}s`;
        subtitle.style.transform = 'translateY(0)';
    });
    
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1 + 0.4}s`;
        card.style.transform = 'translateY(0)';
    });
}

// Testimonials data
const testimonials = [
    {
        text: "The best sweets in town! The quality and taste are consistently amazing.",
        author: "Nishtha Singh",
        role: "Regular Customer",
        image: "images/costomers/nishtha.jpg"
    },
    {
        text: "Their festival special boxes are perfect for gifting. Always fresh and beautifully packed.",
        author: "Vasudev Joshi",
        role: "Festival Customer",
        image: "images/costomers/vasu.jpg"
    },
    {
        text: "The traditional sweets taste exactly like my grandmother used to make. Authentic and delicious!",
        author: "Akshat Rathore",
        role: "Traditional Sweet Lover",
        image: "images/costomers/akshat.jpg"
    }
];

// Load products with error handling
function loadProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    try {
        let filteredProducts = [...products];
        
        // Apply filters
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const searchInput = document.querySelector('.search-bar input');

        if (categoryFilter?.value !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === categoryFilter.value
            );
        }
        
        if (priceFilter?.value !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.priceRange === priceFilter.value
            );
        }
        
        if (searchInput?.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        // Display products
        productGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="image-overlay">
                        <button class="quick-view-btn" onclick="showQuickView(${product.id})">
                            Quick View
                        </button>
                    </div>
                </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price}</p>
                <div class="product-details">
                    <span class="shelf-life">Shelf Life: ${product.shelfLife}</span>
                    <span class="sweetness">Sweetness: ${product.sweetness}</span>
                </div>
                <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
            </div>
        `).join('');

        // Display recommendations if no filters are active
        if ((!categoryFilter || categoryFilter.value === 'all') && 
            (!priceFilter || priceFilter.value === 'all') && 
            (!searchInput || !searchInput.value)) {
            const recommendations = getPersonalizedRecommendations();
            if (recommendations.length > 0) {
                const recommendationsSection = document.createElement('div');
                recommendationsSection.className = 'recommendations-section';
                recommendationsSection.innerHTML = `
                    <h3>Recommended for You</h3>
                    <div class="recommendations-grid">
                        ${recommendations.map(product => `
                            <div class="recommendation-card">
                                <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                                <h4>${product.name}</h4>
                                <p class="price">${product.price}</p>
                                <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
                            </div>
                        `).join('')}
                    </div>
                `;
                productGrid.parentNode.insertBefore(recommendationsSection, productGrid.nextSibling);
            }
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error loading products. Please try again later.');
    }
}

// Update cart count with error handling
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Show notification with error handling
function showNotification(message, type = 'info') {
    try {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Cart functionality
function toggleCart() {
    cartModal.classList.toggle('active');
    if (cartModal.classList.contains('active')) {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '₹0';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
        </div>
    `).join('');

    // Calculate total based on actual prices and quantities
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total}`;
}

function updateQuantity(index, change) {
    try {
        if (index < 0 || index >= cart.length) return;

        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update display
        updateCartCount();
        updateCartDisplay();
        
        showNotification('Cart updated!', 'success');
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification('Error updating quantity', 'error');
    }
}

// Testimonials slider
function initTestimonials() {
    try {
        let currentSlide = 0;
        const testimonialSlider = document.querySelector('.testimonial-slider');
        const testimonialDots = document.querySelector('.testimonial-dots');
        
        if (!testimonialSlider || !testimonialDots) return;

        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.onclick = () => goToSlide(index);
            testimonialDots.appendChild(dot);
        });

        function goToSlide(index) {
            currentSlide = index;
            updateTestimonials();
        }

        function updateTestimonials() {
            testimonialSlider.innerHTML = `
                <div class="testimonial-card">
                    <div class="testimonial-content">
                        <i class="fas fa-quote-left"></i>
                        <p>"${testimonials[currentSlide].text}"</p>
                        <div class="testimonial-author">
                            <img src="${testimonials[currentSlide].image}" alt="${testimonials[currentSlide].author}">
                            <div>
                                <h4>${testimonials[currentSlide].author}</h4>
                                <p>${testimonials[currentSlide].role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Update dots
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        // Auto slide
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            updateTestimonials();
        }, 5000);

    } catch (error) {
        console.error('Error initializing testimonials:', error);
    }
}

// Newsletter form
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('Thank you for subscribing to our newsletter!');
    this.reset();
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    if (cartModal.classList.contains('active') && 
        !cartModal.contains(e.target) && 
        !e.target.closest('.cart-icon')) {
        toggleCart();
    }
});

// Add to recently viewed with error handling
function addToRecentlyViewed(productId) {
    try {
        const product = products.find(p => p.id === productId);
        if (product) {
            userPreferences.recentlyViewed = [
                productId,
                ...userPreferences.recentlyViewed.filter(id => id !== productId)
            ].slice(0, 5);
        }
    } catch (error) {
        console.error('Error adding to recently viewed:', error);
    }
}

// Get personalized recommendations
function getPersonalizedRecommendations(currentProductId = null) {
    let recommendations = [];
    
    // Get recommendations based on current product
    if (currentProductId) {
        const currentProduct = products.find(p => p.id === currentProductId);
        if (currentProduct && currentProduct.recommendedWith) {
            recommendations = currentProduct.recommendedWith
                .map(id => products.find(p => p.id === id))
                .filter(Boolean);
        }
    }
    
    // Add recommendations based on user preferences
    if (userPreferences.favoriteCategories.length > 0) {
        const categoryBased = products
            .filter(p => userPreferences.favoriteCategories.includes(p.category))
            .filter(p => !currentProductId || p.id !== currentProductId)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 3);
        recommendations = [...recommendations, ...categoryBased];
    }
    
    // Add recommendations based on recently viewed
    if (userPreferences.recentlyViewed.length > 0) {
        const recentlyViewedBased = userPreferences.recentlyViewed
            .map(id => products.find(p => p.id === id))
            .filter(Boolean)
            .flatMap(p => p.recommendedWith)
            .map(id => products.find(p => p.id === id))
            .filter(p => p && (!currentProductId || p.id !== currentProductId))
            .slice(0, 3);
        recommendations = [...recommendations, ...recentlyViewedBased];
    }
    
    // Remove duplicates and limit to 5 items
    return [...new Set(recommendations.map(p => p.id))]
        .map(id => recommendations.find(p => p.id === id))
        .slice(0, 5);
}

// Quick View functionality
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'quick-view-modal';
    quickViewModal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view">&times;</button>
            <div class="quick-view-grid">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <p class="price">${product.price}</p>
                    <p class="description">${product.description}</p>
                    <div class="product-info">
                        <p><strong>Shelf Life:</strong> ${product.shelfLife}</p>
                        <p><strong>Sweetness Level:</strong> ${product.sweetness}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Dietary:</strong> ${product.dietary.join(', ')}</p>
                    </div>
                    <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(quickViewModal);

    // Close quick view when clicking outside or on close button
    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal || e.target.classList.contains('close-quick-view')) {
            quickViewModal.remove();
        }
    });
}

// Timeline Animation
function handleTimelineAnimation() {
    const timeline = document.querySelector('.memories-timeline');
    if (!timeline) return; // Exit if timeline doesn't exist

    const timelinePosition = timeline.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (timelinePosition < windowHeight * 0.8) {
        timeline.classList.add('animate');
        
        // Add active class to timeline dots based on scroll position
        const memoryCards = document.querySelectorAll('.memory-card');
        const timelineDots = document.querySelectorAll('.timeline-dot');
        
        memoryCards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            if (cardPosition < windowHeight * 0.6) {
                timelineDots[index]?.classList.add('active');
            } else {
                timelineDots[index]?.classList.remove('active');
            }
        });
    }
}

// Get directions function
function getDirections(branch) {
    const addresses = {
        main: "27 Mill Chorya, Beawer Road City Center, India",
        new: " BMW, Sabji mandi road, Tikam choraha, Gulabpura(Rajasthan)."
    };
    
    const address = addresses[branch];
    if (address) {
        const encodedAddress = encodeURIComponent(address);
        const mapsUrl = `https://maps.app.goo.gl/BGkQYHmVhPumq2xj6`;
        window.open(mapsUrl, '_blank');
    } else {
        showNotification('Location information not available');
    }
}

// Payment Processing Functions
function initializePayment(amount, orderId) {
    const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual Razorpay key
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Bastiramji Mithai Wale",
        description: "Sweet Purchase",
        order_id: orderId,
        handler: function(response) {
            handlePaymentSuccess(response);
        },
        prefill: {
            name: document.getElementById('cardName')?.value || '',
            email: document.getElementById('email')?.value || '',
            contact: document.getElementById('phone')?.value || ''
        },
        theme: {
            color: "#D4AF37"
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

function handlePaymentSuccess(response) {
    // Here you would typically send this to your backend to verify the payment
    showNotification('Payment successful! Thank you for your purchase.', 'success');
    resetCart();
    togglePayment();
}

// Payment Modal Functions
function togglePayment() {
    const paymentModal = document.getElementById('paymentModal');
    if (!paymentModal) return;

    paymentModal.classList.toggle('active');
    if (paymentModal.classList.contains('active')) {
        updatePaymentSummary();
    }
}

function updatePaymentSummary() {
    const summaryItems = document.querySelector('.payment-summary-items');
    const totalAmount = document.querySelector('.payment-total');
    
    if (!summaryItems || !totalAmount) return;
    
    if (cart.length === 0) {
        summaryItems.innerHTML = '<p>Your cart is empty</p>';
        totalAmount.textContent = '₹0';
        return;
    }

    summaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `₹${total}`;
}

function selectPaymentMethod(method) {
    // Hide all payment forms
    document.querySelectorAll('.payment-form').forEach(form => {
        form.style.display = 'none';
    });

    // Show selected payment form
    const selectedForm = document.getElementById(`${method}Form`);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }

    // Update active state of payment options
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector(`.payment-option[data-method="${method}"]`).classList.add('active');
}

// Update payment form submission handlers
document.getElementById('cardForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        const totalAmount = calculateTotalAmount();
        
        // For testing, we'll use a mock order ID
        const mockOrderId = 'order_' + Date.now();
        
        // Initialize Razorpay payment
        initializePayment(totalAmount, mockOrderId);
    } catch (error) {
        showNotification('Payment failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
    }
});

document.getElementById('upiForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        const totalAmount = calculateTotalAmount();
        const mockOrderId = 'order_' + Date.now();
        initializePayment(totalAmount, mockOrderId);
    } catch (error) {
        showNotification('Payment failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-mobile-alt"></i> Pay with UPI';
    }
});

// Helper function to calculate total amount
function calculateTotalAmount() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to create order on backend
async function createOrder(amount) {
    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount,
                currency: 'INR'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

// Update COD payment handler
function handleCODPayment() {
    const totalAmount = calculateTotalAmount();
    
    // Here you would typically send this to your backend to create a COD order
    showNotification('Order placed successfully! You will pay ₹' + totalAmount + ' on delivery.', 'success');
    resetCart();
    togglePayment();
}

// Reset cart function
function resetCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    updateCartDisplay();
}

// Add to cart functionality
function addToCart(productId) {
    try {
        const product = products.find(p => p.id === productId);
        if (!product) {
            showNotification('Product not found', 'error');
            return;
        }

        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            // If product exists, increment quantity
            existingItem.quantity += 1;
        } else {
            // If product doesn't exist, add it with quantity 1
            cart.push({
                id: product.id,
                name: product.name,
                price: parseInt(product.price.replace(/[^0-9]/g, '')),
                image: product.image,
                quantity: 1
            });
        }

        // Update cart count and show notification
        updateCartCount();
        showNotification('Product added to cart!', 'success');

        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Error adding product to cart', 'error');
    }
}

// Function to show offer details
function showOfferDetails(offerId) {
    const offer = offerDetails[offerId];
    if (!offer) return;

    // Update modal content
    document.getElementById('modalOfferImage').src = offer.image;
    document.getElementById('modalOfferTitle').textContent = offer.title;
    document.getElementById('modalOfferDescription').textContent = offer.description;
    document.getElementById('modalOriginalPrice').textContent = offer.originalPrice;
    document.getElementById('modalDiscountedPrice').textContent = offer.discountedPrice;
    document.getElementById('modalSavings').textContent = offer.savings;

    // Update features
    const featuresContainer = document.getElementById('modalOfferFeatures');
    featuresContainer.innerHTML = offer.features.map(feature => `
        <div class="feature">
            <i class="${feature.icon}"></i>
            <span>${feature.text}</span>
        </div>
    `).join('');

    // Update validity
    document.getElementById('modalValidity').textContent = offer.validity;

    // Show modal
    document.getElementById('offerDetailsModal').style.display = 'block';
}

// Function to close offer details
function closeOfferDetails() {
    document.getElementById('offerDetailsModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('offerDetailsModal');
    if (event.target === modal) {
        closeOfferDetails();
    }
}

// Hero Slider
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    let currentSlide = 0;
    let slideInterval;

    // Initialize slider
    function initSlider() {
        // Start auto-sliding
        startSlideShow();

        // Add click events to navigation buttons
        prevBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            changeSlide(currentSlide - 1);
            startSlideShow();
        });

        nextBtn.addEventListener('click', () => {
            clearInterval(slideInterval);
            changeSlide(currentSlide + 1);
            startSlideShow();
        });

        // Add click events to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                changeSlide(index);
                startSlideShow();
            });
        });

        // Pause auto-sliding when hovering over slider
        document.querySelector('.hero').addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        // Resume auto-sliding when mouse leaves slider
        document.querySelector('.hero').addEventListener('mouseleave', () => {
            startSlideShow();
        });
    }

    // Change slide
    function changeSlide(index) {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Calculate new index
        currentSlide = index;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Start automatic slideshow
    function startSlideShow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            changeSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds
    }

    // Initialize the slider
    initSlider();
});

// Unified showItemDetails function for all product types
function showItemDetails(itemType, itemId) {
    const itemData = getItemData(itemType, itemId);
    if (!itemData) return;

    const modalId = `${itemType}Modal`;
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="item-details-container">
            <div class="item-image-gallery">
                <div class="main-image">
                    <img src="${itemData.image}" alt="${itemData.title}">
                    ${itemData.badge ? `<div class="item-badge">${itemData.badge}</div>` : ''}
                </div>
            </div>
            <div class="item-info">
                <h2>${itemData.title}</h2>
                <div class="item-rating">
                    ${itemData.rating ? `
                        <i class="fas fa-star"></i>
                        <span>${itemData.rating}</span>
                    ` : ''}
                </div>
                <div class="item-price">
                    <span class="current-price">₹${itemData.price}</span>
                    ${itemData.originalPrice ? `
                        <span class="original-price">₹${itemData.originalPrice}</span>
                        <span class="discount">${itemData.discount}% OFF</span>
                    ` : ''}
                </div>
                <div class="item-description">
                    <p>${itemData.description}</p>
                </div>
                ${itemData.features ? `
                    <div class="item-features">
                        ${itemData.features.map(feature => `
                            <div class="feature">
                                <i class="fas ${feature.icon || feature.split(' ')[0]}"></i>
                                <span>${feature.text || feature}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${itemData.ingredients ? `
                    <div class="ingredients-section">
                        <h3>Ingredients</h3>
                        <p>${itemData.ingredients}</p>
                    </div>
                ` : ''}
                ${itemData.nutritionInfo ? `
                    <div class="nutrition-grid">
                        ${Object.entries(itemData.nutritionInfo).map(([label, value]) => `
                            <div class="nutrition-item">
                                <span class="label">${label}</span>
                                <span class="value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="purchase-section">
                    <div class="quantity-selector">
                        <button onclick="updateQuantity(-1)">-</button>
                        <input type="number" id="itemQuantity" value="1" min="1" max="20">
                        <button onclick="updateQuantity(1)">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${itemType}', '${itemId}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Function to get item data based on type and ID
function getItemData(itemType, itemId) {
    switch(itemType) {
        case 'sweet':
            return sweetDetails[itemId];
        case 'namkeen':
            return namkeenDetails[itemId];
        case 'box':
            return boxDetails[itemId];
        case 'offer':
            return offerDetails[itemId];
        default:
            return null;
    }
}

// Initialize all view detail buttons
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for all view details buttons
    document.querySelectorAll('[data-type][data-id]').forEach(item => {
        const viewDetailsBtn = item.querySelector('.view-details-btn');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
                const itemType = item.dataset.type;
                const itemId = item.dataset.id;
                showItemDetails(itemType, itemId);
            });
        }
    });

    // Add quick view functionality
    document.querySelectorAll('[data-type][data-id]').forEach(item => {
        const itemType = item.dataset.type;
        const itemId = item.dataset.id;
        
        const quickViewBtn = document.createElement('button');
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Quick View';
        
        const imageContainer = item.querySelector('.product-image, .signature-image, .namkeen-image, .box-image, .offer-image');
        if (imageContainer) {
            imageContainer.appendChild(quickViewBtn);
            
            quickViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showQuickView(itemType, itemId);
            });
        }
    });

    // Close modal handlers
    document.querySelectorAll('.modal').forEach(modal => {
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });

        // Close when clicking close button
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeModal(modal.id);
            });
        }
    });
});

// ... existing code ...

document.addEventListener('DOMContentLoaded', function() {
    // Initialize view detail buttons for all sections
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('[data-type]');
            if (card) {
                const itemType = card.dataset.type;
                const itemId = card.dataset.id;
                showItemDetails(itemType, itemId);
            }
        });
    });
});

function showItemDetails(itemType, itemId) {
    const data = getItemData(itemType, itemId);
    if (!data) return;

    const modal = document.querySelector(`#${itemType}Modal`) || document.querySelector('#sweetModal');
    if (!modal) return;

    // Update modal content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close-modal" onclick="closeModal('${itemType}')">&times;</span>
        <div class="modal-body">
            <div class="item-details-content">
                <div class="item-image-large">
                    <img src="${data.image}" alt="${data.title}">
                </div>
                <div class="item-info">
                    <h2>${data.title}</h2>
                    <p>${data.description}</p>
                    <div class="price-details">
                        <span class="price">₹${data.price}</span>
                        ${data.originalPrice ? `<span class="original-price">₹${data.originalPrice}</span>` : ''}
                    </div>
                    <div class="item-features">
                        ${data.shelfLife ? `<div class="feature">
                            <i class="fas fa-clock"></i>
                            <span>${data.shelfLife}</span>
                        </div>` : ''}
                        ${data.rating ? `<div class="feature">
                            <i class="fas fa-star"></i>
                            <span>${data.rating}/5</span>
                        </div>` : ''}
                        ${data.packaging ? `<div class="feature">
                            <i class="fas fa-box"></i>
                            <span>${data.packaging}</span>
                        </div>` : ''}
                    </div>
                    ${data.ingredients ? `<div class="ingredients-section">
                        <h3>Ingredients</h3>
                        <p>${data.ingredients}</p>
                    </div>` : ''}
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="decrementQuantity()">-</button>
                        <input type="number" id="itemQuantity" value="1" min="1" max="20">
                        <button class="quantity-btn" onclick="incrementQuantity()">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${itemId}')">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function closeModal(itemType) {
    const modal = document.querySelector(`#${itemType}Modal`) || document.querySelector('#sweetModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ... existing code ...

function scrollToSection(sectionId) {
    const section = document.querySelector(`.${sectionId}`) || document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add click event listeners for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Existing view details event listeners
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('[data-type]');
            if (card) {
                const itemType = card.dataset.type;
                const itemId = card.dataset.id;
                showItemDetails(itemType, itemId);
            }
        });
    });

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            scrollToSection(sectionId);
        });
    });
});

// ... existing code ...