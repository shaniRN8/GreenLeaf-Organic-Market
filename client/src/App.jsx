import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import { apiFetch, removeAuthToken } from './utils/api';
import { Sparkles, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ['All', 'Produce', 'Dairy & Eggs', 'Bakery', 'Superfoods', 'Beverages'];

export default function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    checkCurrentUser();
    fetchProducts();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const data = await apiFetch('/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      // Not logged in or expired token
      setUser(null);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/products');
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => (item._id || item.id) === (product._id || product.id));
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    showToast(`🛒 Added "${product.name}" to cart!`);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart(prev => prev.map(item => (item._id || item.id) === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemoveItem = (id) => {
    setCart(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setActiveTab('shop');
    showToast('Signed out successfully.');
  };

  const handleAuthSuccess = (userData, msg) => {
    setUser(userData);
    showToast(msg || 'Logged in successfully!');
    if (userData.role === 'admin') {
      setActiveTab('admin');
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <Sparkles size={18} color="#86efac" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <Navbar
        user={user}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* MAIN VIEW SWITCHING */}
      {activeTab === 'shop' && (
        <>
          <Hero onExploreClick={() => {
            const el = document.getElementById('catalog-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />

          {/* Floating Category Filter Pill Bar */}
          <div className="category-section" id="catalog-section">
            <div className="category-bar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'All' ? '🌱 All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Storefront Product Catalog */}
          <main className="main-content">
            <div className="section-header">
              <div>
                <h2 className="section-title">
                  {selectedCategory === 'All' ? 'Organic Fresh Catalog' : `${selectedCategory} Collection`}
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  {filteredProducts.length} certified organic items available for delivery
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ArrowUpDown size={16} color="#64748b" />
                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured Items</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌿</div>
                <p style={{ fontWeight: 600 }}>Loading organic harvests from server...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No organic products match your search</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>Try searching another keyword or select "All Categories".</p>
                <button className="nav-btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} style={{ background: '#15803d', color: 'white', margin: '0 auto' }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {activeTab === 'my-orders' && (
        <main className="main-content" style={{ paddingTop: '2.5rem' }}>
          <OrderHistory user={user} />
        </main>
      )}

      {activeTab === 'admin' && (
        <main className="main-content" style={{ paddingTop: '2.5rem' }}>
          <AdminDashboard
            products={products}
            onRefreshProducts={fetchProducts}
            showToast={showToast}
          />
        </main>
      )}

      {/* MODALS & DRAWERS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOrderSuccess={(ord) => {
          showToast(`🎉 Order #${ord._id} placed successfully!`);
          fetchProducts(); // Refresh stock counts
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Footer */}
      <footer style={{ background: '#0b251c', color: '#d1fae5', padding: '3rem 1.5rem 2rem 1.5rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Outfit', color: 'white' }}>
              <span style={{ background: '#22c55e', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>🌱</span>
              GreenLeaf Organic Market
            </div>
            <p style={{ fontSize: '0.85rem', color: '#86efac', marginTop: '0.4rem' }}>
              React • Express • Node.js • MongoDB Full-Stack E-Commerce Platform
            </p>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#86efac' }}>
            © 2026 GreenLeaf Market. Certified Organic & Sustainable.
          </div>
        </div>
      </footer>
    </div>
  );
}
