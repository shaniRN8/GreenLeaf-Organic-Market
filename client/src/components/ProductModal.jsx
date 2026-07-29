import React, { useState } from 'react';
import { X, Star, ShieldCheck, MapPin, ShoppingBag, Plus, Minus } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '16px' }}
          />

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
              {product.category}
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.2rem 0 0.5rem 0' }}>{product.name}</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem', fontSize: '0.88rem' }}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <strong style={{ fontWeight: 700 }}>{product.rating}</strong>
              <span style={{ color: '#64748b' }}>({product.reviewsCount} customer reviews)</span>
            </div>

            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d', marginBottom: '0.8rem', fontFamily: 'Outfit' }}>
              ${product.price.toFixed(2)}{' '}
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>/ {product.unit}</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.2rem', lineHeight: 1.5 }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#166534', marginBottom: '1rem' }}>
              <MapPin size={16} />
              <span><strong>Farm Origin:</strong> {product.origin || 'Certified Organic Farm'}</span>
            </div>

            {/* Certifications Badges */}
            {product.certifications && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                {product.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <ShieldCheck size={12} /> {cert}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity Selector & Add Button */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="qty-control" style={{ margin: 0 }}>
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, padding: '0 0.4rem' }}>{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={14} />
                </button>
              </div>

              <button className="btn-primary" onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: '9999px' }}>
                <ShoppingBag size={18} />
                Add to Order (${(product.price * quantity).toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
