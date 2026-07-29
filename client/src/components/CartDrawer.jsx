import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, CheckCircle2, Truck, CreditCard } from 'lucide-react';
import { apiFetch } from '../utils/api';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  user,
  onOpenAuth,
  onOrderSuccess
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMsg, setDiscountMsg] = useState('');
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const [address, setAddress] = useState({
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    zipCode: '97477',
    phone: '+1 (555) 234-5678'
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit Card (**** 4242)');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'ORGANIC10') {
      const discount = subtotal * 0.10;
      setAppliedDiscount(discount);
      setDiscountMsg('🎉 ORGANIC10 Applied! 10% Off');
    } else {
      setDiscountMsg('❌ Invalid Promo Code. Try "ORGANIC10"');
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      onClose();
      onOpenAuth();
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: address,
          paymentMethod,
          discountCode: promoCode
        })
      });

      if (data.success) {
        setOrderComplete(data.order);
        onClearCart();
        if (onOrderSuccess) onOrderSuccess(data.order);
      }
    } catch (err) {
      alert(err.message || 'Failed to complete checkout.');
    } finally {
      setLoading(false);
    }
  };

  const resetStateAndClose = () => {
    setOrderComplete(null);
    setIsCheckoutStep(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={resetStateAndClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <h3 className="drawer-title">
            <Truck size={20} color="#15803d" />
            {orderComplete ? 'Order Confirmed!' : isCheckoutStep ? 'Checkout & Shipping' : 'Your Organic Cart'}
          </h3>
          <button className="close-btn" onClick={resetStateAndClose}>
            <X size={18} />
          </button>
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {orderComplete ? (
          <div className="cart-body" style={{ textAlign: 'center', paddingTop: '2rem' }}>
            <CheckCircle2 size={64} color="#15803d" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d' }}>Thank You for Shopping Organic!</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.5rem 0 1.5rem 0' }}>
              Your order <strong>#{orderComplete._id}</strong> has been received and is being prepared with care.
            </p>

            <div style={{ background: '#f0fdf4', padding: '1.2rem', borderRadius: '14px', border: '1px solid #bbf7d0', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              <div style={{ marginBottom: '0.4rem' }}><strong>Tracking Number:</strong> {orderComplete.trackingNumber}</div>
              <div style={{ marginBottom: '0.4rem' }}><strong>Est. Delivery:</strong> Tomorrow by 10:00 AM</div>
              <div><strong>Delivery Address:</strong> {orderComplete.shippingAddress.street}, {orderComplete.shippingAddress.city}</div>
            </div>

            <button className="checkout-btn" onClick={resetStateAndClose}>
              Continue Shopping
            </button>
          </div>
        ) : isCheckoutStep ? (
          /* CHECKOUT STEP FORM */
          <form onSubmit={handlePlaceOrder} className="cart-body">
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem', color: '#166534' }}>Shipping Address</h4>
              
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem', color: '#166534' }}>Payment Method</h4>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Credit Card (**** 4242)">Credit Card (**** 4242)</option>
                <option value="Digital Wallet / UPI">Digital Wallet / UPI</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.8rem' }}>
              <button
                type="button"
                className="nav-btn"
                onClick={() => setIsCheckoutStep(false)}
                style={{ border: '1px solid var(--color-border)' }}
              >
                Back to Cart
              </button>
              <button type="submit" className="checkout-btn" disabled={loading} style={{ flex: 1, marginTop: 0 }}>
                {loading ? 'Processing Order...' : `Pay $${finalTotal.toFixed(2)}`}
              </button>
            </div>
          </form>
        ) : (
          /* CART ITEMS LIST */
          <>
            <div className="cart-body">
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Your shopping cart is empty</p>
                  <p style={{ fontSize: '0.85rem' }}>Add fresh organic avocados, honey or berries to get started.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id || item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <div className="cart-item-price">${item.price.toFixed(2)} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/ {item.unit}</span></div>
                      
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => onUpdateQty(item._id || item.id, item.quantity - 1)}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => onUpdateQty(item._id || item.id, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item._id || item.id)}
                      style={{ background: 'none', color: '#94a3b8', padding: '0.3rem', alignSelf: 'flex-start' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                {/* Promo Code Input */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Promo code (e.g. ORGANIC10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{ fontSize: '0.82rem', padding: '0.5rem 0.8rem' }}
                  />
                  <button
                    onClick={handleApplyPromo}
                    style={{ background: '#166534', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem' }}
                  >
                    Apply
                  </button>
                </div>
                {discountMsg && (
                  <div style={{ fontSize: '0.78rem', color: appliedDiscount > 0 ? '#15803d' : '#dc2626', marginBottom: '0.8rem', fontWeight: 600 }}>
                    {discountMsg}
                  </div>
                )}

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="summary-row" style={{ color: '#15803d' }}>
                    <span>Promo Discount</span>
                    <span>-${appliedDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Eco-Friendly Delivery</span>
                  <span style={{ color: '#15803d', fontWeight: 700 }}>FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Estimated Total</span>
                  <span style={{ color: '#15803d' }}>${finalTotal.toFixed(2)}</span>
                </div>

                <button className="checkout-btn" onClick={() => setIsCheckoutStep(true)}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
