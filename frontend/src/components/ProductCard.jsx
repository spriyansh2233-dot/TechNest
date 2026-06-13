import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart, Star, CheckCircle, Package } from 'lucide-react';

export default function ProductCard({ 
  prod, 
  qtyInCart, 
  isWishlisted, 
  onCardClick, 
  onAddToCart, 
  onUpdateCartQty, 
  onToggleWishlist,
  onQuickView
}) {
  const rating = prod.rating ? prod.rating.toFixed(1) : "4.5";
  const reviewsCount = prod.reviewCount || 0;

  // Extract Short Specs from description
  const parts = prod.description ? prod.description.split(" | Specs: ") : [""];
  const shortSpecs = parts[1] ? parts[1].split(", ").slice(0, 2).join(" • ") : "";

  // Badges
  let topBadge = null;
  let topBadgeColor = "";
  if (prod.isBestSeller) {
    topBadge = "🔥 Best Seller";
    topBadgeColor = "border-orange-500/30 bg-orange-500/10 text-orange-600";
  } else if (prod.discount > 40) {
    topBadge = "Deal of the Day";
    topBadgeColor = "border-rose-500/30 bg-rose-500/10 text-rose-500";
  } else if (prod.id % 5 === 0) {
    topBadge = "Top Rated";
    topBadgeColor = "border-blue-500/30 bg-blue-500/10 text-blue-600";
  }

  // Stock status
  let stockStatus = null;
  let stockColor = "";
  if (prod.stock === 0) {
    stockStatus = "Out of Stock";
    stockColor = "text-error";
  } else if (prod.stock <= 10) {
    stockStatus = `Only ${prod.stock} Left`;
    stockColor = "text-orange-500";
  } else {
    stockStatus = "In Stock";
    stockColor = "text-emerald-500";
  }

  return (
    <motion.div 
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onCardClick}
      className="glass-card bg-surface p-5 flex flex-col relative group cursor-pointer overflow-hidden border border-outline hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent z-10 opacity-90 group-hover:opacity-75 transition-opacity pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-2 relative z-20">
        <div className="flex flex-col gap-1">
            {topBadge && (
                <span className={`inline-block px-2 py-0.5 border rounded-md font-mono-technical text-[9px] uppercase tracking-wider backdrop-blur-md font-semibold ${topBadgeColor}`}>
                {topBadge}
                </span>
            )}
            {prod.isFreeDelivery && (
                <span className="inline-block px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 rounded-md font-mono-technical text-[9px] uppercase tracking-wider backdrop-blur-md font-semibold">
                🚚 Free Delivery
                </span>
            )}
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(prod); }}
          className={`relative z-30 transition-all duration-300 rounded-full p-2 hover:bg-surface-container active:scale-90 ${isWishlisted ? 'text-error' : 'text-on-surface-variant hover:text-primary'}`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={18} className={isWishlisted ? "fill-current text-error" : ""} />
        </button>
      </div>
      
      <div className="flex-grow flex items-center justify-center mb-4 relative h-44 w-full z-0">
        <img 
          src={prod.imageUrl} 
          alt={prod.name} 
          loading="lazy"
          className="max-h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)] group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 ease-out relative z-10" 
        />
        
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-[12px] bg-black/10 blur-[8px] rounded-[50%] z-0 group-hover:scale-x-90 group-hover:opacity-60 transition-all duration-500 pointer-events-none" />
        
        {onQuickView && (
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickView(prod); }}
            className="absolute z-20 p-3 bg-surface/80 border border-outline rounded-full text-primary hover:text-primary hover:border-primary/50 hover:bg-surface shadow-lg scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md active:scale-95 cursor-pointer"
            title="Quick View Specs"
          >
            <Eye size={16} />
          </button>
        )}
      </div>
      
      <div className="mt-auto relative z-20">
        <div className="flex justify-between items-center mb-1">
            <span className="block font-mono-technical text-[9px] text-primary uppercase tracking-wider font-semibold">{prod.brand || prod.category}</span>
            <span className={`font-mono-technical text-[9px] font-bold ${stockColor} flex items-center gap-1`}>
               {stockStatus}
            </span>
        </div>
        
        <h3 className="font-body-lg text-[14px] font-semibold text-on-surface mb-1 line-clamp-2 group-hover:text-primary transition-colors h-10 leading-5">{prod.name}</h3>
        
        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className={i < Math.floor(prod.rating) ? "fill-current" : "text-outline"} />
            ))}
          </div>
          <span className="font-mono-technical text-[10px] text-on-surface-variant ml-1 font-bold">{rating}</span>
          <span className="font-mono-technical text-[10px] text-on-surface-variant">({reviewsCount.toLocaleString()})</span>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <span className="font-mono-technical text-[18px] text-on-surface font-bold">
            ₹{prod.price?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          {prod.originalPrice && prod.discount > 0 && (
            <>
              <span className="font-mono-technical text-[12px] text-on-surface-variant line-through block pb-0.5">
                ₹{prod.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="font-mono-technical text-[10px] text-emerald-600 font-bold pb-0.5">
                {prod.discount}% OFF
              </span>
            </>
          )}
        </div>
        
        {qtyInCart > 0 ? (
          <div className="w-full flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-1.5 backdrop-blur-md">
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateCartQty(prod.id, qtyInCart - 1); }}
              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface rounded-md transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="font-mono-technical text-[14px] text-primary w-8 text-center font-bold">{qtyInCart}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateCartQty(prod.id, qtyInCart + 1); }}
              className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface rounded-md transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        ) : (
          <button 
            disabled={prod.stock === 0}
            onClick={(e) => { e.stopPropagation(); onAddToCart(prod); }}
            className={`w-full py-2.5 flex items-center justify-center gap-2 rounded-lg font-label-caps text-[11px] uppercase tracking-widest transition-all shadow-sm cursor-pointer font-bold ${
              prod.stock === 0 
                ? 'bg-surface-container text-outline cursor-not-allowed border border-outline' 
                : 'bg-primary/5 text-primary border border-primary/20 hover:bg-primary hover:text-surface hover:shadow-md'
            }`}
          >
            <ShoppingCart size={14} />
            <span>{prod.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
