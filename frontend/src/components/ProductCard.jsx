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
    topBadgeColor = "border-primary/30 bg-primary/10 text-primary";
  } else if (prod.discount > 40) {
    topBadge = "Deal of the Day";
    topBadgeColor = "border-error/30 bg-error/10 text-error";
  } else if (prod.id % 5 === 0) {
    topBadge = "Top Rated";
    topBadgeColor = "border-info/30 bg-info/10 text-info";
  }

  // Stock status badge
  let stockBadge = null;
  if (prod.stock === 0) {
    stockBadge = (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-100 font-mono-technical uppercase tracking-wider">
        Out of Stock
      </span>
    );
  } else if (prod.stock <= 10) {
    stockBadge = (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 font-mono-technical uppercase tracking-wider">
        Only {prod.stock} Left
      </span>
    );
  } else {
    stockBadge = (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 font-mono-technical uppercase tracking-wider">
        In Stock
      </span>
    );
  }

  return (
    <motion.div 
      layout
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onCardClick}
      className="premium-product-card p-5 flex flex-col relative group cursor-pointer overflow-hidden h-full"
    >
      <div className="flex justify-between items-start mb-2 relative z-20">
        <div className="flex flex-col gap-1">
            {topBadge && (
                <span className={`inline-block px-2 py-0.5 border rounded-md font-mono-technical text-[9px] uppercase tracking-wider backdrop-blur-md font-semibold ${topBadgeColor}`}>
                {topBadge}
                </span>
            )}
            {prod.isFreeDelivery && (
                <span className="inline-block px-2 py-0.5 border border-success/30 bg-success/10 text-success rounded-md font-mono-technical text-[9px] uppercase tracking-wider backdrop-blur-md font-semibold">
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
        {/* Soft radial purple spotlight behind the product image */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(109,93,252,0.03)_0%,_transparent_70%)] pointer-events-none z-0 group-hover:scale-110 transition-transform duration-500" />
        
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
        <div className="flex justify-between items-center mb-2">
            <span className="block font-mono-technical text-[9px] text-[#6D5DFC] uppercase tracking-wider font-bold">{prod.brand || prod.category}</span>
            {stockBadge}
        </div>
        
        <h3 className="font-body-lg text-[14px] font-semibold text-slate-800 mb-1.5 line-clamp-2 group-hover:text-[#6D5DFC] transition-colors h-10 leading-5">{prod.name}</h3>
        
        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className={i < Math.floor(prod.rating) ? "fill-current" : "text-slate-200"} />
            ))}
          </div>
          <span className="font-mono-technical text-[10px] text-slate-700 ml-1.5 font-bold">{rating}</span>
          <span className="font-mono-technical text-[10px] text-slate-400">({reviewsCount.toLocaleString()} reviews)</span>
        </div>

        <div className="flex items-end gap-2 mb-3.5">
          <span className="font-mono-technical text-[18px] text-slate-900 font-bold">
            ₹{prod.price?.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          {prod.originalPrice && prod.discount > 0 && (
            <>
              <span className="font-mono-technical text-[12px] text-slate-400 line-through block pb-0.5">
                ₹{prod.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="font-mono-technical text-[10px] text-emerald-600 font-bold pb-0.5">
                {prod.discount}% OFF
              </span>
            </>
          )}
        </div>
        
        {qtyInCart > 0 ? (
          <div className="w-full flex items-center justify-between bg-[#EEF2FF] border border-[#6D5DFC]/20 rounded-lg p-1.5 backdrop-blur-md">
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateCartQty(prod.id, qtyInCart - 1); }}
              className="w-8 h-8 flex items-center justify-center text-[#6D5DFC] hover:bg-white rounded-md transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="font-mono-technical text-[14px] text-[#6D5DFC] w-8 text-center font-bold">{qtyInCart}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateCartQty(prod.id, qtyInCart + 1); }}
              className="w-8 h-8 flex items-center justify-center text-[#6D5DFC] hover:bg-white rounded-md transition-all shadow-sm cursor-pointer"
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
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : 'bg-[#6D5DFC] text-white hover:bg-[#5B4AF5] hover:shadow-[0_4px_12px_rgba(109,93,252,0.3)]'
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
