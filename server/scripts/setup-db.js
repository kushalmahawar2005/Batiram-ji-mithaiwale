const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const setupDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bastiramji-mithai-wale', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Create admin user if it doesn't exist
        const adminExists = await User.findOne({ email: 'admin@bastiramji.com' });
        if (!adminExists) {
            const admin = new User({
                name: 'Admin User',
                email: 'admin@bastiramji.com',
                password: 'admin123', // This will be hashed by the User model
                phone: '1234567890',
                role: 'admin'
            });

            await admin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }

        console.log('Database setup completed');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
};

setupDatabase(); 