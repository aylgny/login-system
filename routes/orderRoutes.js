const express = require("express");
const router = express.Router();
const Order = require("../model/orderSchema"); // Path to Order schema
const User = require("../model/userSchema"); // Path to User schema
const Product = require("../model/productSchema");

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

router.post("/orders", async (req, res) => {
  try {
    const { userId, status } = req.body;

    // User ID ve Cart'in olup olmadığını kontrol et
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Kullanıcıyı veritabanında bul
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kullanıcının sepetinde ürün olup olmadığını kontrol et
    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Sipariş için ürün bilgilerini cart'tan al
    const products = user.cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
    }));

    // Yeni siparişi oluştur
    const newOrder = new Order({
      user: userId,
      products,
      status: status || "Processing", // Varsayılan durum "Processing"
    });

    // Siparişi kaydet
    await newOrder.save();

    //user.orders.append(newOrder);

    // Deduct quantities from the product stocks
    
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      //if (product.quantity < item.quantity) {
      //  throw new Error(
      //    `Insufficient stock for product: ${product.name}. Requested: ${item.quantity}, Available: ${product.quantity}`
      //  );
      //}

      product.quantity -= item.quantity;
      await product.save();
    }
    


    user.cart = [];
    await user.save();

    // Sipariş başarıyla oluşturuldu
    res.status(201).json({ message: "Order created successfully", order: newOrder });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});



module.exports = router;
