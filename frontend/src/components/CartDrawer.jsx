import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-surface-container-highest border-l border-outline-variant/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
              <h2 className="font-headline-lg text-[24px] text-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]" data-icon="shopping_bag">shopping_bag</span>
                Your Cart
              </h2>
              <button 
                onClick={onClose}
                className="text-on-surface-variant hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-outline-variant/30 scrollbar-track-transparent">
              {!cart?.items || cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-surface/50 border border-outline-variant/30 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/50" data-icon="shopping_cart">shopping_cart</span>
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
                      className="flex gap-4 p-4 glass-card border border-outline-variant/20 rounded-xl group relative overflow-hidden"
                    >
                      <div className="w-24 h-24 bg-surface rounded-lg p-2 flex-shrink-0 flex items-center justify-center relative mix-blend-screen">
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
                            ${(item.product.discount > 0 ? item.product.price - item.product.discount : item.product.price).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center bg-surface border border-outline-variant/30 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white/5 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-mono-technical text-[14px] text-primary w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white/5 transition-colors"
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
              <div className="p-6 border-t border-outline-variant/30 bg-surface/50 backdrop-blur-md">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-body-md text-[14px] text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-mono-technical">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-[14px] text-on-surface-variant">
                    <span>Tax (8%)</span>
                    <span className="font-mono-technical">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-body-lg text-[18px] text-primary pt-3 border-t border-outline-variant/20 font-bold">
                    <span>Total</span>
                    <span className="font-mono-technical">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={onCheckout}
                  className="w-full py-4 bg-primary text-surface font-label-caps text-[12px] uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_30px_rgba(138,43,226,0.5)] flex items-center justify-center gap-2"
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
