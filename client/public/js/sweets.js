// Product data
const products = [
    {
        id: 'kaju-katli',
        title: 'Kaju Katli',
        image: 'images/products/kaju-katli.jpg',
        price: 800,
        rating: '4.8/5',
        description: 'Premium quality kaju katli made with pure cashews and cardamom.',
        category: 'sweets',
        subcategory: 'dry-fruit-sweets',
        badge: 'Bestseller'
    },
    {
        id: 'rasmalai',
        title: 'Rasmalai',
        image: 'images/products/rasmalai.jpg',
        price: 600,
        rating: '4.9/5',
        description: 'Soft and creamy rasmalai in sweetened milk.',
        category: 'sweets',
        subcategory: 'bengali-sweets',
        badge: 'Popular'
    },
    {
        id: 'gulab-jamun',
        title: 'Gulab Jamun',
        image: 'images/products/gulab-jamun.jpg',
        price: 400,
        rating: '4.7/5',
        description: 'Soft and spongy gulab jamun in sugar syrup.',
        category: 'sweets',
        subcategory: 'milk-sweets',
        badge: 'Classic'
    },
    {
        id: 'motichoor-laddu',
        title: 'Motichoor Laddu',
        image: 'images/products/motichoor-laddu.jpg',
        price: 500,
        rating: '4.8/5',
        description: 'Traditional motichoor laddu made with fine boondi.',
        category: 'sweets',
        subcategory: 'festive-sweets',
        badge: 'Festive'
    },
    {
        id: 'besan-laddu',
        title: 'Besan Laddu',
        image: 'images/products/besan-laddu.jpg',
        price: 450,
        rating: '4.6/5',
        description: 'Rich and flavorful besan laddu with ghee.',
        category: 'sweets',
        subcategory: 'festive-sweets',
        badge: 'Traditional'
    },
    {
        id: 'milk-barfi',
        title: 'Milk Barfi',
        image: 'images/products/milk-barfi.jpg',
        price: 350,
        rating: '4.5/5',
        description: 'Creamy milk barfi with a rich texture.',
        category: 'sweets',
        subcategory: 'milk-sweets',
        badge: 'Classic'
    },
    {
        id: 'Kala Jamun',
        title: 'Kala Jamun',
        image: 'images/products/mathura-peda.jpg',
        price: 400,
        rating: '4.7/5',
        description: 'Traditional Kala Jamun with khoya.',
        category: 'sweets',
        subcategory: 'mawa-sweets',
        badge: 'Regional'
    },
    {
        id: 'mysore-pak',
        title: 'Mysore Pak',
        image: 'images/products/mysore-pak.jpg',
        price: 500,
        rating: '4.8/5',
        description: 'Rich and crumbly Mysore pak with ghee.',
        category: 'sweets',
        subcategory: 'south-indian',
        badge: 'Premium'
    },
    {
        id: 'Makhan Beda',
        title: 'Makhan Beda',
        image: 'images/products/badusha.jpg',
        price: 450,
        rating: '4.6/5',
        description: 'Traditional Makhan Beda.',
        category: 'sweets',
        subcategory: 'Indian-sweets',
        badge: 'Traditional'
    },
    {
        id: 'gajar-halwa',
        title: 'Gajar Halwa',
        image: 'images/products/gajar-halwa.jpg',
        price: 600,
        rating: '4.9/5',
        description: 'Rich and creamy carrot halwa with dry fruits.',
        category: 'sweets',
        subcategory: 'seasonal-sweets',
        badge: 'Seasonal'
    },
    {
        id: 'Kesar Peda',
        title: 'Kesar Peda',
        image: 'images/products/kheer.jpg',
        price: 400,
        rating: '4.7/5',
        description: 'Sweet Kesar Peda.',
        category: 'sweets',
        subcategory: 'sweets',
        badge: 'Classic'
    },
    {
        id: 'White Choclate Laddu',
        title: 'White Choclate Laddu',
        image: 'images/products/shahi-tukda.jpg',
        price: 500,
        rating: '4.8/5',
        description: 'Special White Choclate Laddu.',
        category: 'sweets',
        subcategory: 'sweets',
        badge: 'Premium'
    },
    {
        id: 'Choclate Laduu',
        title: 'Choclate Laduu',
        image: 'images/products/sev.jpg',
        price: 200,
        rating: '4.7/5',
        description: 'Crispy gram flour sev with spices.',
        category: 'namkeen',
        subcategory: 'all',
        badge: 'Popular'
    },
    {
        id: 'Gulab Ladu',
        title: 'Gulab Ladu',
        image: 'images/products/chakli.jpg',
        price: 300,
        rating: '4.6/5',
        description: 'Spiral shaped crispy snack with spices.',
        category: 'namkeen',
        subcategory: 'all',
        badge: 'Traditional'
    },
    {
        id: 'mixture',
        title: 'Mixture',
        image: 'images/products/mixture.jpg',
        price: 350,
        rating: '4.8/5',
        description: 'Mix of various crispy snacks and nuts.',
        category: 'namkeen',
        subcategory: 'all',
        badge: 'Bestseller'
    },
    {
        id: 'khatta-meetha',
        title: 'Khatta Meetha',
        image: 'images/products/khatta-meetha.jpg',
        price: 280,
        rating: '4.7/5',
        description: 'Sweet and sour snack mix with spices.',
        category: 'namkeen',
        subcategory: 'all',
        badge: 'Popular'
    },
    {
        id: 'festive-box',
        title: 'Festive Box',
        image: 'images/products/festive-box.jpg',
        price: 1200,
        rating: '4.8/5',
        description: 'Traditional sweets box for festivals.',
        category: 'boxes',
        subcategory: 'all',
        badge: 'Festive'
    },
    {
        id: 'dry-fruit-box',
        title: 'Dry Fruit Box',
        image: 'images/products/dry-fruit-box.jpg',
        price: 1800,
        rating: '4.9/5',
        description: 'Premium dry fruits in elegant packaging.',
        category: 'boxes',
        subcategory: 'all',
        badge: 'Premium'
    },
    {
        id: 'corporate-box',
        title: 'Corporate Box',
        image: 'images/products/corporate-box.jpg',
        price: 2000,
        rating: '4.8/5',
        description: 'Luxury gift box for corporate gifting.',
        category: 'boxes',
        subcategory: 'all',
        badge: 'Corporate'
    },
    {
        id: 'almonds',
        title: 'Almonds',
        image: 'images/products/almonds.jpg',
        price: 900,
        rating: '4.8/5',
        description: 'California almonds, premium quality.',
        category: 'dry-fruits',
        subcategory: 'all',
        badge: 'Premium'
    },
    {
        id: 'cashews',
        title: 'Cashews',
        image: 'images/products/cashews.jpg',
        price: 1100,
        rating: '4.9/5',
        description: 'Whole cashew nuts, premium quality.',
        category: 'dry-fruits',
        subcategory: 'all',
        badge: 'Bestseller'
    },
    {
        id: 'pistachios',
        title: 'Pistachios',
        image: 'images/products/pistachios.jpg',
        price: 1300,
        rating: '4.8/5',
        description: 'Premium quality pistachios.',
        category: 'dry-fruits',
        subcategory: 'all',
        badge: 'Premium'
    },
    {
        id: 'walnuts',
        title: 'Walnuts',
        image: 'images/products/walnuts.jpg',
        price: 800,
        rating: '4.7/5',
        description: 'Fresh walnuts, rich in nutrients.',
        category: 'dry-fruits',
        subcategory: 'all',
        badge: 'Healthy'
    }
];

