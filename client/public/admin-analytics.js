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
const timeRange = document.getElementById('timeRange');
const customDateRange = document.querySelector('.custom-date-range');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const exportBtn = document.querySelector('.export-btn');
const refreshBtn = document.querySelector('.refresh-btn');
const chartTypeBtns = document.querySelectorAll('.chart-type-btn');
const productMetric = document.getElementById('productMetric');
const demographicMetric = document.getElementById('demographicMetric');

// Chart instances
let salesChart;
let topProductsChart;
let demographicsChart;
let orderStatusChart;

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

// Time Range Selection
timeRange.addEventListener('change', () => {
    if (timeRange.value === 'custom') {
        customDateRange.style.display = 'flex';
    } else {
        customDateRange.style.display = 'none';
        loadAnalytics();
    }
});

// Custom Date Range
startDate.addEventListener('change', loadAnalytics);
endDate.addEventListener('change', loadAnalytics);

// Chart Type Toggle
chartTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        chartTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateChartType(btn.dataset.type);
    });
});

// Metric Selection
productMetric.addEventListener('change', () => {
    loadTopProductsChart();
});

demographicMetric.addEventListener('change', () => {
    loadDemographicsChart();
});

// Export Report
exportBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/analytics/export', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        showNotification('Error exporting report', 'error');
    }
});

// Refresh Data
refreshBtn.addEventListener('click', () => {
    loadAnalytics();
});

// Load Analytics
async function loadAnalytics() {
    try {
        const dateRange = getDateRange();
        const response = await fetch(`/api/analytics?${new URLSearchParams(dateRange)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const data = await response.json();
        updateAnalytics(data);
    } catch (error) {
        showNotification('Error loading analytics', 'error');
    }
}

function getDateRange() {
    if (timeRange.value === 'custom') {
        return {
            startDate: startDate.value,
            endDate: endDate.value
        };
    }
    return { timeRange: timeRange.value };
}

function updateAnalytics(data) {
    // Update Stats
    document.getElementById('totalOrders').textContent = data.stats.totalOrders;
    document.getElementById('totalRevenue').textContent = `₹${data.stats.totalRevenue.toFixed(2)}`;
    document.getElementById('newCustomers').textContent = data.stats.newCustomers;
    document.getElementById('averageOrderValue').textContent = `₹${data.stats.averageOrderValue.toFixed(2)}`;

    // Update Charts
    updateSalesChart(data.sales);
    loadTopProductsChart();
    loadDemographicsChart();
    loadOrderStatusChart(data.orderStatus);
    updateTopCustomersTable(data.topCustomers);
    updateActivityTimeline(data.recentActivity);
}

// Sales Chart
function updateSalesChart(data) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    if (salesChart) {
        salesChart.destroy();
    }

    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Sales',
                data: data.values,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `₹${value.toFixed(2)}`
                    }
                }
            }
        }
    });
}

// Top Products Chart
async function loadTopProductsChart() {
    try {
        const response = await fetch(`/api/analytics/top-products?metric=${productMetric.value}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const data = await response.json();
        updateTopProductsChart(data);
    } catch (error) {
        showNotification('Error loading top products data', 'error');
    }
}

function updateTopProductsChart(data) {
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    if (topProductsChart) {
        topProductsChart.destroy();
    }

    topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: productMetric.value === 'revenue' ? 'Revenue' : 'Quantity',
                data: data.values,
                backgroundColor: '#2196F3'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => productMetric.value === 'revenue' ? `₹${value.toFixed(2)}` : value
                    }
                }
            }
        }
    });
}

// Demographics Chart
async function loadDemographicsChart() {
    try {
        const response = await fetch(`/api/analytics/demographics?metric=${demographicMetric.value}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const data = await response.json();
        updateDemographicsChart(data);
    } catch (error) {
        showNotification('Error loading demographics data', 'error');
    }
}

function updateDemographicsChart(data) {
    const ctx = document.getElementById('demographicsChart').getContext('2d');
    if (demographicsChart) {
        demographicsChart.destroy();
    }

    demographicsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: demographicMetric.value.charAt(0).toUpperCase() + demographicMetric.value.slice(1),
                data: data.values,
                backgroundColor: '#FF9800'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Order Status Chart
function loadOrderStatusChart(data) {
    const ctx = document.getElementById('orderStatusChart').getContext('2d');
    if (orderStatusChart) {
        orderStatusChart.destroy();
    }

    const chartType = document.querySelector('.chart-type-btn[data-type="pie"]').classList.contains('active') ? 'pie' : 'doughnut';

    orderStatusChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    '#4CAF50',
                    '#FFC107',
                    '#F44336',
                    '#2196F3',
                    '#9C27B0'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Update Chart Type
function updateChartType(type) {
    if (type === 'line' || type === 'bar') {
        salesChart.config.type = type;
        salesChart.update();
    } else if (type === 'pie' || type === 'doughnut') {
        orderStatusChart.config.type = type;
        orderStatusChart.update();
    }
}

// Top Customers Table
function updateTopCustomersTable(customers) {
    const table = document.getElementById('topCustomersTable');
    table.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.name}</td>
            <td>${customer.orders}</td>
            <td>₹${customer.totalSpent.toFixed(2)}</td>
            <td>${new Date(customer.lastOrder).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// Activity Timeline
function updateActivityTimeline(activities) {
    const timeline = document.getElementById('activityTimeline');
    timeline.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.description}</p>
                <span class="activity-time">${new Date(activity.timestamp).toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        order: 'fa-shopping-cart',
        customer: 'fa-user',
        product: 'fa-box',
        inventory: 'fa-warehouse',
        payment: 'fa-credit-card'
    };
    return icons[type] || 'fa-info-circle';
}

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
    loadAnalytics();
}); 