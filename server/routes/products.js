const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateAdmin } = require('../middleware/auth');
const Product = require('../models/Product');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/products/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product (protected route)
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, stock, description, shelfLife, weight, ingredients } = req.body;

        const product = new Product({
            name,
            category,
            price,
            stock,
            description,
            image: `/images/products/${req.file.filename}`,
            shelfLife,
            weight,
            ingredients
        });

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product (protected route)
router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, stock, description, shelfLife, weight, ingredients } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields
        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.description = description || product.description;
        product.shelfLife = shelfLife || product.shelfLife;
        product.weight = weight || product.weight;
        product.ingredients = ingredients || product.ingredients;

        // Update image if new one is uploaded
        if (req.file) {
            product.image = `/images/products/${req.file.filename}`;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product (protected route)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Search products
router.get('/search', async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const products = await Product.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 