// Product filtering and display
function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const priceFilter = document.getElementById('priceFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    const selectedCategory = document.querySelector('.category-tab.active')?.dataset.category || 'all';
    const selectedSubcategory = document.querySelector('.subcategory-tab.active')?.dataset.subcategory;

    let filteredProducts = products;

    // Filter by category
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory && selectedSubcategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.subcategory === selectedSubcategory);
    }

    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.subcategory.toLowerCase().includes(searchTerm)
        );
    }

    // Filter by price
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => {
            if (max) {
                return product.price >= min && product.price <= max;
            } else {
                return product.price >= min;
            }
        });
    }

    // Sort products
    switch (sortFilter) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => {
                const ratingA = parseFloat(a.rating);
                const ratingB = parseFloat(b.rating);
                return ratingB - ratingA;
            });
            break;
        case 'newest':
            // Assuming newer products are at the end of the array
            filteredProducts.reverse();
            break;
    }

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    if (!container) {
        console.error('Products container not found');
        return;
    }

    if (products.length === 0) {
        container.innerHTML = '<div class="no-results">No products found matching your criteria.</div>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" data-type="sweet" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='images/placeholder.jpg'">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">₹${product.price}</span>
                    <span class="product-rating">${product.rating}</span>
                </div>
                <div class="product-actions">
                    <button class="action-btn view-details" onclick="showItemDetails('sweet', '${product.id}')">View Details</button>
                    <button class="action-btn add-to-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize products display
    displayProducts(products);

    // Check for search parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    if (searchTerm) {
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.value = searchTerm;
            filterProducts();
        }
    }

    // Check for selected sweet from index.html
    const selectedSweet = localStorage.getItem('selectedSweet');
    if (selectedSweet) {
        // Clear the selection
        localStorage.removeItem('selectedSweet');
        
        // Find the sweet in the products data
        const sweet = products.find(p => p.id === selectedSweet);
        if (sweet) {
            // Show the sweet details modal
            showItemDetails('sweet', selectedSweet);
            
            // Scroll to the sweet's category
            const category = sweet.category;
            const categoryTab = document.querySelector(`.category-tab[data-category="${category}"]`);
            if (categoryTab) {
                categoryTab.click();
            }
        }
    }

    // Category tab click handler
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show/hide subcategory tabs
            const subcategoryTabs = document.getElementById('subcategoryTabs');
            if (subcategoryTabs) {
                if (tab.dataset.category === 'sweets') {
                    subcategoryTabs.style.display = 'flex';
                } else {
                    subcategoryTabs.style.display = 'none';
                }
            }

            filterProducts();
        });
    });

    // Subcategory tab click handler
    document.querySelectorAll('.subcategory-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.subcategory-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterProducts();
        });
    });

    // Search and filter handlers
    const searchInput = document.getElementById('productSearch');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
});

