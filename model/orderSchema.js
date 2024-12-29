const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference to Product schema
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 }, // Added price attribute
      refund_status: {
        type: String,
        enum: ["waiting", "declined", "approved"], // Possible values for refund status
        default: "waiting", // Default refund status is "waiting"
      },
      delivery_status: {
        type: String,
        enum: ["Processing", "In-Transit", "Delivered", "Cancelled"],
        default: "Processing",
      },
    },
  ],
  address: {
    type: String, // Added address field
    required: true, // Address is required for an order
    trim: true,
  },
  /*
  invoiceid: {
    type: String, // Added invoiceid field
    required: true, // invoiceid is required for an order
    trim: true,
  },*/
  status: {
    type: String,
    enum: ["Processing", "In-Transit", "Delivered", "Cancelled"],
    default: "Processing",
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
