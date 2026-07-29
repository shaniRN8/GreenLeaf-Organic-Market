import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, BarChart2 } from 'lucide-react';
import AdminOverview from './AdminOverview';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import { apiFetch } from '../../utils/api';

export default function AdminDashboard({ products, onRefreshProducts, showToast }) {
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/stats/overview');
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Store Management Portal
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>GreenLeaf Admin Control Panel</h2>
        </div>

        <div className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeAdminTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveAdminTab('overview'); fetchStats(); }}
          >
            <BarChart2 size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Overview
          </button>

          <button
            className={`admin-tab-btn ${activeAdminTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('products')}
          >
            <Package size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Product Catalog
          </button>

          <button
            className={`admin-tab-btn ${activeAdminTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('orders')}
          >
            <ShoppingBag size={16} style={{ display: 'inline', marginRight: '4px' }} />
            Customer Orders
          </button>
        </div>
      </div>

      {activeAdminTab === 'overview' && <AdminOverview stats={stats} />}
      {activeAdminTab === 'products' && (
        <ProductManager products={products} onRefreshProducts={onRefreshProducts} showToast={showToast} />
      )}
      {activeAdminTab === 'orders' && <OrderManager showToast={showToast} />}
    </div>
  );
}
