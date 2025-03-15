document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();
    
    // Initialize dashboard
    initializeDashboard();
    
    // Event Listeners
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.querySelector('.menu-toggle').addEventListener('click', toggleSidebar);
    
    // Initialize charts if they exist
    if (document.getElementById('salesChart')) {
        initializeSalesChart();
    }
    if (document.getElementById('productsChart')) {
        initializeProductsChart();
    }
});

// Authentication Check
function checkAuth() {
    const adminToken = localStorage.getItem('adminToken');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (!adminToken || !sessionExpiry || new Date().getTime() > parseInt(sessionExpiry)) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Update last activity
    localStorage.setItem('lastActivity', new Date().getTime());
}

// Initialize Dashboard
function initializeDashboard() {
    // Load dashboard statistics
    loadStats();
    
    // Load recent orders
    loadRecentOrders();
    
    // Load activity timeline
    loadActivityTimeline();
    
    // Start auto-refresh
    setInterval(refreshDashboard, 60000); // Refresh every minute
}

// Load Dashboard Statistics
function loadStats() {
    // Simulated data - Replace with actual API calls
    document.getElementById('totalOrders').textContent = '156';
    document.getElementById('totalRevenue').textContent = '₹45,780';
    document.getElementById('lowStockItems').textContent = '12';
    document.getElementById('newCustomers').textContent = '24';
    
    // Update trends
    updateTrends();
}

// Load Recent Orders
function loadRecentOrders() {
    const recentOrdersTable = document.getElementById('recentOrdersTable');
    if (!recentOrdersTable) return;
    
    // Simulated data - Replace with actual API calls
    const orders = [
        { id: 'ORD001', customer: 'Rahul Sharma', amount: '₹1,200', status: 'Delivered', date: '2024-03-15' },
        { id: 'ORD002', customer: 'Priya Patel', amount: '₹850', status: 'Processing', date: '2024-03-15' },
        { id: 'ORD003', customer: 'Amit Kumar', amount: '₹2,100', status: 'Pending', date: '2024-03-14' }
    ];
    
    recentOrdersTable.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.amount}</td>
            <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>${order.date}</td>
        </tr>
    `).join('');
}

// Initialize Sales Chart
function initializeSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: '#4CAF50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Initialize Products Chart
function initializeProductsChart() {
    const ctx = document.getElementById('productsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Kaju Katli', 'Gulab Jamun', 'Rasmalai', 'Soan Papdi', 'Ladoo'],
            datasets: [{
                label: 'Sales',
                data: [12, 19, 3, 5, 2],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FFC107',
                    '#9C27B0',
                    '#F44336'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Handle Logout
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('lastActivity');
    window.location.href = 'admin-login.html';
}

// Toggle Sidebar
function toggleSidebar() {
    document.querySelector('.admin-container').classList.toggle('sidebar-collapsed');
}

// Refresh Dashboard
function refreshDashboard() {
    checkAuth();
    loadStats();
    loadRecentOrders();
}

// Update Trends
function updateTrends() {
    document.getElementById('orderTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 12%';
    document.getElementById('revenueTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 15%';
    document.getElementById('lowStockTrend').innerHTML = '<i class="fas fa-arrow-down"></i> 8%';
    document.getElementById('customerTrend').innerHTML = '<i class="fas fa-arrow-up"></i> 20%';
}

function updateDashboardUI(data) {
    // Update stats
    updateStats(data.stats);

    // Update recent orders
    updateRecentOrders(data.recentOrders);

    // Update activity timeline
    updateActivityTimeline(data.recentActivity);

    // Update charts
    updateCharts(data.chartData);
}

function updateStats(stats) {
    // Update Total Orders
    document.getElementById('totalOrders').textContent = stats.totalOrders.toLocaleString();
    updateTrend('orderTrend', stats.orderTrend);

    // Update Revenue
    document.getElementById('totalRevenue').textContent = `₹${stats.revenue.toLocaleString()}`;
    updateTrend('revenueTrend', stats.revenueTrend);

    // Update Low Stock Items
    document.getElementById('lowStockItems').textContent = stats.lowStockItems;
    updateTrend('lowStockTrend', stats.lowStockTrend);

    // Update New Customers
    document.getElementById('newCustomers').textContent = stats.newCustomers;
    updateTrend('customerTrend', stats.customerTrend);
}

function updateTrend(elementId, trend) {
    const element = document.getElementById(elementId);
    const icon = element.querySelector('i');
    const value = element.textContent.trim();

    if (trend > 0) {
        element.className = 'trend positive';
        icon.className = 'fas fa-arrow-up';
        element.textContent = `${trend}%`;
    } else {
        element.className = 'trend negative';
        icon.className = 'fas fa-arrow-down';
        element.textContent = `${Math.abs(trend)}%`;
    }
}

function updateRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    tbody.innerHTML = '';

    if (!orders || orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No recent orders</td>
            </tr>
        `;
        return;
    }

    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customerName}</td>
            <td>₹${order.amount.toLocaleString()}</td>
            <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateActivityTimeline(activities) {
    const timeline = document.getElementById('activityTimeline');
    timeline.innerHTML = '';

    if (!activities || activities.length === 0) {
        timeline.innerHTML = `
            <div class="activity-item">
                <div class="activity-content">
                    <p>No recent activity</p>
                </div>
            </div>
        `;
        return;
    }

    activities.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <div class="activity-icon ${activity.type.toLowerCase()}">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.description}</p>
                <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
            </div>
        `;
        timeline.appendChild(div);
    });
}

function getActivityIcon(type) {
    switch (type.toLowerCase()) {
        case 'order':
            return 'fa-shopping-cart';
        case 'customer':
            return 'fa-user';
        case 'product':
            return 'fa-box';
        case 'inventory':
            return 'fa-warehouse';
        case 'payment':
            return 'fa-credit-card';
        default:
            return 'fa-info-circle';
    }
}

function formatTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else {
        return `${days} days ago`;
    }
}

function updateCharts(chartData) {
    if (!chartData) return;

    // Update sales chart
    if (chartData.sales) {
        window.salesChart.data.labels = chartData.sales.labels;
        window.salesChart.data.datasets[0].data = chartData.sales.data;
        window.salesChart.update();
    }

    // Update products chart
    if (chartData.products) {
        window.productsChart.data.labels = chartData.products.labels;
        window.productsChart.data.datasets[0].data = chartData.products.data;
        window.productsChart.update();
    }
}

function setupEventListeners() {
    // Sidebar toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('sidebar-hidden');
    });

    // Chart type toggles
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.chart-container');
            const chartId = container.querySelector('canvas').id;
            const newType = btn.dataset.type;

            // Update active button
            container.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update chart type
            if (chartId === 'salesChart') {
                window.salesChart.config.type = newType;
                window.salesChart.update();
            } else if (chartId === 'productsChart') {
                window.productsChart.config.type = newType;
                window.productsChart.update();
            }
        });
    });

    // Date range selector
    const dateRange = document.getElementById('dateRange');
    dateRange.addEventListener('change', () => {
        loadDashboardData();
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // Implement search functionality
            console.log('Searching for:', e.target.value);
        }, 300);
    });

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        window.location.href = 'admin-login.html';
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
} 