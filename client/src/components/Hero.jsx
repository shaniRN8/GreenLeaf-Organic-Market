import React from 'react';
import { Award, Leaf, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div>
          <div className="hero-tag">
            <Leaf size={16} color="#86efac" />
            <span>100% Certified Organic & Non-GMO</span>
          </div>

          <h1 className="hero-title">
            Pure Organic Living, <span>Direct to Your Table</span>
          </h1>

          <p className="hero-subtitle">
            Hand-picked daily from ethical local farms. Free from synthetic pesticides, artificial additives, and GMOs. Freshness guaranteed in every basket.
          </p>

          <div className="hero-features">
            <div className="hero-feature-item">
              <Truck size={18} color="#86efac" />
              <span>Same-Day Farm Delivery</span>
            </div>
            <div className="hero-feature-item">
              <Award size={18} color="#86efac" />
              <span>USDA Certified</span>
            </div>
            <div className="hero-feature-item">
              <ShieldCheck size={18} color="#86efac" />
              <span>Eco-Friendly Packaging</span>
            </div>
          </div>
        </div>

        {/* Hero Banner Interactive Card Preview */}
        <div className="hero-card-preview">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🥑</span>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Weekly Farm Fresh Basket</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Curated organic seasonal harvests</p>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', padding: '0.8rem', borderRadius: '12px', marginBottom: '1.2rem', fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
            🎉 Use code <strong style={{ color: '#15803d', textDecoration: 'underline' }}>ORGANIC10</strong> for 10% off your order!
          </div>

          <button
            onClick={onExploreClick}
            style={{
              width: '100%',
              background: '#15803d',
              color: 'white',
              padding: '0.8rem',
              borderRadius: '9999px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(21, 128, 61, 0.3)'
            }}
          >
            Explore Organic Catalog <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
