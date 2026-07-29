import express from 'express';
import { Product } from '../models/Product.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import { memoryStore } from '../config/db.js';

const router = express.Router();

// Get all products (Public)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    if (memoryStore.isInMemory) {
      let items = [...memoryStore.products];

      if (category && category !== 'All') {
        items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }

      if (sort === 'price-low') {
        items.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        items.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        items.sort((a, b) => b.rating - a.rating);
      }

      return res.json({ success: true, count: items.length, products: items });
    }

    let filter = {};
    if (category && category !== 'All') {
      filter.category = new RegExp(category, 'i');
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    let query = Product.find(filter);
    if (sort === 'price-low') query = query.sort({ price: 1 });
    if (sort === 'price-high') query = query.sort({ price: -1 });
    if (sort === 'rating') query = query.sort({ rating: -1 });

    const products = await query;
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (memoryStore.isInMemory) {
      const product = memoryStore.products.find(p => p._id === id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
      return res.json({ success: true, product });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving product.' });
  }
});

// Create product (Admin Only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, category, price, originalPrice, unit, stock, image, description, certifications, origin } = req.body;

    if (!name || !category || !price || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all required product details.' });
    }

    const newProductData = {
      name,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.2,
      unit: unit || '500g',
      stock: stock ? Number(stock) : 20,
      image: image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
      description,
      certifications: certifications || ['100% Organic', 'Farm Fresh'],
      origin: origin || 'Certified Organic Farm',
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: true,
      createdAt: new Date()
    };

    if (memoryStore.isInMemory) {
      const created = { _id: 'prod_' + Date.now(), ...newProductData };
      memoryStore.products.unshift(created);
      return res.status(201).json({ success: true, message: 'Product added successfully to catalog!', product: created });
    }

    const product = new Product(newProductData);
    await product.save();
    res.status(201).json({ success: true, message: 'Product added successfully to catalog!', product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product.', error: error.message });
  }
});

// Update product (Admin Only)
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (memoryStore.isInMemory) {
      const index = memoryStore.products.findIndex(p => p._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Product not found.' });

      memoryStore.products[index] = {
        ...memoryStore.products[index],
        ...req.body,
        price: req.body.price ? Number(req.body.price) : memoryStore.products[index].price,
        stock: req.body.stock !== undefined ? Number(req.body.stock) : memoryStore.products[index].stock
      };

      return res.json({ success: true, message: 'Product updated successfully!', product: memoryStore.products[index] });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product updated successfully!', product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product.', error: error.message });
  }
});

// Delete product (Admin Only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (memoryStore.isInMemory) {
      const index = memoryStore.products.findIndex(p => p._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Product not found.' });
      memoryStore.products.splice(index, 1);
      return res.json({ success: true, message: 'Product deleted successfully from catalog.' });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted successfully from catalog.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.', error: error.message });
  }
});

export default router;
