const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  refund_date: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  refund_status: {
    type: String,
    enum: ["Waiting", "Approved", "Declined"], // Valid statuses for the refund
    default: "Waiting", // Default status is "waiting"
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
