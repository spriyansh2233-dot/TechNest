import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, Info } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  updateCartQty, 
  removeFromCart, 
  subtotal, 
  tax, 
  total, 
  onCheckout 
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Shipping Logic
  const shippingCost = subtotal > 10000 ? 0 : 500;
  
  // Coupon Logic (Hardcoded 10% for TECHNEST10)
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'TECHNEST10') {
      setAppliedCoupon({ code: 'TECHNEST10', discountPct: 10 });
      setCouponError('');
    } else {
      setCouponError('Invalid or expired coupon code.');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const discountAmount = appliedCoupon ? subtotal * (appliedCoupon.discountPct / 100) : 0;
  const finalTotal = subtotal - discountAmount + tax + shippingCost;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-surface border-l border-outline shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline">
              <h2 className="font-headline-lg text-[24px] text-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]" data-icon="shopping_bag">shopping_bag</span>
                Your Cart
              </h2>
              <button 
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary bg-surface-container hover:bg-outline/20 rounded-full p-2 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-outline scrollbar-track-transparent">
              {!cart?.items || cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-surface-container border border-outline flex items-center justify-center mb-6 shadow-sm">
                    <span className="material-symbols-outlined text-[48px] text-primary/40" data-icon="shopping_cart">shopping_cart</span>
                  </div>
                  <h3 className="font-headline-lg text-[20px] text-primary mb-2">Your cart is empty</h3>
                  <p className="font-body-md text-[14px] text-on-surface-variant mb-8 max-w-[250px]">Looks like you haven't added anything to your cart yet.</p>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-primary/10 text-primary border border-primary/20 rounded-xl font-label-caps text-[12px] uppercase tracking-widest hover:bg-primary hover:text-surface transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="flex gap-4 p-4 glass-card border border-outline rounded-xl group relative overflow-hidden bg-surface hover:bg-surface-container transition-colors"
                    >
                      <div className="w-24 h-24 bg-surface rounded-lg p-2 flex-shrink-0 flex items-center justify-center relative">
                        <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full object-contain filter drop-shadow-[0_5px_10px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-body-lg text-[14px] font-semibold text-primary line-clamp-2 pr-4">{item.product.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-on-surface-variant hover:text-error transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <span className="font-mono-technical text-[16px] text-primary block mt-1">
                            ₹{(item.product.discount > 0 ? item.product.price - item.product.discount : item.product.price).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center bg-surface-container border border-outline rounded-lg overflow-hidden">
                            <button 
                              onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-outline/20 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-mono-technical text-[14px] text-primary w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-outline/20 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          {item.product.stock > 0 && item.quantity >= item.product.stock && (
                            <span className="font-label-caps text-[10px] text-error uppercase tracking-widest">Max Stock</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart?.items && cart.items.length > 0 && (
              <div className="p-6 border-t border-outline bg-surface-container backdrop-blur-md">
                
                {/* Coupon Section */}
                <div className="mb-5 border-b border-outline pb-5">
                    {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Tag size={14} className="text-emerald-500" />
                                <span className="font-mono-technical text-[12px] text-emerald-500 font-bold">{appliedCoupon.code} Applied</span>
                            </div>
                            <button onClick={removeCoupon} className="text-error hover:underline text-[11px] font-semibold cursor-pointer">Remove</button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter coupon code" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-grow bg-surface border border-outline px-3 py-2 rounded-lg text-[12px] font-mono-technical outline-none focus:border-primary/50 text-primary"
                                />
                                <button 
                                    onClick={applyCoupon}
                                    className="bg-surface border border-outline hover:border-primary hover:text-primary px-4 rounded-lg text-[11px] font-label-caps uppercase tracking-widest cursor-pointer transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponError && <p className="text-error text-[10px] mt-1 ml-1">{couponError}</p>}
                        </div>
                    )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-body-md text-[14px] text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-mono-technical text-primary">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between font-body-md text-[14px] text-emerald-500">
                      <span>Discount ({appliedCoupon.discountPct}%)</span>
                      <span className="font-mono-technical">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body-md text-[14px] text-on-surface-variant">
                    <span className="flex items-center gap-1">Shipping {shippingCost === 0 && <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded ml-1 font-bold">FREE</span>}</span>
                    <span className="font-mono-technical">{shippingCost === 0 ? '₹0.00' : `₹${shippingCost.toFixed(2)}`}</span>
                  </div>
                  {shippingCost > 0 && (
                      <p className="text-[10px] text-on-surface-variant/70 text-right -mt-2">Free shipping on orders over ₹10,000</p>
                  )}
                  <div className="flex justify-between font-body-md text-[14px] text-on-surface-variant">
                    <span>Tax (8%)</span>
                    <span className="font-mono-technical">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body-lg text-[18px] text-primary pt-3 border-t border-outline font-bold items-center">
                    <span>Total</span>
                    <span className="font-mono-technical text-[22px]">₹{finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 p-2.5 rounded-lg">
                      <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-on-surface-variant leading-tight">By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.</p>
                  </div>
                </div>
                
                <button 
                  onClick={onCheckout}
                  className="w-full py-4 bg-primary text-surface font-label-caps text-[12px] uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
