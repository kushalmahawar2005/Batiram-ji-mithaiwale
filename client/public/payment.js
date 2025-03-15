// Initialize Stripe with the test publishable key
const stripe = Stripe('pk_test_51O5QI5SCk0czZZtPLGpbYXrRB5YgqE0f6EHs5YPKTHHEYhMT5rRkNPWvKE7DtW7YRNHcWJEXvwEGrHO1abvL4Zzk00DqEXFEYH');
let elements;
let paymentElement;

// Load cart data and initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
    initializePaymentMethods();
    initializeStripe();
});

// Load cart data from localStorage
function loadCartData() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryItems = document.getElementById('summaryItems');
        let subtotal = 0;

        // Clear existing items
        summaryItems.innerHTML = '';

        // Add each item to the summary
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-meta">
                        <span>Quantity: ${item.quantity}</span>
                    </div>
                </div>
                <div class="item-price">₹${item.price * item.quantity}</div>
            `;
            summaryItems.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        });

        // Update totals
        document.getElementById('subtotalAmount').textContent = `₹${subtotal}`;
        document.getElementById('totalAmount').textContent = `₹${subtotal}`; // Add shipping if needed
    } catch (error) {
        console.error('Error loading cart data:', error);
        showError('Failed to load cart data. Please try again.');
    }
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

// Handle card payment
async function handleCardPayment(billingDetails) {
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: `${window.location.origin}/order-success.html`,
            payment_method_data: {
                billing_details: billingDetails
            }
        }
    });

    if (error) {
        throw new Error(error.message);
    }
    return true;
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