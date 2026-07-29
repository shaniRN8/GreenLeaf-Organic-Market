import React from 'react';
import { Star, Plus, Eye, Check } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isLowStock = product.stock <= 10;

  return (
    <div className="product-card" onClick={() => onQuickView(product)}>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        
        {product.certifications && product.certifications[0] && (
          <span className="badge-tag">{product.certifications[0]}</span>
        )}

        <button className="quick-view-btn" onClick={(e) => { e.stopPropagation(); onQuickView(product); }} title="Quick View">
          <Eye size={18} />
        </button>
      </div>

      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title" title={product.name}>{product.name}</h3>

        <div className="product-rating">
          <Star size={14} className="star-icon" />
          <span style={{ fontWeight: 700, color: '#1c2d27' }}>{product.rating}</span>
          <span>({product.reviewsCount || 24})</span>
          {isLowStock && (
            <span style={{ marginLeft: 'auto', color: '#dc2626', fontWeight: 700, fontSize: '0.75rem' }}>
              Only {product.stock} left!
            </span>
          )}
        </div>

        <div className="product-footer">
          <div className="product-price-wrap">
            <span className="current-price">${product.price.toFixed(2)}</span>
            <span className="unit-label">per {product.unit}</span>
          </div>

          <button
            className="add-cart-btn"
            onClick={handleAdd}
            style={{ background: added ? '#15803d' : '', color: added ? 'white' : '' }}
          >
            {added ? <Check size={16} /> : <Plus size={16} />}
            <span>{added ? 'Added!' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
