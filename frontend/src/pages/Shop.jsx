import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';

export default function Shop({ 
  categories, 
  products, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  priceRange, 
  setPriceRange, 
  wishlist, 
  toggleWishlist, 
  getProductCartQty, 
  setSelectedProductId, 
  fetchProductDetails,
  addToCart,
  updateCartQty,
  navigate,
  onQuickView,
  loadingProducts
}) {
  // Category icons for visual pills
  const categoryIcons = {
    'All': 'apps',
    'Audio Gear': 'headphones',
    'Smart Wearables': 'watch',
    'Gaming': 'sports_esports',
    'Smart Devices': 'devices',
    'Accessories': 'keyboard'
  };

  return (
    <div className="animate-fadeIn min-h-[80vh]">
      <section id="catalog" className="pt-28 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto scroll-mt-28">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8A2BE2]/30 bg-[#8A2BE2]/5 mb-4">
              <span className="material-symbols-outlined text-[#8A2BE2] text-[14px]" data-icon="storefront">storefront</span>
              <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest">Shop Collection</span>
            </div>
            <h2 className="font-headline-xl text-headline-xl text-primary mb-2">Our Products</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {selectedCategory !== 'All' 
                ? `Browsing ${selectedCategory}` 
                : searchTerm 
                  ? `Showing results for "${searchTerm}"` 
                  : 'Explore our curated collection of premium tech.'
              }
              {!loadingProducts && (
                <span className="ml-2 text-[#8A2BE2] font-mono-technical text-[11px]">
                  ({products.length} {products.length === 1 ? 'product' : 'products'})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat === 'All' ? 'All' : cat)}
              className={`px-5 py-2.5 rounded-full font-label-caps text-[11px] whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat || (cat === 'All' && selectedCategory === 'All')
                  ? 'bg-primary text-surface shadow-[0_0_15px_rgba(138,43,226,0.3)] scale-[1.02]' 
                  : 'bg-surface-container-highest/60 text-on-surface-variant border border-outline-variant/30 hover:border-primary/50 hover:text-primary hover:bg-[#8A2BE2]/5'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{categoryIcons[cat] || 'category'}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Active Filter Indicator */}
        {(selectedCategory !== 'All' || searchTerm) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8 flex-wrap"
          >
            <span className="font-mono-technical text-[10px] text-on-surface-variant uppercase tracking-wider">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8A2BE2]/10 border border-[#8A2BE2]/25 rounded-full text-[11px] text-primary font-medium">
                {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="hover:text-error transition-colors cursor-pointer ml-1"
                >
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8A2BE2]/10 border border-[#8A2BE2]/25 rounded-full text-[11px] text-primary font-medium">
                "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="hover:text-error transition-colors cursor-pointer ml-1"
                >
                  <span className="material-symbols-outlined text-[12px]">close</span>
                </button>
              </span>
            )}
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setPriceRange(1500); }}
              className="text-[10px] text-on-surface-variant hover:text-error font-label-caps uppercase tracking-widest transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </motion.div>
        )}

        {/* Product Grid */}
        <div>
          <div className="flex-grow">
            {loadingProducts ? (
              <ProductGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-16 text-center flex flex-col items-center max-w-xl mx-auto border border-white/5"
              >
                <span className="material-symbols-outlined text-[#8A2BE2]/40 text-[48px] mb-4" data-icon="search_off">search_off</span>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2">No products found</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  {searchTerm 
                    ? `We couldn't find any products matching "${searchTerm}".` 
                    : 'No products available in this category right now.'}
                </p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setPriceRange(1500); }}
                  className="px-6 py-3 bg-primary text-surface font-label-caps text-[11px] uppercase tracking-widest rounded-xl hover:bg-primary/90 shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all cursor-pointer font-bold"
                >
                  Browse All Products
                </button>
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {products.map((prod, index) => {
                    const isWishlisted = wishlist.some(item => item.id === prod.id);
                    const qtyInCart = getProductCartQty(prod.id);
                    return (
                      <motion.div
                        key={prod.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <ProductCard 
                          prod={prod}
                          qtyInCart={qtyInCart}
                          isWishlisted={isWishlisted}
                          onCardClick={() => { setSelectedProductId(prod.id); fetchProductDetails(prod.id); navigate('/product/' + prod.id); }}
                          onAddToCart={addToCart}
                          onUpdateCartQty={updateCartQty}
                          onToggleWishlist={toggleWishlist}
                          onQuickView={onQuickView}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
