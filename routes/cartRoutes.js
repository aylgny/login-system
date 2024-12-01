const express = require("express");
const router = express.Router();
const User = require("../model/userSchema"); // Path to the User model

// Add to Cart
router.post("/cart", async (req, res) => {
    const { userId, productId, quantity } = req.body;
  
    console.log("Incoming Request Body:", req.body);
  
    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Invalid request data" });
    }
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        console.log("User not found with ID:", userId);
        return res.status(404).json({ message: "User not found" });
      }
  
      // Ensure cart array is initialized
      if (!user.cart) {
        user.cart = [];
      }
  
      console.log("User's Cart Before Update:", user.cart);
  
      // Check if the product is already in the cart
      const existingProduct = user.cart.find(
        (item) => item.product && item.product.toString() === productId
      );
  
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }
  
      await user.save();
  
      console.log("User's Cart After Update:", user.cart);
      res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "An error occurred while adding to cart", error: error.message });
    }
  });
  
  // Get Cart Items for a User
  router.get("/cart/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).populate("cart.product");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ cart: user.cart });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  router.post("/cart/decrement", async (req, res) => {
    const { userId, productId } = req.body;
  
    if (!userId || !productId) {
      return res.status(400).json({ message: "Invalid request data" });
    }
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Find the product in the cart
      const productInCart = user.cart.find(
        (item) => item.product.toString() === productId
      );
  
      if (!productInCart) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
  
      // Decrement the quantity
      productInCart.quantity -= 1;
  
      // If quantity becomes 0, remove the product from the cart
      if (productInCart.quantity <= 0) {
        user.cart = user.cart.filter(
          (item) => item.product.toString() !== productId
        );
      }
  
      await user.save();
  
      res.status(200).json({
        message: "Product quantity decremented successfully",
        cart: user.cart,
      });
    } catch (error) {
      console.error("Error decrementing product quantity:", error);
      res
        .status(500)
        .json({ message: "An error occurred while decrementing item quantity" });
    }
  });
  
  
  
module.exports = router;
