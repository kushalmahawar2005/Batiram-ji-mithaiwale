

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const connectDB = require('./config/database');
const config = require('./config');

// Debug configuration
console.log('🔍 Configuration Debug:');
console.log('PORT:', config.PORT);
console.log('NODE_ENV:', config.NODE_ENV);
console.log('TWILIO_ACCOUNT_SID:', config.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Not Set');
console.log('TWILIO_AUTH_TOKEN:', config.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Not Set');
console.log('TWILIO_PHONE_NUMBER:', config.TWILIO_PHONE_NUMBER ? '✅ Set' : '❌ Not Set');
console.log('JWT_SECRET:', config.JWT_SECRET ? '✅ Set' : '❌ Not Set');
console.log('');

// Create Express app
const app = express();

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(mongoSanitize()); // Prevents NoSQL injection

// Rate limiting
const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: config.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter); // Apply rate limiting to all API routes

// Request logging
app.use(morgan('dev')); // Logs HTTP requests

// Basic Middleware
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:5500', 
        'http://localhost:5500', 
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5501',
        'http://localhost:5501',
        'http://127.0.0.1:5502',
        'http://localhost:5502'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: config.MAX_FILE_SIZE || '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: config.MAX_FILE_SIZE || '10mb' }));

// Connect to MongoDB
// connectDB(); // Commented out for now to start server without MongoDB

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
    });
});

// Test users endpoint
app.get('/api/users/test', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Users route is working',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: err.message || 'Something went wrong!',
        stack: config.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${config.NODE_ENV || 'development'}`);
    console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🔐 Users API: http://localhost:${PORT}/api/users`);
    console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
}); 