const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryCharges: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        name: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        phone: String
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    deliveryTimeSlot: {
        type: String,
        enum: ['9AM-12PM', '12PM-3PM', '3PM-6PM', '6PM-9PM'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'online'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    trackingNumber: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Order', orderSchema); 