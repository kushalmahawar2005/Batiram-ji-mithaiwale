const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const connectDB = require('./config/database');
const config = require('./config');

// Debug configuration
console.log('🔍 Configuration Debug:');
console.log('PORT:', process.env.PORT || config.PORT);
console.log('NODE_ENV:', config.NODE_ENV);
console.log('TWILIO_ACCOUNT_SID:', config.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Not Set');
console.log('TWILIO_AUTH_TOKEN:', config.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Not Set');
console.log('TWILIO_PHONE_NUMBER:', config.TWILIO_PHONE_NUMBER ? '✅ Set' : '❌ Not Set');
console.log('JWT_SECRET:', config.JWT_SECRET ? '✅ Set' : '❌ Not Set');
console.log('');

// Create Express app
const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
    max: config.RATE_LIMIT_MAX || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Request logging
app.use(morgan('dev'));

// CORS
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://your-frontend.vercel.app' // 🔹 Render pe backend, Vercel pe frontend connect karne ke liye
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: config.MAX_FILE_SIZE || '10mb' }));
app.use(express.urlencoded({ extended: true, limit: config.MAX_FILE_SIZE || '10mb' }));

// Connect to MongoDB
connectDB(); // ✅ Render pe bhi Mongo connect hoga

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString(), environment: config.NODE_ENV });
});

// Error handler
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
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// ✅ Use Render's port if available
const PORT = process.env.PORT || config.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
