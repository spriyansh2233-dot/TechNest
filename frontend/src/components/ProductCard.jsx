import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';

export default function ProductCard({ 
  prod, 
  qtyInCart, 
  isWishlisted, 
  onCardClick, 
  onAddToCart, 
  onUpdateCartQty, 
  onToggleWishlist,
  onQuickView // New callback prop
}) {
  // Stable ratings generated based on product ID (fallback if database rating is empty)
  const rating = prod.rating ? prod.rating.toFixed(1) : (4.5 + (prod.id % 5) * 0.1).toFixed(1);
  const reviewsCount = 20 + (prod.id % 7) * 47;

  // Extract Short Specs from description
  const parts = prod.description ? prod.description.split(" | Specs: ") : [""];
  const shortSpecs = parts[1] ? parts[1].split(", ").slice(0, 2).join(" • ") : "";

  // Determine dynamic badges based on product properties
  let badge = null;
  let badgeColor = "";
  if (prod.stock > 0 && prod.stock <= 10) {
    badge = "Limited Stock";
    badgeColor = "border-rose-500/30 bg-rose-500/10 text-rose-400";
  } else if (prod.discount > 50) {
    badge = "Trending";
    badgeColor = "border-amber-500/30 bg-amber-500/10 text-amber-400";
  } else if (prod.price > 400) {
    badge = "Editor's Choice";
    badgeColor = "border-[#8A2BE2]/30 bg-[#8A2BE2]/10 text-purple-400 shadow-[0_0_10px_rgba(138,43,226,0.2)]";
  } else if (prod.id % 3 === 0) {
    badge = "Best Seller";
    badgeColor = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  } else {
    badge = "New Arrival";
    badgeColor = "border-blue-500/30 bg-blue-500/10 text-blue-400";
  }

  return (
    <motion.div 
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onCardClick}
      className="glass-card p-6 flex flex-col relative group cursor-pointer overflow-hidden border border-outline-variant/30 hover:border-[#8A2BE2]/50 hover:shadow-[0_0_30px_rgba(138,43,226,0.15)] transition-all duration-300 h-full"
    >
      {/* Glow Ambient Layer */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#8A2BE2]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent z-10 opacity-90 group-hover:opacity-75 transition-opacity pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-20">
        {/* Dynamic Badge */}
        <span className={`inline-block px-2.5 py-1 border rounded-md font-mono-technical text-[9px] uppercase tracking-wider backdrop-blur-md font-semibold ${badgeColor}`}>
          {badge}
        </span>
        
        {/* Wishlist Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(prod); }}
          className={`relative z-30 transition-all duration-300 rounded-full p-2 hover:bg-white/5 active:scale-90 ${isWishlisted ? 'text-error' : 'text-on-surface-variant hover:text-white'}`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={18} className={isWishlisted ? "fill-current text-error" : ""} />
        </button>
      </div>
      
      {/* Product Image and Overlay Actions */}
      <div className="flex-grow flex items-center justify-center mb-6 relative h-48 w-full mix-blend-screen z-0">
        <img 
          src={prod.imageUrl} 
          alt={prod.name} 
          loading="lazy"
          className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 ease-out relative z-10" 
        />
        
        {/* Subtle grounding shadow oval */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-[12px] bg-black/45 blur-[8px] rounded-[50%] z-0 group-hover:scale-x-90 group-hover:opacity-60 transition-all duration-500 pointer-events-none" />
        
        {/* Quick View Button Hover Overlay */}
        {onQuickView && (
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(prod); }}
            className="absolute z-20 p-3 bg-black/60 border border-white/25 rounded-full text-primary hover:text-[#8A2BE2] hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/5 shadow-lg scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md active:scale-95 cursor-pointer"
            title="Quick View Specs"
          >
            <Eye size={16} />
          </button>
        )}

        {prod.discount > 0 && (
          <div className="absolute bottom-0 right-0 bg-error/10 border border-error/20 text-error font-mono-technical text-[10px] px-2 py-1 rounded shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            SAVE ₹{prod.discount.toFixed(2)}
          </div>
        )}
      </div>
      
      <div className="mt-auto relative z-20">
        <span className="block font-mono-technical text-[9px] text-[#8A2BE2] uppercase tracking-wider mb-1 font-semibold">{prod.category}</span>
        <h3 className="font-body-lg text-[15px] font-semibold text-primary mb-1 line-clamp-1 group-hover:text-[#8A2BE2] transition-colors">{prod.name}</h3>
        
        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Star className="text-amber-400 fill-current" size={12} />
          <span className="font-mono-technical text-[10px] text-primary font-bold">{rating}</span>
          <span className="font-mono-technical text-[10px] text-on-surface-variant">({reviewsCount} reviews)</span>
        </div>

        {/* Short Specs */}
        {shortSpecs ? (
          <p className="text-[11px] text-on-surface-variant/80 mb-3.5 line-clamp-1 font-mono-technical">
            {shortSpecs}
          </p>
        ) : (
          <p className="text-[11px] text-on-surface-variant/80 mb-3.5 line-clamp-1 font-mono-technical">
            Premium Hardware • Smart Design
          </p>
        )}

        <div className="flex justify-between items-end mb-4">
          <span className="font-mono-technical text-[18px] text-primary font-bold">
            ₹{prod.discount > 0 ? (prod.price - prod.discount).toFixed(2) : prod.price.toFixed(2)}
          </span>
          {prod.discount > 0 && (
            <span className="font-mono-technical text-[12px] text-on-surface-variant line-through block">
              ₹{prod.price.toFixed(2)}
            </span>
          )}
        </div>
        
        {qtyInCart > 0 ? (
          <div className="w-full flex items-center justify-between bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 rounded-lg p-1.5 backdrop-blur-md">
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateCartQty(prod.id, qtyInCart - 1); }}
              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white/10 rounded-md transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="font-mono-technical text-[14px] text-primary w-8 text-center">{qtyInCart}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateCartQty(prod.id, qtyInCart + 1); }}
              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white/10 rounded-md transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        ) : (
          <button 
            disabled={prod.stock === 0}
            onClick={(e) => { e.stopPropagation(); onAddToCart(prod); }}
            className={`w-full py-3 flex items-center justify-center gap-2 rounded-lg font-label-caps text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(138,43,226,0)] cursor-pointer font-semibold ${
              prod.stock === 0 
                ? 'bg-surface-container-highest text-outline-variant cursor-not-allowed border border-white/5' 
                : 'bg-primary/5 text-primary border border-primary/20 hover:bg-primary hover:text-surface hover:shadow-[0_0_20px_rgba(138,43,226,0.3)]'
            }`}
          >
            <ShoppingCart size={13} />
            <span>{prod.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
