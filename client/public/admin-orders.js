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
const orderDetailsModal = document.getElementById('orderDetailsModal');
const closeModalBtn = document.querySelector('.close-modal');
const statusFilter = document.getElementById('statusFilter');
const dateFilter = document.getElementById('dateFilter');
const searchInput = document.querySelector('.search-box input');
const ordersTable = document.querySelector('.data-table tbody');
const orderStatusSelect = document.getElementById('orderStatusSelect');
const updateStatusBtn = document.querySelector('.update-status-btn');
const printInvoiceBtn = document.querySelector('.print-invoice-btn');
const sendEmailBtn = document.querySelector('.send-email-btn');

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
function openOrderDetailsModal(orderId) {
    orderDetailsModal.classList.add('active');
    loadOrderDetails(orderId);
}

function closeOrderDetailsModal() {
    orderDetailsModal.classList.remove('active');
}

closeModalBtn.addEventListener('click', closeOrderDetailsModal);

// Close modal when clicking outside
orderDetailsModal.addEventListener('click', (e) => {
    if (e.target === orderDetailsModal) {
        closeOrderDetailsModal();
    }
});

// Load Orders
async function loadOrders() {
    try {
        const response = await fetch('/api/orders', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        showNotification('Error loading orders', 'error');
    }
}

function displayOrders(orders) {
    ordersTable.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customer.name}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.items.length} items</td>
            <td>₹${order.total.toFixed(2)}</td>
            <td>
                <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
            </td>
            <td>
                <button class="action-btn view-btn" onclick="openOrderDetailsModal('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load Order Details
async function loadOrderDetails(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const order = await response.json();
        displayOrderDetails(order);
    } catch (error) {
        showNotification('Error loading order details', 'error');
    }
}

function displayOrderDetails(order) {
    // Customer Information
    document.getElementById('customerName').textContent = order.customer.name;
    document.getElementById('customerEmail').textContent = order.customer.email;
    document.getElementById('customerPhone').textContent = order.customer.phone;
    document.getElementById('customerAddress').textContent = order.customer.address;

    // Order Items
    const orderItemsTable = document.getElementById('orderItemsTable');
    orderItemsTable.innerHTML = order.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>₹${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
    `).join('');

    // Order Totals
    document.getElementById('orderSubtotal').textContent = `₹${order.subtotal.toFixed(2)}`;
    document.getElementById('orderShipping').textContent = `₹${order.shipping.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `₹${order.total.toFixed(2)}`;

    // Order Status
    orderStatusSelect.value = order.status.toLowerCase();
    displayStatusHistory(order.statusHistory);
}

function displayStatusHistory(history) {
    const statusHistory = document.getElementById('statusHistory');
    statusHistory.innerHTML = history.map(entry => `
        <div class="status-entry">
            <div class="status-info">
                <span class="status">${entry.status}</span>
                <span class="date">${new Date(entry.date).toLocaleString()}</span>
            </div>
            ${entry.note ? `<p class="status-note">${entry.note}</p>` : ''}
        </div>
    `).join('');
}

// Update Order Status
updateStatusBtn.addEventListener('click', async () => {
    const orderId = orderDetailsModal.dataset.orderId;
    const newStatus = orderStatusSelect.value;
    const note = prompt('Add a note about this status update (optional):');

    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify({
                status: newStatus,
                note: note
            })
        });

        if (response.ok) {
            showNotification('Order status updated successfully', 'success');
            loadOrderDetails(orderId);
            loadOrders();
        } else {
            throw new Error('Failed to update order status');
        }
    } catch (error) {
        showNotification('Error updating order status', 'error');
    }
});

// Print Invoice
printInvoiceBtn.addEventListener('click', async () => {
    const orderId = orderDetailsModal.dataset.orderId;
    try {
        const response = await fetch(`/api/orders/${orderId}/invoice`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        showNotification('Error generating invoice', 'error');
    }
});

// Send Email
sendEmailBtn.addEventListener('click', async () => {
    const orderId = orderDetailsModal.dataset.orderId;
    try {
        const response = await fetch(`/api/orders/${orderId}/email`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (response.ok) {
            showNotification('Order confirmation email sent successfully', 'success');
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        showNotification('Error sending email', 'error');
    }
});

// Filters
statusFilter.addEventListener('change', () => {
    loadOrders();
});

dateFilter.addEventListener('change', () => {
    loadOrders();
});

// Search functionality with debounce
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loadOrders();
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
    loadOrders();
}); 