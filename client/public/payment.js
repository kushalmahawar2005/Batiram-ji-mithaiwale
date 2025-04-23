// Initialize Stripe with the test publishable key
const stripe = Stripe('pk_test_51O5QI5SCk0czZZtPLGpbYXrRB5YgqE0f6EHs5YPKTHHEYhMT5rRkNPWvKE7DtW7YRNHcWJEXvwEGrHO1abvL4Zzk00DqEXFEYH');
let elements;
let paymentElement;

// Load cart data and initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    loadCartData();
    initializePaymentMethods();
    initializeStripe();
});

// Load cart data from localStorage
function loadCartData() {
    try {
        console.log('Loading cart data...');
        const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
        console.log('Cart data:', cart);
        
        const orderItems = document.getElementById('orderItems');
        const subtotal = document.getElementById('subtotal');
        const total = document.getElementById('total');
        const deliveryFee = 40;

        if (!orderItems) {
            console.error('Order items container not found');
            return;
        }

        // Clear existing items
        orderItems.innerHTML = '';

        // Add each item to the summary
        cart.items.forEach(item => {
            console.log('Processing item:', item);
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                <div class="order-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} x ${item.quantity}</p>
                </div>
                <div class="item-price">₹${item.price * item.quantity}</div>
            `;
            orderItems.appendChild(itemElement);
        });

        // Update totals
        const subtotalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log('Subtotal:', subtotalAmount);
        
        if (subtotal) subtotal.textContent = `₹${subtotalAmount}`;
        if (total) total.textContent = `₹${subtotalAmount + deliveryFee}`;
    } catch (error) {
        console.error('Error loading cart data:', error);
        showError('Failed to load cart data. Please try again.');
    }
}

// Toggle cart modal
function toggleCart() {
    console.log('Toggling cart...');
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) {
        console.error('Cart modal not found');
        return;
    }
    
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
    if (cartModal.style.display === 'block') {
        updateCartDisplay();
    }
}

// Update cart display
function updateCartDisplay() {
    console.log('Updating cart display...');
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const deliveryFee = 40;

    if (!cartItems) {
        console.error('Cart items container not found');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    console.log('Cart data for display:', cart);
    
    // Calculate total
    const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('Cart subtotal:', subtotal);

    // Update cart items
    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity}</p>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-total">₹${item.price * item.quantity}</div>
        </div>
    `).join('') || '<p class="empty-cart">Your cart is empty</p>';

    // Update totals
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
    if (cartTotal) cartTotal.textContent = `₹${subtotal + deliveryFee}`;
    if (cartCount) cartCount.textContent = cart.items.reduce((count, item) => count + item.quantity, 0);
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    const item = cart.items.find(item => item.id === productId);
    
    if (!item) return;

    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        loadCartData(); // Update order summary as well
    }
}

// Remove from cart
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    cart.items = cart.items.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    loadCartData(); // Update order summary as well
    showNotification('Item removed from cart', 'success');
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };
    if (cart.items.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    toggleCart();
}

// Initialize payment methods
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
    const cardSection = document.getElementById('card-payment-section');
    const upiSection = document.getElementById('upi-payment-section');
    const submitButton = document.getElementById('submit-button');

    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            switch(e.target.value) {
                case 'card':
                    cardSection.style.display = 'block';
                    upiSection.style.display = 'none';
                    submitButton.textContent = 'Pay with Card';
                    break;
                case 'upi':
                    cardSection.style.display = 'none';
                    upiSection.style.display = 'block';
                    submitButton.textContent = 'Pay with UPI';
                    generateUPIQRCode();
                    break;
                case 'cod':
                    cardSection.style.display = 'none';
                    upiSection.style.display = 'none';
                    submitButton.textContent = 'Place Order (Cash on Delivery)';
                    break;
            }
        });
    });
}

// Initialize Stripe elements
async function initializeStripe() {
    try {
        const amount = document.getElementById('totalAmount').textContent.replace('₹', '');
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create payment intent');
        }

        const { clientSecret } = await response.json();

        const appearance = {
            theme: 'stripe',
            variables: {
                colorPrimary: '#D4AF37',
                colorBackground: '#FFF8DC',
                colorText: '#333333',
                colorDanger: '#8B0000',
                fontFamily: 'Poppins, sans-serif',
            }
        };

        elements = stripe.elements({ appearance, clientSecret });
        paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');
    } catch (error) {
        console.error('Error initializing Stripe:', error);
        showError('Failed to initialize payment system. Please try again later.');
    }
}

