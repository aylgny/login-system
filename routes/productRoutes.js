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

// GET endpoint to fetch a single product by ID
router.get('/products/:id', async (req, res) => {
  console.log('ID received in request:', req.params.id); // Log the ID
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID not provided' });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error.message);
    res.status(400).json({ message: 'Error fetching product', error: error.message });
  }
});

// Add Review to a Product
router.post("/products/:productId/reviews", async (req, res) => {
  const { productId } = req.params;
  const { userId, rating, comment } = req.body;

  if (!userId || !rating) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if the user already reviewed the product
    const existingReview = product.ratings.find(
      (review) => review.user.toString() === userId
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product." });
    }

    // Add the new review to the product
    product.ratings.push({ user: userId, rating, comment });

    await product.save();
    res.status(200).json({ message: "Review added successfully." });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to add review." });
  }
});



module.exports = router;
