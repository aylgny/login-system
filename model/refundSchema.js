const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  refund_date: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  refund_status: {
    type: String,
    enum: ["waiting", "approved", "declined"], // Valid statuses for the refund
    default: "waiting", // Default status is "waiting"
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product schema
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Minimum quantity is 1
      },
    },
  ],
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order", // Reference to the Order schema
    required: true,
  },
});

const Refund = mongoose.model("Refund", refundSchema);

module.exports = Refund;
