import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';

export default function WishlistPage({ 
  wishlist, 
  toggleWishlist, 
  getProductCartQty, 
  setSelectedProductId, 
  fetchProductDetails,
  addToCart,
  updateCartQty,
  navigate,
  onQuickView
}) {
  return (
    <div className="animate-fadeIn py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-[80vh]">
      <div className="mb-12">
        <h2 className="font-headline-xl text-headline-xl text-primary mb-2">Saved Items</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Products you're keeping an eye on.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-card p-16 text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-outline text-[48px] mb-4" data-icon="heart_broken">heart_broken</span>
          <h3 className="font-headline-lg text-headline-lg text-primary mb-2">Your wishlist is empty</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Explore the catalog and save items you like.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-primary text-surface font-label-caps text-label-caps uppercase rounded-lg hover:bg-primary/80 transition-colors"
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((prod) => {
              const qtyInCart = getProductCartQty(prod.id);
              return (
                <ProductCard 
                  key={`wishlist-${prod.id}`}
                  prod={prod}
                  qtyInCart={qtyInCart}
                  isWishlisted={true}
                  onCardClick={() => { setSelectedProductId(prod.id); fetchProductDetails(prod.id); navigate('/product/' + prod.id); }}
                  onAddToCart={addToCart}
                  onUpdateCartQty={updateCartQty}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={onQuickView}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
