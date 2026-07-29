import crypto from 'crypto';

export const memoryStore = {
  isInMemory: false,
  users: [],
  products: [],
  orders: []
};

export const hashPassword = (password) => {
  return crypto.pbkdf2Sync(password, 'greenleaf_salt', 1000, 32, 'sha256').toString('hex');
};

export const comparePassword = (password, hash) => {
  const inputHash = crypto.pbkdf2Sync(password, 'greenleaf_salt', 1000, 32, 'sha256').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
};

export const initialProducts = [
  {
    _id: 'prod_1',
    name: 'Fresh Organic Hass Avocados',
    category: 'Produce',
    price: 4.99,
    originalPrice: 6.50,
    unit: '3 Pack',
    stock: 45,
    rating: 4.9,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
    description: 'Creamy, rich in healthy fats, and hand-picked daily from certified organic orchards.',
    certifications: ['100% Organic', 'Non-GMO', 'Direct Farm'],
    origin: 'Sun Valley Organic Farm, California',
    isFeatured: true,
    createdAt: new Date('2026-07-01')
  },
  {
    _id: 'prod_2',
    name: 'Farm Fresh Organic Strawberries',
    category: 'Produce',
    price: 5.99,
    originalPrice: 7.20,
    unit: '400g Tray',
    stock: 28,
    rating: 4.8,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
    description: 'Sweet, juicy, pesticide-free strawberries cultivated naturally in sunlit greenhouses.',
    certifications: ['USDA Organic', 'Pesticide-Free'],
    origin: 'Berry Fields, Oregon',
    isFeatured: true,
    createdAt: new Date('2026-07-02')
  },
  {
    _id: 'prod_3',
    name: 'Raw Unfiltered Wildflower Honey',
    category: 'Superfoods',
    price: 12.50,
    originalPrice: 15.00,
    unit: '500g Jar',
    stock: 15,
    rating: 5.0,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    description: '100% pure, unpasteurized honey harvested from sustainable ethical bee sanctuaries.',
    certifications: ['Pure Raw', 'Ethical Harvest', 'Gluten-Free'],
    origin: 'Mountain Meadow Apiary',
    isFeatured: true,
    createdAt: new Date('2026-07-03')
  },
  {
    _id: 'prod_4',
    name: 'Artisan Organic Sourdough Bread',
    category: 'Bakery',
    price: 6.25,
    originalPrice: 7.50,
    unit: '1 Loaf',
    stock: 12,
    rating: 4.7,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
    description: 'Naturally fermented over 36 hours using ancient organic stone-ground wheat flour.',
    certifications: ['Artisanal', 'No Preservatives', 'Vegan'],
    origin: 'GreenLeaf Stone Bakery',
    isFeatured: false,
    createdAt: new Date('2026-07-04')
  },
  {
    _id: 'prod_5',
    name: 'Organic Almond Milk (Unsweetened)',
    category: 'Dairy & Eggs',
    price: 4.50,
    originalPrice: 5.20,
    unit: '1 Liter',
    stock: 35,
    rating: 4.6,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
    description: 'Creamy plant-based milk crafted from cold-pressed organic Spanish almonds.',
    certifications: ['Dairy-Free', 'Non-GMO', 'No Added Sugar'],
    origin: 'PurePlant Dairy',
    isFeatured: false,
    createdAt: new Date('2026-07-05')
  },
  {
    _id: 'prod_6',
    name: 'Organic Kale & Baby Spinach Mix',
    category: 'Produce',
    price: 4.25,
    originalPrice: 5.00,
    unit: '300g Bag',
    stock: 6,
    rating: 4.8,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    description: 'Crisp nutrient-dense greens packed with vitamin C, iron, and antioxidants.',
    certifications: ['Triple Washed', '100% Organic'],
    origin: 'Green Valley Greens',
    isFeatured: true,
    createdAt: new Date('2026-07-06')
  },
  {
    _id: 'prod_7',
    name: 'Cold-Pressed Ceremonial Matcha',
    category: 'Beverages',
    price: 18.99,
    originalPrice: 22.00,
    unit: '100g Can',
    stock: 18,
    rating: 4.9,
    reviewsCount: 63,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
    description: 'First-harvest shade-grown green tea leaves ground into velvety smooth ceremonial powder.',
    certifications: ['JAS Organic', 'Shade-Grown', 'Antioxidant-Rich'],
    origin: 'Uji, Kyoto Harvest',
    isFeatured: true,
    createdAt: new Date('2026-07-07')
  },
  {
    _id: 'prod_8',
    name: 'Organic Free-Range Heritage Eggs',
    category: 'Dairy & Eggs',
    price: 7.80,
    originalPrice: 8.90,
    unit: '12 Eggs',
    stock: 22,
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80',
    description: 'Pasture-raised eggs with rich golden yolks from hens fed a certified organic diet.',
    certifications: ['Certified Humane', 'Pasture-Raised', 'Soy-Free'],
    origin: 'Sunny Acres Pastures',
    isFeatured: false,
    createdAt: new Date('2026-07-08')
  },
  {
    _id: 'prod_9',
    name: 'Organic Multigrain Seeded Loaf',
    category: 'Bakery',
    price: 6.99,
    originalPrice: 8.00,
    unit: '1 Loaf',
    stock: 18,
    rating: 4.9,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    description: 'Packed with organic sunflower seeds, flaxseeds, and whole grains baked to golden perfection.',
    certifications: ['100% Organic', 'Whole Grain', 'High Fiber'],
    origin: 'GreenLeaf Stone Bakery',
    isFeatured: true,
    createdAt: new Date('2026-07-09')
  },
  {
    _id: 'prod_10',
    name: 'Farmhouse Organic Butter Croissants',
    category: 'Bakery',
    price: 7.50,
    originalPrice: 8.90,
    unit: '4 Pack',
    stock: 14,
    rating: 4.8,
    reviewsCount: 46,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    description: 'Flaky, buttery artisanal croissants crafted with grass-fed organic butter and unbleached flour.',
    certifications: ['Grass-Fed Butter', 'Artisanal', 'Hand-Crafted'],
    origin: 'GreenLeaf Pastry Kitchen',
    isFeatured: false,
    createdAt: new Date('2026-07-10')
  },
  {
    _id: 'prod_11',
    name: 'Gluten-Free Organic Blueberry Muffins',
    category: 'Bakery',
    price: 5.80,
    originalPrice: 6.80,
    unit: '2 Pack',
    stock: 20,
    rating: 4.7,
    reviewsCount: 28,
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80',
    description: 'Moist, tender muffins loaded with wild organic blueberries and almond flour crumble.',
    certifications: ['Gluten-Free', 'Wild Blueberries', 'Non-GMO'],
    origin: 'GreenLeaf Gluten-Free Kitchen',
    isFeatured: true,
    createdAt: new Date('2026-07-11')
  },
  {
    _id: 'prod_12',
    name: 'Organic Cinnamon Swirl Brioche',
    category: 'Bakery',
    price: 8.25,
    originalPrice: 9.50,
    unit: '1 Loaf',
    stock: 10,
    rating: 4.9,
    reviewsCount: 39,
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80',
    description: 'Soft French-style brioche ribboned with aromatic Ceylon cinnamon and organic cane sugar.',
    certifications: ['Ceylon Cinnamon', 'Organic Eggs', 'Artisanal'],
    origin: 'GreenLeaf Stone Bakery',
    isFeatured: false,
    createdAt: new Date('2026-07-12')
  },
  {
    _id: 'prod_13',
    name: 'Organic Cold-Pressed Green Detox Juice',
    category: 'Beverages',
    price: 6.49,
    originalPrice: 7.80,
    unit: '500ml Bottle',
    stock: 25,
    rating: 4.8,
    reviewsCount: 67,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
    description: 'Refreshing blend of cold-pressed organic cucumber, green apple, celery, kale, lemon, and ginger.',
    certifications: ['100% Raw', 'No Added Water', 'Cold-Pressed'],
    origin: 'PurePress Juice Bar',
    isFeatured: true,
    createdAt: new Date('2026-07-13')
  },
  {
    _id: 'prod_14',
    name: 'Sparkling Organic Kombucha (Ginger Lemon)',
    category: 'Beverages',
    price: 4.25,
    originalPrice: 5.00,
    unit: '414ml Bottle',
    stock: 30,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    description: 'Naturally effervescent probiotic tea brewed with fresh organic ginger root and cold-pressed lemon juice.',
    certifications: ['Probiotic-Rich', 'Raw & Live', 'Low Sugar'],
    origin: 'SunBurst Ferments',
    isFeatured: true,
    createdAt: new Date('2026-07-14')
  },
  {
    _id: 'prod_15',
    name: 'Organic Iced Hibiscus Berry Tea',
    category: 'Beverages',
    price: 4.99,
    originalPrice: 6.00,
    unit: '500ml Bottle',
    stock: 22,
    rating: 4.7,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
    description: 'Tart and sweet herbal infusion of organic hibiscus petals, elderberries, and mint leaves.',
    certifications: ['Caffeine-Free', 'Antioxidant', '100% Organic'],
    origin: 'PurePress Beverage Co.',
    isFeatured: false,
    createdAt: new Date('2026-07-15')
  },
  {
    _id: 'prod_16',
    name: 'Single-Origin Organic Cold Brew Coffee',
    category: 'Beverages',
    price: 5.75,
    originalPrice: 7.00,
    unit: '350ml Bottle',
    stock: 16,
    rating: 4.9,
    reviewsCount: 54,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    description: 'Steeped for 18 hours using single-origin Ethiopian shade-grown Arabica beans. Smooth and low acidity.',
    certifications: ['Fair-Trade', 'Shade-Grown', '100% Arabica'],
    origin: 'Roast & Brew Artisans',
    isFeatured: true,
    createdAt: new Date('2026-07-16')
  }
];