// Generate UPI QR Code
function generateUPIQRCode() {
    const amount = document.getElementById('totalAmount').textContent.replace('₹', '');
    const upiId = 'your-upi-id@bank'; // Replace with your actual UPI ID
    const merchantName = 'Bastiramji Mithai Wale';
    const transactionNote = 'Sweet Purchase';
    
    // Generate UPI URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;
    
    // Generate QR code (you'll need to implement this based on your QR library)
    // For example, using QRCode.js:
    const qrCode = document.getElementById('upi-qr-code');
    if (window.QRCode) {
        new QRCode(qrCode, {
            text: upiUrl,
            width: 200,
            height: 200
        });
    }
}

// Send confirmation notifications
async function sendConfirmationNotifications(orderDetails) {
    try {
        const response = await fetch('/api/send-confirmations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: orderDetails.billingDetails.email,
                phone: orderDetails.billingDetails.phone,
                orderId: orderDetails.orderId,
                amount: orderDetails.total,
                items: orderDetails.items,
                shippingAddress: orderDetails.billingDetails.address
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send confirmation notifications');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending confirmations:', error);
        throw new Error('Failed to send confirmation messages');
    }
}

// Handle form submission
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
    const submitButton = document.getElementById('submit-button');
    const spinner = document.getElementById('spinner');
    const buttonText = document.getElementById('button-text');
    
    // Validate form
    if (!validateForm()) {
        return;
    }

    // Check terms and conditions
    if (!document.getElementById('terms').checked) {
        showError('Please accept the terms and conditions to proceed.');
        return;
    }
    
    // Disable the submit button and show spinner
    submitButton.disabled = true;
    spinner.classList.remove('hidden');
    buttonText.classList.add('hidden');

    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    
    try {
        // Show processing message
        showProcessingMessage('Processing your payment...');
        
        // Collect billing details
        const billingDetails = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: {
                line1: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                postal_code: document.getElementById('pincode').value,
            },
            notes: document.getElementById('notes').value
        };

        let success = false;
        let orderDetails = null;

        switch(paymentMethod) {
            case 'card':
                buttonText.textContent = 'Processing Card Payment...';
                success = await handleCardPayment(billingDetails);
                if (success) {
                    orderDetails = await createOrder(billingDetails, 'card');
                }
                break;
            case 'upi':
                buttonText.textContent = 'Confirming UPI Payment...';
                success = await handleUPIPayment(billingDetails);
                if (success) {
                    orderDetails = await createOrder(billingDetails, 'upi');
                }
                break;
            case 'cod':
                buttonText.textContent = 'Confirming Order...';
                success = await handleCODPayment(billingDetails);
                if (success) {
                    orderDetails = await createOrder(billingDetails, 'cod');
                }
                break;
        }

        if (success && orderDetails) {
            // Send confirmation notifications
            await sendConfirmationNotifications(orderDetails);
            
            showSuccessMessage('Order confirmed! Check your email and phone for confirmation.');
            // Clear cart and redirect to success page
            localStorage.removeItem('cart');
            setTimeout(() => {
                window.location.href = '/order-success.html';
            }, 2000);
        }
    } catch (error) {
        showError(error.message);
        buttonText.textContent = 'Try Again';
    } finally {
        // Re-enable the submit button and hide spinner
        submitButton.disabled = false;
        spinner.classList.add('hidden');
        buttonText.classList.remove('hidden');
    }
});

// Create order in the system
async function createOrder(billingDetails, paymentMethod) {
    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                billingDetails,
                items: JSON.parse(localStorage.getItem('cart')),
                total: document.getElementById('totalAmount').textContent.replace('₹', ''),
                paymentMethod,
                orderDate: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }

        return await response.json();
        } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order. Please try again.');
    }
}

