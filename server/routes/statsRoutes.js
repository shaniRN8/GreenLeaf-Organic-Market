import express from 'express';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { memoryStore } from '../config/db.js';

const router = express.Router();

// Admin Dashboard Overview Analytics
router.get('/overview', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (memoryStore.isInMemory) {
      const totalRevenue = memoryStore.orders.reduce((sum, ord) => sum + (ord.finalTotal || ord.totalAmount || 0), 0);
      const totalOrders = memoryStore.orders.length;
      const totalProducts = memoryStore.products.length;
      const lowStockCount = memoryStore.products.filter(p => p.stock <= 10).length;
      const totalCustomers = memoryStore.users.filter(u => u.role === 'customer').length;

      // Category breakdown
      const categoryCounts = {};
      memoryStore.products.forEach(p => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      });

      return res.json({
        success: true,
        stats: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrders,
          totalProducts,
          lowStockCount,
          totalCustomers,
          categoryCounts,
          recentOrders: memoryStore.orders.slice(0, 5)
        }
      });
    }

    // Mongoose Mode
    const orders = await Order.find();
    const products = await Product.find();
    const usersCount = await User.countDocuments({ role: 'customer' });

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.finalTotal || ord.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= 10).length;

    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        lowStockCount,
        totalCustomers: usersCount,
        categoryCounts,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate admin analytics.', error: error.message });
  }
});

export default router;
