const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { 
        type: String, required: true },
        model: String,
        serialNumber: String,
        description: String,
    quantity: { 
        type: Number, required: true },
    price: { 
        type: Number, required: true },
        warrantyStatus: Boolean,
        distributor: String,
    ratings: [{ 
        user: mongoose.Schema.Types.ObjectId, rating: Number, comment: String, approved: Boolean }],
});

module.exports = mongoose.model("Product", productSchema);
