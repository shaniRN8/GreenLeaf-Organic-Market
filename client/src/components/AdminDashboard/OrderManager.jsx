import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function OrderManager({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/orders');
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const data = await apiFetch(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (data.success) {
        showToast(`🚚 Order status updated to "${newStatus}"!`);
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status.');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading customer orders...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Customer Order Processing</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Fulfill orders, view shipping addresses, and update delivery status.</p>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID & Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord._id}>
                <td>
                  <div style={{ fontWeight: 800, color: '#15803d' }}>#{ord._id}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#0369a1' }}>
                    Trk: {ord.trackingNumber || 'N/A'}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>{ord.customerName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{ord.customerEmail}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    📍 {ord.shippingAddress?.street}, {ord.shippingAddress?.city}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>
                    {ord.items.map((it, i) => (
                      <div key={i}>• {it.quantity}x {it.name}</div>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#15803d' }}>
                    ${(ord.finalTotal || ord.totalAmount).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ord.paymentMethod}</div>
                </td>
                <td>
                  <span className={`status-badge ${ord.orderStatus}`}>
                    {ord.orderStatus}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={ord.orderStatus}
                    onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.3rem 0.5rem', width: 'auto' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
