import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { memoryStore } from '../config/db.js';

const router = express.Router();

// Create new checkout order (Customer / Authenticated user)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, discountCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Add products to place an order.' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
      return res.status(400).json({ success: false, message: 'Please provide full delivery address details.' });
    }

    let rawTotal = 0;
    const processedItems = items.map(item => {
      rawTotal += item.price * item.quantity;
      return {
        product: item.id || item._id,
        name: item.name,
        price: item.price,
        unit: item.unit,
        quantity: item.quantity,
        image: item.image
      };
    });

    let discount = 0;
    if (discountCode && discountCode.toUpperCase() === 'ORGANIC10') {
      discount = rawTotal * 0.10; // 10% discount
    }

    const finalTotal = Math.max(0, rawTotal - discount);
    const trackingNumber = 'GL-TRK-' + Math.floor(10000 + Math.random() * 90000);

    if (memoryStore.isInMemory) {
      const newOrder = {
        _id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
        user: req.user.id,
        customerName: req.user.name || 'Valued Customer',
        customerEmail: req.user.email,
        items: processedItems,
        totalAmount: Number(rawTotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        finalTotal: Number(finalTotal.toFixed(2)),
        shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card',
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        trackingNumber,
        createdAt: new Date()
      };

      // Reduce product stock in memory
      processedItems.forEach(item => {
        const prod = memoryStore.products.find(p => p._id === item.product);
        if (prod) prod.stock = Math.max(0, prod.stock - item.quantity);
      });

      memoryStore.orders.unshift(newOrder);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully! Your organic delivery is being prepared.',
        order: newOrder
      });
    }

    // Mongoose mode
    const newOrder = new Order({
      user: req.user.id,
      customerName: req.user.name || 'Valued Customer',
      customerEmail: req.user.email,
      items: processedItems,
      totalAmount: Number(rawTotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      finalTotal: Number(finalTotal.toFixed(2)),
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      trackingNumber
    });

    await newOrder.save();

    // Reduce stock for products
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Your organic delivery is being prepared.',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process order.', error: error.message });
  }
});

// Get current user orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    if (memoryStore.isInMemory) {
      const userOrders = memoryStore.orders.filter(o => o.user === req.user.id || o.customerEmail === req.user.email);
      return res.json({ success: true, count: userOrders.length, orders: userOrders });
    }

    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order history.' });
  }
});

// Admin: Get all orders
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (memoryStore.isInMemory) {
      return res.json({ success: true, count: memoryStore.orders.length, orders: memoryStore.orders });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching all customer orders.' });
  }
});

// Admin: Update order status
router.put('/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    if (memoryStore.isInMemory) {
      const order = memoryStore.orders.find(o => o._id === id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

      order.orderStatus = orderStatus;
      return res.json({ success: true, message: `Order status updated to "${orderStatus}"!`, order });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { orderStatus }, { new: true });
    if (!updatedOrder) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, message: `Order status updated to "${orderStatus}"!`, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

export default router;
