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
  price: {
    type: Number,
    required: true,
    min: 0, // Minimum fiyat kontrolü (opsiyonel)
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
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model('Product', productSchema);
