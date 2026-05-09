import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price.'],
  },
  oldPrice: {
    type: Number,
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL.'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
  },
  subCategory: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  sales: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: 'In stock',
  },
  // Supplier data managed by Admin
  supplierName: {
    type: String,
    default: 'Guanjoy Trading LLC',
  },
  supplierRegion: {
    type: String,
    default: 'Germany, Berlin',
  },
  supplierFlag: {
    type: String,
    default: '🇩🇪',
  },
  supplierUrl: {
    type: String,
    default: 'shopname.ae',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
