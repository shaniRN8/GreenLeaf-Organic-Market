import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, PackagePlus } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function ProductManager({ products, onRefreshProducts, showToast }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Produce',
    price: '',
    unit: '500g',
    stock: 25,
    image: '',
    description: '',
    origin: 'Local Organic Farm'
  });

  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (data.success) {
        showToast('✨ Product created and published to store!');
        setIsAdding(false);
        setFormData({
          name: '',
          category: 'Produce',
          price: '',
          unit: '500g',
          stock: 25,
          image: '',
          description: '',
          origin: 'Local Organic Farm'
        });
        onRefreshProducts();
      }
    } catch (err) {
      alert(err.message || 'Failed to add product.');
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setEditPrice(p.price);
    setEditStock(p.stock);
  };

  const saveEdit = async (id) => {
    try {
      const data = await apiFetch(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ price: Number(editPrice), stock: Number(editStock) })
      });
      if (data.success) {
        showToast('✅ Product details updated!');
        setEditingId(null);
        onRefreshProducts();
      }
    } catch (err) {
      alert(err.message || 'Failed to update product.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product from catalog?')) return;
    try {
      const data = await apiFetch(`/products/${id}`, { method: 'DELETE' });
      if (data.success) {
        showToast('🗑️ Product deleted from store.');
        onRefreshProducts();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Organic Product Catalog Management</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Add new farm harvests, modify stock quantities, or adjust pricing.</p>
        </div>

        <button className="btn-primary" onClick={() => setIsAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', borderRadius: '9999px', padding: '0.65rem 1.4rem' }}>
          <PackagePlus size={18} /> Add New Organic Product
        </button>
      </div>

      {/* ADD PRODUCT MODAL FORM */}
      {isAdding && (
        <div className="modal-overlay" onClick={() => setIsAdding(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <button className="close-btn" onClick={() => setIsAdding(false)} style={{ position: 'absolute', top: '16px', right: '16px' }}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.2rem' }}>Add New Product</h3>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Organic Honeycrisp Apples"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Produce">Produce</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Superfoods">Superfoods</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="4.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Unit Package</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 500g, 1 Liter, 6 Pack"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Stock Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Fresh organic details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                Publish Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCTS TABLE */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isEditing = editingId === p._id;
              return (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <img src={p.image} alt={p.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Unit: {p.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, background: '#f0fdf4', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                      {p.category}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={{ width: '80px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <strong style={{ color: '#15803d' }}>${p.price.toFixed(2)}</strong>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        style={{ width: '70px', padding: '0.3rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, color: p.stock <= 10 ? '#dc2626' : '#1e293b' }}>
                        {p.stock} units
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {isEditing ? (
                        <button onClick={() => saveEdit(p._id)} style={{ background: '#15803d', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                          <Check size={14} />
                        </button>
                      ) : (
                        <button onClick={() => startEdit(p)} style={{ background: '#f1f5f9', color: '#475569', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                          <Edit2 size={14} />
                        </button>
                      )}

                      <button onClick={() => handleDelete(p._id)} style={{ background: '#fef2f2', color: '#dc2626', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
