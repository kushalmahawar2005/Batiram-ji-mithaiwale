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
const customerDetailsModal = document.getElementById('customerDetailsModal');
const editCustomerModal = document.getElementById('editCustomerModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const customerTypeFilter = document.getElementById('customerTypeFilter');
const activityFilter = document.getElementById('activityFilter');
const searchInput = document.querySelector('.search-box input');
const customersTable = document.querySelector('.data-table tbody');
const editCustomerBtn = document.querySelector('.edit-customer-btn');
const sendEmailBtn = document.querySelector('.send-email-btn');
const blockCustomerBtn = document.querySelector('.block-customer-btn');
const saveBtn = document.querySelector('.save-btn');
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
function openCustomerDetailsModal(customerId) {
    customerDetailsModal.classList.add('active');
    loadCustomerDetails(customerId);
}

function openEditCustomerModal(customer) {
    editCustomerModal.classList.add('active');
    populateEditForm(customer);
    editCustomerModal.dataset.customerId = customer.id;
}

function closeModals() {
    customerDetailsModal.classList.remove('active');
    editCustomerModal.classList.remove('active');
}

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModals);
});

// Close modals when clicking outside
[customerDetailsModal, editCustomerModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModals();
        }
    });
});

// Load Customers
async function loadCustomers() {
    try {
        const response = await fetch('/api/customers', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const customers = await response.json();
        updateCustomerStats(customers);
        displayCustomers(customers);
    } catch (error) {
        showNotification('Error loading customers', 'error');
    }
}

function updateCustomerStats(customers) {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(customer => customer.status === 'active').length;
    const inactiveCustomers = customers.filter(customer => customer.status === 'inactive').length;
    const vipCustomers = customers.filter(customer => customer.type === 'vip').length;

    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('activeCustomers').textContent = activeCustomers;
    document.getElementById('inactiveCustomers').textContent = inactiveCustomers;
    document.getElementById('vipCustomers').textContent = vipCustomers;
}

function displayCustomers(customers) {
    customersTable.innerHTML = customers.map(customer => `
        <tr>
            <td>#${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>
                <span class="customer-type ${customer.type.toLowerCase()}">${customer.type}</span>
            </td>
            <td>${customer.totalOrders}</td>
            <td>₹${customer.totalSpent.toFixed(2)}</td>
            <td>
                <span class="status-badge ${customer.status.toLowerCase()}">${customer.status}</span>
            </td>
            <td>
                <button class="action-btn view-btn" onclick="openCustomerDetailsModal('${customer.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Load Customer Details
async function loadCustomerDetails(customerId) {
    try {
        const response = await fetch(`/api/customers/${customerId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const customer = await response.json();
        displayCustomerDetails(customer);
    } catch (error) {
        showNotification('Error loading customer details', 'error');
    }
}

function displayCustomerDetails(customer) {
    // Basic Information
    document.getElementById('customerId').textContent = `#${customer.id}`;
    document.getElementById('customerName').textContent = customer.name;
    document.getElementById('customerEmail').textContent = customer.email;
    document.getElementById('customerPhone').textContent = customer.phone;
    document.getElementById('customerType').textContent = customer.type;
    document.getElementById('customerStatus').textContent = customer.status;
    document.getElementById('customerJoinedDate').textContent = new Date(customer.joinedDate).toLocaleDateString();
    document.getElementById('customerLastOrder').textContent = customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'No orders yet';

    // Addresses
    const addressesContainer = document.getElementById('customerAddresses');
    addressesContainer.innerHTML = customer.addresses.map(address => `
        <div class="address-card">
            <div class="address-type">${address.type}</div>
            <div class="address-details">
                <p>${address.street}</p>
                <p>${address.city}, ${address.state} ${address.pincode}</p>
                <p>${address.country}</p>
            </div>
            ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
        </div>
    `).join('');

    // Recent Orders
    const ordersTable = document.getElementById('customerOrdersTable');
    ordersTable.innerHTML = customer.recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>₹${order.total.toFixed(2)}</td>
            <td>
                <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
            </td>
        </tr>
    `).join('');
}

function populateEditForm(customer) {
    document.getElementById('editName').value = customer.name;
    document.getElementById('editEmail').value = customer.email;
    document.getElementById('editPhone').value = customer.phone;
    document.getElementById('editType').value = customer.type;
    document.getElementById('editStatus').value = customer.status;
}

// Edit Customer
editCustomerBtn.addEventListener('click', () => {
    const customerId = customerDetailsModal.dataset.customerId;
    loadCustomerDetails(customerId).then(customer => {
        openEditCustomerModal(customer);
    });
});

saveBtn.addEventListener('click', async () => {
    const customerId = editCustomerModal.dataset.customerId;
    const updatedCustomer = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        type: document.getElementById('editType').value,
        status: document.getElementById('editStatus').value
    };

    try {
        const response = await fetch(`/api/customers/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(updatedCustomer)
        });

        if (response.ok) {
            showNotification('Customer updated successfully', 'success');
            closeModals();
            loadCustomers();
        } else {
            throw new Error('Failed to update customer');
        }
    } catch (error) {
        showNotification('Error updating customer', 'error');
    }
});

// Send Email
sendEmailBtn.addEventListener('click', async () => {
    const customerId = customerDetailsModal.dataset.customerId;
    try {
        const response = await fetch(`/api/customers/${customerId}/email`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (response.ok) {
            showNotification('Email sent successfully', 'success');
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        showNotification('Error sending email', 'error');
    }
});

// Block Customer
blockCustomerBtn.addEventListener('click', async () => {
    const customerId = customerDetailsModal.dataset.customerId;
    if (confirm('Are you sure you want to block this customer?')) {
        try {
            const response = await fetch(`/api/customers/${customerId}/block`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (response.ok) {
                showNotification('Customer blocked successfully', 'success');
                closeModals();
                loadCustomers();
            } else {
                throw new Error('Failed to block customer');
            }
        } catch (error) {
            showNotification('Error blocking customer', 'error');
        }
    }
});

// Cancel Edit
cancelBtn.addEventListener('click', closeModals);

// Filters
customerTypeFilter.addEventListener('change', () => {
    loadCustomers();
});

activityFilter.addEventListener('change', () => {
    loadCustomers();
});

// Search functionality with debounce
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        loadCustomers();
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
    loadCustomers();
}); 