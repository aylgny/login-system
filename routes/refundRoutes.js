const express = require("express");
const router = express.Router();
const Refund = require("../model/refundSchema");
const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");

// Create a Refund Request
// http://localhost:5000/api/create_refund
/**
    {
    "orderId": "676d8df153b5b96887aad199",
    "products": [
        {
        "productId": "67433531bb4b140ec62687e3",
        "quantity": 1
        },
        {
        "productId": "674334d4bb4b140ec62687da",
        "quantity": 2
        }
    ]
    }
 */
router.post("/create_refund", async (req, res) => {
  try {
    const { orderId, products } = req.body;

    // Validate input
    if (!orderId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Validate if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate products
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
    }

    // Create refund request
    const refund = new Refund({
      refund_date: new Date(),
      refund_status: "waiting", // Default status
      products: products.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
      order: orderId,
    });

    // Save refund to database
    await refund.save();

    res.status(201).json({
      message: "Refund request created successfully",
      refund,
    });
  } catch (error) {
    console.error("Error creating refund request:", error);
    res.status(500).json({ message: "Failed to create refund request", error: error.message });
  }
});

module.exports = router;
