import React from 'react';
import { DollarSign, ShoppingBag, Package, AlertTriangle, Users, TrendingUp } from 'lucide-react';

export default function AdminOverview({ stats }) {
  if (!stats) return null;

  return (
    <div>
      {/* Metric Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box green">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-val">${stats.totalRevenue.toFixed(2)}</div>
            <div className="stat-lbl">Total Store Revenue</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box blue">
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.totalOrders}</div>
            <div className="stat-lbl">Total Orders Placed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box purple">
            <Package size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.totalProducts}</div>
            <div className="stat-lbl">Active Organic Items</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box amber">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.lowStockCount}</div>
            <div className="stat-lbl">Low Stock Alerts (≤10)</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Recent Orders Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="#15803d" /> Inventory Distribution by Category
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {Object.entries(stats.categoryCounts || {}).map(([cat, count]) => (
              <div key={cat}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <span>{cat}</span>
                  <span style={{ color: '#15803d' }}>{count} items</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (count / (stats.totalProducts || 1)) * 100)}%`,
                      background: 'linear-gradient(90deg, #22c55e, #15803d)',
                      borderRadius: '9999px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="#15803d" /> Recent Customer Purchases
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {(stats.recentOrders || []).map((ord) => (
              <div key={ord._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ord.customerName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Order #{ord._id} • {ord.items?.length || 1} items</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>${(ord.finalTotal || ord.totalAmount).toFixed(2)}</div>
                  <span className={`status-badge ${ord.orderStatus}`}>{ord.orderStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
