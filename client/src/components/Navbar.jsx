import React from 'react';
import { ShoppingBag, Search, User, ShieldCheck, LogOut, PackageCheck, LayoutDashboard } from 'lucide-react';

export default function Navbar({
  user,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onLogout,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <a href="#" className="logo-brand" onClick={(e) => { e.preventDefault(); setActiveTab('shop'); }}>
          <div className="logo-icon">🌱</div>
          <span>GreenLeaf</span>
        </a>

        {/* Live Search Input */}
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search organic avocados, raw honey, sourdough..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Navigation & Action Buttons */}
        <div className="nav-actions">
          <button
            className={`nav-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            Storefront
          </button>

          {user && (
            <button
              className={`nav-btn ${activeTab === 'my-orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-orders')}
            >
              <PackageCheck size={18} />
              My Orders
            </button>
          )}

          {user && user.role === 'admin' && (
            <button
              className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fcd34d' }}
            >
              <LayoutDashboard size={18} />
              Admin Dashboard
            </button>
          )}

          {/* Cart Button */}
          <button className="cart-btn" onClick={onOpenCart}>
            <ShoppingBag size={18} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Auth Button or User Menu */}
          {user ? (
            <div className="user-menu-btn">
              <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt={user.name} className="user-avatar" />
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', textAlign: 'left' }}>
                <span style={{ fontWeight: 700, lineHeight: 1.1 }}>{user.name}</span>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                style={{ background: 'none', color: '#ef4444', marginLeft: '0.4rem', padding: '0.2rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="nav-btn" onClick={onOpenAuth} style={{ border: '1px solid var(--color-border)', background: 'white' }}>
              <User size={18} />
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
