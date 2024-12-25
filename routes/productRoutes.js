// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../model/productSchema'); // Product modelinizin yolunu ayarlayın

// POST endpoint to create a new product
router.post('/addProduct', async (req, res) => {
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

// DELETE endpoint to remove a product by ID
router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID not provided' });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ 
      message: 'Error deleting product', 
      error: error.message 
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


// GET endpoint to fetch all comments with `approved` status = "waiting"
// this is how it supposed to use http://localhost:5000/api/reviews/waiting
router.get('/reviews/waiting', async (req, res) => {
  try {
    // 1) Find all products that have at least one rating with approved = "waiting"
    // 2) Use .populate if you want to fetch user details as well
    //    e.g. .populate('ratings.user', 'firstName lastName email')
    const productsWithWaitingReviews = await Product.find(
      { 'ratings.approved': 'waiting' },  // Query for sub-documents in `ratings` array
      { name: 1, ratings: 1 }             // Projection to return only product name & ratings
    ).populate('ratings.user', 'firstName lastName email'); // optional user details

    // We only want to return the reviews that are "waiting", 
    // so we'll filter them out from the product's ratings array.
    const allWaitingReviews = [];

    productsWithWaitingReviews.forEach(product => {
      product.ratings.forEach(rating => {
        if (rating.approved === 'waiting') {
          allWaitingReviews.push({
            productId: product._id,
            productName: product.name,
            user: rating.user,        // This will include user details if populated
            rating: rating.rating,
            comment: rating.comment,
            approved: rating.approved
          });
        }
      });
    });

    if (allWaitingReviews.length === 0) {
      return res.status(404).json({ message: "No new reviews." });
    }

    res.status(200).json(allWaitingReviews);

  } catch (error) {
    console.error("Error fetching waiting reviews:", error);
    res.status(500).json({ 
      message: "An error occurred while fetching waiting reviews.", 
      error: error.message 
    });
  }
});


/**
 * POST endpoint to approve a review
 * - Changes `approved` status from "waiting" to "approved"
 * 
    {
    "productId": "YOUR_PRODUCT_ID",
    "ratingId": "YOUR_REVIEW_ID"
    }
 */
router.post('/reviews/approve', async (req, res) => {
  try {
    const { productId, ratingId } = req.body;

    // Validate inputs
    if (!productId || !ratingId) {
      return res
        .status(400)
        .json({ message: 'productId and ratingId are required.' });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Find the rating (review) in the product’s ratings array
    const ratingIndex = product.ratings.findIndex(
      (rating) => rating._id.toString() === ratingId
    );

    if (ratingIndex === -1) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Check current status
    if (product.ratings[ratingIndex].approved !== 'waiting') {
      return res.status(400).json({
        message: 'This review is not in "waiting" status.',
      });
    }

    // Change the status to "approved"
    product.ratings[ratingIndex].approved = 'approved';

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: 'Review status updated to "approved".',
      updatedRating: product.ratings[ratingIndex],
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({
      message: 'An error occurred while approving the review.',
      error: error.message,
    });
  }
});

/**
 * POST endpoint to decline a review
 * - Changes `approved` status from "waiting" to "declined"
  {
  "productId": "YOUR_PRODUCT_ID",
  "ratingId": "YOUR_REVIEW_ID"
  }
 */
router.post('/reviews/decline', async (req, res) => {
  try {
    const { productId, ratingId } = req.body;

    // Validate inputs
    if (!productId || !ratingId) {
      return res
        .status(400)
        .json({ message: 'productId and ratingId are required.' });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Find the rating (review) in the product’s ratings array
    const ratingIndex = product.ratings.findIndex(
      (rating) => rating._id.toString() === ratingId
    );

    if (ratingIndex === -1) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Check current status
    if (product.ratings[ratingIndex].approved !== 'waiting') {
      return res.status(400).json({
        message: 'This review is not in "waiting" status.',
      });
    }

    // Change the status to "rejected" (or "declined" if you prefer)
    product.ratings[ratingIndex].approved = 'declined';

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: 'Review status updated to "declined".',
      updatedRating: product.ratings[ratingIndex],
    });
  } catch (error) {
    console.error('Error declining review:', error);
    res.status(500).json({
      message: 'An error occurred while declining the review.',
      error: error.message,
    });
  }
});

module.exports = router;
