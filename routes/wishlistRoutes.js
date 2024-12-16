const express = require("express");
const router = express.Router();
const User = require("../model/userSchema"); // Path to the User model
const mongoose = require("mongoose");

// Add to wishlist
router.post("/wishlist", async (req, res) => {
    const { userId, productId} = req.body;
  
    console.log("Incoming Request Body:", req.body);
  
    if (!userId || !productId) {
      return res.status(400).json({ message: "Invalid request data" });
    }
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        console.log("User not found with ID:", userId);
        return res.status(404).json({ message: "User not found" });
      }
  
      // Ensure wishlist array is initialized
      if (!user.wishlist) {
        user.wishlist = [];
      }
  
      console.log("User's Wishlist Before Update:", user.wishlist);
  
      // Check if the product is already in the wishlist
      const existingProduct = user.wishlist.find(
        (item) => item.product && item.product.toString() === productId
      );
  
      if (existingProduct) {
        // Remove the product from the wishlist
        user.wishlist = user.wishlist.filter((item) => item.product.toString() !== productId);
        await user.save();
  
        console.log("User's wishlist After Update:", user.wishlist);
        res.status(200).json({ message: "Product removed from wishlist successfully" });
      } else {
        user.wishlist.push({ product: productId});
        await user.save();
  
        console.log("User's wishlist After Update:", user.wishlist);
        res.status(200).json({ message: "Product added to wishlist successfully" });
      }
  

    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "An error occurred while adding to wishlist", error: error.message });
    }
  });
  
  // Get wishlist Items for a User
  router.get("/wishlist/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId).populate("wishlist.product");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      res.status(500).json({ message: "Failed to fetch wishlist items" });
    }
  });

  module.exports = router;