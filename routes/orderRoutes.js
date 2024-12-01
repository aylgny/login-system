const express = require("express");
const router = express.Router();
const Order = require("../model/orderSchema"); // Path to Order schema
const User = require("../model/userSchema"); // Path to User schema

// Get Orders for a User
router.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find orders for the user, populate products and user details
    const orders = await Order.find({ user: userId })
      .populate("products.product") // Populate product details
      .populate("user", "firstName lastName email"); // Optionally populate user details

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Add Order
router.post("/orders", async (req, res) => {
  try {
    const { userId, products, status } = req.body;

    if (!userId || !products || products.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Validate the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new order
    const newOrder = new Order({
      user: userId,
      products,
      status: status || "Processing", // Default to "Processing" if not provided
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

module.exports = router;
