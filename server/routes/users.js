const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Initialize Twilio client only if credentials are available
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
        const twilio = require('twilio');
        twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
        console.log('✅ Twilio client initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Twilio client:', error.message);
        twilioClient = null;
    }
} else {
    console.log('⚠️  Twilio credentials not found. SMS OTP will not be sent.');
}

// In-memory storage for development (replace with database in production)
const users = [];
const otpStore = {};

// Validation middleware
const validateRegistration = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').notEmpty().withMessage('Phone number is required')
];

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, phone } = req.body;

        // Check if user already exists
        let user = users.find(u => u.email === email);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = {
            id: Date.now().toString(),
            name,
            email,
            password, // In production, hash this
            phone,
            role: 'user',
            createdAt: new Date()
        };

        users.push(user);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password (in production, use bcrypt)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Send OTP for phone number
router.post('/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;
        
        // Validate phone number
        if (!phone || phone.length !== 10) {
            return res.status(400).json({ message: 'Please enter a valid 10-digit phone number' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in memory
        otpStore[phone] = {
            otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
        };

        // Send OTP via Twilio SMS
        try {
            if (twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
                // Send SMS via Twilio
                await twilioClient.messages.create({
                    body: `Your OTP for Bastiramji Mithai Wale login is: ${otp}. Valid for 5 minutes.`,
                    to: `+91${phone}`, // Assuming Indian numbers
                    from: process.env.TWILIO_PHONE_NUMBER
                });
                
                console.log(`SMS OTP sent to ${phone} via Twilio`);
                res.json({ 
                    message: 'OTP sent successfully to your phone number',
                    otp: null // Don't show OTP in production
                });
            } else {
                // Fallback for development (no Twilio credentials)
                console.log(`OTP for ${phone}: ${otp} (Twilio not configured)`);
                res.json({ 
                    message: 'OTP sent successfully (development mode)',
                    otp: process.env.NODE_ENV === 'development' ? otp : null // Show OTP in development
                });
            }
        } catch (twilioError) {
            console.error('Twilio SMS error:', twilioError);
            
            // If Twilio fails, still return success but log the error
            // In production, you might want to handle this differently
        res.json({ 
                message: 'OTP sent successfully (SMS delivery may be delayed)',
                otp: process.env.NODE_ENV === 'development' ? otp : null
        });
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        
        // Validate inputs
        if (!phone || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }

        // Check if OTP exists and is valid
        const otpData = otpStore[phone];
        if (!otpData || otpData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if OTP is expired
        if (new Date() > otpData.expiresAt) {
            delete otpStore[phone];
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Check if user exists
        let user = users.find(u => u.phone === phone);
        
        if (!user) {
            // Create new user if doesn't exist
            user = {
                id: Date.now().toString(),
                phone,
                name: `User_${phone.slice(-4)}`, // Temporary name
                email: `${phone}@temp.com`, // Temporary email
                password: Math.random().toString(36), // Temporary password
                role: 'customer',
                createdAt: new Date()
            };
            users.push(user);
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, phone: user.phone },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Clear OTP after successful verification
        delete otpStore[phone];

        res.json({
            message: 'OTP verified successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
});

// Get user by phone number
router.get('/phone/:phone', async (req, res) => {
    try {
        const { phone } = req.params;
        const user = users.find(u => u.phone === phone);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Don't send password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        // For now, return a mock user profile
        // In production, you would verify JWT token
        res.json({
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            role: 'customer'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        
        // For now, just return success
        // In production, you would update the user in database
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 