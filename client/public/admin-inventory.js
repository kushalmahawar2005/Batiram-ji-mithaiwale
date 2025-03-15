// Check authentication
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'admin-login.html';
    }
}

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const menuToggle = document.querySelector('.menu-toggle');
const stockUpdateModal = document.getElementById('stockUpdateModal');
const stockHistoryModal = document.getElementById('stockHistoryModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const categoryFilter = document.getElementById('categoryFilter');
const stockFilter = document.getElementById('stockFilter');
const searchInput = document.querySelector('.search-box input');
const inventoryTable = document.querySelector('.data-table tbody');
const updateBtn = document.querySelector('.update-btn');
const cancelBtn = document.querySelector('.cancel-btn');

// Sidebar Toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// Modal Functions
function openStockUpdateModal(product) {
    stockUpdateModal.classList.add('active');
    document.getElementById('updateProductName').textContent = product.name;
    document.getElementById('updateProductCategory').textContent = product.category;
    document.getElementById('currentStock').value = product.currentStock;
    document.getElementById('minimumStock').value = product.minimumStock;
    document.getElementById('stockUnit').value = product.unit;
    stockUpdateModal.dataset.productId = product.id;
}

function openStockHistoryModal(product) {
    stockHistoryModal.classList.add('active');
    document.getElementById('historyProductName').textContent = product.name;
    document.getElementById('historyProductCategory').textContent = product.category;
    loadStockHistory(product.id);
}

function closeModals() {
    stockUpdateModal.classList.remove('active');
    stockHistoryModal.classList.remove('active');
}

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModals);
});

// Close modals when clicking outside
[stockUpdateModal, stockHistoryModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModals();
        }
    });
});

// Load Inventory
async function loadInventory() {
    try {
        const response = await fetch('/api/inventory', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const inventory = await response.json();
        updateInventoryStats(inventory);
        displayInventory(inventory);
    } catch (error) {
        showNotification('Error loading inventory', 'error');
    }
}

function updateInventoryStats(inventory) {
    const totalProducts = inventory.length;
    const lowStockItems = inventory.filter(item => item.currentStock <= item.minimumStock && item.currentStock > 0).length;
    const outOfStock = inventory.filter(item => item.currentStock === 0).length;
    const inStock = inventory.filter(item => item.currentStock > item.minimumStock).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockItems').textContent = lowStockItems;
    document.getElementById('outOfStock').textContent = outOfStock;
    document.getElementById('inStock').textContent = inStock;
}

function displayInventory(inventory) {
    inventoryTable.innerHTML = inventory.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.currentStock} ${item.unit}</td>
            <td>${item.minimumStock} ${item.unit}</td>
            <td>${item.unit}</td>
            <td>
                <span class="status-badge ${getStockStatus(item)}">${getStockStatusText(item)}</span>
            </td>
            <td>
                <button class="action-btn update-btn" onclick="openStockUpdateModal(${JSON.stringify(item)})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn history-btn" onclick="openStockHistoryModal(${JSON.stringify(item)})">
                    <i class="fas fa-history"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStockStatus(item) {
    if (item.currentStock === 0) return 'danger';
    if (item.currentStock <= item.minimumStock) return 'warning';
    return 'success';
}

function getStockStatusText(item) {
    if (item.currentStock === 0) return 'Out of Stock';
    if (item.currentStock <= item.minimumStock) return 'Low Stock';
    return 'In Stock';
}

// Load Stock History
async function loadStockHistory(productId) {
    try {
        const response = await fetch(`/api/inventory/${productId}/history`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const history = await response.json();
        displayStockHistory(history);
    } catch (error) {
        showNotification('Error loading stock history', 'error');
    }
}

function displayStockHistory(history) {
    const historyTimeline = document.querySelector('.history-timeline');
    historyTimeline.innerHTML = history.map(entry => `
        <div class="history-entry">
            <div class="history-info">
                <span class="date">${new Date(entry.date).toLocaleString()}</span>
                <span class="type">${entry.type}</span>
            </div>
            <div class="stock-change">
                <span class="previous">${entry.previousStock} ${entry.unit}</span>
                <i class="fas fa-arrow-right"></i>
                <span class="current">${entry.currentStock} ${entry.unit}</span>
            </div>
            ${entry.notes ? `<p class="notes">${entry.notes}</p>` : ''}
        </div>
    `).join('');
}

// Update Stock
updateBtn.addEventListener('click', async () => {
    const productId = stockUpdateModal.dataset.productId;
    const currentStock = document.getElementById('currentStock').value;
    const minimumStock = document.getElementById('minimumStock').value;
    const unit = document.getElementById('stockUnit').value;
    const notes = document.getElementById('stockNotes').value;

    try {
        const response = await fetch(`/api/inventory/${productId}/stock`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({
                currentStock,
                minimumStock,
                unit,
                notes
            })
        });

        if (response.ok) {
            showNotification('Stock updated successfully', 'success');
            closeModals();
            loadInventory();
        } else {
            throw new Error('Failed to update stock');
        }
    } catch (error) {
        showNotification('Error updating stock', 'error');
    }
});

// Cancel Update
cancelBtn.addEventListener('click', closeModals);

// Filters
categoryFilter.addEventListener('change', () => {
    loadInventory();
});

stockFilter.addEventListener('change', () => {
    loadInventory();
});

// Search functionality with debounce
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loadInventory();
    }, 500);
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadInventory();
}); 