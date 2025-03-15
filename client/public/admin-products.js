// Authentication Check
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'admin-login.html';
    }
}

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const addProductModal = document.getElementById('addProductModal');
const editProductModal = document.getElementById('editProductModal');
const productForm = document.getElementById('productForm');
const editProductForm = document.getElementById('editProductForm');
const searchInput = document.querySelector('.search-box input');
const productsGrid = document.querySelector('.products-grid');

// Check authentication on page load
checkAuth();

// Toggle Sidebar
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Modal Functions
function openAddProductModal() {
    addProductModal.style.display = 'block';
}

function openEditProductModal(product) {
    // Populate form with product data
    const form = editProductForm;
    form.querySelector('[name="name"]').value = product.name;
    form.querySelector('[name="category"]').value = product.category;
    form.querySelector('[name="price"]').value = product.price;
    form.querySelector('[name="stock"]').value = product.stock;
    form.querySelector('[name="description"]').value = product.description;
    form.querySelector('[name="shelfLife"]').value = product.shelfLife;
    form.querySelector('[name="weight"]').value = product.weight;
    form.querySelector('[name="ingredients"]').value = product.ingredients;
    
    // Store product ID for update
    form.dataset.productId = product.id;
    
    editProductModal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Close modals when clicking close button or outside
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', () => {
        closeModal(addProductModal);
        closeModal(editProductModal);
    });
});

window.addEventListener('click', (e) => {
    if (e.target === addProductModal) closeModal(addProductModal);
    if (e.target === editProductModal) closeModal(editProductModal);
});

// Form Submission
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            closeModal(addProductModal);
            showNotification('Product added successfully!', 'success');
            loadProducts(); // Refresh products list
        } else {
            throw new Error('Failed to add product');
        }
    } catch (error) {
        showNotification('Failed to add product', 'error');
    }
});

editProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(editProductForm);
    const productId = editProductForm.dataset.productId;
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            closeModal(editProductModal);
            showNotification('Product updated successfully!', 'success');
            loadProducts(); // Refresh products list
        } else {
            throw new Error('Failed to update product');
        }
    } catch (error) {
        showNotification('Failed to update product', 'error');
    }
});

// Load Products
async function loadProducts() {
    try {
        const response = await fetch('/api/products', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
        }
    } catch (error) {
        console.error('Failed to load products:', error);
        showNotification('Failed to load products', 'error');
    }
}

function displayProducts(products) {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                    ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <p class="price">₹${product.price}</p>
                <p class="stock">Stock: ${product.stock}</p>
                <div class="product-actions">
                    <button class="edit-btn" onclick="openEditProductModal(${JSON.stringify(product)})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Delete Product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            showNotification('Product deleted successfully!', 'success');
            loadProducts(); // Refresh products list
        } else {
            throw new Error('Failed to delete product');
        }
    } catch (error) {
        showNotification('Failed to delete product', 'error');
    }
}

// Search Functionality
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const searchTerm = e.target.value.toLowerCase();
    
    searchTimeout = setTimeout(() => {
        performSearch(searchTerm);
    }, 300);
});

async function performSearch(term) {
    try {
        const response = await fetch(`/api/products/search?q=${term}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (response.ok) {
            const results = await response.json();
            displayProducts(results);
        }
    } catch (error) {
        console.error('Search failed:', error);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
}); 