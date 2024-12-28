const express = require("express");
const router = express.Router();
const Refund = require("../model/refundSchema");
const Order = require("../model/orderSchema");
const Product = require("../model/productSchema");

// Create a Refund Request
// http://localhost:5000/api/create_refund
/**
  {
    "orderId": "677044829e3a8e1ab754e273",
    "products": [
      {
        "productId": "676943982c5dd7bfea11437b"
      },
      {
        "productId": "674335b9bb4b140ec62687e9"
      },
      {
        "productId": "674334d4bb4b140ec62687da"
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

    // Validate products and get prices
    const refundProducts = products.map((item) => {
      const orderProduct = order.products.find(
        (p) => p.product.toString() === item.productId
      );
      if (!orderProduct) {
        throw new Error(`Product with ID ${item.productId} not found in order`);
      }

      // Update refund_status for the product in the order
      orderProduct.refund_status = true;

      return {
        product: item.productId,
        quantity: orderProduct.quantity,
        price: orderProduct.price, // Get price from order
      };
    });

    // Save the updated order with updated refund_status
    await order.save();

    // Create refund request
    const refund = new Refund({
      refund_date: new Date(),
      refund_status: "waiting", // Default status
      products: refundProducts,
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


// Get All Refunds
// http://localhost:5000/api/refunds
router.get("/refunds", async (req, res) => {
  try {
    // Retrieve all refund requests
    const refunds = await Refund.find()
      .populate("products.product", "name price") // Populate product details (e.g., name, price)
      .populate("order", "status purchaseDate"); // Optionally populate order details

    // Check if no refunds found
    if (!refunds || refunds.length === 0) {
      return res.status(404).json({ message: "No refunds found" });
    }

    // Return the refund requests
    res.status(200).json({ message: "Refunds retrieved successfully", refunds });
  } catch (error) {
    console.error("Error fetching refunds:", error);
    res.status(500).json({ message: "Failed to fetch refunds", error: error.message });
  }
});



// Decline a Refund Request
router.put("/refunds/decline/:refundId", async (req, res) => {
  try {
    const { refundId } = req.params;

    // Find the refund request
    const refund = await Refund.findById(refundId);
    if (!refund) {
      return res.status(404).json({ message: "Refund request not found" });
    }

    // Update refund status to "Declined"
    refund.refund_status = "Declined";
    await refund.save();

    res.status(200).json({
      message: "Refund request declined successfully",
      refund,
    });
  } catch (error) {
    console.error("Error declining refund request:", error);
    res.status(500).json({
      message: "Failed to decline refund request",
      error: error.message,
    });
  }
});
module.exports = router;
