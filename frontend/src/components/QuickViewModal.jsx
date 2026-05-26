import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, ShieldCheck } from 'lucide-react';

export default function QuickViewModal({ 
  isOpen, 
  onClose, 
  product, 
  qtyInCart, 
  isWishlisted, 
  onAddToCart, 
  onUpdateCartQty, 
  onToggleWishlist,
  navigate
}) {
  const [activeThumb, setActiveThumb] = useState(0);

  if (!product) return null;

  const finalPrice = product.discount > 0 ? product.price - product.discount : product.price;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[150]"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            className="relative glass-card border border-white/20 p-6 md:p-8 max-w-4xl w-full z-[151] shadow-[0_0_50px_rgba(138,43,226,0.3)] bg-[#0f0f0f]/95 backdrop-blur-2xl text-left rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 my-auto"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 z-[160]"
            >
              <X size={18} />
            </button>

            {/* Gallery Panel */}
            <div className="flex flex-col gap-4 justify-between h-full">
              <div className="glass-card bg-surface p-8 flex items-center justify-center relative min-h-[300px] md:min-h-[400px] rounded-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="max-h-[250px] md:max-h-[320px] object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] animate-float mix-blend-screen transition-transform duration-300 group-hover:scale-105" 
                />
                
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-error/10 border border-error/20 text-error font-mono-technical text-[10px] px-2 py-1 rounded shadow-[0_0_10px_rgba(239,68,68,0.15)]">
                    SAVE ${product.discount.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 justify-center">
                {[product.imageUrl, product.imageUrl].map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`w-16 h-16 p-2 rounded-lg glass-card border flex items-center justify-center transition-all ${
                      activeThumb === i ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 scale-105' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full object-contain mix-blend-screen" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Panel */}
            <div className="flex flex-col justify-between py-1">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded font-mono-technical text-[9px] text-primary uppercase tracking-widest mb-3">
                  {product.category}
                </span>

                <h2 className="font-display-lg text-[28px] md:text-[34px] text-primary mb-2 leading-tight font-bold">{product.name}</h2>

                {/* Ratings */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex text-amber-400 text-[12px]">
                    <Star className="fill-current" size={14} />
                    <Star className="fill-current" size={14} />
                    <Star className="fill-current" size={14} />
                    <Star className="fill-current" size={14} />
                    <Star className="fill-current opacity-50" size={14} />
                  </div>
                  <span className="font-mono-technical text-[11px] text-on-surface-variant">4.7 (98 reviews)</span>
                </div>

                {(() => {
                  const parts = product.description.split(" | Specs: ");
                  const descText = parts[0];
                  const specsText = parts[1];
                  return (
                    <div className="space-y-4 mb-6">
                      <p className="font-body-md text-[14px] text-on-surface-variant leading-relaxed">
                        {descText}
                      </p>
                      {specsText && (
                        <div className="space-y-2">
                          <h4 className="font-mono-technical text-[10px] text-[#8A2BE2] uppercase tracking-wider font-semibold">Technical Specifications</h4>
                          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-on-surface-variant bg-white/5 p-3 rounded-lg border border-white/5">
                            {specsText.split(", ").map((spec, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-[#8A2BE2]" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Specification Highlights */}
                <div className="space-y-2 border-t border-b border-white/5 py-4 mb-6">
                  <div className="flex justify-between text-[12px]">
                    <span className="text-on-surface-variant/70">Availability</span>
                    <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-400' : 'text-error'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-on-surface-variant/70">Estimated Delivery</span>
                    <span className="text-primary font-semibold">Tomorrow, Express</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-on-surface-variant/70">Warranty</span>
                    <span className="text-primary font-semibold">2-Year Core Warranty</span>
                  </div>
                </div>
              </div>

              <div>
                {/* Price Display */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-mono-technical text-[28px] text-primary font-bold">
                    ${finalPrice.toFixed(2)}
                  </span>
                  {product.discount > 0 && (
                    <span className="font-mono-technical text-[16px] text-on-surface-variant line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Quick Action Buttons */}
                <div className="flex gap-4">
                  {product.stock > 0 ? (
                    qtyInCart === 0 ? (
                      <button 
                        onClick={() => onAddToCart(product)}
                        className="flex-grow py-3.5 bg-primary text-surface font-label-caps text-[11px] uppercase tracking-widest rounded-xl hover:bg-primary/95 shadow-[0_0_15px_rgba(138,43,226,0.3)] hover:shadow-[0_0_20px_rgba(138,43,226,0.5)] flex items-center justify-center gap-2 cursor-pointer font-bold"
                      >
                        <ShoppingCart size={14} />
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex-grow flex items-center justify-between bg-surface border border-outline-variant/30 rounded-xl p-1">
                        <button 
                          onClick={() => onUpdateCartQty(product.id, qtyInCart - 1)}
                          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="font-mono-technical text-[14px] text-primary w-8 text-center">{qtyInCart}</span>
                        <button 
                          onClick={() => onUpdateCartQty(product.id, qtyInCart + 1)}
                          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    )
                  ) : (
                    <button disabled className="flex-grow py-3.5 bg-surface-variant text-on-surface-variant border border-outline-variant/30 font-label-caps text-[11px] uppercase tracking-widest rounded-xl cursor-not-allowed">
                      Out of Stock
                    </button>
                  )}

                  <button 
                    onClick={() => onToggleWishlist(product)}
                    className="w-12 h-12 flex items-center justify-center bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error/50 rounded-xl transition-all cursor-pointer"
                  >
                    <Heart size={18} className={isWishlisted ? "text-error fill-current" : ""} />
                  </button>
                </div>

                {product.stock > 0 && (
                  <button 
                    onClick={() => {
                      onClose();
                      onAddToCart(product);
                      navigate('/shop');
                    }}
                    className="w-full mt-3 py-3 bg-transparent border border-[#8A2BE2]/40 text-[#8A2BE2] hover:bg-[#8A2BE2]/10 font-label-caps text-[11px] uppercase tracking-widest rounded-xl transition-all cursor-pointer font-bold text-center"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
