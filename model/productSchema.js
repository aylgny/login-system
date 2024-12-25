const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true, // Gereksiz boşlukları kaldırmak için
  },
  name: {
    type: String,
    required: true,
    trim: true, // Gereksiz boşlukları kaldırmak için
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true, // Her ürün için benzersiz olmasını sağlamak için
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0, // Minimum miktar kontrolü (opsiyonel)
  },
  //base price
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  //price after discount
  current_price: {
    type: Number,
    min: 0, 
  },
  warrantyStatus: {
    type: Boolean,
    required: true,
  },
  distributor: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
    required: true,
    trim: true,
  },
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Kullanıcı modeliyle ilişkilendirme (opsiyonel)
      },
      rating: {
        type: Number,
        min: 1,
        max: 5, // Opsiyonel: 1 ile 5 arasında bir değerle sınırlandırma
      },
      comment: {
        type: String,
        trim: true,
        requeired: false
      },
      approved: {
        type: String,
        enum: ["waiting", "approved", "rejected"], // Valid states for this field
        default: "waiting", // Default value
      },
    },
  ],
  discount: {
    type: Number,
    default: 0, // 0% discount by default
    min: 0,     // discount must be >= 0
    max: 100,   // discount must be <= 100
  },
});


// Middleware to calculate `current_price` before saving
productSchema.pre("save", function (next) {
  if (this.isModified("price") || this.isModified("discount")) {
    // Calculate current_price based on discount and round to 2 decimal places
    this.current_price = parseFloat(
      (this.price - (this.price * this.discount) / 100).toFixed(2)
    );
  }
  next();
});


module.exports = mongoose.model('Product', productSchema);
