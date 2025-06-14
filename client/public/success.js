// Load order details from localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Get order details from localStorage
    const orderDetails = JSON.parse(localStorage.getItem('lastOrder')) || {};
    
    // Update order details display
    updateOrderDetails(orderDetails);
    
    // Clear order details from localStorage after displaying
    localStorage.removeItem('lastOrder');
});

// Update order details display
function updateOrderDetails(orderDetails) {
    const orderDetailsContainer = document.getElementById('orderDetails');
    if (!orderDetailsContainer) return;

    const orderId = orderDetails.orderId || 'ORDER_' + Date.now();
    const orderDate = new Date().toLocaleDateString();
    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString();

    orderDetailsContainer.innerHTML = `
        <div class="order-info">
            <div class="info-row">
                <span class="label">Order ID:</span>
                <span class="value">${orderId}</span>
            </div>
            <div class="info-row">
                <span class="label">Order Date:</span>
                <span class="value">${orderDate}</span>
            </div>
            <div class="info-row">
                <span class="label">Estimated Delivery:</span>
                <span class="value">${estimatedDelivery}</span>
            </div>
            <div class="info-row">
                <span class="label">Payment Method:</span>
                <span class="value">${orderDetails.paymentMethod || 'Not specified'}</span>
            </div>
        </div>
    `;
}

// Handle track order button click
document.querySelector('.track-order')?.addEventListener('click', function(e) {
    e.preventDefault();
    showNotification('Order tracking feature coming soon!', 'info');
}); 