// Initialize Razorpay
async function initializeRazorpay() {
    try {
        const amount = document.getElementById('totalAmount').textContent.replace('₹', '');
        const response = await fetch('/api/payment/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create payment intent');
        }

        const order = await response.json();
        return order;
    } catch (error) {
        console.error('Error initializing Razorpay:', error);
        showError('Failed to initialize payment system. Please try again later.');
        return null;
    }
}

// Handle card payment
async function handleCardPayment(billingDetails) {
    try {
        const order = await initializeRazorpay();
        if (!order) return false;

        const options = {
            key: process.env.RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Bastiramji Mithai Wale',
            description: 'Sweet Purchase',
            order_id: order.id,
            handler: function(response) {
                verifyPayment(response, billingDetails);
            },
            prefill: {
                name: billingDetails.name,
                email: billingDetails.email,
                contact: billingDetails.phone
            },
            theme: {
                color: '#D4AF37'
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
        return true;
    } catch (error) {
        console.error('Error processing card payment:', error);
        showError('Failed to process payment. Please try again.');
        return false;
    }
}

// Verify payment
async function verifyPayment(response, billingDetails) {
    try {
        const verifyResponse = await fetch('/api/payment/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
            })
        });

        if (!verifyResponse.ok) {
            throw new Error('Payment verification failed');
        }

        const result = await verifyResponse.json();
        if (result.success) {
            // Create order in the system
            const orderDetails = await createOrder(billingDetails, 'card', response.razorpay_payment_id);
            if (orderDetails) {
                showSuccessMessage('Payment successful! Your order has been placed.');
                // Clear cart and redirect to success page
                localStorage.removeItem('cart');
                window.location.href = '/order-success.html';
            }
        } else {
            showError('Payment verification failed. Please try again.');
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        showError('Failed to verify payment. Please contact support.');
    }
}

// Handle UPI payment
async function handleUPIPayment(billingDetails) {
    try {
        const response = await fetch('/api/verify-upi-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: document.getElementById('totalAmount').textContent.replace('₹', ''),
                upiId: document.getElementById('upi_id').value,
                billingDetails
            })
        });

        if (!response.ok) {
            throw new Error('UPI payment verification failed');
        }

        return true;
    } catch (error) {
        console.error('Error verifying UPI payment:', error);
        throw new Error('Failed to verify UPI payment. Please try again.');
    }
}

// Handle Cash on Delivery
async function handleCODPayment(billingDetails) {
    try {
        const response = await fetch('/api/create-cod-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                billingDetails,
                items: JSON.parse(localStorage.getItem('cart')),
                total: document.getElementById('totalAmount').textContent.replace('₹', '')
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create COD order');
        }

        return true;
    } catch (error) {
        console.error('Error creating COD order:', error);
        throw new Error('Failed to place order. Please try again.');
    }
}

// Form validation function
function validateForm() {
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    let isValid = true;

    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            showError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            element.focus();
            isValid = false;
        }
    });

    // Validate email format
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        document.getElementById('email').focus();
        isValid = false;
    }

    // Validate phone number (10 digits)
    const phone = document.getElementById('phone').value;
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        showError('Please enter a valid 10-digit phone number');
        document.getElementById('phone').focus();
        isValid = false;
    }

    // Validate PIN code (6 digits)
    const pincode = document.getElementById('pincode').value;
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
        showError('Please enter a valid 6-digit PIN code');
        document.getElementById('pincode').focus();
        isValid = false;
    }

    return isValid;
}

// Show processing message
function showProcessingMessage(message) {
    const messageDiv = document.getElementById('payment-message');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.color = '#D4AF37';
    messageDiv.style.backgroundColor = '#FFF8DC';
}

// Show success message
function showSuccessMessage(message) {
    const messageDiv = document.getElementById('payment-message');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.color = '#008000';
    messageDiv.style.backgroundColor = '#E8F5E9';
}

// Show error message (enhanced)
function showError(message) {
    const messageDiv = document.getElementById('payment-message');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    messageDiv.style.color = '#DC3545';
    messageDiv.style.backgroundColor = '#FFF3F4';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Add some additional styles for the spinner
const style = document.createElement('style');
style.textContent = `
    .spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #ffffff;
        animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .hidden {
        display: none;
    }
`; 