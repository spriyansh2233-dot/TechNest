import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function ProductDetail({ 
  selectedProduct, 
  setSelectedProduct, 
  similarProducts, 
  freqBought, 
  addToCart, 
  toggleWishlist, 
  wishlist, 
  getProductCartQty, 
  updateCartQty, 
  setSelectedProductId, 
  fetchProductDetails,
  recentlyViewed,
  navigate,
  onQuickView
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const qtyInCart = getProductCartQty(selectedProduct?.id);

  if (!selectedProduct) return null;

  // Create virtual alternate images using CSS filter hue-shifts and styles to mock colorways/angles
  const galleryImages = [
    { url: selectedProduct.imageUrl, style: {}, label: 'Default' },
    { url: selectedProduct.imageUrl, style: { filter: 'hue-rotate(90deg)' }, label: 'Cyber Violet' },
    { url: selectedProduct.imageUrl, style: { filter: 'hue-rotate(240deg)' }, label: 'Neon Cobalt' },
    { url: selectedProduct.imageUrl, style: { filter: 'grayscale(50%) brightness(80%)' }, label: 'Stealth Black' }
  ];

  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 1); // Next day delivery
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="animate-fadeIn pb-24 min-h-[80vh]">
      {/* Product Detail Section */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12 md:py-24">
        <button 
          onClick={() => { setSelectedProduct(null); navigate('/shop'); }}
          className="mb-8 font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full border border-outline-variant/30 w-fit"
        >
          <span className="material-symbols-outlined text-[14px]" data-icon="arrow_back">arrow_back</span>
          <span>Back to Catalog</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <div className="flex flex-col gap-6">
            <div className="glass-card p-12 flex items-center justify-center relative min-h-[350px] md:min-h-[500px] overflow-hidden">
              <img 
                src={galleryImages[activeImageIndex].url} 
                alt={selectedProduct.name} 
                style={galleryImages[activeImageIndex].style}
                className="w-full max-w-sm object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-float mix-blend-screen transition-all duration-500" 
              />
              {selectedProduct.discount > 0 && (
                <div className="absolute top-8 left-8 bg-error/10 border border-error/20 text-error font-mono-technical text-[12px] px-3 py-1 rounded shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  SAVE ₹{selectedProduct.discount.toFixed(2)}
                </div>
              )}
            </div>
            
            {/* Image switcher thumbnail controls */}
            <div className="flex gap-4 justify-center">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 rounded-xl glass-card border p-2 flex items-center justify-center transition-all duration-300 relative overflow-hidden cursor-pointer ${
                    activeImageIndex === index 
                      ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 shadow-[0_0_15px_rgba(138,43,226,0.4)]' 
                      : 'border-white/10 hover:border-[#8A2BE2]/50 hover:bg-white/5'
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={`${selectedProduct.name} thumbnail ${index}`} 
                    style={img.style}
                    className="max-h-full max-w-full object-contain mix-blend-screen"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-mono-technical text-center py-0.5 text-on-surface-variant font-semibold">
                    {img.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded font-mono-technical text-[10px] text-primary uppercase tracking-widest w-fit mb-4">
              {selectedProduct.category}
            </span>
            
            <h2 className="font-display-lg text-[40px] md:text-[56px] text-primary mb-4 leading-tight">{selectedProduct.name}</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-amber-400 text-[14px]">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const ratingVal = selectedProduct.rating ? selectedProduct.rating : (4.5 + (selectedProduct.id % 5) * 0.1);
                  const starIndex = idx + 1;
                  if (ratingVal >= starIndex) {
                    return <span key={idx} className="material-symbols-outlined fill-current" data-icon="star">star</span>;
                  } else if (ratingVal >= starIndex - 0.5) {
                    return <span key={idx} className="material-symbols-outlined fill-current" data-icon="star_half">star_half</span>;
                  } else {
                    return <span key={idx} className="material-symbols-outlined" data-icon="star_outline">star_outline</span>;
                  }
                })}
              </div>
              <span className="font-mono-technical text-[12px] text-on-surface-variant underline decoration-outline-variant/30 underline-offset-4">
                {(selectedProduct.rating ? selectedProduct.rating : (4.5 + (selectedProduct.id % 5) * 0.1)).toFixed(1)} ({20 + (selectedProduct.id % 7) * 47} Reviews)
              </span>
            </div>

            {(() => {
              const parts = selectedProduct.description.split(" | Specs: ");
              const descText = parts[0];
              const specsText = parts[1];
              return (
                <div className="space-y-6 mb-8 max-w-lg">
                  <p className="font-body-lg text-[17px] text-on-surface-variant leading-relaxed">
                    {descText}
                  </p>
                  {specsText && (
                    <div className="space-y-3">
                      <h4 className="font-mono-technical text-[11px] text-[#8A2BE2] uppercase tracking-wider font-semibold">Technical Specifications</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-on-surface-variant bg-white/5 p-4 rounded-xl border border-white/5">
                        {specsText.split(", ").map((spec, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8A2BE2]" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="mb-10 p-6 glass-card border border-primary/20 bg-primary/5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex items-end gap-6 mb-6">
                {selectedProduct.discount > 0 ? (
                  <div className="flex flex-col">
                    <span className="font-mono-technical text-[14px] text-on-surface-variant line-through mb-1 block">₹{selectedProduct.price.toFixed(2)}</span>
                    <span className="font-mono-technical text-[32px] text-primary block leading-none">₹{(selectedProduct.price - selectedProduct.discount).toFixed(2)}</span>
                  </div>
                ) : (
                  <span className="font-mono-technical text-[32px] text-primary block leading-none">₹{selectedProduct.price.toFixed(2)}</span>
                )}
                <span className={`font-label-caps text-[10px] uppercase tracking-widest mb-1 ${selectedProduct.stock > 0 ? 'text-emerald-400' : 'text-error'}`}>
                  {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {selectedProduct.stock > 0 ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {qtyInCart === 0 ? (
                      <button 
                        onClick={() => addToCart(selectedProduct)}
                        className="flex-grow py-4 bg-primary text-surface font-label-caps text-[12px] uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:shadow-[0_0_30px_rgba(138,43,226,0.5)] flex items-center justify-center gap-2 cursor-pointer font-bold"
                      >
                        <span className="material-symbols-outlined text-[18px]" data-icon="shopping_cart">shopping_cart</span>
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <div className="flex-grow flex items-center justify-between bg-surface-container-highest border border-outline-variant/30 rounded-xl p-2 animate-fadeIn">
                        <button 
                          onClick={() => updateCartQty(selectedProduct.id, qtyInCart - 1)}
                          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]" data-icon="remove">remove</span>
                        </button>
                        <span className="font-mono-technical text-[16px] text-primary w-8 text-center">{qtyInCart}</span>
                        <button 
                          onClick={() => updateCartQty(selectedProduct.id, qtyInCart + 1)}
                          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                        </button>
                      </div>
                    )}
                    <button 
                      onClick={() => toggleWishlist(selectedProduct)}
                      className="w-14 h-14 flex items-center justify-center bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error/50 rounded-xl transition-all cursor-pointer"
                    >
                      <span className={`material-symbols-outlined text-[24px] ${wishlist.some(item => item.id === selectedProduct.id) ? "text-error" : ""}`} data-icon="favorite">favorite</span>
                    </button>
                  </div>
                  
                  {/* Delivery Estimation Badge */}
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[12px] font-medium animate-fadeIn">
                    <span className="material-symbols-outlined text-[18px] animate-pulse">local_shipping</span>
                    <span>Free Delivery by <strong className="font-semibold text-primary">{getEstimatedDeliveryDate()}</strong></span>
                  </div>
                </div>
              ) : (
                <button disabled className="w-full py-4 bg-surface-variant text-on-surface-variant border border-outline-variant/30 font-label-caps text-[12px] uppercase tracking-widest rounded-xl cursor-not-allowed">
                  Out of Stock
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-8 mt-8">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]" data-icon="verified">verified</span>
                <div>
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Warranty</span>
                  <span className="block font-body-md text-[14px] text-primary">2 Years Premium</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px]" data-icon="local_shipping">local_shipping</span>
                <div>
                  <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Shipping</span>
                  <span className="block font-body-md text-[14px] text-primary">Next Day Air</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {similarProducts && similarProducts.length > 0 && (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12 border-t border-outline-variant/30">
          <div className="mb-8">
            <h2 className="font-headline-lg text-[24px] text-primary mb-2">Related Products</h2>
            <p className="font-body-md text-[14px] text-on-surface-variant">Customers also viewed these items.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map(prod => {
              const isWishlisted = wishlist.some(item => item.id === prod.id);
              const cardQtyInCart = getProductCartQty(prod.id);
              return (
                <ProductCard 
                  key={`related-${prod.id}`}
                  prod={prod}
                  qtyInCart={cardQtyInCart}
                  isWishlisted={isWishlisted}
                  onCardClick={() => { setSelectedProductId(prod.id); fetchProductDetails(prod.id); navigate('/product/' + prod.id); window.scrollTo(0, 0); }}
                  onAddToCart={addToCart}
                  onUpdateCartQty={updateCartQty}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={onQuickView}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewed && recentlyViewed.length > 0 && (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-12 border-t border-outline-variant/30 mt-12">
          <div className="mb-8">
            <h2 className="font-headline-lg text-[24px] text-primary mb-2">Recently Viewed</h2>
            <p className="font-body-md text-[14px] text-on-surface-variant">Products you looked at recently.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {recentlyViewed.filter(p => p.id !== selectedProduct?.id).slice(0, 5).map(prod => {
              const isWishlisted = wishlist.some(item => item.id === prod.id);
              const cardQtyInCart = getProductCartQty(prod.id);
              return (
                <ProductCard 
                  key={`recent-${prod.id}`}
                  prod={prod}
                  qtyInCart={cardQtyInCart}
                  isWishlisted={isWishlisted}
                  onCardClick={() => { setSelectedProductId(prod.id); fetchProductDetails(prod.id); navigate('/product/' + prod.id); window.scrollTo(0, 0); }}
                  onAddToCart={addToCart}
                  onUpdateCartQty={updateCartQty}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={onQuickView}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
