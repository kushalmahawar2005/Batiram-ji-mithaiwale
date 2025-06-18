// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const API_ENDPOINTS = {
    auth: '/auth',
    products: '/products',
    orders: '/orders',
    users: '/users',
    payments: '/payments'
};

// Authentication
class Auth {
    static async login(username, password) {
        try {
            // For demo purposes, using hardcoded admin credentials
            if (username === 'admin' && password === 'admin123') {
                const user = {
                    id: 1,
                    name: 'Admin',
                    role: 'admin'
                };
                const token = 'demo-token-' + Date.now();
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(user));
                return { user, token };
            }
            throw new Error('Invalid credentials');
        } catch (error) {
            throw error;
        }
    }

    static async logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    }

    static isAuthenticated() {
        return !!localStorage.getItem('adminToken');
    }

    static getToken() {
        return localStorage.getItem('adminToken');
    }

    static getUser() {
        const user = localStorage.getItem('adminUser');
        return user ? JSON.parse(user) : null;
    }
}

// API Service
class ApiService {
    static async request(endpoint, options = {}) {
        const token = Auth.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            // For demo purposes, simulate API responses
            if (endpoint === API_ENDPOINTS.products) {
                return this.getMockProducts();
            }
            if (endpoint === API_ENDPOINTS.orders) {
                return this.getMockOrders();
            }
            if (endpoint === API_ENDPOINTS.users) {
                return this.getMockUsers();
            }
            if (endpoint === API_ENDPOINTS.payments) {
                return this.getMockPayments();
            }
            return {};
        } catch (error) {
            throw error;
        }
    }

    // Mock data for demo
    static getMockProducts() {
        return [
            {
                id: 1,
                name: 'Gulab Jamun',
                category: 'sweets',
                price: 450,
                stock: 100,
                description: 'Delicious Gulab Jamun',
                variants: [
                    {
                        name: '1 KG Box',
                        price: 450,
                        stock: 50,
                        sku: 'GJ-1KG'
                    },
                    {
                        name: '500g Box',
                        price: 250,
                        stock: 50,
                        sku: 'GJ-500G'
                    }
                ],
                images: ['../images/products/gulab-jamun.jpg'],
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Kaju Katli',
                category: 'sweets',
                price: 1200,
                stock: 50,
                description: 'Premium Kaju Katli',
                variants: [
                    {
                        name: '1 KG Box',
                        price: 1200,
                        stock: 25,
                        sku: 'KK-1KG'
                    },
                    {
                        name: '500g Box',
                        price: 650,
                        stock: 25,
                        sku: 'KK-500G'
                    }
                ],
                images: ['../images/products/kaju-katli.jpg'],
                createdAt: new Date().toISOString()
            }
        ];
    }

    static getMockOrders() {
        return [
            {
                id: 1,
                customer: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '1234567890'
                },
                items: [
                    {
                        product: 'Gulab Jamun',
                        quantity: 2,
                        price: 450
                    }
                ],
                total: 900,
                status: 'pending',
                paymentStatus: 'paid',
                createdAt: new Date().toISOString()
            }
        ];
    }

    static getMockUsers() {
        return [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
    }

    static getMockPayments() {
        return [
            {
                id: 1,
                orderId: 101,
                amount: 1500,
                method: 'razorpay',
                status: 'completed',
                createdAt: new Date('2024-03-15T10:30:00')
            },
            {
                id: 2,
                orderId: 102,
                amount: 2500,
                method: 'cod',
                status: 'pending',
                createdAt: new Date('2024-03-15T11:45:00')
            },
            {
                id: 3,
                orderId: 103,
                amount: 1800,
                method: 'razorpay',
                status: 'failed',
                createdAt: new Date('2024-03-15T12:15:00')
            },
            {
                id: 4,
                orderId: 104,
                amount: 3200,
                method: 'razorpay',
                status: 'completed',
                createdAt: new Date('2024-03-15T13:20:00')
            },
            {
                id: 5,
                orderId: 105,
                amount: 950,
                method: 'cod',
                status: 'pending',
                createdAt: new Date('2024-03-15T14:10:00')
            }
        ];
    }

    // Products
    static async getProducts() {
        return this.request(API_ENDPOINTS.products);
    }

    static async createProduct(productData) {
        // For demo, just return the product data with an ID
        return { ...productData, id: Date.now() };
    }

    static async updateProduct(id, productData) {
        // For demo, just return the updated product data
        return { ...productData, id };
    }

    static async deleteProduct(id) {
        // For demo, just return success
        return { success: true };
    }

    // Orders
    static async getOrders() {
        return this.request(API_ENDPOINTS.orders);
    }

    static async updateOrderStatus(id, status) {
        // For demo, just return success
        return { success: true };
    }

    // Users
    static async getUsers() {
        return this.request(API_ENDPOINTS.users);
    }

    static async updateUserStatus(id, status) {
        // For demo, just return success
        return { success: true };
    }

    // Payments
    static async getPayments() {
        return this.request(API_ENDPOINTS.payments);
    }
}

// UI Components
class UI {
    static showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.remove();
        }, 3000);
    }

    static showLoading() {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        document.body.appendChild(spinner);
    }

    static hideLoading() {
        const spinner = document.querySelector('.spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
}

// Real-time Updates
class RealTimeUpdates {
    static socket = null;

    static connect() {
        // For demo, we'll skip WebSocket connection
        console.log('Real-time updates disabled in demo mode');
    }

    static handleUpdate(data) {
        // For demo, just show a notification
        UI.showNotification('New update received', 'info');
    }
}

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication only if not on login page
    if (!window.location.pathname.includes('login.html')) {
        // If not authenticated, redirect to login
        if (!Auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
    }

    // Initialize real-time updates
    RealTimeUpdates.connect();

    // Setup sidebar toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Setup logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }

    // Update admin profile
    const adminUser = Auth.getUser();
    const adminProfile = document.querySelector('.admin-profile span');
    if (adminProfile && adminUser) {
        adminProfile.textContent = adminUser.name;
    }
});

// Export modules
window.Auth = Auth;
window.ApiService = ApiService;
window.UI = UI;
window.RealTimeUpdates = RealTimeUpdates; 