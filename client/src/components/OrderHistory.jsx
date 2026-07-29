import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, MapPin, AlertCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, [user]);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/orders/my-orders');
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
        <Clock size={36} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <p style={{ fontWeight: 600 }}>Loading your order history...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1c2d27' }}>My Organic Orders</h2>
        <p style={{ color: '#64748b' }}>Track real-time status and delivery details for your purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Package size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>No orders placed yet</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Browse our organic storefront to make your first order.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((ord) => (
            <div key={ord._id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Order ID</span>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#15803d' }}>#{ord._id}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`status-badge ${ord.orderStatus}`}>
                    {ord.orderStatus}
                  </span>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
                {ord.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={item.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100'} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>${(item.quantity * item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Footer info */}
              <div style={{ background: '#fafcfb', padding: '0.9rem 1.2rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                  <Truck size={16} color="#15803d" />
                  <span>Tracking: <strong>{ord.trackingNumber || 'GL-TRK-PENDING'}</strong></span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#15803d' }}>
                  Total Paid: ${(ord.finalTotal || ord.totalAmount).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
