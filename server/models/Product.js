const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['sweets', 'namkeen', 'boxes', 'dry-fruits']
    },
    subcategory: {
        type: String,
        required: true,
        enum: ['dry-fruit-sweets', 'bengali-sweets', 'milk-sweets', 'festive-sweets', 'mawa-sweets', 'south-indian', 'Indian-sweets', 'seasonal-sweets', 'all']
    },
    images: [{
        type: String,
        required: true
    }],
    rating: {
        type: String,
        default: '4.5/5'
    },
    badge: {
        type: String,
        enum: ['Bestseller', 'Popular', 'Classic', 'Festive', 'Traditional', 'Premium', 'Seasonal', 'Corporate', 'Healthy', null],
        default: null
    },
    ingredients: {
        type: String,
        required: true
    },
    shelfLife: {
        type: String,
        required: true
    },
    packaging: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    lowStockAlert: {
        type: Number,
        required: true,
        default: 10
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
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
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', productSchema); 