// Sweet-specific data and functions
const sweetProducts = [
    {
        id: 'kaju-katli',
        title: 'Kaju Katli',
        image: 'images/products/kaju-katli.jpg',
        price: 800,
        rating: '4.8/5',
        description: 'Premium quality kaju katli made with pure cashews and cardamom.',
        category: 'sweets',
        subcategory: 'dry-fruit-sweets',
        badge: 'Bestseller',
        ingredients: 'Cashews, Sugar, Cardamom, Ghee',
        shelfLife: '15 days',
        packaging: 'Premium gift box'
    },
    // ... other sweet products ...
];

// Sweet page specific functions
function initSweetsPage() {
    loadSweetProducts();
    initializeFilters();
    initializeViewToggle();
    initializeSearch();
}

function loadSweetProducts() {
    const sweetsGrid = document.getElementById('sweetsGrid');
    if (!sweetsGrid) return;

    sweetsGrid.innerHTML = sweetProducts.map(sweet => `
        <div class="sweet-card" data-type="sweet" data-id="${sweet.id}">
            <div class="sweet-image">
                <img src="${sweet.image}" alt="${sweet.title}" onerror="this.src='images/placeholder.jpg'">
                ${sweet.badge ? `<span class="sweet-badge">${sweet.badge}</span>` : ''}
            </div>
            <div class="sweet-content">
                <h3>${sweet.title}</h3>
                <p>${sweet.description}</p>
                <div class="sweet-details">
                    <div class="sweet-price">₹${sweet.price}</div>
                    <div class="sweet-rating">${sweet.rating}</div>
                </div>
                <div class="sweet-actions">
                    <button class="add-to-cart-btn" onclick="addToCart('${sweet.id}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="view-details-btn" onclick="showSweetDetails('${sweet.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Initialize hover quick view for new cards
    initHoverQuickView();
}

function showSweetDetails(sweetId) {
    const sweet = sweetProducts.find(p => p.id === sweetId);
    if (!sweet) return;

    const modal = document.getElementById('sweetModal');
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
        <span class="close-modal" onclick="closeModal('sweetModal')">&times;</span>
        <div class="modal-body">
            <div class="sweet-details-content">
                <div class="sweet-image-large">
                    <img src="${sweet.image}" alt="${sweet.title}">
                </div>
                <div class="sweet-info">
                    <h2>${sweet.title}</h2>
                    <p>${sweet.description}</p>
                    <div class="price-details">
                        <span class="price">₹${sweet.price}</span>
                    </div>
                    <div class="sweet-features">
                        <div class="feature">
                            <i class="fas fa-clock"></i>
                            <span>${sweet.shelfLife}</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-star"></i>
                            <span>${sweet.rating}</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-box"></i>
                            <span>${sweet.packaging}</span>
                        </div>
                    </div>
                    <div class="ingredients-section">
                        <h3>Ingredients</h3>
                        <p>${sweet.ingredients}</p>
                    </div>
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="decrementQuantity()">-</button>
                        <input type="number" id="sweetQuantity" value="1" min="1" max="20">
                        <button class="quantity-btn" onclick="incrementQuantity()">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${sweet.id}')">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterSweets);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', filterSweets);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', filterSweets);
    }
}

function filterSweets() {
    const category = document.getElementById('categoryFilter')?.value;
    const priceRange = document.getElementById('priceFilter')?.value;
    const sortBy = document.getElementById('sortFilter')?.value;

    let filteredSweets = [...sweetProducts];

    // Apply category filter
    if (category && category !== 'all') {
        filteredSweets = filteredSweets.filter(sweet => sweet.category === category);
    }

    // Apply price filter
    if (priceRange && priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        filteredSweets = filteredSweets.filter(sweet => {
            if (max) {
                return sweet.price >= min && sweet.price <= max;
            }
            return sweet.price >= min;
        });
    }

    // Apply sorting
    if (sortBy) {
        switch (sortBy) {
            case 'price-low':
                filteredSweets.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredSweets.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredSweets.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'rating':
                filteredSweets.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
                break;
        }
    }

    displaySweets(filteredSweets);
}

function initializeViewToggle() {
    const gridBtn = document.querySelector('.grid-view');
    const listBtn = document.querySelector('.list-view');
    const sweetsGrid = document.getElementById('sweetsGrid');

    if (gridBtn && listBtn && sweetsGrid) {
        gridBtn.addEventListener('click', () => {
            sweetsGrid.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        });

        listBtn.addEventListener('click', () => {
            sweetsGrid.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        });
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('sweetSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredSweets = sweetProducts.filter(sweet =>
                sweet.title.toLowerCase().includes(searchTerm) ||
                sweet.description.toLowerCase().includes(searchTerm)
            );
            displaySweets(filteredSweets);
        });
    }
}

// Initialize sweet page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.sweets-collection')) {
        initSweetsPage();
    }
}); 