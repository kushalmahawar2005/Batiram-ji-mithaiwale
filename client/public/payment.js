// Payment system initialization
const payment = {
    cartData: null,
    selectedMethod: null,
    razorpay: null,
    qrCode: null,

    // Initialize payment system
    init() {
        this.loadCartData();
        this.setupEventListeners();
        this.initializeRazorpay();
    },

// Load cart data from localStorage
    loadCartData() {
        try {
            const cartData = localStorage.getItem('cartData');
            if (!cartData) {
                this.showToast('Cart is empty', 'error');
                setTimeout(() => window.location.href = 'index.html', 2000);
                return;
            }

            this.cartData = JSON.parse(cartData);
            
            // Validate cart data structure
            if (!this.cartData.items || !Array.isArray(this.cartData.items) || this.cartData.items.length === 0) {
                console.error('Invalid cart data:', this.cartData);
                this.showToast('Invalid cart data', 'error');
                setTimeout(() => window.location.href = 'index.html', 2000);
            return;
        }

            // Calculate totals if not present
            if (!this.cartData.subtotal || !this.cartData.tax || !this.cartData.total) {
                this.calculateTotals();
            }

            this.updateOrderSummary();
        } catch (error) {
            console.error('Error loading cart data:', error);
            this.showToast('Error loading cart data', 'error');
            setTimeout(() => window.location.href = 'index.html', 2000);
        }
    },

    // Calculate totals
    calculateTotals() {
        this.cartData.subtotal = this.cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartData.tax = this.cartData.subtotal * 0.18; // 18% GST
        this.cartData.total = this.cartData.subtotal + this.cartData.tax;
    },

    // Update order summary display
    updateOrderSummary() {
        try {
            const orderItems = document.getElementById('order-items');
            const subtotalEl = document.getElementById('subtotal');
            const taxEl = document.getElementById('tax');
            const totalEl = document.getElementById('total');

            if (!orderItems || !subtotalEl || !taxEl || !totalEl) {
                throw new Error('Required elements not found');
            }

        // Clear existing items
        orderItems.innerHTML = '';

            // Add items to summary
            this.cartData.items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'order-item';
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='images/placeholder.jpg'">
                <div class="order-item-details">
                        <h4>${item.title}</h4>
                    <p>₹${item.price} x ${item.quantity}</p>
                </div>
                    <div class="item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
            `;
                orderItems.appendChild(itemEl);
        });

        // Update totals
            subtotalEl.textContent = `₹${this.cartData.subtotal.toFixed(2)}`;
            taxEl.textContent = `₹${this.cartData.tax.toFixed(2)}`;
            totalEl.textContent = `₹${this.cartData.total.toFixed(2)}`;
        
            // Store total amount for order confirmation
            localStorage.setItem('totalAmount', `₹${this.cartData.total.toFixed(2)}`);
    } catch (error) {
            console.error('Error updating order summary:', error);
            this.showToast('Error updating order summary', 'error');
        }
    },

    // Setup event listeners
    setupEventListeners() {
        try {
            // Payment method selection
            document.querySelectorAll('.payment-method').forEach(method => {
                method.addEventListener('click', () => this.selectPaymentMethod(method.dataset.method));
            });

            // Place order button
            const placeOrderBtn = document.getElementById('place-order');
            if (placeOrderBtn) {
                placeOrderBtn.addEventListener('click', () => this.handlePlaceOrder());
            }

            // Form validation
            const paymentForm = document.getElementById('payment-form');
            if (paymentForm) {
                paymentForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handlePlaceOrder();
                });
            }
        } catch (error) {
            console.error('Error setting up event listeners:', error);
            this.showToast('Error setting up payment system', 'error');
        }
    },

    // Select payment method
    selectPaymentMethod(method) {
        try {
            this.selectedMethod = method;
            
            // Store payment method for order confirmation
            localStorage.setItem('paymentMethod', method === 'card' ? 'Card Payment' : 
                method === 'upi' ? 'UPI Payment' : 'Cash on Delivery');
            
            // Update UI
            document.querySelectorAll('.payment-method').forEach(el => {
                el.classList.toggle('selected', el.dataset.method === method);
            });

            // Show/hide payment sections
            const sections = {
                'card': document.getElementById('card-payment'),
                'upi': document.getElementById('upi-payment'),
                'cod': document.getElementById('cod-payment')
            };

            Object.entries(sections).forEach(([key, section]) => {
                if (section) {
                    section.style.display = key === method ? 'block' : 'none';
                }
            });

            // Generate UPI QR code if UPI selected
            if (method === 'upi') {
                this.generateUPIQR();
            }
        } catch (error) {
            console.error('Error selecting payment method:', error);
            this.showToast('Error selecting payment method', 'error');
        }
    },

    // Initialize Razorpay
    initializeRazorpay() {
        try {
            this.razorpay = new Razorpay({
                key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay key
                currency: 'INR',
                name: 'Bastiramji Mithai Wale',
                description: 'Payment for your order',
                handler: (response) => this.handlePaymentSuccess(response),
                prefill: {
                    name: document.getElementById('name')?.value || '',
                    email: document.getElementById('email')?.value || '',
                    contact: document.getElementById('phone')?.value || ''
                },
                theme: {
                    color: '#8B0000'
                }
            });
        } catch (error) {
            console.error('Error initializing Razorpay:', error);
            this.showToast('Error initializing payment gateway', 'error');
        }
    },

    // Generate UPI QR code
    generateUPIQR() {
        try {
            const qrContainer = document.getElementById('qr-code');
            if (!qrContainer) return;

            qrContainer.innerHTML = '';
            
            if (this.qrCode) {
                this.qrCode.clear();
            }

            const upiId = document.getElementById('upi-id')?.value || 'example@upi';
            const amount = this.cartData.total;
            
            this.qrCode = new QRCode(qrContainer, {
                text: `upi://pay?pa=${upiId}&pn=Bastiramji Mithai Wale&am=${amount}`,
                width: 200,
                height: 200
            });
        } catch (error) {
            console.error('Error generating UPI QR code:', error);
            this.showToast('Error generating UPI QR code', 'error');
        }
    },

    // Handle place order
    handlePlaceOrder() {
        try {
            if (!this.validateForm()) {
        return;
    }

            const button = document.getElementById('place-order');
            if (!button) return;

            button.disabled = true;
            button.textContent = 'Processing...';

            switch (this.selectedMethod) {
                case 'card':
                    this.processCardPayment();
                    break;
                case 'upi':
                    this.processUPIPayment();
                    break;
                case 'cod':
                    this.processCODPayment();
                    break;
                default:
                    this.showToast('Please select a payment method', 'error');
                    button.disabled = false;
                    button.textContent = 'Place Order';
            }
        } catch (error) {
            console.error('Error placing order:', error);
            this.showToast('Error placing order', 'error');
            const button = document.getElementById('place-order');
            if (button) {
                button.disabled = false;
                button.textContent = 'Place Order';
            }
        }
    },
    
    // Validate form
    validateForm() {
        try {
            const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'pincode'];
            const missingFields = requiredFields.filter(field => {
                const element = document.getElementById(field);
                return !element || !element.value.trim();
            });

            if (missingFields.length > 0) {
                this.showToast(`Please fill in: ${missingFields.join(', ')}`, 'error');
                return false;
            }

            if (!this.selectedMethod) {
                this.showToast('Please select a payment method', 'error');
                return false;
            }

            // Validate email format
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.showToast('Please enter a valid email address', 'error');
                return false;
            }

            // Validate phone number
            const phone = document.getElementById('phone').value;
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone)) {
                this.showToast('Please enter a valid 10-digit phone number', 'error');
                return false;
            }

            // Validate pincode
            const pincode = document.getElementById('pincode').value;
            const pincodeRegex = /^\d{6}$/;
            if (!pincodeRegex.test(pincode)) {
                this.showToast('Please enter a valid 6-digit pincode', 'error');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error validating form:', error);
            this.showToast('Error validating form', 'error');
            return false;
        }
    },

    // Process card payment
    processCardPayment() {
        try {
        const options = {
                amount: Math.round(this.cartData.total * 100), // Convert to paise
                currency: 'INR',
            name: 'Bastiramji Mithai Wale',
                description: 'Payment for your order',
                handler: (response) => this.handlePaymentSuccess(response),
            prefill: {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    contact: document.getElementById('phone').value
            },
            theme: {
                    color: '#8B0000'
            }
        };

            this.razorpay.open(options);
    } catch (error) {
        console.error('Error processing card payment:', error);
            this.showToast('Error processing card payment', 'error');
            const button = document.getElementById('place-order');
            if (button) {
                button.disabled = false;
                button.textContent = 'Place Order';
            }
        }
    },

    // Process UPI payment
    processUPIPayment() {
        try {
            const upiId = document.getElementById('upi-id').value;
            if (!upiId) {
                this.showToast('Please enter UPI ID', 'error');
                return;
            }

            // Simulate UPI payment success
            setTimeout(() => {
                this.handlePaymentSuccess({ payment_id: 'upi_' + Date.now() });
            }, 2000);
        } catch (error) {
            console.error('Error processing UPI payment:', error);
            this.showToast('Error processing UPI payment', 'error');
            const button = document.getElementById('place-order');
            if (button) {
                button.disabled = false;
                button.textContent = 'Place Order';
            }
        }
    },

    // Process COD payment
    processCODPayment() {
        try {
            // Simulate COD order placement
            setTimeout(() => {
                this.handlePaymentSuccess({ payment_id: 'cod_' + Date.now() });
            }, 1000);
    } catch (error) {
            console.error('Error processing COD payment:', error);
            this.showToast('Error processing COD payment', 'error');
            const button = document.getElementById('place-order');
            if (button) {
                button.disabled = false;
                button.textContent = 'Place Order';
            }
        }
    },

    // Handle payment success
    handlePaymentSuccess(response) {
        try {
            // Store payment details
            localStorage.setItem('lastPaymentId', response.payment_id);
            
            // Clear cart data from localStorage
            localStorage.removeItem('cartData');
            
            // Clear cart in CartManager if it exists
            if (typeof cartManager !== 'undefined') {
                cartManager.clearCart();
            }
            
            // Show success message
            this.showToast('Payment successful! Redirecting to order confirmation...', 'success');
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = 'order-confirmation.html';
            }, 2000);
        } catch (error) {
            console.error('Error handling payment success:', error);
            this.showToast('Error processing payment success', 'error');
        }
    },

    // Show toast message
    showToast(message, type = 'info') {
        try {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.remove();
            }, 3000);
    } catch (error) {
            console.error('Error showing toast:', error);
        }
    }
};

// Initialize payment system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => payment.init()); 