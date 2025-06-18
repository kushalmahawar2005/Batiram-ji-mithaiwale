const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/payment');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payment', paymentRoutes);

// ... rest of your existing routes ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 