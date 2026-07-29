import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: String, required: true }, // product ID or name
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user ID or email
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalTotal: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'Credit Card' },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Paid' },
  orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  trackingNumber: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
