const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Format order items for email
function formatOrderItems(items) {
    return items.map(item => 
        `${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`
    ).join('\n');
}

// Send email confirmation
async function sendEmailConfirmation(orderDetails) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: orderDetails.email,
        subject: `Order Confirmation - #${orderDetails.orderId}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #D4AF37; text-align: center;">Order Confirmation</h1>
                <p>Dear ${orderDetails.billingDetails.name},</p>
                <p>Thank you for your order! Your order details are below:</p>
                
                <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0;">
                    <h2 style="color: #333;">Order #${orderDetails.orderId}</h2>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Total Amount:</strong> ₹${orderDetails.amount}</p>
                </div>

                <h3 style="color: #333;">Order Items:</h3>
                <div style="background-color: #f8f8f8; padding: 15px;">
                    ${formatOrderItems(orderDetails.items)}
                </div>

                <h3 style="color: #333;">Shipping Address:</h3>
                <div style="background-color: #f8f8f8; padding: 15px;">
                    <p>${orderDetails.shippingAddress.line1}</p>
                    <p>${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state}</p>
                    <p>PIN: ${orderDetails.shippingAddress.postal_code}</p>
                </div>

                <p style="margin-top: 20px;">We will notify you once your order is shipped.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <p style="color: #666;">Thank you for shopping with us!</p>
                    <p style="color: #666;">Bastiramji Mithai Wale</p>
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
}

// Send SMS confirmation
async function sendSMSConfirmation(orderDetails) {
    const message = `Order Confirmed! #${orderDetails.orderId}\nAmount: ₹${orderDetails.amount}\nThank you for shopping with Bastiramji Mithai Wale. Track your order status online.`;
    
    return twilioClient.messages.create({
        body: message,
        to: orderDetails.phone,
        from: process.env.TWILIO_PHONE_NUMBER
    });
}

// Handle confirmation notifications
async function handleConfirmations(req, res) {
    try {
        const orderDetails = req.body;

        // Send email confirmation
        await sendEmailConfirmation(orderDetails);

        // Send SMS confirmation
        await sendSMSConfirmation(orderDetails);

        res.status(200).json({ 
            success: true, 
            message: 'Confirmation notifications sent successfully' 
        });
    } catch (error) {
        console.error('Error sending confirmations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send confirmation notifications' 
        });
    }
}

module.exports = {
    handleConfirmations
}; 