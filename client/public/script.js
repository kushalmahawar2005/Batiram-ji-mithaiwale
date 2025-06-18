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

// Common functionality for all pages
// Remove cart-related code and keep only shared utilities


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

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });

        // Add close button functionality
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeModal(modal.id);
            });
        }
    });

    // Initialize navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            scrollToSection(sectionId);
        });
    });
});

// ... existing code ...

function scrollToSection(sectionId) {
    const section = document.querySelector(`.${sectionId}`) || document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to load admin products
function loadAdminProducts() {
    try {
        const adminProducts = JSON.parse(localStorage.getItem('products')) || [];
        console.log('Loading admin products:', adminProducts); // Debug log
        
        // Add admin products to allSweets array
        adminProducts.forEach(product => {
            const sweetCard = {
                id: product.id,
                name: product.name,
                description: product.description || "Delicious traditional sweet",
                price: product.price,
                weight: "500g",
                category: product.category,
                image: product.image || "images/products/default.jpg",
                badge: "New",
                rating: 4.5
            };
            
            // Add to allSweets if not already present
            if (!allSweets.find(sweet => sweet.id === product.id)) {
                allSweets.push(sweetCard);
                console.log('Added product:', sweetCard); // Debug log
            }
        });
        
        // Update filtered sweets and display
        filteredSweets = [...allSweets];
        console.log('Updated allSweets:', allSweets); // Debug log
        displaySweets();
    } catch (error) {
        console.error('Error loading admin products:', error);
    }
}

// Initialize Signature Sweets Slider
const signatureSwiper = new Swiper('.signature-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
        delay: 3000, // 3 seconds delay between slides
        disableOnInteraction: false, // Continue autoplay even after user interaction
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        480: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 30
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 30
        }
    }
});

// Hover Quick View functionality
function initHoverQuickView() {
    // Remove any existing quick view containers
    document.querySelectorAll('.hover-quick-view').forEach(container => container.remove());

    // Add hover quick view to all product cards
    document.querySelectorAll('.product-card, .sweet-card, .namkeen-card, .box-card').forEach(card => {
        const itemType = card.getAttribute('data-type') || 'sweet';
        const itemId = card.getAttribute('data-id');
        
        if (!itemId) return;

        // Create quick view container
        const quickViewContainer = document.createElement('div');
        quickViewContainer.className = 'hover-quick-view';
        quickViewContainer.style.display = 'none';
        
        // Add hover events
        card.addEventListener('mouseenter', () => {
            const data = getItemData(itemType, itemId);
            if (!data) {
                console.error('No data found for:', itemType, itemId);
                return;
            }

            quickViewContainer.innerHTML = `
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${data.image}" alt="${data.title}">
                    </div>
                    <div class="quick-view-details">
                        <h3>${data.title}</h3>
                        <p class="price">₹${data.price}</p>
                        <p class="description">${data.description}</p>
                        <div class="quick-view-actions">
                            <button class="view-details-btn" onclick="showItemDetails('${itemType}', '${itemId}')">
                                View Details
                            </button>
                            <button class="add-to-cart-btn" onclick="addToCart('${itemId}')">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Position the quick view
            const rect = card.getBoundingClientRect();
            quickViewContainer.style.position = 'fixed';
            quickViewContainer.style.top = `${rect.bottom + window.scrollY}px`;
            quickViewContainer.style.left = `${rect.left + window.scrollX}px`;
            quickViewContainer.style.zIndex = '1000';
            
            document.body.appendChild(quickViewContainer);
            quickViewContainer.style.display = 'block';
        });

        card.addEventListener('mouseleave', (e) => {
            // Check if mouse is over quick view
            const toElement = e.relatedTarget;
            if (!quickViewContainer.contains(toElement)) {
                quickViewContainer.remove();
            }
        });

        // Keep quick view visible when hovering over it
        quickViewContainer.addEventListener('mouseenter', () => {
            quickViewContainer.style.display = 'block';
        });

        quickViewContainer.addEventListener('mouseleave', () => {
            quickViewContainer.remove();
        });
    });
}

// Add CSS for hover quick view
const style = document.createElement('style');
style.textContent = `
    .hover-quick-view {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 15px;
        width: 300px;
        transition: all 0.3s ease;
        position: fixed;
        z-index: 1000;
    }

    .hover-quick-view .quick-view-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .hover-quick-view .quick-view-image {
        width: 100%;
        height: 200px;
        overflow: hidden;
        border-radius: 4px;
    }

    .hover-quick-view .quick-view-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .hover-quick-view .quick-view-details {
        padding: 10px 0;
    }

    .hover-quick-view h3 {
        margin: 0 0 5px 0;
        font-size: 1.1em;
        color: #333;
    }

    .hover-quick-view .price {
        color: #e65c00;
        font-weight: bold;
        margin: 5px 0;
    }

    .hover-quick-view .description {
        font-size: 0.9em;
        color: #666;
        margin: 5px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .hover-quick-view .quick-view-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .hover-quick-view .view-details-btn,
    .hover-quick-view .add-to-cart-btn {
        padding: 8px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9em;
        transition: all 0.3s ease;
    }

    .hover-quick-view .view-details-btn {
        background: #f0f0f0;
        color: #333;
    }

    .hover-quick-view .add-to-cart-btn {
        background: #e65c00;
        color: white;
    }

    .hover-quick-view .view-details-btn:hover {
        background: #e0e0e0;
    }

    .hover-quick-view .add-to-cart-btn:hover {
        background: #d45200;
    }
`;
document.head.appendChild(style);

// Update initialization
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...

    // Initialize hover quick view
    initHoverQuickView();

    // Re-initialize hover quick view when products are loaded
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                initHoverQuickView();
            }
        });
    });

    // Observe the product container for changes
    const productContainer = document.querySelector('.product-grid, .sweets-grid');
    if (productContainer) {
        observer.observe(productContainer, { childList: true, subtree: true });
    }
});

// ... existing code ...