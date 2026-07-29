import express from 'express';
import { User } from '../models/User.js';
import { verifyToken, signToken } from '../middleware/auth.js';
import { memoryStore, hashPassword, comparePassword } from '../config/db.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password).' });
    }

    const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = hashPassword(password);
    const newUser = {
      _id: 'user_' + Date.now(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'customer',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date()
    };
    memoryStore.users.push(newUser);

    const token = signToken({ id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
});

// Current User Profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = memoryStore.users.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile.' });
  }
});

export default router;
