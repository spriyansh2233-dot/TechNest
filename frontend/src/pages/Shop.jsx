import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import { Filter, ChevronDown, Check, Star } from 'lucide-react';

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
  // Local Filter States
  const [sortBy, setSortBy] = useState('relevance');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [discountMin, setDiscountMin] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Extract unique brands from current products
  const availableBrands = useMemo(() => {
    const brands = new Set();
    products.forEach(p => { if (p.brand) brands.add(p.brand); });
    return Array.from(brands).sort();
  }, [products]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange(30000);
    setSortBy('relevance');
    setMinRating(0);
    setInStockOnly(false);
    setFreeDeliveryOnly(false);
    setDiscountMin(0);
    setSelectedBrands([]);
  };

  // Compute filtered and sorted products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Frontend Filters
    if (minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= minRating);
    }
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }
    if (freeDeliveryOnly) {
      result = result.filter(p => p.isFreeDelivery);
    }
    if (discountMin > 0) {
      result = result.filter(p => (p.discount || 0) >= discountMin);
    }
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Frontend Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'popularity':
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default: // relevance (backend default order)
        break;
    }

    return result;
  }, [products, sortBy, minRating, inStockOnly, freeDeliveryOnly, discountMin, selectedBrands]);

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0) + (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0) + (freeDeliveryOnly ? 1 : 0) + (discountMin > 0 ? 1 : 0) + selectedBrands.length;

  return (
    <div className="animate-fadeIn min-h-[80vh] bg-surface">
      <section id="catalog" className="pt-28 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto scroll-mt-28">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-outline pb-6">
          <div>
            <h2 className="font-headline-xl text-[28px] text-primary mb-2 font-bold">Marketplace</h2>
            <p className="font-body-md text-on-surface-variant">
              {selectedCategory !== 'All' ? `Explore ${selectedCategory}` : 'Discover our entire collection'}
              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[11px] font-bold">
                {processedProducts.length} items
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group w-full md:w-48">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-surface border border-outline hover:border-primary/50 text-on-surface text-[13px] py-2.5 pl-4 pr-10 rounded-xl cursor-pointer outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-lg text-[16px] text-primary font-bold flex items-center gap-2">
                <Filter size={16} /> Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-surface text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </h3>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-[11px] text-error hover:underline cursor-pointer font-semibold">
                  Clear All
                </button>
              )}
            </div>

            {/* Category */}
            <div className="border-b border-outline pb-5">
              <h4 className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant mb-3 font-semibold">Category</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-[13px] transition-colors cursor-pointer ${selectedCategory === cat ? 'text-primary font-bold' : 'text-on-surface hover:text-primary'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-b border-outline pb-5">
              <h4 className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant mb-3 font-semibold">Price (Max)</h4>
              <input 
                type="range" 
                min="0" 
                max="50000" 
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant mt-2 font-mono-technical">
                <span>₹0</span>
                <span className="text-primary font-bold">₹{priceRange.toLocaleString()}</span>
              </div>
            </div>

            {/* Availability & Delivery */}
            <div className="border-b border-outline pb-5">
              <h4 className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant mb-3 font-semibold">Availability</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${inStockOnly ? 'bg-primary border-primary' : 'border-outline group-hover:border-primary/50'}`}>
                    {inStockOnly && <Check size={12} className="text-surface" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
                  <span className="text-[13px] text-on-surface">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${freeDeliveryOnly ? 'bg-primary border-primary' : 'border-outline group-hover:border-primary/50'}`}>
                    {freeDeliveryOnly && <Check size={12} className="text-surface" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={freeDeliveryOnly} onChange={() => setFreeDeliveryOnly(!freeDeliveryOnly)} />
                  <span className="text-[13px] text-on-surface">Free Delivery</span>
                </label>
              </div>
            </div>

            {/* Rating */}
            <div className="border-b border-outline pb-5">
              <h4 className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant mb-3 font-semibold">Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(stars => (
                  <label key={stars} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="rating" className="hidden" checked={minRating === stars} onChange={() => setMinRating(stars)} />
                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-colors ${minRating === stars ? 'border-primary' : 'border-outline group-hover:border-primary/50'}`}>
                      {minRating === stars && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < stars ? "fill-current" : "text-outline"} />)}
                    </div>
                    <span className="text-[13px] text-on-surface">& Up</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div className="border-b border-outline pb-5">
              <h4 className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant mb-3 font-semibold">Discount</h4>
              <div className="space-y-2">
                {[50, 30, 10].map(pct => (
                  <label key={pct} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="discount" className="hidden" checked={discountMin === pct} onChange={() => setDiscountMin(pct)} />
                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-colors ${discountMin === pct ? 'border-primary' : 'border-outline group-hover:border-primary/50'}`}>
                      {discountMin === pct && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
                    </div>
                    <span className="text-[13px] text-on-surface">{pct}% Off or more</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            {availableBrands.length > 0 && (
              <div className="pb-5">
                <h4 className="font-label-caps text-[11px] uppercase tracking-widest text-on-surface-variant mb-3 font-semibold">Brand</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${selectedBrands.includes(brand) ? 'bg-primary border-primary' : 'border-outline group-hover:border-primary/50'}`}>
                        {selectedBrands.includes(brand) && <Check size={12} className="text-surface" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
                      <span className="text-[13px] text-on-surface truncate">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Product Grid Area */}
          <div className="flex-grow">
            {/* Active Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full text-[11px] text-primary">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="hover:text-error ml-1"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full text-[11px] text-primary">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-error ml-1"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 border border-primary/20 rounded-full text-[11px] text-primary">
                  {minRating}★ & Up
                  <button onClick={() => setMinRating(0)} className="hover:text-error ml-1"><span className="material-symbols-outlined text-[14px]">close</span></button>
                </span>
              )}
            </div>

            {loadingProducts ? (
              <ProductGridSkeleton count={8} />
            ) : processedProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-16 text-center flex flex-col items-center max-w-xl mx-auto border border-outline bg-surface rounded-2xl"
              >
                <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-on-surface-variant/50 text-[36px]" data-icon="search_off">search_off</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-2 font-bold">No products found</h3>
                <p className="font-body-md text-[14px] text-on-surface-variant mb-8 max-w-sm">
                  Try adjusting your filters, trying a different category, or searching for something else.
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-3 bg-primary text-surface font-label-caps text-[11px] uppercase tracking-widest rounded-xl hover:bg-primary/90 shadow-md transition-all cursor-pointer font-bold"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {processedProducts.map((prod, index) => {
                    const isWishlisted = wishlist.some(item => item.id === prod.id);
                    const qtyInCart = getProductCartQty(prod.id);
                    return (
                      <motion.div
                        key={prod.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
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