export async function seedMemoryStore() {
  const adminPasswordHash = hashPassword('admin123');
  const customerPasswordHash = hashPassword('user123');

  memoryStore.users = [
    {
      _id: 'user_admin',
      name: 'GreenLeaf Admin',
      email: 'admin@greenleaf.com',
      password: adminPasswordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date('2026-01-01')
    },
    {
      _id: 'user_customer',
      name: 'Jane Doe',
      email: 'customer@greenleaf.com',
      password: customerPasswordHash,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date('2026-02-15')
    }
  ];

  memoryStore.products = JSON.parse(JSON.stringify(initialProducts));

  memoryStore.orders = [
    {
      _id: 'ORD-98421',
      user: 'user_customer',
      customerName: 'Jane Doe',
      customerEmail: 'customer@greenleaf.com',
      items: [
        { product: 'prod_1', name: 'Fresh Organic Hass Avocados', price: 4.99, unit: '3 Pack', quantity: 2, image: initialProducts[0].image },
        { product: 'prod_3', name: 'Raw Unfiltered Wildflower Honey', price: 12.50, unit: '500g Jar', quantity: 1, image: initialProducts[2].image }
      ],
      totalAmount: 22.48,
      discount: 2.00,
      finalTotal: 20.48,
      shippingAddress: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        zipCode: '97477',
        phone: '+1 (555) 234-5678'
      },
      paymentMethod: 'Credit Card (**** 4242)',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      trackingNumber: 'GL-TRK-88192',
      createdAt: new Date('2026-07-28T14:30:00Z')
    },
    {
      _id: 'ORD-98310',
      user: 'user_customer',
      customerName: 'Jane Doe',
      customerEmail: 'customer@greenleaf.com',
      items: [
        { product: 'prod_2', name: 'Farm Fresh Organic Strawberries', price: 5.99, unit: '400g Tray', quantity: 1, image: initialProducts[1].image },
        { product: 'prod_7', name: 'Cold-Pressed Ceremonial Matcha', price: 18.99, unit: '100g Can', quantity: 1, image: initialProducts[6].image }
      ],
      totalAmount: 24.98,
      discount: 0,
      finalTotal: 24.98,
      shippingAddress: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        zipCode: '97477',
        phone: '+1 (555) 234-5678'
      },
      paymentMethod: 'UPI / Digital Wallet',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      trackingNumber: 'GL-TRK-77109',
      createdAt: new Date('2026-07-25T11:15:00Z')
    }
  ];
}

export async function connectDB() {
  memoryStore.isInMemory = true;
  await seedMemoryStore();
  console.log('🚀 In-memory Database ready with pre-seeded products, user accounts, & sample orders!');
}
