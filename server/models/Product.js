import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // 'Produce', 'Dairy & Eggs', 'Bakery', 'Superfoods', 'Beverages'
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  unit: { type: String, default: '500g' },
  stock: { type: Number, required: true, default: 20 },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 24 },
  image: { type: String, required: true },
  description: { type: String, required: true },
  certifications: [{ type: String }], // ['100% Organic', 'Non-GMO', 'Direct Farm']
  origin: { type: String, default: 'Local Organic Farm' },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
