// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../model/productSchema'); // Product modelinizin yolunu ayarlayın

// POST endpoint to create a new product
router.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(400).json({ 
      message: 'Error creating product', 
      error: error.errors || error.message // Send specific validation errors
    });
  }
});



// GET endpoint to fetch all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

module.exports = router;
