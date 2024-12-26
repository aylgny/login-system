const express = require("express");
const router = express.Router();
const Order = require("../model/orderSchema"); // Path to Order schema
const User = require("../model/userSchema"); // Path to User schema
const Product = require("../model/productSchema");
const sendEmailWithInvoice = require("../routes/sendEmail"); // Adjust the path as necessary
const createInvoiceAdmin = require("../routes/sendEmail");
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit'); // Diğer gerekli modülleri de dahil edin

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

// Get Orders for a Product Manager
router.get("/ordersAdmin", async (req, res) => {
  try {

    // Find orders for the user, populate products and user details
    const orders = await Order.find()
      .populate("products.product") // Populate product details
      .populate("user", "firstName lastName email"); // Optionally populate user details

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
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
    const products = await Promise.all(
      user.cart.map(async (item) => {
        const product = await Product.findById(item.product); // Product modelinden ürün bilgisi al
        if (!product) {
          throw new Error(`Product with ID ${item.product} not found`);
        }
    
        return {
          product: item.product, // Product ID
          quantity: item.quantity, // Kullanıcının istediği miktar
          price: product.current_price, // Product modelinden current_price
        };
      })
    );
    

    // Yeni siparişi oluştur
    

    //user.orders.append(newOrder);

    // Deduct quantities from the product stocks
    const invoiceProducts = [];
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }


      invoiceProducts.push({
        description: product.name,
        price: product.current_price, // Make sure this is a valid number
        quantity: item.quantity,
      });

      product.quantity -= item.quantity;
      await product.save();
    }
    
    // Yeni siparişi oluştur
    const newOrder = new Order({
      user: userId,
      products,
      status: status || "Processing", // Varsayılan durum "Processing",
      //invoice_id: currentTimestamp,
    });

    // Siparişi kaydet
    await newOrder.save();
    


    user.cart = [];
    await user.save();
    
    const userDetails = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      address: "empty hard coded adress for now",
    };
    const formatDate = (date) => {
      const options = { year: 'numeric', day: '2-digit', month: '2-digit' };
      return date.toLocaleDateString('tr-TR', options);
    };
    const currentDate = formatDate(new Date());


    
    var pdfPath = await sendEmailWithInvoice(userDetails, invoiceProducts, currentDate);
    
    
    // Sipariş başarıyla oluşturuldu (Order successfully created)
    res.status(201).json({ 
        message: "Order created successfully", 
        order: newOrder,
        pdfPath: pdfPath // Include the pdfPath here
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

router.post('/create-invoice', async (req, res) => {
  const { userID, orderID } = req.body;

  try {
    // Kullanıcı ve sipariş bilgilerini çek
    const user = await User.findById(userID);
    const order = await Order.findById(orderID);

    if (!user || !order) {
      return res.status(404).json({ message: 'User or Order not found' });
    }

    // Verileri hazırlama
    const name = `${user.firstName} ${user.lastName}`;
    const email = user.email;
    //const invoiceDate = new Date().toISOString().split('T')[0]; // Tarihi 'YYYY-MM-DD' formatında alır
    const formatDate = (date) => {
      const options = { year: 'numeric', day: '2-digit', month: '2-digit' };
      return date.toLocaleDateString('tr-TR', options);
    };
    const products = order.products;
    const invoiceDate = formatDate(new Date());

    


    const invoiceProducts = [];
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
      invoiceProducts.push({
        description: product.name,
        price: product.current_price, // Make sure this is a valid number
        quantity: item.quantity,
      });

    }

    // PDF oluşturma
    const filePath = await createInvoiceAdmin(userDetails, invoiceProducts, invoiceDate);
    
    
    // PDF'i istemciye döndürme
    res.status(200).json({
      message: 'Invoice created successfully',
      filePath: filePath, // İstemciye erişim için PDF yolu
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'An error occurred while creating the invoice', error });
  }
});


// Cancel order API
router.put("/orders/cancel/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId).populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }


    // Update stock of each product in the order
    for (const item of order.products) {
      const product = item.product; // Populated product
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product} not found` });
      }

      product.quantity += item.quantity; // Restore the stock
      await product.save();
    }

    // Update order status to "Cancelled"
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Failed to cancel order", error: error.message });
  }
});



module.exports = router;
